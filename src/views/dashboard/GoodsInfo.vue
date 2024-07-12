<template>
  <div class="chart-wrapper">
    <TitleTop :title="title">
      <template v-slot:right>
        <slot name="formSlot" />
      </template>
    </TitleTop>
    <div class="load-div" v-loading="loading" v-if="loading"></div>
    <template v-else>
      <template v-if="cardInfo.topList && cardInfo.topList.length">
        <div class="chart-content">
          <div
            class="chart-item"
            v-for="(item, i) in cardInfo.topList"
            :key="i"
          >
            <div class="grade-num">
              <img :src="numIcon[i + 1]" alt="" v-if="numIcon[i + 1]" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <TooltipOver
              :content="handleName(item.name)"
              class="card-tooltipOver"
              refName="tooltipOver"
              :style="`width:${labelWidth}px`"
            />
            <el-tooltip
              popper-class="progress-popper"
              placement="top"
              :hide-after="1000000"
            >
              <div slot="content">
                <div class="tooltip-val">
                  <count-to
                    :start-val="item.subTotal"
                    :end-val="item.subTotal"
                    :decimals="gross.decimals || 0"
                  />
                  {{ gross.unit }}
                </div>
                <div class="tooltip-label">
                  {{ handleName(item.name) }}
                </div>
              </div>
              <el-progress
                :percentage="item.progress || 0"
                :color="i < 3 ? '#7EB9FD' : '#C8E2FF'"
                :show-text="false"
                :stroke-width="8"
              ></el-progress>
            </el-tooltip>
            <count-to
              :start-val="0"
              :end-val="item.subTotal || 0"
              :duration="duration"
              :decimals="gross.decimals || 0"
              class="chart-item-num"
            />
          </div>
        </div>
        <div class="grand-total">
          <template v-for="(item, index) in goodsType">
            <span :key="index">
              <span class="label">总{{ item.label }}：</span
              ><span class="value"
                ><count-to
                  :start-val="0"
                  :end-val="Number(cardInfo[item.propTotal])"
                  :duration="duration"
                  :decimals="item.decimals || 0"
                />({{ item.unit }})</span
              >
            </span>
          </template>
        </div>
      </template>
      <div class="no-data" v-else>暂无货物信息~</div>
    </template>
  </div>
</template>

<script>
import { goodsType } from "@/views/dashboard/components/model";
import first from "@/assets/image/home/first.svg";
import second from "@/assets/image/home/second.svg";
import third from "@/assets/image/home/third.svg";
import CountTo from "vue-count-to";
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    queryType: {
      type: Number,
      default: 2,
    },
    labelWidth: {
      type: Number,
      default: 90,
    },
    compData: {
      type: Object,
      default: null,
    },
    gross: {
      type: Object,
      default: () => ({}),
    },
    handleName: {
      type: Function,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
    TitleTop: () => import("./components/TitleTop"),
    CountTo,
  },
  data() {
    return {
      goodsType,
      numIcon: {
        1: first,
        2: second,
        3: third,
      },
      cardInfo: {},
      duration: 2000,
    };
  },
  watch: {
    compData(newVal, oldVal) {
      if (newVal) {
        this.getCardInfo(newVal);
      }
    },
  },
  mounted() {
    if (this.compData) {
      this.getCardInfo(this.compData);
    }
  },
  methods: {
    getCardInfo(data) {
      const gross = this.gross;
      const total = data[gross.propTotal];
      data.topList = (data.topList || []).map((item) => ({
        ...item,
        subTotal: Number(item.value),
        progress: 0,
      }));
      this.cardInfo = data;
      setTimeout(() => {
        this.cardInfo.topList = this.cardInfo.topList.map((item) => ({
          ...item,
          progress: (Number(item.value) / Number(total)) * 100,
        }));
      });
    },
  },
};
</script>

<style lang="scss">
.progress-popper.is-dark {
  padding: 4px 15px 8px;
  background: rgba(0, 0, 0, 0.4);
  &[x-placement^="top"] {
    .popper__arrow {
      border-top-color: #999999;
      &::after {
        border-top-color: #999999;
      }
    }
  }
  &[x-placement^="bottom"] {
    .popper__arrow {
      border-width: 2px;
      border-bottom-color: #999999;
      &::after {
        border-bottom-color: #999999;
      }
    }
  }
  .popper__arrow {
    border-top-color: #999999;
    &::after {
      border-top-color: #999999;
    }
  }
  .tooltip-val {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    margin-bottom: 5px;
  }
  .tooltip-label {
    font-size: 13px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
<style lang="scss" scoped>
.select-date {
  width: 220px;
  margin-right: 20px;
}
.chart-wrapper {
  /deep/ {
    .chart_top .title {
      min-width: 110px;
    }
  }
}
.more {
  padding: 0;
  margin-left: 30px;
  /deep/ & > span {
    display: block;
    width: 28px;
    height: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 50%;
    background: #ff813d;
    cursor: pointer;
    i {
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #fff;

      &:not(:last-child) {
        margin-bottom: 2px;
      }
    }
  }
}
.chart-content {
  padding-top: 20px;
  .chart-item {
    height: 36px;
    display: flex;
    align-items: center;

    .grade-num {
      width: 22px;
      font-size: 16px;
      text-align: center;
      margin-right: 15px;
      color: #8b8b8b;
      img {
        padding-top: 12px;
      }
    }
    .card-tooltipOver {
      font-size: 12px;
      // width: 120px;
      margin-right: 14px;
    }
    /deep/ {
      .el-progress {
        flex: 1;
        margin-right: 20px;
        cursor: pointer;
        &:hover {
          .el-progress-bar__inner {
            background-color: #1f87ff !important;
          }
        }
        .el-progress-bar__inner {
          transition: width 2.6s ease;
        }
        .el-progress-bar__outer {
          background-color: #ebeef5;
        }
      }
    }
    .chart-item-num {
      width: 64px;
      font-size: 14px;
      white-space: nowrap;
      color: #8b8b8b;
    }
  }
}
.no-data {
  padding: 40px 0;
}
.load-div {
  height: 287px;
}
.grand-total {
  line-height: 21px;
  padding: 18px 0 25px;
  background: transparent;
  span {
    display: inline-block;
  }
}
</style>