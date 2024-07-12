<template>
  <!-- 操作履约管理/海外入库/WMS退仓入库详情 -->
  <div>
    <WithdrawalWarehouseDetail
      ref="detailsRef"
      viewDetailsSource="tc_warehouse"
    >
      <template v-slot:footerBtn="{ btnInfo }">
        <el-button
          type="primary"
          @click="() => handleReceivingPage(btnInfo.orderSn)"
          v-if="[2, 3].includes(btnInfo.state)"
        >
          收 货
        </el-button>
      </template>
    </WithdrawalWarehouseDetail>
  </div>
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "WmsWithdrawalDetails",
  mixins: [mixinEditCache],
  data() {
    return {
      isMixinCreatedMounted: "mounted",
    };
  },
  methods: {
    handleReceivingPage(search) {
      this.$router.push({
        path: "/warehouseManage/inStorage/predictionReceiving",
        query: {
          type: "1",
          search,
        },
      });
    },
    mixinInitData() {
      setTimeout(() => {
        // 保证子组件加载完成
        this.$refs.detailsRef?.getInitData();
      });
    },
  },
  components: {
    WithdrawalWarehouseDetail: () => import("../components/pageDetails.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
