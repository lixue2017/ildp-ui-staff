<template>
  <ExpenseDimension :paymentReportObj="paymentReportObj" />
</template>

<script>
import {
  postCostExpenseList,
  postCostExpenseExport,
} from "@/api/settlementManage/paymentReceived.js";
// import { tableTotleLists,tableColumns } from "./components/model.js";
// import {getCurrencyList} from "@/api/basicData/index.js"
export default {
  name: "IncomeExpense",
  data() {
    return {
      paymentReportObj: {
        title: "收入费用维度明细表",
        paymentType: 1,
        tableRequest: postCostExpenseList,
        exportRequest: postCostExpenseExport,
      },
      // show:false
    };
  },
  mounted(){
    // getCurrencyList({ isTabShow: 1 }).then((res)=>{
    //   const {rows}=res
    //   this.paymentReportObj={
    //     ...this.paymentReportObj,
    //     tableTotleLists:tableTotleLists(rows),
    //     tableColumns:tableColumns(rows)
    //   }
    //   this.show=true
    // })
  },
  methods: {},
  components: {
    ExpenseDimension: () => import("./components/expense.vue"),
  },
};
</script>

<style lang="scss" scoped>
</style>
