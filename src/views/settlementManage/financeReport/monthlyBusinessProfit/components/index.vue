<template>
  <!-- 月利润统计表  月利润统计表(英国分润) -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            ref="formRef"
            :formConfig="formConfig"
            v-if="showSearchForm && tabsConfig.activeName === tab.name"
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
            v-if="tabsConfig.activeName === tab.name&& showSearchForm"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="publicTableConfig({currencyList,monthSourceType:paymentReportObj.monthSourceType})"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="getQueryParams"
            @getResult="getResult"
            :extraConfig="{ multiline: true }"
            :isMountedRequest="false"
          >
          </ComTable>
          <div
            :style="{
              'margin-top': formConfig.formModelLength >= 20 ? '0px' : '30px',
            }"
          >
            <ComTable
              :ref="`tableTotal${tab.name}`"
              :columnConfig="publicTotalConfig({currencyList})"
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
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { formatDate, toThousands } from "@/utils/index.js";
import { formConfigs } from "../../components/model.js";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
import { comFileDownload } from "@/utils/download.js";
import { mapActions } from "vuex";
import {publicTableConfig,publicRulesConfig,publicTotalConfig} from "@/views/settlementManage/financeReport/components/model.js"
import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
export default {
  name: "MonthlyBusinessProfit",
  props: {
    paymentReportObj: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [mixinColsConf],
  data() {
    const lastMonth = formatDate(
      new Date().getTime() - 30 * 24 * 3600 * 1000,
      "/",
      "month"
    );
    return {
      publicTotalConfig,
      publicTableConfig,
      tabsConfig: {
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
            handleClick: this.getProfitStatementExport,
          },
        ],
      },
      formConfig: {
        formModel: {
          monthBy: [lastMonth, lastMonth],
        },
        formModelLength: 0,
        httpRequest: async (fModel) => {
          const { customerId: oldVal } = this.formConfig.formModel;
          const { customerId: newVal } = fModel;
          if (newVal != oldVal) {
            const params = {
              customerId: newVal,
            };
            const { data } = await GETCurrencyConfigList(params);
            this.currencyList = data[0].currencyList || [];
          }
          return new Promise((resolve) => {
            this.getSearchList(fModel);
            resolve();
          });
        }, // 表单提交接口
        resetFormFn: (obj) => {
          if (obj.customerId) {
            this.$refs.salesmanRef[0].querySearchAsync();
          }
        },
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "85px",
        lists: this.getFormLists(),
        formRules: publicRulesConfig({monthSourceType:this.paymentReportObj.monthSourceType}),
      },
      tableConfig: {
        tableHeight: "calc(100vh - 362px)",
        httpRequest: this.paymentReportObj.tableRequest,
      },
      tableTotalConfig: {
        // columnConfig:this.paymentReportObj.tableConfig.tableTotleLists,
        columnData: [],
      },
      subtotalMoney: [],
      // mixinTableColArr: [this.paymentReportObj.tableConfig.tableLists],
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
  created() {
    this["dictionary/getDictionary"]([
      "settlementBusinessType",
      "reportOrderBusType",
    ]).then(() => {
      this.getInitialData();
    });
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitialData() {
      getFirstInitData({
        httpRequest: logisticsCustomerInfo,
      }).then(async(res) => {
        const {data=[]}=await GETCurrencyConfigList({customerId:res.id})
        this.currencyList=data[0].currencyList||[]
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          customerId: res.id,
          customerName: `${res.code}[${res.shortName}]`,
        };
        this.showSearchForm = true;
        this.mixinkeepTable(true);
      });
    },
    getSearchList(searchFrom = {}) {
      const { customerName } = this.formConfig.formModel;
      this.formConfig.formModel = {
        customerName,
        ...searchFrom,
      };
      // console.log("searchFrom", searchFrom);
      this.mixinkeepTable(true);
    },
    getFormLists() {
      return formConfigs(
        {
          customerIdHandle: () => {
            this.$refs.salesmanRef[0].changeFocusRequest();
          },
          monthByHandle: () => {
            this.$refs.salesmanRef[0].changeFocusRequest();
          },
        },
        "MonthlyBusinessProfit"
      );
    },
    getQueryParams() {
      const { customerName, monthBy, ...nParams } = this.formConfig.formModel;
      const [startTime, endTime] = monthBy || [];
      return {
        ...nParams,
        startTime: startTime + "/01 00:00:00",
        endTime: endTime + "/28 00:00:00",
      };
    },
    getResult({ resultData }) {
      const { data, total } = resultData;
      this.formConfig.formModelLength = total;
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
    getProfitStatementExport() {
      //导入
      const params = this.getQueryParams();
      comFileDownload(this, this.paymentReportObj.exportRequest, params);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
}
</style>
