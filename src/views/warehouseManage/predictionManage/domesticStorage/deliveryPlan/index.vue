<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <cabinetTable
              :ref="`tableRef${tab.name}`"
              :containerTableCols="tableColumns[idx]"
              :searchColumns="searchCols[idx]"
              :httpTableRequest="getSortBoxList"
              :active-tab="tabsConfig.activeName"
              isDelivery="delivery"
              :WEB_menuType="'deliveryPlan'"
              v-if="tabsConfig.activeName === tab.name"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import cabinetTable from "@/views/projectContainer/components/cabinetTable.vue";
import {
  exportSortBoxList,
} from "@/api/container/arrange.js";
import { searchColumns, tableColumns } from "./model";
import { getSortBoxList } from "@/api/container/arrange.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "DeliveryPlan",
  data() {
    return {
      searchCols: [searchColumns],
      tableColumns: [tableColumns],
      getSortBoxList,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "出库计划",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
              this.handleExport();
            },
          },
        ],
      },
    };
  },
  methods: {
    handleUpdate() {},
    handleExport() {
      const { activeName } = this.tabsConfig;
      const params = this.$refs[`tableRef${activeName}`][0].getQueryParams();
      comFileDownload(this, exportSortBoxList, params);
    },
  },
  components: {
    cabinetTable,
    ComTabs: () => import("_comp/ComTabs"),
  },
  created() {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
