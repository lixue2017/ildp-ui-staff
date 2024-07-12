<template>
		<CompanyDimension :paymentReportObj="paymentReportObj" />
</template>

<script>
import { costAccountingList, exportCostAccounting } from "@/api/settlementManage/paymentReceived.js";
import { searchFormCols, formRules, tableIncomeColumns,tableTotleLists } from "./components/model";
import {getCurrencyList} from "@/api/basicData/index.js"
export default {
	name: "IncomeReport",
  data() {
    return {
			paymentReportObj: {
				title: "收入往来单位明细表",
				paymentType: 1,
				tableRequest: costAccountingList,
				exportRequest: exportCostAccounting,
				searchFormCols,
				formRules,
				tableColumns: tableIncomeColumns,
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
	components: {
    CompanyDimension: () => import("./components/company.vue"),
  },
};
</script>

<style lang="scss" scoped>

</style>
