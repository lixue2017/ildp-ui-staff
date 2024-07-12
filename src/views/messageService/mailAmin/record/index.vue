<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="tabsConfig.activeName === tab.name"
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
              @handleTableView="(r) => handleView(r)"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { searchConfig, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getRecordList } from "@/api/messageService";
export default {
  name: "Record",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "邮件记录",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        searchForm: true,
        // expansion: false,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getMailRecord(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "80px",
        ...searchConfig,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getRecordList,
        columnConfig: tableColumns,
      },
    };
  },
  methods: {
    getMailRecord(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [createTimeGe, createTimeLe] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    handleView({ id }) {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.$router.push({
        path: "/messageService/mailAmin/recordDetail",
        query: {
          id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
  },
};
</script>
