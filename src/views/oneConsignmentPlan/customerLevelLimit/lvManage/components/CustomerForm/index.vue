<template>
  <div>
    <ComForm ref="searchTabForm" :formConfig="formConfig" />
  </div>
</template>

<script>
import { formConfig } from "./model.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    activeTab: {
      type: String,
      required: true,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    const { lists, formRules } = formConfig({ activeTab: this.activeTab });
    return {
      formConfig: {
        formModel: this.formData, // 表单数据
        httpRequest: this.handleRequest,
        size: "small",
        labelWidth: "110px",
        lists,
        formRules,
      },
    };
  },
  methods: {
    handleSummit() {
      this.$refs.searchTabForm.submitForm();
    },
    handleRequest(formData) {
      return new Promise((resolve, reject) => {
        this.$emit("getFormData", formData);
        resolve();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
