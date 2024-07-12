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
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="rowOperationBtnListFn"
              @handleTableView="handleView"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDlgRef" />
    <!-- 自定义弹窗 -->
    <ComCustomDialog ref="customDlgRef" />
    <OrderReceive ref="orderReceiveRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinTableConf } from "../components/mixinTableConf.js";
import {GetExportOperationDeliveryClearanceList} from "@/api/order/overSeaOther.js"
import { comFileDownload } from "@/utils/download.js";
export default {
  mixins: [mixinColsConf, mixinTableConf],
  components: {},
  props: {
    menuConfObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      source: 2, //  1直清 2派送
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "海外提派订单", // 海外其他订单/操作单
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleExport(),
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: this.searchList,
        searchForm: true,
        residueCols: [2],
        searchColsHeight: true,
        labelWidth: "113px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: this.menuConfObj.modelConfig.searchColumns,
                  },
                ],
              },
            ],
          },
        ],
      },
      tableConfig: {
        httpRequest: this.menuConfObj.httpRequest,
        getQueryParams: this.getQueryParams,
      },
      mixinTableColArr: [this.menuConfObj.modelConfig.tableColumns],
    };
  },
  methods: {
    rowOperationBtnListFn(row) {
      const bArr = [...this.statusList];
      // const nBtnArr = bArr
      return bArr.filter(
        (e) =>
          e.statusArr?.includes(row.overallStatus) ||
          (e.warehouseStatusArr &&
            e.warehouseStatusArr.includes(row.warehouseStatus) &&
            row.freightType === e.freightType)
      );
    },
    handlePlaceOrder() {
      this.$refs.placeOrderRef?.show();
    },
    handleExport(){
      const httpParams=this.getQueryParams()
      comFileDownload(this, GetExportOperationDeliveryClearanceList, httpParams);
    }
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
