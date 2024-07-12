<template>
  <div class="chart-wrapper" v-if="compData">
    <TitleTop title="操作待办结算" />
    <div class="pending-settlement">
      <template v-for="l in compData || []">
        <div class="settlement-list" :key="l.settlementType">
          <div class="title">{{ listConfig[l.settlementType].title }}</div>
          <div class="settlement-list-item">
            <template v-for="(item, i) in listConfig[l.settlementType].list">
              <div
                :class="['settlement-item', item.className]"
                :key="item.prop"
                @click="handleSkip(item)"
              >
                <div class="settlement-item-left" v-if="i !== 0"></div>
                <div class="settlement-item-label">
                  <i class="item-line"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="settlement-item-value">{{ l[item.prop] || 0 }}</div>
                <div class="settlement-item-right"></div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { operatePendingConfig } from "./components/model";
export default {
  props: {
    compData: {
      type: Array,
      default: null,
    },
  },
  components: {
    TitleTop: () => import("@/views/dashboard/components/TitleTop"),
  },
  data() {
    return {
      listConfig: operatePendingConfig,
    };
  },
  methods: {
    handleSkip({ route, params }) {
      if (!route) return;
      try {
        this.$router.push({
          path: route,
          query: params
            ? {
                params: JSON.stringify(params),
              }
            : {},
        });
      } catch {
        this.$message.error("跳转地址错误或无权限，请联系管理员！");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.pending-settlement {
  padding-top: 20px;
  padding-bottom: 15px;
  .settlement-list {
    display: flex;
    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }
  .title {
    min-width: 82px;
    line-height: 57px;
    color: #696969;
    font-size: 15px;
    font-weight: 500;
  }
  .settlement-list-item {
    display: flex;
    flex-wrap: wrap;
  }
  .settlement-item {
    position: relative;
    padding: 6px 8px 4px 27px;
    white-space: nowrap;
    margin-right: 8px;
    margin-bottom: 5px;
    background: #fff4f4;
    border: 1px solid #d1d1d1;

    &:first-child {
      padding-left: 12px;
    }
    &.settlement-item-red {
      cursor: pointer;
      background: #fff4f4;
      &:hover {
        background: rgb(255, 222, 222);
        .settlement-item-right {
          background: rgb(255, 222, 222);
        }
      }

      .item-line {
        background: #ff6767;
      }
      .settlement-item-right {
        background: #fff4f4;
      }
    }
    &.settlement-item-blue {
      cursor: pointer;
      background: #f2f7ff;
      &:hover {
        background: rgb(222, 235, 255);
        .settlement-item-right {
          background: rgb(222, 235, 255);
        }
      }

      .item-line {
        background: #66a5ff;
      }
      .settlement-item-right {
        background: #f2f7ff;
      }
    }
    &.settlement-item-info {
      background: #f0f0f0;

      .item-line {
        background: #8b8b8b;
      }
      .settlement-item-right {
        background: #f0f0f0;
      }
    }
    .settlement-item-label {
      font-size: 12px;
      position: relative;
      z-index: 3;
      line-height: 20px;
      color: #8b8b8b;

      .item-line {
        display: inline-block;
        width: 3px;
        height: 10px;
        margin-right: 3px;
        border-radius: 2px;
      }
    }
    .settlement-item-value {
      position: relative;
      z-index: 3;
      font-size: 17px;
      font-weight: bold;
      line-height: 25px;
      margin-left: 6px;
    }
    .settlement-item-left {
      position: absolute;
      left: -21px;
      top: 7px;
      z-index: 1;
      width: 40px;
      height: 40px;
      border-right: 1px solid #d1d1d1;
      border-top: 1px solid #d1d1d1;
      background: #fff;
      transform: rotateZ(45deg);
    }
    .settlement-item-right {
      position: absolute;
      right: -21px;
      top: 7px;
      z-index: 2;
      width: 40px;
      height: 40px;
      border-right: 1px solid #d1d1d1;
      border-top: 1px solid #d1d1d1;
      transform: rotateZ(45deg);
    }
  }
}
</style>
