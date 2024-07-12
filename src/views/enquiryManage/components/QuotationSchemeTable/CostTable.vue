<template>
  <ComTable
    ref="tableRef"
    :columnConfig="handleColumns(isEdit, isFcl, isOverseasToDoor).column"
    :rowOperationBtnListFn="() => btnList"
    :colShowBtnFn="operationBtn"
    :columnData="columnData"
    class="cost-table"
  >
    <template v-slot:customRow="{ slotProps }">
      <template v-if="slotProps.prop === 'cabinetId'">
        <el-select
          v-model="slotProps.row[slotProps.prop]"
          :placeholder="slotProps.column.label"
          size="mini"
          v-if="isEdit"
        >
          <el-option
            v-for="item in cabinetList || []"
            :key="Number(item.cabinetId)"
            :label="item.cabinetName"
            :value="Number(item.cabinetId)"
          >
          </el-option>
        </el-select>
        <span v-else>{{
          handleVal(slotProps.row[slotProps.prop], slotProps.row.cabinetName)
        }}</span>
      </template>

      <template v-if="['unitPrice'].includes(slotProps.prop)">
        <span v-if="webViewSource.sharePage">{{
          toFixedNum(slotProps.row.unitPriceProfit)
        }}</span>
        <template v-else>
          <DiffMark
            v-if="
              ![2, 3, '2', '3'].includes(queryPage) &&
              slotProps.row.unitPriceProfit &&
              !webViewSource.isAddScheme
            "
            :currentVal="slotProps.row[slotProps.prop]"
            :verifyVal="slotProps.row.unitPriceProfit"
            :decimal="2"
            :showCurrentVal="false"
            :showVerifyVal="false"
          />
          <DiffMark
            v-else-if="[3, '3'].includes(queryPage)"
            :currentVal="slotProps.row.unitPricePayableProfit"
            :verifyVal="slotProps.row[slotProps.prop]"
            :decimal="2"
            :showCurrentVal="false"
            :showVerifyVal="false"
          />
          <span v-else>{{ toFixedNum(slotProps.row[slotProps.prop]) }}</span>
        </template>
      </template>
      <template v-if="['amount'].includes(slotProps.prop)">
        <span v-if="webViewSource.sharePage">{{
          formatMoney(slotProps.row.amountProfit, 2)
        }}</span>
        <template v-else>
          <DiffMark
            v-if="
              ![2, 3, '2', '3'].includes(queryPage) &&
              slotProps.row.amountProfit &&
              !webViewSource.isAddScheme
            "
            :currentVal="slotProps.row[slotProps.prop]"
            :verifyVal="slotProps.row.amountProfit"
            :decimal="2"
            :showCurrentVal="false"
            :showVerifyVal="false"
          />
          <span v-else>{{
            formatMoney(slotProps.row[slotProps.prop], 2)
          }}</span>
        </template>
      </template>
    </template>
  </ComTable>
</template>

<script>
import { handleColumns, handleRule } from "./model";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    isFcl: {
      type: Boolean,
      default: false,
    },
    isOverseasToDoor: {
      type: Boolean,
      default: false,
    },
    columnData: {
      type: Array,
      default: () => [],
    },
    cabinetList: {
      type: Array,
      default: () => [],
    },
    // 引用页面
    webViewSource: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    // 询价单 1：我的询价；2：头程订舱询价；3：海外询价
    queryPage: {
      type: Number,
      default: 1,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
  },
  data() {
    return {
      handleColumns,
      btnList: [
        {
          text: "删除",
          color: "#FF6767",
          handleClick: this.handleDelete,
        },
      ],
      addId: 0,
    };
  },
  methods: {
    operationBtn() {
      if (this.isEdit) {
        return true;
      } else {
        return false;
      }
    },
    getTableData() {
      return this.$refs.tableRef.getNewTableData();
    },
    handleSave() {
      const tableData = this.getTableData();
      const { formRule } = this.handleColumns(
        this.isEdit,
        this.isFcl,
        this.isOverseasToDoor
      );
      if (!tableData.length) {
        this.$message.error("至少添加一条费用信息");
        return false;
      }
      for (let i in tableData) {
        const errMsg = handleRule(tableData[i], formRule);
        if (errMsg) {
          this.$message.error(`第${+i + 1}行，${errMsg}`);
          return false;
        }
        const { num, unitPrice } = tableData[i];
        tableData[i].amount = Number(
          (Number(num || 0) * Number(unitPrice || 0)).toFixed(2)
        );
      }
      console.log(tableData);
      return tableData;
    },
    handleAdd() {
      const { formShippingMode } = this.formData; //formShippingMode    1-海运  2空运
      const tableData = this.getTableData();
      this.$refs.tableRef.setNewTableData([
        {
          amount: undefined,
          costId: !this.isOverseasToDoor
            ? formShippingMode == 1
              ? 127
              : 1001
            : "", //只有国内会默认海/空运费
          costName: !this.isOverseasToDoor
            ? formShippingMode == 1
              ? "海运费"
              : "空运费"
            : undefined,
          currencyId: "",
          num: undefined,
          remark: "",
          unitPrice: undefined,
          temp_only_key: Math.random() + "",
        },
        ...tableData,
      ]);
    },
    handleDelete(row) {
      const tableData = this.getTableData().filter(
        (item) => row.temp_only_key !== item.temp_only_key
      );
      this.$refs.tableRef.setNewTableData([...tableData]);
    },
    handleVal(val, name) {
      const obj = this.cabinetList.find((item) => item.cabinetId === val);
      if (obj) {
        return obj.cabinetName;
      } else {
        return name || "--";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cost-table {
  /deep/ {
    .table-header-cell {
      background-color: #fff;
      .cell {
        border-right: none;
      }
    }
  }
}
</style>
