<template>
  <div class="chart-wrapper" v-if="compData">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs || []">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              maxTableHeight="calc(100vh - 340px)"
              :columnConfig="tableConfig"
              :columnData="compData"
              :treeProps="{ children: 'childNodeList' }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'common'">
                  <span
                    class="process-num"
                    @click="
                      handleSkip(
                        slotProps.row.commonRoute,
                        slotProps.row.commonParams
                      )
                    "
                    :style="{ color: slotProps.column.color }"
                    v-if="
                      slotProps.row.commonRoute && slotProps.row[slotProps.prop]
                    "
                  >
                    <span>{{ slotProps.row[slotProps.prop] }}</span>
                  </span>
                  <span v-else>{{
                    slotProps.row[slotProps.prop] ||
                    slotProps.row[slotProps.prop] === 0
                      ? slotProps.row[slotProps.prop]
                      : "-"
                  }}</span>
                </template>
                <template v-if="slotProps.prop === 'urgent'">
                  <span
                    class="process-num"
                    @click="
                      handleSkip(
                        slotProps.row.urgentRoute,
                        slotProps.row.urgentParams
                      )
                    "
                    :style="{ color: slotProps.column.color }"
                    v-if="
                      slotProps.row.urgentRoute && slotProps.row[slotProps.prop]
                    "
                  >
                    <span>{{ slotProps.row[slotProps.prop] }}</span>
                  </span>
                  <span v-else>{{
                    slotProps.row[slotProps.prop] ||
                    slotProps.row[slotProps.prop] === 0
                      ? slotProps.row[slotProps.prop]
                      : "-"
                  }}</span>
                </template>
                <template v-if="slotProps.prop === 'overtime'">
                  <span
                    class="process-num"
                    @click="
                      handleSkip(
                        slotProps.row.overtimeRoute,
                        slotProps.row.overtimeParams
                      )
                    "
                    :style="{ color: slotProps.column.color }"
                    v-if="
                      slotProps.row.overtimeRoute &&
                      slotProps.row[slotProps.prop]
                    "
                  >
                    <span>{{ slotProps.row[slotProps.prop] }}</span>
                  </span>
                  <span v-else>{{
                    slotProps.row[slotProps.prop] ||
                    slotProps.row[slotProps.prop] === 0
                      ? slotProps.row[slotProps.prop]
                      : "-"
                  }}</span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { operateLoadingConfig } from "./components/model";
export default {
  props: {
    compData: {
      type: Array,
      default: null,
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableConfig: operateLoadingConfig,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: "电商进行中操作单",
            name: "1",
          },
          {
            label: "传统进行中的操作单",
            name: "2",
          },
        ],
        btnArr: [],
      },
    };
  },
  watch: {
    compData: {
      deep: true,
      handler(data) {
        this.$refs[`tableRef${this.tabsConfig.activeName}`] &&
          this.$refs[
            `tableRef${this.tabsConfig.activeName}`
          ][0].setNewTableData(data);
      },
    },
  },
  methods: {
    handleTabsClick() {
      this.$emit("handleTabs", {
        type: this.tabsConfig.activeName,
      });
    },
    handleSkip(path, params = {}) {
      if (!path) return;
      const query = {};
      if (Object.keys(params).length) {
        query.params = JSON.stringify(params);
      }
      try {
        this.$router.push({
          path,
          query,
        });
      } catch {
        this.$message.error("暂无权限，请联系管理员！");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  padding: 9px 24px 20px !important;
}
.process-num {
  cursor: pointer;
  text-decoration: underline;
}
/deep/ {
  .el-table {
    overflow: auto;
    &::before {
      display: none;
    }
  }
  .el-tabs__header {
    margin: 0;
  }
  .com-tabs .el-tabs__item {
    font-size: 16px;
    line-height: 22px;
    padding-bottom: 7px;
  }
  .el-table--border th.table-header-cell:first-child .cell {
    padding-left: 35px;
  }
}
</style>
