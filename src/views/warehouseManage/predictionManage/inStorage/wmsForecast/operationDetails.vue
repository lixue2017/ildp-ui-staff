<template>
  <!-- 操作履约管理-海外入库订单-第三方入库单详情 -->
  <ThirdPartyWarehouseDetails ref="detailsRef" viewDetailsSource="operationReceiving" />
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "OperationThirdParty",
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
				this.$refs.detailsRef?.getInitData();
			})
		}
	},
  components: {
    ThirdPartyWarehouseDetails: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/wmsForecast/components/thirdPartyDetails.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
