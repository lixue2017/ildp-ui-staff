<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchFormRef"
              v-if="tabsConfig.activeName === tab.name"
              :formConfig="searchFormConfig"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.tableColumns"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="
                (row) => (row.taskId ? operationList : [])
              "
              @handleTableView="handleView"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <MapView ref="mapViewRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model.js";
import {
  getVisitAndSignInRecord,
  exportVisitAndSignInRecord,
} from "@/api/clueManage/taskRecord.js";

export default {
  name: "VisitRecords",
  mixins: [mixinColsConf],
  components: {
    MapView: () => import("@/views/clueManage/components/MapView"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "全部记录",
            name: "1",
          },
          {
            label: "我的记录",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
              this.btnType = "export";
              this.$refs.searchFormRef[0]?.submitForm();
            },
          },
        ],
      },
      searchFormConfig: {
        searchForm: true,
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "75px",
        lists: [
          {
            className: "search-form-width",
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
      tableConfig: {
        tableHeight: "calc(100vh - 265px)",
        httpRequest: getVisitAndSignInRecord,
        tableColumns,
      },
      searchFromData: {},
      mixinTableColArr: [tableColumns, tableColumns],
      operationList: [
        {
          text: "查看",
          handleClick: this.handleInfo,
        },
      ],
    };
  },
  methods: {
    getTableList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = searchFrom;
      if (this.btnType === "export") {
        this.btnType = null;
        comFileDownload(
          this,
          exportVisitAndSignInRecord,
          this.getQueryParams(this.tabsConfig.activeName)
        );
      } else {
        this.mixinkeepTable(true);
      }
    },
    getQueryParams(tabName) {
      const { createTime, ...searchObj } = this.searchFromData[tabName] || {};
      const [startTime, endTime] = createTime || [];
      return {
        ...searchObj,
        startTime,
        endTime,
        queryType: 1,
        isMine: tabName == 1 ? 0 : 1,
      };
    },
    handleInfo(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData
        .filter((item) => item.taskId)
        .map((item) => item.taskId);
      this.$router.push({
        path: "/clueManage/taskRecordDetail",
        query: {
          id: row.taskId,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleView(row, column) {
      const { prop } = column;
      if (prop === "leadsCode") {
        this.$router.push({
          path: "/clueManage/salesClueDetail",
          query: {
            id: row.leadsId,
            backPath: this.$route.path,
          },
        });
      } else if (prop === "signInAddress") {
        this.$refs.mapViewRef.show(row);
      }
    },
  },
};
</script>
