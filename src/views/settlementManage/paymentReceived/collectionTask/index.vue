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
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="operationClick"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              @handleTableView="(row) => handleDetails(row)"
              :tree-props="{
                children: 'children',
                hasChildren: 'WEB_HAVECHILDREN',
              }"
              :treeLazyLoad="{
                lazy: true,
                load: (row, treeNode, resolve) =>
                  getColsChildren(row, treeNode, resolve),
              }"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AuditDialog ref="auditDialog" />
    <WaterBillDialog ref="waterBillDialog" @handleSuccess="handleSuccess" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import {
  getCashierList,
  postCashierRepulse,
  POSTCashierWriteOff,
  POSTSettleCashierExport,
  GETCashierPreviewAllBr,
  GETCashierPreviewAll,
  GETCashierPreviewBrBatch,
} from "@/api/settlementManage/paymentReceived";
import { mapActions, mapState } from "vuex";
import { searchColumns, taskColumns, writeTaskColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
import { comFileDownload } from "@/utils/download.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  name: "CollectionTask",
  mixins: [mixinColsConf],
  components: {
    AuditDialog: () => import("./components/AuditDialog"),
    WaterBillDialog: () => import("./components/EditDialog/index"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  data() {
    const tabBtnArr = [
      {
        table: "导出",
        icon: "iconfont daochu",
        showTabName: "1",
        hasPermission: ["settlementManage:paymentReceived:export"],
        handleClick: () => this.handleExport(1),
      },
      {
        table: "批量打印",
        showTabName: "2",
        disabled: true,
        handleClick: () => this.handleExport(2),
      },
    ];
    const btnArr = tabBtnArr.filter((e) => {
      const { hasPermission } = e;
      return hasPermission ? hasBtnPermits(hasPermission) : true;
    });
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "收款任务单",
            name: "1",
          },
          {
            label: "已核销",
            name: "2",
          },
        ],
        btnArr: btnArr || [],
      },
      searchFromData: {},
      searchFormConfig: {
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getForBookingList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        labelWidth: "100px",
      },
      mixinTableColArr: [taskColumns, writeTaskColumns],
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            getCashierList(formModel).then((res) => {
              const { rows } = res;
              const data = {
                ...res,
                rows: rows.map((e) => {
                  return {
                    ...e,
                    WEB_HAVECHILDREN:
                      e.isMainBill == 1 || e.isMainBill == 2 ? true : false,
                  };
                }),
              };
              resolve(data);
            });
          });
        },
        statusList: [
          {
            text: "收款确认",
            statusArr: [65],
            isApply: [1, 5],
            costType: [0],
            handleClick: (rows) => this.handleUpdate(rows, "Collection"),
          },
          {
            text: "财务核销",
            isSettleModel: [1],
            statusArr: [80],
            isApply: [1, 5],
            costType: [0],
            handleClick: (rows) => this.handleUpdate(rows, "Verification"),
          },
          {
            text: "预充值核销",
            isSettleModel: [2],
            statusArr: [80],
            isApply: [1],
            costType: [0],
            handleClick: (row) => this.handlePreVerification(row),
          },
          {
            text: "打回",
            color: "#FF6767",
            statusArr: [65, 80, "w_31"],
            isApply: [0, 1, 5],
            costType: [0],
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
      this.searchFromData[1] = {
        taskBy: this.curUserInfo?.userId,
        statusIn: ["65", "80", "56"],
        isApplyInvoiceIn: "1,5",
      };
      this.showSearchForm = true;
    });
    // this.$set(this.tabsConfig, "btnArr", this.tabBtnArr);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getForBookingList(searchFrom = {}) {
      //模糊搜索
      const {
        receiveDate,
        createTime,
        isApplyInvoiceIn,
        timeV,
        DealDate,
        ...searchObj
      } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createBeginTime: createTime && createTime[0],
        createEndTime: createTime && createTime[1],
        startTimeV: timeV && timeV[0],
        endTimeV: timeV && timeV[1],
        startDealDate: DealDate && DealDate[0],
        endDealDate: DealDate && DealDate[1],
        // taskBy: this.tabsConfig.activeName == 1 ? taskBy : undefined,
        isApplyInvoiceIn: Array.isArray(isApplyInvoiceIn)
          ? isApplyInvoiceIn.join(",")
          : undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const { statusIn, taskUserName, deptByName, ...nSearchData } =
        this.searchFromData[activeName] || {};
      return {
        ...nSearchData,
        statusIn: activeName == 1 ? statusIn.join(",") : "100",
        type: "1",
        statusIn0: activeName == 1 ? "100" : undefined,
        isMainBillList: [0, 1, 2],
      };
    },
    getColsChildren(row, treeNode, resolve) {
      const { id } = row;
      const params = {
        parentId: id,
      };
      getCashierList(params).then((res) => {
        resolve(res.rows || res.data || []);
      });
    },
    searchTabForm(tName) {
      var searchType = {
        1: searchColumns.collectionLists,
        2: searchColumns.verificationLists,
      };
      const initSearch = {
        1: {
          taskBy: this.curUserInfo?.userId,
          taskUserName: this.curUserInfo?.userName,
          statusIn: ["65", "80"],
          isApplyInvoiceIn: ["1", "5"],
        },
      };
      return {
        ...this.searchFormConfig,
        ...searchType[tName],
        formModel: initSearch[tName] || {},
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
          settleType: 2,
        },
        httpRequest: postCashierRepulse,
        successFunction: () => {
          this.mixinkeepTable(true);
        },
      });
    },
    handleUpdate(row, type) {
      this.$refs.waterBillDialog.show(row, type);
    },
    handleDetails(row) {
      //详情跳转
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0].tableData.map(
        (e) => e.id && row.costType === e.costType
      );
      if (row.costType === 0) {
        this.$router.push({
          path: "/settlementManagement/paymentReceived/collectionTaskInfo",
          query: {
            id: row.id,
            backPath: this.$route.fullPath,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      } else {
        this.$router.push({
          path: `/settlementManagement/dailyReimbursement/financialReceiptsDetails`,
          query: {
            id: row.id, // 报销单ID
            costType: row.costType,
            pageSource: "financialReceiptsDetails", // 页面来源
            backPath: this.$route.fullPath,
          },
        });
      }
    },
    handleAudit() {
      this.$refs.auditDialog.show();
    },
    onTableSelectionChange(rows = []) {
      // 勾选列表
      const { activeName } = this.tabsConfig;
      this.selectionRows = rows;
      this.$refs[`tableRef${activeName}`][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
      this.tabsConfig.btnArr[1].disabled = !this.selectionRows.length;
    },
    // selectionRowEvt(row) {
    //   // 选择条件：同一个往来单位/同一个记账主体
    //   const rSome = this.selectionRows.some(
    //     (e) =>
    //       e.dealingsCompanyName === row.dealingsCompanyName &&
    //       e.businessCompanyName === row.businessCompanyName
    //   );
    //   if (this.selectionRows.length && !rSome) {
    //     return false;
    //   }
    //   return true;
    // },
    operationClick(row) {
      // 有水单流水显示收款确认
      let tStatus = "-1";
      // 待收款 && 流水号有 -1时 可打回
      if (row.serialCode.includes("-1") && row.status === 55) {
        tStatus = "w_31";
      }
      return this.tableConfig.statusList.filter(
        (e) =>
          (e.statusArr.includes(row.status) || e.statusArr.includes(tStatus)) &&
          (e.isSettleModel
            ? e.isSettleModel.includes(row.settleModel)
            : true) &&
          (e.isApply ? e.isApply.includes(row.isApplyInvoice) : true) &&
          row.isMainBill != 9 &&
          e.costType.includes(row.costType)
      );
    },
    handlePreVerification(row) {
      const { id } = row;
      const params = {
        taskId: id,
      };
      this.$confirm("核销之后核销结束，是否继续", "提示", {
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          POSTCashierWriteOff(params).then((res) => {
            this.mixinkeepTable(true);
          });
        })
        .catch((error) => {
          console.log("取消核销");
        });
    },
    handleExport(activeName) {
      if (activeName == 1) {
        const params = {
          ...this.getQueryParams(),
        };
        comFileDownload(this, POSTSettleCashierExport, params);
      } else if (activeName == 2) {
        // const params={
        //   id:this.selectionRows.map((e)=>e.id)
        // }
        // console.log()
        const ids = this.selectionRows.map((e) => e.id);
        comFileDownload(this, GETCashierPreviewBrBatch, ids);
      }
    },
    handleSuccess() {
      // const { listStatus = undefined,id } = row;
      this.mixinkeepTable(true);
      // if ([65, "65", 80, "80"].includes(listStatus)) {
      //   comFileDownload(this, GETCashierPreviewAllBr, {id});
      // }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
