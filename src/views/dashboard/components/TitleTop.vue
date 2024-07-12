<template>
  <div class="chart_top">
    <div class="title">{{ title }}</div>
    <slot name="right" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.chart_top {
  height: 44px;
  display: flex;
  align-items: center;
  padding-top: 6px;
  border-bottom: 1px solid #e2e2e2;

  .title {
    min-width: 150px;
    flex: 1;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>