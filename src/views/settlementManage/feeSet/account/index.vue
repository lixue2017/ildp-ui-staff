<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
              :rowOperationBtnListFn="() => statusList"
            >
              <template v-slot:customRow="{ slotProps }"> </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <Dialog ref="OrderSubmit" @handleSuccess="keepTableList" />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script>
import { getAccountList } from "@/api/settlementManage/feeSet";
import { DateCompute } from "@/utils/index.js";
import { searchColumns, tableColumns, accountOperation } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { removeBankInfo } from "@/api/customerManage/customerList.js";
import { mapActions } from "vuex";
export default {
  name: "Account",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    Dialog: () => import("../components/dialog/index.vue"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
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
            label: "堡森账户",
            name: "1",
          },
          {
            label: "外部账户",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => {
              this.handleUpdate();
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getFeeManageList(formModel);
            resolve();
          });
        }, // 表单提交接口, // 表单提交接口
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
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
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getAccountList,
        columnConfig: tableColumns,
      },
      addVisible: false,
      statusList: [
        {
          text: "修改",
          handleClick: this.handleUpdate,
        },
        {
          text: "删除",
          color: "#FF6767",
          handleClick: this.handleDelete,
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"](["trueOrFalse"]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getStatusList(row) {
      return this.statusList;
    },
    keepTableList(isRefreshPage = true) {
      const { activeName } = this.tabsConfig;
      this.$refs[`tableRef${activeName}`] &&
        this.$refs[`tableRef${activeName}`][0].refreshTable(isRefreshPage);
    },
    getFeeManageList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        startTime: createTime && createTime[0],
        endTime: createTime && DateCompute(createTime[1], 1),
      };
      this.mixinkeepTable(true);
    },
    handleUpdate(row = {}) {
      const { id } = row;
      const { activeName } = this.tabsConfig;
      const customFormConfig = accountOperation({
        id,
        activeName,
      });
      this.$refs.OrderSubmit.show(row, customFormConfig);
    },
    getQueryParams() {
      console.log(typeof this.tabsConfig.activeName);
      return {
        ...(this.searchFromData[this.tabsConfig.activeName] || {}),
        type: Number(this.tabsConfig.activeName) - 1,
      };
    },
    handleDelete(row) {
      const { id } = row;
      console.log("this.$refs", this.$refs);
      this.$refs.confirmDialog.delete().then(() => {
        removeBankInfo(id).then((res) => {
          this.$message.success("删除成功");
          this.keepTableList();
        });
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
.dialog-form {
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.historical-records {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .historical-records-title {
    font-size: 16px;
    margin-right: 21px;
    color: #1f1f1f;
  }

  .historical-records-sub {
    color: #666;

    i {
      margin-right: 10px;
    }
  }
}
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
</style>
