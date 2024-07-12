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
              :columnConfig="tableColumns(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              :rowOperationBtnListFn="
                (row) =>
                  [0, 2, 3, 4, 5].includes(row.domesticQuotationSheetState)
                    ? tableConfig.statusBtnList
                    : []
              "
              :colShowBtnFn="
                (rItem, row) =>
                  operationBtn(rItem, row.domesticQuotationSheetState)
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
import { bookingSearchConfig, bookingTableColumns } from "../components/model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinEnquiry } from "../components/mixinEnquiry";
export default {
  name: "BookingQuotation",
  mixins: [mixinColsConf, mixinEnquiry],
  data() {
    return {
      tableColumns: bookingTableColumns,
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
            label: "海运订舱询价",
            name: "1",
          },
          {
            label: "空运订舱询价",
            name: "2",
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
        labelWidth: "85px",
        ...bookingSearchConfig,
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
            color: "#FF6767",
            showState: [0],
            handleClick: (row) =>
              this.handleVoid(row.domesticQuotationSheetId, 1),
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
              this.handleUpdate(row.domesticQuotationSheetId, 3),
          },
          {
            text: "撤回提交",
            showState: [3],
            handleClick: (row) =>
              this.handleRecall(row.domesticQuotationSheetId),
          },
          {
            text: "报价方案",
            showState: [5],
            handleClick: this.togoView,
          },
        ],
      },
      queryPage: 2,
    };
  },
  created() {
    const initParam = {
      domesticQuotedPriceUserIdEq: this.userId,
      domesticQuotedPriceUserName: this.name,
    };
    this.searchFromData = {
      1: { shippingModeEq: 1, ...initParam },
      2: { shippingModeEq: 2, ...initParam },
    };
    this.searchFormConfig.formModel = { ...initParam };
  },
  methods: {
    togoView(row) {
      this.handleView(row, "/enquiryManage/bookingQuotationDetail");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
