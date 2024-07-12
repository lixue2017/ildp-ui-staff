<template>
  <!-- 操作履约管理-海外入库订单-第三方入库单 -->
  <ThirdPartyOrderReceiving pageType="operationReceiving" :isPerformance="1" />
</template>

<script>
export default {
  name: "ThirdPartyForecast",
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
