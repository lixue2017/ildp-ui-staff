<template>
	<div class="app-container">
		<ComDetailTop
      title=" 物流渠道详情"
			ref="detailTopRef"
      :formModel="detailFormConfig.formModel"
      @handleClick="handleTopClick"
    />
		<div class="des-content-box" v-if="isInitRes">
			<ComForm
				ref="detailsFormRef"
				class="detail-see-form"
				:formConfig="detailFormConfig"
			></ComForm>

			<!-- <div class="base-flex-between table-title">
				<span>API授权</span>
				<el-button @click="handleEmpower" type="primary" round>
					新增
				</el-button>
			</div>

			<ComTable
				:ref="`tableRef`"
				:httpRequest="detailTableConfig.httpRequest"
				:columnConfig="detailTableConfig.columnConfig"
			>
			</ComTable> -->
		</div>

		<EmpowerDialog ref="empowerDlgRef" />
		<LogisticsEditDlg ref="logisticsEditRef" />

		<template v-if="isInitRes">
			<div class="footer-seize-seat"></div>
			<div class="order-footer">
				<template v-for="(btn, index) in footBtnListFn()">
					<el-button @click="btn.handleClick" :key="index" :loading="btn.footBtnLoading && isBtnLoading">
						{{ btn.text }}
					</el-button>
				</template>
			</div>
		</template>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  basicChannelDel,
  basicChannelPut,
	getLogisticsInfo
} from "@/api/priceSystem/provider.js";
import { comSaveRepeatedRequest } from "@/api/common";
import { logisticsChannelList } from "@/api/warehouse/basic"
import { detailColumns, detailTableColumns } from "./model.js"
export default {
	data() {
		return {
			detailFormConfig: {
        formModel: {},
        labelWidth: "100px",
				lists: detailColumns()
      },
			detailTableConfig: {
				httpRequest: logisticsChannelList,
				columnConfig: detailTableColumns()
			},
			footBtnList: [{
				statusBtnArr: [0],
				text: "修 改",
				handleClick: this.handleAddOrEdit,
			}, {
				statusBtnArr: [0],
				text: "删 除",
				footBtnLoading: true,
				handleClick: this.handleDelete,
			}, {
				statusBtnArr: [0, 2],
				text: "启 用",
				footBtnLoading: true,
				handleClick: this.handleUpdate,
			}, {
				text: "返 回",
				isBtnAll: true,
				handleClick: this.reBack,
			},],
			isInitRes: false
		}
	},
	methods: {
		handleDistribution() {

		},
		handleEmpower() {
			this.$refs.empowerDlgRef.editShow({}, {
				editSuccess: () => {}
			});
		},
		handleAddOrEdit() {
      this.$refs.logisticsEditRef?.editShow(this.detailFormConfig.formModel, {
        editSuccess: () => {
          // 编辑成功
          this.getDetailInfo();
        },
      });
    },
		handleDelete() {
			customMessageBox(this, {
				msgTitle: "删除提示",
				msgTxtColor: "#FF6767",
				httpMsgRequest: () => basicChannelDel(this.detailFormConfig.formModel.id),
			}, () => {
				this.msgSuccess("删除成功");
				this.reBack();
			})
		},
		handleUpdate() {
			comSaveRepeatedRequest(basicChannelPut, this.detailFormConfig.formModel.id).then(() => {
        this.msgSuccess("更新成功");
        this.getDetailInfo();
      });
		},
		getDetailInfo() {
			this.isInitRes = false;
			const { id } = this.$route.query;
			getLogisticsInfo(id).then(res => {
				const { createUserName, ...nRes } = res.data || {};
				this.detailFormConfig.formModel = {
					...nRes,
					createBy: createUserName,
				};
				this.isInitRes = true;
			})
		},
		handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetailInfo();
      }
    },
		reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
		footBtnListFn() {
			const { state } = this.detailFormConfig.formModel;
			return this.footBtnList.filter(e => e.statusBtnArr ? e.statusBtnArr.includes(state) : e.isBtnAll)
		},
		...mapActions(["dictionary/getDictionary"]),
	},
	created() {
		this["dictionary/getDictionary"](["tagType", "outWarehouseWay", "status", "trueOrFalse"]).then(() => {
      this.getDetailInfo();
    });
	},
	computed: {
		...mapState({
			isBtnLoading: (state) => state.settings.isRepeatedClick,
		}),
	},
	components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
		LogisticsEditDlg: () => import("@/views/enterprise/priceSystem/logisticsChannel/components/editDlg.vue"),
		EmpowerDialog: () => import("./empowerDlg"),
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
	padding: 0;
	.des-content-box {
		padding: 0 20px 15px;
		.table-title {
			padding: 5px 0;
		}
	}
}
</style>