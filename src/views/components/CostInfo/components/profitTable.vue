<template>
  <div class="profit-table-box" v-if="isShowTable">
    <ComTable
      :ref="`profitTableRef`"
      :tableHeight="tableAutoHeight"
      :httpRequest="getProfitRequest"
      :columnConfig="getProfitTableCols()"
      :getQueryParams="getQueryParams"
      :defaultExpandAll="true"
      @getResult="getResult"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'type'">
          <span v-if="slotProps.row.type === 3">
            {{ slotProps.row.createTime }}
          </span>
          <span
            v-else
            :style="{
              color: slotProps.dicsList && slotProps.dicsList.color,
            }"
            >{{ slotProps.dicsList.nameCn }}</span
          >
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
// @/views/components/CostInfo/components/profitTable.vue
import { getBillProfitStatement } from "@/api/settlementManage/statementManage";
import { accumulationFn } from "@/utils/instructions";
import { profitTableCols } from "../model";
import {
  querySearchList
} from "@/api/common.js";
export default {
  props: {
    profitData: {
      type: Object,
      default: () => ({}),
    },
    profitRequest: {
      type: Function,
      default: getBillProfitStatement,
    },
  },
  inject: {
    PROVIDECURRFILTER: {//是否使用动态币种,需要后端在详情接口返回了币种集合和折合币种集合才配置为true，否则一律为false
      from: 'PROVIDECURRFILTER',
      default:false
    }
  },
  data() {
    return {
      profitTableList: [],
      isShowTable: false,
      filterCURRList: [], //已返回数据中可选币种集合
      filterEquivalentCURRList: [], //已返回数据中可选折合币种几种
    };
  },
  methods: {
    getProfitTableCols() {
      const params={
        PROVIDECURRFILTER:this.PROVIDECURRFILTER,
        filterCURRList:this.filterCURRList,
        filterEquivalentCURRList:this.filterEquivalentCURRList
      }
      return profitTableCols(params);
    },
    getResult({ tableData }) {
      this.isShowTable = !!tableData.length;
      if (this.isShowTable) {
        const totalList={
          ...(this.PROVIDECURRFILTER
          ?{
            ...this.getTotalForMatData(tableData,'equivalentProfit'),
            ...this.getTotalForMatData(tableData,'pay'),
          }
          :{
            payEUR: accumulationFn(tableData.map((e) => e.payEUR)),
            payGBP: accumulationFn(tableData.map((e) => e.payGBP)),
            payHKD: accumulationFn(tableData.map((e) => e.payHKD)),
            payRMB: accumulationFn(tableData.map((e) => e.payRMB)),
            payUSD: accumulationFn(tableData.map((e) => e.payUSD)),
            payVND: accumulationFn(tableData.map((e) => e.payVND)),
            equivalentProfitRMB: accumulationFn(
              tableData.map((e) => e.equivalentProfitRMB)
            ),
            equivalentProfitUSD: accumulationFn(
              tableData.map((e) => e.equivalentProfitUSD)
            ),
          })
        }
        this.profitTableList = [
          {
            createTime: "合计利润",
            type: 3,
            trClassName: "total-profit-line",
            ...totalList
            // ...this.getTotalForMatData(tableData,'equivalentProfit'),
            // ...this.getTotalForMatData(tableData,'pay'),
            // payEUR: accumulationFn(tableData.map((e) => e.payEUR)),
            // payGBP: accumulationFn(tableData.map((e) => e.payGBP)),
            // payHKD: accumulationFn(tableData.map((e) => e.payHKD)),
            // payRMB: accumulationFn(tableData.map((e) => e.payRMB)),
            // payUSD: accumulationFn(tableData.map((e) => e.payUSD)),
            // payVND: accumulationFn(tableData.map((e) => e.payVND)),
            // equivalentProfitRMB: accumulationFn(
            //   tableData.map((e) => e.equivalentProfitRMB)
            // ),
            // equivalentProfitUSD: accumulationFn(
            //   tableData.map((e) => e.equivalentProfitUSD)
            // ),
          },
          ...tableData,
        ];
         // equivalentProfitList接口返回的折合数据     filterEquivalentCURRList 当前可用币别集合
         this.$emit('getTotalList',{equivalentProfitList:totalList,filterEquivalentCURRList:this.filterEquivalentCURRList})
        this.$refs.profitTableRef.setNewTableData(this.profitTableList);
      }
      setTimeout(() => {
        this.isInitProfitRes = true;
      }, 2000);
    },
    profitRefresh() {
      if (this.isInitProfitRes) {
        // 防止初始化时重复调接口
        if (!this.isShowTable) {
          this.isShowTable = true;
        } else {
          this.$refs.profitTableRef?.refreshTable();
        }
      }
    },
    getQueryParams() {
      const {
        currencyIdConfig = [],
        convertCurrencyIdConfig = [],
        ...obj
      } = this.profitData;
      return obj;
    },
    getProfitRequest(formModel) {
      return new Promise((resolve) => {
        this.profitRequest(formModel).then((res) => {
          const { data=[], ...obj } = res;
          const resultData = {
            ...obj,
            data: data.map((e) => {
              const {equivalentProfitList=[],payList=[],children=[],...eObj}=e
              return {
                ...eObj,
                ...this.getForMatData(equivalentProfitList,'equivalentProfit'),
                ...this.getForMatData(payList,'pay'),
                // equivalentProfitList,
                // payList,
                children: children.map((cE) => {
                  const {equivalentProfitList:cEEquivalentProfitList=[],payList:cEPayList=[],...cEObj}=cE
                  return {
                    ...cEObj,
                    ...this.getForMatData(cEEquivalentProfitList,'equivalentProfit'),
                    ...this.getForMatData(cEPayList,'pay')
                  };
                }),
              };
            }),
          };
          resolve(resultData);
        });
      });
    },
    getForMatData(row={}, label="") {
      //单条数据格式处理
      let params={}
      Object.keys(row).forEach(key=>{
        params[`${label}${key}`]=row[key]
      })
      return params;
    },
    getTotalForMatData(rows = [], label = "") {
      //合计数据格式处理
      const CURRLIST = {
        pay: this.filterCURRList,//币种合集
        equivalentProfit: this.filterEquivalentCURRList,//折合币种合集
      }[label];
      let params = {};
      CURRLIST.map((e) => {
        const { code } = e;
        params[`${label}${code}`] = accumulationFn(
          rows.map((e) => e[`${label}${code}`])
        );
      });
      return params;
    },
  },
  created() {
    if (this.PROVIDECURRFILTER) {
      //currencyIdConfig可用币别集合（详情获取）    convertCurrencyIdConfig可用折合币别集合(详情获取)
      const {currencyIdConfig=[],convertCurrencyIdConfig=[]}=this.profitData
      querySearchList({ type: "currency" }).then((res) => {
        const {rows=[]}=res
        this.filterCURRList=rows.filter((e)=>currencyIdConfig.includes(e.id))
        this.filterEquivalentCURRList=rows.filter((e)=>convertCurrencyIdConfig.includes(e.id))
        this.isShowTable = true;
      });
    } else {
      this.isShowTable = true;
    }
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.profitTableList.length;
      return tableLen > 4 ? "270px" : undefined;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped>
.profit-table-box {
  /deep/ {
    .total-profit-line {
      .cell {
        font-weight: 600;
      }
    }
  }
}
</style>
