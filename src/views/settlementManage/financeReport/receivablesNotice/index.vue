<template>
  <div class="business-month">
    <div class="content">
      <div class="tabs">
        <span class="title">应收账款通知单</span>
      </div>
      <ComForm
        class="search-info"
        ref="searchInfoForm"
        :formConfig="searchConfig"
        v-if="Object.keys(dictionary.dicsData).length"
      />
      <template v-for="(item, index) in table">
        <div :key="index">
          <ComTable
            :ref="`tableConfig${index}`"
            :columnConfig="item.columns"
            :httpRequest="(params) => handleRequest(index, params)"
            :getQueryParams="getQueryParams"
            :pagination="false"
            @getResult="getResult(index)"
            :extraConfig="{
              showHeader: index === 0 ? true : false,
            }"
          >
          </ComTable>
          <div class="grand-total">
            <span>小计：</span>
            <template v-for="gross in item.grossTotal">
              <span :key="gross.prop">
                <span class="label">{{ gross.label }}</span>
                <span class="value">{{ gross.total || "--" }}</span>
              </span>
            </template>
          </div>
        </div>
      </template>
      <div class="grand-total summation">
        <span>合计：</span>
        <template v-for="gross in Totals">
          <span :key="gross.prop">
            <span class="label">{{ gross.label }}</span>
            <span class="value">{{ gross.total || "--" }}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { searchConfig, businessMonthTable } from "./model";
import {
  getSeaTraditionFreightList,
  getSeaTraditionFreightTakeList,
} from "@/api/trandition/oceanModel";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    const formConfig = {
      formModel: {},
      httpRequest: () => {}, // 表单提交接口
      successFunction: () => {}, // 表单提交成功回调
      size: "small",
      labelWidth: "85px",
      formRules: {}, // 表单校验规则
      visibleAll: true,
    };
    return {
      searchConfig: {
        ...formConfig,
        lists: searchConfig.lists,
      },
      table: [businessMonthTable, businessMonthTable],
      grossTotal: {
        0: {},
        1: {},
      },
      Totals: businessMonthTable.grossTotal,
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {
      return {};
    },
    handleRequest(index, params) {
      // console.log(index);
      // console.log(params);
      const reqs = {
        0: getSeaTraditionFreightList,
        1: getSeaTraditionFreightTakeList,
      };
      return new Promise((resolve, reject) => {
        reqs[index](params).then((res) => {
          if (res.data && !res.rows) {
            res.rows = res.data;
          }
          this.grossTotal[index] = res;
          return resolve(res);
        });
      });
    },
    getResult(index) {
      if (this.grossTotal[index].code === 200) {
        this.table[index].grossTotal.map((item, itemIndex) => {
          let total = 0;
          this.grossTotal[index].rows.map((result) => {
            total += result[item.prop];
          });
          if (item.decimal) {
            this.$set(item, "total", total.toFixed(item.decimal));
          } else {
            this.$set(item, "total", total);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.business-month {
  background: #f9f9f9;
  padding: 11px 0 20px;
  .content {
    width: 1174px;
    padding: 15px 20px 30px;
    min-height: calc(100vh - 108px);
    margin: auto;
    background: #fff;
    .tabs {
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid #e2e2e2;
      .title {
        color: #515151;
        font-weight: bold;
        margin-right: 30px;
        padding-bottom: 3px;
        border-bottom: 2px solid #515151;
      }
    }
    .search-info {
      margin-top: 15px;
    }
  }
  /deep/.el-radio-group {
    .el-radio {
      margin-right: 10px;
    }
    .el-radio__label {
      padding-left: 0;
    }
  }
  .summation {
    background: rgba(80, 148, 255, 0.2);
  }
}
</style>
