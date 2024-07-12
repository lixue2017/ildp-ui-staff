<template>
  <div class="detail-table">
    <div class="title">
      <div class="title-left">{{ chargeInfo.title }}</div>
      <div class="title-right">
        <el-button
          :type="createdBillBtn.type"
          :disabled="createdBillBtn.disabled"
          @click="createdBillBtn.handleClick"
          >{{ createdBillBtn.text }}</el-button
        >
      </div>
    </div>
    <div class="bill-dis-grid" v-if="billInfoList && billInfoList.length">
      <div
        v-for="(bItem, bIdx) in billInfoList"
        :key="bIdx"
        class="bill-item-box"
      >
        <template v-if="bIdx === 0">
          <p class="conversion-txt1">利润折合RMB：</p>
          <p class="conversion-txt2">{{ bItem.baseMoney }}</p>
          <p class="conversion-txt1">利润折合USD：</p>
          <p class="conversion-txt2">{{ bItem.helpMoney }}</p>
        </template>
        <template v-else>
          <p class="bill-item-txt1">{{ bItem.currency }}</p>
          <p class="bill-item-txt2">
            应收：<span>{{ bItem.paymentMoney }}</span>
          </p>
          <p class="bill-item-txt2">
            应付：<span>{{ bItem.payeeMoney }}</span>
          </p>
          <p class="bill-item-txt2">
            利润：<span>{{ bItem.profitMoney }}</span>
          </p>
        </template>
      </div>
    </div>
    <ComTable
      ref="tableConfig"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableConfig.columnConfig"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="() => getQueryParams()"
      @onSelectionChange="onSelectionChange"
      :selectionRow="selectionRowEvt"
      :pagination="false"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'type'">
          <span
            :style="{
              color: slotProps.dicsList && slotProps.dicsList.color,
            }"
            >{{ slotProps.dicsList.nameCn }}</span
          >
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content">
            <div
              class="operation-Btn"
              v-for="(item, index) in tableConfig.statusList[
                slotProps.row.isGenerateStatement || 0
              ]"
              :key="index"
            >
              <el-button
                class="operate-icon"
                size="small"
                type="text"
                @click="item.handleClick(slotProps.row)"
              >
                {{ item.text }}
              </el-button>
            </div>
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { chargeInfo } from "./model";
import {
  settleAccountsOrderList,
  deleteSettleAccounts,
} from "@/api/settlementManage/statementManage";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {
          encasementWay: 1,
          pickUpHome: false,
        };
      },
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      chargeInfo,
      tableConfig: {
        // tableHeight: "calc(100vh - 264px)",
        columnConfig: chargeInfo.columns,
        httpRequest: this.settleAccountsOrderList,
        // httpRequest: getTraditionListAll,
        statusList: {
          0: [
            {
              text: "修改",
              handleClick: (row) => {
                this.$emit("handleUpdateBill", row);
              },
            },
            {
              text: "删除",
              handleClick: this.handleDelete,
            },
          ],
        },
      },
      billInfoList: [],
      selectionRows: [], //用户选择账单数组
      createdBillBtn: {
        //生成对账单按钮
        text: "生成对账单",
        disabled: true,
        type: "primary",
        handleClick: (rows) => {
          this.createdBill();
        },
      },
    };
  },
  methods: {
    // getTableResult({ resultData }) {
    //   this.billInfoList = resultData.rows?.billInfoList || []
    //   this.$refs.tableConfig.setNewTableData(resultData.rows?.billList || [])
    // },
    getQueryParams() {
      return {
        // businessType: 0, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        isBussiness: 1,
        orderId: this.formModel.id, //订单id
      };
    },
    refreshTable() {
      this.$refs.tableConfig.refreshTable(true);
    },
    handleDelete(row) {
      if (row.id) {
        deleteSettleAccounts(row.id).then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.refreshTable();
        });
      }
    },
    settleAccountsOrderList(rows, data) {
      return settleAccountsOrderList({
        ...rows,
        number: this.formModel.number,
      }).then((res) => {
        this.billInfoList = res.data?.billInfoList || [];
        this.$refs.tableConfig.setNewTableData(res.data?.billList || []);
      });
    },
    createdBill() {
      //生成对账单
      this.$emit("createdBill", this.selectionRows);
    },
    onSelectionChange(rows) {
      //选择相应的账单
      this.selectionRows = rows;
      this.createdBillBtn.disabled = !rows.length;
    },
    selectionRowEvt(row) {
      //列表条件选择，不满足条件置灰
      if (row.isGenerateStatement === 1) {
        //1已经生成过对账单，0未生成过对账单，排除已经生成过对账单的账单
        return false;
      }
      const rSome = this.selectionRows.some(
        (e) =>
          e.dealingsCompanyName === row.dealingsCompanyName && //往来单位
          e.type === row.type //收付类型
      );
      if (this.selectionRows.length && !rSome) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-table {
  // margin-top: -22px;
  /deep/ .tableData .table-header-cell {
    background-color: #f8f8f8;
  }
  .title {
    display: flex;
    justify-content: space-between;
    // align-items: flex-end;
    align-items: center;

    .title-left {
      font-size: 14px;
      font-weight: bold;
      line-height: 22px;
      padding: 14px 0 11px;
      color: #515151;
    }
    .radio {
      font-size: 13px;
      .el-radio {
        margin-right: 6px;
      }
      /deep/ {
        .el-radio__label {
          padding-left: 0;
        }
      }
    }
    .checkbox {
      font-size: 13px;
      padding: 0 35px;
      /deep/ .el-checkbox__label {
        padding-left: 0;
      }
      /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
        background-color: #5094ff;
        border-color: #5094ff;
        &::after {
          border-color: #fff;
        }
      }
    }
  }
  .pics-box {
    img {
      width: 50px;
      height: 40px;
      vertical-align: middle;
    }
  }
  .operation-content {
    display: flex;
  }
}
</style>
