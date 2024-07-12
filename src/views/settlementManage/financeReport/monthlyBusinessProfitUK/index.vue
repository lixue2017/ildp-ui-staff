<template>
  <monthlyBusinessProfit :paymentReportObj="paymentReportObj" />
</template>

<script>
// import { monthlyBusinessProfitUKConfig } from "../components/model.js";
import {
  getProfitStatementUK,
  getProfitStatementUKExport,
} from "@/api/settlementManage/paymentReceived.js";
// import {getCurrencyList} from "@/api/basicData/index.js"
export default {
  name: "MonthlyBusinessProfitUK",
  data() {
    return {
      paymentReportObj: {
        title: "月利润统计表(英国分润)",
        monthSourceType:"MonthlyBusinessProfitUK",
        tableRequest: getProfitStatementUK,
        exportRequest: getProfitStatementUKExport,
      },
      // show:false,
    };
  },
  mounted(){
    // this.getTableConfig()
  },
  methods: {
    // getTableConfig() {
    //   getCurrencyList({ isTabShow: 1 }).then((res)=>{
    //     const {rows}=res
    //     const tableConfig=monthlyBusinessProfitUKConfig(rows)
    //     this.paymentReportObj = {
    //       ...this.paymentReportObj,
    //       tableConfig,
    //     };
    //     this.show = true;
    //   })
    //   // monthlyBusinessProfitUKConfig().then((res) => {
    //   //   this.paymentReportObj = {
    //   //     ...this.paymentReportObj,
    //   //     tableConfig: res,
    //   //   };
    //   //   this.show = true;
    //   // });
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
