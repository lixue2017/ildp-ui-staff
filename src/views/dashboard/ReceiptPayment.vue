<template>
  <div class="chart-wrapper">
    <TitleTop title="日实收实付">
      <template v-slot:right>
        <slot name="formSlot" />
      </template>
    </TitleTop>
    <div class="line-chart">
      <LineChart
        :chartData="chartData"
        :lineConfig="lineConfig"
        height="310px"
      />
    </div>
  </div>
</template>
<script>
import CountTo from "vue-count-to";
import { formatDate } from "@/utils/index";
import lineFk from "@/assets/image/home/lineFk.svg";
import lineSk from "@/assets/image/home/lineSk.svg";
export default {
  props: {
    compData: {
      type: Object,
      default: null,
    },
  },
  components: {
    TitleTop: () => import("./components/TitleTop"),
    LineChart: () => import("@/views/dashboard/LineChart"),
    ComForm: () => import("_comp/ComForm"),
    CountTo,
  },
  data() {
    return {
      duration: 2000,
      goodsTypeObj: {},
      chartData: {
        expectedData: null,
        actualData: null,
      },
      lineConfig: {
        legendData: [
          { name: "实收", icon: `image://${lineSk}` },
          { name: "实付", icon: `image://${lineFk}` },
        ],
        xAxis: {
          boundaryGap: false,
          axisTick: {
            show: true,
            inside: false,
            interval: 1,
          },
        },
        tooltip: {
          formatter: (params) => {
            const html = params.map(
              (item) => `<div class="line-tooltip">
                  <span class="tooltip-label">${item.seriesName}：</span><span class="tooltip-value">${item.value}</span>
                </div>`
            );
            return html.join("");
          },
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: "#FF813D",
                lineStyle: {
                  color: "#FF813D",
                  width: 2,
                },
                areaStyle: {
                  color: "#FFCAAE",
                  opacity: "0.6",
                },
              },
            },
            symbolSize: 0,
          },
          {
            itemStyle: {
              normal: {
                color: "#5094FF",
                lineStyle: {
                  color: "#5094FF",
                  width: 2,
                },
                areaStyle: {
                  color: "#A3C7FF",
                  opacity: "0.6",
                },
              },
            },
            symbolSize: 0,
          },
        ],
      },
    };
  },
  watch: {
    compData(newVal, oldVal) {
      this.getTrendCardInfo(newVal);
    },
  },
  mounted() {
    if (this.compData) {
      this.getTrendCardInfo(this.compData);
    }
  },
  methods: {
    getTrendCardInfo(data) {
      const {
        skTotal,
        fkTotal,
        skDataList = [],
        fkDataList = [],
        xaxisList = [],
      } = data;
      if (!skDataList.length && !fkDataList.length) {
        xaxisList.forEach(() => {
          skDataList.push(0);
          fkDataList.push(0);
        });
      }
      const dateList = xaxisList.map((oDate) => {
        let day = oDate;
        if (oDate.includes("年")) {
          day = oDate.replace("年", "/").replace("月", "/").replace("日", "");
        }
        return formatDate(day, "/", "monthDate");
      });
      this.chartData = {
        data: dateList,
        values: [skDataList, fkDataList],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  /deep/ {
    .chart_top .title {
      min-width: 90px;
    }
  }
}
.line-chart {
  position: relative;
  padding-bottom: 23px;
}
</style>