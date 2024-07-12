<template>
  <ComTable
    ref="tableRef"
    :tableHeight="type === 4 ? '480px' : '440px'"
    :columnConfig="chartColumns(type, dimensionList)"
    :columnData="columnData"
    :pagination="false"
    :extraConfig="{ stripe: false }"
    :showSummary="type === 4 ? true : false"
    :getSummaries="getSummaries"
    @handleSort="handleSort"
    v-if="show"
  >
    <template v-slot:bottomTotal v-if="type !== 4">
      <div class="total">
        <div class="title">合计：</div>
        <div class="value">
          <template v-for="item in totalConfig">
            <TooltipOver
              :class="`tooltip ${item.align && 'tooltip_right'}`"
              :key="item.prop"
              :content="toFixedNum(grossTotal[item.prop] || 0, item.decimal)"
              :style="{
                width: item.width ? `${item.width}px` : '72px',
              }"
            />
          </template>
        </div>
      </div>
    </template>
  </ComTable>
</template>

<script>
import { chartColumns, totalConfig } from "../model.js";
export default {
  props: {
    type: {
      type: Number,
      default: 0,
    },
    grossTotal: {
      type: Object,
      default: () => ({}),
    },
    dimensionList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      chartColumns,
      totalConfig,
      columnData: [],
      show: true,
    };
  },
  methods: {
    setTableData(list, isSort) {
      this.columnData = list;
      if (isSort) {
        this.$refs.tableRef?.setNewTableData(list);
        return;
      }
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        this.$refs.tableRef?.setNewTableData(list);
      });
    },
    handleSort(data) {
      this.$emit("handleSort", data);
    },
    getSummaries() {
      const sums = ["合计："];
      this.dimensionList.map((item) => {
        sums.push(this.grossTotal[item.totalProp]);
      });
      sums.push(this.grossTotal.total);
      return sums;
    },
  },
};
</script>

<style lang="scss" scoped>
.total {
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  padding-left: 19px;
  background: rgba(80, 148, 255, 0.12);

  .title {
    font-size: 14px;
    font-weight: 500;
  }
  .value {
    display: flex;
  }
  .tooltip {
    width: 72px;
    font-weight: 500;
    padding: 0 8px;

    &.tooltip_right {
      justify-content: flex-end;
    }
  }
}
</style>
