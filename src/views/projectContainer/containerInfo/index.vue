<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <arrangeContainerTable
              v-if="tabsConfig.activeName === tab.name"
              :containerTableCols="tableColumns[idx]"
              :searchColumns="searchCols[idx]"
              :active-tab="tabsConfig.activeName"
              @onSelectionChange="onSelectionChange"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { duplicateRemoval } from "@/utils/index";
import arrangeContainerTable from "../components/arrangeContainerTable.vue";
import {
  waitSearchCols,
  doneSearchCols,
  waitTableCols,
  doneTableCols,
} from "./model";
export default {
  name: "ContainerInfo",
  data() {
    return {
      searchCols: [waitSearchCols, doneSearchCols],
      tableColumns: [waitTableCols, doneTableCols],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          const bArr = this.tabsConfig.activeName === "1" ? this.tabBtnArr : [];
          this.$set(this.tabsConfig, "btnArr", bArr);
        },
        tabs: [
          {
            label: "待排柜",
            name: "1",
          },
          {
            label: "已排柜",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          table: "批量排柜",
          disabled: true,
          handleClick: () => this.handleUpdate(),
        },
      ],
      selectionRows: [],
    };
  },
  methods: {
    onSelectionChange(rows = []) {
      this.selectionRows = [...rows]; // 点击批量排柜时获取上下页ID
      this.$set(this.tabBtnArr[0], "disabled", !rows.length); // 判断批量排柜是否可点击
    },
    handleUpdate() {
      const { bookingSpaceProxy, warehouseId } = this.selectionRows[0];
      const rowIds = this.selectionRows.map((e) => e.orderId);
      const idRows = duplicateRemoval(rowIds).join(",");
      this.$router.push({
        path: "/projectContainer/editLoadContainer",
        query: {
          idRows,
          bookingSpaceProxy,
          warehouseId,
          backPath: this.$route.path,
        },
      });
      this.onSelectionChange();
    },
  },
  components: {
    arrangeContainerTable,
    ComTabs: () => import("_comp/ComTabs"),
  },
  created() {
    this.$set(this.tabsConfig, "btnArr", this.tabBtnArr);
  },
};
</script>
