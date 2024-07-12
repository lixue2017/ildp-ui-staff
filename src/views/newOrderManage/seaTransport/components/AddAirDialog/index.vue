<template>
  <ComDialog
    class="order-dialog"
    ref="customDialog"
    :customDialog="customDialogConfig"
  >
    <template v-slot:content>
      <ComForm
        :formConfig="{
          ...formConfig,
          ...formConfigModel(
            formConfig.formModel.transportMode,
            tradeClauseShow[formConfig.formModel.transportMode]
          ),
        }"
        ref="dialogForm"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        @handleChange="handleChange"
      >
        <template v-slot:shipperId="slotProps">
          <SelectContacts
            ref="shipperSelect"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              contactsType: 1,
              type: 'contacts',
            }"
            fieldName="shipper"
            :userCustomerId="slotProps.formModel.customerId || undefined"
            @handleSelect="
              (item) => handleContactsSelect(item, slotProps.fieldItem.id)
            "
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'notifierSelect')
            "
          />
        </template>
        <template v-slot:consigneeId="slotProps">
          <SelectContacts
            ref="consigneeSelect"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              contactsType: 0,
              type: 'contacts',
            }"
            fieldName="consignee"
            :userCustomerId="slotProps.formModel.customerId || undefined"
            @handleSelect="
              (item) => handleContactsSelect(item, slotProps.fieldItem.id)
            "
            @handleSuccess="
              (data) => handleCreateSuccess(data, 'notifierSelect')
            "
          />
        </template>
        <template v-slot:notifierId="slotProps">
          <SelectContacts
            ref="notifierSelect"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              type: 'contacts',
              isCusDefault: false,
            }"
            fieldName="notifier"
            :userCustomerId="slotProps.formModel.customerId || undefined"
            @handleSelect="
              (item) => handleContactsSelect(item, slotProps.fieldItem.id)
            "
            @handleSuccess="handleCreateSuccess"
          />
        </template>
        <template v-slot:insuranceAmount="slotProps">
          <div class="flex input-slot">
            <el-input
              v-model="slotProps.formModel.insuranceAmount"
              type="number"
              class="input-slot-left figure-type"
            />
            <el-select
              slot="append"
              v-model="slotProps.formModel.insuranceAmountCurrency"
              class="input-slot-center"
            >
              <el-option
                v-for="selectItem in slotProps.formModel.unitList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { config } from "./model";
import { addTradition } from "@/api/trandition/seaAirTransport";
import { mapGetters } from "vuex";
export default {
  props: {},
  components: {
    ComForm: () => import("_comp/ComForm"),
    SelectContacts: () => import("_comp/SelectContacts"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "空运订单",
        width: "1335px",
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "补充货物信息",
            type: "primary",
            handleClick: this.handleSubmit,
          },
        ],
      },
      formConfig: {
        formModel: {
          transportMode: "3",
        },
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "76px",
      },
      formConfigModel: config,
      tradeClauseShow: {},
    };
  },
  computed: {
    ...mapGetters(["dictData"]),
  },
  methods: {
    addCustomer(form) {
      console.log(form);
      console.log("form", form);
      this.formConfig.formModel = form;
      const cusShipper = this.$refs.shipperSelect.getData() || {};
      const cusConsignee = this.$refs.consigneeSelect.getData() || {};
      const cusNotifier = this.$refs.notifierSelect.getData() || {};
      const params = {
        ...form,
        shipperId: cusShipper.cusContactsId,
        consigneeId: cusConsignee.cusContactsId,
        notifierId: (form.notifierId && cusNotifier.cusContactsId) || null,
        orderType: "4", //这个字段不在页面上显示，但是3是海运订单，4是空运订单
        orderStatus: "0",
        isForecast: "0",
        insured: !!form.insured,
      };
      delete params.unitList;
      return addTradition(params).then((res) => {
        this.addReturnId = res.data;
        return res;
      });
    },
    show() {
      this.formConfig.formModel = {
        transportMode: "3",
      };
      if (
        !Object.keys(this.tradeClauseShow).length &&
        this.dictData.transportMode
      ) {
        this.dictData.transportMode.forEach((item) => {
          this.tradeClauseShow[item.value] = (item.expandVal || "").split(",");
        });
      }
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.hide();
      const { path } = this.$route;
      this.$router.push({
        path: "/newOrderManage/editAirTransport",
        query: {
          id: this.addReturnId,
          backPath: path,
        },
      });
    },
    handleSubmit() {
      this.$refs.dialogForm.submitForm();
    },
    handleChange(v, k) {
      if (k === "transportMode") {
        this.formConfig.formModel.transportMode = v;
        this.$refs.dialogForm.setFormModel({
          tradeClause: "",
        });
        this.$nextTick(() => {
          this.$refs.dialogForm?.renewForm();
        });
      } else if (k === "customerId") {
        this.$refs.dialogForm.setFormModel({
          shipperId: "",
          consigneeId: "",
          notifierId: "",
        });
      }
    },
    handleContactsSelect(item, key) {
      this.$refs.dialogForm.setFormModel({
        [key]: item.label,
      });
    },
    handleCreateSuccess(data, refName) {
      //当通知人与收货人或发货人一致时，修改其中一个会连通知人一起修改
      if (!refName) {
        refName = !data.contactsType ? "consigneeSelect" : "shipperSelect";
      }
      const cusNotifier = this.$refs[refName].getData() || {};
      if (data.id && cusNotifier.id === data.id) {
        this.$set(this.$refs[refName].contactsData, "id", data.company);
        setTimeout(() => {
          this.$refs[refName].handleSelect(data);
        }, 500);
      }
      this.$refs[refName].$refs &&
        this.$refs[refName].$refs.autoComplete &&
        this.$refs[refName].$refs.autoComplete.querySearchAsync();
    },
  },
};
</script>

<style lang="scss" scoped>
.order-dialog {
  /deep/ {
    .el-dialog__body {
      padding: 30px;
    }
    .form-class .custom-remark .el-form-item .el-form-item__label {
      margin: 0;
    }
  }
}
</style>
