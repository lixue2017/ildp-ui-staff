<template>
  <CompanyDimension :paymentReportObj="paymentReportObj"/>
</template>

<script>
import {
  costAccountingList,
  exportCostAccounting,
} from "@/api/settlementManage/paymentReceived.js";
import {
  searchFormCols,
  formRules,
  tableColumns,
  tableTotleLists,
} from "./components/model";
// import {getCurrencyList} from "@/api/basicData/index.js"
export default {
  name: "CostDetails",
  data() {
    return {
      paymentReportObj: {
        title: "成本往来单位明细表",
        paymentType: 0,
        tableRequest: costAccountingList,
        exportRequest: exportCostAccounting,
        searchFormCols,
        formRules,
        tableColumns,
      },
      // show:false
    };
  },
  mounted(){
    // getCurrencyList({ isTabShow: 1 }).then((res)=>{
    //   const {rows}=res
    //   this.paymentReportObj={
    //     ...this.paymentReportObj,
    //     tableTotleLists:tableTotleLists(rows)
    //   }
    //   this.show=true
    // })
  },
  methods: {},
  components: {
    CompanyDimension: () => import("./components/company.vue"),
  },
};
</script>

<style lang="scss" scoped>
</style>
