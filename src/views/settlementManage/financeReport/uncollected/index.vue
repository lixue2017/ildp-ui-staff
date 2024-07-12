<template>
  <PaymentReport :payment-report-obj="obj" />
</template>

<script>
import {
  getNotCollectList,
  getNotCollectExport,
} from "@/api/settlementManage/paymentReceived.js";
import {uncollectedColumns} from "./model.js"
import {getCurrencyList} from "@/api/basicData/index.js"
export default {
  name: "UncollectedStatistics",
  data() {
    return {
      obj: {
				webViewSource: 'uncollectedStatistics',
        title: "业务未收款统计表",
        tableRequest: getNotCollectList,
        exportRequest: getNotCollectExport,
      },
      // show:false
    };
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
    //       tableColumns: uncollectedColumns(rows),
    //     }
    //     this.show=true
    //   })
    // },
  },
  components: {
    PaymentReport: () => import("./components/paymentReport.vue"),
  },
};
</script>
