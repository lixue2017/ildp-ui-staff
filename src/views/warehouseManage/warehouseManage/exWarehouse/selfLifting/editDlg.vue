<template>
  <ComDialog ref="editDialogRef" :customDialog="editDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
        <!-- <template v-slot:businessType="slotProps">
          <div class="base-flex-align ellipsis-text">
            <TooltipOver
              :content="`${slotProps.formModel.businessSn || '--'}`"
              refName="tooltipOver"
              :style="{ width: 'calc(100% - 170px)', flex: 1 }"
            />
            <span class="tag-blue-color">{{
              slotProps.dicsData.nameCn || "--"
            }}</span>
          </div>
        </template> -->
        <template v-slot:pickupPeople="slotProps">
          <el-input
            :placeholder="slotProps.fieldItem.placeholder"
            v-model="slotProps.formModel.pickupPeople"
          />
        </template>
        <template v-slot:pickupPhone="slotProps">
          <el-input
            :placeholder="slotProps.fieldItem.placeholder"
            v-model="slotProps.formModel.pickupPhone"
          />
        </template>
        <template v-slot:tableData="slotProps">
          <ComTable
            ref="tableRef"
            :columnConfig="tableConfig.columnConfig"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="getTableQueryParams"
          >
          </ComTable>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import {
  POSTDistributionPickupInfoSavePlan,
  POSTDistributionPickupInfoFreightInfo,
  PUTDistributionPickupInfoDeliveryCompleted
} from "@/api/warehouse/manage";
import { editDlgFormCols,EDIT_DLG_TABLE_COLS } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {},
      cancelFooter: [
        {
          text: this.overseaLangObj.qx_cancel("取 消"),
          plain: true,
          handleClick: () => {
            this.$refs.editDialogRef.handleClose();
          },
        },
      ],
      submitFooter: [
        {
          text: this.overseaLangObj.qr_confirm("保 存"),
          type: "primary",
          handleClick: () => {
            this.$refs.dialogFormRef.submitForm();
          },
        },
      ],
      editFormConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.editDlgRequest, // 表单提交接口
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: POSTDistributionPickupInfoFreightInfo,
        columnConfig: EDIT_DLG_TABLE_COLS,
      },
      activeName:1
    };
  },
  methods: {
    async editShow(row = {}, { editSuccess, mode_type = 0, activeName = 1 }) {
      this.activeName=activeName
      const {
        receivingWarehouse = {},
        number,
        attachId,
        markStatus,
        deliveryCode,
        pickupPeople,
        pickupPhone,
        businessSn,
      } = row;
      const { contacts, address } = receivingWarehouse;
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: [
          this.overseaLangObj.yu_yan_lang === "en-us" ? "152px" : "105px",
        ][mode_type],
        formModel: {
          ...row,
          orderId: row.id,
          number,
          status: 6, // 4-待出库 5-运输中  6-已完结
          type: 0, // 0 私人地址  1 FBA仓库  2三方仓库
          pickupPeople,
          pickupPhone,
          address,
          markStatus,
          deliveryCode,
          attachId,
          warehouseId: row.warehouseId,
          businessSn,
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          this.msgSuccess(this.overseaLangObj.cg_tip("保存成功"));
          this.$refs.editDialogRef.hide();
        },
      };
      this.editDialogConfig = {
        useFooter: "footer",
        footer: [...this.submitFooter, ...this.cancelFooter],
        width: "800px",
        title: this.overseaLangObj.zt_hw || "提货",
      };
      const dlgFormConfig = editDlgFormCols({ activeName });
      this.editFormConfig = {
        ...this.editFormConfig,
        formRules: dlgFormConfig.formRules,
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: dlgFormConfig.columns,
                  },
                ],
              },
            ],
          },
        ],
      };
      this.$refs.editDialogRef.show();
    },
    editDlgRequest(formOpt) {
      const {
        carSn,
        expressCompanyName,
        id,
        pickupAddress,
        pickupCode,
        pickupPeople,
        pickupPhone,
        pickupTime,
        predictPickupTime,
        attachId,
        ...obj
      } = formOpt;
      const params = {
        carSn,
        expressCompanyName,
        id,
        pickupAddress,
        pickupCode,
        pickupPeople,
        pickupPhone,
        pickupTime,
        predictPickupTime,
        attachIdList: attachId ? attachId.split(",") : [],
      };
      if(this.activeName==1){
       return POSTDistributionPickupInfoSavePlan(params)
      }else{
        return PUTDistributionPickupInfoDeliveryCompleted(params)
      }
    },
    getTableQueryParams() {
      const {id}=this.editFormConfig.formModel
      return {
        idList: [id],
        pageLocation: this.activeName,
      };
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ComDialog: () => import("_comp/ComDialog"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
</style>
