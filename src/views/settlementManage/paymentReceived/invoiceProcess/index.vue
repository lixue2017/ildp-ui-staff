<template>
  <!-- 发票信息（审核）已完结发票 -->
  <Invoice :invoiceObj="invoiceObj" />
</template>

<script>
import { getInvoiceList } from "@/api/settlementManage/paymentReceived";
import { onGoingTable, writeColumns } from "../invoice/model.js";
export default {
  name: "InvoiceProcess",
  data() {
    return {
      invoiceObj: {
        title: "发票信息(审核)",
        menuType: "1",
        tableRequest: getInvoiceList,
        tableCols: [onGoingTable({ menuType: "1" }), writeColumns],
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
