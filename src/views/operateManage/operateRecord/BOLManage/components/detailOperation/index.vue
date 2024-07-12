<template>
  <div class="table-tag">
    <div class="title">
      <div alt="title">
        {{ columnConfig.title }}
      </div>
    </div>
    <div class="content">
      <template v-for="(row, idx) in tableData">
        <div
          :class="`item tag-flex ${
            row.popId === (tableActive && tableActive.popId) ? 'active' : ''
          }`"
          :key="idx"
          @click="handleTableChange(row)"
        >
          <div class="item-right">
            <div class="item-top tag-flex" v-if="columnConfig.top">
              <template v-for="column in columnConfig.top">
                <TooltipOver
                  v-if="column.type !== 'slot'"
                  :key="column.prop"
                  :content="`${column.render(row)}`"
                  refName="tooltipOver"
                  :style="{ width: 'calc(100% - 140px)', flex: 1 }"
                />
                <slot
                  v-else
                  :name="column.prop"
                  :slotProps="{
                    prop: column.prop,
                    row,
                  }"
                />
              </template>
            </div>
            <div class="item-bottom tag-flex" v-if="columnConfig.bottom">
              <template v-for="(column, i) in columnConfig.bottom">
                <TooltipOver
                  :key="`btm_${i}`"
                  :content="`${column.render(row)}`"
                  refName="tooltipOver"
                  :style="{
                    width: i === 0 ? 'calc(100% - 140px)' : '140px',
                    flex: 1,
                  }"
                />
              </template>
            </div>
          </div>
        </div>
      </template>
      <div class="table-empty" v-if="!tableData.length">
        <img :src="noDataImg" alt="" srcset="" width="150px" />
        <div>
          没有列表数据哦～ <br />
          快去添加吧！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import noDataImg from "@/assets/image/noData.png";
import { mapState } from "vuex";
export default {
  components: {
    MyPagination: () => import("_comp/ComTable/MyPagination"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  props: {
    columnConfig: {
      type: Object,
      default: () => {},
    },
    columnData: {
      type: Array,
      default: null,
    },
    httpRequest: {
      type: Function,
      default: () => {},
    },
    getQueryParams: {
      type: Function,
      default: () => {},
    },
    paginationConfig: {
      type: Object,
      default: () => {
        return {
          limit: 10,
          layout: "total, prev, pager, next",
        };
      },
    },
  },
  data() {
    return {
      tableData: [],
      noDataImg,
      tableActive: "",
    };
  },
  watch: {
    columnData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.tableData = newVal;
      },
    },
  },
  computed: {
    // ...mapState(["dictionary"]),
  },
  mounted() {
    // console.log(this.columnData)
    // this.columnData.map((item, index) => {
    //   //只会出现1个主单isMainBill为1,排除掉这一个主单
    //   if (item.isMainBill === 1 || item.isMainBill === "1") {
    //     this.columnData.splice(index, 1);
    //     return;
    //   }
    // });
    this.tableData = this.columnData;
    // this.getTableData(this.getQueryParams());
  },
  methods: {
    handleTableChange(row) {
      this.tableActive = row;
      this.$emit("handleClick", this.tableActive);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  padding-left: 14px;
  padding-right: 14px;
}
.table-tag {
  font-size: 13px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tag-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tag-top {
    justify-content: space-between;
    padding: 0 14px;
    .title {
      font-size: 14px;
    }
  }
  .content {
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding-top: 15px;

    .el-button--text {
      padding: 0;
    }
    .item {
      padding: 0 14px;
      cursor: pointer;
      &:first-child {
        .item-right {
          border-top: 1px solid #e2e2e2;
        }
      }
      &:hover {
        background: #f4f8ff;
      }
      &.active {
        background: #e3edff;
      }
      .item-left {
        width: 26px;
        height: 26px;
        line-height: 24px;
        text-align: center;
        border: 1px solid;
        border-radius: 2px;
        margin-right: 9px;
      }
      .item-right {
        // width: calc(100% - 38px); 修改标记
        width: 100%;
        line-height: 30px;
        padding: 9px 0;
        border-bottom: 1px solid #e2e2e2;
        .item-top > div {
          padding-right: 10px;
          &:last-child {
            padding-right: 0;
          }
        }
        .item-bottom {
          color: #8b8b8b;
          & > div {
            padding-right: 10px;
            &:last-child {
              padding-right: 0;
            }
          }
        }
      }
    }
    .table-empty {
      width: 100%;
      position: absolute;
      top: 40%;
      transform: translateY(-50%);
      text-align: center;
      line-height: 20px;
      color: #919191;
      img {
        padding: 30px 0 14px;
      }
    }
  }
}
</style>
