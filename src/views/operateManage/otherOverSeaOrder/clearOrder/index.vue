<template>
  <!-- 操作履约(员工端) 海外清关操作单 -->
  <ClearanceLists :menuConfObj="clearConfObj" />
</template>

<script>
import { customsClearanceOperation } from "@/views/newOrderManage/overSea/otherOrder/components/model.js";
import { getOperationDirecrClearanceList } from "@/api/operateRecord/customsClearance";
export default {
	name: "ClearOrder",
  data() {
    return {
      clearConfObj: {
      menuType: "operation",
      modelConfig:customsClearanceOperation,//列表配置
      httpRequest:getOperationDirecrClearanceList,//列表请求接口
      detailPageUrl:"/operateManage/otherOverSeaOrder/clearDetails"//详情页面URL，需要独立，可以同时打开订单和操作单详情切换
      },
    };
  },
  components: {
    ClearanceLists: () => import("@/views/newOrderManage/overSea/otherOrder/customsClearanceOrder/clearanceOrder.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
