<template>
  <div class="header-card flex-space-between">
    <template v-for="(item, index) in formConfig">
      <div
        :key="index"
        :style="{
          backgroundColor: item.backgroundColor,
          color: item.labelColor,
        }"
        :class="`card-content card-content-${index}`"
      >
        <div v-if="item.titleLabel">
          <span
            :style="{
              color: item.titleColor,
            }"
            >{{ item.titleLabel }}</span
          >
        </div>

        <template v-if="item.contentList">
          <div
            v-for="(cItem, idx) in item.contentList || []"
            :key="`c_${idx}`"
            class="spacing-box"
          >
            <span
              v-if="cItem.label"
              :style="{
                color: cItem.labelColor,
                ...(cItem.labelStyleSheet || {}),
              }"
              >{{ cItem.label }}：</span
            >
            <span
              class="value-txt"
              :style="{
                color: cItem.valueColor || item.valueColor,
                ...(cItem.valStyleSheet || {}),
              }"
            >
              <template v-if="cItem.renderFn">
                {{ cItem.renderFn(formModel) }}
              </template>
              <template v-else-if="cItem.dictName">
                {{
                  getDictObj(
                    dictList[cItem.dictName],
                    formModel[cItem.valueKey]
                  )
                }}
              </template>
              <template v-else-if="cItem.thousandthMark">
                <!-- 金额千分符 -->
                {{ formatMoney(formModel[cItem.valueKey], cItem.decimal) }}
              </template>
              <template v-else>
                {{
                  cItem.decimal || cItem.decimal === 0
                    ? toFixedNum(formModel[cItem.valueKey], cItem.decimal)
                    : formModel[cItem.valueKey] || "--"
                }}
              </template>
            </span>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
    pageType: {
      type: String,
      default: "",
    },
    formConfig: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      dictList: (state) => state.dictionary.dicsData,
    }),
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-card {
  margin-bottom: 15px;
  .card-content {
    flex: 1;
    padding: 26px 20px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &.card-content-1 {
      margin-left: 10px;
      margin-right: 10px;
    }
    &.card-content-2 {
      margin-right: 10px;
      margin-left: 10px;
    }
  }
  .spacing-box {
    margin-top: 8px;
  }
  .value-txt {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
