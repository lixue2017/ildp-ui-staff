<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              :ref="`searchFormRef${tab.name}`"
              v-if="tab.name == 1 && showSearchForm"
            >
              <template v-slot:billingMain="slotProps">
                <AutoComplete
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    handle: (row) => changeBillingMain(row, tab.name),
                  }"
                  :additionalParam="{}"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :isMountedRequest="false"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="(row) => getBtnList(row)"
              v-if="tabsConfig.activeName === tab.name"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div class="titleTips">
          <div>
            <span>
              <span class="label">本位币：</span>
              <span class="value">¥人民币</span>
            </span>
            <span class="titleTips-space">
              <span class="label">辅助币：</span>
              <span class="value">$美元</span>
            </span>
          </div>
          <div v-if="tabsConfig.activeName == 1">
            <span> 当月汇率已更新 </span>
            <span class="titleTips-space">
              <span class="label">当前日期：</span>
              <span class="value">{{ getDate() }}</span>
            </span>
          </div>
        </div>
      </template>
    </ComTabs>

    <ChangeRateDialog ref="changeRateDialog" @handleSuccess="mixinkeepTable" />
    <CurrentDrawer ref="CurrentDrawerRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import {
  settleExchangeRateList,
  GETCurrencyConfigList,
} from "@/api/settlementManage/feeSet";
import { DateCompute } from "@/utils/index.js";
import { searchColumns, tableColumns, currentTableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mapActions, mapState } from "vuex";
import { querySearchList } from "@/api/common.js";
export default {
  name: "ExchangeRate",
  mixins: [mixinColsConf],
  data() {
    return {
      tableColumns,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "汇率管理",
            name: "1",
          },
          {
            label: "币别设置",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "更新汇率",
            showTabName: "1",
            handleClick: () => {
              this.changeRate();
            },
          },
        ],
      },
      showSearchForm: false,
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.settleExchangeRateList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
        lists: searchColumns,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 320px)",
        getQueryParams: this.getQueryParams,
        httpRequest: {
          1: settleExchangeRateList,
          2: GETCurrencyConfigList,
        },
      },
      statusList: [
        {
          text: "币别设置",
          showActive: ["2"],
          handleClick: (row) => {
            this.handleCurrentConfig(row);
          },
        },
      ],
      mixinTableColArr: [tableColumns, currentTableColumns],
      isitRequest: true,
      curBillingMain: {},
    };
  },
  computed: {
    ...mapState({
      invoiceCurrency: (state) => state.dictionary.dicsData.invoiceCurrency,
      // curUserInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {},
  created() {
    // const {dept}=this.curUserInfo
    // deptId   deptName
    this["dictionary/getDictionary"](["trueOrFalse", "invoiceCurrency"]).then(
      () => {
        this.showSearchForm = true;
      }
    );
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    settleExchangeRateList(searchFrom = {}) {
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = { ...searchFrom };
      if (this.searchFromData[activeName].createTime) {
        this.$set(
          this.searchFromData[activeName],
          "startTime",
          searchFrom.createTime[0]
        );
        this.$set(
          this.searchFromData[activeName],
          "endTime",
          DateCompute(searchFrom.createTime[1], 1)
        );
        delete this.searchFromData[activeName].createTime;
      }
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      let params = {};
      if (activeName == 1) {
        const { billingMain, ...obj } = this.searchFromData[activeName];
        params = {
          ...obj,
          customerId: billingMain,
        };
      } else {
        params = {
          ...this.searchFromData[activeName],
        };
      }
      return params;
    },
    changeRate() {
      this.$refs.changeRateDialog?.show(this.curBillingMain);
    },
    getDate() {
      const oDate = new Date();
      const y = oDate.getFullYear();
      const m = oDate.getMonth() + 1;
      const d = oDate.getDate();
      return `${y}/${m > 9 ? m : "0" + m}/${d > 9 ? d : "0" + d}`;
    },
    getBtnList() {
      const { activeName } = this.tabsConfig;
      const arr = this.statusList.filter((e) => {
        return e.showActive ? e.showActive.includes(activeName) : true;
      });
      return arr;
    },
    handleCurrentConfig(row = {}) {
      querySearchList({ type: "currency" }).then((res) => {
        const invoiceCurrency = res?.rows || [];
        this.$refs.CurrentDrawerRef.show(row, {
          invoiceCurrency,
        });
      });
    },
    changeBillingMain(row, tName) {
      const { id = undefined, label = undefined, ascription = undefined } = row;
      this.curBillingMain = {
        billingMain: id,
        billingMainName: label,
        ascription,
      };
      if (this.isitRequest) {
        this.isitRequest = false;
        this.settleExchangeRateList(
          this.$refs[`searchFormRef${tName}`][0]?.getFormParams()
        );
      }
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    ChangeRateDialog: () => import("./components/ChangeRateDialog"),
    CurrentDrawer: () => import("./components/currentDrawer"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  /deep/ .com-detail-top {
    margin: 0 0 15px;
    .page-turn {
      padding-right: 0;
    }
    .create-info {
      padding-right: 22px;
    }
  }
  /deep/.table-header-row {
    .head-blue {
      color: #5094ff;
    }
    .head-orange {
      color: #fa541c;
    }
  }
}
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
.dialog-form {
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.historical-records {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .historical-records-title {
    font-size: 16px;
    margin-right: 21px;
    color: #1f1f1f;
  }

  .historical-records-sub {
    color: #666;

    i {
      margin-right: 10px;
    }
  }
}
// 那还有那么多省呢
/deep/.tabs-right-btn {
  width: 100%;
  justify-content: space-between;
  align-items: flex-end !important;
  .titleTips {
    margin-left: 180px;
    color: #5094ff;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    .titleTips-space {
      margin-left: 35px;
    }
    // span {
    //   &:not(:first-child) {
    //     margin-left: 35px;
    //   }
    // }
  }
}
</style>
