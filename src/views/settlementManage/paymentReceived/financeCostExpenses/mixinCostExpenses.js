/** 费用报销列表与详情 */

import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import {
  getExpensePayment,
  postCashierRepulse,
  POSTApplyInvoice,
  getSettleExpenseTaskInfo,
} from "@/api/settlementManage/paymentReceived";
import { editInvoiceDialogCols } from "@/views/settlementManage/paymentReceived/invoice/model.js";
import { mapState } from "vuex";
/** 财务付款列表与详情 */
export const mixinPaymentExpenses = {
  data() {
    return {
      rowStatusList: [
        {
          statusBtnArr: [50, 60, 70, 80, 100],
          hasPermission: ["settlementManagement:invoice:numEdit"],
          isCostType: [1],
          text: "修改发票号",
          handleClick: this.handleEditInvoice,
        },
        {
          statusBtnArr: [50],
          text: "分配任务",
          handleClick: this.handleAllocation,
        },
        {
          statusBtnArr: [60],
          text: "待登记",
          handleClick: (row) => this.handleOperation(row, "registerRef"),
        },
        {
          statusBtnArr: [70],
          text: "上传水单",
          handleClick: (row) => this.handleOperation(row, "waterBillRef"),
        },
        {
          statusBtnArr: [80],
          text: "财务核销",
          handleClick: (row) => this.handleOperation(row, "writeOffRef"),
        },
        {
          statusBtnArr: [60, 70, 80, "btnBack"],
          isHideStatusArr: [100, null], //已核销状态
          color: "#FF6767",
          text: "打回",
          handleClick: (row) => this.handleRepulse(row),
        },
      ],
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    // 操作按钮
    handleOperation(row, dlgRef) {
      getExpensePayment({ id: row.id }).then((res) => {
        this.$refs[dlgRef].editShowDlg(res.data, {
          editSuccess: this.editSuccess,
        });
      });
    },
    handleEditInvoice(row) {
      const { invoiceMoney, invoiceNumber, billId } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols(),
        formModel: {
          id: [billId],
          invoiceMoney,
          invoiceNumber,
        },
        httpRequest: POSTApplyInvoice,
        successFunction: this.editSuccess,
      });
    },
    editSuccess() {
      this.mixinkeepTable();
    },
    handleRepulse(row) {
      const { id } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols(),
        formModel: {
          id: [id],
        },
        httpRequest: postCashierRepulse,
        successFunction: () => this.editSuccess("repulse"),
      });
    },
    handleAllocation(row, type) {
      if (row) {
        this.$refs.addDrawer.show(
          [{ ...row, currencyCode: row.currencyId || row.currencyCode }],
          1
        );
      } else if (this.selectionRows.length) {
        this.$refs.addDrawer.show(this.selectionRows, type);
      }
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    DistributionDialog: () =>
      import("../components/financialProcessDialog/distribution.vue"), // 分配
    RegisterDialog: () =>
      import("../components/financialProcessDialog/register.vue"), // 付款登记
    WaterBillDialog: () =>
      import("../components/financialProcessDialog/waterBill.vue"), // 上传水单
    WriteOffDialog: () =>
      import("../components/financialProcessDialog/writeOff.vue"), // 核销
    AddDrawer: () => import("./components/addDrawer"), // 付款分配
    // InvoiceEditDialog: () =>
    //   import("@/views/settlementManage/paymentReceived/components/invoiceEditDialog/index.vue"), // 修改发票信息
  },
};

/** 财务收款列表与详情 */
export const mixinCollectionExpenses = {
  data() {
    return {
      rowStatusList: [
        {
          statusBtnArr: [65],
          text: "收款确认",
          handleClick: (row) => this.handleOperation(row, "confirm"),
        },
        {
          statusBtnArr: [80],
          text: "收款核销",
          handleClick: (row) => this.handleOperation(row, "writeOff"),
        },
        {
          statusBtnArr: ["btnBack"],
          isHideStatusArr: [null], //已核销状态
          color: "#FF6767",
          text: "打回",
          handleClick: (row) => this.handleRepulse(row),
        },
      ],
    };
  },
  methods: {
    // 操作按钮
    handleOperation(row, modelType) {
      this.$refs.editDialogRef.showDialog(row, {
        modelType,
      });
    },
    editSuccess() {
      this.mixinkeepTable();
    },
    handleRepulse(row) {
      const { id } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols(),
        formModel: {
          id: [id],
        },
        httpRequest: postCashierRepulse,
        successFunction: () => this.editSuccess("repulse"),
      });
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    EditCollectionDialog: () => import("../collectionReimbursement/editDialog"),
  },
};
