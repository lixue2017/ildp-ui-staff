<template>
  <div>
    <el-input
      type="textarea"
      show-word-limit
      :maxlength="fieldItem.maxLength || 2000"
      :rows="fieldItem.rows || 3"
      :placeholder="fieldItem.placeholder || '请输入备注'"
      v-model.lazy="fileData.remark"
    ></el-input>
  </div>
</template>

<script>
export default {
  props: {
    fileData: {
      type: Object,
      default: () => ({}),
    },
    fieldItem: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  data() {
    return {};
  },
  created() {
    console.log("fileData", this.fileData);
  },
  methods: {},
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
