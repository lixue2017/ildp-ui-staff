<template>
  <div>
    <div>
      <span>费用明细</span>
    </div>
    <div>
      <ComTable
        ref="tableRef"
        :columnConfig="tableConfig.columnConfig"
        :columnData="tableConfig.columnData"
        :rowOperationBtnListFn="() => statusList"
      >
      </ComTable>
    </div>
  </div>
</template>

<script>
import {tableColumns} from "./model.js"
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableConfig: {
        columnData: [],
        columnConfig: tableColumns(),
      },
      statusList: [
        {
          text: "删除",
          handleClick: (formModel) => {

          },
        },
      ],
    };
  },
  methods: {
    setTableData(rows){
      this.tableConfig.columnData=rows
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
    }
  },
};
</script>
<style lang="scss" scoped></style>
