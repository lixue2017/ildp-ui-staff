<template>
  <!-- 操作履约管理/海外入库/WMS退仓入库详情 -->
  <div>
    <WithdrawalOperateDetail ref="detailsRef" viewDetailsSource="tc_operate" />
  </div>
</template>

<script>
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
export default {
  name: "WmsWithdrawalOperateDetails",
  mixins: [mixinEditCache],
  data() {
    return {
      isMixinCreatedMounted: "mounted",
    };
  },
  methods: {
    mixinInitData() {
      setTimeout(() => {
        // 保证子组件加载完成
        this.$refs.detailsRef?.getInitData();
      });
    },
  },
  components: {
    WithdrawalOperateDetail: () => import("../components/pageDetails.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
