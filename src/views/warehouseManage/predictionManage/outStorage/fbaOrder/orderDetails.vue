<template>
  <!-- 订单管理（员工端）/海外仓出库/FBA出库详情 -->
  <div>
		<FBAWarehouseDetails ref="fbaDetailsRef" viewDetailsSource="webOrderOutbound">
			<template v-slot:footerBtn="{ btnInfo }">
				<el-button
					type="primary"
					@click="() => handleOrderRemark(btnInfo.webOrderSource)"
				>
					保存备注
				</el-button>
			</template>
		</FBAWarehouseDetails>
	</div>
</template>

<script>
import { postFbaDetailsRemark } from "@/api/warehouse/prediction";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "FbaOrderDetails",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted'
		}
	},
	methods: {
		handleOrderRemark(orderSource) {
			const { id, businessRemark } = this.$refs.fbaDetailsRef.$refs.basicInfoFormRef?.getFormParams() || {};
			this.comRepeatedRequest(this, postFbaDetailsRemark, {
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
