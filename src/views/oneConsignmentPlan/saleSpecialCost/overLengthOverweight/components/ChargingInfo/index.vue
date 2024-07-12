<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
    >
      <!-- :rowOperationBtnListFn="() => operationBtn" -->
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
      columnData: this.formData.costSpecialChargesRuleDetailList || [
        {
          temp_only_key: Math.random() + "",
          newId: this.newId,
        },
      ],
      newId: 0,
    };
  },
  methods: {
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
      const index = list.findIndex(
        newId ? item.newId === newId : item.id === id
      );
      list.splice(index, 1);
      this.$refs.tableRef.setNewTableData(list);
    },
  },
};
</script>

<style lang="scss" scoped></style>
