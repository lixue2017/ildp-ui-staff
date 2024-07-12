<template>
  <div class="container">
    <el-form ref="form" :model="formModel" :rules="formRules">
      <div
        v-for="(list, fieldIndex) in formConfig.lists"
        :key="fieldIndex"
      ></div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    formConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formModel: {},
      formRules: {},
    };
  },
  created() {
    this.formModel = this.getFormModel();
    this.formRules = this.getFormRules();
  },
  mounted() {},
  methods: {
    getFormModel() {
      console.log(this.formConfig);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
