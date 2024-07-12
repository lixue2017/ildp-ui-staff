<template>
  <div class="chart-wrapper">
    <TitleTop title="操作流程">
      <template v-slot:right>
        <slot name="formSlot" />
      </template>
    </TitleTop>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :extraConfig="{
        stripe: false,
      }"
      :pagination="false"
      :defaultExpandAll="true"
      :columnData="compData || []"
    >
      <template v-slot:customRow="{ slotProps }">
        <template
          v-if="
            slotProps.prop === 'expand' &&
            slotProps.row.childNodeList &&
            slotProps.row.childNodeList.length
          "
        >
          <ComTable
            :ref="`expandTable${slotProps.row.id}`"
            :columnConfig="slotProps.config.column"
            :extraConfig="slotProps.config.extraConfig"
            :pagination="false"
            :columnData="slotProps.row.childNodeList"
          >
            <template v-slot:customRow="{ slotProps: expandProps }">
              <template v-if="expandProps.prop === 'name'">
                <div class="indentation">
                  |- {{ expandProps.row[expandProps.prop] || "--" }}
                </div>
              </template>
              <template v-if="['db', 'jxz', 'ywj'].includes(expandProps.prop)">
                <ProcessItem :slotProps="expandProps" />
              </template>
            </template>
          </ComTable>
        </template>
        <template v-if="['db', 'jxz', 'ywj'].includes(slotProps.prop)">
          <ProcessItem :slotProps="slotProps" />
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "@/views/dashboard/components/processList";
export default {
  props: {
    compData: {
      type: Array,
      default: null,
    },
  },
  components: {
    TitleTop: () => import("@/views/dashboard/components/TitleTop"),
    ProcessItem: () => import("@/views/dashboard/components/ProcessItem"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableColumns,
    };
  },
  watch: {
    compData() {
      this.$nextTick(() => {
        this.$refs.tableRef.refreshTable();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container .card .chart-wrapper {
  padding-bottom: 30px;
  & > .tableData {
    margin-top: 17px;
    border-left: 1px solid #e2e2e2;
    border-right: 1px solid #e2e2e2;
    /deep/ {
      .table-header-row {
        min-height: 40px;
        height: 40px;

        th {
          height: 40px;
          padding: 5px 0;
        }
      }
      .el-table__cell {
        padding: 8px 0;
      }
      .el-table__expanded-cell {
        padding: 0;
        border: none;
        .tableData {
          padding: 0;
          margin-top: -1px;
        }
      }
    }
    .indentation {
      padding-left: 62px;
    }
  }
}
</style>