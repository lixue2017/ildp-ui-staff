import request from "@/utils/request";
import qs from "qs";

// 查询财务报销单列表
export function getExpenseList(params) {
  return request({
    url: "/settle/accounts/expense/list",
    method: "get",
    params,
  });
}

// 创建财务报销单
export function addExpense(data) {
  return request({
    url: "/settle/accounts/expense",
    method: "post",
    data,
  });
}

// 编辑财务报销单
export function updateExpense(data) {
  return request({
    url: "/settle/accounts/expense",
    method: "put",
    data,
  });
}

// 财务报销单详情
export function getExpenseDetail(id) {
  return request({
    url: `/settle/accounts/expense/${id}`,
    method: "get",
  });
}

// 审核财务报销单
export function auditExpense(data) {
  return request({
    url: `/settle/accounts/expense/audit/${data.status}/${data.id}`,
    method: "post",
    data,
  });
}

// 删除财务报销单
export function deleteExpense(id) {
  return request({
    url: `/settle/accounts/expense/${id}`,
    method: "delete",
  });
}

// 查询收付款任务单详情
// export function getPayList(id) {
//   return request({
//     url: `/settle/cashier/${id}`,
//     method: 'get'
//   })
// }

// 收付款任务单-操作记录
export function getOperatorInfo(data) {
  return request({
    url: "/settle/cashier/operatorInfo",
    method: "post",
    data,
  });
}

// 收付款任务单-历史收付款记录
export function getBankReceiptRecord(data) {
  return request({
    url: "/settle/cashier/bankReceiptRecord",
    method: "post",
    data,
  });
}

// 收付款信息详情
export function getCashierInfo(id) {
  return request({
    url: `/settle/cashier/getInfo/${id}`,
    method: "get",
  });
}

// 收款确认详情&收款审核详情
export function getCashierPayee(id, data) {
  return request({
    url: `/settle/cashier/payee/${id}`,
    method: "post",
    data,
  });
}
// 收款确认详情&收款审核详情
export function getMoneyRemainRMB(data) {
  return request({
    url: `/settle/cashier/payee`,
    method: "post",
    data,
  });
}
// 付款登记
export function paymentCheckin(data) {
  return request({
    url: "/settle/cashier/spending/check",
    method: "put",
    data,
  });
}

// 付款核销登记
export function payVerifyCheckIn(data) {
  return request({
    url: "/settle/cashier/spending/verification",
    method: "put",
    data,
  });
}

// 付款核销打回
export function payVerifyBack(data) {
  return request({
    url: "/settle/cashier/spending/verification/backto",
    method: "put",
    data,
  });
}

// 收款核销登记
export function reciptVerifyCheckIn(data) {
  return request({
    url: "/settle/cashier/income/verification",
    method: "put",
    data,
  });
}

// 收款核销打回
export function reciptVerifyBack(data) {
  return request({
    url: "/settle/cashier/income/verification",
    method: "put",
    data,
  });
}
// --------------------------------------------------------调完删除
// 发票列表
export function getInvoiceList(params) {
  return request({
    url: "/settle/invoice/list",
    method: "get",
    params,
  });
}

// 创建发票
export function addInvoice(data) {
  return request({
    url: "/settle/invoice",
    method: "post",
    data,
  });
}

// 发票币别
export function getInvoiceCurrency(data) {
  return request({
    url: "/settle/invoice/currency/list",
    method: "post",
    data,
  });
}

// 发票添加相关费用
export function postInvoiceBill(data) {
  return request({
    url: "/settle/record/getMakeOutInvoiceAccountBill",
    method: "post",
    data,
  });
}

// 修改发票
export function updateInvoice(data) {
  return request({
    url: "/settle/invoice",
    method: "put",
    data,
  });
}
// 发票审核
export function examineInvoice(id) {
  return request({
    url: `/settle/invoice/audit/${id}`,
    method: "put",
  });
}

// 发票详情
export function getInvoiceDetails(id) {
  return request({
    url: `/settle/invoice/${id}`,
    method: "get",
  });
}

// 删除发票
export function deleteInvoiceList(id) {
  return request({
    url: `/settle/invoice/${id}`,
    method: "delete",
  });
}

// 申请开票(默认开票人)
export function getInvoiceDrawer(data) {
  return request({
    url: "/settle/invoice/init/drawer",
    method: "post",
    data,
  });
}

// 申请开票(默认业务员)
export function getInvoiceSalesman(data) {
  return request({
    url: "/settle/invoice/init/salesman",
    method: "post",
    data,
  });
}

// 申请开票(默认复核人)
export function getInvoiceReviewer(data = {}) {
  return request({
    url: "/settle/invoice/init/reviewer",
    method: "post",
    data,
  });
}

// 申请开票(根据账单id获取发票分录)
export function getJournal(data) {
  return request({
    url: "/settle/journal/apply",
    method: "post",
    data,
  });
}

// 发票详情(根据发票id获取发票分录)
export function getJournalDetails(data) {
  return request({
    url: "/settle/journal/list",
    method: "post",
    data,
  });
}

// 申请开票(根据账单id获取明细开票记录信息)
export function getInvoicingRecord(data) {
  return request({
    url: "/settle/record/apply",
    method: "post",
    data,
  });
}

// 申请开票(发票金额合计、转大写)
export function invoiceAmountInWords(data) {
  return request({
    // url: '/settle/invoice/amountInWords',
    url: "/settle/invoice/getInvoiceMoney",
    method: "post",
    data,
  });
}

// 提交发票
export function postInvoiceCheck(data) {
  return request({
    url: "/settle/invoice/check",
    method: "post",
    data,
  });
}

// 发票详情(根据发票id获取明细开票记录信息)
export function getInvoiceRecordList(data) {
  return request({
    url: "/settle/record/list",
    method: "post",
    data,
  });
}

// 发票详情(根据发票id获取开票小计)
export function getInvoicingSubtotal(data) {
  return request({
    url: "/settle/record/subtotal",
    method: "post",
    data,
  });
}

// 开票详情
export function invoiceApplyDetails(data) {
  return request({
    url: "/settle/invoice/apply/search",
    method: "post",
    data,
  });
}

// 开票
export function setInvoiceApply(data) {
  return request({
    url: "/settle/invoice/apply",
    method: "post",
    data,
  });
}

// 发票驳回
export function postInvoicingReject(data) {
  return request({
    url: "/settle/invoice/reject",
    method: "post",
    data,
  });
}

// 发票作废
export function postInvoicingVoid(data) {
  return request({
    url: "/settle/invoice/cancellation",
    method: "post",
    data,
  });
}

// ---------------------
// 水单列表
export function getReceiptList(params) {
  return request({
    url: "/settle/bank/receipt/list",
    method: "get",
    params,
  });
}

// 水单认领列表
export function getReceiptClaimList(params) {
  return request({
    url: "/settle/bank/receipt/claim/list",
    method: "get",
    params,
  });
}

// 水单撤回
export function postBankCallback(data) {
  return request({
    url: "/settle/bank/receipt/callback",
    method: "post",
    data,
  });
}

// 新增水单
export function addWaterBill(data) {
  return request({
    url: `/settle/bank/receipt`,
    method: "post",
    data,
  });
}

// 佰信核销-付款
export function postBxReceiptVerification(data) {
  return request({
    url: `/settle/bank/receipt/verification/bx`,
    method: "post",
    data,
  });
}

// 修改水单
export function updateWaterBill(data) {
  return request({
    url: "/settle/bank/receipt",
    method: "put",
    data,
  });
}

// 删除发票
export function deleteWaterBill(id) {
  return request({
    url: `/settle/bank/receipt/${id}`,
    method: "delete",
  });
}

// 佰信核销
export function postBxVerification(data) {
  return request({
    url: `/settle/bank/receipt/verification/bx`,
    method: "post",
    data,
  });
}

// 水单认领
export function waterBillClaim(data) {
  return request({
    url: "/settle/bank/receipt/claim",
    method: "post",
    data,
  });
}

// 根据ID查对账单
export function getAccountStatementById(id) {
  return request({
    url: `/settle/cashier/getStatement/${id}`,
    method: "get",
  });
}

// 水单审核
export function waterBillExamine(auditType, id, data) {
  return request({
    url: `/settle/bank/receipt/audit/${auditType}/${id}`,
    method: "post",
    data,
  });
}

// 水单详情
export function getWaterBillDetail(id) {
  return request({
    url: `/settle/bank/receipt/${id}`,
    method: "get",
  });
}

// 收付款任务单
export function getCashierList(data) {
  return request({
    // url: '/settle/cashier/list',
    url: "/settle/cashier/getTaskList",
    method: "post",
    data,
    // params
  });
}

// 收付款打回
export function postCashierRepulse(data) {
  return request({
    url: "/settle/cashier/callback",
    method: "post",
    data,
  });
}

// 根据首付任务单ID查询对应的对账单
export function getStatementById(id) {
  return request({
    url: `/settle/cashier/getStatement/${id}`,
    method: "get",
  });
}

// 修改首付款账单
export function editCashier(data) {
  return request({
    url: "/settle/cashier",
    method: "put",
    data,
  });
}

// 收付款上传水单
export function addCashierReceipt(data) {
  return request({
    url: `/settle/cashier/receipt`,
    method: "post",
    data,
  });
}

//发票审核
export function invoiceExamine(data) {
  return request({
    url: `/settle/invoice/audit/${data.status}/${data.id}`,
    method: "post",
    data,
  });
}

// 收付款任务单 -> 财务核销详情/获取水单图片
export function getCashierDetail(data) {
  const { id, ...params } = data || {};
  return request({
    url: `/settle/cashier/payment/${id}`,
    method: "get",
    params,
  });
}

// 收付款任务单 -> 批量核销
export function postBatchVerification(data) {
  return request({
    url: `settle/cashier/payment/verification/batch/search`,
    method: "post",
    data,
  });
}

// 付款核销，任务分配前
export function getCashierDetailByBefore(id) {
  return request({
    url: `/settle/cashier/payment?id=${id}`,
    method: "get",
  });
}

//收付款付款分配
export function cashierPayment(data) {
  return request({
    url: `/settle/cashier/payment/allocation`,
    method: "post",
    data,
  });
}

//付款登记
export function paymentCheck(data) {
  return request({
    url: `/settle/cashier/payment/check`,
    method: "post",
    data,
  });
}
// 付款核销获取工作单号
export function getPaymentOrderNoInfo(obj) {
  const { id, ...data } = obj || {};
  return request({
    url: `/settle/cashier/payment/${id}/orderNoInfo`,
    method: "post",
    data,
  });
}

// //上传水单
// export function paymentUploadBankReceipt(data) {
//   return request({
//     url: `/cashier/payment/uploadBankReceipt`,
//     method: 'post',
//     data
//   })
// }

//财务核销
export function paymentVerification(data) {
  return request({
    url: `/settle/cashier/payment/verification`,
    method: "post",
    data,
  });
}

//财务核销
export function submitBatchVerification(data) {
  return request({
    url: `/settle/cashier/payment/verification/batch`,
    method: "post",
    data,
  });
}

// 查询付款记录,付款详情
export function getPaymentRecord(id) {
  return request({
    url: `/settle/cashier/payment/record/${id}`,
    method: "get",
  });
}
// 查询付款记录,收款详情
export function getCollectionRecord(id) {
  return request({
    url: `/settle/cashier/payee/record/${id}`,
    method: "get",
  });
}

//收款确认
export function cashierPayeeCheck(data) {
  return request({
    url: `/settle/cashier/payee/check`,
    method: "post",
    data,
  });
}

//收款核销
export function cashierPayeeVerification(data) {
  return request({
    url: `/settle/cashier/payee/verification`,
    method: "post",
    data,
  });
}

// 水单查询对账单信息
export function getCashierStatementInfo(id) {
  return request({
    url: `/settle/cashier/statementInfo/${id}`,
    method: "get",
  });
}

//收付款上传水单
export function cashierPaymentUploadBankReceipt(data) {
  return request({
    url: `/settle/cashier/payment/uploadBankReceipt`,
    method: "post",
    data,
  });
}

// 查询对账单信息
export function getBysSttleBill(data) {
  return request({
    url: `/settle/bill/getBy`,
    method: "post",
    data,
  });
}

// 水单查询对账单信息
export function getByStatement(id, bankReceiptId) {
  return request({
    url: `/settle/bank/receipt/verificationInfo/byStatement/${id}?bankReceiptId=${bankReceiptId}`,
    method: "get",
  });
}

//付款任务单付合并付款与付款登记
export function checkPaymentCashier(data) {
  return request({
    url: `/settle/cashier/payment/check`,
    method: "post",
    data,
  });
}

// 付款登记,上传水单，付款核销查询详情数据
export function getPaymentCashier(id) {
  return request({
    url: `/settle/cashier/payment/${id}`,
    method: "get",
  });
}

// 付款登记，动态获取金额
export function getPaymentCashierByRegister(params) {
  return request({
    url: `/settle/cashier/payment?id=${params.id}&currencyCode=${params.currencyCode}`,
    method: "get",
  });
}

// 水单账户日报表
export function getDailySheetList(params) {
  return request({
    url: "/logistics/settle/bank/receipt/dailySheet/list",
    method: "get",
    params,
  });
}

// 水单账户日报导出
export function getDailySheetExport(params) {
  return request({
    url: "/logistics/settle/bank/receipt/dailySheet/export",
    method: "get",
    params,
  });
}

//批量付款登记查询详情
export function cashierPaymentCheck(id, data) {
  return request({
    url: `/settle/cashier/payment/check/${id}`,
    method: "post",
    data,
  });
}

//批量付款登记
export function batchPaymentCheck(data) {
  return request({
    url: `/settle/cashier/payment/check`,
    method: "post",
    data,
  });
}

//收付款明细日报表列表数据查询
export function accountBillDailySheetList(data) {
  return request({
    url: `/logistics/settle/bank/receipt/accountBill/dailySheet/list`,
    method: "post",
    data,
  });
}

//收付款明细日报表列表详情数据查询
export function accountBillDailySheetDetail(data) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/dailySheet/detail",
    method: "post",
    data,
  });
}

// 银行账号
export function getBankAddressByCustomerId(id) {
  return request({
    url: `/crm/address/getBankAddressByCustomerId/${id}`,
    method: "get",
  });
}

//收付款明细报表导出
export function exportAccountBillDailySheet(data) {
  return request({
    url: `/logistics/settle/bank/receipt/accountBill/dailySheet/export`,
    method: "post",
    data,
  });
}

// 查询收款明细凭证
export function settleCashierPreview(obj) {
  const { id } = obj || {};
  return request({
    url: `/settle/cashier/preview/${id}`,
    method: "POST",
  });
}
// 查询收款凭证
export function getCashierVoucherPreview(obj) {
  const { id } = obj || {};
  return request({
    url: `/settle/cashier/preview/BR/${id}`,
    method: "POST",
  });
}

// 月业务利润统计表
export function getProfitStatement(opt) {
  const { pageNum, pageSize, ...data } = opt;
  return request({
    url: `/logistics/settle/bank/receipt/month/profitStatement/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: "POST",
    data,
  });
}

// 月业务利润统计表导出
export function getProfitStatementExport(data) {
  return request({
    url: `/logistics/settle/bank/receipt/month/profitStatement/export`,
    method: "POST",
    data,
  });
}

// 月业务利润统计表导出
export function getCustomerInfoMonth(data) {
  return request({
    url: `/logistics/settle/bank/receipt/month/profitStatement/getCustomerInfo`,
    method: "POST",
    data,
  });
}

// 月业务利润统计表导出
export function getSalesmanMonth(data) {
  return request({
    url: `/logistics/settle/bank/receipt/month/profitStatement/getSalesman`,
    method: "POST",
    data,
  });
}

// 我的费用报销列表
export function myCostExpenseList(data) {
  return request({
    url: "/settle/expense/list/my",
    method: "POST",
    data,
  });
}

// 费用报销列表
export function getExpenseAuditList(data) {
  return request({
    url: "/settle/expense/list/audit",
    method: "POST",
    data,
  });
}

// 费用报销列表
export function getCostExpenseList(data) {
  return request({
    url: "/settle/expense/list",
    method: "POST",
    data,
  });
}

// 费用报销列表
export function postExpenseAudit(data) {
  return request({
    url: "/settle/expense/audit",
    method: "POST",
    data,
  });
}

// 新增报销-个人报销
export function addExpensePersonal(data) {
  return request({
    url: "/settle/expense/personal",
    method: "POST",
    data,
  });
}

// 修改报销-个人报销
export function updateExpensePersonal(data) {
  return request({
    url: "/settle/expense/personal",
    method: "put",
    data,
  });
}

// 新增报销-付款申请
export function addExpenseApply(data) {
  return request({
    url: "/settle/expense/apply",
    method: "POST",
    data,
  });
}

// 修改报销-付款申请
export function updateExpenseApply(data) {
  return request({
    url: "/settle/expense/apply",
    method: "put",
    data,
  });
}

// 新增报销-借款
export function addExpenseBorrow(data) {
  return request({
    url: "/settle/expense/borrow",
    method: "POST",
    data,
  });
}

// 修改报销-借款
export function updateExpenseBorrow(data) {
  return request({
    url: "/settle/expense/borrow",
    method: "put",
    data,
  });
}

// 新增报销-收款
export function addExpensePayee(data) {
  return request({
    url: "/settle/expense/payee",
    method: "POST",
    data,
  });
}

// 修改报销-收款
export function updateExpensePayee(data) {
  return request({
    url: "/settle/expense/payee",
    method: "put",
    data,
  });
}

// 修改报销-应退余额
export function postRefundableBalance(data) {
  return request({
    url: "/settle/expense/personal/spareMoney",
    method: "post",
    data,
  });
}

// 撤回报销
export function postMyCostWithdraw(data) {
  return request({
    url: "/settle/expense/callbackToDraft",
    method: "POST",
    data,
  });
}

// 删除报销
export function deleteSettleExpense(ids) {
  return request({
    url: `/settle/expense/${ids}`,
    method: "delete",
  });
}

// 提交报销
export function checkSettleExpense(data) {
  return request({
    url: "/settle/expense/check",
    method: "post",
    data,
  });
}

// 报销-初始化数据
export function getExpenseInit(data) {
  return request({
    url: "/settle/expense/init",
    method: "POST",
    data,
  });
}

// 获取报销详情
export function getSettleExpenseInfo(id) {
  return request({
    url: `/settle/expense/${id}`,
    method: "get",
  });
}
// 获取报销(财务收、付款)详情
export function getSettleExpenseTaskInfo(id) {
  return request({
    url: `/settle/expense/task/${id}`,
    method: "get",
  });
}
// 报销单历史收付款记录
export function expenseBankReceiptRecord(data = {}) {
  return request({
    url: `/settle/expense/bankReceiptRecord`,
    method: "post",
    data,
  });
}
// 报销单操作记录
export function getExpenseOperatorRecord(data = {}) {
  return request({
    url: `/settle/expense/operatorInfo`,
    method: "post",
    data,
  });
}

// 报销单预览
export function postExpensePreview(data) {
  return request({
    url: `/settle/expense/preview`,
    method: "post",
    data,
  });
}

// 报销付款记录
export function postPaymentRecord(id) {
  return request({
    url: `/settle/expense/payment/record/${id}`,
    method: "post",
    data: {},
  });
}
// 报销详情流程
export function getFlowRecord(id) {
  return request({
    url: `/settle/expense/payment/flowAll/${id}`,
    method: "post",
    data: {},
  });
}
// 财务报销流程记录
export function getSettleExpenseFlow(id) {
  return request({
    url: `/settle/expense/payment/flow/${id}`,
    method: "post",
    data: {},
  });
}
// 财务报销流程记录(流程节点)
export function getSettleTaskFlow(id) {
  return request({
    url: `/settle/expense/payment/task/flow/${id}`,
    method: "post",
    data: {},
  });
}

// 金额转大写
export function amountInWords(data) {
  return request({
    url: "/settle/base/amountInWords",
    method: "POST",
    data,
  });
}

// 未收款公司
export function getNotPaymentCustomer(data = {}) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/notPayment/getCustomerInfo",
    method: "post",
    data,
  });
}

// 未收款业务员
export function getNotPaymentSalesman(data = {}) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/notPayment/getSalesman",
    method: "post",
    data,
  });
}

// 未收款委托人
export function getNotPaymentConsignor(data = {}) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/notPayment/getConsignor",
    method: "post",
    data,
  });
}

// 业务未收款统计表
export function getNotCollectList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/notCollect/list",
    method: "post",
    data,
  });
}

// 业务未收款统计导出
export function getNotCollectExport(data) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/notCollect/export",
    method: "post",
    data,
  });
}

// 业务未收款明细表
export function getNotCollectDetailList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/getNotCollectAccountBillInfo",
    method: "post",
    data,
  });
}
// 业务未收款明细导出
export function exportNotCollectAccountBillInfo(data) {
  return request({
    url: "/logistics/settle/bank/receipt/exportNotCollectAccountBillInfo",
    method: "post",
    data,
  });
}

// 业务未付款明细表
export function getNotPayList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/notPay/list",
    method: "post",
    data,
  });
}

// 业务未付款明细导出
export function getNotPayExport(data) {
  return request({
    url: "/logistics/settle/bank/receipt/accountBill/notPay/export",
    method: "post",
    data,
  });
}

// 财务报销列表
export function getExpenseTaskList(data) {
  return request({
    url: "/settle/expense/task/list",
    method: "post",
    data,
  });
}

// 财务报销详情
export function getExpensePayment(data) {
  return request({
    url: "/settle/expense/payment",
    method: "post",
    data,
  });
}

// 财务报销付款分配
export function postExpenseDistribution(data) {
  return request({
    url: "/settle/expense/payment/allocation",
    method: "post",
    data,
  });
}

// 财务报销付款登记
export function postExpenseRegister(data) {
  return request({
    url: "/settle/expense/payment/check",
    method: "post",
    data,
  });
}

// 财务报销上传水单
export function postExpenseUpload(data) {
  return request({
    url: "/settle/expense/payment/upload",
    method: "post",
    data,
  });
}

// 财务报销付款核销
export function postExpenseVerification(data) {
  return request({
    url: "/settle/expense/payment/verification",
    method: "post",
    data,
  });
}

// 财务报销内部单付款核销
export function postInteriorVerification(data) {
  return request({
    url: "/settle/expense/payment/interior/verification",
    method: "post",
    data,
  });
}

// 财务报销收款信息
export function postExpensePayeeInfo(data) {
  return request({
    url: "/settle/expense/payeeInfo",
    method: "post",
    data,
  });
}

// 财务报销收款确认
export function postExpensePayeeCheck(data) {
  return request({
    url: "/settle/expense/payee/check",
    method: "post",
    data,
  });
}

// 财务报销收款核销
export function postExpensePayeeVerification(data) {
  return request({
    url: "/settle/expense/payee/verification",
    method: "post",
    data,
  });
}

// 财务报销收款打回
export function postExpensePayeeRepulse(data) {
  return request({
    url: "/settle/expense/callback",
    method: "post",
    data,
  });
}

// 海外代理结算 - 明细列表
export function getOverseasAgencyList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/overseasAgency/list",
    method: "post",
    data,
  });
}

// 海外代理结算 - 明细表导出
export function exportOverseasAgencyList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/overseasAgency/export",
    method: "post",
    data,
  });
}

// 成本费用 - 获取企业(结算报表用)
export function logisticsCustomerInfo(data) {
  return request({
    url: "/logistics/settle/bank/receipt/getCustomerInfoNew",
    method: "post",
    data,
  });
}

// 成本费用 - 获取业务员(结算报表用)
export function logisticsSalesman(data) {
  return request({
    url: "/logistics/settle/bank/receipt/getSalesman",
    method: "post",
    data,
  });
}
// 成本费用 - 获取业务员(月业务利润报表用)
export function logisticsSalesmanNew(data) {
  return request({
    url: "/logistics/settle/bank/receipt/getSalesmanNew",
    method: "post",
    data,
  });
}

// 成本费用 - 获取往来单位(结算报表用)
export function logisticsDealingsCompany(data) {
  return request({
    url: "/logistics/settle/bank/receipt/getDealingsCompany",
    method: "post",
    data,
  });
}

// 成本费用往来单位 - 明细表
export function costAccountingList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/costAccounting/list",
    method: "post",
    data,
  });
}

// 成本费用往来单位 - 明细表导出
export function exportCostAccounting(data) {
  return request({
    url: "/logistics/settle/bank/receipt/costAccounting/export",
    method: "post",
    data,
  });
}

// 成本费用维度 - 明细表
export function postCostExpenseList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/costAccounting/cost/list",
    method: "post",
    data,
  });
}

// 成本费用维度 - 明细表导出
export function postCostExpenseExport(data) {
  return request({
    url: "/logistics/settle/bank/receipt/costAccounting/cost/export",
    method: "post",
    data,
  });
}

// 费用报销 - 明细表
export function postCostReimbursementList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/expense/bill/list",
    method: "post",
    data,
  });
}

// 费用报销 - 明细导出
export function postCostReimbursementExport(data) {
  return request({
    url: "/logistics/settle/bank/receipt/expense/bill/export",
    method: "post",
    data,
  });
}

// 月结对账单(电商)列表
export function getECReport(data) {
  return request({
    url: "/month/state/ec/list",
    method: "post",
    data,
  });
}

// 月结对账单(电商)-导出
export function ecReportExport(data) {
  return request({
    url: "/month/state/ec/export",
    method: "post",
    data,
  });
}
// 月结对账单(电商)-导出明细
export function ecInfoReportExport(data) {
  return request({
    url: "/month/state/ecInfo/export",
    method: "post",
    data,
  });
}

// 月结对账单(电商)-获取业务员
export function getECSalesman(data) {
  return request({
    url: "/month/state/ec/get/salesman",
    method: "post",
    data,
  });
}

// 月结对账单(传统)列表
export function getTraditionReportEC(data) {
  return request({
    url: "/month/state/tradition/list",
    method: "post",
    data,
  });
}

// 月结对账单(传统)-导出
export function traditionReportExport(data) {
  return request({
    url: "/month/state/tradition/export",
    method: "post",
    data,
  });
}

// 月结对账单(传统英文)-导出
export function traditionEnReportExport(data) {
  return request({
    url: "/month/state/en/tradition/export",
    method: "post",
    data,
  });
}

// 月结对账单(传统)-获取业务员
export function getTraditionSalesman(data) {
  return request({
    url: "/month/state/tradition/get/salesman",
    method: "post",
    data,
  });
}

// 市场部利润表-列表
export function getMarketProfit(data) {
  return request({
    url: "/logistics/settle/bank/receipt/marketProfit/list",
    method: "post",
    data,
  });
}

// 市场部利润表-导出
export function marketProfitExport(data) {
  return request({
    url: "/logistics/settle/bank/receipt/marketProfit/export",
    method: "post",
    data,
  });
}

// 市场部利润表获取往来单位
export function getMarketProfitDC(data = {}) {
  return request({
    url: "/logistics/settle/bank/receipt/marketProfit/dealingsCompany",
    method: "post",
    data,
  });
}

// 月业务利润（英国分润）列表查询
export function getProfitStatementUK(data = {}) {
  return request({
    url: "/logistics/settle/bank/receipt/month/profitStatement/gb/list",
    method: "post",
    data,
  });
}

// 月业务利润（英国分润）导出
export function getProfitStatementUKExport(data = {}) {
  return request({
    url: "/logistics/settle/bank/receipt/month/profitStatement/gb/export",
    method: "post",
    data,
  });
}

// 货物跟踪列表-获取业务员
export function getGoodsSalesman(data) {
  return request({
    url: "/goods/trace/get/salesman",
    method: "post",
    data,
  });
}

// 货物跟踪列表
export function getGoodsTraceList(data = {}) {
  return request({
    url: "/goods/trace/list",
    method: "post",
    data,
  });
}

// 货物跟踪导出
export function exportGoodsTrace(data = {}) {
  return request({
    url: "/goods/trace/export",
    method: "post",
    data,
  });
}

// 订单跟踪表-获取业务员
export function getOrderTraceSalesman(data) {
  return request({
    url: "/order/trace/get/salesman",
    method: "post",
    data,
  });
}

// 订单跟踪列表
export function getOrderTraceList(data = {}) {
  return request({
    url: "/order/trace/list",
    method: "post",
    data,
  });
}

// 订单跟踪导出
export function exportOrderTrace(data = {}) {
  return request({
    url: "/order/trace/export",
    method: "post",
    data,
  });
}

// 订单跟踪全部导出
export function exportAllOrderTrace(data = {}) {
  return request({
    url: "/order/trace/exportAll",
    method: "post",
    data,
  });
}

// 时效统计表-获取业务员
export function getEffectiveTimeSalesman(data) {
  return request({
    url: "/effective/time/get/salesman",
    method: "post",
    data,
  });
}
// 时效统计列表
export function getEffectiveTimeList(data = {}) {
  return request({
    url: "/effective/time/list",
    method: "post",
    data,
  });
}
// 时效统计导出
export function exportEffectiveTime(data = {}) {
  return request({
    url: "/effective/time/export",
    method: "post",
    data,
  });
}

// 水单认领，开票申请
export function submitClaimApplyInvoice(data = {}) {
  return request({
    url: "/settle/bank/receipt/claim/applyInvoice",
    method: "post",
    data,
  });
}
// 凭证明细表
export function getVoucherReportList(data) {
  return request({
    url: "/unit/detail/list",
    method: "post",
    data,
  });
}
// 待生成凭证详情表
export function getVoucherReportDetail(data) {
  return request({
    url: "/unit/detail/list/detail",
    method: "post",
    data,
  });
}
// 已生成凭证详情表
export function getSettleVoucherDetail(data) {
  return request({
    url: "/settle/voucher/detail/list ",
    method: "post",
    data,
  });
}

// 水单认领
export function getReceiptPRLog(id, type) {
  //id 水单id  type应收应付类型
  return request({
    url: `/settle/bank/receipt/PRLog/${type}/${id}`,
    method: "get",
  });
}
// 凭证 - 明细表导出
export function exportVoucherReport(data) {
  return request({
    url: "/settle/voucher/export",
    method: "post",
    data,
  });
}

// 已生成凭证 - 明细表
export function getSettleVoucherList(data) {
  return request({
    url: "/settle/voucher/list",
    method: "post",
    data,
  });
}
// 已生成凭证币别合计
export function getSettleVoucherSubtotal(data) {
  return request({
    url: "/settle/voucher/list/subtotal",
    method: "post",
    data,
  });
}

// 生成凭证
export function postAddVoucher(data) {
  return request({
    url: "/settle/voucher/add",
    method: "post",
    data,
  });
}

// 删除凭证
export function postDelVoucher(data) {
  return request({
    url: `/settle/voucher/del`,
    method: "post",
    data,
  });
}

// 待核算商户
export function getWaitCalculateList(data) {
  return request({
    url: "/customer/voucher/wating/list",
    method: "post",
    data,
  });
}
// 已核算商户
export function getCalculateList(data) {
  return request({
    url: "/customer/voucher/list",
    method: "post",
    data,
  });
}
// 核算商户导出（已核算）
export function exportCalculateReport(data) {
  return request({
    url: "/customer/voucher/export",
    method: "post",
    data,
  });
}
// 核算商户添加
export function postAddCalculate(data) {
  return request({
    url: "/customer/voucher/add",
    method: "post",
    data,
  });
}
// 删除核算商户
export function postDelCalculate(ids) {
  return request({
    url: `/customer/voucher/del/${ids}`,
    method: "delete",
  });
}
// 客商核算获取业务归属
export function getCustomerVoucherSubject(data = {}) {
  return request({
    url: `/customer/voucher/get/subject`,
    method: "post",
    data,
  });
}

// 发票详情/申请发票/开票附件查询
export function getInvoiceAttach(data) {
  return request({
    url: "/settle/invoice/attach",
    method: "post",
    data,
  });
}

// 结账操作列表
export function getLockRecordList(data) {
  return request({
    url: "/settle/lock/record/list",
    method: "post",
    data,
  });
}
// 结账时间记录
export function getVoucherLockMonth(data = {}) {
  return request({
    url: "/settle/voucher/lock/month",
    method: "post",
    data,
  });
}
// 结账
export function postVoucherLock(data = {}) {
  return request({
    url: "/settle/voucher/lock",
    method: "post",
    data,
  });
}
// 反结账
export function postVoucherUnlock(data = {}) {
  return request({
    url: "/settle/voucher/unlock",
    method: "post",
    data,
  });
}

// 凭证汇率列表
export function getVoucherRateList(data) {
  return request({
    url: "/settle/voucher/exchange/rate/list",
    method: "post",
    data,
  });
}
// 新增凭证汇率
export function postVoucherRate(data) {
  return request({
    url: "/settle/voucher/exchange/rate",
    method: "post",
    data,
  });
}
// 批量更新凭证汇率
export function postBatchVoucherRate(data) {
  return request({
    url: "settle/voucher/exchange/rate/batch",
    method: "post",
    data,
  });
}
// 更新凭证汇率
export function putVoucherRate(data) {
  return request({
    url: "/settle/voucher/exchange/rate",
    method: "put",
    data,
  });
}

// 发票详情，申请发票，开票操作记录
export function getInvoiceOperatorInfo(data) {
  return request({
    url: "/settle/invoice/operatorInfo",
    method: "post",
    data,
  });
}

//业务回款考核列表
export function getBusinessRefundCheck(data) {
  return request({
    url: "/logistics/settle/bank/receipt/businessRefundCheck/list",
    method: "post",
    data,
  });
}

//业务回款考核列表
export function exportBusinessRefundCheck(data) {
  return request({
    url: "/logistics/settle/bank/receipt/businessRefundCheck/export",
    method: "post",
    data,
  });
}

//业务回款详情考核列表
export function getBusinessRefundCheckDetail(data) {
  return request({
    url: "/logistics/settle/bank/receipt/businessRefundCheck/detail/list",
    method: "post",
    data,
  });
}

//业务回款详情考核列表
export function exportBusinessRefundCheckDetail(data) {
  return request({
    url: "/logistics/settle/bank/receipt/businessRefundCheck/detail/export",
    method: "post",
    data,
  });
}

//选择财务单
export function getPaymentTaskList(data) {
  return request({
    url: "/settle/cashier/payment/taskList",
    method: "post",
    data,
  });
}

//外部付款合并分配
export function postPaymentAllocationBatch(data) {
  return request({
    url: "/settle/cashier/payment/allocation/batch",
    method: "post",
    data,
  });
}

// 核算商户导出（待核算）
export function exportCustomerVoucherWating(data) {
  return request({
    url: "/customer/voucher/wating/export",
    method: "post",
    data,
  });
}

// 水单充值认领
export function POSTReceiptCzrl(data) {
  return request({
    url: "/settle/bank/receipt/czrl",
    method: "post",
    data,
  });
}

// 余额模式任务单核销
export function POSTCashierWriteOff(data) {
  return request({
    url: "/settle/cashier/writeOff",
    method: "post",
    data,
  });
}

//任务单付款申请书
export function POSTCashierPaymentApplyBill(data) {
  const { id } = data;
  return request({
    url: `/settle/cashier/preview/paymentApplyBill/${id}`,
    method: "post",
    data,
  });
}

//任务单付款申请书-手续费
export function POSTCashierPaymentApplyBillServiceCharge(data) {
  const { id } = data;
  return request({
    url: `/settle/cashier/preview/paymentApplyBill/serviceCharge/${id}`,
    method: "post",
    data,
  });
}

// 电商利润表查询
export function POSTEcMonthProfitStatement(data) {
  return request({
    url: "/logistics/settle/bank/receipt/month/profitStatement/ec/list",
    method: "POST",
    data,
  });
}
// 传统利润表查询
export function POSTTraditionMonthProfitStatement(data) {
  return request({
    url: "/logistics/settle/bank/receipt/month/profitStatement/tradition/list",
    method: "POST",
    data,
  });
}

// 电商/传统利润表导出
export function POSTExportProfitStatementEcOrTradition(data) {
  return request({
    url: "/logistics/settle/bank/receipt/month/profitStatement/ecOrTradition/export",
    method: "POST",
    data,
  });
}

//财务付款/收款详情上传附件
export function POSTUploadPaymentInvoice(data) {
  return request({
    url: "/settle/expense/uploadPaymentInvoice",
    method: "put",
    data,
  });
}

// 水单认领查账单明细
export function POSTVerificationInfoByStatement(data) {
  return request({
    url: "/settle/bank/receipt/verificationInfo/byStatement",
    method: "POST",
    data,
  });
}

// 费用报销修改发票信息
export function POSTApplyInvoice(data) {
  return request({
    url: "/settle/expense/applyInvoice",
    method: "POST",
    data,
  });
}

// 已完结发票修改发票信息
export function POSTMaintainInvoice(data) {
  return request({
    url: "/settle/invoice/apply/maintain",
    method: "POST",
    data,
  });
}

// 付款任务单，应付对账单修改发票信息
export function POSTBillApplyInvoice(data) {
  return request({
    url: "/settle/bill/applyInvoice",
    method: "POST",
    data,
  });
}

// 水单认领导出
export function GETReceiptClaimExport(params) {
  return request({
    url: "/settle/bank/receipt/claim/export",
    method: "get",
    params,
  });
}

// 收款任务单导出
export function POSTSettleCashierExport(data) {
  return request({
    url: "/settle/cashier/export",
    method: "post",
    data,
  });
}

// 水单管理(收款)导出
export function GETSettleBankReceiptExport(params) {
  return request({
    url: "/settle/bank/receipt/export",
    method: "get",
    params,
  });
}

// 获取借款明细
export function GETBorrowBill(params) {
  return request({
    url: `/settle/expense/getBorrowBill`,
    method: "get",
    params,
  });
}

// 借款抵消
export function POSTBorrowOffset(data) {
  return request({
    url: "/settle/expense/borrow/offset",
    method: "POST",
    data,
  });
}

// 收款任务单打印预览全部-明细凭证
export function GETCashierPreviewAll(obj) {
  const { id } = obj || {};
  return request({
    url: `/settle/cashier/previewAll/${id}`,
    method: "POST",
  });
}

// 收款任务单打印预览全部-收款凭证
export function GETCashierPreviewAllBr(obj) {
  const { id } = obj || {};
  return request({
    url: `/settle/cashier/previewAll/BR/${id}`,
    method: "POST",
  });
}

// 发票审核导出
export function GETSettleInvoiceExport(params) {
  return request({
    url: "/settle/invoice/export",
    method: "get",
    params,
  });
}

// 接口抵消记录
export function GETOffsetRecord(id) {
  return request({
    url: `/settle/expense/borrow/offset/record/${id}`,
    method: "get",
  });
}

// 收款任务单批量打印
export function GETCashierPreviewBrBatch(ids) {
  return request({
    url: `/settle/cashier/preview/BR/batch/${ids}`,
    method: "POST",
  });
}

// 借款抵消信明细查询接口
export function getBorrowOffsetBill(params) {
  return request({
    url: `/settle/expense/getBorrowOffsetBill`,
    method: "get",
    params,
  });
}

// 费用报销(审核),批量打回/确认
export function POSTBatchAudit(data) {
  return request({
    url: "/settle/expense/batchAudit",
    method: "POST",
    data,
  });
}

// 收款水单导入水单
export function POSTReceiptImportAcc(data) {
  return request({
    url: "/settle/bank/receipt/importAcc",
    method: "POST",
    data,
  });
}

// 水单认领编辑
export function POSTSettleCashierClaimEdit(data) {
  return request({
    url: `/settle/cashier/claimEdit`,
    method: "post",
    data,
  });
}

// 水单编辑详情查询
export function POSTSettleBankReceiptPayee(id, data) {
  return request({
    url: `/settle/bank/receipt/payee/${id}`,
    method: "post",
    data,
  });
}

// 发票查询关联水单信息
export function getApplyBankReceipt(data) {
  return request({
    url: "/settle/bank/receipt/applyBankReceipt",
    method: "post",
    data,
  });
}

// 水单查询关联发票信息
export function getApplyInvoice(data) {
  return request({
    url: "/settle/bank/receipt/applyInvoice",
    method: "post",
    data,
  });
}

// 发票费用明细-导出
export function exportInvoiceCost(data) {
  return request({
    url: "/settle/record/export",
    method: "post",
    data,
  });
}


// 该部门是否有内部单权限
export function GETExpenseIsInternalPer(params) {
  return request({
    url: `/settle/expense/isInternalPer`,
    method: "get",
    params,
  });
}
