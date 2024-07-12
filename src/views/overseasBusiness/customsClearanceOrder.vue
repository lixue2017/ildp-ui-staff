<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="setColumnMixinConf"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="rowOperationBtnListFn"
              @handleTableView="(row) => handleView(row, pageType)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <editDialogForm ref="dialogFormRef" @handleSuccess="mixinkeepTable" />
    <editTrailer
      ref="trailerEditRef"
      @handleSuccess="() => editTrailerSuccess(1)"
    />
    <!-- 自定义弹窗 -->
    <ComCustomDialog ref="customDlgRef" />
    <ConfirmDialog ref="confirmDlgRef" />
    <PlaceOrderDialog
      ref="placeOrderRef"
      :tabType="pageType"
      title="海外清关"
      @handleSuccess="mixinkeepTable"
    />
    <RegistrationDialog ref="registrationRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
  import { mixinTableConf } from "./components/mixinTabelConf.js";
import { customsClearance } from "@/views/overseasBusiness/components/model.js";
import { getDirecrClearanceList } from "@/api/operateRecord/customsClearance";
export default {
  name: "CustomsClearanceOrder",
  mixins: [mixinColsConf, mixinTableConf],
  data() {
    return {
      pageType: 1,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "海外清关订单",
            name: "1",
          },
        ],
        // btnArr: [
        //   {
        //     table: "下单",
        //     btnType: "dropdown",
        //     showTabName: "1",
        //     dropdownArr: [
        //       {
        //         name: "只清关",
        //         value: 1,
        //         types: [1],
        //       },
        //       {
        //         name: "清关+派送",
        //         value: 2,
        //         types: [1, 2],
        //       },
        //       {
        //         name: "清关+入仓",
        //         value: 3,
        //         types: [1, 3],
        //       },
        //     ],
        //     handleClick: this.handlePlaceOrder,
        //   },
        // ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: this.searchList,
        searchForm: true,
        searchNum: customsClearance.searchColumns.length,
        size: "small",
        labelWidth: "92px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: customsClearance.searchColumns,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {},
      },
      tableConfig: {
        httpRequest: getDirecrClearanceList,
        getQueryParams: this.getQueryParams,
      },
      mixinTableColArr: [customsClearance.tableColumns],
      searchFromData: {},
      statusList: [
        {
          statusArr: [0],
          text: "清关登记",
          type: "registration",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [0],
          text: "打回",
          type: "repulse",
          color: "#FF6767",
          handleClick: this.handleBtnClick,
        },
        {
          statusArr: [1],
          text: "清关放行",
          type: "release",
          handleClick: this.handleBtnClick,
        },
        {
          warehouseStatusArr: [0],
          freightType: 0,
          text: "预计提拆柜",
          type: "devanning",
          handleClick: this.handleBtnClick,
        },
        {
          warehouseStatusArr: [0],
          freightType: 1,
          text: "预约入仓",
          type: "warehousing",
          handleClick: this.handleBtnClick,
        },
        {
          warehouseStatusArr: [1],
          freightType: 0, // FCL
          text: "实际提拆柜",
          type: "realityUnpack",
          handleClick: this.handleBtnClick,
        },
      ],
    };
  },
  methods: {
    rowOperationBtnListFn(row) {
      const bArr = [...this.statusList];
      // const nBtnArr = bArr
      return bArr.filter(
        (e) =>
          (e.statusArr?.includes(row.status) ||
            (row.status !== 0 &&
              e.warehouseStatusArr?.includes(row.warehouseStatus))) &&
          (e.freightType || e.freightType === 0
            ? e.freightType === row.freightType
            : true)
      );
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .drawer-title {
      display: flex;
      & > span:first-child {
        margin-right: 30px;
      }
    }
  }
}
</style>
