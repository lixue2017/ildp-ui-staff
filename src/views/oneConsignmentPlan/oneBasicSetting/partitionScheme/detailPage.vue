<template>
	<div>
		<SeeDetailView ref="detailRef">
			<template v-slot:footerBtn="{ btnInfo }">
				<template v-for="(fBtn, index) in rowStatusList">
					<el-button
						@click="() => fBtn.handleClick(btnInfo)"
						:key="`f_${index}`"
						v-if="rShowFooterBtn(fBtn, btnInfo)"
					>
						{{ fBtn.text }}
					</el-button>
				</template>
			</template>
		</SeeDetailView>
	</div>
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
	name: "DetailPartitionScheme",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted',
			rowStatusList: [
				{
					statusBtnArr: [0],
					text: "修 改",
					handleClick: this.handleEditPage,
				}
			],
		}
	},
	methods: {
		mixinInitData() {
			setTimeout(() => {
				this.$refs.detailRef?.getDetailInfo();
			}, 20)
		},
		handleEditPage(row) {
			this.$router.push({
        path: `/oneConsignmentPlan/oneBasicSetting/editPartitionScheme`,
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
        },
      });
		},
		rShowFooterBtn(bItem, row) {
      return bItem.statusBtnArr.includes(row.state);
    },
	},
	components: {
		SeeDetailView: () => import("./components/detailView"),
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>