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
              <template v-slot:locationId="slotProps">
                <AutoComplete
                  ref="agentRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    warehouseId: curWarehouseObj.value,
                  }"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :isMountedRequest="false"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'optNum'">
                  <div :class="`${slotProps.row.optNum >= 0 ? '' : 'fontRed'}`">
                    <span>{{ slotProps.row.optNum }}</span>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="setCurWarehouse" />
      </template>
    </ComTabs>
  </div>
</template>

<script>
import {
  getWarehouseStockLogList,
  exportBatchLog,
} from "@/api/goodsShelf/batchLog";
import { searchColumns, tableColumns } from "./model";
import { mapActions } from "vuex";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";

export default {
  name: "BatchLog",
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  mixins: [mixinColsConf, curWarehouseMixin],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        // handleTabsClick: this.initMixinColumnConf,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: this.overseaLangObj.sku_pc_rz || "SKU批次日志",
            name: "1",
          },
          {
            label: this.overseaLangObj.box_pc_rz,
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
                exportBatchLog,
                this.getQueryParams(this.tabsConfig.activeName)
              );
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "122px" : "90px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 316px)",
        httpRequest: getWarehouseStockLogList,
        columnConfig: tableColumns,
      },
      // mixinTableColArr: [tableColumns("1"), tableColumns("2")],
    };
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getList(searchFrom = {}) {
      const { activeName } = this.tabsConfig;
      const { createTime, orderTypes, ...searchObj } = searchFrom;
      this.searchFromData[activeName] = {
        ...searchObj,
        orderTypes: orderTypes && orderTypes.join(","),
        optBeginTime: createTime && createTime[0],
        optEndTime: createTime && createTime[1],
      };
      this.keepTableListMixin(true);
    },
    setCurWarehouse(obj) {
      this.getWarehouseTableMixin(obj);
      this.$refs.agentRef && this.$refs.agentRef[0]?.changeFocusRequest();
    },
    getQueryParams(tab) {
      return {
        ...this.searchFromData[tab],
        warehouseId: this.curWarehouseObj.value,
        type: [2, 1][tab - 1],
      };
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        ...searchColumns(tName),
        columnMultiples: tName == 1 ? 2 : 1,
      };
    },
  },
  created() {
    const { storageId, traySn, tName = "1" } = this.$route.query;
    this.tabsConfig.activeName = tName;
    this.searchFromData[tName] = this.searchFormConfig.formModel = {
      storageId,
      traySn,
    };
  },
  mounted() {
    this["dictionary/getDictionary"]("batchLog").then(() => {
      this.showSearchForm = true;
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .fontRed {
    color: red;
  }
}
</style>
