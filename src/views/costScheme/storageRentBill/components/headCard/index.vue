<template>
  <!-- 仓库月账单头部标签 -->
  <div class="card">
    <template v-for="(item, index) in formConfig">
      <div
        :key="index"
        :style="{
          backgroundColor: item.backgroundColor,
          color: item.fontColor,
        }"
        :class="`card-content card-content-${index} `"
      >
        <div class="wrap">
          <span class="wrap-label">{{ item.topLabel }}：</span>
          <span v-if="item.topDictVal" class="warp-value">{{
            getDictObj(dictList[item.topValue], formModel[item.topValue]) ||
            0
          }}</span>
          <!-- title太慢了 -->
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="typeConversion(formModel[item.topValue],'string') || '0'"
            placement="top-start"
          >
            <span class="warp-value">{{
             formatMoney(formModel[item.topValue] || 0)
            }}</span>
          </el-tooltip>
        </div>
        <div class="bottom-txt wrap" v-if="item.bottomLabel">
          <span class="wrap-label">{{ item.bottomLabel }}：</span>
          <span v-if="item.bottomDictVal" class="warp-value">{{
            getDictObj(
              dictList[item.bottomValue],
              formModel[item.bottomValue]
            ) || 0
          }}</span>
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="typeConversion(formModel[item.bottomValue],'string') || '0'"
            placement="top-start"
          >
            <span class="warp-value">{{
              formatMoney(formModel[item.bottomValue] || 0)
            }}</span>
          </el-tooltip>
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
  created() {
    console.log('formModel',this.formModel)
  },
  mounted() {},
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  .card-content {
    flex: 1;
    padding: 0px 20px;
    border-radius: 4px;
    max-width: 25%;
    height: 80px;
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
  .bottom-txt {
    margin-top: 8px;
  }
  .wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .warp-label {
      font-size: 14px;
    }
    .warp-value {
      font-size: 18px;
    }
  }
}
</style>
