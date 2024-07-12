<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
    >
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./model.js";
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
        tableColumns,
      },
      columnData: this.formData.customerList || [],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>