<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :columnData="columnData"
    >
    </ComTable>
    <div class="grand-total" v-if="columnData.length">
      <div class="grand-title">合计：</div>
      <div class="grand-cols">{{ totalNum }}</div>
    </div>
  </div>
</template>

<script>
import { tableColumns } from "./model.js";
import { accumulationFn } from "@/utils/instructions";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableColumns,
      columnData: [],
      totalNum: "",
    };
  },
  methods: {
    setColumnData(columnData = []) {
      this.columnData = columnData;
      this.$refs.tableRef.setNewTableData(columnData);
      const obj = {};
      columnData.map((item) => {
        !obj[item.currencyName] && (obj[item.currencyName] = []);
        if (item.cost) {
          obj[item.currencyName].push(item.cost);
        }
      });
      this.totalNum = Object.keys(obj)
        .map((k) => `${accumulationFn(obj[k], 1)}${k}`)
        .join(" + ");
    },
  },
};
</script>

<style lang="scss" scoped></style>
