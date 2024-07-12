import { operationBtn, changeReviewedCols } from "../components/model";
import {
  submitBill,
  deleteBillDetail,
  cancelBillSubmission,
  postBillUpdReviewedBy,
} from "@/api/settlementManage/statementManage";
import { msgTipBox } from "@/utils/confirmBox.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { mapState } from "vuex";
import { editInvoiceDialogCols } from "@/views/settlementManage/paymentReceived/invoice/model.js";
import { POSTBillApplyInvoice } from "@/api/settlementManage/paymentReceived.js";
import { getStreamFileDownload } from "@/utils/zipdownload";

export const mixinPayment = {
  data() {
    return {
      isBatchDownloadChecked: false,
      billDownloadLists: [
        { label: "中文账单", type: "0" },
        { label: "香港账单", type: "1" },
        { label: "英文账单", type: "2" },
      ],
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    handleSubmit(row) {
      submitBill({ id: row.id }).then(() => {
        this.$message.success("提交成功");
        this.mixinkeepTable();
        this.onTableSelectionChange([]);
      });
    },
    cancelSubmission(row) {
      msgTipBox(this, { title: "提示", msg: "确定撤销？" }, () => {
        cancelBillSubmission(row.id).then(() => {
          this.$message.success("撤销成功");
          this.mixinkeepTable();
        });
      });
    },
    handleDelete(row) {
      this.$refs.confirmDialog.delete().then(() => {
        deleteBillDetail(row.id).then(() => {
          this.$message.success("删除成功");
          this.mixinkeepTable();
        });
      });
    },
    handleReviewedBy(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: changeReviewedCols(),
        formModel: {
          id: row.id,
          taskBy: row.taskBy,
          taskByName: row.taskByName,
        },
        httpRequest: postBillUpdReviewedBy,
        successFunction: this.mixinkeepTable,
      });
    },
    handleEditInvoice(row) {
      const { invoiceMoney, id, checkNo } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: editInvoiceDialogCols(),
        formModel: {
          id: [id],
          invoiceMoney,
          invoiceNumber: checkNo,
        },
        httpRequest: POSTBillApplyInvoice,
        successFunction: this.mixinkeepTable,
      });
    },
    getOperationBtn(row, str) {
      // status  0草稿   1待对账   2复核中   4已驳回   11待认领   20待核销   30已核销
      const { createId, isJoinBs, type } = row;
      const { userId } = this.curUserInfo;
      let nOperationBtn = operationBtn.filter(
        (e) =>
          (e.statusBtnArr ? e.statusBtnArr.includes(row.status) : true) &&
          ((e.hasPermission ? hasBtnPermits(e.hasPermission) : true) ||
            createId == userId) && //角色权限或创建人
          (e.isJoinBs ? e.isJoinBs.includes(isJoinBs) : true) && //1双向  0非双向
          (e.isType ? e.isType.includes(type) : true) &&
          (e.isBankReceiptState
            ? e.isBankReceiptState.includes(row.bankReceiptState)
            : true) &&
          (e.serialStausArr
            ? e.serialStausArr.includes(row.serialStaus)
            : true) &&
          (e.type !== "paymentReceiptClaim" || row.serialStaus >= 70)
      );
      if (row.serialCode) {
        nOperationBtn.push({
          text: `${str}款记录`,
          type: "collectRecord",
        });
      }
      return nOperationBtn;
    },
    handleBillBatchDownload(viewType) {
      // 批量下载
      if (!this.selectionRows.length) {
        this.msgError("请先勾选单号信息与批量下载");
      } else {
        const opt = this.selectionRows.map((e) => ({
          billId: e.id,
          businessCompany: e.businessCompany,
          viewType,
          orderType: e.orderType,
        }));
        getStreamFileDownload("postBatchBillDownloadUrl", opt, {
          method: "post",
        });
      }
    },
    handleBillBatchPayment() {
      getStreamFileDownload(
        "postBatchPaymentDownloadUrl",
        this.selectionRows.map((e) => e.id),
        {
          method: "post",
        }
      );
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
  },
};
