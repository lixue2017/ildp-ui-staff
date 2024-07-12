<template>
  <div>
    <div v-for="(tItem, tIndex) in tableCols" :key="tIndex">
      <div class="base-flex-between export-btn">
        <span class="title">
          {{ tItem.label }}
        </span>
        <div v-if="tItem.colIndex === 1">
          <el-button
            size="small"
            type="primary"
            round
            @click="handleGoodsExport"
          >
            {{ overseaLangObj.export_cargo_size || "导出货物箱规表" }}
          </el-button>
          <el-button size="small" type="primary" round @click="handleExport">
            {{ overseaLangObj.dc_export("导 出") }}
          </el-button>
        </div>
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
                'pltNum',
                'targetWmsName',
                'targetWmsAddress',
                'deliveryNum',
                'deliveryVolume',
                'deliveryWeight',
                'deliveryType',
                'deliveryTime',
                'deliveryState',
                'deliveryCode',
                'num',
                'traySn',
                'localCode',
                'receiptType',
              ].includes(slotProps.prop)
            "
          >
            <template
              v-for="(item, index) in slotProps.row[
                ['deliveryInfoList', 'ccInfoList'][tIndex]
              ] || []"
            >
              <div
                :key="`2_${index}`"
                :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
              >
                <template v-if="slotProps.column.basicType">
                  <span
                    v-if="slotProps.prop === 'deliveryState'"
                    :style="{
                      color: handleDict(item, item[slotProps.prop], false)
                        .color,
                    }"
                  >
                    {{ handleDict(item, item[slotProps.prop]) || "--" }}
                  </span>
                  <template v-else>
                    {{
                      getDictObj(
                        slotProps.column.basicType,
                        item[slotProps.prop]
                      ) || "--"
                    }}
                  </template>
                </template>
                <template v-else>
                  {{ item[slotProps.prop] || "--" }}
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
import { comFileDownload } from "@/utils/download.js";
import { psTableColumns, storageTableCols } from "./model.js";
import {
  sendInfoExport,
  sendInfoClearanceExport,
  exportBoxGauge,
  getClearanceGoodsPsList,
} from "@/api/warehouse/prediction";
export default {
  props: {
    dispatchObj: {
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
          label: this.overseaLangObj.ps_delivery_info || "派送信息",
        },
        {
          colIndex: 2,
          label: this.overseaLangObj.storage_info("存仓信息"),
        },
      ],
      tableTotalArr: [0, 0], // 计算表格高度
    };
  },
  methods: {
    handleGoodsExport() {
      comFileDownload(this, exportBoxGauge, this.getQueryParams(11));
    },
    handleExport() {
      const { viewSource } = this.dispatchObj;
      let httpExport = sendInfoExport;
      if (viewSource === "clearanceTab") {
        httpExport = sendInfoClearanceExport;
      }
      comFileDownload(this, httpExport, this.getQueryParams(11));
    },
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
      const { psId, psType, searchRelatedOrder } = this.dispatchObj;
      if (idx === 11) {
        return {
          operationId: psId,
        };
      }
      return {
        id: psId, // 操作单ID
        searchRelatedOrder, // 清关-true 订单-false
        type: psType || 1, // 1-国内/电商 2-海外
        storageWay: [1, 0][idx], // 0-存仓 1-派送
      };
    },
    tableConfRequest() {
      return getClearanceGoodsPsList;
    },
    getTableResult(index, { total }) {
      this.$set(this.tableTotalArr, index, total);
    },
    tableColumnsFn(idx) {
      if (idx === 1) {
        return psTableColumns(this.dispatchObj);
      } else {
        return storageTableCols(this.dispatchObj);
      }
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
      "distributionType",
      "distributionPlanKcState",
      "distributionPlanKdState",
      "distributionPlanZtState",
      "warehouseStorage",
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
