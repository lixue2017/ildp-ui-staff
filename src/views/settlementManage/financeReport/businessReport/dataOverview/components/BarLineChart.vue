<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme

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
      default: "500px",
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
    setOptions({
      data = [],
      series = [],
      legendData,
      dataZoomConfig,
      rotate,
      maxNum,
    } = {}) {
      let dataEnd = "";
      let dataZoom = false;
      if (maxNum < data.length) {
        dataZoom = true;
        dataEnd = parseInt((maxNum / data.length) * 100);
      }
      console.log("maxNummaxNummaxNum:", maxNum, dataEnd);
      this.chart.setOption({
        legend: {
          right: 23,
          top: 20,
          data: legendData,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: 0,
          right: 23,
          bottom: 10,
          top: 62,
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
              ...(dataZoom ? { length: 13 } : {}),
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
              ...(rotate
                ? { rotate: 38, margin: 20 }
                : dataZoom
                ? { margin: 15 }
                : {}),
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
        series: this.handleSeries(series),
        ...(dataZoom
          ? {
              dataZoom: {
                show: true,
                type: "slider",
                showDetail: false,
                height: 10,
                fillerColor: "#BCBCBC",
                backgroundColor: "#EAEAEA",
                borderColor: "none",
                borderRadius: 4,
                start: -1,
                end: dataEnd,
                bottom: 71,
                ...(dataZoomConfig || {}),
              },
            }
          : {}),
      });
    },
    handleSeries(data = []) {
      return data.map((item) => {
        const i = {
          name: item.legend,
          type: item.type || "bar",
          barWidth: 14,
          itemStyle: {
            normal: {
              color: item.color,
            },
          },
          data: item.data,
        };
        if (item.type === "line") {
          i.symbol = "none";
          i.lineStyle = {
            width: 1,
            type: "dashed",
          };
        }
        return i;
      });
    },
  },
};
</script>
