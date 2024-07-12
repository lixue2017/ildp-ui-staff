<template>
  <!-- 订单管理（员工端）/海外订单/第三方入库单（"接单/打回"功能单独页面） -->
  <ThirdPartyOrderReceiving pageType="orderReceiving" :isPerformance="2" />
</template>

<script>
export default {
  name: "WmsReceipt",
  components: {
    ThirdPartyOrderReceiving: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/wmsForecast/components/thirdPartyList.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
