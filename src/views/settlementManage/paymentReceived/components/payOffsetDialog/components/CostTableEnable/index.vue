<template>
  <div>
    <div class="base-flex-between">
      <div class="title">费用明细</div>
      <el-button type="primary" @click="addCost()">新增费用</el-button>
    </div>
    <div>
      <ComTable
        ref="tableRef"
        :columnConfig="tableConfig.columnConfig"
        :columnData="tableConfig.columnData"
        :rowOperationBtnListFn="() => statusList"
        @handleChange="handleChange"
      >
      </ComTable>
      <div class="grand-total" v-if="subtotalMoney">
        <span class="title">报销金额小计：</span>
        <span>{{ subtotalMoney }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { tableColumns, handleRule } from "./model.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableConfig: {
        columnData: [],
        columnConfig: tableColumns,
      },
      statusList: [
        {
          text: "删除",
          handleClick: this.handleDelete,
        },
      ],
      subtotalMoney: "",
    };
  },
  methods: {
    addCost() {
      // 默认应付
      const { currencyId = undefined, currencyCode = undefined } =
        this.formData;
      const list = [
        {
          type: 0,
          currencyId,
          currencyCode,
          money: undefined,
          costId: undefined,
        },
        ...(this.$refs.tableRef.tableData || []),
      ];
      this.$refs.tableRef.setNewTableData(list);
    },
    setTableData(rows) {
      this.tableConfig.columnData = rows;
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
      this.calcTotal(rows);
    },
    getTableVerify() {
      const list = this.$refs.tableRef.tableData || [];
      if (!list.length) {
        this.$message.error("请添加费用，至少一条");
        return false;
      }
      for (let i = 0; i < list.length; i++) {
        const err = handleRule(list[i]);
        if (err) {
          this.$message.error(`费用第${i + 1}行，${err}`);
          return false;
        }
      }
      return list;
    },
    handleDelete(row) {
      const list = this.$refs.tableRef.tableData || [];
      const index = list.findIndex(
        (item) => item.temp_secondId === row.temp_secondId
      );
      if (index > -1) {
        list.splice(index, 1);
        this.$refs.tableRef.setNewTableData(list);
        this.calcTotal(list);
      }
    },
    handleChange(e, type, row) {
      if (type === "money" || type === "type") {
        this.calcTotal();
      }
    },
    calcTotal(rows) {
      const list = rows || this.$refs.tableRef.tableData || [];
      const { currencyCode } = this.formData;
      this.subtotalMoney = "";
      if (!list.length) {
        this.$emit("subtotalMoney", 0);
        return;
      }
      let moneyArr = 0;

      list.forEach((e) => {
        //e.type 0应付  1应收
        if (e.currencyCode && e.money && e.type !== undefined) {
          if (e.type !== 1) {
            moneyArr += +e.money;
          } else {
            moneyArr -= +e.money;
          }
        }
      });
      this.subtotalMoney = `${this.formatMoney(moneyArr)}${currencyCode}`;
      this.$emit("subtotalMoney", moneyArr);
    },
  },
};
</script>
<style lang="scss" scoped>
.base-flex-between {
  margin-bottom: 3px;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
}
.grand-total > span {
  padding-left: 0;
}
</style>
