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
import { customMessageBox } from "@/utils/confirmBox.js";
import { delWeightSectionTemp, putWeightSectionTemp } from "@/api/warehouse/basic";
import { comSaveRepeatedRequest } from "@/api/common";

export default {
	name: "DetailPartitionScheme",
	mixins: [mixinEditCache],
	data() {
		return {
			isMixinCreatedMounted: 'mounted',
			rowStatusList: [
				{
					statusBtnArr: [0],
					text: "修改",
					handleClick: (r) => this.handleDetails(r),
				}, {
					statusBtnArr: [0],
					text: "删除",
					footBtnLoading: true,
					handleClick: (r) => this.handleDelete(r),
				}, {
					statusBtnArr: [0, 2],
					text: "启用",
					footBtnLoading: true,
					handleClick: (r) => this.handleUpdate(r),
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
		handleDetails({ id }) {
      this.$router.push({
        path: `/oneConsignmentPlan/oneBasicSetting/editWeightSection`,
        query: {
          id,
          backPath: this.$route.fullPath,
        },
      });
    },
		handleDelete({ id }) {
			customMessageBox(this, {
				msgTitle: '删除提示',
				msgTxtColor: "#FF6767",
				httpMsgRequest: () => delWeightSectionTemp(id),
			}, () => {
				this.msgSuccess("删除成功");
				this.$refs.detailRef?.reBack();
			})
    },
		handleUpdate({ id }) {
      // 状态：0-草稿，1-启用，2-禁用
			comSaveRepeatedRequest(putWeightSectionTemp, id).then(() => {
        this.msgSuccess("更新成功");
        this.$refs.detailRef?.getDetailInfo();
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