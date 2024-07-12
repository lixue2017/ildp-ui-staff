<template>
	<!-- 派送信息tab -->
  <div v-if="initRes">
		<!-- 卡车 -->
    <div class="dispatch-box" v-for="(tItem, i) in dispatchData.truckList"
			:key="`1_${i}`">
			<ComForm
				class="detail-see-form"
				:formConfig="{
					...formConfigFn(0),
					formModel: tItem
				}"
			>
				<template v-slot:code="slotProps">
					<span class="primary-text-btn" @click="handlePage(tItem)">
						{{ slotProps.formModel.code }}
					</span>
				</template>
			</ComForm>
		</div>

		<!-- 快递 -->
		<div class="dispatch-box" v-for="(eItem, i) in dispatchData.expressList"
			:key="`2_${i}`">
			<ComForm
				class="detail-see-form"
				:formConfig="{
					...formConfigFn(1),
					formModel: eItem
				}"
			/>
		</div>

		<!-- 公司 -->
		<div class="dispatch-box" v-for="(cItem, i) in dispatchData.truckCompanyList"
			:key="`3_${i}`">
			<ComForm
				class="detail-see-form"
				:formConfig="{
					...formConfigFn(2),
					formModel: cItem
				}"
			/>
		</div>
  </div>
</template>

<script>
import { getEcGoodsDispatch } from "@/api/warehouse/prediction";
import { dispatchFormCols } from "./model";

export default {
	props: {
		dispatchObj: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			basicFormConfig: {
				size: "small",
				labelWidth: "126px",
				formRules: {}, // 表单校验规则
      },
			initRes: false
		}
	},
	methods: {
		formConfigFn(mIndex) {
			return {
				...this.basicFormConfig,
				lists: dispatchFormCols(mIndex),
				isAttachFileId: mIndex !== 0,
			}
		},
		_getDispatchList() {
			const { operationOrderNum } = this.dispatchObj
			getEcGoodsDispatch({ orderSn: operationOrderNum }).then(res => {
				const { ecGoodsDispatchKCList = [], ecGoodsDispatchKDList = [], ecGoodsDispatchZTList = [] } = res.data || {}
				this.dispatchData = {
					truckList: ecGoodsDispatchKCList.length ? ecGoodsDispatchKCList : [],
					expressList: ecGoodsDispatchKDList.length ? ecGoodsDispatchKDList : [],
					truckCompanyList: ecGoodsDispatchZTList.length ? ecGoodsDispatchZTList : [],
				};
				this.initRes = true
			})
		},
		handlePage(row) {
      this.handleView("/warehouseManage/process/editTruckRecord", row);
    },
    handleView(path, row = {}) {
      this.$router.push({
        path,
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
        },
      });
    },
	},
	created() {
		this._getDispatchList();
	},
	components: {
    ComForm: () => import("_comp/ComForm")
  },
}
</script>

<style lang="scss" scoped>
.dispatch-box {
	border-top: 1px solid #e2e2e2;
	margin-top: 15px;
	margin-bottom: 15px;
}
</style>
