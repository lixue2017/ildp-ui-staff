<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            ref="searchTabForm"
            :formConfig="getFormConfig()"
            v-if="showSearchForm"
          >
            <template v-slot:salesman="slotProps">
              <AutoComplete
                ref="salesmanRef"
                :formModel="slotProps.formModel"
                :fieldItem="slotProps.fieldItem"
                :additionalParam="{
                  customerId:
                    slotProps.formModel && slotProps.formModel.customerId,
                  startTime:
                    (slotProps.formModel.monthBy || [])[0] + '/01 00:00:00',
                  endTime:
                    (slotProps.formModel.monthBy || [])[1] + '/28 00:00:00',
                }"
              />
            </template>
          </ComForm>
          <ComTable
            :ref="`tableRef${tab.name}`"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="tableColumns({currencyList})"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="getQueryParams"
            :extraConfig="{ multiline: true }"
            :isMountedRequest="false"
            @getResult="getResult"
            v-if="tabsConfig.activeName === tab.name&& showSearchForm"
          >
          </ComTable>
          <div
            :style="{
              'margin-top': searchFormConfig.formModelLength >= 20 ? '0px' : '30px',
            }"
          >
            <ComTable
              :ref="`tableTotal${tab.name}`"
              :columnConfig="tableTotleLists({currencyList})"
              :columnData="tableTotalConfig.columnData"
              :extraConfig="{ multiline: true }"
              v-if="tabsConfig.activeName === tab.name&& showSearchForm"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'leftHeader'">
                  <div v-for="(item, index) in collectConfig" :key="index">
                    <span
                      :style="{
                        color: item.color,
                      }"
                      v-if="item.rowIndex.includes(slotProps.rowIndex)"
                    >
                      {{ item.label }}
                    </span>
                  </div>
                </template>
              </template>
            </ComTable>
          </div>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns,formRules,tableTotleLists } from "./model.js";
import { formatDate, toThousands } from "@/utils/index.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  POSTEcMonthProfitStatement,
  POSTExportProfitStatementEcOrTradition,
} from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
import { getCurrencyList } from "@/api/basicData/index.js";
import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
export default {
  mixins: [mixinColsConf],
  data() {
    const lastMonth = formatDate(
      new Date().getTime() - 30 * 24 * 3600 * 1000,
      "/",
      "month"
    );
    return {
      tableColumns,
      tableTotleLists,
      lastMonth,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "传统润统计表",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: this.getProfitStatementExport,
          },
        ],
      },
      searchFormConfig: {
        formModel: {
        }, // 表单数据
        formModelLength: 0,
        httpRequest: async (formModel) => {
          const { customerId: oldVal } = this.searchFromData;
          const { customerId: newVal } = formModel;
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
        resetFormFn: (obj) => {
          if (obj.customerId) {
            this.$refs.salesmanRef[0].querySearchAsync();
          }
        },
        searchForm: true,
        expansion: false,
        fold: true,
        size: "small",
        labelWidth: "100px",
        lists: searchForm,
        formRules: formRules, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 320px)",
        httpRequest: POSTEcMonthProfitStatement,
      },
      tableTotalConfig: {
        columnData: [],
      },
      showSearchForm: false,
      searchFromData: {},
      collectConfig: [
        {
          label: "应收总计：",
          color: "#53C88A",
          rowIndex: [0],
        },
        {
          label: "应付总计：",
          color: "#FF6767",
          rowIndex: [1],
        },
        {
          label: "利润总计：",
          rowIndex: [2],
        },
      ],
      currencyList:[]
    };
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"]([
      "settlementBusinessType",
      "accountCycle",
      "reportOrderBusType"
    ]).then(() => {
      this.getIsintData()
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getIsintData(){
      getFirstInitData({ httpRequest: logisticsCustomerInfo }).then(async(res)=>{
        const {data=[]}=await GETCurrencyConfigList({customerId:res.id})
        this.currencyList=data[0].currencyList||[]
        this.searchFromData={
          monthBy: [this.lastMonth, this.lastMonth],
          customerId: res.id,
          customerName: `${res.code}[${res.shortName}]`,
          endDealDate:formatDate(new Date(), "/",'date'), // 默认当天
        }
        this.searchFormConfig.formModel = {
          ...this.searchFromData,
        };
        this.tableConfig={
          ...this.tableConfig,
          // columnConfig:tableColumns(currencyLists)
        }
        this.tableTotalConfig={
          ...this.tableTotalConfig,
          // columnConfig: tableTotleLists(currencyLists),
        }
        this.showSearchForm = true;
        this.mixinkeepTable(true);

      })
      // Promise.all([
      //   getFirstInitData({ httpRequest: logisticsCustomerInfo }),//获取默认搜索条件
      //   getCurrencyList({ isTabShow: 1 }),//动态币种
      // ]).then(([res, currencyRes]) => {
      //   const{rows:currencyLists}=currencyRes
      //   this.searchFromData={
      //     monthBy: [this.lastMonth, this.lastMonth],
      //     customerId: res.id,
      //     customerName: `${res.code}[${res.shortName}]`,
      //     endDealDate:formatDate(new Date(), "/",'date'), // 默认当天
      //   }
      //   this.searchFormConfig.formModel = {
      //     ...this.searchFromData,
      //   };
      //   this.tableConfig={
      //     ...this.tableConfig,
      //     columnConfig:tableColumns(currencyLists)
      //   }
      //   this.tableTotalConfig={
      //     ...this.tableTotalConfig,
      //     columnConfig: tableTotleLists(currencyLists),
      //   }
      //   this.showSearchForm = true;
      //   this.mixinkeepTable(true);

      // });
    },
    getSearchList(searchFrom = {}) {
      const {customerId,customerName,monthBy}=this.searchFormConfig.formModel
      this.searchFromData = {
        customerId,
        customerName,
        monthBy,
        ...searchFrom,
      };
      this.mixinkeepTable(true);
    },
    getProfitStatementExport() {
      //导入
      const params = this.getQueryParams();
      comFileDownload(this, POSTExportProfitStatementEcOrTradition, params);
    },
    getQueryParams() {
      const {monthBy,...obj}=this.searchFromData
      return {
        ...obj,
        startTime: monthBy && monthBy[0] + '/01 00:00:00',
        endTime: monthBy && monthBy[1] + '/28 00:00:00',
        orderType: 1,
      };
    },
    getFormConfig() {
      return {
        ...this.searchFormConfig,
        lists:searchForm({
          changeCustomer: () => {
          this.$refs.salesmanRef[0].changeFocusRequest();
        },
        }),
      };
    },
    getResult({ resultData }) {
      console.log('resultData',resultData)
      const { data, total } = resultData;
      this.searchFormConfig.formModelLength = total;
      if (data) {
        this.tableTotalConfig.columnData = data;
        this.tableConfig.tableHeight = "calc(100vh - 462px)";
      } else {
        this.tableTotalConfig.columnData = [];
        this.tableConfig.tableHeight = "calc(100vh - 500px)";
      }
      this.$refs[`tableTotal${this.tabsConfig.activeName}`][0]?.setNewTableData(
        this.tableTotalConfig.columnData
      );
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped></style>
