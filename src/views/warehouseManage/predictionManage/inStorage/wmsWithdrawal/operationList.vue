<template>
  <!-- 操作履约管理/海外入库/WMS退仓入库 -->
  <WmsWithdrawalOperateList
    pageType="tc_operate"
    :withdrawalTableConfig="{
      filterState: ['0', '1', '11'],
    }"
  />
</template>

<script>
export default {
  name: "WmsWithdrawalOperate",
  components: {
    WmsWithdrawalOperateList: () => import("./components/pageList.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
