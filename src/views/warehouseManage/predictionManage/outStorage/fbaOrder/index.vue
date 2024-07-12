<template>
  <!-- 海外仓/出库预报/FBA订单 -->
  <FbaList pageType="fbaPathWarehouse" />
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