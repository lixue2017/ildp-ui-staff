<template>
  <!-- 订单管理（员工端）/海外订单/WMS退仓入库详情 -->
  <div>
    <WithdrawalOrderDetail ref="detailsRef" viewDetailsSource="tc_order">
      <template v-slot:footerBtn="{ btnInfo }">
        <el-button
          type="primary"
          @click="() => handleUpdate(btnInfo)"
          v-if="[1, '1'].includes(btnInfo.state)"
        >
          接 单
        </el-button>
        <el-button type="primary" @click="() => handleOrderRemark()">
          保存备注
        </el-button>
      </template>
    </WithdrawalOrderDetail>
    <ComCustomDialog ref="mCustomDialogRef" />
  </div>
</template>

<script>
import { putReturnWmsOrderRemark } from "@/api/warehouse/process";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { mixinWmsListDetails } from "../components/mixinListDetails.js";
export default {
  name: "WmsWithdrawalOrderDetails",
  mixins: [mixinEditCache, mixinWmsListDetails],
  data() {
    return {
      isMixinCreatedMounted: "mounted",
    };
  },
  methods: {
    handleUpdate(obj) {
      this.handleWmsMixinReceiving(obj, () => {
        this.$refs.detailsRef.handleRefreshPage();
      });
    },
    handleOrderRemark() {
      const { id, businessRemark } =
        this.$refs.detailsRef.$refs.wmsBasicFormRef?.getFormParams() || {};
      this.comRepeatedRequest(this, putReturnWmsOrderRemark, {
        id,
        type: 1, // 1-业务备注
        remark: businessRemark,
      }).then(() => {
        this.msgSuccess("备注保存成功");
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
    WithdrawalOrderDetail: () => import("../components/pageDetails.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
