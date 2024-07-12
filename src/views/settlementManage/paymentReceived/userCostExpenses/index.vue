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
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
              :rowOperationBtnListFn="getOperationList"
              :tree-props="{
                children: 'children',
                hasChildren: 'hasChildren',
              }"
              :treeLazyLoad="{
                lazy: true,
                load: getColsChildren,
              }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'billNo'">
                  <span
                    class="primary-text-btn"
                    @click="
                      handleView(slotProps.row, 'id', 'userCostExpensesPage')
                    "
                  >
                    {{ slotProps.row.billNo }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <addDialog
      ref="dialog"
      :expenseInit="expenseInit"
      @handleSuccess="mixinkeepTable"
    />
    <ConfirmDialog ref="confirmDialog" />
    <ComCustomDialog ref="customDialogRef" />
    <PayOffsetDialog ref="PayOffsetDialogRef" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { userCostExpenses } from "@/views/settlementManage/paymentReceived/components/model.js";
import mixinExpenses from "@/views/settlementManage/paymentReceived/components/mixinExpenses.js";
import { editInvoiceDialogCols } from "@/views/settlementManage/paymentReceived/invoice/model.js";
import {
  POSTApplyInvoice,
  GETOffsetRecord,
} from "@/api/settlementManage/paymentReceived.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { remarkDialogCols } from "@/views/components/ConfirmDialog/customFormDialog/model.js";
import {
  myCostExpenseList,
  getExpenseInit,
  deleteSettleExpense,
  checkSettleExpense,
  postMyCostWithdraw,
} from "@/api/settlementManage/paymentReceived";
import { postExpenseAudit } from "@/api/settlementManage/paymentReceived";
import { accumulationFn } from "@/utils/instructions.js";
export default {
  name: "UserCostExpenses",
  mixins: [mixinColsConf, mixinExpenses],
  components: {
    addDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/components/addCostDialog/index.vue"
      ),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    PayOffsetDialog: () => import("../components/payOffsetDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "我的费用报销",
            name: "1",
          },
          {
            label: "挂账单",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "新增报销",
            handleClick: () => {
              this.$refs.dialog.show();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        residueCols: [2],
        searchColsHeight: true,
        fold: true,
        labelWidth: "85px",
        lists: userCostExpenses.search,
      },
      searchFromData: [],
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: myCostExpenseList,
        statusList: [
          //草稿--0  待审核--1  待销账--5  已核销--6  已驳回--7
          {
            statusBtnArr: [0, 7],
            text: "提交",
            handleClick: this.handleCheck,
          },
          {
            statusBtnArr: [0, 7],
            text: "修改",
            handleClick: (row) => {
              this.$refs.dialog.show(row);
            },
          },
          {
            // 1.非草稿，已驳回，2.创建人和财务可见   3.仅发票信息修改，
            statusBtnArr: [1, 6, 20, 21, 22, 23, 24, 30, 31, 32],
            typeArr: [1],
            hasPermission: ["settlementManagement:invoice:numEdit"],
            text: "修改发票号",
            handleClick: this.handleEditInvoice,
          },
          {
            statusBtnArr: [1, 6, 20, 21, 22, 23, 24, 30, 31, 32],
            text: "复制",
            hideFlowType: [4],
            handleClick: (row) => {
              this.$refs.dialog.show(row, "copy");
            },
          },
          {
            typeArr: [2],
            statusBtnArr: [5],
            text: "借款抵消",
            handleClick: (row) => {
              this.handleOffset(row);
            },
          },
          {
            statusBtnArr: [1],
            showActive: ["2"],
            text: "确认",
            handleClick: (row) => {
              this.handleConfirm(row);
            },
          },
          {
            statusBtnArr: [0, 7],
            text: "删除",
            color: "#FF6767",
            handleClick: this.handleDelete,
          },
          {
            statusBtnArr: [1],
            text: "撤回", // 草稿的下一个状态可撤回到草稿状态
            color: "#FF6767",
            handleClick: (r) => this.handleWithdraw(r),
          },
        ],
      },
      expenseInit: {},
      mixinTableColArr: [
        userCostExpenses.columnConfigFirst,
        userCostExpenses.columnConfigSecond,
      ],
    };
  },
  mounted() {
    getExpenseInit().then((res) => {
      this.expenseInit = res.data;
    });
  },
  created() {
    this.searchFromData[1] = {
      createId: this.curUserInfo?.userId,
      createByName: this.curUserInfo?.userName,
    };
    this.searchFromData[2] = {
      taskBySearch: this.curUserInfo?.userId,
      taskByName: this.curUserInfo?.userName,
    };
  },
  methods: {
    getInitialData() {
      this.showSearchForm = true;
    },
    getSearchFormConfig(tab) {
      return {
        ...this.searchFormConfig,
        formModel: this.searchFromData[tab],
        lists: [userCostExpenses.search, userCostExpenses.searchGZD][tab - 1],
      };
    },
    handleWithdraw(row) {
      customMessageBox(
        this,
        {
          msgTitle: "提示",
          msgTxt1: "",
          msgTxt2: "确认是否撤回?",
          httpMsgRequest: () =>
            postMyCostWithdraw({
              id: row.id,
              remark: "",
            }),
        },
        () => {
          this.mixinkeepTable();
        }
      );
    },
    handleDelete(row) {
      this.$refs.confirmDialog.delete().then(() => {
        deleteSettleExpense(row.id).then(() => {
          this.$message.success("删除成功");
          this.mixinkeepTable();
        });
      });
    },
    handleCheck({ id, type }) {
      this.comRepeatedRequest(this, checkSettleExpense, { id }).then(() => {
        this.$message.success("提交成功");
        this.mixinkeepTable();
      });
    },
    handleConfirm(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "账单审核",
          label: "备注：",
          id: "remark",
        }),
        formModel: {
          status: 5, // 默认通过
          expenseBillId: row.id,
        },
        httpRequest: postExpenseAudit,
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
    handleEditInvoice(row) {
      const { invoiceMoney, invoiceNumber, id } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols(),
        formModel: {
          id: [id],
          invoiceMoney,
          invoiceNumber,
        },
        httpRequest: POSTApplyInvoice,
        successFunction: () => this.mixinkeepTable(),
      });
    },
    handleOffset(row = {}) {
      const { id } = row;
      GETOffsetRecord(id).then((res) => {
        const { rows: offsetInfos = [] } = res;
        const params = {
          offsetMoney: 0,
          offsetMoneyHistory: accumulationFn(
            offsetInfos.map((e) => e.totalMoney)
          ), //抵消历史总金额
          isDisabled: false,
          offsetInfos,
        };
        this.$refs.PayOffsetDialogRef.show(row, params);
      });
    },
    getQueryParams(tName) {
      const { tabs, activeName } = this.tabsConfig;
      const isMultiple = tabs.length > 1;
      const params = {
        ...(isMultiple && (tName || tName == 0)
          ? this.searchFromData[tName]
          : this.searchFromData),
        tab: activeName,
      };
      return params;
    },
    getColsChildren(row, treeNode, resolve) {
      const { id } = row;
      const params = {
        parentId: id,
      };
      myCostExpenseList(params).then((res) => {
        resolve(
          (res.rows || res.data || []).map((item) => {
            item.status = null;
            return item;
          })
        );
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
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
}
</style>
