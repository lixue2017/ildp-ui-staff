<template>
  <ComDialog
    ref="dialogRef"
    :customDialog="dialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
			<template v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible && showNextContent">
				<ComForm :formConfig="goodsVerifyForm" class="detail-see-form" />
				<ComTable
					ref="tableDlgRef"
					:tableHeight="tableAutoHeight"
					:columnConfig="tableConfig.columnConfig"
					:columnData="tableConfig.columnData"
					:pagination="false"
				>
					<template v-slot:customRow="{ slotProps }">
						<template
							v-for="(nItem, nIdx) in ['verifyNum']"
						>
							<template v-if="slotProps.prop == nItem">
								<div :key="nIdx">
									<el-input-number
										size="small"
										:min="0"
										v-model="slotProps.row[nItem]"
										v-input-number-limit="{
											value: slotProps.column.decimal,
											maxNumber: 99999
										}"
										:placeholder="slotProps.column.label"
										:controls="false"
										@change="val => rowNumChange(val, slotProps.row)"
									/>
								</div>
							</template>
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
import { mapState, mapActions } from "vuex";
import { getTruckDeliveryVerification, putDeliveryVerification } from "@/api/warehouse/manage";
import { comSaveRepeatedRequest } from "@/api/common";
import { accumulationFn, subtractFn, multiplicationFn } from "@/utils/instructions";
import { customMessageBox } from "@/utils/confirmBox.js";
import { goodsVerifyFormCols, goodsVerifyTableColumn } from "./verifyModel";

export default {
  data() {
    return {
      dialogConfig: {
        title: "核实出库计划(货物)",
        width: "1020px",
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
        columnConfig: goodsVerifyTableColumn(),
      },
			tableSubtotal: [],
			tempObj: {}, // 临时数据
			showNextContent: false, // 更新下一步的数据
			residueNum: 0
    };
  },
  methods: {
		submitSave() {
			if (this.residueNum < 0) {
				return this.msgError("剩余数量不能小于0，请确认核实信息");
			}
			const rTotalNum = this.tableConfig.columnData.some(s => s.infoTotalNum == 0);
			if (rTotalNum) {
				customMessageBox(this, {
					msgTitle: "存在卡车/快递单对应的总数为0的数据",
					msgTxt1: "确认之后为0的卡车/快递单删除",
					msgTxtColor: "#FF6767",
					httpMsgRequest: () => {
						return this.handleSave();
					},
				}, () => {
					// 整车总数=0;
				})
			} else {
				this.handleSave()
			}
		},
		handleSave() {
			const opt = this.tableConfig.columnData.map(e => ({
				verifyNum: e.verifyNum,
				id: e.id,
				outerId: this.goodsVerifyForm.formModel.id,
				distributionInfoId: e.distributionInfoId
			}));
			return comSaveRepeatedRequest(putDeliveryVerification, opt).then(vRes => {
				const { editSuccess } = this.tempObj;
				editSuccess && editSuccess();
				if (vRes.data) {
					// 是否有下一步的数据
					customMessageBox(this, {
						msgTitle: "当前订单还包含待核实货物",
						msgTxt1: '',
						msgTxt2: `${vRes.data.businessSn}，你还要继续核实吗？`,
						confirmButtonText: '继续',
						cancelButtonText: '关闭',
						cancelCallBack: () => {
							this.$refs.dialogRef.hide();
						}
					}, () => {
						this.showVerify({ id: vRes.data.id }, this.tempObj);
					})
				} else {
					this.$refs.dialogRef.hide();
				}
			})
		},
		rowNumChange(v, r) {
			const { singleWeight, singleVolume } = this.goodsVerifyForm.formModel;
			r.infoTotalNum = accumulationFn([r.checkInfoTotalNum, (v - r.num)]);
			r.infoTotalWeight = accumulationFn([r.checkInfoTotalWeight, multiplicationFn([(v - r.num), singleWeight])]);
			r.infoTotalVolume = accumulationFn([r.checkInfoTotalVolume, multiplicationFn([(v - r.num), singleVolume])]);
			this.calcNumTotal();
		},
		async showVerify(row, {
			editSuccess
		}) {
			this.showNextContent = false;
			const resData = (await this.comRepeatedRequest(this, getTruckDeliveryVerification, row.id)).data;
			if (resData === null) {
				// 为null不需要核实
				editSuccess && editSuccess();
				this.$refs.dialogRef?.hide(); // 下一步无核实数据时关闭弹窗
			} else {
				const { itemList, ...fData } = resData;
				this.goodsVerifyForm.formModel = fData;
				this.tempObj = { editSuccess };
				this.tableConfig.columnData = itemList || [];
				this.calcNumTotal();
				await this["dictionary/getDictionary"](["distributionType", "distributionBusinessType"]);
				this.showNextContent = true;
				this.$refs.dialogRef.show();
			}
		},
		calcNumTotal() {
			const arr = this.tableConfig.columnData || [];
			const tVerifyNum = accumulationFn(arr.map(e => e.verifyNum));
			const { verificationNum } = this.goodsVerifyForm.formModel;
			this.residueNum = subtractFn([verificationNum, tVerifyNum]) // 剩余数量=核实总量-核实数量小计
			this.tableSubtotal = [{
				totalLabel: "计划数量",
				totalNum: accumulationFn(arr.map(e => e.num))
			}, {
				totalLabel: "核实数量",
				totalNum: tVerifyNum
			}, {
				totalLabel: "剩余数量",
				totalNum: this.residueNum
			}]
		},
		...mapActions(["dictionary/getDictionary"]),
  },
	computed: {
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

</style>
