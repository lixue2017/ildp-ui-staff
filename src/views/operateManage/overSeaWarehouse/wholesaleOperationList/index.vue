<template>
  <!-- 操作履约管理 /海外出库/ 一件代发出库 -->
  <platformOperationList :platformConfObj="platformOperationConf" />
</template>

<script>
export default {
  name: "PlatformOrder",
	data() {
		return {
			platformOperationConf: {
				label: "一件代发操作单",
				pageType: "webOperationView"
			}
		}
	},
  components: {
    platformOperationList: () =>
      import(
        "@/views/newOrderManage/overSea/platformOrder/platformList.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>