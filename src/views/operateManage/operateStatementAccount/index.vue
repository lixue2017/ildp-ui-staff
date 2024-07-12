<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="{
                ...searchFormConfig,
                ...searchColumns(tab.name),
              }"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="
                tab.name != 1 &&
                tabsConfig.activeName === tab.name &&
                showSearchForm
              "
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="
                () => tableConfig.statusList[tab.name] || []
              "
              @handleTableView="handleView"
            />
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-else-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => getQueryParams(tab.name)"
              :span-method="handleSpanMethod"
              :rowOperationBtnListFn="
                () => tableConfig.statusList[tab.name] || []
              "
              @handleTableView="handleView"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <SearchDropdown
          v-if="tabsConfig.searchTabShow === tabsConfig.activeName"
          :searchFormData="mixinSearchFormData"
          :tabName="tabsConfig.activeName"
        />
      </template>
    </ComTabs>
    <CustomDialog ref="confirmDlgRef" />
  </div>
</template>

<script>
import {
  getTwoWayStatementPage,
  getBankChargesPage,
  getHedgingStatementPage,
  exportTwoWayStatement,
  exportBankCharges,
  exportHedgingStatement,
  saveOrUpdateRemark,
} from "@/api/operateManage/operateStatement.js";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns, remarkConfig } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { getStreamFileDownload } from "@/utils/zipdownload";
export default {
  name: "StatementAccount",
  mixins: [mixinColsConf],
  components: {
    CustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    SearchDropdown: () =>
      import("_comp/ComColumnConf/SearchColumn/SearchDropdown"),
  },
  data() {
    const tabBtnArr = [
      {
        table: "导出",
        icon: "iconfont daochu",
        hasPermission: ["settlementManage:paymentReceived:export"],
        handleClick: this.handleExport,
      },
    ];
    const btnArr = tabBtnArr.filter((e) => {
      const { hasPermission } = e;
      return hasPermission ? hasBtnPermits(hasPermission) : true;
    });
    return {
      tabsConfig: {
        activeName: "1",
        searchTabShow: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
          this.$nextTick(() => {
            this.tabsConfig.searchTabShow = this.tabsConfig.activeName;
          });
        },
        tabs: [
          {
            label: "双向对账单",
            name: "1",
          },
          {
            label: "对冲对账单",
            name: "2",
          },
          {
            label: "银行手续费",
            name: "3",
          },
        ],
        btnArr: btnArr || [],
      },
      searchFromData: {},
      searchColumns,
      searchFormConfig: {
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        columnMultiples: 2,
        residueCols: [2, 2],
        isGetSearchAll: true,
        expansion: false,
        labelWidth: "92px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 317px)",
        httpRequest: {
          1: this.getTwoWayStatementPage,
          2: getHedgingStatementPage,
          3: getBankChargesPage,
        },
        tableColumns,
        statusList: {
          1: [
            {
              text: "备注",
              handleClick: this.handleRemark,
            },
          ],
        },
      },
      mergeObj: {},
      mixinTableColArr: [tableColumns(1), tableColumns(2), tableColumns(3)],
    };
  },
  created() {
    // 默认当前用户
    this["dictionary/getDictionary"]([
      "soaStatus",
      "settlementBusinessType",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getList(searchFrom = {}) {
      //模糊搜索
      const { beginTime, webAllSearchFormData, currencyIdIn, ...searchObj } =
        searchFrom;
      const [createTimeBegin, createTimeEnd] = beginTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createTimeBegin,
        createTimeEnd,
        currencyIdIn: currencyIdIn ? currencyIdIn.join(",") : undefined,
      };
      this.mixinkeepTable(true, {
        isTableSearch: true,
        webAllSearchFormData,
      });
    },
    getQueryParams(tabName) {
      return this.searchFromData[tabName] || {};
    },
    getTwoWayStatementPage(params) {
      return new Promise((resolve, reject) => {
        getTwoWayStatementPage(params).then((res) => {
          const rows = [];
          let mergeColumn = 0;
          const mergeObj = {};
          res.rows.forEach((row, index) => {
            mergeColumn += 1;
            const { invoiceList, ...data } = row;
            if (invoiceList && invoiceList.length) {
              if (invoiceList.length > 1) {
                mergeObj[mergeColumn] = {
                  index,
                  num: invoiceList.length,
                };
              }
              rows.push(
                ...invoiceList.map((item) => ({
                  ...item,
                  ...data,
                  mergeColumn,
                  index: index + 1,
                }))
              );
            } else {
              rows.push({ ...row, index: index + 1 });
            }
          });
          this.mergeObj = mergeObj;
          resolve({
            ...res,
            rows,
          });
        });
      });
    },
    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      const { property } = column;
      if (
        ["applicant", "drawer", "invoiceCode", "invoiceNumber"].includes(
          property
        ) ||
        !row.mergeColumn ||
        !this.mergeObj[row.mergeColumn]
      ) {
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
      const { index, num } = this.mergeObj[row.mergeColumn];
      if (rowIndex === index) {
        return {
          rowspan: num,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    handleRemark(row) {
      const {
        settleReconciliationBillRemarkId: id,
        id: settleReconciliationBillId,
        remark,
        dataAnalysis,
      } = row;
      this.$refs.confirmDlgRef?.showCustomDialog({
        formModel: { remark, dataAnalysis },
        httpRequest: (opt) => {
          const { dataAnalysis, remark } = opt;
          return saveOrUpdateRemark({
            id,
            settleReconciliationBillId,
            dataAnalysis,
            remark,
          });
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
        customFormConfig: remarkConfig,
      });
    },
    handleExport() {
      const { activeName, tabs } = this.tabsConfig;
      const params = {
        ...this.getQueryParams(activeName),
      };
      const url = {
        1: "/operationSettlement/exportTwoWayStatement",
        2: "/operationSettlement/exportHedgingStatement",
        3: "/operationSettlement/exportBankCharges",
      };
      const customFileName = `${
        tabs[activeName - 1].label
      }${new Date().getTime()}`;
      getStreamFileDownload(url[activeName], params, {
        method: "get",
        isCustomFileName: true,
        customFileName,
      });
    },
    handleView(row, column) {
      console.log(row, column);
      const { payerBillNoId, payeeBillNoId, billNoId } = row;
      switch (column.prop) {
        case "payerBillNo":
          this.$router.push({
            path: "/settlementManagement/statementManage/editBillManage",
            query: {
              id: payerBillNoId,
              activeTab: "3",
              backPath: this.$route.path,
            },
          });
          break;
        case "payeeBillNo":
          this.$router.push({
            path: "/settlementManagement/statementManage/editBillManage",
            query: {
              id: payeeBillNoId,
              activeTab: "3",
              backPath: this.$route.path,
            },
          });
          break;
        case "billNo":
          this.$router.push({
            path: "/settlementManagement/statementManage/editBillManage",
            query: {
              id: billNoId,
              activeTab: "3",
              backPath: this.$route.path,
            },
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .com-tabs .tabs-right-btn {
    width: calc(100% - 310px);
    height: 29px;
    align-items: flex-end;

    .search-dropdown {
      padding: 0;
      flex: 1;
    }
  }
}
</style>
