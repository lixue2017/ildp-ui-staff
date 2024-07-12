<template>
  <div class="bill-details">
    <div class="title-rows">
      <div class="title-box">
        <span class="title">账单明细</span>
        <el-checkbox
          v-model="isChecking"
          v-if="basicConfig.showCheckbox"
          @change="handleSelect"
        >
          显示已对帐
        </el-checkbox>
      </div>
      <div class="right-box">
        <div class="summation">
          <span v-for="item in summationConfig" :key="item.prop">
            <span>{{ item.label }}</span>
            <span>{{ formData[item.prop] || "--" }}</span>
          </span>
        </div>
        <el-button
          @click="handleGenerate"
          type="primary"
          size="small"
          class="create-btn"
          :disabled="!checkRows.length"
        >
          生成对帐单
        </el-button>
        <el-button
          @click="batchGenerateBill"
          type="primary"
          size="small"
          class="create-btn"
          :disabled="!checkRows.length"
        >
          批量生成对帐单
        </el-button>
      </div>
    </div>
    <ComTable
      ref="billDetails"
      :columnConfig="billTable.columnConfig"
      :httpRequest="billTable.httpRequest"
      :getQueryParams="getQueryParams"
      @onSelectionChange="onSelectionChange"
      :isMountedRequest="billTable.isMountedRequest"
      :selectionRow="selectionRow"
      :pagination="basicConfig.pagination !== false"
    >
    </ComTable>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { duplicateRemoval } from "@/utils/index";
import {
  settleAccountsList,
  batchGenerateBill,
} from "@/api/settlementManage/statementManage";
import { msgBox } from "@/utils/confirmBox.js";
import {
  summationConfig,
  businessBillColumns,
  enterpriseBillColumns,
} from "./model";
export default {
  props: {
    basicConfig: {
      type: Object,
      default: () => {
        return {
          showCheckbox: false,
          pagination: true,
        };
      },
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  data() {
    return {
      isChecking: true, // 默认勾选-包含已对账
      summationConfig,
      formData: {},
      billTable: {},
      columnConfig: [],
      checkRows: [],
    };
  },
  created() {
    const { type } = this.basicConfig;
    const configType = {
      business: businessBillColumns,
      enterprise: businessBillColumns,
      // enterprise: enterpriseBillColumns,
    };
    const configRequest = {
      business: settleAccountsList,
      enterprise: settleAccountsList,
    };
    this.billTable = {
      ...this.billTable,
      isMountedRequest: type !== "enterprise",
      columnConfig: configType[type],
      httpRequest: configRequest[type],
    };
  },
  methods: {
    getQueryParams() {
      // console.log("isChecking", this.isChecking);
      const {
        type,
        orderId: baseId = undefined,
        orderNum = undefined,
      } = this.basicConfig;
      if (type === "enterprise") {
        const { billingMain, dealingsCompany } = this.$route.query;
        return {
          billingMain,
          dealingsCompany,
          orderNum,
          orderId: baseId,
          // businessTypeList: "0,4", //0操作单 1订舱单 2拼柜单 3清关单 4订单
        };
      }
      const { id: orderId, businessType } = this.$route.query;
      return {
        orderId: orderId,
        businessType,
        // businessTypeList: "0,4", //0操作单 1订舱单 2拼柜单 3清关单 4订单
        isGenerateStatement: this.isChecking ? "" : 0,
        isMainOrder: 1,
      };
    },
    handleSelect() {
      // this.getQueryParams();
      const { type, orderId } = this.basicConfig;
      if (type === "enterprise" && !orderId) {
        this.$refs["billDetails"].setNewTableData([]);
      } else {
        this.$refs["billDetails"].refreshTable(true);
      }
    },
    confirmNext() {
      return new Promise((resolve) => {
        const title = "警告提示";
        const className = "el-icon-warning text-warning";
        const msg = "币别不一致是否进入下一步！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    confirmGenerateBill(num) {
      return new Promise((resolve) => {
        const title = "提示";
        const className = "el-icon-success text-success";
        const msg = `确定将${num}条费用生成对账单？`;
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    batchGenerateBill() {
      const billIds = this.checkRows.map((item) => item.id);
      this.confirmGenerateBill(billIds.length).then(() => {
        batchGenerateBill({
          billIds,
        }).then(() => {
          this.onSelectionChange();
          this.$refs["billDetails"].refreshTable(true);
        });
      });
    },
    handleGenerate() {
      this.$message.closeAll();
      const { billingMain, dealingsCompany, type, currencyId } =
        this.checkRows[0];
      const typeIndex = this.checkRows.findIndex((e) => type !== e.type);
      if (typeIndex > -1) {
        return this.$message.error("应收应付类型不一致不可生成账单");
      }
      const index = this.checkRows.findIndex(
        (e) =>
          billingMain !== e.billingMain || dealingsCompany !== e.dealingsCompany
      );
      if (index > -1) {
        return this.$message.error("计费主体与往来单位不一致不可生成账单");
      }
      const currencyIndex = this.checkRows.findIndex(
        (e) => currencyId !== e.currencyId
      );
      if (type === 0 && currencyIndex > -1) {
        return this.$message.error("货币不一致不可生成账单");
      }
      const nextFu = () => {
        const rowIds = this.checkRows.map((e) => e.id);
        const idRows = duplicateRemoval(rowIds).join(",");
        this.$router.push({
          path: "/settlementManagement/statementManage/editBillManage",
          query: {
            idRows,
            backPath: this.$route.fullPath,
            activeTab: "1", // 1为新增
          },
        });
      };
      if (currencyIndex > -1) {
        this.confirmNext().then(() => {
          nextFu();
        });
      } else {
        nextFu();
      }
    },
    onSelectionChange(rows = []) {
      const nRows = rows.filter((e) => !e.isGenerateStatement);
      // this.checkRows = nRows;
      const row = nRows[0] || {};
      this.checkRows = nRows.filter(
        (e) =>
          // e.billingMainName === row.billingMainName && //记账主体
          // && e.currency === row.currency //货币类型
          e.type === row.type //收付类型
      );
      const standardCurrency = this.checkRows.reduce((pre, cur) => {
        return pre + cur.totalAmount * cur.bhl;
      }, 0);
      const assistCurrency = this.checkRows.reduce((pre, cur) => {
        return pre + cur.totalAmount * cur.fzhl;
      }, 0);
      this.formData = {
        count: this.checkRows.length,
        standardCurrency: standardCurrency.toFixed(2),
        assistCurrency: assistCurrency.toFixed(2),
      };
      this.$refs.billDetails._toggleRowSelectionMixin({
        newCheckRows: this.checkRows,
      });
    },
    selectionRow(row) {
      //  || row.lockOrder // 锁单可以生成对账单
      if (row.isGenerateStatement === 1) {
        return false;
      }
      // const nRow = this.checkRows[0] || {};
      // const { type } = nRow;
      let rSome;
      rSome = this.checkRows.some(
        (e) =>
          // e.billingMainName === row.billingMainName && //记账主体
          e.type === row.type //收付类型
        //  && e.currency === row.currency //货币类型
      );
      if (this.checkRows.length && !rSome) {
        return false;
      }
      return true;
      // return !row.isGenerateStatement;
    },
    setSelectionRow(list = []) {
      const tableData = this.$refs.billDetails.tableData || [];
      const checkRows = tableData.filter((row) => {
        if (list.includes(row.orderId) && !row.isGenerateStatement) {
          this.$refs.billDetails.toggleRowSelection(row);
          return row;
        } else {
          this.$refs.billDetails.toggleRowSelection(row, false);
          return false;
        }
      });
      this.onSelectionChange(checkRows);
      // console.log(tableList);
      // this.$refs.billDetails._toggleRowSelectionMixin();
    },
  },
};
</script>

<style lang="scss" scoped>
.title-rows {
  display: flex;
  justify-content: space-between;
  height: 56px;
  .title-box {
    align-self: center;
    .title {
      font-weight: bold;
      color: #515151;
      font-size: 14px;
      margin-right: 20px;
    }
  }
  .right-box {
    display: flex;
  }
  .summation {
    align-self: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // width: 474px;
    height: 30px;
    line-height: 30px;
    background: rgba(80, 148, 255, 0.05);
    box-shadow: 0px 0px 3px 0px rgba(20, 69, 147, 0.25);
    border-radius: 20px;
    padding: 0 30px;
    margin-right: 55px;
  }
  .create-btn {
    align-self: center;
  }
}
</style>
