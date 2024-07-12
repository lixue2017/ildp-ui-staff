<template>
  <!-- 订单管理 (员工端)海外提派 -->
  <DeliveryOrder :menuConfObj="deliveryConfObj" />
</template>

<script>
import { delivery } from "../components/model.js";
import { getOrderDeliveryClearanceList } from "@/api/order/overSeaOther";
export default {
	name: "DeliveryList",
  data() {
    return {
      deliveryConfObj: {
      menuType: "order",
      modelConfig:delivery,
      httpRequest:getOrderDeliveryClearanceList,
      detailPageUrl:"/newOrderManage/overSeaOtherOrder/detailDelivery",
      },
    };
  },
  components: {
    DeliveryOrder: () => import("./deliveryOrder.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
