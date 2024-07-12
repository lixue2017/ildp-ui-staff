<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
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
            <!-- <ComTable
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
              :colShowBtnFn="operationBtn"
            /> -->
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="tableBtnList"
              @handleTableView="(row) => handleDetails(row)"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AuditDialog ref="auditDialog" />
    <WaterBillDialog ref="waterBillDialog" @handleSuccess="handleSuccess" />
    <PayDialog ref="payDialog" @handleSuccess="handleSuccess"></PayDialog>
    <ComCustomDialog ref="customDialogRef" />
    <AddDrawer ref="addDrawer" @handleSuccess="handleSuccess" />
  </div>
</template>

<script>
import {
  getCashierList,
  postCashierRepulse,
} from "@/api/settlementManage/paymentReceived";
import { mapActions, mapState } from "vuex";
import { searchColumns, taskColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
export default {
  name: "PayAllocation",
  mixins: [mixinColsConf],
  components: {
    AuditDialog: () => import("../taskList/components/AuditDialog"),
    WaterBillDialog: () => import("../waterBill/components/EditDialog"),
    PayDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/payDialog/index.vue"
      ),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AddDrawer: () => import("./components/addDrawer"),
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
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: "外部付款",
            name: "1",
          },
          {
            label: "内部付款",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          table: "合并分配",
          disabled: true,
          handleClick: () => {
            if (this.selectionRows.length) {
              const { activeName } = this.tabsConfig;
              this.$refs.addDrawer.show(
                {
                  selectionRows: this.selectionRows,
                  isJoinBs: activeName == 1 ? 0 : 1,
                },
                "WEB_outMerge"
              );
            }
          },
        },
      ],
      searchFromData: {},
      searchFormConfig: {
        formModel: {},
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getForBookingList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        size: "small",
        labelWidth: "100px",
        formRules: {}, // 表单校验规则
      },
      mixinTableColArr: [taskColumns, taskColumns],
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getCashierList,
        statusBtnList: [
          {
            statusBtnArr: [50],
            text: "分配任务",
            handleClick: (row) => {
              const { activeName } = this.tabsConfig;
              this.$refs.addDrawer.show(
                { selectionRows: [row], isJoinBs: activeName == 1 ? 0 : 1 },
                "WEB_outMerge"
              );
              // this.handleSingleAssign(row, "mergeDistribution");
            },
          },
          {
            text: "打回",
            color: "#FF6767",
            statusBtnArr: ["w_31"],
            handleClick: (row) => this.handleRepulse(row),
          },
        ],
      },
      selectionRows: [],
    };
  },
  created() {
    // 默认当前用户
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
    this.$set(this.tabsConfig, "btnArr", this.tabBtnArr);
  },
  deactivated() {
    this.tabBtnArr[0].disabled = true;
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleTabsClick() {
      // const { activeName } = this.tabsConfig;
      // const bArr = activeName === "1" ? this.tabBtnArr : [];
      // this.$set(this.tabsConfig, "btnArr", bArr);
      this.initMixinColumnConf();
      this.onTableSelectionChange([]);
    },
    getForBookingList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createBeginTime: createTime && createTime[0],
        createEndTime: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const { status, taskUserName, deptByName, ...nSearchData } =
        this.searchFromData[activeName] || {};
      return {
        ...nSearchData,
        statusIn: '50',
        type: "0",
        isJoinBs: activeName == 1 ? 0 : 1,
      };
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName),
      };
    },
    handleRepulse(row) {
      //打回
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "账单打回",
          label: "备注：",
          id: "remark",
          rulesKey: "remark",
        }),
        formModel: {
          id: [row.id],
          settleType: 3,
        },
        httpRequest: postCashierRepulse,
        successFunction: this.handleSuccess,
      });
    },
    // handleSingleAssign(row, type) {
    //   //mergeDistribution  分配任务;
    //   const taskInfo = {
    //     id: row.id
    //       ? `${row.id}` // 转为字符串
    //       : this.selectionRows.map((e) => e.id).join(","),
    //     selectLists: row.id ? [row] : this.selectionRows,
    //   };
    //   this.$refs.waterBillDialog.show(taskInfo, type); //waterBillDialog这个组件内的类型判断太多了，尽量不在这个组件里面再做判断了
    // },
    // handleMerge() {
    //   const { activeName } = this.tabsConfig;
    //   if (activeName == 1) {
    //     //外部合并
    //     this.$refs.addDrawer.show(
    //       { selectionRows: this.selectionRows },
    //       "WEB_outMerge"
    //     );
    //   } else if (activeName == 2) {
    //     //内部合并
    //     this.handleSingleAssign({}, "mergeDistribution");
    //   }
    // },
    handleDetails(row) {
      //详情跳转
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0].tableData.map(
        (e) => e.id
      );
      this.$router.push({
        path: "/settlementManagement/paymentReceived/taskInfo",
        query: {
          id: row.id,
          pageStatus: "50", // 详情显示分配按钮
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    onTableSelectionChange(rows = []) {
      const { activeName } = this.tabsConfig;
      const nRows = rows.filter((e) => [50].includes(e.status));
      const row = nRows[0] || {};
      this.selectionRows = nRows.filter(
        (e) =>
          e.currencyCode === row.currencyCode &&
          e.dealingsCompany === row.dealingsCompany &&
          e.businessCompany === row.businessCompany &&
          e.status === 50
      );
      this.$set(
        this.tabsConfig.btnArr[0],
        "disabled",
        !this.selectionRows.length
      );
      this.$refs[`tableRef${activeName}`] &&
        this.$refs[`tableRef${activeName}`][0]?._toggleRowSelectionMixin({
          newCheckRows: this.selectionRows,
        });
    },
    selectionRowEvt(row) {
      if (this.selectionRows.length) {
        const nRow = this.selectionRows[0] || {};
        return (
          nRow.dealingsCompany === row.dealingsCompany &&
          nRow.currencyCode === row.currencyCode &&
          nRow.businessCompany === row.businessCompany &&
          row.status === 50
        );
      }
      return [50].includes(row.status);
    },
    tableBtnList(row) {
      let tStatus = -1;
      // 待分配 && 流水号有 -1时 可打回
      if (row.serialCode.includes("-1") && row.status === 50) {
        tStatus = "w_31";
      }
      return this.tableConfig.statusBtnList.filter((rBtn) => {
        return (
          rBtn.statusBtnArr.includes(row.status) ||
          rBtn.statusBtnArr.includes(tStatus)
        );
      });
    },
    getInitialData() {
      this.tabsConfig.tabs.map((e) => {
        this.searchFromData[e.name] = {
          taskBy: this.curUserInfo?.userId,
          status: "50",
        };
      });
      this.searchFormConfig.formModel = {
        taskBy: this.curUserInfo?.userId,
        taskUserName: this.curUserInfo?.userName,
        status: "50",
      };
      this.showSearchForm = true;
    },
    handleSuccess() {
      this.onTableSelectionChange();
      this.mixinkeepTable();
    },
  },
  activated() {
    this.$set(
      this.tabsConfig.btnArr[0],
      "disabled",
      !this.selectionRows.length
    );
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
