<template>
  <div>
    <div class="data-layout">
      <div class="title">
        <span>{{ columnData.currentMonth }}</span>
      </div>
      <div class="card-outer">
        <template v-for="(item, index) in columnData.dayDataVOList">
          <div class="card-line" :key="index">
            <div class="date">
              {{ item.day ? item.day : "暂无日期" }}
            </div>
            <div class="detail">
              <template v-for="(row, rowIdx) in item.routeVoList">
                <div
                  :class="`card ${
                    (row.orderNum && !row.isCabinet && 'edit') ||
                    (!row.orderNum && !row.isCabinet && 'deleteOrEdit')
                  }`"
                  :key="rowIdx"
                >
                  <slot name="viewContent" :slotProps="{ row }" />
                  <!-- 根据不同的页面展示内容写在页面组件中 -->
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="pagination">
      <div class="btn-page" @click="_getSonoViewLists(-30)">
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <div class="btn-page margin-left" @click="_getSonoViewLists(-7)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="date">{{ handleDate(columnData.currentMonth, "m") }}</div>
      <div class="btn-page margin-right" @click="_getSonoViewLists(7)">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="btn-page" @click="_getSonoViewLists(30)">
        <i class="el-icon-d-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getSonoViewLists } from "@/api/marketManage/airline.js";
export default {
  name: "changeView",
  // mixins: [mixinColsConf],
  computed: {
    ...mapState(["dictionary"]),
  },
  props: {
    isRefresh: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      viewParams: {
        beginDate: "",
        stopDate: "",
      },
      columnData: {},
    };
  },
  watch: {
    isRefresh: {
      deep: true,
      handler: function (newVal, oldVal) {
        console.log("newVal", newVal);
        if (newVal) {
          this._getSonoViewLists(0);
        }
      },
    },
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      this.showSearchForm = true;
    });
  },
  mounted() {
    this._getSonoViewLists(0);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    _getSonoViewLists(num) {
      const { beginDate, stopDate } = this.viewParams;
      const params = {
        beginDate,
        stopDate,
        offset: num,
      };
      getSonoViewLists(params).then((res) => {
        const { beginDate, stopDate } = res.data;
        this.columnData = res.data;
        this.viewParams = {
          beginDate,
          stopDate,
        };
        this.$emit("isRefresh", false);
      });
    },
    handleDate(oDate, type = "d") {
      let curr = new Date();
      if (oDate) {
        curr = new Date(oDate);
      }
      const y = curr.getFullYear();
      let m = curr.getMonth() + 1;
      let d = curr.getDate();
      let h = curr.getHours();
      let mm = curr.getMinutes();
      m = m > 9 ? m : `0${m}`;
      d = d > 9 ? d : `0${d}`;
      h = h > 9 ? h : `0${h}`;
      mm = mm > 9 ? mm : `0${mm}`;
      if (type === "m") {
        return `${y}年 ${m}月`;
      }
      if (type === "d") {
        return `${d}日`;
      }
      if (type === "time") {
        return `${y}/${m}/${d} ${h}:${mm}`;
      }
      if (type === "mm") {
        return `${h}:${mm}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.data-layout {
  height: calc(100vh - 221px);
  border: 1px solid #e2e2e2;
  .title {
    font-size: 14px;
    height: 51px;
    font-weight: bold;
    line-height: 51px;
    padding-left: 20px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.07);
  }
  .card-outer {
    display: flex;
    .card-line {
      display: flex;
      flex-direction: column;
      width: calc(100% / 7);
      height: calc(100vh - 274px);
      padding: 0px 1px;
      &:not(:last-child) {
        border-right: 1px solid #e2e2e2;
      }
      .date {
        color: #8b8b8b;
        text-align: center;
        margin: 9px 0 13px;
      }
      .detail {
        height: calc(100vh - 311px);
        overflow-y: auto;
        &::-webkit-scrollbar {
          z-index: 11;
          width: 6px;
        }
        &::-webkit-scrollbar:horizontal {
          height: 6px;
        }
      }
      .card {
        padding: 5px;
        border-left: 4px solid #ff813d;
        border-radius: 4px;
        line-height: 25px;
        background: rgba($color: #ff813d, $alpha: 0.1);
        margin-bottom: 10px;
        // cursor: pointer;
        // &:hover {
        //   background: rgba($color: #ff813d, $alpha: 0.4);
        // }
        &.edit {
          border-color: #63a103;
          background: rgba($color: #63a103, $alpha: 0.1);
          // &:hover {
          //   background: rgba($color: #63A103, $alpha: 0.4);
          // }
        }
        &.deleteOrEdit {
          border-color: #3179ef;
          background: #ebf2fd;
          // &:hover {
          //   background: rgba($color: #ff813d, $alpha: 0.4);
          // }
        }
        // .time {
        //   margin-bottom: 5px;
        //   color: #8b8b8b;
        // }
        // .code {
        //   margin-bottom: 2px;
        // }
      }
      .noData {
        text-align: center;
        color: #8b8b8b;
        margin-top: 27px;
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 36px 0 28px;
  .btn-page {
    font-size: 12px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #fff;
    background: rgba(80, 148, 255, 0.7);
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    &.margin-left {
      margin-left: 6px;
    }
    &.margin-right {
      margin-right: 6px;
    }
  }
  .date {
    padding: 0 15px;
    color: #696969;
  }
}
</style>
