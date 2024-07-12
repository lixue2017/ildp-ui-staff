<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
      :rowOperationBtnListFn="() => operationBtn"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop == 'costSpecialChargesRuleId'">
          <AutoComplete
            ref="chargesRuleRef"
            :formModel="slotProps.row"
            :fieldItem="{
              ...slotProps.column.fieldItem,
              id: slotProps.prop,
              focusLoad: true,
              placeholder: slotProps.column.label,
              disabled: !formData.logisticsProductId || !formData.warehouseId,
              placeholder:
                !formData.logisticsProductId || !formData.warehouseId
                  ? (!formData.warehouseId && '请先选择计费仓') ||
                    (!formData.logisticsProductId && '请先选择物流产品')
                  : slotProps.column.label,
              handle: (val) =>
                handleChange(
                  val,
                  'costSpecialChargesRuleId',
                  slotProps.rowIndex
                ),
            }"
            :additionalParam="{
              logisticsProductId: formData.logisticsProductId,
              warehouseId: formData.warehouseId,
            }"
          />
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { handleColumns, handleRule } from "./model.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  watch: {
    "formData.warehouseId"(val) {
      console.log(val);
      this.handleChangeRule();
    },
    "formData.logisticsProductId"(val) {
      console.log(val);
      this.handleChangeRule();
    },
  },
  data() {
    return {
      operationBtn: [
        {
          text: "删除",
          type: "delete",
          color: "#ff6767",
          handleClick: this.handleDelete,
        },
      ],
      tableConfig: {
        tableColumns: handleColumns(this.isDetail),
      },
      columnData: this.formData.costSpecialChargesPriceRuleList || [],
      newId: 0,
      ruleRefreshRequest: false,
    };
  },
  methods: {
    handleChange(val, prop, index) {
      console.log(val);

      if (prop === "costSpecialChargesRuleId") {
        const [...lists] = this.$refs.tableRef.getNewTableData();
        if (val) {
          const {
            channelSupport,
            settleCostTypeName,
            typeName,
            id: costSpecialChargesRuleId,
            code: costSpecialChargesCode,
          } = val || {};
          const params = {
            ...lists[index],
            costSpecialChargesRuleId,
            costSpecialChargesCode,
            channelSupport,
            settleCostTypeName,
            typeName,
          };
          lists[index] = params;
        } else {
          const params = {
            ...lists[index],
            costSpecialChargesRuleId: "",
            costSpecialChargesCode: "",
            channelSupport: "",
            settleCostTypeName: "",
            typeName: "",
          };
          lists[index] = params;
        }
        this.$refs.tableRef.setNewTableData(lists);
      }
    },
    getTableList() {
      const lists = this.$refs.tableRef.getNewTableData();
      if (!lists.length) {
        this.$message.error("计费信息不能为空！");
        return;
      }
      for (let i = 0; i < lists.length; i++) {
        const error = handleRule(lists[i]);
        if (error) {
          this.$message.error(`第${i + 1}行，${error}`);
          return false;
        }
      }
      return lists;
    },
    handleAdd() {
      this.newId += 1;
      const list = this.$refs.tableRef.getNewTableData();
      const params = {
        temp_only_key: Math.random() + "",
        newId: this.newId,
      };
      this.$refs.tableRef.setNewTableData([...list, params]);
    },
    handleDelete(row, btn) {
      const { id, newId } = row;
      const list = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex((item) =>
        newId ? item.newId === newId : item.id === id
      );
      list.splice(index, 1);
      this.$refs.tableRef.setNewTableData(list);
    },
    handleChangeRule() {
      const lists = this.$refs.tableRef.getNewTableData();
      lists.forEach((item) => {
        item.costSpecialChargesRuleId = "";
        item.costSpecialChargesCode = "";
        item.typeName = "";
        item.channelSupport = "";
        item.settleCostTypeName = "";
      });
      this.$refs.tableRef.setNewTableData(lists);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input.is-disabled {
  .el-input__inner {
    &::placeholder,
    &::-webkit-input-placeholder,
    &::-moz-placeholder,
    &::-ms-input-placeholder {
      color: #fa7a7a;
    }
  }
}
</style>
