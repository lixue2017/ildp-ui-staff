<template>
  <div class="card">
    <template v-for="(item, index) in formConfig">
      <div
        :key="index"
        :style="{
          backgroundColor: item.backgroundColor,
          color: item.fontColor,
        }"
        :class="`card-content card-content-${index}`"
      >
        <div>
          <span>{{ item.topLabel }}：</span>
          <span v-if="item.topDictVal">{{
            getDictObj(dictList[item.topValue], formModel[item.topValue])
          }}</span>
          <!-- <span v-else>{{ formModel[item.topValue] || "--" }}</span> -->
          <span v-else>{{
            item.topDecimal
              ? toFixedNum(formModel[item.topValue], item.topDecimal)
              : formModel[item.topValue] || "--"
          }}</span>
        </div>

        <div class="middle-txt" v-if="item.middleLabel">
          <span>{{ item.middleLabel }}：</span>
          <span v-if="item.middleDictVal">{{
            getDictObj(dictList[item.middleValue], formModel[item.middleValue])
          }}</span>
          <span v-else>{{ formModel[item.middleValue] || "--" }}</span>
        </div>

        <div class="bottom-txt">
          <span>{{ item.bottomLabel }}：</span>
          <span v-if="item.bottomDictVal">{{
            getDictObj(dictList[item.bottomValue], formModel[item.bottomValue])
          }}</span>
          <!-- <span v-else>{{ formModel[item.bottomValue] || "--" }}</span> -->
          <span v-else>{{
            item.bottomDecimal
              ? toFixedNum(formModel[item.bottomValue], item.bottomDecimal)
              : formModel[item.bottomValue] || "--"
          }}</span>
        </div>
        <template v-for="l in item.labelList">
          <div class="bottom-txt" :key="l.value">
            <TooltipOver
              className="txt-rg"
              :content="`${l.label}：${
                l.dictVal
                  ? getDictObj(dictList[l.value], formModel[l.value])
                  : item.decimal
                  ? toFixedNum(formModel[l.value], item.decimal)
                  : formModel[l.value] || '--'
              }`"
            />
            <!-- <span>{{ l.label }}：</span>
            <span v-if="l.dictVal">{{
              getDictObj(dictList[l.value], formModel[l.value])
            }}</span>
            <span v-else>{{
              item.decimal
                ? toFixedNum(formModel[l.value], item.decimal)
                : formModel[l.value] || "--"
            }}</span> -->
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
  components: {
    TooltipOver: () => import("_comp/TooltipOver"),
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
    width: 25%;
    padding: 30px 20px;
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
  .middle-txt {
    margin-top: 8px;
  }
  .bottom-txt {
    margin-top: 8px;
  }
}
</style>
