<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
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
              :getQueryParams="() => getQueryParams(tab.name)"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="(row) => getOperationBtn(tab.name, row)"
              @handleTableView="handleUpdate"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDialogRef" />
    <RecordDrawer ref="recordRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  getBillList2,
  postWithdrawBill,
} from "@/api/settlementManage/statementManage";
import { searchColumns, tableColumns, historyTableColumns } from "./model";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinBatchBill } from "../comMixins/mixinBatch.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
export default {
  name: "CustomerBill",
  mixins: [mixinColsConf, mixinBatchBill],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    RecordDrawer: () =>
      import(
        "@/views/settlementManage/statementManage/billManage/components/recordDrawer"
      ),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        type: "1",
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: "待确认收款单",
            name: "1",
          },
          {
            label: "已确认收款单",
            name: "2",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        columnMultiples: 2,
        residueCols: [2, 2],
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "90px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 320px)",
        httpRequest: getBillList2,
        statusList: [
          // {
          //   text: "账单审核",
          //   tabName: "1",
          //   handleClick: this.handleBillConfirm,
          // },
          {
            text: "确认",
            tabName: "1",
            handleClick: (row) => {
              this.handleBillConfirm(row, "0");
            },
          },
          {
            text: "打回",
            tabName: "1",
            color: "#FF6767",
            handleClick: (row) => {
              this.handleBillConfirm(row, "1");
            },
          },
          {
            text: "收款记录",
            tabName: "2",
            btnType: "btn_record",
            handleClick: (row) => {
              this.$refs.recordRef?.show(row.id, 1);
            },
          },
          {
            text: "撤回",
            tabName: "2",
            color: "#FF6767",
            btnType: "btn_withdraw",
            handleClick: (row) => {
              customMessageBox(
                this,
                {
                  msgTitle: "撤回提示",
                  msgTxt1: "撤回不可逆",
                  httpMsgRequest: () => postWithdrawBill({ id: [row.id] }),
                },
                () => {
                  this.msgSuccess("操作成功");
                  this.mixinkeepTable();
                }
              );
            },
          },
        ],
      },
      mixinTableColArr: [tableColumns, historyTableColumns],
    };
  },
  created() {
    // 默认当前用户
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitialData() {
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.tabsConfig.tabs.map((e) => {
      //     this.searchFromData[e.name] = {
      //       taskBy: this.curUserInfo?.userId,
      //       taskUserName: this.curUserInfo?.userName,
      //       businessCompany: res.id,
      //       businessCompanyName: `${res.code}[${res.shortName}]`,
      //     };
      //   });
      //   this.showSearchForm = true;
      // });
    },
    getList(searchFrom = {}) {
      const { createTime, lastDate, undefined, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        // createTime: createTime && `${createTime[0]}@${createTime[1]}`,
        lastDate: lastDate && `${lastDate[0]}@${lastDate[1]}`,
        startTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tabNum) {
      const { taskUserName, businessCompanyName, ...nSearchData } =
        this.searchFromData[tabNum] || {};
      return {
        ...nSearchData,
        // identityType: 1,不知道是什么参数
        type: 1,

        statusList: ["1", "2,3,20,30"][tabNum - 1],
      };
    },
    handleUpdate(row = {}, col) {
      if (col.prop === "joinBillNo") {
        this.handleDetails(row.joinBillId, "");
      } else {
        const { activeName } = this.tabsConfig;
        const idList = this.$refs[`tableRef${activeName}`][0].tableData.map(
          (e) => e.id
        );
        this.handleDetails(row.id, idList.join(","), "10");
      }
    },
    handleDetails(id, pageSign, toReview) {
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id,
          toReview, // 10-显示账单审核
          backPath: this.$route.fullPath,
          pageSign, // 详情显示上一页/下一页
          activeTab: "3", // 1为新增，2为修改，3为详情
        },
      });
    },
    getOperationBtn(tName, row) {
      let showBtnArr = [];
      if (tName === "2") {
        if (!!row.serialCode) {
          showBtnArr.push("btn_record");
        }
        if (
          [11, 20].includes(row.status) &&
          !row.verificationMoney &&
          !row.underwayVerificationMoney
        ) {
          // 不是待认领、待核销或已部分核销/核销中不可撤回
          showBtnArr.push("btn_withdraw");
        }
      }
      return this.tableConfig.statusList.filter(
        (e) =>
          e.tabName === tName &&
          (e.btnType ? showBtnArr.includes(e.btnType) : true)
      );
    },
    getSearchFormConfig(tab) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tab),
        formModel: {},
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
