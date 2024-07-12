<template>
  <ComDialog
    ref="dialogRef"
    :customDialog="dialogConfig"
    class="water-bill-dialog-box"
  >
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
import { cashierPaymentUploadBankReceipt } from "@/api/settlementManage/paymentReceived.js";
import { waterBillFormConfig } from "./modelProcess";

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
        title: "上传水单",
      },
      editFormConfig: {
        formModel: {},
        isAttachFileId: true,
        // attachFileUrlKey: "imgUrl",
        httpRequest: this.editDlgRequest, // 表单提交接口
        isAttachFileId: true,
        uploadFormConfig: {
          type: "picture-card",
          className: "card-uploader",
          limit: 5,
          accept: ".jpg,.png",
          // url: process.env.VUE_APP_BASE_API + "/crm/info/customerFile",
          // name: "customerFile",
        },
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
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: "100px",
        formModel: {
          ...row,
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          this.msgSuccess("保存成功");
          this.$refs.dialogRef.hide();
        },
      };
      this.editFormConfig = {
        ...this.editFormConfig,
        formRules: waterBillFormConfig().formRules,
        lists: waterBillFormConfig().columns,
      };
      this.$refs.dialogRef.show();
    },
    editDlgRequest(formOpt) {
      const optArr = ["id", "verificationBy", "remark", "attachId"];
      const optObj = optArr.reduce(
        (opt, key) => {
          opt[key] = formOpt[key];
          return opt;
        },
        {
          // attachId: formOpt.attachId.split(",")
        }
      );
      // console.log('formOpt==', formOpt, optObj);
      return cashierPaymentUploadBankReceipt(optObj);
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
.water-bill-dialog-box {
  /deep/ {
    .card-uploader {
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item {
        width: 80px;
        height: 80px;
        line-height: 85px;
        margin: 0 18px 0 0;
      }
    }
  }
}
</style>
