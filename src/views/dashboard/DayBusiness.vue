<template>
  <div class="chart-wrapper">
    <TitleTop :title="title" />
    <el-row :gutter="30" type="flex" justify="space-between">
      <template v-for="(card, index) in cardConfig">
        <el-col class="gather-item" :span="24 / cardConfig.length" :key="index">
          <div class="gather-card">
            <div class="card-title">
              <div>{{ card.title }}</div>
              <div
                class="right"
                v-if="showTitleValue"
                @click="handleSkip(card.route, card.params)"
              >
                {{ compData[card.prop] }}<i class="el-icon-arrow-right"></i>
              </div>
            </div>
            <template v-for="item in card.items">
              <div class="label" :key="`label_${item.prop}`">
                {{ item.label }}
              </div>
              <div
                :class="['value', compData[item.prop] && 'skip']"
                :key="`value_${item.prop}`"
                @click="
                  compData[item.prop] && handleSkip(card.route, item.params)
                "
              >
                {{ compData[item.prop] || 0 }}
              </div>
            </template>
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "日常业务(我的)",
    },
    showTitleValue: {
      type: Boolean,
      default: false,
    },
    cardConfig: {
      type: Array,
      default: () => [],
    },
    compData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    TitleTop: () => import("@/views/dashboard/components/TitleTop"),
  },
  data() {
    return {};
  },
  methods: {
    handleSkip(route, params = {}) {
      if (!route) return;
      try {
        this.$router.push({
          name: route,
          params,
        });
      } catch {
        this.$message.error("跳转地址错误或无权限，请联系管理员！");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  .gather-item {
    margin: 18px 0 30px;

    &:not(:last-child) {
      border-right: 1px solid #e2e2e2;
    }
  }
  .gather-card {
    font-size: 14px;

    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 20px;

      .right {
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #5094ff;
        }
      }
      & > div {
        white-space: nowrap;
      }
    }
    .label {
      line-height: 20px;
      color: #8b8b8b;
      margin-top: 8px;
    }
    .value {
      font-size: 24px;
      line-height: 33px;
      font-weight: bold;

      &.skip {
        color: #5094ff;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>