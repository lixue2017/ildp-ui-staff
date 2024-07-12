<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      />
    </template>
  </ComDialog>
</template>

<script>
import { mapState } from "vuex";
import { addConsignee } from "@/api/basicInfo/consignee.js";
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
    extendParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      customDialogConfig: {
        title: "提货地址信息",
        width: "750px",
        dataStatus: 0,
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "暂存",
            type: "primary",
            hide: this.appendToBody,
            handleClick: () => {
              this.customDialogConfig.dataStatus = 0;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "保存并启用",
            type: "primary",
            handleClick: () => {
              this.customDialogConfig.dataStatus = 1;
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "100px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const params = { ...formModel, ...this.extendParams };
      if (formModel.country) {
        params.countryId = formModel.country.id;
        params.nation = formModel.country.label;
        delete params.country;
      }
      params.status = this.customDialogConfig.dataStatus;
      params.isDefault = formModel.isDefault ? 1 : 0;
      delete params.code;
      if (params.status === 0) params.isDefault = 0;
      return addConsignee(params);
    },
    show() {
      this.formConfig.formModel = {
        addresName: this.cShortName,
        isDefault: false,
      };
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
  computed: {
    ...mapState({
      cShortName: (state) => state.user.userInfo?.customerInfoShortName,
    }),
  },
};
</script>
<style lang="scss" scoped>
@import "../index.scss";
</style>
