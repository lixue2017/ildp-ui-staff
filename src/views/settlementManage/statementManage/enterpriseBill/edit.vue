<template>
  <div class="app-content-container">
    <ComDetailTop
      title="企业对账单"
      class="title-sides-margin-none"
      ref="detailTopRef"
      :config="{}"
    />
    <div class="top-box">
      <div class="detail-card">
        <template v-for="card in cardConfig">
          <div
            :style="`background-color: ${card.bgColor}`"
            class="card-tags"
            :key="card.prop"
          >
            <!-- <div
                v-if="card.prop !== 'orderNo'"
                :class="`iconfont ${card.icon}`"
                :style="`color: ${card.valueColor}`"
              ></div> -->
            <div :style="`color: ${card.valueColor}`" class="order-no">
              <div>
                <span class="order-label">{{ card.labelArr[0] }}</span>
                <span v-if="card.valueNumArr">
                  ￥{{ formatMoney(initInfo[card.valueArr[0]]) }} ({{
                    initInfo[card.valueNumArr[0]]
                  }}票)
                </span>
                <span v-else>{{ initInfo[card.valueArr[0]] }}</span>
              </div>
              <div style="margin-top: 5px">
                <span class="order-label">{{ card.labelArr[1] }}</span>
                <span v-if="card.valueNumArr">
                  ￥{{ formatMoney(initInfo[card.valueArr[1]]) }} ({{
                    initInfo[card.valueNumArr[1]]
                  }}票)
                </span>
                <span v-else>
                  <template v-if="card.valueArr[1] === 'settleCycle'"
                    >({{
                      accountCycle &&
                      accountCycle[initInfo["settleCycle"]] &&
                      accountCycle[initInfo["settleCycle"]].nameCn
                    }})</template
                  >
                  <template v-else>{{ initInfo[card.valueArr[1]] }}</template>
                </span>
              </div>
            </div>
            <!-- <div class="card-addr">
                <template v-if="card.prop === 'orderNo'">
                  <div :style="`color: ${card.valueColor}`" class="order-no">
                    <span>
                      <span class="order-label"> 企业名称：</span>
                      {{ initInfo.operationOrderNum }}
                    </span>
                    <span style="margin-top: 5px">
                      <span class="order-label"> 记账主体：</span>
                      {{ initInfo.orderNum }}
                    </span>
                  </div>
                </template>
              </div> -->
          </div>
        </template>
      </div>
    </div>
    <el-container class="left-table">
      <el-aside class="left" width="382px">
        <ComTable
          ref="selectTable"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="getQueryParams"
          :pagination="false"
          :current-row="true"
          @onCurrentChange="(row) => onLeftCurRowChange(row)"
          @getResult="getLeftTableResult"
          selectionKey="orderId"
          @onSelectionChange="selectionChange"
        >
        </ComTable>
        <!-- <my-pagination
            v-if="pagination"
            :page="start"
            :limit="paginationConfig.limit"
            :total="total"
            :layout="paginationConfig.layout"
            @pagination="handlePagination"
          /> -->
      </el-aside>
      <el-main class="right">
        <BillDetails :basicConfig="billDetailsConfig" ref="rightTableRef" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import {
  settleCusBillList,
  getAccountsenterprise,
} from "@/api/settlementManage/statementManage";
import { cardConfig, leftTableColumns } from "./editModel";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    MyPagination: () => import("_comp/ComTable/MyPagination"),
    BillDetails: () => import("../../components/BillDetails"),
  },
  computed: {
    ...mapState({
      accountCycle: (state) => state.dictionary.dicsData?.accountCycle,
    }),
  },
  data() {
    return {
      cardConfig,
      initInfo: {},
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        httpRequest: getAccountsenterprise,
        columnConfig: leftTableColumns,
      },
      start: 1,
      pagination: true,
      total: 0,
      paginationConfig: {
        limit: 10,
        layout: "total, prev, pager, next",
      },
      billDetailsConfig: {
        type: "enterprise",
        orderIds: "",
        pagination: true,
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary");
  },
  mounted() {
    this.getInitDetail();
  },
  methods: {
    getInitDetail() {
      const { billingMain, dealingsCompany } = this.$route.query;
      settleCusBillList({ billingMain, dealingsCompany }).then((res) => {
        if (res.rows?.length) {
          this.initInfo = res.rows[0] || {};
        } else {
          this.$refs.detailTopRef?.comReBack();
        }
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {
      const { billingMain, dealingsCompany } = this.$route.query;
      return { billingMain, dealingsCompany };
    },
    getLeftTableResult({ tableData = [] }) {
      this.$refs.selectTable?.setComCurrentRow(tableData[0]);
    },
    onLeftCurRowChange(leftRow) {
      this.$set(this.billDetailsConfig, "pagination", !!leftRow.orderId);
      this.$set(this.billDetailsConfig, "orderId", leftRow.orderId);
      this.$set(this.billDetailsConfig, "orderNum", leftRow.orderNum);
      this.$refs.rightTableRef?.handleSelect();
    },
    selectionChange(checkRowList) {
      const ids = checkRowList.map((e) => e.orderId);
      // this.$set(this.billDetailsConfig, "orderIds", row?.orderId);
      this.$refs.rightTableRef?.setSelectionRow(ids);
      // console.log("checkRowList", checkRowList);
    },
    handlePagination({ page, limit }) {
      this.start = page;
      this.paginationConfig.limit = limit;
      // this.refreshTable(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
  .top-box {
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 15px;
    .detail-card {
      display: flex;
      flex: 1;
      justify-content: space-between;
      & > div {
        display: flex;
        align-items: center;
        padding: 19px 26px 19px 12px;
        margin-right: 13px;
        .iconfont {
          font-size: 35px;
          margin-right: 10px;
        }
        .label {
          font-size: 12px;
          margin-bottom: 6px;
        }
        .value {
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .card-addr {
        flex: 1;
        font-size: 15px;
        .value {
          display: flex;
          width: 100%;
          justify-content: flex-start;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
        }
        .line {
          width: 21px;
          height: 1px;
          border-bottom: 1px #5094ff dashed;
          margin: 0 5px;
        }
        .order-no {
          display: flex;
          flex-direction: column;
        }
        .order-label {
          font-size: 12px;
        }
      }
      .card-tags {
        flex: 1;
      }
    }
    .basic-info {
      padding-left: 80px;
      padding-top: 5px;
      /deep/.el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .el-main {
    padding: 0;
  }
  .left-table {
    .left {
      background: #fff;
      border-right: 1px solid #e2e2e2;
      margin-bottom: 0;
      padding: 0 10px;
      /deep/ {
        .el-table--border {
          border-top: none;
        }
        .table-header-cell {
          background: #fff;
        }
      }
    }
    .right {
      padding: 0 12px;
    }
  }
  // }
}
</style>
