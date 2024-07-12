<template>
  <!-- 订单管理（员工端）/海外仓出库/一件代发出库详情 -->
  <div>
		<WholeSaleWarehouseDetails ref="wholeSaleDetailsRef" viewDetailsSource="webOrderOutbound">
			<template v-slot:footerBtn="{ btnInfo }">
				<el-button
					type="primary"
					@click="() => handleOrderRemark(btnInfo.webOrderSource)"
				>
					保存备注
				</el-button>
			</template>
		</WholeSaleWarehouseDetails>
	</div>
</template>

<script>
import { postPlatformDetailsRemark } from "@/api/warehouse/prediction";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "WholeSaleOrderDetails",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted'
		}
	},
	methods: {
		handleOrderRemark(orderSource) {
			const { id, businessRemark } = this.$refs.wholeSaleDetailsRef.$refs.basicInfoFormRef?.getFormParams() || {};
			this.comRepeatedRequest(this, postPlatformDetailsRemark, {
				id,
				remark: businessRemark,
				orderSource
			}).then(() => {
				this.msgSuccess('备注保存成功')
			})
		},
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
