<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      >
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { config } from "./model";
import { saveOrUpdateTag } from "@/api/clueManage/labelMaintenance.js";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      customDialogConfig: {
        title: "创建分组",
        width: "680px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保 存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {
          type: 1,
        },
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "100px",
        ...config,
      },
    };
  },
  methods: {
    submitFormRequest(formModel) {
      return saveOrUpdateTag(formModel);
    },
    show(row) {
      this.formConfig.formModel = row || { type: 1 };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>
