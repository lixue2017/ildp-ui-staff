<template>
  <div>
		<!-- 页面已废弃 -->
    <div class="goods-info flex-space-between">
      <span class="title">货物信息</span>
    </div>
    <ComTable
      ref="goodsTableRef"
      :columnConfig="goodsTable.columnConfig"
      :httpRequest="goodsTable.httpRequest"
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
import { goodsTableColumns } from "../model";
import { getPlatformGoodsInfo } from "@/api/warehouse/prediction";

export default {
  props: {
    orderId: {
      type: [String, Number],
      default: () => null
    }
  },
  data() {
    return {
      goodsTable: {
        httpRequest: this.getGoodsInfo,
        columnConfig: goodsTableColumns(),
        grossTotal: [{
          label: '总库存数量：',
          prop: 'storeTotalNum',
          valClass: 'val-bold'

        }, {
          label: '总数量：',
          prop: 'totalNum',
          valClass: 'val-bold'
        }]
      },
      totalData: {
        storeTotalNum: 0,
        totalNum: 0,
      },
    }
  },
  created() {
    
  },
  methods: {
    typeChange() {},
    getGoodsInfo() {
      return getPlatformGoodsInfo({ orderOverseasPlatformId: this.orderId });
    },
    getResult(obj) {
      obj.tableData.forEach(e => {
        this.totalData.totalNum += e.quantity;
        this.totalData.storeTotalNum += e.quantityInventory;
      })
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
}
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
  }
</style>