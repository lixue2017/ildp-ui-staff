<template>
  <monthlyBusinessProfit :paymentReportObj="paymentReportObj"  />
</template>

<script>
// import { monthlyBusinessProfitConfig } from "../components/model.js";
import {
  getProfitStatement,
  getProfitStatementExport,
} from "@/api/settlementManage/paymentReceived.js";
// import {getCurrencyList} from "@/api/basicData/index.js"
export default {
  name: "MonthlyBusinessProfit",
  data() {
    return {
      paymentReportObj: {
        title: "月利润统计表",
        monthSourceType:"MonthlyBusinessProfit",
        tableRequest: getProfitStatement,
        exportRequest: getProfitStatementExport,
      },
      // show:false
    };
  },
  mounted(){
    // this.getTableConfig()
  },
  methods: {
    // getTableConfig() {
    //   getCurrencyList({ isTabShow: 1 }).then((res)=>{
    //     const {rows}=res
    //     const tableConfig=monthlyBusinessProfitConfig(rows)
    //     this.paymentReportObj = {
    //       ...this.paymentReportObj,
    //       tableConfig,
    //     };
    //     this.show = true;
    //   })
    // },
  },
  components: {
    monthlyBusinessProfit: () =>
      import(
        "@/views/settlementManage/financeReport/monthlyBusinessProfit/components/index.vue"
      ),
  },
};
</script>

<style lang="scss" scoped>
</style>
