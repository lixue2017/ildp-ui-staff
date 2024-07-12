<template>
  <div class="finance-cost-details">
    <ComDetailTop
      title="财务报销"
      ref="detailTopRef"
      :formModel="detailFormConfig.formModel"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            detailFormConfig.formModel.billNo
              ? `(${detailFormConfig.formModel.billNo})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>

    <div class="finance-cost-content" v-if="showDetail">
      <ReimbursementUser
        :formData="detailFormConfig.formModel"
        :webViewSource="webViewSource"
      />

      <div class="flex">
        <ComForm
          ref="detailsForm"
          :formConfig="detailFormConfig"
          class="my-form"
        />
        <div class="bank-info">
          <div class="bank-info-card">
            <div class="card-title">收款方信息</div>
            <div class="card-name">{{ accountInfo.accountName }}</div>
            <div class="card-account">{{ accountInfo.bankAccount }}</div>
            <div class="card-addr">{{ accountInfo.openingBank }}</div>
          </div>
          <div class="bank-info-card">
            <div class="card-title red">付款方信息</div>
            <div class="card-name">
              {{ receiptPaymentAccountInfo.accountName }}
            </div>
            <div class="card-account">
              {{ receiptPaymentAccountInfo.bankAccount }}
            </div>
            <div class="card-addr">
              {{ receiptPaymentAccountInfo.openingBank }}
            </div>
          </div>
        </div>
      </div>
      <ExpenseTabs
        :detailFormData="detailFormConfig.formModel"
        @detailUploadFn="getDetailsInfo"
        :webViewSource="webViewSource"
      >
        <template v-if="!!detailFormConfig.formModel.status">
          <div class="expenseTabs-class">
            <div
              v-if="detailFormConfig.formModel.isJoinBs"
              class="expenseTabs-left"
            >
              <span>双向报销单:</span>
              <el-button type="text" @click="jumpBill">{{
                detailFormConfig.formModel.joinBillNo || "--"
              }}</el-button>
            </div>
            <div>
              <PreviewOrDownload
                :btnTxt="
                  detailFormConfig.formModel.type === 3
                    ? '收款凭证'
                    : '打印报销单'
                "
                :btnConf="{ btnType: 'primary' }"
                :previewDownloadConf="previewDownloadConfig()"
              />
            </div>
          </div>
        </template>
      </ExpenseTabs>

      <!-- <div
				class="base-flex-between footer-btn"
				v-if="!!detailFormConfig.formModel.status"
			>
				<div></div>
				<div class="base-flex-align">
					<div style="margin-right: 5px">
						<PreviewOrDownload
							btnTxt="打印报销单"
							:btnConf="{ btnType: 'primary' }"
							:previewDownloadConf="previewDownloadConfig()"
						/>
					</div>
					<el-button @click="paymentRecord" v-debounce size="small"
						>付款记录</el-button
					>
					<el-button @click="processRecord" v-debounce size="small"
						>流程记录</el-button
					>
				</div>
			</div> -->

      <template>
        <div class="footer-seize-seat"></div>
        <div class="order-footer">
          <slot name="footerBtn" :btnInfo="detailFormConfig.formModel" />
          <template v-for="(fBtn, index) in footBtn">
            <el-button
              @click="fBtn.handleClick"
              :key="`b_${index}`"
              v-if="showFooterBtn(fBtn)"
            >
              {{ fBtn.text }}
            </el-button>
          </template>
        </div>
      </template>
    </div>

    <FlowRecord ref="flowRef" />
    <PaymentDrawer ref="paymentRef" />
  </div>
</template>

<script>
import {
  individualVerification,
  payApply,
  borrowMoney,
  collectionCols,
} from "../modelDetails.js";
import {
  getSettleExpenseInfo,
  getCashierInfo,
  getSettleExpenseTaskInfo,
  postExpensePreview,
} from "@/api/settlementManage/paymentReceived";
import { mapActions } from "vuex";

export default {
  props: {
    webViewSource: {
      type: String,
      default: () => "",
    },
  },
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    PaymentDrawer: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/paymentDrawer/index"
      ),
    FlowRecord: () => import("../flowRecord.vue"),
    ExpenseTabs: () => import("./expenseTabs.vue"),
    ReimbursementUser: () => import("./reimbursementUser"),
  },
  data() {
    return {
      formLists: {
        0: individualVerification.lists,
        1: payApply.lists,
        2: borrowMoney.lists,
        3: collectionCols.lists, // 收款单临时模板
      },
      detailFormConfig: {
        labelWidth: "91px",
        formModel: {},
        formRules: {},
      },
      showDetail: false,
      accountInfo: {},
      receiptPaymentAccountInfo: {},
      footBtn: [
        {
          text: "流程记录",
          noBtnStatus: [60],
          handleClick: () => this.processRecord(),
        },
        {
          text: "关 闭",
          isAllBtn: true,
          handleClick: this.reBack,
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"]([
      "billType",
      "expenseType",
      "expenseFlow",
      "collectionTaskState",
      "RVPStatus",
    ]);
    this.getDetailsInfo();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDetailsInfo() {
      this.showDetail = false;
      const { id, costType } = this.$route.query;
      const httpDesRequest = ["receiptsDetails", "paymentDetails"].includes(
        this.webViewSource
      )
        ? costType == 0
          ? getCashierInfo
          : getSettleExpenseTaskInfo
        : getSettleExpenseInfo;
      httpDesRequest(id).then((res) => {
        const {
          id,
          type,
          accountId,
          accountName,
          dealingsCompanyName,
          bankAccount,
          openingBank,
          openAddress,
          receiptPaymentAccountId,
          receiptPaymentAccountName,
          receiptPaymentBankAccount,
          receiptPaymentOpeningBank,
          receiptPaymentOpenAddress,
        } = res.data;
        this.detailFormConfig.formModel = {
          ...res.data,
          billId: id,
        };
        this.detailFormConfig.lists = this.formLists[type];
        const aPayment = {
          accountId,
          accountName: dealingsCompanyName,
          bankAccount,
          openingBank,
          openAddress,
        };
        const bPayment = {
          accountId: receiptPaymentAccountId,
          accountName: receiptPaymentAccountName,
          bankAccount: receiptPaymentBankAccount,
          openingBank: receiptPaymentOpeningBank,
          openAddress: receiptPaymentOpenAddress,
        };
        this.accountInfo = type === 3 ? bPayment : aPayment; // 收付款
        this.receiptPaymentAccountInfo = type === 3 ? aPayment : bPayment;
        this.showDetail = true;
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetailsInfo(id);
      }
    },
    // 预览、下载参数与接口
    previewDownloadConfig() {
      const { id, taskBillId } = this.detailFormConfig.formModel;
      return {
        previewParam: {
          id,
          taskBillId,
        },
        previewHttp: postExpensePreview,
      };
    },
    paymentRecord() {
      const { id } = this.detailFormConfig.formModel;
      this.$refs.paymentRef?.show(id, "writeOffPayment");
    },
    processRecord() {
      const { id } = this.detailFormConfig.formModel;
      this.$refs.flowRef?.show(id);
    },
    showFooterBtn(fBtn) {
      const { status } = this.detailFormConfig.formModel;
      return fBtn.noBtnStatus
        ? !fBtn.noBtnStatus.includes(status)
        : fBtn.isAllBtn;
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    jumpBill() {
      const { joinBillId, joinTaskBillId } = this.detailFormConfig.formModel;
      const { pageSource, backPath, ...obj } = this.$route.query;
      const id = {
        userCostExpensesPage: joinBillId,
        reviewCostExpensesPage: joinBillId,
        financialPaymentDetails: joinTaskBillId,
        financialReceiptsDetails: joinTaskBillId,
      }[pageSource];
      const { path } = this.$route;
      this.$router.push({
        path,
        query: {
          id,
          pageSource,
          backPath,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.finance-cost-details {
  min-height: calc(100vh - 110px);
  background: #ffffff;
  margin: 10px;
  .finance-cost-content {
    padding: 0 20px 20px;
  }
  .expenseTabs-class {
    display: flex;
    align-items: center;
    .expenseTabs-left {
      margin-right: 25px;
    }
  }
  .flex {
    display: flex;
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 20px;
    margin-bottom: 15px;
    .my-form {
      max-width: 52%;
      border-right: 1px solid #e2e2e2;
      /deep/ {
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .bank-info {
      display: flex;
      justify-content: space-between;
      padding-left: 25px;
      .bank-info-card {
        width: 350px;
        min-height: 170px;
        background: linear-gradient(
          153deg,
          rgba(223, 223, 223, 0.1) 0%,
          rgba(188, 188, 188, 0.1) 100%
        );
        border-radius: 4px;
        border: 1px solid rgba(188, 188, 188, 0.5);
        padding: 20px;
        &:not(:first-child) {
          margin-left: 20px;
        }
        .card-title {
          line-height: 18px;
          // border-left: 2px solid #e2e2e2;
          color: #8b8b8b;
          margin-bottom: 40px;
          &::before {
            display: inline-block;
            content: "";
            width: 2px;
            height: 11px;
            background: #53c88a;
            border-radius: 2px;
            margin-top: 3px;
            margin-right: 5px;
          }
          &.red::before {
            background: #ff6767;
          }
        }
        .card-name {
          font-size: 15px;
          font-weight: bold;
          line-height: 21px;
          margin-bottom: 15px;
          word-break: break-all;
        }
        .card-account {
          word-break: break-all;
        }
        .card-addr {
          word-break: break-all;
          color: #8b8b8b;
        }
      }
    }
  }
  .footer-btn {
    margin-top: 20px;
  }
}
</style>
