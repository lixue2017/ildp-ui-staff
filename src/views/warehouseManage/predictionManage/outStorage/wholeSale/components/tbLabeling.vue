<template>
  <div>
    <div class="goods-head-info flex-space-between">
      <span class="title">贴标信息</span>
    </div>
    <ComTable
      :columnConfig="tableColumnConfig()"
      :httpRequest="getGoodsInfo"
      :pagination="false"
    >
    </ComTable>
  </div>
</template>

<script>
import { tbTableColumns } from "./model";
import { getOutboundLabelList } from "@/api/overseas/platformOrder.js";

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    platformOrFbaObj: {
      // 一件代发或者整箱出库
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // tableSubtotal: [],
    };
  },
  methods: {
    getGoodsInfo() {
      return getOutboundLabelList({
        orderId: this.formData.id,
        orderType: this.platformOrFbaObj.mType || 1, // 1: 一件代发；2: FBA
      });
    },
    tableColumnConfig() {
      return tbTableColumns({
        cType: this.formData.outGoodsType,
      });
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped>
.goods-head-info {
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
