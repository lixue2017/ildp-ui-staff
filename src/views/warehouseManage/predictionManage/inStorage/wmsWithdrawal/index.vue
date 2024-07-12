<template>
  <!-- 海外仓/WMS退仓 -->
  <WmsWithdrawalWarehouseList pageType="tc_warehouse" />
</template>

<script>
export default {
  name: "WmsWithdrawal",
  components: {
    WmsWithdrawalWarehouseList: () => import("./components/pageList.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
