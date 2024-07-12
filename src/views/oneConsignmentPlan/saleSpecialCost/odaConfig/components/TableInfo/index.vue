<template>
  <div class="cost-table">
    <div class="top">
      <div class="title">区域信息</div>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :columnData="formData.costOdaAreaList || []"
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
      default: () => {},
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableColumns,
    };
  },
};
</script>

<style lang="scss" scoped>
.cost-table {
  border-top: 1px solid #e2e2e2;
}
.top {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .btn {
    padding: 24px 0 15px;
  }
}
</style>