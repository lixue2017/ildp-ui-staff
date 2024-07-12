<template>
  <div>
    <!-- 仓租日账单(操作单)列表 -->
    <StorageRentBill :storageRentObj="storageRentObj" />
  </div>
</template>

  <script>
import {
  formOperationConfig,
  tableOperationConfig
} from "@/views/costScheme/storageRentBill/model.js";
import { getMonthlyBillOperationList } from "@/api/costScheme/index.js";
export default {
  name:"StorageOperationBill",
  components: {
    StorageRentBill: () =>
      import("@/views/costScheme/storageRentBill/index.vue"),
  },
  data() {
    return {
      storageRentObj: {
        title: "仓租日账单(操作单)",
        formConfig:formOperationConfig,
        tableConfig:tableOperationConfig,
        orderSource: "1", //1操作单 2订单 3海外仓
        tableHttpRequest: getMonthlyBillOperationList,
      },
    };
  },
};
</script>
  <style rel="stylesheet/scss" lang="scss" scoped>
</style>
