<template>
  <div class="chart-wrapper">
    <TitleTop :title="title">
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
      <div class="grand-total line-total">
        <template v-for="(item, index) in orderTypeTotal">
          <span :key="index">
            <span class="label">{{ item.label }}</span
            ><span class="value"
              ><count-to
                :start-val="0"
                :end-val="totalData[item.prop]"
                :duration="duration"
              />({{ gross.unit }})</span
            >
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import CountTo from "vue-count-to";
import { orderTypeTotal } from "./components/model";
import lineTrans from "@/assets/image/home/lineTrans.svg";
import lineEc from "@/assets/image/home/lineEc.svg";
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "cargoVolumeTrend",
    },
    compData: {
      type: Object,
      default: null,
    },
    gross: {
      type: Object,
      default: () => ({}),
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
      orderTypeTotal,
      orderType: 2,
      duration: 2000,
      chartData: {
        expectedData: null,
        actualData: null,
        unit: "CBM",
      },
      totalData: {},
      lineConfig: {
        legendData: [
          { name: "电商", icon: `image://${lineEc}` },
          { name: "传统", icon: `image://${lineTrans}` },
        ],
        series: [
          {
            itemStyle: {
              normal: {
                color: "#7EB9FD",
                lineStyle: {
                  color: "#7EB9FD",
                  width: 2,
                },
              },
            },
          },
          {
            itemStyle: {
              normal: {
                color: "#FF813D",
                lineStyle: {
                  color: "#FF813D",
                  width: 2,
                },
              },
            },
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
      const { dsTotal, ctTotal, xaxisList, dsDataList, ctDataList } = data;
      this.totalData = {
        ecSubTotal: Number(dsTotal || 0),
        traditionSubTotal: Number(ctTotal || 0),
      };
      this.chartData = {
        data: xaxisList,
        values: [dsDataList, ctDataList],
        unit: this.gross.unit,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  /deep/ {
    .chart_top .title {
      min-width: 100px;
    }
  }
}
.grand-total {
  line-height: 21px;
  padding: 0;
  background: transparent;
  &.line-total {
    position: absolute;
    right: 0;
    bottom: 20px;
  }
  span {
    display: inline-block;
    // vertical-align: middle;
  }
}
.line-chart {
  position: relative;
  padding-bottom: 23px;
}
</style>