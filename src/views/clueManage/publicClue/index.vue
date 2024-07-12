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
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="handleView"
              :rowOperationBtnListFn="() => handleBtn(operationList)"
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
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ReceiveClueDialog ref="receiveClueRef" @handleSuccess="handleSuccess" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model.js";
import {
  getCommunalPage,
  getCommunalExport,
  delSalesLeads,
  getSalesClaimLead,
} from "@/api/clueManage/salesClue.js";
import { mixinConfSearch } from "_comp/ComColumnConf/SearchColumn/mixinConfSearch.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";

export default {
  name: "PublicClue",
  mixins: [mixinColsConf, mixinConfSearch],
  components: {
    TabItem: () => import("_comp/ComColumnConf/SearchColumn/TabItem"),
    ReceiveClueDialog: () =>
      import("@/views/clueManage/components/ReceiveClueDialog"),
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
        httpRequest: getCommunalPage,
      },
      searchFromData: {},
      mixinTableColArr: {
        559: tableColumns,
        560: tableColumns,
        561: tableColumns,
      },
      tableColumns,
      operationList: [
        {
          text: "删除",
          color: "#FF6767",
          handleClick: this.handleDelete,
          hasPermission: ["clueManage:publicClue:delete"],
        },
      ],
      selectionRows: [],
    };
  },
  created() {
    this.tabsConfig.btnArr = this.handleBtn([
      {
        table: "导出",
        icon: "iconfont daochu",
        handleClick: () => {
          this.btnType = "export";
          this.$refs.searchFormRef[0].submitForm();
        },
      },
      {
        table: "领取线索",
        disabled: true,
        handleClick: this.handleReceiveClue,
        hasPermission: ["clueManage:publicClue:receiveClue"],
      },
    ]);
    this["dictionary/getDictionary"]([
      "crmSource",
      "crmSalesLeadsState",
      "crmLeadSource",
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
          getCommunalExport,
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
    handleReceiveClue() {
      const salesLeadsIds = this.selectionRows.map((item) => item.id);
      this.$refs.receiveClueRef.show(salesLeadsIds);
    },
    selectionRowEvt(row) {
      return true;
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.tabsConfig.btnArr[1].disabled = !rows.length;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
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
    handleSuccess() {
      this.onTableSelectionChange();
      this.mixinkeepTable(true);
      this.handleRouteStateCount();
    },
  },
};
</script>

<style lang="scss" scoped>
.tagClass {
  &:not(:first-child) {
    margin-left: 5px;
  }
}
</style>
