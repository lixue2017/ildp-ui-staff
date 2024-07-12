<template>
  <div class="chart-wrapper">
    <TitleTop title="近半年未收款账单(RMB)">
      <template v-slot:right>
        <slot name="formSlot" />
      </template>
    </TitleTop>
    <div class="line-chart">
      <BarChart :chartData="chartData" height="310px" />
    </div>
  </div>
</template>
<script>
import CountTo from "vue-count-to";
export default {
  props: {
    compData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    TitleTop: () => import("./components/TitleTop"),
    BarChart: () => import("@/views/dashboard/BarChart"),
    ComForm: () => import("_comp/ComForm"),
    CountTo,
  },
  data() {
    return {
      chartData: {},
    };
  },
  watch: {
    compData(newVal, oldVal) {
      this.getChartData(newVal);
    },
  },
  mounted() {
    if (this.compData) {
      this.getChartData(this.compData);
    }
  },
  methods: {
    getChartData(data) {
      const { total, xaxisList = [], yaxisList = [] } = data;
      this.chartData = {
        data: xaxisList,
        values: yaxisList,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.line-chart {
  position: relative;
  padding-bottom: 23px;
}
</style>