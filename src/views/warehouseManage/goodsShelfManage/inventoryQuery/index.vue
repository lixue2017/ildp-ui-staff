<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="getSearchFormConfig(tab.name)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig[tab.name]"
              :httpRequest="tableConfig.httpRequest"
              :isMountedRequest="false"
              :getQueryParams="() => getQueryParams(tab.name)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'quantityInventory'">
                  <span
                    class="primary-text-btn"
                    @click="handleChangeRoute(slotProps.row, tab.name)"
                  >
                    {{ slotProps.row.quantityInventory }}
                  </span>
                </template>
              </template>

              <template v-slot:bottomTotal>
                <div class="grand-total">
                  <template v-for="(tItem, i) in tableSubtotal">
                    <span :key="`t_${i}`">
                      <span>{{ tItem.totalLabel }}：</span>
                      <span>{{ tItem.totalNum }}</span>
                    </span>
                  </template>
                </div>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="changeCurWarehouseTable" />
      </template>
    </ComTabs>
  </div>
</template>

<script>
import {
  getStockCbmList,
  stockExportExcel,
  getWarehouseStockTotal,
} from "@/api/goodsShelf/inventoryQuery";
import { searchColumns, tableColumns, boxTableColumns } from "./model";
import { mapActions } from "vuex";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";

export default {
  name: "InventoryQuery",
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.keepTableListMixin();
            this.handleWarehouseStockTotal();
          });
        },
        tabs: [
          {
            label: this.overseaLangObj.sku_kc,
            name: "1",
          },
          {
            label: this.overseaLangObj.box_kc,
            name: "2",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.dc_export("导出"),
            icon: "iconfont daochu",
            handleClick: () => {
              comFileDownload(
                this,
                stockExportExcel,
                this.getQueryParams(this.tabsConfig.activeName)
              );
            },
          },
        ],
      },
      searchFromData: {
        1: {},
        2: {},
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        // fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "118px" : "95px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 364px)",
        httpRequest: getStockCbmList,
        columnConfig: { 1: tableColumns, 2: boxTableColumns },
      },
      tableSubtotal: [],
    };
  },
  created() {
    this["dictionary/getDictionary"]("custTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleTabsClick() {},
    changeCurWarehouseTable(curObj) {
      this.getWarehouseTableMixin(curObj);
      this.handleWarehouseStockTotal();
    },
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = { ...searchFrom };
      this.keepTableListMixin(true);
      this.handleWarehouseStockTotal();
    },
    handleWarehouseStockTotal() {
      const tOpt = this.getQueryParams(this.tabsConfig.activeName);
      getWarehouseStockTotal(tOpt).then((res) => {
        this.tableSubtotal = [
          {
            totalLabel: this.overseaLangObj.kxs_zs || "可销售总数",
            totalNum: res.data?.quantityInventorySum || 0,
          },
          {
            totalLabel: this.overseaLangObj.dck_zs || "待出库总数",
            totalNum: res.data?.quantityOutboundSum || 0,
          },
        ];
      });
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName),
      };
    },
    handleChangeRoute(row, tName) {
      this.$router.push({
        path: "/warehouseManage/goodsShelfManage/batchInventory",
        query: {
          stockId: row.id,
          tName,
        },
      });
    },
    getQueryParams(tab) {
      return {
        ...this.searchFromData[tab],
        type: tab == 1 ? 0 : 1,
        warehouseId: this.curWarehouseObj.value,
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
