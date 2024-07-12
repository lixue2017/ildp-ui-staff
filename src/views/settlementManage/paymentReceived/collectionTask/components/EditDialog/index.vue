<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="false"
      class="audit-dialog"
    >
      <template v-slot:title></template>

      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
          @handleChange="handleChange"
        >
          <template v-slot:SOAInfo="slotProps">
            <div class="form-content">
              <div>
                <span>认领时间：</span>
                <span>{{
                  slotProps.formModel.claimTime
                    ? slotProps.formModel.claimTime
                    : "--"
                }}</span>
              </div>
              <div>
                <span>认领人：</span>
                <span>{{
                  slotProps.formModel.claimByName
                    ? slotProps.formModel.claimByName
                    : "--"
                }}</span>
              </div>
              <div>
                <span>本次核销：</span>
                {{ slotProps.formModel.money }}
              </div>
            </div>
          </template>
					<template v-slot:slotQuestion>
						<el-tooltip effect="dark" content="剩余金额 = 水单金额 + 手续费 - 汇兑损益 - 本次核销(水单币种)合计" placement="top">
							<i class="el-icon-question" style="font-size: 18px; color: #5094ff; cursor: pointer;"></i>
						</el-tooltip>
					</template>
          <template v-slot:tableData>
            <ComTable
              ref="tableConfig"
              :tableHeight="tableAutoHeight"
              :columnConfig="tableConfig.columnConfig"
              :columnData="tableConfig.columnData"
              :pagination="false"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'billNo'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row.billId)"
                  >
                    {{ slotProps.row.billNo }}
                  </span>
                </template>
                <!-- <template v-if="slotProps.prop === 'verificationMoney'">
                  <el-input
                    v-model="slotProps.row.verificationMoney"
                    type="number"
                    @change="getRemainMoney(slotProp.formModel)"
                  ></el-input>
                </template> -->
              </template>
            </ComTable>
						<div class="grand-total">
							<template v-for="(tItem, i) in tableSubtotal">
								<span :key="`t_${i}`">
									<span>{{ tItem.totalLabel }}：</span>
									<span>{{ formatMoney(tItem.totalNum) }}</span>
								</span>
							</template>
						</div>
          </template>
          <template v-slot:slotImgList="{ formModel }">
            <div class="custom-preview-image">
              <template v-for="(item, index) in formModel.picUrl">
                <el-image
                  v-if="item"
                  :src="item"
                  :key="index"
                  :preview-src-list="formModel.picUrl"
                >
                </el-image>
              </template>
            </div>
          </template>

          <template v-slot:bsAccountInfo>
            <div class="content-bsAccountInfo">
              <div>BS账号信息</div>
              <div class="content-flex">
                <span>{{
                  formConfig.formModel.receiptPaymentBankAccount
                }}</span>
                <span>{{
                  formConfig.formModel.receiptPaymentAccountName
                }}</span>
              </div>
            </div>
          </template>
          <template v-slot:counterpartInfo>
            <div class="content-counterpartInfo">
              <div>对方账号信息</div>
              <div class="content-flex">
                <span>{{ formConfig.formModel.openingAddress }}</span>
                <span>{{ formConfig.formModel.bankAccount }}</span>
                <span>{{ formConfig.formModel.accountName }}</span>
              </div>
            </div>
          </template>
          <template v-slot:waterInfo>
            <div class="content-waterInfo">
              <div>
                <span>水单资料</span>
              </div>
            </div>
          </template>
          <template v-slot:uploadWater="slotProps">
            <UploadFiles
              :fileData="{
                ...slotProps.formModel,
              }"
              :uploadFileModel="uploadFileModel"
              @attachIdList="getAttachIdList"
            >
            </UploadFiles>
          </template>
        </ComForm>
      </template>
    </ComDialog>

		<ComCustomDialog ref="customDialogRef" />
  </div>
</template>


<script>
import { config, tableConfig } from "./model";
import {
  cashierPayeeCheck,
  cashierPayeeVerification,
  getCashierPayee,
  getMoneyRemainRMB,
  settleCashierPreview,
  GETCashierPreviewAllBr
} from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
import { accumulationFn, subtractFn } from "@/utils/instructions";
import { comSaveRepeatedRequest } from "@/api/common";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    ComTable: () => import("_comp/ComTable"),
		ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    UploadFiles: () =>
      import("@/views/operateManage/components/uploadFiles/index.vue"),
  },
  data() {
    return {
      customDialogConfig: {
        title: "",
        width: "1100px",
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
					{
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitJudge, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "95px",
      },
      tableConfig: {
        columnConfig: tableConfig.paymentList,
        columnData: [],
      },
      type: "", //弹窗的类型
      uploadFileModel: {
        fileTypeArr: [
          {
            label: "应收账单合同",
            fBtnParam: {
              type: "131",
            },
          },
        ],
      },
      attachId:[]
    };
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableConfig.columnData.length;
      return tableLen > 6 ? `${7 * 39 + 54}px` : undefined;
    },
		tableSubtotal() {
			return [{
				totalLabel: "合计（水单币别）",
				totalNum: accumulationFn(this.tableConfig.columnData.map(e => e.bankReceiptVerificationMoney), 2)
			}]
		},
  },
  created() {},
  methods: {
    submitJudge(formModel) {
      return new Promise((resolve) => {
        if (this.type === "Verification") {
          //财务核销
          // console.log(formModel);
          const { remainMoney, bankReceiptCurrencyCode, moneyRemain } =
            formModel;
          let confirmText = [];
          if (remainMoney > 0) {
            confirmText = [
              `当前水单还剩 ${moneyRemain}${bankReceiptCurrencyCode}未认领 ！`,
              "认领完成之后此水单可被再次认领，你还要继续吗？",
            ];
          } else {
            confirmText = [
              "当前水单认领完全！",
              "认领完成之后此水单完结，你还要继续吗？",
            ];
          }
          const newDatas = [];
          const h = this.$createElement;
          for (const i in confirmText) {
            newDatas.push(h("p", null, confirmText[i]));
          }

          this.$confirm("提示", {
            confirmButtonText: "继 续",
            cancelButtonText: "取 消",
            type: "warning",
            message: h("div", null, newDatas),
          })
            .then(() => {
              this.submitFormRequest(formModel).then(() => {
                this.voucherDownload(formModel.id);
                resolve();
              });
            })
            .catch(() => {});

          // this.submitFormRequest(formModel);
        } else if (this.type === "Collection") {
          //收款确认
          if (formModel.verificationBy) {
            //选了财务核销人
            this.submitFormRequest(formModel).then(() => {
              this.voucherDownload(formModel.id);
              resolve();
            });
          } else {
            const { remainMoney, bankReceiptCurrencyCode, moneyRemain } =
              formModel;
            //remainMoney转化成RMB之后的剩余金额
            //moneyRemain原币种剩余金额
            let confirmText = [];
            if (remainMoney === 0) {
              confirmText = [
                "当前水单认领完全！",
                "认领完成之后此水单完结，你还要继续吗？",
              ];
            } else {
              confirmText = [
                `当前水单还剩 ${moneyRemain}${bankReceiptCurrencyCode}未认领 ！`,
                "认领完成之后此水单可被再次认领，你还要继续吗？",
              ];
            }
            const newDatas = [];
            const h = this.$createElement;
            for (const i in confirmText) {
              newDatas.push(h("p", null, confirmText[i]));
            }
            //没有选财务核销人
            this.$confirm("提示", {
              confirmButtonText: "继 续",
              cancelButtonText: "取 消",
              type: "warning",
              message: h("div", null, newDatas),
            })
              .then(() => {
                this.submitFormRequest(formModel).then(() => {
                  this.voucherDownload(formModel.id);
                  resolve();
                });
              })
              .catch(() => {});
          }
        }
      });
    },

    submitFormRequest(formModel) {
      const { id, nRemark, verificationBy } = formModel;
      const statementInfo = this.tableConfig.columnData.map((sItem) => {
        return {
          id: sItem.id,
          cashierId: sItem.cashierId,
          money: sItem.verificationMoney, //金额
					statementId: sItem.billId
        };
      });
      const opt = {
        id,
        remark: nRemark,
        auditStatus: 0, //审核状态(0:通过/1:打回)
        statementInfo,
        serviceCharge: formModel.serviceCharge || 0, //手续费
        serviceChargeCurrencyCode: formModel.bankReceiptCurrencyId, //手续费币别
        exchangeLoss: formModel.exchangeLoss || 0, //汇总损益
				isClaimAll: formModel.isClaimAll ? 1 : 0, //水单金额全部认领
        attachId:this.attachId.join(',')
      };
      if (this.type === "Verification") {
        //财务核销
        // return cashierPayeeVerification(opt);
        return comSaveRepeatedRequest(cashierPayeeVerification, opt);
      } else if (this.type === "Collection") {
        //收款确认
        return comSaveRepeatedRequest(cashierPayeeCheck, {
          ...opt,
          verificationBy, //核销人
        });
      }
    },
    // 下载收款凭证
    voucherDownload(id) {
      comFileDownload(this, GETCashierPreviewAllBr, { id });
    },
    handleSuccess() {
      this.hide();
      this.$emit("handleSuccess");
    },
    async show(params, type) {
      this.type = type;
      let status;
      if (type === "Collection") {
        status = 0;
      } else if (type === "Verification") {
        status = 1;
      }
      const collectData = await getCashierPayee(params.id, { status });
      const {
        statementInfos = [],
        id,
        moneyInfo,
        exchangeLoss,
        serviceCharge,
        isClaimAll,
				isVb,
        ...nRes
      } = collectData.data || {};
			const moneyRemain = moneyInfo && (moneyInfo.moneyRemain || moneyInfo.moneyRemain === 0) ? moneyInfo.moneyRemain : nRes.money;
      this.formConfig.formModel = {
        ...nRes,
        id: params.id,
        remainMoney: moneyInfo?.moneyRemainRMB,
        moneyRemain,
        exchangeLoss: exchangeLoss || 0,
        serviceCharge: serviceCharge || 0,
        isClaimAll: isClaimAll ? true : false,
        listStatus:params?.status//列表的状态
      };
      statementInfos.map((item) => {
        item.surplusMoney =
          item.totalMoney - item.writeOffMoney - item.verificationMoney;
      });
      this.tableConfig.columnData = statementInfos;
      switch (type) {
        case "Verification":
          ///财务核销
          this.customDialogConfig.title = config.VerificationList[0].title;
          this.formConfig.lists = config.VerificationList;
					this.formConfig.formRules = {};
          break;
        case "Collection":
          //收款确认
          this.customDialogConfig.title = config.collectionList[0].title;
          this.formConfig.lists = config.collectionList;
					this.formConfig.formRules = isVb ? config.formRules : {};
          break;
        default:
          break;
      }
      this.$refs.customDialog.show();
      // this.$refs.tableConfig?.setNewTableData(this.tableConfig.columnData);
    },
    hide(type) {
      this.$refs.customDialog.hide();
    },
    getAttachIdList(row) {
      this.attachId=row
    },
    handleView(id) {
      this.$refs.customDialog?.hide();
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id,
          backPath: this.$route.fullPath,
          activeTab: "3", // 3-详情
        },
      });
    },
    getRemainMoney() {
      const { columnData } = this.tableConfig;
      const {
        exchangeLoss = 0,
        serviceCharge = 0,
        bankReceiptCurrencyId,
        bankReceiptId,
      } = this.$refs.dialogForm?.getFormParams();

      const amount = columnData.map((item) => {
        return {
          id: item.id,
          money: item.verificationMoney,
        };
      });
      const params = {
        bankReceiptId, //水单ID
        amount, //对账单本次核销数据
        exchangeLoss, //汇兑损益
        serviceChargeCurrencyCode: bankReceiptCurrencyId, // 手续费币别ID
        serviceCharge,
        status: 1,
      };
      getMoneyRemainRMB(params).then((res) => {
        // console.log(res);
        const { moneyRemain, moneyRemainRMB } = res.data;
        this.$refs.dialogForm?.setFormModel({
          moneyRemain,
					remainMoney: moneyRemainRMB,
					isClaimAll: !moneyRemain,
        });
      });
    },
    handleChange(e, type) {
      if (["serviceCharge", "exchangeLoss"].includes(type)) {
        this.getRemainMoney();
      }
			if (type == "isClaimAll") {
				// 勾选水单金额全部认领时，手续费=当前手续费-剩余金额 ； 汇兑损益不变
				const { serviceCharge, moneyRemain } = this.$refs.dialogForm?.getFormParams();
				if (moneyRemain === 0) {
					this.$refs.dialogForm?.setFormModel({
						isClaimAll: true,
					});
					return
				}
        if (e) {
					this.$refs.dialogForm?.setFormModel({
						serviceCharge: subtractFn([serviceCharge, moneyRemain]),
					});
					this.getRemainMoney();
				}
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.audit-dialog {
  /deep/ {
    .el-dialog__body {
      padding: 30px 30px 10px 30px;
    }
    .title {
      font-size: 14px;
      color: #515151;
      font-weight: bold;
      line-height: 20px;
    }
    .sub-title {
      font-size: 13px;
      color: #8b8b8b;
      line-height: 20px;
      margin: 5px 0 18px;
    }
    .card-uploader {
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item {
        width: 80px;
        height: 80px;
        line-height: 85px;
        margin: 0 18px 0 0;
      }
    }
    .custom-remark {
      .el-form-item {
        .el-form-item__label {
          margin: 0 0 5px 5px;
        }
      }
      .el-form-item--small .el-form-item__content {
        line-height: 20px;
        min-height: 20px;
      }
    }
  }
  .form-content {
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
  }
  .slot-serviceCharge {
    /deep/.el-input-group__append {
      width: 80px;
    }
  }
  .slot-gainOrLoss {
    & > div:first-child {
      width: 80%;
    }
  }
  .dialog-form {
    /deep/.content-bsAccountInfo {
      width: 100%;
      background: rgba(188, 188, 188, 0.1);
      border-radius: 4px;
      padding: 10px 30px;
    }
    /deep/.content-counterpartInfo {
      width: 100%;
      background: rgba(188, 188, 188, 0.1);
      border-radius: 4px;
      padding: 10px 30px;
    }
    .content-waterInfo {
      font-size: 14px;
      font-weight: 500;
      color: #515151;
    }
    .content-flex {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
