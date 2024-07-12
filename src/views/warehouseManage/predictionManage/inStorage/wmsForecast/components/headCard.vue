<template>
  <div class="card">
    <template v-for="(item, index) in formConfig">
      <div
        :key="index"
        :style="{
          backgroundColor: item.backgroundColor,
        }"
        :class="`card-content card-content-${index}`"
      >
      <div v-if="item.title" class="space-txt">
        <span :style="{color: item.labelColor}">{{ item.title }}</span>
      </div>
      <div class="space-txt" v-if="item.value">
        <span  :style="{color: item.valueColor}">{{
            item.decimal
              ? formatMoney(formModel[item.value]||0, item.decimal)
              : formModel[item.value] || "--"
          }}</span>
      </div>
        <div class="space-txt" v-if="item.topLabel">
          <span :style="{color: item.labelColor}">{{ item.topLabel }}：</span>
          <span v-if="item.topDictVal" :style="{color: item.valueColor}">{{
            getDictObj(dictList[item.topValue], formModel[item.topValue])
          }}</span>
          <!-- <span v-else>{{ formModel[item.topValue] || "--" }}</span> -->
          <span v-else :style="{color: item.valueColor}">{{
            item.decimal
              ? formatMoney(formModel[item.topValue]||0, item.decimal)
              : formModel[item.topValue] || "--"
          }}</span>
        </div>

        <div class="space-txt" v-if="item.middleLabel">
          <span :style="{color: item.labelColor}">{{ item.middleLabel }}：</span>
          <span v-if="item.middleDictVal" :style="{color: item.valueColor}">{{
            getDictObj(dictList[item.middleValue], formModel[item.middleValue])
          }}</span>
          <span v-else :style="{color: item.valueColor}">{{ formModel[item.middleValue] || "--" }}</span>
        </div>

        <div class="space-txt" v-if="item.bottomLabel">
          <span :style="{color: item.labelColor}">{{ item.bottomLabel }}：</span>
          <span v-if="item.bottomDictVal" :style="{color: item.valueColor}">{{
            getDictObj(dictList[item.bottomValue], formModel[item.bottomValue])
          }}</span>
          <!-- <span v-else>{{ formModel[item.bottomValue] || "--" }}</span> -->
          <span v-else :style="{color: item.valueColor}">{{
            item.decimal
              ? formatMoney(formModel[item.bottomValue]||0, item.decimal)
              : formModel[item.bottomValue] || "--"
          }}</span>
        </div>
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
      invoiceMedium: (state) => state.dictionary.dicsData.invoiceMedium,
      dictList: (state) => state.dictionary.dicsData,
    }),
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  &-content {
    flex: 1;
    padding: 19px 12px;
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
  .space-txt {
    &:not(:first-child) {
      margin-top: 8px;
      }
    span {
      &:first-child {
        font-size: 14px;
      }
      &:not(:first-child) {
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
}
</style>
