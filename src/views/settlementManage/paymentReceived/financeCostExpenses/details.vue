<template>
  <div>
    <!-- 我的、审核 详情页 -->
    <ViewDetails ref="detailsRef">
      <template v-slot:footerBtn="{ btnInfo }">
        <template v-for="(fBtn, index) in reviewFootBtn">
          <el-button
            @click="() => fBtn.handleClick(btnInfo)"
            :key="`f_${index}`"
            v-if="rShowFooterBtn(fBtn, btnInfo)"
          >
            {{ fBtn.text }}
          </el-button>
        </template>
      </template>
    </ViewDetails>
    <ExamineConfirmDlg ref="examineConfirmRef" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { checkSettleExpense } from "@/api/settlementManage/paymentReceived";
import { costExamineMixin } from "../reviewCostExpenses/examineMixin.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import {editInvoiceDialogCols} from "@/views/settlementManage/paymentReceived/invoice/model.js"
import { POSTApplyInvoice } from "@/api/settlementManage/paymentReceived.js";
export default {
  mixins: [costExamineMixin],
  data() {
    return {
      reviewFootBtn: [
        {
          //发票修改，
          statusBtnArr: [1, 6, 21, 22, 23, 24, 31, 32],//非草稿，已驳回
          pageSourceArr: ["userCostExpensesPage"],//我的费用报销
          typeArr: [1],//付款申请
          hasPermission: ["settlementManagement:invoice:numEdit"],
          text: "修改发票号",
          handleClick: this.handleEditInvoice,
        },
				{
          text: "提 交",
          statusBtnArr: [0, 7],
          handleClick: (row) => this.handleCheck(row),
        },
        {
          text: "确 认",
          auditStatus: [1],
          handleClick: (row) => this.handleMixinExamine(row, "5"),
        },
        {
          text: "打 回",
          auditStatus: [1],
          handleClick: (row) => this.handleMixinExamine(row, "9"),
        },
      ],
    };
  },
  methods: {
    successExamine() {
      // mixin中审核完成刷新页面
      this.$refs.detailsRef.getDetailsInfo();
    },
		handleCheck({ id, type }) {
      this.comRepeatedRequest(this, checkSettleExpense, { id }).then(() => {
        this.msgSuccess("提交成功");
        this.successExamine();
      });
    },
    handleEditInvoice(row){
      const {invoiceMoney,invoiceNumber,id}=row
			this.$refs.customDialogRef.showCustomDialog({
				customFormConfig: editInvoiceDialogCols(),
				formModel: {
					id: [id],
          invoiceMoney,
          invoiceNumber
				},
				httpRequest: POSTApplyInvoice,
				successFunction: this.successExamine,
			})
    },
    rShowFooterBtn(fBtn, row) {
      const {applicant}=row
      const {userId}=this.curUserInfo
      const { pageSource } = this.$route.query;
      if (pageSource === "reviewCostExpensesPage") {
				// 财务审核列表详情显示按钮
				return fBtn.auditStatus ? !fBtn.auditStatus.includes(row.isAudit) : false;
      } else if (pageSource === 'userCostExpensesPage'){
				// 我的费用报销详情
				return (fBtn.statusBtnArr ? fBtn.statusBtnArr.includes(row.status) : false)&&
        (fBtn.pageSourceArr?fBtn.pageSourceArr.includes(pageSource):true)&&
        (fBtn.typeArr?fBtn.typeArr.includes(row.type):true)&&
        ((fBtn.hasPermission ? hasBtnPermits(fBtn.hasPermission) : true) || applicant == userId)//符合角色权限或创建人是自己
			}
			return false;
    },
  },
  components: {
    ViewDetails: () => import("./components/viewDetails"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style lang="scss" scoped>
</style>
