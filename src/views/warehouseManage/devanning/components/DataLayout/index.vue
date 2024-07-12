<template>
  <div>
    <div class="data-layout">
      <div class="title">
        <span>{{ handleDate(strippingData.currentMonth, "m") }}</span>
        <span class="color-tag color-tag-org">
          <i></i>
          <span>{{ overseaLangObj.wcg_un_devanning || "未拆柜" }}</span>
        </span>
        <span class="color-tag color-tag-blue">
          <i></i>
          <span>{{ overseaLangObj.ycg_devanning || "已拆柜" }}</span>
        </span>
      </div>
      <div class="card-outer">
        <template v-for="(item, i) in strippingData.dayDataVOList || {}">
          <div class="card-line" :key="i">
            <div class="date">
              {{ handleDate(item.day, "d") }}({{ item.week }})
            </div>
            <div
              class="detail"
              v-if="item.orderVoList && item.orderVoList.length"
            >
              <template v-for="(row, index) in item.orderVoList">
                <el-popover
                  placement="right"
                  width="390"
                  trigger="hover"
                  :key="`${index}-${row.id}`"
                >
                  <div :class="`card ${row.state && 'done'}`" slot="reference">
                    <div class="time">
                      {{ handleDate(`${item.day} ${row.time}`, "mm") }}
                    </div>
                    <div
                      class="code"
                      v-for="cKeyItem in [
                        'nlCode',
                        'bsCode',
                        'sortBoxRegisterNo',
                        // 'cabinetSn',
                      ]"
                      :key="cKeyItem"
                    >
                      <TooltipOver
                        :content="row[cKeyItem] || '--'"
                        :refName="`tooltipOver${cKeyItem}`"
                        :style="{
                          width: '130px',
                        }"
                      />
                    </div>
                    <div
                      v-for="keyItem in ['customerName', 'cabinetTypeNum']"
                      :key="keyItem"
                    >
                      <TooltipOver
                        :content="row[keyItem] || '--'"
                        :refName="`tooltipOver${keyItem}`"
                        :style="{
                          width: '130px',
                        }"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div :class="`row-label ${row.state && 'done'}`">
                      {{
                        row.state
                          ? overseaLangObj.ycg_devanning
                          : overseaLangObj.wcg_un_devanning
                      }}
                    </div>
                    <div class="row-title">
                      {{ handleDate(`${item.day} ${row.time}`, "time") }}
                    </div>
                    <ComForm
                      class="row-info"
                      ref="myForm"
                      :formConfig="{
                        ...formConfig,
                        formModel: {
                          ...row,
                        },
                      }"
                    >
                      <template v-slot:nlCode="slotProps">
                        <span
                          v-if="slotProps.formModel.nlCode"
                          class="primary-text-btn"
                          @click="handleClearanceView(slotProps.formModel)"
                        >
                          {{ slotProps.formModel.nlCode }}
                        </span>
                        <span v-else>--</span>
                      </template>
                      <template v-slot:bsCode="slotProps">
                        <span
                          v-if="slotProps.formModel.bsCode"
                          class="primary-text-btn"
                          @click="handleView(slotProps.formModel)"
                        >
                          {{ slotProps.formModel.bsCode }}
                        </span>
                        <span v-else>--</span>
                      </template>
                    </ComForm>
                    <div class="btn">
                      <el-button
                        type="text"
                        @click="stripping(row)"
                        v-if="!row.state"
                      >
                        {{ overseaLangObj.sj_tcg("实际提拆柜") }}
                        <i class="el-icon-d-arrow-right"></i>
                      </el-button>
                    </div>
                  </div>
                </el-popover>
              </template>
            </div>
            <div class="noData" v-else>
              {{ overseaLangObj.no_data("暂无数据哦～") }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="pagination">
      <div class="btn-page" @click="handlePage(-30)">
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <div class="btn-page margin-left" @click="handlePage(-7)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="date">{{ handleDate(strippingData.currentMonth, "m") }}</div>
      <div class="btn-page margin-right" @click="handlePage(7)">
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="btn-page" @click="handlePage(30)">
        <i class="el-icon-d-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { getStrippingView } from "@/api/warehouse/prediction";
import { formConfig } from "./model";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  props: {
    curWarehouseId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      searchFromData: {},
      formConfig: {
        formModel: {},
        labelWidth: "150px",
        lists: formConfig,
      },
      strippingData: {},
    };
  },
  watch: {
    curWarehouseId(val) {
      this.getList(val);
    },
  },
  created() {
    this.handleDate();
  },
  methods: {
    getList(id) {
      const warehouseId = id || this.curWarehouseId;
      if (!warehouseId) return;
      const { beginDate, endDate, offset } = this.searchFromData;
      const params = {
        warehouseId,
        beginDate,
        endDate,
        offset,
      };
      getStrippingView(params).then((res) => {
        this.handleDate(res.data.beginDate);
        this.strippingData = res.data;
        this.searchFromData = {
          beginDate: this.strippingData.beginDate,
          endDate: this.strippingData.endDate,
          offset: 0,
        };
      });
    },
    handlePage(num) {
      this.searchFromData.offset = num;
      this.getList();
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
    stripping(row) {
      this.$emit("stripping", row);
    },
    handleClearanceView(row) {
      this.$emit("handleClearanceView", row);
    },
    handleView(row) {
      this.$emit("handleView", row);
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

    .color-tag {
      i {
        display: inline-block;
        width: 16px;
        height: 6px;
        border-radius: 1px;
        vertical-align: middle;
        margin-right: 6px;
      }
      span {
        font-size: 13px;
        font-weight: 400;
      }
      &.color-tag-org i {
        background: #ff813d;
        margin-left: 60px;
      }
      &.color-tag-blue i {
        background: #5094ff;
        margin-left: 20px;
      }
    }
  }
  .card-outer {
    display: flex;
    .card-line {
      flex: 1 1 167px;
      display: flex;
      flex-direction: column;
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
        // &::-webkit-scrollbar {
        //   display: none;
        // }
        &::-webkit-scrollbar {
          z-index: 11;
          width: 6px;
        }
        &::-webkit-scrollbar:horizontal {
          height: 6px;
        }
      }
      .card {
        padding: 5px 0 5px 20px;
        border-left: 4px solid #ff813d;
        border-radius: 4px;
        line-height: 18px;
        background: rgba($color: #ff813d, $alpha: 0.1);
        margin-bottom: 10px;
        cursor: pointer;
        &:hover {
          background: rgba($color: #ff813d, $alpha: 0.4);
        }
        &.done {
          border-color: #5094ff;
          background: rgba($color: #5094ff, $alpha: 0.1);
          &:hover {
            background: rgba($color: #5094ff, $alpha: 0.4);
          }
        }
        .time {
          margin-bottom: 5px;
          color: #8b8b8b;
        }
        .code {
          margin-bottom: 2px;
        }
      }
      .noData {
        text-align: center;
        color: #8b8b8b;
        margin-top: 27px;
      }
    }
  }
}
.row {
  position: relative;
  padding: 0 10px;
  .primary-text-btn {
    color: #5094ff;
    cursor: pointer;
  }
  .row-label {
    position: absolute;
    right: -12px;
    top: -12px;
    min-width: 65px;
    padding: 0 6px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    border-radius: 0px 4px 0px 14px;
    background: #ff813d;
    color: #fff;

    &.done {
      background: #5094ff;
    }
  }
  .row-title {
    font-weight: bold;
    margin-bottom: 19px;
  }
  .row-info {
    /deep/ .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
  }
  .btn {
    line-height: 49px;
    height: 49px;
    text-align: right;
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
<style lang="scss">
.el-popover {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  border: none;
}
.el-popper[x-placement^="right"] {
  transform: translateX(-5px);
  .popper__arrow {
    border-right-color: #fff;
  }
}
.el-popper[x-placement^="left"] {
  transform: translateX(5px);
  .popper__arrow {
    border-left-color: #fff;
  }
}
</style>
