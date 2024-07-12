<template>
  <ComDialog ref="dialogRef" :customDialog="dialogConfig">
    <template v-slot:content>
      <div class="flex-space-between">
        <ComForm
          style="max-width: calc(100% - 310px)"
          ref="dialogFormRef"
          :formConfig="editFormConfig"
          class="dialog-form"
          v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible"
        >
        </ComForm>
        <SurplusAmount :amountData="editFormConfig.formModel" />
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { registerFormConfig } from "./modelProcess";
import { paymentCheck } from "@/api/settlementManage/paymentReceived.js";

export default {
  data() {
    return {
      dialogConfig: {
        useFooter: "footer",
        footer: [
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogFormRef.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.handleClose();
            },
          },
        ],
        width: "1000px",
        title: "付款登记",
      },
      editFormConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.editDlgRequest, // 表单提交接口
        size: "small",
      },
    };
  },
  methods: {
    async editShowDlg(row, { editSuccess }) {
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: "100px",
        formModel: {
          ...row,
          id: [row.id],
          bankReceiptCheckBy: row.uploadBy,
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          this.msgSuccess("保存成功");
          this.$refs.dialogRef.hide();
        },
      };
      this.editFormConfig = {
        ...this.editFormConfig,
        formRules: registerFormConfig().formRules,
        lists: registerFormConfig().columns,
      };
      this.$refs.dialogRef.show();
    },
    editDlgRequest(formOpt) {
      const optArr = ["id", "bankReceiptCheckBy", "remark"];
      const optObj = this.$refs.dialogFormRef.saveFormParams(optArr);
      return paymentCheck(optObj);
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    SurplusAmount: () => import("./amountDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
