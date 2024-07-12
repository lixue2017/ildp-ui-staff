<template>
  <!-- 业务未收款明细表   业务未收款统计表  业务未付款明细表 -->
  <div class="app-container">
    <div class="content">
      <!-- <div class="tabs flex-between-end">
        <span class="title">{{ paymentReportObj.title }}</span>
        <el-button size="small" type="primary" @click="handleExport"
          >导 出</el-button
        >
        <span class="subTitle"
          >锁单之后系统自动生成，最后锁定于2022年07月15日 14:30</span
        >
      </div> -->
      <ComTabs :tabsConfig="tabsConfig">
        <template v-for="tab in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <keep-alive>
              <ComForm
                class="search-info"
                ref="searchFormRef"
                :formConfig="searchConfig"
                v-if="showSearchForm"
              >
                <template
                  v-for="sItem in ['slotSalesman', 'slotConsignor']"
                  v-slot:[sItem]="slotProps"
                >
                  <AutoComplete
                    :key="sItem"
                    :ref="`${sItem}Ref`"
                    :formModel="slotProps.formModel"
                    :fieldItem="{
                      ...slotProps.fieldItem,
                      className: 'auto-dis-search',
                      disabled:
                        sItem === 'slotConsignor' &&
                        (!slotProps.formModel.slotSalesman ||
                          !slotProps.formModel.slotSalesman.length),
                    }"
                    :additionalParam="{
                      customerId: slotProps.formModel.customerId, // 所属公司
                      salesmans: slotProps.formModel.slotSalesman, // 业务员
                    }"
                  />
                </template>
              </ComForm>
            </keep-alive>
            <keep-alive>
              <ComTable
                :ref="`tableRef${tab.name}`"
                :columnConfig="tableColumns({ currencyList , sourceType:paymentReportObj.webViewSource })"
                :tableHeight="tableConfig.tableHeight"
                :httpRequest="paymentReportObj.tableRequest"
                :getQueryParams="getQueryParams"
                :isMountedRequest="false"
                :paginationConfig="paymentReportObj.paginationConfig"
                @getResult="getResult"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'orderNo'">
                    <template v-if="slotProps.row.orderNo">
                      <span
                        v-if="
                          paymentReportObj.webViewSource ===
                          'uncollectedStatistics'
                        "
                        class="primary-text-btn"
                        @click="handleView(slotProps.row)"
                      >
                        {{ slotProps.row.orderNo }}
                      </span>
                      <template v-else>{{ slotProps.row.orderNo }}</template>
                    </template>
                    <span v-else>--</span>
                  </template>
                </template>
                <template v-slot:bottomTotal>
                  <div class="grand-total">
                    <span>合计：</span>
                    <template v-for="(tItem, tKey, i) in subtotalList">
                      <span :key="`t_${i}`">
                        <span>{{ tKey }}：</span>
                        <span>{{ formatMoney(tItem || 0) }}</span>
                      </span>
                    </template>
                  </div>
                </template>
              </ComTable>
            </keep-alive>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
  </div>
</template>

<script>
import { formatDate, getFirstDayOfYear } from "@/utils/index.js";
import { searchFormCols, formRules, tableColumns, totalConfig } from "../model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";

import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
import { mapActions } from "vuex";
export default {
  mixins: [mixinColsConf],
  props: {
    paymentReportObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const tabsConfig = {
      activeName: "1",
      slotTabs: true,
      handleTabsClick: () => {},
      tabs: [
        {
          label: this.paymentReportObj.title,
          name: "1",
        },
      ],
      btnArr: [
        {
          table: "导出",
          icon: "iconfont daochu",
          handleClick: () => {
            this.handleExport();
          },
        },
      ],
    };
    return {
      tableColumns,
      totalConfig: this.paymentReportObj.totalConfig || totalConfig,
      tabsConfig: {
        ...tabsConfig,
      },
      searchFromData: {},
      searchConfig: {
        formModel: {},
        labelWidth: "85px",
        formRules, // 表单校验规则
        searchForm: true,
        fold: true,
        httpRequest: async (formModel) => {
          const { customerId: oldVal = "" } = this.searchFromData;
          const { customerId: newVal = "" } = formModel;
          if (newVal != oldVal) {
            const params = {
              customerId: newVal,
            };
            const { data } = await GETCurrencyConfigList(params);
            this.currencyList = data[0].currencyList || [];
          }
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        lists: this.searchCols(),
      },
      tableConfig: {
        // tableColumns: this.paymentReportObj.tableColumns || tableColumns,
        tableHeight: "calc(100vh - 324px)",
      },
      subtotalList: {},
      currencyList:[]
    };
  },
  mounted() {
    const { orderNum } = this.$route.query;
    const { webViewSource } = this.paymentReportObj;
    this["dictionary/getDictionary"]([
      "settlementBusinessType",
      "trueOrFalse",
      "accountCycle",
    ]).then(() => {
      logisticsCustomerInfo({ pageNum: 1, pageSize: 10 }).then(
        async({ rows = [] }) => {
          const {data}=await GETCurrencyConfigList({customerId:rows[0]?.id})
          this.currencyList=data[0].currencyList||[]
					this.searchFromData = {
            deadline:[formatDate(new Date(new Date().getFullYear(), 0, 1), "/", "date"),formatDate(new Date().getTime(), "/", "date")],
            deadlineV:formatDate(new Date().getTime(), "/", "date"),
						customerId: rows[0]?.id,
						orderNum,
            isHedging:
              webViewSource == "uncollectedStatistics" ? true : undefined,
          };
          this.searchConfig.formModel = {
            ...this.searchFromData,
            customerName: rows[0]?.nameCn,
          };
          this.showSearchForm = true;
          this.mixinkeepTable(true);
        }
      );
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchCols() {
      return searchFormCols({
        webViewSource: this.paymentReportObj.webViewSource,
        customerHandle: () => {
          this.$refs.slotSalesmanRef &&
            this.$refs.slotSalesmanRef[0]?.changeFocusRequest();
        },
        salesmanHandle: () => {
          this.$refs.slotConsignorRef &&
            this.$refs.slotConsignorRef[0]?.changeFocusRequest();
        },
      });
    },

    getSearchList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
      };
      this.mixinkeepTable(true);
    },
    handleExport() {
      this.searchFromData = {
        ...(this.$refs.searchFormRef[0]?.getFormParams() || {}),
      };
      const opt = {
        ...this.getQueryParams(),
      };
      // this.paymentReportObj.exportRequest(opt).then((res) => {
      //   res.msg && window.open(res.msg);
      // });
      comFileDownload(this, this.paymentReportObj.exportRequest, opt);
    },
    getQueryParams() {
      const { webViewSource } = this.paymentReportObj;
      const {
        customerId,
        customerName,
        deadline,
        deadlineV,
        slotSalesman,
        slotConsignor,
        businessType,
        orderNum,
        isHedging,
        dealingsCompany,
      } = this.searchFromData;
      if (this.paymentReportObj.getQueryParams)
        return this.paymentReportObj.getQueryParams(this.searchFromData);
      return {
        customerId,
        customerName,
        startTime: deadline && deadline[0],
        endTime: deadline && deadline[1],
        deadlineV,
        slotSalesman,
        slotConsignor,
        businessType,
        orderNum,
        dealingsCompany,
        isHedging:
          webViewSource == "uncollectedStatistics" && isHedging
            ? 0
            : webViewSource == "uncollectedStatistics" && !isHedging
            ? 1
            : undefined,
      };
    },
    handleView({ orderNo }) {
      this.$router.push({
        // path: "/reportManagement/businessProfit/uncollectedReport",
        path: "/reportManagement/Unpaid/uncollectedReport",
        query: {
          orderNum: orderNo,
        },
      });
    },
    getResult(resultData = {}) {
      const currencyCodeList=this.currencyList.map((e)=>e.currencyCode)
      const { data } = resultData.resultData;
      let config={}
      Object.keys(data).forEach((e) => {
        if(currencyCodeList.includes(e)){
          config[e]=data[e]
        }
      });
      this.subtotalList = config;
      // if (subtotalList) {
      //   // 金额统计
      //   Object.keys(subtotalList).forEach((ele) => {
      //     this.totalMoneyData.push({
      //       moneyLabel: ele.slice(5),
      //       moneyVal: subtotalList[ele],
      //     });
      //   });
      // }
    },
  },
  activated() {
    // if (this.$refs.searchFormRef) {
    //   this.$refs.searchFormRef[0].submitForm();
    // }
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .content {
    // padding: 15px 20px 30px;
    min-height: calc(100vh - 108px);
    margin: auto;
    background: #fff;
    .tabs {
      border-bottom: 1px solid #e2e2e2;
      .title {
        color: #515151;
        font-weight: bold;
        margin-right: 30px;
        padding-bottom: 3px;
        border-bottom: 2px solid #515151;
      }
    }
    // .search-info {
    //   margin-top: 15px;
    // }
  }
}
</style>
