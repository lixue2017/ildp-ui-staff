<template>
  <!-- 操作履约/海外出库/FBA出库详情 -->
  <FBAWarehouseDetails ref="fbaDetailsRef" viewDetailsSource="webOperationOutbound" />
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "FbaOperationDetails",
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
				this.$refs.fbaDetailsRef?.getInitData();
			})
		}
	},
  components: {
    FBAWarehouseDetails: () =>
      import(
        "./components/fbaDetails.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
