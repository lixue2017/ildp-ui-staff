<template>
	<PaymentReport :payment-report-obj="obj" />
</template>

<script>
import {
  getNotPayList,
  getNotPayExport,
} from "@/api/settlementManage/paymentReceived.js";
// import {getCurrencyList} from "@/api/basicData/index.js"
// import {unpaidColumns} from "../uncollected/model.js"
export default {
	name: "UnpaidReport",
	data() {
		return {
			obj: {
        webViewSource: 'UnpaidReport',
				title: "业务未付款明细表",
				tableRequest: getNotPayList,
				exportRequest: getNotPayExport
			},
      // show:false
		}
	},
  mounted(){
    // this.getIsitConfig()
  },
  methods:{
    // getIsitConfig(){
    //   getCurrencyList({ isTabShow: 1 }).then((res)=>{
    //     const {rows}=res
    //     this.obj={
    //       ...this.obj,
    //       tableColumns: unpaidColumns(rows),
    //     }
    //     this.show=true
    //   })
    // },
  },
	components: {
    PaymentReport: () => import("../uncollected/components/paymentReport.vue"),
  },
}
</script>
