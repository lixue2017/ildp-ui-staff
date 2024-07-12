<template>
	<div>
		<div class="custom-tabs-btn base-flex-between">
			<div>
				<template v-for="item in btnTabsList">
					<el-button
						size="small"
						plain
						:key="item.key"
						@click="changeTabs(item.key)"
						:type="item.key === tabs.active ? 'activation' : ''"
					>{{ item.label }}</el-button>
				</template>
			</div>
			<div class="base-flex-align">
				<slot />
				<template v-if="formData.type === 0">
					<PreviewOrDownload
						btnTxt="付款申请单"
						:btnConf="{ btnType: 'primary' }"
						:previewDownloadConf="previewPayment()"
					/>
				</template>
			</div>
		</div>

		<template v-if="tabs.active === '1'">
			<BillTable
				:basicConfig="{ display: activeTab === '3', activeTab }"
				:billFormData="formData"
				:columnList="formData.accountsBillInfoList"
				:formModel="formConfig.formModel"
			/>
		</template>
		
		<template v-if="tabs.active === '2'">
			<BillHistoryTable
				:historyModel="{
					...formConfig.formModel,
				}"
				:httpRequest="getBankReceiptRecord"
			/>
		</template>

		<template v-if="tabs.active === '3'">
			<UploadFile
				:fileData="{
					type: formData.type,
					...formConfig.formModel,
					isSee: activeTab === '3',
				}"
				@seeUploadFn="seeUploadFn"
			/>
		</template>

		<template v-if="tabs.active === '6'">
			<ComTable
				:ref="`tableDesRef6`"
				class="table-record"
				:columnConfig="tableCols(6)"
				:httpRequest="tabsTableHttpRequest"
				:getQueryParams="getQueryParams"
				:pagination="false"
			>
			</ComTable>
		</template>

	</div>
</template>

<script>
import { getBankReceiptRecord } from "@/api/settlementManage/statementManage";
import { getOperatorInfo } from "@/api/settlementManage/paymentReceived";
import { postPaymentApplyBill } from "@/api/common";
import { resultsTableCols } from "@/views/settlementManage/paymentReceived/taskList/components/BillTable/model.js";

export default {
	props: {
		activeTab: {
			type: String,
			default: () => ""
		},
		formData: {
			type: Object,
			default: () => ({})
		},
		formConfig: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		let name = "收";
    if (this.formData.type === 0) {
      name = "付";
    }
		return {
			getBankReceiptRecord,
			tabs: {
				active: "1"
			},
			btnTabsList: [{
				label: "账单明细",
				key: "1",
			}, {
				label: `${name}款记录`,
				key: "2",
			}, {
				label: "附件信息",
				key: "3",
			}, {
				label: "操作记录",
				key: "6",
			}],
		}
	},
	methods: {
		changeTabs(tKey) {
			this.tabs.active = tKey;
		},
		// 付款申请单预览、下载参数与接口
    previewPayment() {
      const { id } = this.formData;
      return {
        previewParam: {
          id,
        },
        previewHttp: postPaymentApplyBill,
      };
    },
		seeUploadFn() {
			this.$emit("detailUploadFn");
		},
		tabsTableHttpRequest(params) {
      const { active } = this.tabs;
      const httpRequest = {
        6: getOperatorInfo,
      };
      return httpRequest[active](params);
    },
		getQueryParams() {
      return {
				billId: this.formData.id,
			};
    },
		tableCols(tName) {
      const col = {
        6: resultsTableCols,
      };
			return col[tName] || [];
    },
	},
	components: {
		ComTable: () => import("_comp/ComTable"),
		PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    BillTable: () => import("../BillTable"),
		BillHistoryTable: () => import("../BillTable/historyBill"),
		UploadFile: () => import("../UploadFile"),
  },
}
</script>

<style lang="scss" scoped>
.table-record {
	/deep/ {
		.el-table--border {
			border-top: none;
		}
	}
}
</style>