<template>
  <div>
    <!-- 仓租日账单(海外仓)列表 -->
    <StorageRentBill :storageRentObj="storageRentObj" />
  </div>
</template>

<script>
import {
  formConfig,
  tableConfig,
} from "@/views/costScheme/storageRentBill/model.js";
import { getMonthlyBillOverseasList } from "@/api/costScheme/index.js";
export default {
  name: "StorageOverBill",
  components: {
    StorageRentBill: () =>
      import("@/views/costScheme/storageRentBill/index.vue"),
  },
  data() {
    return {
      storageRentObj: {
        title: `${
          this.overseaLangObj.cz_rzd || "仓租日账单"
        }(${this.overseaLangObj.ck_lb("海外仓")})`,
        formConfig,
        tableConfig,
        orderSource: "3", //1操作单 2订单 3海外仓
        tableHttpRequest: getMonthlyBillOverseasList,
      },
    };
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
