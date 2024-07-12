<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            ref="searchTabForm"
            :formConfig="searchFormConfig"
            v-if="showSearchForm"
          >
          </ComForm>
          <ComTable
            :ref="`tableRef${tab.name}`"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="tableConfig.columnConfig"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="getQueryParams"
            :rowOperationBtnListFn="getBtnLists"
            @handleTableView="(row) => handleJumpPage(row, 'detail')"
            v-if="tabsConfig.activeName == tab.name && showSearchForm"
          >
          </ComTable>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComCustomDialog ref="mCustomDialogRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { msgTipBox } from "@/utils/confirmBox.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import {
  POSTCustomerlevelList,
  PUTCustomerlevelDispose,
  DELETECustomerlevel,
} from "@/api/oneConsignmentPlan/customerLv.js";
export default {
  name: "LvManage",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "客户等级管理",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新 增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => {
              this.handleJumpPage({}, "add");
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {
          stateIn:['0','1','2','3']
        }, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: true,
        size: "small",
        labelWidth: "100px",
        lists: searchForm,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        columnConfig: tableColumns,
        httpRequest: POSTCustomerlevelList,
        statusBtnList: [
          {
            text: "提交",
            showStatus: [0],
            handleClick: (row) => {
              this.handleUpdateStatus(row, 1);
            },
          },
          {
            text: "修改",
            showStatus: [0],
            handleClick: (row) => {
              this.handleJumpPage(row, "edit");
            },
          },
          {
            text: "删除",
            showStatus: [0],
            color: "#FF6767",
            handleClick: (row) => {
              this.handleDelete(row, "delete");
            },
          },
          {
            text: "通过",
            showStatus: [1],
            handleClick: (row) => {
              this.handleUpdateStatus(row, 3);
            },
          },
          {
            text: "驳回",
            showStatus: [1],
            color: "#FF6767",
            handleClick: (row) => {
              this.handleUpdateStatus(row, 0);
            },
          },
          {
            text: "作废",
            showStatus: [3],
            handleClick: (row) => {
              this.handleDelete(row, 4);
            },
          },
          {
            text: "生效",
            showStatus: [4],
            handleClick: (row) => {
              const { id } = row;
              const params = {
                id,
                state: 3,
              };
              PUTCustomerlevelDispose(params).then((res) => {
                this.$message.success("生效成功！");
                this.mixinkeepTable();
              });
            },
          },
        ],
      },
      showSearchForm: false,
      searchFromData: {
        stateIn:['0','1','2','3']
      },
    };
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"]([
      "limitManageStatus",
      "customerLvStatus",
      "priceGrade",
      "extrasGrade",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { createTime, ...nSearchFrom } = searchFrom;
      this.searchFromData = {
        startTime: createTime ? `${createTime[0]} 00:00:00` : undefined,
        endTime: createTime ? `${createTime[1]} 23:59:59` : undefined,
        ...nSearchFrom,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const {stateIn=[],...obj}=this.searchFromData
      return {
        ...obj,
        stateIn:stateIn.join(',')
      };
    },
    handleJumpPage(row, activeTab) {
      const { id } = row;
      const { activeName } = this.tabsConfig;
      const path = {
        add: "/oneConsignmentPlan/customerLevelLimit/lvManageEdit",
        edit: "/oneConsignmentPlan/customerLevelLimit/lvManageEdit",
        detail: "/oneConsignmentPlan/customerLevelLimit/lvManageDetail",
      }[activeTab];
      const idList = this.$refs[`tableRef${activeName}`][0].tableData.map(
        (e) => e.id
      );
      this.$router.push({
        path,
        query: {
          id,
          backPath: this.$route.fullPath,
          pageSign:
            activeTab == "detail" ? [...new Set(idList)].join(",") : undefined, // 详情显示上一页/下一页
          activeTab,
        },
      });
    },
    handleSubmit() {},
    handleUpdateStatus(row, type) {
      const { id } = row;
      const config = {
        1: {
          title: "提交",
          label: "提交备注：",
          maxlength:400,
        },
        3: {
          title: "通过",
          label: "通过备注：",
          maxlength:400,
        },
        0: {
          title: "驳回",
          label: "驳回备注：",
          maxlength:400,
        },
      }[type];
      this.$refs.mCustomDialogRef?.showCustomDialog({
        customFormConfig: remarkDialogCols(config),
        formModel: {
          id,
          state: type,
        },
        httpRequest: (formModel) => {
          return PUTCustomerlevelDispose(formModel);
        },
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleDelete(row, type) {
      const titleLists = {
        delete: {
          title: "删除提示",
          msg: "删除操作不可逆，你还要继续吗？",
          httpRequest: DELETECustomerlevel,
        },
        4: {
          title: "作废提示",
          msg: "操作作废之后该数据不可被关联匹配，你还要继续吗？",
          httpRequest: PUTCustomerlevelDispose,
        },
      }[type];
      msgTipBox(
        this,
        {
          ...titleLists,
          showCancelButton: true,
        },
        () => {
          const { id } = row;
          const { httpRequest } = titleLists;
          const params =
            type == 4
              ? {
                  id,
                  state: type,
                }
              : id;
          httpRequest(params).then((res) => {
            this.mixinkeepTable();
          });
        }
      );
    },
    getBtnLists(row) {
      const { state } = row;
      const arr = this.tableConfig.statusBtnList.filter((e) => {
        return e.showStatus.includes(state);
      });
      return arr;
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style lang="scss" scoped></style>
