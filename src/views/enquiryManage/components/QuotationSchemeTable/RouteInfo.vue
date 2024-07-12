<template>
  <div class="route-info">
    <template v-for="(route, index) in RouteConfig">
      <div class="route-line" :key="index">
        <template v-for="item in route">
          <div class="route-item" :key="item.id">
            <span class="label">{{ item.label }}</span>
            <span class="value" v-if="item.type === 'txt'">
              {{
                item.render ? item.render(formData) : formData[item.id] || "--"
              }}
            </span>
            <template v-else>
              <span
                v-if="item.id === 'recommend'"
                :class="formData[item.id] && 'green-text-color'"
              >
                {{ formData[item.id] ? "是" : "否" }}
              </span>
            </template>
          </div>
        </template>
      </div>
    </template>
    <div class="route-line">
      <div class="value">备注：</div>
      <TooltipOver
        :content="formData.remark"
        :style="{ width: '500px', flex: 1 }"
        refName="tooltipOverTit"
      />
    </div>
  </div>
</template>

<script>
import {
  RouteConfig,
  RouteQuotationConfig,
  RouteCopySchemeConfig,
} from "./model.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isQuotation: {
      type: Boolean,
      default: false,
    },
    // 是否海外方案
    isOverseasToDoor: {
      type: Boolean,
      default: false,
    },
    sharePage: {
      type: Boolean,
      default: false,
    },
    proxyType: {
      type: [Number, String],
      default: 0,
    },
    isCopyPage: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      RouteConfig: this.isCopyPage
        ? RouteCopySchemeConfig(this.isOverseasToDoor, this.proxyType)
        : this.isQuotation
        ? RouteQuotationConfig(this.isOverseasToDoor, this.sharePage)
        : RouteConfig(this.isOverseasToDoor, this.proxyType),
    };
  },
};
</script>
<style lang="scss" scoped>
.route-info {
  padding: 5.5px 0;
  flex: 1;
}
.route-line {
  display: flex;
  align-items: center;
  padding: 4.5px 0;

  .route-item {
    white-space: nowrap;
    line-height: 16px;
    &:not(:last-child) {
      padding-right: 4px;
      border-right: 1px solid #e2e2e2;
    }
    .label {
      padding-left: 4px;
      color: #8b8b8b;
    }
    .value {
    }
  }
}
</style>
