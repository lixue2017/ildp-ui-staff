<template>
  <div class="chart-wrapper">
    <TitleTop :title="title">
      <template v-slot:right>
        <slot name="formSlot" />
      </template>
    </TitleTop>
    <div class="dual-table">
      <template v-for="(item, i) in ['left', 'right']">
        <ComTable
          :key="i"
          :ref="`tableRef${i}`"
          :columnConfig="tableConfig.columnConfig(i).lists"
          :pagination="false"
          :columnData="compData[item] || []"
          :style="{
            width: `calc(${tableConfig.columnConfig(i).width || '50%'} - 10px)`,
          }"
        >
          <template v-slot:customRow="{ slotProps }">
            <template
              v-if="
                [
                  'dyetj',
                  'dczjd',
                  'dyejd',
                  'fybx',
                  'ywsq',
                  'orderTotal',
                ].includes(slotProps.prop)
              "
            >
              <span
                :class="[
                  'num-tag',
                  ['dyejd', 'fybx'].includes(slotProps.prop) && 'tag-red',
                ]"
                v-if="
                  (slotProps.row[slotProps.prop] ||
                    slotProps.row[slotProps.prop] === 0) &&
                  compData[item].length - 1 !== slotProps.rowIndex
                "
                @click="handleSkip(slotProps.row, slotProps.config)"
              >
                {{ slotProps.row[slotProps.prop] }}
              </span>
              <div style="height: 22px" v-else>
                {{
                  slotProps.row[slotProps.prop] ||
                  slotProps.row[slotProps.prop] === 0
                    ? slotProps.row[slotProps.prop]
                    : "--"
                }}
              </div>
            </template>
          </template>
        </ComTable>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "orderPending",
    },
    title: {
      type: String,
      default: "",
    },
    columnConfig: {
      type: Function,
      default: () => {},
    },
    compData: {
      type: Object,
      default: null,
    },
  },
  components: {
    TitleTop: () => import("./components/TitleTop"),
    ComTable: () => import("_comp/ComTable"),
  },
  watch: {
    compData() {
      this.$nextTick(() => {
        this.$refs.tableRef0[0].refreshTable();
        this.$refs.tableRef1[0].refreshTable();
      });
    },
  },
  data() {
    return {
      tableConfig: {
        columnConfig: this.columnConfig,
      },
      data: {},
    };
  },
  methods: {
    handleSkip(row, config) {
      const { routeProp, paramProp } = config || {};
      const { route, params } = row;
      const path = routeProp ? row[routeProp] : route;
      if (!path) return;
      const itemProp = params ? params[paramProp] : row[paramProp];
      if (itemProp)
        Object.keys(itemProp).map((key) => {
          if (Array.isArray(itemProp[key])) {
            itemProp[key] = itemProp[key].map((val) => `${val}`);
          }
        });
      try {
        this.$router.push({
          path,
          query: itemProp
            ? {
                params: JSON.stringify(itemProp),
              }
            : {},
        });
      } catch {
        this.$message.error("跳转地址错误或无权限，请联系管理员！");
      }
    },
    getWidth() {
      const [column0, column1] = this.tableConfig.columnConfig;
      if (column0.length !== column1.length) {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dual-table {
  display: flex;
  justify-content: space-between;
  padding: 20px 0 31px;

  /deep/ .tableData {
    width: calc(50% - 10px);
    border-right: 1px solid #e2e2e2;
    border-left: 1px solid #e2e2e2;

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
    .el-table__row:last-child {
      & > td {
        background: rgba(80, 148, 255, 0.12);
      }
    }
  }
  .num-tag {
    line-height: 16px;
    display: inline-block;
    padding: 2px 11px;
    color: #66a5ff;
    background: rgba($color: #66a5ff, $alpha: 0.05);
    border-radius: 4px;
    border: 1px solid #66a5ff;
    cursor: pointer;

    &.tag-red {
      color: #ff6767;
      background: rgba($color: #ff6767, $alpha: 0.05);
      border-color: #ff6767;
      &:hover {
        background: rgba($color: #ff6767, $alpha: 0.3);
      }
    }
    &:hover {
      background: rgba($color: #66a5ff, $alpha: 0.3);
    }
  }
}
</style>