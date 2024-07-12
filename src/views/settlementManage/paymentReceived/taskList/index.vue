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
              :class="`Serial-${tab.name}`"
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              @onSelectionChange="onTableSelectionChange"
              :selectionRow="selectionRowEvt"
              :tree-props="{
                children: 'children',
                hasChildren: 'WEB_HAVECHILDREN',
              }"
              :treeLazyLoad="{
                lazy: true,
                load: (row, treeNode, resolve) =>
                  getColsChildren(row, treeNode, resolve),
              }"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="tableBtnList"
              @handleTableView="(row) => handleDetails(row)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'xuhao'">
                  <span v-if="slotProps.row.isChildren">{{
                    slotProps.row.id
                  }}</span>
                </template>
              </template>
            </ComTable>
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
  getCashierDetail,
  postCashierRepulse,
  postBatchVerification,
  POSTCashierWriteOff,
  POSTBillApplyInvoice,
} from "@/api/settlementManage/paymentReceived";
import { mapActions, mapState } from "vuex";
import { getNowDate, getInterceptChar } from "@/utils/index.js";
import { searchColumns, taskColumns, writeTaskColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { editInvoiceDialogCols } from "@/views/settlementManage/paymentReceived/invoice/model.js";
export default {
  name: "TaskList",
  mixins: [mixinColsConf],
  components: {
    AuditDialog: () => import("./components/AuditDialog"),
    WaterBillDialog: () => import("../waterBill/components/EditDialog"),
    PayDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/taskList/components/payDialog/index.vue"
      ),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AddDrawer: () =>
      import(
        "@/views/settlementManage/paymentReceived/payAllocation/components/addDrawer"
      ),
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
            label: "付款任务单",
            name: "1",
          },
          {
            label: "已核销",
            name: "2",
          },
        ],
      },
      tabBtnArr: [
        {
          table: "批量登记",
          disabled: true,
          handleClick: (rows) => {
            const params = {
              selectionRows: this.selectionRows,
            };
            this.$refs.addDrawer.show(params, "WEB_paymentMerge");
          },
        },
        {
          table: "批量核销",
          disabled: true,
          handleClick: this.handleBatchWriteOff,
        },
      ],
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
        size: "small",
        labelWidth: "100px",
        formRules: {}, // 表单校验规则
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
        statusBtnList: [
          // 50待分配  60待付款  70待上传水单  80待核销   100已核销
          {
            statusBtnArr: [50, 60, 70, 80, 100],
            isActive: ["1", "2"],
            isJoinBs: [0],
            costType: [0],
            hasPermission: ["settlementManagement:invoice:numEdit"],
            text: "修改发票号",
            handleClick: this.handleEditInvoice,
          },
          {
            statusBtnArr: [60],
            isActive: ["1"],
            costType: [0],
            text: "付款登记",
            handleClick: (row) => {
              const params = {
                selectionRows: [row],
              };
              this.$refs.addDrawer.show(params, "WEB_paymentMerge");
            },
          },
          {
            statusBtnArr: [70],
            isActive: ["1"],
            text: "上传水单",
            costType: [0],
            handleClick: (row) => {
              const params = {
                selectionRows: [row],
              };
              this.$refs.addDrawer.show(params, "WEB_uploadWaterBillMerge");
            },
          },
          {
            isSettleModel: [1],
            statusBtnArr: [80],
            isActive: ["1"],
            costType: [0],
            text: "财务核销",
            handleClick: (row) => this.handleUpdate(row, "financiaVerify"),
          },
          {
            text: "预充充值核销",
            isSettleModel: [2],
            statusBtnArr: [80],
            isActive: ["1"],
            costType: [0],
            handleClick: (row) => this.handleUpdate(row, "preVerification"),
          },
          {
            text: "打回",
            color: "#FF6767",
            statusBtnArr: [60, 70, 80, "w_31"],
            isActive: ["1"],
            costType: [0],
            handleClick: (row) => this.handleRepulse(row),
          },
        ],
      },
      selectionRows: [],
      WEBType: "",
    };
  },
  created() {
    // 默认当前用户
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
    this.$set(this.tabsConfig, "btnArr", this.tabBtnArr);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleTabsClick() {
      const { activeName } = this.tabsConfig;
      const bArr = activeName === "1" ? this.tabBtnArr : [];
      this.$set(this.tabsConfig, "btnArr", bArr);
      this.initMixinColumnConf();
    },
    getForBookingList(searchFrom = {}) {
      const { taskBy } = searchFrom;
      const { createTime, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createBeginTime: createTime && createTime[0],
        createEndTime: createTime && createTime[1],
        taskBy: this.tabsConfig.activeName == 1 ? taskBy : undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const { statusIn, taskUserName, deptByName, ...nSearchData } =
        this.searchFromData[activeName] || {};
      const statusIn0 = (statusIn || []).includes("50") ? "100" : "100,50";
      return {
        ...nSearchData,
        statusIn: activeName == 1 ? statusIn : "100",
        type: "0",
        statusIn0: activeName == 1 ? statusIn0 : undefined, //不默认展示
        isMainBillList: [0, 1, 2],
      };
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName),
      };
    },
    handleBatchWriteOff() {
      if (!this.selectionRows.length) {
        return;
      }
      if (this.selectionRows.length === 1) {
        // 单笔核销，返回单个id
        this.handleUpdate(this.selectionRows[0], "financiaVerify");
        return;
      }
      this.comRepeatedRequest(this, postBatchVerification, {
        id: this.selectionRows.map((e) => e.id),
      }).then((res) => {
        this.$refs.waterBillDialog.show(
          {
            ...res.data,
            dealDate: getNowDate("-"),
            isBatch: true,
          },
          "financiaVerify"
        );
      });
    },
    handleRepulse(row) {
      //打回
      const settleTypeObj = {
        80: 1,
        60: 4,
        50: 3,
      };
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "账单打回",
          label: "备注：",
          id: "remark",
          rulesKey: "remark",
        }),
        formModel: {
          id: [row.id],
          settleType: settleTypeObj[row.status], // 区分消息推送
        },
        httpRequest: postCashierRepulse,
        successFunction: () => {
          this.mixinkeepTable(true);
        },
      });
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
    handleUpdate(row, type) {
      // financiaVerify：财务核销;  taskUpload：上传水单;  Verification：核销审核   payment:付款登记
      // if (/financiaVerify|payment|RapUploadWaterBill/.test(type)) {
      if (/financiaVerify|preVerification/.test(type)) {
        if (type === "financiaVerify") {
          const { isMainBill } = row;
          const dealDate = getNowDate("-"); // 水单时间
          this.comRepeatedRequest(this, getCashierDetail, {
            id: row.id,
            dealDate,
          }).then((res) => {
            this.$refs.waterBillDialog.show(
              {
                ...res.data,
                picUrl: res.data.picUrl || [],
                dealDate,
                isBatch: false,
                isMainBill,
              },
              type
            );
          });
        } else if (type == "preVerification") {
          this.$confirm("核销之后核销结束，是否继续", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          })
            .then(() => {
              const { id } = row;
              const params = {
                taskId: id,
              };
              POSTCashierWriteOff(params).then((res) => {
                this.handleSuccess();
              });
            })
            .catch((error) => {
              console.log("取消核销");
            });
        }
        return;
      }
    },
    handleEditInvoice(row) {
      const { invoiceMoney, id, checkNo } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols({ menuType: "taskList" }),
        formModel: {
          taskBillId: [id],
          invoiceMoney,
          invoiceNumber: checkNo,
        },
        httpRequest: POSTBillApplyInvoice,
        successFunction: this.mixinkeepTable,
      });
    },
    handleDetails(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0].tableData
        .filter((e) =>
          row.costType === 0 ? e.costType === 0 : e.costType !== 0
        )
        .map((e) => e.id);
      if (row.costType === 0) {
        this.$router.push({
          path: "/settlementManagement/paymentReceived/taskInfo",
          query: {
            id: row.id,
            // pageStatus: "0,2,3", // 详情状态显示按钮
            backPath: this.$route.fullPath,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      } else {
        this.$router.push({
          path: `/settlementManagement/dailyReimbursement/financialPaymentDetails`,
          query: {
            id: row.id, // 报销单ID
            costType: row.costType,
            pageSource: "financialPaymentDetails", // 页面来源
            backPath: this.$route.fullPath,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      }
    },
    onTableSelectionChange(rows = []) {
      const nRows = rows.filter((e) => [60, 80].includes(e.status));
      if (!nRows.length) {
        this.$set(this.tabsConfig.btnArr[0], "disabled", true);
        this.$set(this.tabsConfig.btnArr[1], "disabled", true);
      }
      const row = nRows[0] || {};
      let tabBtnArrShow = 0;
      switch (row.status) {
        case 60: // 批量付款登记
          this.selectionRows = nRows.filter((e) => e.status === 60);
          tabBtnArrShow = 0;
          break;
        case 80: // 批量核销
          this.selectionRows = nRows.filter(
            (e) =>
              e.currencyCode === row.currencyCode &&
              e.dealingsCompany === row.dealingsCompany &&
              e.accountId === row.accountId &&
              e.status === 80
          );
          tabBtnArrShow = 1;
          break;
        default:
          this.selectionRows = nRows;
          break;
      }

      this.$set(
        this.tabsConfig.btnArr[tabBtnArrShow],
        "disabled",
        !this.selectionRows.length
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]._toggleRowSelectionMixin({ newCheckRows: this.selectionRows });
    },
    selectionRowEvt(row) {
      if (this.selectionRows.length) {
        const nRow = this.selectionRows[0] || {};
        switch (nRow.status) {
          case 60: // 批量付款登记
            return row.status === 60;
          // case 5: // 批量分配
          //   return (
          //     nRow.dealingsCompany === row.dealingsCompany &&
          //     nRow.currencyCode === row.currencyCode &&
          //     row.status === 5
          //   );
          case 80: // 批量核销
            return (
              nRow.dealingsCompany === row.dealingsCompany &&
              nRow.currencyCode === row.currencyCode &&
              nRow.accountId === row.accountId &&
              row.status === 80
            );
          default:
            break;
        }
      }
      return [60, 80].includes(row.status);
    },
    // operationBtn(bItem, row) {
    //   let tStatus = -1;
    //   // 待分配 && 流水号有 -1时 可打回
    //   if (row.serialCode.includes("-1") && row.status === 5) {
    //     tStatus = 'w_31';
    //   }
    //   return (
    //     bItem.statusBtnArr.includes(row.status) ||
    //     bItem.statusBtnArr.includes(tStatus)
    //   );
    // },
    tableBtnList(row) {
      const { activeName } = this.tabsConfig;
      let tStatus = "-1";
      if (row.serialCode.includes("-1") && row.status === 50) {
        tStatus = "w_31";
      }
      // if ([60, 70, 80].includes(row.status)) {
      //   tStatus = "w_31";
      // }
      // const repulseNum=getInterceptChar(row.serialCode,'-','number');
      // if([50,60,70,80].includes(row.status)&&repulseNum>1){
      //   tStatus='-1'
      // }
      return this.tableConfig.statusBtnList.filter((rBtn) => {
        const {
          isSettleModel,
          statusBtnArr,
          isActive,
          hasPermission,
          isJoinBs,
          costType,
        } = rBtn;
        return (
          (statusBtnArr.includes(row.status) ||
            statusBtnArr.includes(tStatus)) &&
          (isSettleModel ? isSettleModel.includes(row.settleModel) : true) && //结算模式
          row.isMainBill != 9 && //非子单
          isActive.includes(activeName) && //标签
          (hasPermission ? hasBtnPermits(hasPermission) : true) && //角色权限
          (isJoinBs ? isJoinBs.includes(row.isJoinBs) : true) &&
          costType.includes(row.costType)
        );
      });
    },
    // handleBatchPay(row) {
    //   var selectLists = [];
    //   if (this.selectionRows.length) {
    //     selectLists = this.selectionRows;
    //   } else {
    //     selectLists.push(row);
    //   }
    //   const taskInfo = {
    //     id: row
    //       ? JSON.stringify(row.id)
    //       : this.selectionRows.map((e) => e.id).join(","),
    //     selectLists: selectLists,
    //   };
    //   this.$refs.payDialog.show(taskInfo);
    // },
    getInitialData() {
      this.searchFromData[1] = {
        taskBy: this.curUserInfo?.userId,
      };
      this.searchFormConfig.formModel = {
        taskBy: this.curUserInfo?.userId,
        taskUserName: this.curUserInfo?.userName,
      };
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.tabsConfig.tabs.map((e) => {
      //     if (e.name == 1) {
      //       this.searchFromData[e.name] = {
      //         taskBy: this.curUserInfo?.userId,
      //         taskUserName: this.curUserInfo?.userName,
      //       };
      //     }
      //     this.searchFromData[e.name] = {
      //       ...(this.searchFromData[e.name] || {}),
      //       deptBy: res.id,
      //       deptByName: `${res.code}[${res.shortName}]`,
      //     };
      //   });
      //   this.showSearchForm = true;
      // });
    },
    handleSuccess() {
      this.onTableSelectionChange();
      this.mixinkeepTable();
    },
  },
  deactivated() {
    // this.isMixinDeactivated=false,//重新进入该页面的时候列表不刷新保留用户展开的任务单列表
    this.tabBtnArr[0].disabled = true;
    this.tabBtnArr[1].disabled = true;
    // this.tabBtnArr[2].disabled = true;
  },
  // activated() {
  //   const {isRefresh}=this.$route.query
  //   if (this.isMixinDeactivated||isRefresh) {
  //     //从详情打回要刷新列表，从其他页面返回不要刷新列表
  //     this.mixinkeepTable(isRefresh);
  //   }
  // },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .Serial-1 {
    // 序号样式
    .el-table__row--level-1 {
      .el-table_1_column_2 {
        .cell {
          padding-left: 15px;
          padding-right: 5px;
        }
      }
      .el-table__indent,
      .el-table__placeholder {
        display: none;
      }
    }
  }
  .el-table__row--level-1 {
    .el-checkbox {
      display: none;
    }
  }
}
</style>
