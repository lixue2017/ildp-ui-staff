<template>
  <!-- 订单管理 (员工端)海外清关订单 -->
  <ClearanceLists :menuConfObj="clearConfObj" />
</template>

<script>
import { customsClearance } from "../components/model.js";
import { getOrderDirectClearanceList } from "@/api/order/overSeaOther.js";
export default {
	name: "CustomsClearanceList",
  data() {
    return {
      clearConfObj: {
      menuType: "order",
      modelConfig:customsClearance,
      httpRequest:getOrderDirectClearanceList,
      detailPageUrl:"/newOrderManage/overSeaOtherOrder/detailCustomsClearance",
      },
    };
  },
  components: {
    ClearanceLists: () => import("./clearanceOrder.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
