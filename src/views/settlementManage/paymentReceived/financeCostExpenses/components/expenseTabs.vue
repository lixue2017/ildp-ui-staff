<template>
  <div class="expenses-tabs-box">
    <div class="custom-tabs-btn flex-space-between">
      <div>
        <template v-for="tItem in btnTabsList">
          <el-button
            size="small"
            plain
            :key="tItem.key"
            @click="handleTabsClick(tItem.key)"
            :type="tItem.key === tabActive ? 'activation' : ''"
            >{{ tItem.label }}</el-button
          >
        </template>
      </div>
      <slot />
    </div>

    <template v-if="['1', '6'].includes(tabActive)">
      <div class="table">
        <ComTable
          :ref="`tableDesTabRef${tabActive}`"
          :columnConfig="tableCols()"
          :httpRequest="tabsTableHttpRequest"
          :getQueryParams="getQueryParams"
          :isMountedRequest="false"
        />
        <div
          v-if="tabActive === '1'"
          class="grand-total"
          style="fontweight: bold"
        >
          合计：{{ subtotalMoney }}
        </div>
      </div>
    </template>

    <template v-if="tabActive === '2'">
      <HistoryRecordTable :historyModel="detailFormData" />
    </template>

    <template>
      <!-- <ComAttachTable v-show="tabActive === '3'" ref="attachTableRef" /> -->
      <UploadFile
        :fileData="{
          type: 0,
          ...detailFormData,
          isSee: true,
        }"
        :fileUploadConfig="fileUploadConfig"
        @seeUploadFn="seeUploadFn"
        v-if="tabActive === '3'"
      />
    </template>
  </div>
</template>

<script>
import {
  getExpenseOperatorRecord,
  POSTUploadPaymentInvoice,
} from "@/api/settlementManage/paymentReceived";
import { POSTCashierUploadPaymentInvoice } from "@/api/settlementManage/statementManage";
import { resultsTableCols } from "@/views/settlementManage/paymentReceived/taskList/components/BillTable/model";
import { individualVerification } from "../modelDetails.js";

export default {
  props: {
    detailFormData: {
      type: Object,
      default: () => ({}),
    },
    webViewSource: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      tabActive: "1",
      subtotalMoney: "",
      btnTabsList: [],
      fileUploadConfig: {
        fileTypeArr: [
          {
            label: "个人报销",
            fBtnParam: {
              type: "120",
            },
          },
        ],
        isUploadBtn: true,
        showTypeArr: ["120"],
        submitHttpRequest: this.submitUploadFile,
      },
    };
  },
  methods: {
    handleTabsClick(tKey) {
      this.tabActive = tKey;
      setTimeout(() => {
        this.handleTabsChange(tKey);
      });
    },
    handleTabsChange(tName) {
      switch (tName) {
        case "1":
          this.$refs[`tableDesTabRef${tName}`]?.setNewTableData(
            this.detailFormData.billInfoList || []
          );
          if (!this.subtotalMoney) {
            this.calcTotal(this.detailFormData.billInfoList || []);
          }
          break;
        case "3":
          this.$refs.attachTableRef?.setFileList(
            this.detailFormData.attachList || []
          );
          break;
        case "6":
          this.$refs[`tableDesTabRef${tName}`]?.refreshTable(true);
          break;
        default:
          break;
      }
    },
    tableCols() {
      const col = {
        1: individualVerification.column,
        6: resultsTableCols,
      };
      return col[this.tabActive] || [];
    },
    tabsTableHttpRequest(e) {
      const httpRequest = {
        6: getExpenseOperatorRecord,
      };
      return httpRequest[this.tabActive](e);
    },
    getQueryParams() {
      const { id, taskBillId } = this.detailFormData;
      if (["receiptsDetails", "paymentDetails"].includes(this.webViewSource))
        return {
          taskBillId,
        };
      return {
        id,
      };
    },
    calcTotal(list) {
      if (!list.length) return;
      // currencyCode--币种   money--金额  type--类型
      let moneyArr = [];
      list.forEach((e) => {
        if (e.currencyCode && e.money && e.type !== undefined) {
          const curIndex = moneyArr.findIndex(
            (m) => m.currencyCode === e.currencyCode
          );
          if (curIndex > -1) {
            if (e.type == (this.detailFormData.type === 3 ? 0 : 1)) {
              // 区分收、付款计算方式
              moneyArr[curIndex].money -= +e.money;
            } else {
              moneyArr[curIndex].money += +e.money;
            }
          } else {
            moneyArr.push({
              type: e.type,
              currencyCode: e.currencyCode,
              money:
                e.type == (this.detailFormData.type === 3 ? 0 : 1)
                  ? -e.money
                  : +e.money,
            });
          }
        }
      });
      this.subtotalMoney = moneyArr
        .map((e) => this.formatMoney(e.money) + e.currencyCode)
        .join(" + ");
    },
    seeUploadFn() {
      this.$emit("detailUploadFn");
    },
    submitUploadFile(row) {
      const { attachIds } = row;
      const { id } = this.detailFormData;
      const params = {
        attachId: attachIds.join(","),
        id,
      };

      return POSTUploadPaymentInvoice(params);
    },
  },
  created() {
    this.btnTabsList = [
      {
        label: "账单明细",
        key: "1",
      },
      {
        label: `${this.detailFormData.type === 3 ? "收" : "付"}款记录`,
        key: "2",
      },
      {
        label: "附件信息",
        key: "3",
      },
      {
        label: "操作记录",
        key: "6",
      },
    ];
    if (
      !this.detailFormData.billInfoList ||
      !this.detailFormData.billInfoList.length
    ) {
      // 借款无账单明细
      this.btnTabsList = this.btnTabsList.filter((e) => e.key !== "1");
      this.tabActive = "2";
    }
  },
  mounted() {
    this.handleTabsClick(this.tabActive);
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
    HistoryRecordTable: () => import("./historyRecord.vue"),
    UploadFile: () => import("./uploadFile.vue"),
  },
};
</script>

<style lang="scss" scoped>
.expenses-tabs-box {
  .table {
    margin-top: 15px;
  }
}
</style>
