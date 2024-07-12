<template>
  <!-- 订单管理 (员工端) /海外出库/ 一件代发出库 -->
  <platformOrderList :platformConfObj="platformOrderConf" />
</template>

<script>
export default {
  name: "PlatformOrder",
	data() {
		return {
			platformOrderConf: {
				label: "一件代发订单",
				pageType: "webOrderView"
			}
		}
	},
  components: {
    platformOrderList: () =>
      import(
        "./platformList.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>