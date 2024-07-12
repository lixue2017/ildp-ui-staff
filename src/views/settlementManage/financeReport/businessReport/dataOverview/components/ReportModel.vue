<template>
  <div class="report-model">
    <div class="report-chart">
      <div class="title">{{ itemType.label }}</div>
      <ComForm ref="formRef" :formConfig="formConfig" class="report-form">
        <template v-slot:dimension="slotProps">
          <el-select
            :multiple="true"
            :collapse-tags="false"
            v-model="slotProps.formModel[slotProps.fieldItem.id]"
            :placeholder="slotProps.fieldItem.placeholder"
            @change="handleChange($event, slotProps.fieldItem.id)"
            style="width: 100%"
            :clearable="true"
          >
            <template v-for="selectItem in getOption() || []">
              <el-option
                :key="selectItem.value"
                :label="selectItem.nameCn"
                :value="selectItem.value"
              />
            </template>
          </el-select>
        </template>
        <template v-slot:trend="slotProps">
          <el-select
            v-model="slotProps.formModel[slotProps.fieldItem.id]"
            :placeholder="slotProps.fieldItem.placeholder"
            @change="handleChange($event, slotProps.fieldItem.id)"
            style="width: 100%"
            :clearable="true"
          >
            <template
              v-for="selectItem in getTrendOption(
                slotProps.formModel.dimension
              )"
            >
              <el-option
                :key="selectItem.value"
                :label="selectItem.nameCn"
                :value="selectItem.value"
              />
            </template>
          </el-select>
        </template>
      </ComForm>
      <BarLineChart
        ref="barLineChartRef"
        :chartData="chartData"
        v-if="showChart"
      />
    </div>
    <ReportTable
      ref="reportTableRef"
      :type="itemType.value"
      :grossTotal="grossTotal"
      :dimensionList="getOption()"
      @handleSort="handleSort"
    />
  </div>
</template>

<script>
import { searchColumns } from "./model";
import {
  getReportOfDay,
  getReportOfMonth,
  getReportOfCustomer,
  getReportOfSalesMan,
  getReportOfMonthAndOrderType,
} from "@/api/settlementManage/dataOverview.js";
export default {
  props: {
    itemType: {
      type: Object,
      default: () => ({
        value: 0, // 0:月统计报表;1:日统计报表;2:业务员报表;3:委托人报表;4:月业务类型统计;
        label: "月统计报表",
        prop: "createDateList",
      }),
    },
    showList: {
      type: Array,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    getQueryParams: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    ReportTable: () => import("./ReportTable"),
    BarLineChart: () => import("./BarLineChart"),
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    return {
      httpRequest: {
        0: getReportOfMonth,
        1: getReportOfDay,
        2: getReportOfSalesMan,
        3: getReportOfCustomer,
        4: getReportOfMonthAndOrderType,
      },
      chartData: {
        data: [],
        legendData: [],
        series: [],
      },
      formConfig: {
        formModel: {}, // 表单数据
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      showChart: false,
      formData: {},
      grossTotal: {},
    };
  },
  mounted() {
    this.searchList(this.getQueryParams() || {});
  },
  methods: {
    handleSort(data) {
      const formData = {
        ...(this.getQueryParams() || {}),
        ...data,
      };
      this.searchList(formData, true);
    },
    searchList(formData, isSort) {
      this.showChart = false;
      const typeObj = {};
      const typeArr = this.getOption();
      typeArr.map((item) => {
        typeObj[item.value] = item;
      });
      this.httpRequest[this.itemType.value](formData).then((res) => {
        console.log(this.itemType.value);
        console.log(res);
        const { graphFormList, ...grossTotal } = res.data;
        this.formData = res.data;
        this.grossTotal = grossTotal;
        this.chartData = this.handleData();
        this.$refs.reportTableRef?.setTableData(graphFormList, isSort);
        this.$nextTick(() => {
          this.showChart = true;
        });
      });
    },
    handleData() {
      const typeObj = {};
      const typeArr = this.getOption();
      typeArr.map((item) => {
        typeObj[item.value] = item;
      });
      let { graphForm = {} } = this.formData;
      !graphForm && (graphForm = {});
      let { dimension, trend } = this.$refs.formRef.getFormParams();
      if (dimension && trend && !dimension.includes(trend)) {
        this.$refs.formRef.setFormModel({
          trend: "",
        });
        trend = "";
      }
      const legendData = [];
      const series = [];
      const graphData = graphForm[this.itemType.prop] || [];
      if (dimension && dimension.length) {
        dimension.forEach((key) => {
          const item = typeObj[key];
          legendData.push(item.nameCn);
          series.push({
            legend: item.nameCn,
            type: "bar",
            color: item.color,
            data: graphForm[item.prop],
          });
        });
      } else {
        Object.keys(typeObj).map((key) => {
          const item = typeObj[key];
          legendData.push(item.nameCn);
          series.push({
            legend: item.nameCn,
            type: "bar",
            color: item.color,
            data: graphForm[item.prop],
          });
        });
      }
      if (trend) {
        const item = typeArr.find((item) => item.value == trend);
        if (item && item.nameCn) {
          const name = `线性(${item.nameCn})`;
          legendData.push(name);
          series.push({
            legend: name,
            type: "line",
            color: item.color,
            data: graphForm[item.prop],
          });
        }
      }
      const num = (dimension && dimension.length) || typeArr.length;
      const obj = {
        1: 14,
        2: 12,
        3: 10,
        4: 8,
      };
      const maxNum = num >= 6 ? 6 : obj[num];
      return {
        data: graphData,
        legendData,
        series,
        ...(this.config || {}),
        maxNum,
      };
    },
    handleChange(val, prop) {
      switch (prop) {
        case "dimension":
        case "trend":
          this.showChart = false;
          this.chartData.legendData = this.handleData().legendData;
          this.chartData.series = this.handleData().series;
          this.chartData.maxNum = this.handleData().maxNum;
          this.$nextTick(() => {
            this.showChart = true;
          });
          break;

        default:
          break;
      }
    },
    getOption() {
      const { showList } = this;
      if (showList && showList.length) {
        return this.options.filter((item) => showList.includes(item.value));
      }
      return this.options;
    },
    getTrendOption(dimension) {
      if (dimension && dimension.length) {
        return this.getOption().filter((item) =>
          dimension.includes(item.value)
        );
      }
      return this.getOption();
    },
  },
};
</script>

<style lang="scss" scoped>
.report-model {
  height: 571px;
  display: flex;
  padding: 0 22px 20px 28px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0px 0px 4px 0px rgba(101, 101, 101, 0.1);
  margin: 0 10px 16px;

  .report-chart {
    width: calc(100% - 500px);
    flex: 1;
    position: relative;

    .report-form {
      width: 520px;
      position: absolute;
      top: 16px;
      right: 0;
      z-index: 1;
    }
    .title {
      line-height: 22px;
      font-size: 16px;
      font-weight: bold;
      padding: 20px 0 8px;
      border-bottom: 1px solid #e2e2e2;
    }
  }
  /deep/ {
    .tableData {
      width: 500px;
      margin-top: 50px;
      .el-table__fixed {
        height: 100% !important;
      }
    }
  }
}
</style>
