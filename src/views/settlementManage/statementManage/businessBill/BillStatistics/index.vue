<template>
  <!-- v-if="dialogShow"
@onClose="handleClose" -->
  <ComDialog ref="myDialog" :customDialog="dialogConfig" :confirmClose="false">
    <template v-slot:content>
      <div class="content-padding-20">
        <ComTable
          ref="billDetails"
          :columnConfig="billTable.columnConfig"
          :getQueryParams="() => getQueryParams"
          :columnData="billTable.columnData"
          :pagination="false"
          :extraConfig="{
            stripe: false,
            stripeList: /2|5|8/,
            multiline: true,
          }"
        >
          <template v-slot:customRow="{ slotProps }">
            <!-- <template>
              <span :class="getMarkColor(slotProps.row, slotProps.prop)">
                {{ Math.abs(slotProps.row[slotProps.prop].toFixed(2)) }}
              </span>
            </template> -->
            <template v-if="slotProps.prop === 'moneySubtotal'">
              <span
                :style="{
                  color: getTotal(
                    slotProps.row.notReconciliationReceivable,
                    slotProps.row.notReconciliationPayable
                  ).color,
                }"
                >{{
                  getTotal(
                    slotProps.row.notReconciliationReceivable,
                    slotProps.row.notReconciliationPayable
                  ).total
                }}</span
              >
            </template>
            <template v-if="slotProps.prop === 'recMoneySubtotal'">
              <span
                :style="{
                  color: getTotal(
                    slotProps.row.reconciliationReceivable,
                    slotProps.row.reconciliationPayable
                  ).color,
                }"
                >{{
                  getTotal(
                    slotProps.row.reconciliationReceivable,
                    slotProps.row.reconciliationPayable
                  ).total
                }}</span
              >
            </template>
            <template v-if="slotProps.prop === 'writeSubtotal'">
              <span
                :style="{
                  color: getTotal(
                    slotProps.row.writeOffReceivable,
                    slotProps.row.writeOffPayable
                  ).color,
                }"
                >{{
                  getTotal(
                    slotProps.row.writeOffReceivable,
                    slotProps.row.writeOffPayable
                  ).total
                }}</span
              >
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template v-if="/bwb|fzb/.test(slotProps.column.prop)">
              <div>{{ slotProps.column.labelTop }}</div>
              <div>{{ slotProps.column.labelBtm }}</div>
            </template>
          </template>
        </ComTable>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { mapState } from "vuex";
import { querySearchList } from "@/api/common";
import {
  getBillStatisticsDetail,
  getSettleBillStatistics,
} from "@/api/settlementManage/statementManage";
import { calculation } from "@/utils/calculation";
import { columnData, tableColumns } from "./model";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      dialogShow: false,
      dialogConfig: {
        title: "账单统计",
        width: "1050px",
        footer: [
          {
            text: "关闭",
            plain: true,
            handleClick: () => {
              this.handleClose();
            },
          },
        ],
      },
      billTable: {
        columnConfig: tableColumns || [],
        columnData: [],
      },
    };
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  methods: {
    show() {
      const {
        id: orderId,
        businessType,
        billingMain,
        dealingsCompany,
      } = this.$route.query;
      // getBillStatisticsDetail({
      //   orderId,
      //   businessType,
      //   billingMain,
      //   dealingsCompany,
      // }).then((res) => {
      //   this.billTable.columnData = res.rows || [];
      //   this.$refs.myDialog.show();
      // });
      getSettleBillStatistics(orderId).then((res) => {
        this.billTable.columnData = res.rows || [];
        this.$refs.myDialog.show();
      });
    },
    getTotal(a, b) {
      const total = Number(a || 0) - Number(b || 0);
      if (total > 0) {
        return {
          color: "#53C88A",
          total: this.formatMoney(total),
        };
      }
      if (total < 0) {
        return {
          color: "#FF6767",
          total: this.formatMoney(Math.abs(total)),
        };
      }
      return {
        color: "",
        total: 0,
      };
    },
    handleClose() {
      this.$refs.myDialog.handleClose();
      // this.dialogShow = false;
    },
    getQueryParams() {
      return {};
    },
    getMarkColor(row, prop) {
      if (!row[prop]) return "";
      if (/1|4|7/.test(row.id)) {
        return "red-mark";
      }
      if (/2|5|8/.test(row.id)) {
        return "green-mark";
      }
      if (row[prop] > 0) return "red-mark";
      if (row[prop] < 0) return "green-mark";
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-dialog__body {
    padding-bottom: 30px;
  }
  .red-mark {
    color: #ff6767;
  }
  .green-mark {
    color: #53c88a;
  }
}
.content-padding-20 {
  padding: 0 20px;
}
</style>
