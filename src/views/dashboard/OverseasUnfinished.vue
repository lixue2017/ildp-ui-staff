<template>
  <div class="chart-wrapper">
    <TitleTop title="海外操作未完结" />
    <div class="unfinished-operate">
      <template v-for="(l, index) in listConfig">
        <div class="flex operate-list" :key="index">
          <div class="title">{{ l.title }}</div>
          <template v-for="item in l.list">
            <div class="flex operate-item" :key="item.prop">
              <div
                class="item-icon"
                :style="{ background: item.color }"
                :class="item.icon"
              ></div>
              <div>
                <div
                  class="item-num"
                  :style="{ color: item.color }"
                  @click="handleSkip(item.route, item.params)"
                >
                  {{ compData[item.prop] }}
                </div>
                <div class="item-label">{{ item.label }}</div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { overseasUnfinishedConfig } from "./components/model";
export default {
  props: {
    compData: {
      type: Object,
      default: {
        dsfnum: 43,
        wmsnum: 20,
        yjdfnum: 24,
        zxnum: 34,
        yjdfnum: 44,
        zxnum: 12,
      },
    },
  },
  components: {
    TitleTop: () => import("@/views/dashboard/components/TitleTop"),
  },
  data() {
    return {
      listConfig: overseasUnfinishedConfig,
    };
  },
  methods: {
    handleSkip(route, params) {
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
.unfinished-operate {
  padding: 22px 0;

  .title {
    width: 108px;
    color: #696969;
    font-size: 16px;
    font-weight: 500;
  }
  .operate-list:not(:last-child) {
    margin-bottom: 34px;
  }
  .operate-item {
    width: 160px;
    .item-icon {
      width: 38px;
      height: 38px;
      line-height: 38px;
      font-size: 26px;
      text-align: center;
      border-radius: 50%;
      margin-right: 10px;
      color: #fff;
      background: #7eb9fd;
    }
    .item-num {
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      cursor: pointer;
      text-decoration: underline;
    }
    .item-label {
      font-size: 13px;
      color: #8b8b8b;
    }
  }
}
</style>
