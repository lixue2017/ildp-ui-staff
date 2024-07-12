<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in stateSearchSumList(1)">
        <el-tab-pane
          :label="tab.nameCn"
          :name="`${tab.countType}`"
          :key="`${tab.countType}`"
        >
          <template slot="label">
            <TabItem :sItem="tab" />
          </template>
          <keep-alive>
            <ComForm
              ref="searchFormRef"
              v-if="showSearchForm && tabsConfig.activeName == tab.countType"
              :formConfig="searchFormConfig"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="showSearchForm && tabsConfig.activeName == tab.countType"
              :ref="`tableRef${tab.countType}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.countType)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.countType)"
              :rowOperationBtnListFn="getOperationList"
              @handleTableView="handleView"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <FollowUpDialog ref="followUpDialogRef" @handleSuccess="mixinkeepTable" />
    <FollowUpOrdinaryDialog
      ref="followUpOrdinaryDialogRef"
      @handleSuccess="mixinkeepTable"
    />
    <TaskDialog ref="taskDialogRef" @handleSuccess="mixinkeepTable" />
    <TaskFollowUpDialog
      ref="taskFollowUpDialogRef"
      @handleSuccess="mixinkeepTable"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model.js";
import { mixinConfSearch } from "_comp/ComColumnConf/SearchColumn/mixinConfSearch.js";
import {
  getTaskPage,
  exportTask,
  completeTask,
  archiveTask,
  repulseTask,
} from "@/api/clueManage/taskRecord.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";

export default {
  name: "TaskRecord",
  mixins: [mixinColsConf, mixinConfSearch],
  components: {
    TabItem: () => import("_comp/ComColumnConf/SearchColumn/TabItem"),
    FollowUpDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog"),
    FollowUpOrdinaryDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog/ordinary"),
    TaskDialog: () => import("@/views/clueManage/components/TaskDialog"),
    TaskFollowUpDialog: () =>
      import("@/views/clueManage/components/TaskDialog/followUp"),
  },
  data() {
    return {
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
        httpRequest: getTaskPage,
      },
      searchFromData: {},
      tableColumns,
      operationList: [
        {
          text: "编辑",
          statusArr: [0],
          handleClick: this.handleAddTask,
          hasPermission: ["clueManage:taskRecord:edit"],
        },
        {
          text: "任务跟进",
          statusArr: [0],
          showType: [0],
          handleClick: this.handleFollowUp,
          hasPermission: ["clueManage:taskRecord:followUp"],
        },
        {
          text: "任务完成",
          statusArr: [1],
          handleClick: (row) => this.handleConfirm(row, 1),
          hasPermission: ["clueManage:taskRecord:complete"],
        },
        {
          text: "取消",
          statusArr: [0, 1],
          handleClick: this.handleCancel,
          hasPermission: ["clueManage:taskRecord:cancel"],
        },
        {
          text: "归档",
          statusArr: [3],
          handleClick: (row) => this.handleConfirm(row, 2),
          hasPermission: ["clueManage:taskRecord:placeOnFile"],
        },
        {
          text: "打回",
          statusArr: [3],
          color: "#FF6767",
          handleClick: (row) => this.handleConfirm(row, 3),
          hasPermission: ["clueManage:taskRecord:repulse"],
        },
      ],
      mixinTableColArr: {
        999: tableColumns,
        979: tableColumns,
        563: tableColumns,
        989: tableColumns,
        564: tableColumns,
      },
      btnType: null,
    };
  },
  created() {
    this.tabsConfig.btnArr = [
      {
        table: "导出",
        icon: "iconfont daochu",
        handleClick: () => {
          this.btnType = "export";
          this.$refs.searchFormRef[0]?.submitForm();
        },
      },
    ];
    this["dictionary/getDictionary"]([
      "crmTaskState",
      "crmTaskType",
      "crmTaskUrgent",
      "crmFollowType",
      "crmSalesLeadsState",
      "crmRemindWay",
      "crmBusinessType",
      "crmRemind",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    getTableList(searchFrom = {}) {
      const { webAllSearchFormData, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
      };
      if (this.btnType === "export") {
        this.btnType = null;
        comFileDownload(
          this,
          exportTask,
          this.getQueryParams(this.tabsConfig.activeName)
        );
      } else {
        this.mixinkeepTable(true, {
          isTableSearch: true,
          webAllSearchFormData,
        });
        this.handleRouteStateCount();
      }
    },
    getQueryParams(tabName) {
      const { createTime, ...searchObj } = this.searchFromData[tabName] || {};
      const [createTimeGe, createTimeLe] = createTime || [];
      return {
        ...(this.mixinSearchConfParams || {}),
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
    },
    getOperationList(row) {
      return this.operationList.filter(
        (item) =>
          item.statusArr.includes(row.state) &&
          (!item.showType || !row.attendance) && // 签到任务隐藏任务跟进
          (!item.hasPermission || hasBtnPermits(item.hasPermission))
      );
    },
    handleAddTask(row) {
      const { type } = row;
      if (type === 0) {
        this.$refs.taskDialogRef.show(row, true);
      } else {
        this.$refs.taskFollowUpDialogRef.show(row, true);
      }
    },
    handleFollowUp(row) {
      const { id, type, businessId, customerName, attendance } = row;
      if (type) {
        this.$refs.followUpDialogRef.show(
          {
            id,
            type,
            businessName: customerName,
            businessId,
            attendance,
          },
          "task"
        );
      } else {
        this.$refs.followUpOrdinaryDialogRef.show({ id });
      }
    },
    handleCancel(row) {
      this.$refs.followUpOrdinaryDialogRef.show(row, true);
    },
    handleConfirm(row, type) {
      let msgTxt1 = "";
      let req = "";
      const params = { id: row.id };
      switch (type) {
        case 1: // 任务完成
          msgTxt1 = "任务完成";
          req = completeTask;
          break;
        case 2: // 任务归档
          msgTxt1 = "任务归档";
          req = archiveTask;
          break;
        case 3: // 任务打回
          msgTxt1 = "任务打回";
          req = repulseTask;
          break;

        default:
          break;
      }
      customMessageBox(
        this,
        {
          msgTitle: "确认提示",
          msgTxt1,
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => req(params),
        },
        () => {
          this.msgSuccess(`${msgTxt1}成功`);
          this.mixinkeepTable();
        }
      );
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/clueManage/taskRecordDetail",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>
