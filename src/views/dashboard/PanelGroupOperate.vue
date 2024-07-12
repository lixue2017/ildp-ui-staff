<template>
  <el-row :gutter="20" class="panel-group">
    <template v-for="(item, i) in operateHeadConfig">
      <el-col :key="i" :span="item.span" class="card-panel-col">
        <div :class="['card-panel', item.className]">
          <div class="card-panel-title">{{ item.title }}</div>
          <div class="card-panel-list">
            <template v-for="(l, i) in item.list">
              <div class="line" :key="l.totalProp" v-if="i != 0"></div>
              <div class="card-panel-item" :key="l.totalProp">
                <div class="card-panel-text">{{ l.title }}</div>
                <div class="card-panel-num">
                  <count-to
                    :start-val="0"
                    :end-val="
                      listData[l.orderType]
                        ? listData[l.orderType].lastWeekOrders
                        : 0
                    "
                    :duration="duration"
                  /><span class="num-util">票</span>
                </div>
                <div class="card-panel-week">
                  <span class="label">7天环比</span>
                  <span
                    v-if="
                      !listData[l.orderType] ||
                      listData[l.orderType].weekOnWeekPercentage >= 0
                    "
                    class="plus"
                  >
                    +{{
                      listData[l.orderType]
                        ? listData[l.orderType].weekOnWeekPercentage
                        : 0
                    }}%
                  </span>
                  <span v-else class="minus">
                    {{ listData[l.orderType].weekOnWeekPercentage }}%
                  </span>
                </div>
                <div>
                  <span class="label">今日新增</span>
                  <span class="value">{{
                    listData[l.orderType]
                      ? listData[l.orderType].todayOrders
                      : 0
                  }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </el-col>
    </template>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
import { operateHeadConfig } from "./components/model";

export default {
  props: {
    name: {
      type: String,
      default: "headOverview",
    },
    compData: {
      type: Array,
      default: null,
    },
  },
  components: {
    CountTo,
  },
  data() {
    const listData = {};
    (this.compData || []).forEach((item) => {
      listData[item.orderType] = item;
    });
    return {
      operateHeadConfig,
      duration: 100,
      listData,
    };
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 180px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    padding: 14px 24px 20px;
    box-shadow: 2px 2px 6px 0px rgba(168, 79, 63, 0.15);
    border-radius: 6px;

    &.gn-class {
      padding-right: 20px;
      background: linear-gradient(
        360deg,
        #fffbf9 0%,
        #ffe0cf 100%,
        #ffe0cf 100%
      );
      box-shadow: 2px 2px 6px 0px rgba(168, 79, 63, 0.15);
    }
    &.hw-class {
      background: linear-gradient(360deg, #fdfeff 0%, #d1e5ff 100%);
      box-shadow: 2px 2px 6px 0px rgba(45, 115, 195, 0.15);
    }
    .card-panel-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
      padding-bottom: 9px;
      border-bottom: 1px solid #fff;
    }
    .card-panel-list {
      display: flex;
      // align-items: center;
      .line {
        width: 1px;
        height: 70px;
        background: #ffffff;
        margin: auto 10px;
      }
    }
    .card-panel-text {
      font-size: 15px;
      color: #8b8b8b;
      line-height: 21px;
      padding: 9px 0 6px;
    }
    .card-panel-num {
      font-size: 22px;
      white-space: nowrap;
      font-weight: bold;
      line-height: 30px;
      margin-bottom: 4px;

      .num-util {
        font-size: 14px;
        font-weight: 400;
      }
    }
    .card-panel-item {
      flex: 1;
      & > div:not(.card-panel-week) {
        white-space: nowrap;
      }
    }
    .card-panel-week {
      margin-bottom: 2px;
    }
    .label {
      color: #a8a8a8;
    }
    .value {
      font-size: 16px;
      font-weight: 500;
      margin-left: 5px;
    }
    .plus {
      color: #53c88a;
    }
    .minus {
      color: #ff6767;
    }
  }
}
</style>
