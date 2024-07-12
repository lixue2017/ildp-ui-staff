<template>
  <div class="moduls-title">
    <span class="line"></span>
    <span class="title">{{ title }}</span>
    <slot name="others" />
  </div>
</template>

<script>
export default {
  name: "ModulsTitle",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.moduls-title {
  display: flex;
  justify-content: flex-start;
  .line {
    width: 2px;
    height: 16px;
    background: $light-blue;
  }
  .title {
    font-weight: 600;
    color: #1f1f1f;
    margin-left: 10px;
  }
}
</style>
