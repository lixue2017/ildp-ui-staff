<template>
  <div class="gauge-chart">
    <div
      ref="chartRef"
      :class="className"
      :style="{ height: height, width: width }"
    />
    <div class="num-range">
      <div>{{ min }}</div>
      <div>{{ max }}</div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
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
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 31,
    },
    value: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "天",
    },
    title: {
      type: String,
      default: "",
    },
    progressColor: {
      type: String,
      default: "#FF813D",
    },
  },
  data() {
    return {
      chart: null,
    };
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
      this.chart = echarts.init(this.$refs.chartRef, "macarons");
      const { min, max, value, unit, title, progressColor } = this;
      this.chart.setOption({
        series: [
          {
            type: "gauge",
            min,
            max,
            radius: "100%",
            center: ["50%", 74],
            axisLine: {
              show: false,
              lineStyle: {
                width: 15,
                color: [
                  [value / max, progressColor],
                  [1, "#EBEBEB"],
                ],
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: true,
              valueAnimation: true,
              fontSize: 18,
              fontWeight: "bold",
              color: "#515151",
              formatter: (value) => `${value}${unit}`,
              offsetCenter: [0, "70%"],
            },
            title: {
              color: "#8B8B8B",
              fontSize: 14,
              offsetCenter: [0, 87],
            },
            data: [
              {
                name: title,
                value,
              },
            ],
            pointer: {
              icon: "circle",
              show: true,
              length: "70%",
              width: 4,
            },
            itemStyle: {
              color: "#8B8B8B",
            },
            markPoint: {
              show: true,
              showAbove: true,
              symbol: "circle",
              symbolSize: 15,
              data: [
                {
                  x: "center",
                  y: 74,
                  itemStyle: { color: "#8B8B8B" },
                },
              ],
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.gauge-chart {
  position: relative;

  .num-range {
    position: absolute;
    bottom: 25px;
    font-size: 14px;
    display: flex;
    padding-left: 20px;
    color: #8b8b8b;

    & > div:nth-child(2) {
      margin-left: 90px;
    }
  }
}
</style>
