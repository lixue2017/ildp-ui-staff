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
                :formConfig="searchConfig"
              >
              </ComForm>
            </keep-alive>
            <keep-alive>
              <ComTable
                :ref="`tableRef${tab.name}`"
                :columnConfig="tableConfig.tableColumns"
                :tableHeight="tableConfig.tableHeight"
                :httpRequest="paymentReportObj.tableRequest"
                :getQueryParams="getQueryParams"
                @getResult="getResult"
                :pagination="false"
              >
              </ComTable>
            </keep-alive>
            <div class="grand-total">
              <div
                v-for="(mItem, index) in totalMoneyData"
                :key="`m_${index}`"
                class="total-money"
              >
                <div class="total-aggregate">
                  <span>{{ mItem.label }}：</span>
                  <div>
                    <div
                      v-for="(item, index) in mItem.subtotalArr"
                      :key="`s_${index}`"
                    >
                      <span>{{
                        `${formatMoney(item.money)} ${item.currencyCode}`
                      }}</span>
                      <span class="grey-text-color in-words">{{
                        item.amountInWords
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/index.js";
import {
  getOverseasAgencyList,
  exportOverseasAgencyList,
} from "@/api/settlementManage/paymentReceived.js";
import { searchFormCols, formRules, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";

export default {
  name: "OverseasAgent",
  mixins: [mixinColsConf],
  data() {
    const formConfig = {
      formModel: {
        month: formatDate(
          new Date().getTime() - 30 * 24 * 3600 * 1000,
          "/",
          "month"
        ),
      },
      size: "small",
      labelWidth: "85px",
      formRules, // 表单校验规则
    };
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "海外代理结算明细表",
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
      },
      paymentReportObj: {
        tableRequest: getOverseasAgencyList,
        exportRequest: exportOverseasAgencyList,
      },
      searchConfig: {
        ...formConfig,
        searchForm: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        lists: searchFormCols(),
      },
      tableConfig: {
        tableColumns,
        tableHeight: "calc(100vh - 324px)",
      },
      totalMoneyData: [],
      btnType: null,
    };
  },
  methods: {
    getTableList(obj = {}) {
      this.searchConfig.formModel = {
        ...obj,
      };
      if (this.btnType === "export") {
        this.btnType = null;
        // this.paymentReportObj.exportRequest(obj).then((res) => {
        //   res.data && window.open(res.data);
        // });
        comFileDownload(this, this.paymentReportObj.exportRequest, obj);
        return;
      }
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchConfig.formModel;
    },
    getResult({ resultData: res }) {
      this.totalMoneyData = [
        {
          label: "未收金额小计",
          subtotalArr: res.unCollSubtotal || [],
        },
        {
          label: "未付金额小计",
          subtotalArr: res.unPaySubtotal || [],
        },
        {
          label: "应付金额小计",
          subtotalArr: res.paySubtotal || [],
        },
      ];
    },
    handleExport() {
      this.btnType = "export";
      this.$refs.searchFormRef[0].submitForm();
    },
  },
  activated() {
    if (this.$refs.searchFormRef) {
      this.$refs.searchFormRef[0].submitForm();
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
    // .search-info {
    //   margin-top: 15px;
    // }
    .grand-total {
      justify-content: space-between;
      .total-money {
        margin-right: 20px;
        .total-aggregate {
          display: flex;
          text-align: left;
          .in-words {
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
