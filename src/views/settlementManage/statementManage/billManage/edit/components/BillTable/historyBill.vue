<template>
  <div class="history-bill-box">
    <!-- 收付款任务单详情有引用 -->
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
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop == 'operation'">
          <div class="operation-btn">
            <div v-for="(item, index) in getBtnLists(slotProps.row)" :key="index">
              <PreviewOrDownload
                :btnTxt="item.text"
                :previewDownloadConf="item.handleClick(slotProps.row)"
              />
            </div>
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { historyTableCols } from "./model";
import { settleCashierPreview , getCashierVoucherPreview } from "@/api/settlementManage/paymentReceived.js"
export default {
  props: {
    historyModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    httpRequest: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      historyTable: {},
      statusList: [
        {
          text: "收款凭证",
          showStatus: [100],
          handleClick: (row) => {
            const { taskBillId:id } = row;
            return {
              previewParam: { id },
              previewHttp: getCashierVoucherPreview,
            };
          },
        },
        {
          text: "明细凭证",
          showStatus: [100],
          handleClick: (row) => {
            const { taskBillId:id } = row;
            return {
              previewParam: { id },
              previewHttp: settleCashierPreview,
            };
          },
        },
      ],
    };
  },
  watch: {
    "historyModel.id"(val) {
      if (val) {
        this.$refs.historyTableRef?.refreshTable();
      }
    },
  },
  methods: {
    getColumnData() {
      return this.httpRequest({
        id: this.historyModel.id,
      });
    },
    historyTableColumn() {
      return historyTableCols(this.historyModel.type);
    },
    getResult({ tableData }) {
      this.$emit("getEmptyList", !!tableData.length);
    },
    getBtnLists(row) {
      const { status } = row;
      const arr = this.statusList.filter((e) => {
        const { showStatus } = e;
        return showStatus.includes(status);
      });
      return arr;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
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
  .operation-btn{
    display:flex
  }
}
</style>
