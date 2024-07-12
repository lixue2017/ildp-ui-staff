<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs || []">
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
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'nameCn'">
                  <div
                    class="display-flex"
                    @click="handleDetails(slotProps.row)"
                  >
                    <span class="primary-text-btn ellipsis-text">
                      {{ slotProps.row.nameCn }}
                    </span>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.row.status &&
                          slotProps.dicsList &&
                          slotProps.dicsList.color,
                      }"
                    ></i>
                    {{
                      slotProps.row.status &&
                      slotProps.dicsList &&
                      slotProps.dicsList.nameCn
                    }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'userStatus'">
                  <span v-if="slotProps.row.status == '3'">
                    {{
                      slotProps.row.userStatus &&
                      slotProps.dicsList &&
                      slotProps.dicsList.nameCn
                    }}
                  </span>
                  <span v-else>--</span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content">
                    <div class="btn">
                      <div class="btn-list">
                        <el-button
                          class="operate-icon"
                          size="small"
                          type="text"
                          @click="handleUpdate(slotProps.row)"
                        >
                          修改
                        </el-button>
                      </div>
                      <div
                        class="btn-list"
                        v-for="(item, index) in tableConfig.statusList[
                          `${slotProps.row.status || 0}${
                            slotProps.row.userStatus || 0
                          }`
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
    <AddDrawer
      ref="addDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
    <EditDrawer
      ref="editDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
    <PerfectDrawer
      ref="perfectDrawer"
      @handleSuccess="handleSuccess"
      :dictionary="dictionary.dicsData"
    />
    <ConfirmDialog ref="confirmDialog" :dictionary="dictionary.dicsData" />
  </div>
</template>

<script>
import { delCustomer } from "@/api/customerManage/customerList.js";
import {
  getCustomerList,
  modifyCustStatus,
  openAccount,
} from "@/api/customerManage/customerList.js";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "./model";
import commonMixin from "@/utils/mixin";
import { hostLoginClient } from "@/utils/index";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "CustomerList",
  mixins: [commonMixin, mixinColsConf],
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    AddDrawer: () => import("./components/AddDrawer"),
    EditDrawer: () => import("./components/EditDrawer"),
    PerfectDrawer: () => import("./components/PerfectDrawer"),
  },
  data() {
    return {
      serviceTypeMethods: this.getserviceType,
      CLIENTIDENTITY: [],
      LEVEL: [],
      SOURCE: [],
      CATEGORY: [],
      BUSINESSOWNERSHIP: [],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "全部客户",
            name: "1",
          },
          // {
          //   label: "待审核客户",
          //   name: "2",
          // },
        ],
        btnArr: [
          {
            table: "新增",
            handleClick: () => {
              this.$refs.addDrawer.show();
            },
          },
        ],
      },
      searchFromData: {
        1: {
          status: "0,1,2,3",
        },
        2: {
          status: 1,
        },
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getCustomerList(formModel);
            resolve();
          });
        }, // 表单提交接口
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
      //0-已激活  1-未开通
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        statusList: {
          "00": [
            {
              text: "提交",
              handleClick: this.handleSubmitStatus,
            },
            {
              text: "删除",
              info: true,
              handleClick: this.handleDelete,
            },
          ],
          "01": [
            {
              text: "提交",
              handleClick: this.handleSubmitStatus,
            },
            {
              text: "删除",
              info: true,
              handleClick: this.handleDelete,
            },
          ],
          10: [
            {
              text: "审核",
              handleClick: this.handleVerify,
            },
          ],
          11: [
            {
              text: "审核",
              handleClick: this.handleVerify,
            },
          ],
          20: [
            {
              text: "提交",
              handleClick: this.handleSubmitStatus,
            },
            {
              text: "删除",
              info: true,
              handleClick: this.handleDelete,
            },
          ],
          21: [
            {
              text: "提交",
              handleClick: this.handleSubmitStatus,
            },
            {
              text: "删除",
              info: true,
              handleClick: this.handleDelete,
            },
          ],
          30: [
            {
              text: "登录客户端",
              handleClick: (row) => {
								hostLoginClient(row.relationUserId);
              },
            },
          ],
          31: [
            {
              text: "开通账号",
              handleClick: this.handleOpenAccount,
            },
          ],
          32: [
            {
              text: "启用账号",
              handleClick: this.handleEnable,
            },
          ],
        },
        httpRequest: getCustomerList,
      },
      mixinTableColArr: [tableColumns],
    };
  },
  computed: {
    ...mapState(["dictionary", "customer"]),
  },
  created() {
    this["dictionary/getDictionary"]("custTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getCustomerList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        status: searchFrom.status ? searchFrom.status.join(",") : undefined,
        userStatus: searchFrom.userStatus && searchFrom.userStatus.join(","),
        level: searchFrom.level && searchFrom.level.join(","),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tName) {
      const { status, ...searchParams } = this.searchFromData[tName];
      return {
        ...searchParams,
        status: status || (tName === "1" ? "0,1,2,3" : 1),
      };
    },
    // 查看客户详情
    handleDetails(row) {
      const { id } = row;
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      this.$router.push({
        path: "/enterprise/custDetails",
        query: {
          id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    // 修改客户
    handleUpdate(row) {
      this.$refs.editDrawer.show(row);
    },
    // 新增客户成功回调
    handleSuccess(formModel) {
      if (formModel) {
        // 点击保存并补充
        this.$refs.perfectDrawer.show(formModel);
      }
      this.mixinkeepTable();
    },
    handleSubmitStatus(rows) {
      if (rows.id) {
        modifyCustStatus({ id: rows.id, status: "1" }).then(() => {
          this.$message.success("提交成功");
          this.mixinkeepTable();
        });
      }
    },
    handleOpenAccount(rows) {
      if (rows.id) {
        this.$refs.confirmDialog.handleFormDialog("openAccount", {
          httpRequest: (formModel) => {
            return new Promise((resolve) => {
              openAccount({ ...formModel });
              resolve();
            });
          },
          successMessage: "开通成功",
          successFunction: () => {
            return setTimeout(() => {
              this.mixinkeepTable();
            }, 1000);
          },
          formModel: {
            id: rows.id,
            loginName: "",
            password: "",
          },
        });
      }
    },
    handleEnable(rows) {
      if (rows.id) {
        this.$refs.confirmDialog.enable().then(() => {
          this.$message.success("启用成功");
          this.mixinkeepTable();
        });
      }
    },
    handleDisable(rows) {
      if (rows.id) {
        this.$refs.confirmDialog.disable().then(() => {
          this.$message.success("禁用成功");
          this.mixinkeepTable();
        });
      }
    },
    handleDelete(rows) {
      if (rows.id) {
        this.$refs.confirmDialog.delete().then(() => {
          delCustomer(rows.id).then(() => {
            this.$message.success("删除成功");
            this.mixinkeepTable();
          });
        });
      }
    },
    handleVerify(rows) {
      if (rows.id) {
        this.$refs.confirmDialog.handleFormDialog("verify", {
          httpRequest: this.handleVerifyApi,
          successMessage: "审核成功",
          successFunction: () => {
            setTimeout(() => {
              this.mixinkeepTable();
            }, 1000);
          },
          formModel: {
            nameCn: rows.nameCn,
            nickName: rows.userNickName,
            status: 3,
            id: rows.id,
          },
        });
        this.$refs.confirmDialog.handleChange(3, "status");
      }
    },
    handleVerifyApi(form) {
      return new Promise((resolve) => {
        modifyCustStatus(form);
        resolve(form);
      });
    },
    getserviceType(data, type) {
      var arr = data.clientIdentity.split(",");
      var rArr = [];
      for (let i = 0; i < arr.length; i++) {
        rArr.push(type && type[Number(arr[i])].nameCn);
      }
      return rArr.toString();
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
.input-slot {
  /deep/ {
    .el-select .el-input {
      &.is-focus {
        .el-input__inner {
          border: none;
        }
      }
      .el-input__inner {
        background: #bcbcbc;
        width: 74px;
      }
    }
    .input-slot-left {
      .el-select .el-input .el-input__inner,
      .el-input__inner {
        border-radius: 4px 0 0 4px;
      }
    }
    .input-slot-center {
      .el-select .el-input .el-input__inner,
      .el-input__inner {
        border-radius: 0;
      }
    }
    .input-slot-right {
      .el-select .el-input .el-input__inner,
      .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
  }
}
/deep/ .drawer-content {
  .el-radio-group {
    white-space: nowrap;
  }

  .label-color-red .el-form-item__label {
    color: #f04764;
  }
}
</style>
