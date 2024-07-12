<template>
  <div
    :class="className"
    :style="{ height: height, width: width }"
    v-if="show"
  />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

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
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    lineConfig: {
      type: Object,
      required: () => ({}),
    },
  },
  data() {
    return {
      chart: null,
      show: true,
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
      this.setOptions(this.chartData);
    },
    setOptions({ data = [], values = [], unit } = {}) {
      console.log(this.lineConfig);
      const {
        legendData = [],
        series: seriesConfig = [],
        xAxis = {},
        tooltip = {},
      } = this.lineConfig || {};
      const series = [];
      legendData.forEach((legend, i) => {
        series.push({
          name: legend.name || legend,
          itemStyle: {
            normal: {
              color: "#7EB9FD",
              lineStyle: {
                color: "#7EB9FD",
                width: 2,
              },
            },
          },
          smooth: false,
          type: "line",
          symbol: "circle",
          symbolSize: 9,
          data: values[i],
          animationDuration: 1500,
          animationEasing: "cubicInOut",
          ...(seriesConfig[i] || {}),
        });
      });
      this.chart.setOption({
        xAxis: {
          data,
          boundaryGap: true,
          axisTick: {
            show: true,
            inside: true,
            interval: 1,
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
          ...xAxis,
        },
        grid: {
          left: 0,
          right: 20,
          bottom: 50,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          padding: [7, 15],
          className: "echarts-line-tooltip",
          formatter: (params) => {
            const html = params.map(
              (item) => `<div class="line-tooltip">
                  <span class="tooltip-label">${item.seriesName}订单：</span><span class="tooltip-value">${item.value}(${unit})</span>
                </div>`
            );
            return html.join("");
          },
          backgroundColor: "rgba(0,0,0,0.4)",
          ...tooltip,
        },
        yAxis: {
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
        legend: {
          data: legendData,
          left: 0,
          bottom: 0,
          padding: [36, 0, 0, 0],
          // icon: "circle",
          textStyle: {
            color: "#8B8B8B",
          },
        },
        series,
      });
    },
  },
};
</script>

<style lang="scss">
.line-tooltip {
  display: flex;
  align-items: center;
  line-height: 22px;

  &:not(:first-child) {
    margin-top: 4px;
  }
  .tooltip-label {
    opacity: 0.8;
    font-size: 13px;
  }
  .tooltip-value {
    font-size: 16px;
  }
}
</style>
