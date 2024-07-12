<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => tableConfig.getQueryParams()"
            >
              <!-- <template v-slot:customRow="{ slotProps }"> </template> -->
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { getLogRecord } from "@/api/monitor/operlog";
import { searchConfig, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mapActions } from "vuex";
export default {
  name: "OperateLog",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        },
        tabs: [
          {
            label: "操作日志",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        searchForm: true,
        expansion: false,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getLogRecord(formModel);
            resolve();
          });
        }, // 表单提交接口
        size: "small",
        labelWidth: "95px",
        formRules: {}, // 表单校验规则
        ...searchConfig,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getLogRecord,
        columnConfig: tableColumns,
      },
      showSearchForm: false,
    };
  },
  created() {
    this["dictionary/getDictionary"](["operationObj"]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getLogRecord(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        queryCreateTime:
          searchFrom.queryCreateTime && searchFrom.queryCreateTime.join("@"),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const param = {};
      for (let key in this.searchFromData) {
        this.searchFromData[key] && (param[key] = this.searchFromData[key]);
      }
      return param;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
