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
import { distributionFormConfig } from "./modelProcess";
import { postExpenseDistribution } from "@/api/settlementManage/paymentReceived.js";

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
        title: "分配付款人",
      },
      editFormConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.editDlgRequest, // 表单提交接口
      },
    };
  },
  methods: {
    async editShowDlg(
      row,
      {
        editSuccess,
        // mode_type = 0
      }
    ) {
      // console.log('row==', row)
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: "100px",
        formModel: {
          ...row,
          // attachId: "269"
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          this.msgSuccess("保存成功");
          this.$refs.dialogRef.hide();
        },
      };
      this.editFormConfig = {
        ...this.editFormConfig,
        formRules: distributionFormConfig().formRules,
        lists: distributionFormConfig().columns,
      };
      this.$refs.dialogRef.show();
    },
    editDlgRequest(formOpt) {
      const optArr = [
        "id",
        "latestPaymentDate",
        "cashier",
        "uploadBy",
        "verificationBy",
        "remark",
      ];
      const optObj = optArr.reduce((opt, key) => {
        opt[key] = formOpt[key];
        return opt;
      }, {});
      // console.log('formOpt==', formOpt, optObj);
      return postExpenseDistribution(optObj);
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    SurplusAmount: () => import("./amountDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// @import "~@/assets/styles/variables.scss";
</style>
