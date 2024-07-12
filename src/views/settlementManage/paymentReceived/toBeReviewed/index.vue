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
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              @onSelectionChange="onSelectionChange"
							:rowOperationBtnListFn="(row) => tableConfig.statusList"
							@handleTableView="handleUpdate"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>

<script>
import {
  getBillNewList,
  recheckBill,
} from "@/api/settlementManage/statementManage";
import { searchColumns, tableColumns } from "./model";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "ToBeReviewed",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "待复核付款单",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "90px",
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
        httpRequest: getBillNewList,
        columnConfig: tableColumns,
        statusList: [
          {
            text: "通过",
            handleClick: (row) => {
              var params = {
                ids: [row?.id],
              };
              this.handleApproved(params);
            },
          },
          {
            text: "打回",
            handleClick: (row) => {
              var params = {
                ids: [row?.id],
              };
              this.handleBillConfirm(params);
            },
          },
        ],
      },
      selectionRows: [],
      mixinTableColArr: [tableColumns],
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getList(searchFrom = {}) {
      const { createTime, lastDate, undefined, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        // createTime: createTime && `${createTime[0]}@${createTime[1]}`,
        lastDate: lastDate && `${lastDate[0]}@${lastDate[1]}`,
        startTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        // identityType: 0,不知道是什么参数
        type: 0,
        status: 2,
      };
    },
    handleBillConfirm(row) {
      this.$refs.confirmDialogRef.handleFormDialog("textareaDialog", {
        formModel: {
          selectNum: row.selectNum,
          status: 1,
          ids: row.ids,
        },
        httpRequest: recheckBill,
        successFunction: this.mixinkeepTable,
      });
    },
    handleUpdate(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (e) => e.id
      );
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id: row.id,
          toReview: "20",
          backPath: this.$route.fullPath,
          activeTab: "3", // 1为新增，2为修改，3为详情
          pageSign: idList.join(","),
        },
      });
    },
    onSelectionChange(rows = []) {
      //手动勾选某一行数据
      const row = rows[0] || {};
      this.selectionRows = rows;
      this.$set(this.tabsConfig.btnArr[0], "disabled", !rows.length);
    },
    // selectionRowEvt(row) {
    //   //判断每一行数据是否可勾选
    //   // 选择条件：同一个往来单位/同一个记账主体
    //   //列表条件选择，不满足条件置灰
    //   const rSome = this.selectionRows.some(
    //     (e) =>
    //       e.dealingsCompanyName === row.dealingsCompanyName && //往来单位
    //       e.billingMainName === row.billingMainName && //记账主体
    //       e.type === row.type && //收付类型
    //       e.currencyCode === row.currencyCode //货币类型
    //   );
    //   if (this.selectionRows.length && !rSome) {
    //     return false;
    //   }
    //   return true;
    // },
    handleApproved(row) {
      const params = {
        ...row,
        status: 0,
      };
      this.comRepeatedRequest(this, recheckBill, params).then((res) => {
        this.$message.success("审核通过");
        this.mixinkeepTable();
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
