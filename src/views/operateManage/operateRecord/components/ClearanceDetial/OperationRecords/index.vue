<template>
  <div class="operation-records">
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :httpRequest="tableConfig.httpRequest"
    >
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./model";
import { getOperationRecords } from "@/api/operateRecord/clearanceGoods.js";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableConfig: {
        tableColumns,
        httpRequest: this.geList,
      },
    };
  },
  methods: {
    geList() {
      return getOperationRecords({
        ...this.params,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.operation-records {
  margin-top: 20px;
}
</style>
