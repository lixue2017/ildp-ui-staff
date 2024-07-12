<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(idx)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig(idx)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getTableQueryParams"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="getStatusBtnList"
            >
              <!-- <template v-slot:customRow="{ slotProps }">
								
              </template> -->
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getProductSkuList, printProductSku } from "@/api/warehouse/basic";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";

export default {
  name: "SkuManagement",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.cp_sku_gl || "产品SKU管理",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.pl_print("批量打印"),
            disabled: true,
            showTabName: "1",
            handleClick: () => this.handlePrint(),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "85px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        searchForm: true,
        fold: true,
      },
      selectionRows: [],
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getProductSkuList,
        statusBtnList: [
          {
            text: this.overseaLangObj.dy_print("打印"),
            statusBtnArr: [0, 1],
            handleClick: (r) => this.handlePrint([r]),
          },
        ],
      },
    };
  },
  methods: {
    handlePrint(rows) {
      const printIds = (rows || this.selectionRows).map((e) => e.id);
      comFileDownload(this, printProductSku, printIds.join(","));
      this.mixinTimeResetSelection();
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [beginTime, endTime] = createTime || [];
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        beginTime,
        endTime,
      };
      this.mixinkeepTable(true);
    },
    getTableQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        warehouseId: this.curWarehouseObj.value,
      };
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns,
      };
    },
    tableTabConfig() {
      return tableColumns();
    },
    getStatusBtnList(row) {
      return this.tableConfig.statusBtnList.filter((e) =>
        e.statusBtnArr.includes(row.useStatus || 0)
      );
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  created() {
    this["dictionary/getDictionary"](["warehousingSource"]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
