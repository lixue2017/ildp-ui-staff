<template>
  <el-row :gutter="20" class="panel-group">
    <template v-for="(item, i) in headConfig">
      <el-col :key="i" :span="item.span" class="card-panel-col">
        <div :class="['card-panel', item.className]">
          <template v-for="l in item.list">
            <div :key="l.totalProp">
              <div class="card-panel-text">{{ l.title }}</div>
              <div class="card-panel-num">
                <count-to
                  :start-val="0"
                  :end-val="compData[l.totalProp]"
                  :duration="duration"
                />
              </div>
              <div class="card-panel-flex">
                <div>
                  <span class="label">周环比</span>
                  <span v-if="compData[l.weekGrowthProp] >= 0" class="plus">
                    +{{ compData[l.weekGrowthProp] }}%
                  </span>
                  <span v-else class="minus">
                    {{ compData[l.weekGrowthProp] }}%
                  </span>
                </div>
                <div class="line"></div>
                <div>
                  <span class="label">月环比</span>
                  <span v-if="compData[l.monthGrowthProp] >= 0" class="plus">
                    +{{ compData[l.monthGrowthProp] }}%
                  </span>
                  <span v-else class="minus">
                    {{ compData[l.monthGrowthProp] }}%
                  </span>
                </div>
              </div>
              <div>
                <span class="label">{{ l.numOf30Title }}</span>
                <span class="value">{{ compData[l.numOf30Prop] }}</span>
              </div>
            </div>
          </template>
        </div>
      </el-col>
    </template>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
import { headConfig } from "./components/model";

export default {
  props: {
    name: {
      type: String,
      default: "headOverview",
    },
    compData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CountTo,
  },
  data() {
    return {
      headConfig,
      duration: 1000,
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
    height: 172px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    padding: 21px 40px;
    box-shadow: 2px 2px 6px 0px rgba(168, 79, 63, 0.15);
    border-radius: 6px;

    &.customer-class {
      background: linear-gradient(360deg, #fff8f2 0%, #ffbe9b 100%);
      box-shadow: 2px 2px 6px 0px rgba(168, 79, 63, 0.15);
    }
    &.card-panel-order {
      display: flex;
      padding-right: 0;
      background: linear-gradient(360deg, #f2faff 0%, #b3d4ff 100%);
      box-shadow: 2px 2px 6px 0px rgba(45, 115, 195, 0.15);
      & > div:not(.el-radio-group) {
        width: 229px;
      }
      /deep/ .el-radio-group {
        width: 87px;
        margin-top: -5px;
        .el-radio {
          margin-bottom: 10px;
        }
        .el-radio__label {
          padding-left: 3px;
        }
      }
    }
    &.hw-class {
      background: linear-gradient(360deg, #fcf1ff 0%, #dbb7ff 100%);
      box-shadow: 2px 2px 6px 0px rgba(112, 51, 161, 0.15);
    }
    .card-panel-text {
      font-size: 20px;
      color: rgba(81, 81, 81, 0.5);
      line-height: 28px;
      margin-bottom: 5px;
    }
    .card-panel-num {
      font-size: 35px;
      font-weight: bold;
      line-height: 41px;
      margin-bottom: 10px;
    }
    .card-panel-flex {
      display: flex;
      align-items: center;
      margin-bottom: 6px;

      .line {
        width: 1px;
        height: 10px;
        background: #a8a8a8;
        margin: 0 12px;
      }
    }
    .label {
      color: #a8a8a8;
    }
    .value {
      font-size: 16px;
      font-weight: bold;
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
