<template>
  <div class="history-bill-box">
    <div class="base-flex-between history-tit">
      <div>
        <span class="tit-label"
          >历史{{ ["付", "收"][historyModel.type] }}款记录</span
        >
        <span class="tit-tip"
          >*{{
            ["付", "收"][historyModel.type]
          }}款账号为内部账号，对应的日报表流水信息</span
        >
      </div>
    </div>

    <ComTable
      ref="historyTableRef"
      :columnConfig="historyTableColumn()"
      :httpRequest="getColumnData"
      @getResult="getResult"
      :pagination="false"
    />
  </div>
</template>

<script>
import { expenseBankReceiptRecord } from "@/api/settlementManage/paymentReceived";
import { historyTableCols } from "../modelDetails";
export default {
  props: {
    historyModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      historyTable: {},
    };
  },
  methods: {
    getColumnData() {
      const { id, taskBillId } = this.historyModel;
      return expenseBankReceiptRecord({
        id,
        taskBillId,
      });
    },
    historyTableColumn() {
      return historyTableCols(this.historyModel.type !== 3 ? 0 : 1);
    },
    getResult({ tableData }) {
      // this.$emit("getEmptyList", !!tableData.length);
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped>
.history-bill-box {
  .history-tit {
    margin: 15px 0 10px;
    .tit-label {
      font-weight: 600;
    }
    .tit-tip {
      margin-left: 20px;
      color: #5094ff;
    }
  }
}
</style>
