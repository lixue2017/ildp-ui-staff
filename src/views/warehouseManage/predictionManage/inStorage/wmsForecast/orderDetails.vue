<template>
  <!-- 订单管理（员工端）/海外订单/第三方入库单详情 -->
  <div>
		<ThirdPartyWarehouseDetails ref="detailsRef" viewDetailsSource="orderReceiving">
			<template v-slot:footerBtn="{ btnInfo }">
				<el-button
					type="primary"
					@click="() => handleUpdate(btnInfo)"
					v-if="[1, '1'].includes(btnInfo.orderState)"
				>
					接 单
				</el-button>
				<el-button
					type="primary"
					@click="() => handleOrderRemark(btnInfo.webOrderSource)"
				>
					保存备注
				</el-button>
			</template>
		</ThirdPartyWarehouseDetails>

		<ReceivingOrders ref="receivingRef" @handleSuccess="handleOperateSuccess" />
	</div>
</template>

<script>
import { postThirdPartyRemark } from "@/api/warehouse/prediction";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "OrderThirdParty",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted'
		}
	},
	methods: {
		handleUpdate(obj) {
      if (obj.orderState == 1) {
        this.$refs.receivingRef.show(obj);
      }
    },
		handleOrderRemark(orderSource) {
			const { id, businessRemark } = this.$refs.detailsRef.$refs.basicInfoFormRef?.getFormParams() || {};
			this.comRepeatedRequest(this, postThirdPartyRemark, {
				id,
				remark: businessRemark,
				orderSource
			}).then(() => {
				this.msgSuccess('备注保存成功')
			})
		},
		handleOperateSuccess() {
			this.$refs.detailsRef.handleRefreshPage();
		},
		mixinInitData() {
			setTimeout(() => {
				// 保存子组件加载完成
				this.$refs.detailsRef?.getInitData();
			})
		}
	},
  components: {
		ReceivingOrders: () => import("./OrderReceiving"),
    ThirdPartyWarehouseDetails: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/wmsForecast/components/thirdPartyDetails.vue"
      ),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
