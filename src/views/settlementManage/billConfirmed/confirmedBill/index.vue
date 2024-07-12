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
import { tableColumns, historyTableColumns, searchColumns } from "./model";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinBatchBill } from "../comMixins/mixinBatch.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
export default {
  name: "ConfirmedBill",
  mixins: [mixinColsConf, mixinBatchBill],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"), //mixin批量有使用到
    RecordDrawer: () =>
      import(
        "@/views/settlementManage/statementManage/billManage/components/recordDrawer"
      ),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  computed: {
    ...mapState({
      dictionary: (state) => state.dictionary,
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        type: "0",
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: "待审核付款单",
            name: "1",
          },
          {
            label: "历史付款记录",
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
            text: "付款记录",
            tabName: "2",
            btnType: "btn_record",
            handleClick: (row) => {
              this.$refs.recordRef?.show(row.id, 0);
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
      //   console.log("res", res);
      //   this.tabsConfig.tabs.map((e) => {
      //     this.searchFromData[e.name] = {
      //       taskBy: this.curUserInfo?.userId,
      //       taskByName: this.curUserInfo?.userName,
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
        startTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tabNum) {
      const { ...nObj } = this.searchFromData[tabNum] || {};
      return {
        ...nObj,
        type: 0,
        statusList: ["1", "2,3,20,30"][tabNum - 1],
        // identityType: 0,不知道是什么参数
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
        this.handleDetails(row.id, idList.join(","));
      }
    },
    handleDetails(id, pageSign) {
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id,
          toReview: "10", // 审核详情页，操作后不显示复核按钮
          activeTab: "3", // 1为新增，2为修改，3为详情
          backPath: this.$route.fullPath,
          pageSign, // 详情显示上一页/下一页
        },
      });
    },
    getOperationBtn(tName, row) {
      let showBtnArr = [];
      if (tName === "2") {
        if (!!row.serialCode) {
          showBtnArr.push("btn_record");
        }
        if (row.status === 20 && !row.verificationMoney) {
          // 不是待核销或已部分核销不可撤回
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
