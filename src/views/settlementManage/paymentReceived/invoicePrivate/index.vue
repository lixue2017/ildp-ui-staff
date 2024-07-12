<template>
  <!-- 发票信息（我的）已完结发票 -->
  <Invoice :invoiceObj="invoiceObj" />
</template>

<script>
import { getInvoiceList } from "@/api/settlementManage/paymentReceived";
import { onGoingTable, writeColumns } from "../invoice/model.js";
export default {
  name: "InvoicePrivate",
  data() {
    return {
      invoiceObj: {
        title: "发票信息(个人)",
        menuType: "0",
        tableRequest: getInvoiceList,
        tableCols: [onGoingTable({ menuType: "0" }), writeColumns],
        // searchFormCols,
        // formRules,
      },
    };
  },
  methods: {},
  components: {
    Invoice: () => import("../invoice/index.vue"),
  },
};
</script>

<style lang="scss" scoped>
</style>
