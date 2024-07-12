<template>
  <ComForm :formConfig="formConfig" />
</template>

<script>
import { formConfig } from "./model";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    return {
      formConfig: {
        formModel: this.formData,
        size: "small",
        labelWidth: "90px",
        ...formConfig,
        formRules: {},
      },
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.form-class {
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .form-title {
      padding: 0;
      border-left: none;
      margin: 21px 0 10px;
    }
    .form-rows-box {
      padding-bottom: 14px;
      border-bottom: 1px solid #e2e2e2;
    }
  }
}
</style>
