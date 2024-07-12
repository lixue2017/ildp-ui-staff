<template>
  <!-- 仓库管理/入库预报管理/一件代发出库详情 -->
  <WholeSaleWarehouseDetails ref="wholeSaleDetailsRef" viewDetailsSource="webWarehouseOutbound" />
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "WholeSaleDetails",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted'
		}
	},
	methods: {
		mixinInitData() {
			setTimeout(() => {
				// 保存子组件加载完成
				this.$refs.wholeSaleDetailsRef?.getInitData();
			})
		}
	},
  components: {
    WholeSaleWarehouseDetails: () =>
      import(
        "./components/wholeSaleDetails.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
