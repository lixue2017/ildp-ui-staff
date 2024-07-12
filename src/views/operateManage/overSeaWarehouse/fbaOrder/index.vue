<template>
  <!-- 操作履约/海外出库/FBA订单 -->
  <FbaList :isPerformance="true" pageType="fbaPathOperation" />
</template>

<script>
export default {
  name: "FbaOrder",
  components: {
    FbaList: () =>
      import(
        "@/views/warehouseManage/predictionManage/outStorage/fbaOrder/components/fbaList.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>