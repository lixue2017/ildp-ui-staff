<template>
  <!-- 仓库管理/入库预报管理/第三方入库预报 -->
  <ThirdPartyOrderReceiving pageType="warehouseReceiving" :isWms="true" />
</template>

<script>
export default {
  name: "WmsForecast",
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
