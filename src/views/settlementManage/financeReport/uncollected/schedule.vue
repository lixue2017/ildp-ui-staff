<template>
  <PaymentReport :payment-report-obj="obj" />
</template>

<script>
import { formatDate } from "@/utils";
import {
  getNotCollectDetailList,
  exportNotCollectAccountBillInfo,
} from "@/api/settlementManage/paymentReceived.js";
// import { detailTableColumns } from "./model";
// import {getCurrencyList} from "@/api/basicData/index.js"
export default {
  name: "UncollectedReport",
  data() {
    return {
      obj: {
        title: "业务未收款明细表",
				webViewSource: 'uncollected',
        tableRequest: this.handleRequest,
        exportRequest: exportNotCollectAccountBillInfo,
        getQueryParams: this.getQueryParams,
        paginationConfig: {
          limit: 20,
          layout: "total, sizes, prev, pager, next, jumper",
          className: "",
          small: false,
          total: 20,
          pageSizes: [20, 30, 50, 100],
        },
      },
      // show:false
    };
  },
  components: {
    PaymentReport: () => import("./components/paymentReport.vue"),
  },
  mounted(){
    // this.getIsitConfig()
  },
  methods: {
    // getIsitConfig(){
    //   getCurrencyList({ isTabShow: 1 }).then((res)=>{
    //     const {rows}=res
    //     this.obj={
    //       ...this.obj,
    //       tableColumns: detailTableColumns(rows),
    //     }
    //     this.show=true
    //   })
    // },
    handleRequest(params) {
      return new Promise((resolve) => {
        getNotCollectDetailList(params).then((res) => {
          const { data, ...list } = res;
          this.obj.paginationConfig = {
            ...this.obj.paginationConfig,
            pageSizes: [20, 30, 50, 100, list.total],
          };
          resolve({
            ...list,
            data,
          });
        });
      });
    },
    getQueryParams(params) {
      const {
        customerId,
        deadline,
				deadlineV,
        slotSalesman,
        slotConsignor,
        businessType,
				orderNum,
        dealingsCompany
      } = params;
      return {
        startTime:deadline && formatDate(deadline[0], "-", "date"),
        endTime:deadline && formatDate(deadline[1], "-", "date"),
        deadlineV:deadlineV && formatDate(deadlineV, "-", "date"),
        salesman: slotSalesman,
        customer: slotConsignor,
        businessType,
        billingMain: customerId,
				orderNum,
        dealingsCompany
      };
    },
  },
};
</script>
