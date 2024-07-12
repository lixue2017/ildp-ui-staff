<template>
  <div>
    <!-- 仓租日账单(订单)列表 -->
    <StorageRentBill :storageRentObj="storageRentObj" />
  </div>
</template>

  <script>
import {
  formOperationConfig,
  tableOperationConfig,
} from "@/views/costScheme/storageRentBill/model.js";
import { getMonthlyBillOrderList } from "@/api/costScheme/index.js";
export default {
  name:"StorageOrderBill",
  components: {
    StorageRentBill: () =>
      import("@/views/costScheme/storageRentBill/index.vue"),
  },
  data() {
    return {
      storageRentObj: {
        title: "仓租日账单(订单)",
        formConfig:formOperationConfig,
        tableConfig:tableOperationConfig,
        orderSource: "2", //1操作单 2订单 3海外仓
        tableHttpRequest: getMonthlyBillOrderList,
      },
    };
  },
};
</script>
  <style rel="stylesheet/scss" lang="scss" scoped>
</style>
