<template>
  <div>
    <div class="goods-info flex-space-between">
      <span class="title">{{overseaLangObj.cargo_details || "货物信息"}}</span>
      <div>
        <el-radio-group
          v-model="goodsForm.issueType"
          class="radio"
          :disabled="true"
          @change="typeChange"
        >
          <el-radio :label="1">{{overseaLangObj.zx_ck || "整箱出库"}}</el-radio>
          <el-radio :label="0">{{overseaLangObj.sku_ck || "SKU出库"}}</el-radio>
        </el-radio-group>
        <el-checkbox
          :disabled="true"
          v-model="goodsForm.isSticker"
          class="checkbox"
        >
          {{overseaLangObj.tb_labeling() || "贴标"}}
        </el-checkbox>
      </div>
    </div>
    <ComTable
      ref="goodsTableRef"
      :columnConfig="tableColumnConfig()"
      :httpRequest="goodsTable.httpRequest"
      :getQueryParams="tableQueryParams"
      :pagination="false"
      @getResult="getResult"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'product'">
          <el-row>
            <span
              :class="[
                'isComplete',
                slotProps.row.foreignExportParam == 1
                  ? 'text-success-color'
                  : 'text-danger-color',
              ]"
            >
              <i
                :class="
                  slotProps.row.foreignExportParam == 1
                    ? 'el-icon-circle-check'
                    : 'el-icon-warning-outline'
                "
              ></i>
              {{ slotProps.dicsList.nameCn }}
            </span>
          </el-row>
        </template>
      </template>
    </ComTable>
    <div class="grand-total">
      <template v-for="gross in goodsTable.grossTotal">
        <span :key="gross.prop">
          <span class="label">{{ gross.label }}</span>
          <span :class="`value ${gross.valClass}`">{{
            totalData[gross.prop]
          }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { fbaGoodsTableColumns } from "../model";
import {
  getFbaGoodsInfo,
  getFbaGoodsPerformanceInfo,
} from "@/api/overseas/fbaOrder.js";

export default {
  props: {
    goodsFormModel: {
      type: Object,
      default: () => {},
    },
    orderId: {
      type: [String, Number],
      default: () => null,
    },
    isPerformance: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isTableTotal: false,
      goodsForm: {
        issueType: this.goodsFormModel.issueType || 0,
        isSticker: !!this.goodsFormModel.isSticker,
      },
      goodsTable: {
        httpRequest: this.isPerformance
          ? getFbaGoodsPerformanceInfo
          : getFbaGoodsInfo,
        grossTotal: [
          {
            label: `${this.overseaLangObj.zkc_sl || "总库存数量"}：`,
            prop: "storeTotalNum",
            valClass: "val-bold",
          },
          {
            label: `${this.overseaLangObj.zck_sl || "总出库数量"}：`,
            prop: "totalNum",
            valClass: "val-bold",
          },
        ],
      },
      totalData: {
        storeTotalNum: 0,
        totalNum: 0,
      },
    };
  },
  created() {},
  methods: {
    typeChange() {},
    tableColumnConfig() {
      return fbaGoodsTableColumns(
        this.goodsForm.issueType === 0 ? "fbaSku" : "fbaBox"
      );
    },
    tableQueryParams() {
      return {
        orderOverseasFbaId: this.orderId,
        issueType: this.goodsForm.issueType,
      };
    },
    getResult(obj) {
      obj.tableData.forEach((e) => {
        this.totalData.totalNum += e.quantity;
        this.totalData.storeTotalNum += e.quantityInventory;
      });
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped>
.goods-info {
  line-height: 50px;

  .title {
    font-size: 14px;
    font-weight: bold;
    line-height: 22px;
    padding: 14px 0 11px;
    color: #515151;
  }
  .el-checkbox {
    margin: 0 10px;
  }
}
</style>