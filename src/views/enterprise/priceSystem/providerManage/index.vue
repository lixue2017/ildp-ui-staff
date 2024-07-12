<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              :dictionary="dictionary"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <!-- <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template> -->
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="providerTable.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="providerTable.httpRequest"
              :getQueryParams="providerTable.getQueryParams"
              v-if="tabsConfig.activeName === tab.name"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <div
                    class="display-flex"
                    @click="handleDetails(slotProps.row)"
                  >
                    <span
                      v-if="slotProps.row.code"
                      class="primary-text-btn ellipsis-text"
                    >
                      {{ slotProps.row.code }}
                    </span>
                    <span v-else class="primary-text-btn ellipsis-text"
                      >--</span
                    >
                  </div>
                </template>
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: dataStatus[slotProps.row.status].color,
                      }"
                    ></i>
                    {{ dataStatus[slotProps.row.status].label }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content">
                    <div class="btn">
                      <div
                        class="btn-list"
                        v-for="(item, index) in providerTable.statusList[
                          slotProps.row.status
                        ]"
                        :key="index"
                      >
                        <el-button
                          :class="`operate-icon ${
                            item.info ? 'operate-icon-info' : ''
                          }`"
                          size="small"
                          type="text"
                          :icon="`${item.icon}`"
                          @click="item.handleClick(slotProps.row)"
                          >{{ item.text }}</el-button
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ComDialog ref="customDialog" :customDialog="customDialogConfig.addOrEdit">
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="updateFormConfig"
          :dictionary="dictionary"
          class="dialog-form"
          v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
        />
      </template>
    </ComDialog>
    <ComDialog
      ref="detailDialog"
      :customDialog="customDialogConfig.details"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :dictionary="dictionary"
          :formConfig="detailFormConfig"
          class="dialog-form"
          v-if="$refs && $refs.detailDialog && $refs.detailDialog.dialogVisible"
        />
      </template>
    </ComDialog>
    <ComLog ref="myComLog" :activities="activities">
      <template v-slot:title="slotProps">
        <span>{{ slotProps.activity.title }}</span>
      </template>
      <template v-slot:operationDate="slotProps">
        <span
          >{{ slotProps.activity.updateBy }} 操作于
          {{ slotProps.activity.updateTime }}</span
        >
      </template>
      <template v-slot:operationContent="slotProps">
        <span
          >{{ slotProps.activity.status && `[${slotProps.activity.status}]`
          }}{{ slotProps.activity.content }}</span
        >
      </template>
    </ComLog>
  </div>
</template>

<script>
import {
  getProviderList,
  addProvider,
  updateProvider,
  delProvider,
  getProviderDetail,
} from "@/api/priceSystem/provider.js";
import { msgBox } from "@/utils/confirmBox.js";
import { DATA_STATUS } from "@/utils/mixin.js";
import { DateCompute } from "@/utils/index.js";
import { mapActions, mapState } from "vuex";
import {
  searchColumns,
  tableColumns,
  updateConfig,
  detailColumns,
} from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "ProviderManage",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComLog: () => import("_comp/ComLog"),
  },
  data() {
    return {
      dataStatus: DATA_STATUS,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "服务商管理",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            handleClick: this.handleUpdate,
          },
        ],
      },
      activities: [
        {
          title: "装箱",
          updateBy: "TianYU",
          updateTime: "2021/12/30 18:46:08",
          status: "装箱",
          content: "FD-BST-211201-0002",
        },
        {
          title: "拣货",
          updateBy: "管理员",
          updateTime: "2021/12/30 18:46:08",
          status: "拣货",
          content: "FD-BST-211201-0002",
        },
        {
          title: "修改",
          updateBy: "test",
          updateTime: "2021/12/30 18:46:08",
          status: "",
          content: "添加FBA附件存仓换标交接表 BSNL21080046 39箱.xlsx",
        },
      ],
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getProviderList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "100px",
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
      providerTable: {
        tableHeight: "calc(100vh - 324px)",
        statusList: {
          0: [
            {
              text: "修改",
              handleClick: this.handleUpdate,
            },
            {
              text: "启动",
              handleClick: (rows) => this.changeStatus(rows, 1),
            },
            {
              text: "删除",
              handleClick: this.handleDelete,
            },
            {
              text: "操作日志",
              handleClick: () => {
                this.$refs.myComLog.show();
              },
            },
          ],
          1: [
            {
              text: "修改",
              handleClick: this.handleUpdate,
            },
            {
              text: "禁用",
              handleClick: (rows) => this.changeStatus(rows, 2),
            },
            {
              text: "操作日志",
              handleClick: () => {
                this.$refs.myComLog.show();
              },
            },
          ],
          2: [
            {
              text: "启用",
              handleClick: (rows) => this.changeStatus(rows, 1),
            },
            {
              text: "操作日志",
              handleClick: () => {
                this.$refs.myComLog.show();
              },
            },
          ],
        },
        getQueryParams: this.getQueryParams,
        httpRequest: getProviderList,
        // columnConfig: tableColumns,
      },
      mixinTableColArr: [tableColumns],
      customDialogConfig: {
        addOrEdit: {
          title: "服务商信息",
          width: "750px",
          status: 0,
          useFooter: "footer",
          footer: [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                this.$refs.customDialog.handleClose();
              },
            },
            {
              text: "保存并启用",
              type: "primary",
              handleClick: () => {
                this.customDialogConfig.addOrEdit.status = 1;
                this.$refs.dialogForm.submitForm();
              },
            },
            {
              text: "暂存",
              type: "primary",
              handleClick: () => {
                this.customDialogConfig.addOrEdit.status = 0;
                this.$refs.dialogForm.submitForm();
              },
            },
          ],
          footerSpare: [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                this.$refs.customDialog.handleClose();
              },
            },
            {
              text: "确定",
              type: "primary",
              handleClick: () => {
                this.$refs.dialogForm.submitForm();
              },
            },
          ],
        },
        details: {
          title: "服务商信息",
          width: "750px",
          footer: [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                this.$refs.detailDialog.handleClose();
              },
            },
            {
              text: "修改",
              type: "primary",
              handleClick: () => {
                this.handleUpdate(this.detailFormConfig.formModel);
              },
            },
          ],
        },
      },
      updateFormConfig: {
        formModel: {},
        httpRequest: this.addOrEditProvider, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "110px",
        lists: updateConfig.addLists, // 表单渲染列表
        formRules: updateConfig.formRules, // 表单校验规则
      },
      detailFormConfig: {
        formModel: {},
        size: "small",
        labelWidth: "100px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: detailColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {},
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("serviceManageTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getProviderList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      if (this.searchFromData.createTime) {
        this.$set(this.searchFromData, "startDate", searchFrom.createTime[0]);
        this.$set(
          this.searchFromData,
          "endDate",
          DateCompute(searchFrom.createTime[1], 1)
        );
        delete this.searchFromData.createTime;
      }
      this.searchFromData.statusList &&
        (this.searchFromData.statusList =
          this.searchFromData.statusList.join(","));
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    // 新增（修改）服务商
    handleUpdate(row = {}) {
      this.$refs.detailDialog.hide();
      this.customDialogConfig.addOrEdit.useFooter = "footer";
      if (!row.id) {
        this.updateFormConfig.formModel = {
          serviceType: [],
        };
        this.updateFormConfig.lists = updateConfig.addLists;
      } else {
        this.updateFormConfig.formModel = {
          ...row,
          status: Number(row.status),
          serviceType: Array.isArray(row.serviceType)
            ? row.serviceType
            : row.serviceType.split(","),
        };
        console.log(this.updateFormConfig.formModel);
        this.customDialogConfig.addOrEdit.status = row.status;
        this.customDialogConfig.addOrEdit.useFooter = "footerSpare";
        this.updateFormConfig.lists = updateConfig.editLists;
      }
      this.$refs.customDialog.show();
    },
    handleSuccess() {
      this.$refs.customDialog.hide();
      this.mixinkeepTable(true);
    },
    changeStatus(row = {}, status) {
      let msg = "启用之后可以被引用";
      let title = "启用提示";
      let className = "el-icon-success text-success";
      if (status === 2) {
        msg = "禁用之后不可引用，且不影响已历史数据";
        title = "禁用提示";
        className = "el-icon-warning text-warning";
      }

      msgBox(this, { title, className, msg }, () => {
        this.customDialogConfig.addOrEdit.status = status;
        updateProvider({
          id: row.id,
          status,
        }).then(() => {
          this.$message({
            message: "数据保存成功!",
            type: "success",
          });
          row.status = status;
        });
      });
    },
    // 查看单条数据详情
    handleDetails(rows) {
      this.fullscreenLoading.show();
      return getProviderDetail(rows.id)
        .then((res) => {
          const data = res.data || {};
          this.detailFormConfig.formModel = {
            ...(data || {}),
            serviceType: data.serviceType.split(","),
          };
          this.$refs.detailDialog.show();
          this.fullscreenLoading.close();
        })
        .catch(() => {
          this.fullscreenLoading.hide();
        });
    },
    addOrEditProvider(formModel) {
      const params = {
        ...formModel,
        serviceType: formModel.serviceType.join(","),
      };
      params.status = this.customDialogConfig.addOrEdit.status;
      if (params.id) {
        return updateProvider(params);
      }
      return addProvider(params);
    },
    handleDelete(rows) {
      if (rows.id) {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";

        msgBox(this, { title, className, msg }, () => {
          delProvider(rows.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.mixinkeepTable();
          });
        });
      }
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
