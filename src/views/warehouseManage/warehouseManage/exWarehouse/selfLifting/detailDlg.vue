<template>
  <ComDialog ref="editDialogRef" :customDialog="editDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
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
  POSTDistributionPickupInfoFreightInfo,
} from "@/api/warehouse/manage";
import { EDIT_DLG_TABLE_COLS,DETAILS_DLG_FORM_COLS } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {
        useFooter: "footer",
        footer: [
          {
          text: this.overseaLangObj.qx_cancel("取 消"),
          plain: true,
          handleClick: () => {
            this.$refs.editDialogRef.handleClose();
          },
        }
      ],
        width: "800px",
        title: this.overseaLangObj.zt_hw || "提货",
      },
      editFormConfig: {
        formModel: {},
        isAttachFileId: true,
        labelWidth:'110px'
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: POSTDistributionPickupInfoFreightInfo,
        columnConfig: EDIT_DLG_TABLE_COLS,
      },
    };
  },
  methods: {
    show(row={}){
      this.editFormConfig = {
        ...this.editFormConfig,
        formModel:{
          ...row,
        },
        lists:DETAILS_DLG_FORM_COLS()
      };
      this.$refs.editDialogRef.show();
    },
    getTableQueryParams() {
      const {id}=this.editFormConfig.formModel
      return {
        idList: [id],
        pageLocation: 2,
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
