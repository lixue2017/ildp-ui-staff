<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              :dictionary="dictionary"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="
                (row) =>
                  [0, 2, 3, 4, 5].includes(row.foreignQuotationSheetState)
                    ? tableConfig.statusBtnList
                    : []
              "
              :colShowBtnFn="
                (rItem, row) =>
                  operationBtn(rItem, row.foreignQuotationSheetState)
              "
              @handleTableView="togoView"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDlgRef" />
  </div>
</template>

<script>
import { getEnquiryList } from "@/api/enquiryManage";
import { seaSearchConfig, seaTableColumns } from "../components/model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinEnquiry } from "../components/mixinEnquiry";
export default {
  name: "OverSeaQuotation",
  mixins: [mixinColsConf, mixinEnquiry],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "海外到门报价",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getEnquiryList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "85px",
        ...seaSearchConfig,
      },
      tableConfig: {
        getQueryParams: this.getQueryParams,
        httpRequest: getEnquiryList,
        statusBtnList: [
          {
            text: "报价",
            showState: [0],
            handleClick: this.togoView,
          },
          {
            text: "打回",
            showState: [0],
            color: "#FF6767",
            handleClick: (row) =>
              this.handleVoid(row.foreignQuotationSheetId, 1),
          },
          {
            text: "编辑",
            showState: [2, 4],
            handleClick: this.togoView,
          },
          {
            text: "提交",
            showState: [2],
            handleClick: (row) =>
              this.handleUpdate(row.foreignQuotationSheetId, 3),
          },
          {
            text: "撤回提交",
            showState: [3],
            handleClick: (row) =>
              this.handleRecall(row.foreignQuotationSheetId),
          },
          {
            text: "报价方案",
            showState: [5],
            handleClick: this.togoView,
          },
        ],
      },
      queryPage: 3,
      mixinTableColArr: [seaTableColumns],
    };
  },
  created() {
    const initParam = {
      foreignQuotedPriceUserIdEq: this.userId,
      foreignQuotedPriceUserName: this.name,
    };
    this.searchFromData = {
      ...initParam,
    };
    this.searchFormConfig.formModel = { ...initParam };
  },
  methods: {
    togoView(row) {
      this.handleView(row, "/enquiryManage/overSeaQuotationDetail");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
