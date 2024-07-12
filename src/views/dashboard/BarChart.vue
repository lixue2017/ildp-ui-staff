<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

const animationDuration = 6000;

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
          this.$nextTick(() => {
            this.initChart();
          });
        });
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      console.log("this.chartData:", this.chartData);
      this.setOptions(this.chartData);
    },
    setOptions({ data = [], values = [] } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: 0,
          right: 10,
          bottom: 10,
          top: 30,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data,
            boundaryGap: true,
            axisTick: {
              show: true,
              inside: false,
              interval: 0,
            },
            minorTick: {
              show: true,
            },
            axisLine: {
              lineStyle: {
                color: "#bcbcbc",
              },
            },
            axisLabel: {
              color: "#8b8b8b",
            },
            splitLine: {
              show: false,
            },
            scale: true,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#bcbcbc",
              },
            },
            axisLabel: {
              color: "#8b8b8b",
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#E7E7E7",
                type: "dashed",
              },
            },
            splitArea: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: 34,
            itemStyle: {
              normal: {
                color: "#619eff",
              },
            },
            data: values,
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>
