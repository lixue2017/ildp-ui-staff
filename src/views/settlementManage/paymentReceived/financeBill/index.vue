<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'type'">
                  <span
                    :style="{
                      color: slotProps.dicsList.color,
                    }"
                  >
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operate-btn-list">
                    <template
                      v-for="(item, index) in tableConfig.statusList[
                        slotProps.row.status || 0
                      ]"
                    >
                      <div class="btn" :key="index">
                        <el-button
                          class="operate-icon"
                          size="mini"
                          type="text"
                          @click="item.handleClick(slotProps.row)"
                        >
                          {{ item.text }}
                        </el-button>
                      </div>
                    </template>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <EditDialog ref="editDialog" @handleSuccess="mixinkeepTable" />
    <DetailDialog ref="detailDialog" />
    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>

<script>
import {
  getExpenseList,
  auditExpense,
  updateExpense,
  deleteExpense,
} from "@/api/settlementManage/paymentReceived";
import { mapActions, mapState } from "vuex";
import { DateCompute } from "@/utils/index.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model";
export default {
  name: "FinanceBill",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    EditDialog: () => import("./components/EditDialog"),
    DetailDialog: () => import("./components/DetailDialog"),
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"), // 审核弹窗
  },
  computed: {
    ...mapState(["dictionary", "user"]),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "财务报销账单",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "创建账单",
            handleClick: this.handleClick,
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
        }, // 表单提交接口
        fold: true, // 模糊搜索是否需要展开按钮
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
        searchNum: searchColumns.length,
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
        httpRequest: getExpenseList,
        columnConfig: tableColumns,
        statusList: {
          0: [
            {
              text: "提交",
              handleClick: (row) => this.handleClick("status", row),
            },
            {
              text: "修改",
              handleClick: (row) => this.handleClick("edit", row),
            },
            {
              text: "删除",
              handleClick: this.handleDelete,
            },
            {
              text: "查看",
              handleClick: (row) => this.handleClick("detail", row),
            },
          ],
          1: [
            {
              text: "审核",
              handleClick: (row) => this.handleClick("audit", row),
            },
            {
              text: "查看",
              handleClick: (row) => this.handleClick("detail", row),
            },
          ],
          2: [
            {
              text: "查看",
              handleClick: (row) => this.handleClick("detail", row),
            },
          ],
        },
      },
      applicant: {},
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.showSearchForm = true;
    });
  },
  mounted() {
    this.applicant = {
      id: this.user.userId,
      name: this.user.nickName,
    };
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getFeeManageList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      if (this.searchFromData.createTime) {
        this.$set(this.searchFromData, "startTime", searchFrom.createTime[0]);
        this.$set(
          this.searchFromData,
          "endTime",
          DateCompute(searchFrom.createTime[1], 1)
        );
        delete this.searchFromData.createTime;
      }
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        isDataFil: 1,
      };
    },
    handleClick(type, row) {
      if (type === "edit") {
        this.$refs.editDialog.show(row);
      } else if (type === "detail") {
        this.$refs.detailDialog.show(row);
      } else if (type === "audit") {
        this.$refs.confirmDialog.handleFormDialog("billVerify", {
          formModel: {
            status: 1,
            id: row.id,
          },
          httpRequest: auditExpense,
          successFunction: this.mixinkeepTable,
        });
      } else if (type === "status") {
        updateExpense({
          status: 1,
          id: row.id,
        }).then(() => {
          this.$message.success("提交成功");
          this.mixinkeepTable();
        });
      } else {
        this.$refs.editDialog.show({
          applicant: this.applicant.id,
          applicantName: this.applicant.name,
        });
      }
    },
    handleDelete({ id }) {
      this.$refs.confirmDialog.delete().then(() => {
        deleteExpense(id).then(() => {
          this.$message.success("删除成功");
          this.mixinkeepTable();
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
</style>
