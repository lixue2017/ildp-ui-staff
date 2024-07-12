<template>
	<div>
		<!-- 财务收款详情页 -->
		<ViewDetails ref="detailsRef" webViewSource="receiptsDetails">
			<template v-slot:footerBtn="{ btnInfo }">
				<template v-for="(fBtn, index) in rowStatusList">
					<el-button
						@click="() => fBtn.handleClick({...btnInfo, id: btnInfo.taskBillId})"
						:key="`f_${index}`"
						v-if="rShowFooterBtn(fBtn, btnInfo)"
					>
						{{ fBtn.text }}
					</el-button>
				</template>
			</template>
		</ViewDetails>

		<EditCollectionDialog ref="editDialogRef" @handleSuccess="editSuccess" />
		<ComCustomDialog ref="customDialogRef" />
	</div>
</template>

<script>
import { mixinCollectionExpenses } from "./mixinCostExpenses.js";
export default {
	mixins: [mixinCollectionExpenses],
	data() {
		return {
			
		}
	},
	methods: {
		editSuccess(btnType) {
			if (btnType === 'repulse') {
				// 打回
				this.$refs.detailsRef.reBack();
			} else {
				this.$refs.detailsRef.getDetailsInfo();
			}
    },
		rShowFooterBtn(bItem, row) {
			if (bItem.statusBtnArr.includes('btnBack') && row.taskBillStatus !== 100) {
				return row.taskBillSerialCode.includes('-1');
			}
      return bItem.statusBtnArr.includes(row.taskBillStatus);
    },
	},
	components: {
		ViewDetails: () => import("./components/viewDetails")
  },
}
</script>

<style lang="scss" scoped>

</style>