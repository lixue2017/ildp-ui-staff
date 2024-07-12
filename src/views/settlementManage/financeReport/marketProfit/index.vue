<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${
                tableConfig.tableHeight + totalHeight
              }px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              @getResult="getResult"
              :getQueryParams="() => tableConfig.getQueryParams()"
            >
              <template v-slot:bottomTotal>
                <div
                  class="bottom-total"
                  v-if="
                    (subtotal.subtotalRMB && subtotal.subtotalRMB.money) ||
                    (subtotal.subtotalList && subtotal.subtotalList.length)
                  "
                >
                  <div>
                    <div
                      v-if="subtotal.subtotalRMB && subtotal.subtotalRMB.money"
                      class="flex"
                    >
                      <div class="title">利润小计(RMB)：</div>
                      <div>
                        <span class="label">RMB：</span>
                        <span class="value"
                          >{{ formatMoney(subtotal.subtotalRMB.money) }}({{
                            subtotal.subtotalRMB.amountInWords
                          }})</span
                        >
                      </div>
                    </div>
                    <div
                      v-if="
                        subtotal.subtotalList && subtotal.subtotalList.length
                      "
                      class="flex"
                    >
                      <div class="title">利润小计(分币别)：</div>
                      <div class="flex-right">
                        <div
                          v-for="total in subtotal.subtotalList"
                          :key="total.currencyId"
                        >
                          <span class="label">{{ total.currencyCode }}：</span>
                          <span class="value"
                            >{{ formatMoney(total.money) }}({{
                              total.amountInWords
                            }})</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { searchConfig, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  getMarketProfit,
  marketProfitExport,
} from "@/api/settlementManage/paymentReceived.js";
import { comDownload } from "@/utils/download.js";
import { handleContent } from "@/utils";
import { formatDate } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "MarketProfit",
  mixins: [mixinColsConf],
  data() {
    return {
      handleContent,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: "市场部利润表",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: this.marketProfitExport,
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {
          oDate: this.getCurrDate(),
        }, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        searchForm: true,
        expansion: false,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getMarketProfit(formModel);
            resolve();
          });
        }, // 表单提交接口
        size: "small",
        labelWidth: "87px",
        ...searchConfig,
      },
      tableConfig: {
        tableHeight: 270,
        getQueryParams: this.getQueryParams,
        httpRequest: getMarketProfit,
      },
      subtotal: {},
      totalHeight: 0,
      mixinTableColArr: [tableColumns],
    };
  },
  methods: {
    getMarketProfit(searchFrom = {}) {
      const { oDate, ...data } = searchFrom;
      const [startDate, endDate] = oDate;
      this.searchFromData = {
        ...data,
        startDate,
        endDate,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const param = {};
      for (let key in this.searchFromData) {
        this.searchFromData[key] && (param[key] = this.searchFromData[key]);
      }
      if (!param.startDate) {
        const [startDate, endDate] = this.getCurrDate();
        param.startDate = startDate;
        param.endDate = endDate;
      }
      return param;
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
    marketProfitExport() {
      //导入
      const params = this.getQueryParams();
      // marketProfitExport(params).then((res) => {
      //   comDownload(res);
      // });
      comFileDownload(this, marketProfitExport, params);
    },
    getResult({ resultData }) {
      const { subtotalRMB = {}, subtotalList = [] } = resultData;
      this.subtotal = {
        subtotalRMB,
        subtotalList,
      };
      let num = 0;
      if (subtotalRMB.money) {
        num += 1;
      }
      if (subtotalList.length) {
        num += subtotalList.length;
      }
      let totalHeight = num * 21;
      if (subtotalRMB.money || subtotalList.length) {
        totalHeight += 30;
      }
      this.totalHeight = totalHeight;
    },
    searchHeight(height) {
      this.tableConfig.tableHeight = 220 + height;
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom-total {
  padding: 15px 30px;
  background: rgba(80, 148, 255, 0.12);
  overflow: hidden;
  & > div {
    float: right;
  }

  .flex {
    display: flex;
    line-height: 21px;
  }
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
    width: 130px;
    text-align: right;
  }
}
</style>
