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
              :httpTableRequest="getBoxSortList"
              :active-tab="tabsConfig.activeName"
              v-if="tabsConfig.activeName === tab.name"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import cabinetTable from "../components/cabinetTable.vue";
import { searchColumns, tableColumns } from "./model";
import { getBoxSortList } from "@/api/container/arrange.js";
export default {
  name: "LoadContainer",
  data() {
    return {
      searchCols: [searchColumns],
      tableColumns: [tableColumns],
      getBoxSortList,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "堡森装柜信息",
            name: "1",
          },
        ],
      },
    };
  },
  methods: {
    handleUpdate() {},
  },
  components: {
    cabinetTable,
    ComTabs: () => import("_comp/ComTabs"),
  },
  created() {

  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
