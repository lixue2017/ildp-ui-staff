<template>
  <!-- 操作管理 (员工端)海外提派 -->
  <DeliveryOrder :menuConfObj="deliveryConfObj" />
</template>

<script>
import { deliveryOperation } from "@/views/newOrderManage/overSea/otherOrder/components/model.js";
import { getOperationDeliveryClearanceList } from "@/api/order/overSeaOther";
export default {
	name: "DispatchOrder",
  data() {
    return {
      deliveryConfObj: {
      menuType: "operation",
      modelConfig:deliveryOperation,
      httpRequest:getOperationDeliveryClearanceList,
      detailPageUrl:"/operateManage/otherOverSeaOrder/dispatchDeatil",
      },
    };
  },
  components: {
    DeliveryOrder: () => import("@/views/newOrderManage/overSea/otherOrder/deliveryOrder/deliveryOrder.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
