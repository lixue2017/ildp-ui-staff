<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              class="search-info"
              ref="searchFormRef"
              :formConfig="searchConfig()"
              v-if="showSearchForm"
            >
              <template v-slot:salesmanId="slotProps">
                <AutoComplete
                  ref="salesmanRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    className: 'auto-dis-search',
                    disabled: !slotProps.formModel.customerId,
                  }"
                  :additionalParam="{
                    customerId: slotProps.formModel.customerId,
                  }"
                />
              </template>

              <template v-slot:dealingsCompanyId="slotProps">
                <AutoComplete
                  ref="companyRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    className: 'auto-dis-search',
                    disabled: !slotProps.formModel.salesmanId,
                  }"
                  :additionalParam="{
                    salesmanId: slotProps.formModel.salesmanId,
                  }"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableColumns({currencyList})"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              @getResult="getResult"
              :extraConfig="{ multiline: true }"
              :defaultExpandAll="true"
            >
              <template v-slot:customRow="{ slotProps }">
                <template
                  v-if="
                    slotProps.prop === 'expand' &&
                    totalData[slotProps.row.customerId].index ===
                      slotProps.rowIndex
                  "
                >
                  <div class="flex">
                    <div>
                      <span class="label">客户名称：</span
                      ><span class="value">{{
                        totalData[slotProps.row.customerId].customerName
                      }}</span>
                    </div>
                    <div>
                      <span class="title">合计：</span>

                      <template
                        v-for="(item,key, index) in getTotalList(slotProps.row.moneyList)"
                      >
                          <span class="label" :key="index">{{ key }}：</span>
                          <span class="value">{{
                            formatMoney(totalData[slotProps.row.customerId]['moneyList'][key])
                          }}</span>
                      </template>
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { formatDate,sumObjectsByKey } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import { accumulationFn } from "@/utils/instructions.js";
import {
  searchFormCols,
  tableColumns,
  formRules,
} from "../components/model.js";
import {
  getECReport,
  ecReportExport,
  ecInfoReportExport,
  logisticsCustomerInfo,
} from "@/api/settlementManage/paymentReceived.js";
import { getCurrencyList } from "@/api/basicData/index.js";
import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
export default {
  name: "ECommerce",
  mixins: [mixinColsConf],
  data() {
    return {
      tableColumns,
      accumulationFn,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "月结对账单(电商)",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleReportExport(),
          },
          {
            table: "导出明细",
            icon: "iconfont daochu",
            handleClick: () => this.handleReportExport("exDetail"),
          },
        ],
      },
      formConfig: {
        formModel: {
          oDate: this.getCurrDate(), // 默认当月1号到当前日期
        },
        size: "small",
        labelWidth: "85px",
        formRules, // 表单校验规则
      },
      searchFromData: {
        oDate: this.getCurrDate(), // 默认当月1号到当前日期
      },
      tableConfig: {
        tableHeight: "calc(100vh - 265px)",
        httpRequest: getECReport,
      },
      subtotalMoney: [],
      totalData: {},
      showSearchForm:false,
      currencyList:[]
    };
  },
  mounted() {
    this["dictionary/getDictionary"](["trueOrFalse"]).then(() => {
      this.getIsitConfig();
    });
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  activated() {
    if (this.$refs.searchFormRef) {
      this.$refs.searchFormRef[0]?.submitForm();
    }
  },
  methods: {
    getIsitConfig() {
      logisticsCustomerInfo({ pageNum: 1, pageSize: 20 }).then(async(res)=>{
        const { rows } = res;
        const {data=[]}=await GETCurrencyConfigList({customerId:rows[0]?.id})
        this.currencyList=data[0].currencyList||[]
        this.tableConfig={
          ...this.tableConfig,
        }
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          customerId: rows[0]?.id,
          customerName: rows[0]?.nameCn,
        };
        this.searchFromData.customerId = rows[0]?.id;
        this.showSearchForm = true;
        this.mixinkeepTable();
      })


      // Promise.all([
      //   logisticsCustomerInfo({ pageNum: 1, pageSize: 20 }), //获取默认搜索条件
      //   getCurrencyList({ isTabShow: 1 }), //动态币种
      // ]).then(([res, currencyRes]) => {
      //   const { rows } = res;
      //   const { rows: currencyLists } = currencyRes;
      //   const tableConfig = tableColumns(currencyLists)
      //   this.tableConfig={
      //     ...this.tableConfig,
      //     columnConfig:tableConfig
      //   }
      //   this.formConfig.formModel = {
      //     ...this.formConfig.formModel,
      //     customerId: rows[0]?.id,
      //     customerName: rows[0]?.nameCn,
      //   };
      //   this.searchFromData.customerId = rows[0]?.id;
      //   this.showSearchForm = true;
      //   this.mixinkeepTable();
      // });
    },
    getSearchList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      let params = this.searchFromData;
      if (this.$refs.searchFormRef) {
        params = this.$refs.searchFormRef[0].getFormParams();
      }
      const { customerName, oDate, ...nParams } = params;
      const [startTime, endTime] = oDate || [];
      return { ...nParams, startTime, endTime };
    },
    getResult({ tableData }) {
      const totalData = {};
      tableData.forEach((item, index) => {
        const { customerId, customerName, moneyList } = item;
        totalData[customerId]={
          index,
          customerName,
          moneyList:sumObjectsByKey(totalData[customerId]?.moneyList||{}, moneyList)
        }
      });
      this.totalData = totalData;
    },
    handleReportExport(bType) {
      //导入
      const params = this.getQueryParams();
      if (!params.dealingsCompanyId) {
        this.$message.error("请先选择客户！");
        return;
      }
      if (bType === "exDetail") {
        comFileDownload(this, ecInfoReportExport, params);
        return;
      }
      comFileDownload(this, ecReportExport, params);
    },
    searchConfig() {
      return {
        ...this.formConfig,
        searchForm: true,
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
        fold: true,
        lists: searchFormCols({
          customerHandle: () => {
            this.$refs.salesmanRef[0]?.changeFocusRequest();
          },
          salesmanHandle: () => {
            this.$refs.companyRef[0]?.changeFocusRequest();
          },
          type: "ec",
        }),
      };
    },
    getCurrDate() {
      const oDate = new Date();
      const y = oDate.getFullYear();
      const m = oDate.getMonth() + 1;
      const d = oDate.getDate();

      return [
        formatDate(`${y}/${m}/1`, "/", "date"),
        formatDate(`${y}/${m}/${d}`, "/", "date"),
      ];
    },
    getTotalList(row = {}) {
      const currCodeList = this.currencyList.map((e) => e.currencyCode);
      const obj={}
      Object.keys(row).map((key) => {
        if (currCodeList.includes(key)) {
          obj[key]=row[key]
        }
      });
      return obj;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ .el-table__expand-icon {
    display: none;
  }
  /deep/ .el-table__expanded-cell {
    padding: 0;
    border: none;
    .flex {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e2e2e2;
      padding: 0 20px;
      background: rgba(80, 148, 255, 0.12);
      display: flex;
      justify-content: space-between;
      .label {
        color: #8b8b8b;
      }
      .value {
        font-size: 15px;
        font-weight: bold;
        &:not(:last-child) {
          margin-right: 20px;
        }
      }
      .title {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
