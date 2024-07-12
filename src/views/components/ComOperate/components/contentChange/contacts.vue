<template>
  <div>
    <ComDialog
      ref="dialogRef"
      :customDialog="dialogConfig"
      :confirmClose="false"
      :dialogBoxCenter="true"
    >
      <template v-slot:content>
        <ComForm
          class="contacts-form-box"
          v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible"
          ref="formRef"
          :formConfig="contactsFormConfig"
        >
          <template
            v-for="(sItem, sIdx) in slotArr"
            v-slot:[sItem.slotKey]="{ formModel }"
          >
            <div class="base-flex-align" :key="`c_${sIdx}`">
              <i class="el-icon-location-outline"></i>
              {{
                formModel[sItem.relationKey] &&
                formModel[sItem.relationKey].cusContacts
                  ? formModel[sItem.relationKey].cusContacts.address
                  : "--"
              }}
            </div>
          </template>

          <template
            v-for="(vItem, vIdx) in slotCustomsArr"
            v-slot:[vItem.slotKey]="{ formModel, fieldItem }"
          >
            <AutoComplete
              :key="`v_${vIdx}`"
              :ref="`${vItem.relationKey}Ref`"
              v-if="isChangeConsignee"
              :formModel="formModel"
              :fieldItem="{
                ...fieldItem,
                multiple: true,
								showCreate: true,
                disabled: !(formModel.consigneeObj || {}).id,
                handleCreate: () =>
                  handleCustomsCreate(
                    vItem.relationKey,
                    formModel.consigneeObj
                  ),
              }"
              :additionalParam="{
                cusContactsId: (formModel.consigneeObj || {}).id,
              }"
            />
          </template>
          <template v-slot:shipperObj="slotProps">
            <AutoComplete
              ref="shipperObjRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                showCreate: true,
                handleCreate: () =>
                  handleAddContacts({
                    contactsType: 1,
                    customerId: slotProps.formModel.customerId,
                    id: 'shipperObj',
                  }),
              }"
            />
          </template>
          <template v-slot:consigneeObj="slotProps">
            <AutoComplete
              ref="consigneeObjRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                showCreate: true,
                handleCreate: () =>
                  handleAddContacts({
                    contactsType: 0,
                    customerId: slotProps.formModel.customerId,
                    id: 'consigneeObj',
                  }),
              }"
            />
          </template>
          <template v-slot:notifierObj="slotProps">
            <AutoComplete
              ref="notifierObjRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                showCreate: true,
                handleCreate: () =>
                  handleAddContacts({
                    contactsType: 0,
                    customerId: slotProps.formModel.customerId,
                    id: 'notifierObj',
                  }),
              }"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>

    <ComCustomDialog ref="customDialogRef" />
    <AddContactsDialog
      appendToBody
      ref="addContacts"
      @handleSuccess="handleSuccess"
    />
  </div>
</template>
<script>
import {
  getOperationContactsInfo,
  putOperationContacts,
} from "@/api/operateManage/common";
import { addContactsCustomsClearance } from "@/api/customerManage/customerList.js";
import {
  contactsFormCols,
  contactsFormRules,
  customsClearanceMeansCols,
} from "./model.js";

export default {
  props: {},
  data() {
    return {
      dialogConfig: {
        appendToBody: true,
        width: "700px",
        title: "收发通修改",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.formRef.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.hide();
            },
          },
        ],
      },
      contactsFormConfig: {
        formModel: {},
        labelWidth: "112px",
      },
      slotArr: [
        {
          slotKey: "shipperSlot",
          relationKey: "shipperObj",
        },
        {
          slotKey: "consigneeSlot",
          relationKey: "consigneeObj",
        },
      ],
      slotCustomsArr: [
        {
          slotKey: "vatClearanceList",
          relationKey: "vat",
        },
        {
          slotKey: "eoriClearanceList",
          relationKey: "eori",
        },
        {
          slotKey: "bondClearanceList",
          relationKey: "poa",
        },
        {
          slotKey: "customsClearanceList",
          relationKey: "vep",
        },
      ],
      isChangeConsignee: true,
      addContactId:''
    };
  },
  methods: {
    async show(oId, obj) {
      const { orderType,isStaff=undefined,httpRequest=putOperationContacts, successFunction = () => {} } = obj || {};
      const res = await this.comRepeatedRequest(
        this,
        getOperationContactsInfo,
        { oId }
      );
      const {
        cusContactsMainId,
        consignerId,
        consignerAddr,
        consigneeId,
        consigneeAddr,
        notifierId,
        notifierAddr,
        customerId,
        routeCode,
        ...resData
      } = res.data || {};
      const isVatEori = [8, 9, "8", "9"].includes(routeCode); // 8、9 - 欧盟显示VAT与EORI
      this.contactsFormConfig = {
        ...this.contactsFormConfig,
        formModel: {
          ...resData,
          vatClearanceList: (resData.vatClearanceList || []).map((e) => e.id),
          eoriClearanceList: (resData.eoriClearanceList || []).map((e) => e.id),
          bondClearanceList: (resData.bondClearanceList || []).map((e) => e.id),
          customsClearanceList: (resData.customsClearanceList || []).map(
            (e) => e.id
          ),
          shipperObj: {
            value: consignerId,
            cusContacts: {
              address: consignerAddr,
            },
          },
          consigneeObj: {
            value: consigneeId,
            id: cusContactsMainId,
            cusContacts: {
              address: consigneeAddr,
            },
          },
          notifierObj: {
            value: notifierId,
            cusContacts: {
              address: notifierAddr,
            },
          },
          customerId,
          cusContactsMainId
        },
        lists: contactsFormCols({
          customerId,
          isVatEori,
          orderType,
          handleConsignee: () => {
            this.$refs.vatRef && this.$refs.vatRef[0]?.changeFocusRequest();
            this.$refs.eoriRef && this.$refs.eoriRef[0]?.changeFocusRequest();
            this.$refs.poaRef && this.$refs.poaRef[0]?.changeFocusRequest();
            this.$refs.vepRef && this.$refs.vepRef[0]?.changeFocusRequest();
            this.isChangeConsignee = false;
            this.$nextTick(() => {
              this.isChangeConsignee = true;
            });
          },
        }),
        formRules: contactsFormRules({ orderType }),
        httpRequest: (fData) => {
          const {
            operationOrderId,
            shipperObj,
            consigneeObj,
            notifierObj,
            vatClearanceList,
            eoriClearanceList,
            bondClearanceList,
            customsClearanceList,
          } = fData;
          let customsClearanceIds = bondClearanceList || [];
          if (orderType === 2) {
            if (isVatEori) {
              customsClearanceIds = (vatClearanceList || []).concat(
                eoriClearanceList || []
              );
            }
          } else {
            customsClearanceIds = customsClearanceList || [];
          }
          return httpRequest({
            operationOrderId,
            customsClearanceId: customsClearanceIds.join(","),
            consignerId: shipperObj.value,
            consigneeId: consigneeObj.value,
            notifierId: notifierObj?.value,
            isStaff
          });
        },
        successFunction,
      };
      this.$refs.dialogRef.show();
    },
    handleCustomsCreate(str, consigneeObj) {
      let hideList = [];
      if (str === "vat") {
        hideList = [2, 3, 4];
      }
      if (str === "eori") {
        hideList = [1, 3, 4];
      }
      if (str === "poa") {
        hideList = [1, 2];
      }
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: customsClearanceMeansCols({ hideList }),
        formModel: {
          cusContactsId: consigneeObj.id,
        },
        httpRequest: addContactsCustomsClearance,
        successFunction: (res) => {
          this.$refs[`${str}Ref`] &&
            this.$refs[`${str}Ref`][0]?.querySearchAsync("", {
              addSelectVal: res?.data ? [res.data] : undefined,
            });
        },
      });
    },
    handleSuccess(row) {
      console.log('row',row)
      const { id,cusContactsId, cusContacts, company } = row;
      const selectLabelKey = {
        shipperObj: "consignerName",
        consigneeObj: "consigneeName",
        notifierObj: "notifierName",
      }[this.addContactId];
      this.$refs[`${this.addContactId}Ref`]?.changeFocusRequest();
      this.$refs.formRef?.setFormModel({
        [this.addContactId]: {
          id: selectLabelKey == "consigneeName" ? id : undefined,
          value: cusContactsId,
          cusContacts: {
            address: cusContacts?.address,
          },
        },
        [selectLabelKey]: company,
      });
    },
    handleAddContacts(row={}){
      const { id , contactsType , customerId} = row
      this.addContactId = id
      this.$refs.addContacts?.show({ contactsType: contactsType, customerId });
    }
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AddContactsDialog: () => import("_comp/ContactsDialog/AddDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.contacts-form-box {
  .el-icon-location-outline {
    color: #8b8b8b;
    font-size: 16px;
    margin-right: 8px;
  }
}
</style>
