<template>
  <div>
    <ComForm ref="formRef" class="order-form" :formConfig="searchTabForm()">
    </ComForm>
  </div>
</template>

<script>
import { config } from "./model.js";
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
      searchFormConfig: {
        formModel: {},
        size: "small",
        labelWidth: "95px",
        formRules: {}, // 表单校验规则
      },
    };
  },
  methods: {
    searchTabForm() {
      const {
        overseaBusinessTypes = [],
        overallStatus,
        menuType,
      } = this.formData;
      const [_, type] = overseaBusinessTypes;
      return {
        ...this.searchFormConfig,
        lists: config(type, menuType === "order" && overallStatus === 3).lists,
        formModel: this.formData,
      };
    },
    getRefFormParams() {
      // 订单获取业务备注值
      return this.$refs.formRef?.getFormParams() || {};
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.form-rows-box {
  margin-top: 14px;
}
</style>
