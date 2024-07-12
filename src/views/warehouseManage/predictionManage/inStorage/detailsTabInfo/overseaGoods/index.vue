<template>
  <div>
    <div v-for="(tItem, tIndex) in tableCols" :key="tIndex">
      <div class="base-flex-between export-btn">
        <span class="title">
          {{ tItem.label }}
        </span>
      </div>
      <ComTable
        :columnConfig="tableColumnsFn(tItem.colIndex)"
        :httpRequest="tableConfRequest()"
        :getQueryParams="() => getQueryParams(tIndex)"
        :pagination="false"
        :tableHeight="tableAutoHeight(tIndex)"
        @getResult="(obj) => getTableResult(tIndex, obj)"
      >
        <template v-slot:customRow="{ slotProps }">
          <template
            v-if="
              [
                'sku',
                'forecastNum',
                'forecastVolume',
                'forecastWeight',
                'receivedNum',
              ].includes(slotProps.prop)
            "
          >
            <template v-for="(item, index) in slotProps.row.itemList || []">
              <div
                :key="`2_${index}`"
                :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
              >
                <template>
                  {{
                    toFixedNum(
                      item[slotProps.prop],
                      slotProps.column.decimal
                    ) || "--"
                  }}
                </template>
              </div>
            </template>
          </template>
        </template>
      </ComTable>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { hwTableColumns } from "./model.js";
import {
  getDsGoodsClearanceList,
  getHwGoodsClearanceList,
} from "@/api/operateRecord/customsClearance";

export default {
  props: {
    goodsObj: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableCols: [
        {
          colIndex: 1,
          label: this.overseaLangObj.cargo_details || "货物信息",
        },
      ],
      tableTotalArr: [0], // 计算表格高度
    };
  },
  methods: {
    handleDict(item, val, isName = true) {
      return this.getDictObj(
        [
          "distributionPlanKcState",
          "distributionPlanKdState",
          "distributionPlanZtState",
        ][item.deliveryType - 1],
        val,
        isName
      );
    },
    getQueryParams(idx) {
      const { id } = this.goodsObj;
      // 1-国内清关
      return {
        id, // 操作单ID
      };
    },
    tableConfRequest() {
      const rOpt = {
        1: getDsGoodsClearanceList,
        2: getHwGoodsClearanceList,
      };
      return rOpt[this.goodsObj.viewHwSource || "1"];
    },
    getTableResult(index, { total }) {
      this.$set(this.tableTotalArr, index, total);
    },
    tableColumnsFn() {
      return hwTableColumns({ tName: this.goodsObj.viewHwSource || "1" });
    },
    tableAutoHeight(idx) {
      return this.tableTotalArr[idx] > 9 ? `${10 * 39 + 54}px` : undefined;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "headTransportMode",
      "outWarehouseWay",
      "storageType",
    ]);
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.export-btn {
  margin: 10px 0px;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
