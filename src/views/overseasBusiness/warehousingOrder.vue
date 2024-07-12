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
    <PlaceOrderDialog
      ref="placeOrderRef"
      :tabType="pageType"
      title="海外入仓"
      @handleSuccess="mixinkeepTable"
    />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinTableConf } from "./components/mixinTabelConf.js";
import { warehousing } from "@/views/overseasBusiness/components/model.js";
import { getWarehouseClearanceList } from "@/api/operateRecord/customsClearance";
export default {
  name: "CustomsClearanceOrder",
  mixins: [mixinColsConf, mixinTableConf],
  data() {
    return {
      pageType: 3,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "海外入仓订单",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "下单",
            btnType: "dropdown",
            showTabName: "1",
            dropdownArr: [
              {
                name: "只入仓",
                value: 1,
                types: [3],
              },
              {
                name: "入仓+清关",
                value: 2,
                types: [3, 1],
              },
            ],
            handleClick: this.handlePlaceOrder,
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: this.searchList,
        searchForm: true,
        searchNum: warehousing.searchColumns.length,
        size: "small",
        labelWidth: "90px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: warehousing.searchColumns,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {},
      },
      tableConfig: {
        httpRequest: getWarehouseClearanceList,
        getQueryParams: this.getQueryParams,
      },
      mixinTableColArr: [warehousing.tableColumns],
      searchFromData: {},
      statusList: [
        {
          warehouseStatusArr: [0],
          packingMethod: 0,
          text: "预计提拆柜",
          type: "devanning",
          handleClick: this.handleBtnClick,
        },
        {
          warehouseStatusArr: [0],
          packingMethod: 1,
          text: "预约入仓",
          type: "warehousing",
          handleClick: this.handleBtnClick,
        },
        {
          warehouseStatusArr: [0],
          color: "#FF6767",
          text: "删除",
          type: "delete",
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
          (e.packingMethod || e.packingMethod === 0
            ? e.packingMethod === row.packingMethod
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
