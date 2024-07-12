<template>
  <div class="chart-wrapper">
    <el-row :gutter="20">
      <template v-for="(card, index) in cardConfig">
        <el-col :span="24 / cardConfig.length" :key="index">
          <div class="gather-card">
            <TitleTop :title="card.title" />
            <template v-for="item in card.items">
              <div class="label" :key="`label_${item.prop}`">
                {{ item.label }}
              </div>
              <div
                class="value"
                :key="`value_${item.prop}`"
                @click="handleSkip(card.route, item.params)"
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
.chart-wrapper .el-row {
  background-color: transparent;
  padding: 0;
  .gather-card {
    font-size: 14px;
    // padding: 0 24px 20px;
    border-radius: 6px;

    .chart_top {
      margin-bottom: 14px;

      /deep/ {
        .title {
          min-width: auto;
        }
        & > div {
          white-space: nowrap;
        }
      }
    }
    .label {
      line-height: 20px;
      color: #8b8b8b;
    }
    .value {
      font-size: 24px;
      font-weight: bold;
      line-height: 33px;
      color: #5094ff;
      margin-bottom: 8px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>