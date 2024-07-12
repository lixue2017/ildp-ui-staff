<template>
  <!-- 成本费用维度明细表    收入费用维度明细表 -->
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
                :columnConfig="tableColumns({currencyList})"
                :tableHeight="tableConfig.tableHeight"
                :httpRequest="paymentReportObj.tableRequest"
                :extraConfig="{ multiline: true }"
                :defaultExpandAll="true"
                :spanMethod="spanMethod"
                :getQueryParams="getQueryParams"
                :isMountedRequest="false"
                @getResult="getResult"
                v-if="tabsConfig.activeName === tab.name"
              >
              </ComTable>
            </keep-alive>
            <div>
              <ComTable
                :ref="`tableTotal${tab.name}`"
                :columnConfig="tableTotleLists({currencyList})"
                :columnData="tableTotalConfig.columnData"
                v-if="tabsConfig.activeName === tab.name"
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
            <!-- <div class="grand-total">
              <div
                v-for="(mItem, index) in totalMoneyData"
                :key="`m_${index}`"
                class="total-money"
              >
                <div class="total-aggregate">
                  <span>{{ mItem.label }}：</span>
                  <div class="currency-money">
                    <div
                      class="currency"
                      v-for="(item, index) in mItem.subtotalArr"
                      :key="`s_${index}`"
                    >
                      <span v-if="item">
                        {{ `${item.currencyCode}：${toFixedNum(item.money)}` }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import { searchFormCols, formRules, tableColumns,tableTotleLists } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
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
      tableColumns,
      tableTotleLists,
      tabsConfig: {
        ...tabsConfig,
      },
      searchFormConfig: {
        formModel: {
          costId: [],
          month: [
            formatDate(start, "/", "month"),
            formatDate(start, "/", "month"),
          ], // 默认上一个月
        },
        fold: true, // 模糊搜索是否需要展开按钮
        size: "small",
        labelWidth: "85px",
        formRules, // 表单校验规则
      },
      tableConfig: {
        // tableColumns:this.paymentReportObj.tableColumns,
        tableHeight: "calc(100vh - 362px)",
      },
      tableTotalConfig: {
        columnConfig: this.paymentReportObj.tableTotleLists,
        columnData: [],
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
      // totalMoneyData: [],
      searchFromData: {},
      btnType: null,
      currencyList:[]
    };
  },
  methods: {
    getTableList(obj = {}) {
      // const { customerId: oldVal } = this.searchFromData;
      // const { customerId: newVal } = obj;
      // if (newVal != oldVal) {
      //   const params = {
      //     customerId: newVal,
      //   };
      //   const { data } = await GETCurrencyConfigList(params);
      //   this.currencyList = data[0].currencyList || [];
      // }
      const { month, ...nObj } = obj;
      const { paymentType } = this.paymentReportObj;
      const opt = {
        startTime: `${month[0]}/01 00:00:00`,
        endTime: `${month[1]}/28 00:00:00`,
        type: paymentType, // 0-应付 1-应收
        ...nObj,
      };
      this.searchFromData = opt;
      if (this.btnType === "export") {
        comFileDownload(this, this.paymentReportObj.exportRequest, opt);
      } else {
        this.mixinkeepTable(true);
      }
    },
    handleExport() {
      this.btnType = "export";
      this.$refs.searchFormRef[0]?.submitForm();
      setTimeout(() => {
        this.btnType = null;
      }, 500);
    },
    getResult({ resultData: res = {} }) {
      const {data}=res
      this.tableTotalConfig.columnData=[{...data}]
      this.$refs[`tableTotal${this.tabsConfig.activeName}`][0]?.setNewTableData(
        this.tableTotalConfig.columnData
      );
      // this.totalMoneyData = [
      //   {
      //     label: "合 计",
      //     subtotalArr: [
      //       res.rmbsubtotal,
      //       res.usdsubtotal,
      //       res.eursubtotal,
      //       res.hkdsubtotal,
      //       res.gbpsubtotal,
      //     ],
      //   },
      // ];
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.subtotal) {
        if (columnIndex === 0) {
          return [1, 6];
        } else {
          return [0, 0];
        }
      }
    },
    searchConfig() {
      return {
        ...this.searchFormConfig,
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
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        lists: searchFormCols({
          customerHandle: async() => {
            this.$refs.salesmanRef[0]?.changeFocusRequest();
            if (!this.isDefaultSelection) {
              this.isDefaultSelection = true;
              const {customerId,...obj}=this.$refs.searchFormRef[0]?.getFormParams()
              const { data } = await GETCurrencyConfigList({customerId});
              this.currencyList = data[0].currencyList || [];
              this.getTableList({...obj,customerId});
            }
          },
          salesmanHandle: () => {
            this.$refs.companyRef &&
              this.$refs.companyRef[0]?.changeFocusRequest();
            this.$refs.searchFormRef[0]?.setFormModel({
              dealingsCompanyId: "", // 隐藏的查询联动需要重置
              dealingsCompanyId_name: "",
            });
          },
        }),
      };
    },
    getQueryParams() {
      return this.searchFromData;
    },
  },
  activated() {
    if (this.$refs.searchFormRef) {
      // this.$refs.searchFormRef[0]?.submitForm();
    }
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
        .total-aggregate {
          display: flex;
          .currency-money {
            display: flex;
            .currency {
              margin-right: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
