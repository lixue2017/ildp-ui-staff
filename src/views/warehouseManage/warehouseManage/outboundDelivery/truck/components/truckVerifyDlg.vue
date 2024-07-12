<template>
  <ComDialog
    ref="dialogRef"
    :customDialog="dialogConfig"
    :dialogBoxCenter="true"
  >
		<template v-slot:title>
			<span>核实出库计划</span>
			<span class="primary-text-color"> (xxxxxxxx)</span>
		</template>
    <template v-slot:content>
			<template v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible">
				<ComForm :formConfig="goodsVerifyForm" class="detail-see-form" />
				<ComTable
					ref="tableDlgRef"
					:defaultExpandAll="true"
					:tableHeight="tableAutoHeight"
					:columnConfig="tableConfig.columnConfig"
					:httpRequest="tableConfig.httpRequest"
					@getResult="getTableResult"
				>
				<!-- :pagination="false" -->
					<template v-slot:customRow="{ slotProps }">
						<template v-if="slotProps.prop === 'expand'">
							<div>
								<!-- 暂无关联产品 -->
								<ComTable
									ref="exRowsRef"
									:extraConfig="{
										showHeader: false,
									}"
									:columnConfig="expandTable.columnConfig"
									:columnData="slotProps.row.children || expandTable.columnData"
								>
									<template v-slot:customRow="{ slotProps: exSlotProps }">
										<template
											v-for="(nItem, nIdx) in ['xx_tg_4']"
										>
											<template v-if="exSlotProps.prop == nItem">
												<div :key="nIdx">
													<el-input-number
														size="small"
														:min="0"
														v-model="exSlotProps.row[nItem]"
														v-input-number-limit="{
															value: exSlotProps.column.decimal,
															maxNumber: 99999
														}"
														:placeholder="exSlotProps.column.label"
														:controls="false"
													/>
												</div>
											</template>
										</template>
									</template>
								</ComTable>
							</div>
						</template>

						
					</template>
					<template v-slot:bottomTotal>
						<div class="grand-total">
							<template v-for="(tItem, i) in tableSubtotal">
								<span :key="`t_${i}`">
									<span>{{ tItem.totalLabel }}：</span>
									<span>{{ tItem.totalNum }}</span>
								</span>
							</template>
						</div>
					</template>
				</ComTable>
			</template>
    </template>
  </ComDialog>
</template>
<script>
// 卡车核实
import { mapState } from "vuex";
import { comSaveRepeatedRequest } from "@/api/common";
import { getUserList } from "@/api/common.js";
import { accumulationFn } from "@/utils/instructions";
import { customMessageBox } from "@/utils/confirmBox.js";
import { goodsVerifyFormCols, truckVerifyTableColumn, truckVerifyExpandCols } from "./verifyModel";

export default {
  props: {
    againVerify: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogConfig: {
        // title: "核实出库计划(卡车)",
				slotTitle: true,
        width: "1100px",
				dlgClassName: "dialog-body-table",
        footer: [
          {
            text: "确认",
            type: "primary",
            handleClick: this.submitSave,
          },
					{
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.handleClose();
            },
          },
        ],
      },
      goodsVerifyForm: {
        formModel: {},
        labelWidth: "80px",
        lists: goodsVerifyFormCols(),
      },
      tableConfig: {
				columnData: [],
        httpRequest: getUserList,
        columnConfig: truckVerifyTableColumn(),
      },
			expandTable: {
				columnData: [{}, {}],
				columnConfig: truckVerifyExpandCols(),
			},
			tableSubtotal: []
    };
  },
  methods: {
		submitSave() {
			console.log('==expandTable', this.expandTable)
			return
			this.msgError("剩余数量不能小于0，请确认核实信息");

			customMessageBox(this, {
				msgTitle: "存在卡车/快递单对应的总数为0的数据",
				msgTxt1: "确认之后为0的卡车/快递单删除",
				msgTxtColor: "#FF6767",
				httpMsgRequest: () => {
					return deleteAttach();
				},
			}, () => {
				// 整车总数=0;
			})
		},
		showVerify(row) {
			this.$refs.dialogRef.show();
		},
		getTableResult({ tableData }) {
			this.tableConfig.columnData = tableData;
			this.calcNumTotal(tableData);
		},
		calcNumTotal(arr = []) {
			this.tableSubtotal = [{
				totalLabel: "计划数量",
				totalNum: accumulationFn(arr.map(e => e.weight))
			}, {
				totalLabel: "核实数量",
				totalNum: accumulationFn(arr.map(e => e.volume))
			}, {
				totalLabel: "剩余数量",
				totalNum: accumulationFn(arr.map(e => e.productTotal))
			}]
		},
  },
	computed: {
    // ...mapState({
    //   dictDataObj: (state) => state.dictionary.dicsData,
    // }),
		tableAutoHeight() {
			const tableLen = this.tableConfig.columnData.length;
			return tableLen > 6 ? `${7 * 50 + 67}px` : undefined
		},
  },
	components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table__expanded-cell {
	border-bottom: none;
	&[class*=cell] {
		padding: 0;
		.el-table--border {
			border-top: none;
		}
		.el-table td {
			border-bottom: none;
		}
	}
}
</style>
