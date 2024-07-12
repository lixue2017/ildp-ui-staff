<template>
  <div class="chart-wrapper">
    <TitleTop title="待办">
      <template v-slot:right>
        <el-button type="primary" size="small" round @click="goMsgList"
          >查看全部</el-button
        >
      </template>
    </TitleTop>
    <ComTable
      ref="tableRef"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableConfig.columnConfig"
      :extraConfig="tableConfig.extraConfig"
      :columnData="compData"
      :rowOperationBtnListFn="rowOperationBtnListFn"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'msgContent'">
          <div
            class="show-overflow-tooltip"
            v-html="handleContent(slotProps.row.msgContent)"
          ></div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./components/model";
import { handleContent } from "@/utils";
export default {
  props: {
    compData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TitleTop: () => import("@/views/dashboard/components/TitleTop"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      handleContent,
      tableConfig: {
        tableHeight: "600px",
        columnConfig: tableColumns,
        extraConfig: {
          showHeader: false,
          stripe: false,
        },
      },
      rowOperationBtnListFn: () => [
        {
          text: "去处理>>",
          handleClick: this.handleClick,
        },
      ],
    };
  },
  methods: {
    handleClick(row) {
      const { route, params = {} } = row;
      if (!route) return;
      this.$router.push({
        path: route,
        query: {
          ...params,
          backPath: this.$route.fullPath,
        },
      });
    },
    goMsgList() {
      try {
        this.$router.push({
          name: "MessageList",
          params: {
            isTodo: true,
          },
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
  .chart_top {
    border-bottom: none;
  }
  .tableData {
    padding-bottom: 30px;
    /deep/ {
      .el-table__cell {
        padding: 4px 0;
      }
      .operation-content-btn {
        .el-button {
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>