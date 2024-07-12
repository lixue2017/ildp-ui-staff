<template>
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
                :columnConfig="tableConfig.tableColumns"
                :tableHeight="tableConfig.tableHeight"
                :defaultExpandAll="true"
                :isMountedRequest="false"
                :spanMethod="spanMethod"
                :httpRequest="paymentReportObj.tableRequest"
                :getQueryParams="getQueryParams"
                @getResult="getResult"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'orderNo'">
                    <template v-if="slotProps.row.children">
                      <span>{{ slotProps.row.orderNo }}</span>
                      <span class="expand-dealingsCompany">
                        {{
                          slotProps.row.dealingsCompanyName
                            ? `往来单位：${slotProps.row.dealingsCompanyName}`
                            : ""
                        }}
                      </span>
                      <span class="expand-dealingsCompany">
                        {{
                          paymentReportObj.paymentType == 0
                            ? `核销金额：${toFixedNum(slotProps.row.vMoney)}`
                            : ""
                        }}
                      </span>
                    </template>
                    <template v-else>{{ slotProps.row.orderNo }} </template>
                  </template>
                </template>
              </ComTable>
            </keep-alive>
            <div class="grand-total" v-if="paymentReportObj.paymentType === -1">
              <div class="total-money">
                <span>合 计：</span>
                <div>
                  <div
                    v-for="(item, index) in totalMoneyData"
                    :key="`s_${index}`"
                    class="base-flex-between"
                  >
                    <span class="amount-txt">{{ item.currencyCode }}</span>
                    <span class="amount-txt">{{
                      formatMoney(item.money)
                    }}</span>
                    <span style="flex: 1">{{ item.amountInWords }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ComTable
                :ref="`tableTotal${tab.name}`"
                :columnConfig="tableTotleLists({currencyList})"
                :columnData="tableTotalConfig.columnData"
                v-if="paymentReportObj.paymentType != -1"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'leftHeader'">
                    <span
                      :style="{
                        color:
                          tableTotalConfig.collectConfig[
                            paymentReportObj.paymentType
                          ].color,
                      }"
                    >
                      {{
                        tableTotalConfig.collectConfig[
                          paymentReportObj.paymentType
                        ].label
                      }}
                    </span>
                  </template>
                </template>
              </ComTable>
            </div>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mapActions } from "vuex";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
import {tableTotleLists} from "./model.js"
export default {
  mixins: [mixinColsConf],
  props: {
    paymentReportObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
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
      tableTotleLists,
      tabsConfig: {
        ...tabsConfig,
      },
      searchFormConfig: {
        formModel: {
          month: [
            formatDate(start, "/", "month"),
            formatDate(start, "/", "month"),
          ], // 默认上一个月
        },
        fold: this.paymentReportObj.paymentType !== -1,
        labelWidth: "85px",
        formRules: this.paymentReportObj.formRules, // 表单校验规则
      },
      tableConfig: {
        tableColumns: this.paymentReportObj.tableColumns,
        tableHeight: "calc(100vh - 362px)",
      },
      tableTotalConfig: {
        // columnConfig: this.paymentReportObj.tableTotleLists,
        columnData: [{}],
        collectConfig: {
          0: {
            label: "应付总计：",
            color: "#FF6767",
          },
          1: {
            label: "应收总计：",
            color: "#53C88A",
          },
        },
      },
      totalMoneyData: [],
      btnType: null,
      showSearchForm: false,
      searchFromData:{},
      currencyList:[],
    };
  },
  created() {
    this["dictionary/getDictionary"](["settlementBusinessType"]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getTableList(obj = {}) {
      const { month, ...nObj } = obj;
      const { paymentType } = this.paymentReportObj;
      this.searchFromData = {
        startTime: `${month[0]}/01 00:00:00`,
        endTime: `${month[1]}/28 00:00:00`,
        applicantId: paymentType == -1 ? nObj.salesmanId : undefined,
        type: paymentType != -1 ? paymentType : undefined,
        salesmanId: paymentType != -1 ? nObj.salesmanId : undefined,
        ...nObj,
      };
      if (this.btnType === "export") {
        this.btnType = null;
        comFileDownload(
          this,
          this.paymentReportObj.exportRequest,
          this.searchFromData
        );
      } else {
        this.mixinkeepTable(true);
      }
    },
    handleExport() {
      this.btnType = "export";
      this.$refs.searchFormRef[0]?.submitForm();
      setTimeout(() => {
        this.btnType = null;
      }, 1000);
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.subtotal) {
        if (columnIndex === 0) {
          return [1, this.paymentReportObj.tableColumns.length];
        } else {
          return [0, 0];
        }
      }
    },
    searchConfig() {
      return {
        ...this.searchFormConfig,
        searchForm: true,
        httpRequest: async(formModel) => {
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
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        lists: this.paymentReportObj.searchFormCols({
          customerHandle: async() => {
            if (!this.isDefaultSelection) {
              this.isDefaultSelection = true;
              const {customerId,...obj}=this.$refs.searchFormRef[0]?.getFormParams()
              const { data } = await GETCurrencyConfigList({customerId});
              this.currencyList = data[0].currencyList || [];
              this.getTableList({...obj,customerId});
              // this.getTableList(this.$refs.searchFormRef[0]?.getFormParams());
            }
            this.$refs.salesmanRef[0]?.changeFocusRequest();
          },
          salesmanHandle: () => {
            this.$refs.companyRef[0]?.changeFocusRequest();
          },
        }),
      };
    },
    getQueryParams(row = {}) {
      return this.searchFromData;
    },
    getResult({ resultData: res = {} }) {
      const currIds=this.currencyList.map((e)=>e.currencyId)
      const { summation } = res;
      this.totalMoneyData = (res.summation || []).filter((e)=>currIds.includes(e.currencyId));
      if (this.paymentReportObj.paymentType != -1) {
        //成本往来单位和收入往来单位的汇总改成表格，费用报销明细表暂时不动
        this.tableTotalConfig.columnData = [
          {
            RMB: 0,
            USD: 0,
            HKD: 0,
            EUR: 0,
            GBP: 0,
          },
        ];
        if (summation.length != 0) {
          summation.map((e) => {
            const { currencyCode, money } = e;
            this.$set(
              this.tableTotalConfig.columnData[0],
              [currencyCode],
              money
            );
          });
        }
        this.$refs[
          `tableTotal${this.tabsConfig.activeName}`
        ][0]?.setNewTableData(this.tableTotalConfig.columnData);
      }

      //下方是列表下拉展开的数据，与列表数据合计无关
      let resRows = [];
      (res.rows || []).forEach((e) => {
        const orderNo = `小计：${this.formatMoney(e.subtotal.money)} ${
          e.subtotal.currencyCode
        }`;
        // console.log("e.list[0]?.vMoney", e.list[0].vmoney);
        resRows.push({
          ...e.subtotal,
          subtotal: true,
          orderNo,
          expenseNo: orderNo,
          children: e.list,
          dealingsCompanyName: e.list[0]?.dealingsCompanyName || "",
          vMoney: e.list[0]?.vMoney || 0,
        });
      });
      this.$refs[`tableRef${this.tabsConfig.activeName}`][0]?.setNewTableData(
        resRows
      );
    },
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
    .search-info {
      margin-top: 15px;
    }
    .grand-total {
      .total-money {
        margin-right: 20px;
        display: flex;
        .amount-txt {
          min-width: 100px;
          padding-right: 10px;
        }
      }
    }
    .expand-dealingsCompany {
      margin-left: 50px;
    }
  }
}
</style>
