<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="audit-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
        >
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>


<script>
import { waterBillExamine } from "@/api/settlementManage/paymentReceived";
import { config } from "./model";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "审核",
        width: "392px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "85px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  created() {},
  methods: {
    submitFormRequest(formModel) {
      var params = {
        auditRemark: formModel.remark, //备注说明
      };
      waterBillExamine(formModel.status, formModel.id, params).then((res) => {
        this.hide();
        this.$emit("handleSuccess");
      });
      // console.log("formModel", formModel);
      // return new Promise((resolve) => {
      //   resolve();
      // });
    },
    show(params, type) {
      this.formConfig.formModel = params;
      this.$refs.customDialog.show();
    },
    hide(type) {
      this.$refs.customDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.audit-dialog {
  /deep/ {
    .el-dialog__body {
      padding: 30px 40px 10px 40px;
    }
  }
}
</style>
