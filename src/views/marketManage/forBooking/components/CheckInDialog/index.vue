<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="airline-dialog"
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
    <SoNoCheckIn ref="soNoCkInDialog" @close="hide" />
  </div>
</template>


<script>
import { config } from "./model";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    SoNoCheckIn: () => import("../SoNoCheckIn"),
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
        title: "订舱登记",
        width: "506px",
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
            text: "继续登记SoNo",
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
        labelWidth: "100px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
      reqsParams: {},
    };
  },
  created() {
    config.lists[0].fieldList[0].rows[0].cols[0].handle = (e) => {
      console.log("airflightInfo", e);
      this.reqsParams.routeId = e.id;
      this.$refs.dialogForm.setFormModel({
        ...e,
      });
    };
  },
  methods: {
    submitFormRequest(formModel) {
      console.log("formModel", formModel);
      return new Promise((resolve) => {
        resolve();
      });
    },
    show(params, isEdit) {
      const { routeId, code } = params;
      this.reqsParams = params;
      this.isEdit = isEdit;
      config.lists[0].fieldList[0].rows[0].cols[0].getSearchOptions = (e) => {
        if (!e.length) return;
        let list;
        if (routeId) {
          list = e.find((item) => item.id == routeId);
        } else {
          list = e[0];
        }
        this.reqsParams.routeId = list.id;
        this.$refs.dialogForm &&
          this.$refs.dialogForm.setFormModel({
            ...list,
            airFlightInfo: list,
          });
      };
      this.$refs.customDialog.show();
    },
    hide(type) {
      this.$refs.customDialog.hide();
      if (type === "refresh") this.$emit("submitSuccess");
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.$refs.soNoCkInDialog.show(this.reqsParams, this.isEdit);
    },
  },
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
    .el-dialog__body {
      padding: 30px 60px;
    }
  }
}
</style>
