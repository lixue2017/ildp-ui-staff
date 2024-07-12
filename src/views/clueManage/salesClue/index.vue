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
            {{ tab.countType }}
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="showSearchForm && tabsConfig.activeName == tab.countType"
              :ref="`tableRef${tab.countType}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.countType)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.countType)"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="getOperationList"
              @handleTableView="handleView"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'crmTag'">
                  <el-tag
                    v-for="item in slotProps.row.crmTagList || []"
                    :key="item.id"
                    class="tagClass"
                    :style="{
                      color: item.color || '#5094ff',
                      backgroundColor: `${item.color || '#5094ff'}0D`,
                      borderColor: item.color || '#5094ff',
                    }"
                    size="small"
                  >
                    {{ item.name }}</el-tag
                  >
                  <span v-if="!slotProps.row.crmTagList">--</span>
                </template>
                <template v-if="slotProps.prop === 'latestFollow'">
                  <div
                    class="latest-follow"
                    v-html="slotProps.row.latestFollow"
                    v-if="slotProps.row.latestFollow"
                  ></div>
                  <span v-else>--</span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ClueDialog ref="clueDialogRef" @handleSuccess="handleSuccess" />
    <ConvertCustomer ref="convertCustomerRef" @handleSuccess="handleSuccess" />
    <ConfirmDialog ref="confirmDialog" />
    <TaskDialog ref="taskDialogRef" @handleSuccess="mixinkeepTable" />
    <TaskFollowUpDialog
      ref="taskFollowUpDialogRef"
      @handleSuccess="mixinkeepTable"
    />
    <FollowUpDialog ref="followUpDialogRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model.js";
import { mixinConfSearch } from "_comp/ComColumnConf/SearchColumn/mixinConfSearch.js";
import {
  getSalesLeads,
  transferSalesLeads,
  salesLeadsExport,
  getSalesLeadsPinned,
  convertCommunalize,
  delSalesLeads,
} from "@/api/clueManage/salesClue.js";
import { transferCluesForm } from "@/views/clueManage/components/model.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";

export default {
  name: "SalesClue",
  mixins: [mixinColsConf, mixinConfSearch],
  components: {
    TabItem: () => import("_comp/ComColumnConf/SearchColumn/TabItem"),
    ClueDialog: () => import("@/views/clueManage/components/ClueDialog"),
    TaskDialog: () => import("@/views/clueManage/components/TaskDialog"),
    TaskFollowUpDialog: () =>
      import("@/views/clueManage/components/TaskDialog/followUp"),
    ConvertCustomer: () =>
      import("@/views/clueManage/components/ConvertCustomer"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    FollowUpDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog"),
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
        httpRequest: getSalesLeads,
      },
      searchFromData: {},
      operationList: [
        {
          text: "跟进",
          handleClick: this.handleFollowUp,
          hasPermission: ["clueManage:salesClue:followUp"],
        },
        {
          text: "编辑",
          handleClick: this.handleAddEdit,
          hasPermission: ["clueManage:salesClue:edit"],
        },
        {
          text: "置顶",
          hideStateArr: [9],
          handleClick: this.handlePinned,
          hasPermission: ["clueManage:salesClue:pinned"],
        },
        {
          text: "复制",
          hideStateArr: [9],
          handleClick: this.handleCopy,
          hasPermission: ["clueManage:salesClue:copy"],
        },
        {
          text: "删除",
          color: "#FF6767",
          handleClick: this.handleDelete,
          hasPermission: ["clueManage:salesClue:delete"],
        },
      ],
      mixinTableColArr: {
        999: tableColumns,
        9: tableColumns,
        562: tableColumns,
      },
      selectionRows: [],
    };
  },
  watch: {
    selectionRows(list) {
      this.tabsConfig.btnArr.map((item) => {
        if (["convertCustomer"].includes(item.value)) {
          const arr = list.filter((item) => !item.isCustomer);
          item.disabled = arr.length !== 1;
        }
        if (["addTask"].includes(item.value)) {
          item.disabled = list.length !== 1;
        }
        if (item.value === "transferClues") {
          item.disabled = !list.length;
        }
      });
    },
  },
  created() {
    this.tabsConfig.btnArr = this.handleBtn([
      {
        table: "添加",
        value: "add",
        className: "btn-type-add",
        icon: "el-icon-plus",
        handleClick: this.handleAddEdit,
        hasPermission: ["clueManage:salesClue:add"],
      },
      {
        table: "导出",
        value: "export",
        icon: "iconfont daochu",
        handleClick: () => {
          this.btnType = "export";
          this.$refs.searchFormRef[0]?.submitForm();
        },
      },
      {
        table: "转为客户",
        value: "convertCustomer",
        handleClick: this.handleConvertCustomer,
        disabled: true,
        showTabName: ["1000", "10"],
        hasPermission: ["clueManage:salesClue:convertCustomer"],
      },
      {
        disabled: true,
        table: "转移线索",
        value: "transferClues",
        btnType: "dropdown",
        hasPermission: ["clueManage:salesClue:transferClues"],
        dropdownArr: [
          {
            name: "转移给他人",
            value: 2,
          },
          {
            name: "转移至公海",
            value: 1,
          },
        ],
        handleClick: (_, dItem) => this.handleTransferClues(dItem),
      },
      {
        disabled: true,
        table: "新建任务",
        value: "addTask",
        btnType: "dropdown",
        hasPermission: ["clueManage:salesClue:addTask"],
        dropdownArr: [
          {
            name: "跟进任务",
            value: 2,
          },
          {
            name: "普通任务",
            value: 1,
          },
        ],
        handleClick: (_, dItem) => this.handleAddTask(dItem),
      },
    ]);
    this["dictionary/getDictionary"]([
      "crmSource",
      "crmSalesLeadsState",
      "crmHonorific",
      "crmLeadBusinessType",
      "clientCategory",
      "crmCustomerLevel",
      "crmTaskUrgent",
      "crmLeadSource",
      "crmRole",
      "crmRemind",
      "crmRemindWay",
      "crmBusinessType",
      "crmFollowType",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleBtn(btnList) {
      return btnList.filter(
        (btn) => !btn.hasPermission || hasBtnPermits(btn.hasPermission)
      );
    },
    getTableList(searchFrom = {}) {
      const { webAllSearchFormData, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
      };
      if (this.btnType === "export") {
        this.btnType = null;
        comFileDownload(
          this,
          salesLeadsExport,
          this.getQueryParams(this.tabsConfig.activeName)
        );
      } else {
        this.onTableSelectionChange();
        this.mixinkeepTable(true, {
          isTableSearch: true,
          webAllSearchFormData,
        });
        this.handleRouteStateCount();
      }
    },
    handleSuccess() {
      this.mixinkeepTable();
      this.handleRouteStateCount();
    },
    getQueryParams(tabName) {
      const { createTime, lastFollowTime, ...searchObj } =
        this.searchFromData[tabName] || {};
      const [createTimeGe, createTimeLe] = createTime || [];
      const [lastFollowTimeGe, lastFollowTimeLe] = lastFollowTime || [];
      return {
        ...(this.mixinSearchConfParams || {}),
        ...searchObj,
        createTimeGe,
        createTimeLe,
        lastFollowTimeGe,
        lastFollowTimeLe,
      };
    },
    handleFollowUp(row) {
      const { id: businessId, name, code } = row;
      this.$refs.followUpDialogRef.show({
        businessId,
        businessName: `${code}/${name}`,
        type: 0, // 0:普通跟进(不含签到)；
        businessType: 1, // 1:线索；4：联系人
      });
    },
    handleAddEdit(row) {
      this.$refs.clueDialogRef.show(row);
    },
    handleCopy(row) {
      const { id, ...data } = row;
      this.$refs.clueDialogRef.show(data);
    },
    handlePinned(row) {
      getSalesLeadsPinned(row.id).then(() => {
        this.msgSuccess("置顶成功");
        this.mixinkeepTable();
      });
    },
    handleConvertCustomer() {
      this.$refs.convertCustomerRef.show(this.selectionRows[0]);
    },
    handleTransferClues(item) {
      const salesLeadsIds = this.selectionRows.map((item) => item.id);
      if (item.value === 1) {
        customMessageBox(
          this,
          {
            msgTitle: "转移提示",
            msgTxt1: "是否确认进入公共销售线索？",
            msgTxt2: "",
            httpMsgRequest: () =>
              convertCommunalize({
                salesLeadsIds,
              }),
          },
          () => {
            this.onTableSelectionChange();
            this.msgSuccess("转移成功");
            this.mixinkeepTable();
            this.handleRouteStateCount();
          }
        );
      } else {
        this.$refs.confirmDialog.handleFormDialog("customConfirmModel", {
          dialogTitle: "转移线索",
          formModel: {},
          customFormConfig: transferCluesForm(),
          httpRequest: (formData) => {
            // console.log(1111, formData);
            const { ownershipUserId, remark } = formData;
            const params = {
              salesLeadsIds,
              ownershipUserId,
              remark,
            };
            return transferSalesLeads(params);
          },
          successFunction: () => {
            this.onTableSelectionChange();
            this.mixinkeepTable();
            this.handleRouteStateCount();
          },
        });
      }
    },
    handleAddTask(item) {
      if (item.value === 1) {
        const { id: businessId, code, name } = this.selectionRows[0];
        this.$refs.taskDialogRef.show(
          {
            businessId,
            businessName: `${code}[${name}]`,
            businessType: 1,
          },
          true
        );
      } else {
        const { id: businessId, code, name } = this.selectionRows[0];
        this.$refs.taskFollowUpDialogRef.show(
          {
            businessId,
            businessName: `${code}[${name}]`,
            businessType: 1,
          },
          true
        );
      }
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delSalesLeads(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
          this.handleRouteStateCount();
        }
      );
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/clueManage/salesClueDetail",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.tabsConfig.btnArr[2].disabled = rows.length !== 1;
      this.tabsConfig.btnArr[3].disabled = !rows.length;
      this.tabsConfig.btnArr[4].disabled = rows.length !== 1;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    getOperationList(row) {
      return this.operationList.filter(
        (item) =>
          (!item.hideStateArr || !item.hideStateArr.includes(row.state)) &&
          (!item.hasPermission || hasBtnPermits(item.hasPermission))
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.latest-follow {
  /deep/ {
    img {
      max-height: 32px;
    }
  }
}
/deep/ {
  .follow-model {
    .el-form-item__content {
      display: flex;
      align-items: center;
      .tip-icon {
        margin-left: 0px;
        cursor: pointer;
      }
    }
  }
}
.tagClass {
  &:not(:first-child) {
    margin-left: 5px;
  }
}
</style>
