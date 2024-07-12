<template>
  <!-- 订单管理（员工端）/海外订单/WMS退仓入库（"接单/打回"功能单独页面） -->
  <WmsWithdrawalOrderList pageType="tc_order" />
</template>

<script>
export default {
  name: "WmsWithdrawalOrder",
  components: {
    WmsWithdrawalOrderList: () => import("./components/pageList.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
