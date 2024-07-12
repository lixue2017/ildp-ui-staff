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
import { config } from "./model";
import {
  payVerifyCheckIn,
  payVerifyBack,
  reciptVerifyCheckIn,
  reciptVerifyBack,
} from "@/api/settlementManage/paymentReceived";
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
        title: "核销",
        width: "392px",
        appendToBody: this.appendToBody,
        dataStatus: 0,
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
              this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "打回",
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 0;
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
        labelWidth: "90px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  created() {},
  methods: {
    submitFormRequest(formModel) {
      console.log("formModel", formModel);
      const { dataStatus } = this.customDialogConfig;
      const type = 0;
      let params = {
        id: 0,
        ...formModel,
      };
      if (dataStatus === 1) {
        if (type === 0) {
          return payVerifyCheckIn(params);
        } else {
          return reciptVerifyCheckIn(params);
        }
      } else {
        if (type === 0) {
          return payVerifyBack(params);
        } else {
          return reciptVerifyBack(params);
        }
      }
    },
    show(params) {
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