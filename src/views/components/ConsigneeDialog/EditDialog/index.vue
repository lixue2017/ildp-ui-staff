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
import {
  updateConsignee,
  getConsigneeDetail,
  maintainConsignee,
} from "@/api/basicInfo/consignee.js";
import { config } from "../AddDialog/model";

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
      customDialogConfig: {
        title: "提货地址信息",
        width: "750px",
        dataStatus: 0,
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
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
        size: "small",
        labelWidth: "100px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const params = { ...formModel };
      if (formModel.country && typeof formModel.country !== "string") {
        params.countryId = formModel.country.id;
        params.nation = formModel.country.label;
      }
      params.isDefault = !params.status ? 0 : formModel.isDefault ? 1 : 0;
      delete params.code;
      delete params.country;
      return updateConsignee(params);
    },
    show({ id }, isGetNew = true) {
      // isGetNew是否获取最新
      if (isGetNew) {
        return getConsigneeDetail(id).then((res) => {
          const data = res.data || {};
          this.formConfig.formModel = {
            ...(data || {}),
            country: data.nation && data.nation,
            isDefault: data.isDefault ? true : false,
          };
          this.$refs.customDialog.show();
        });
      } else {
        return maintainConsignee(id).then((res) => {
          const data = res.data || {};
          this.formConfig.formModel = {
            ...(data || {}),
            country: data.nation && data.nation,
            isDefault: data.isDefault ? true : false,
          };
          this.$refs.customDialog.show();
        });
      }
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess(res) {
      this.$emit("handleSuccess", res);
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../index.scss";
</style>
