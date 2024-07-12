import request from "@/utils/request";
// 查询账单列表 改成post
export function settleAccountsList(data) {
  return request({
    url: "/settle/accounts/list",
    method: "post",
    data,
  });
}

// 待出应收、应付对账单导出
export function settleAccountsStayExport(data) {
  return request({
    url: "/settle/accounts/stay/export",
    method: "post",
    data,
  });
}

// 待出应收、应付对账单
export function settleAccountsStayList(data) {
  return request({
    url: "/settle/accounts/stay/list",
    method: "post",
    data,
  });
}

// 新查询账单列表
export function settleAccountsOrderList(params) {
  return request({
    url: "/settle/accounts/orderlist",
    method: "get",
    params,
  });
}

// 新查询账单列表-海外其他（直清、直派）
export function settleAccountsOrderListNew(params) {
  return request({
    url: "/settle/accounts/orderListNew",
    method: "get",
    params,
  });
}

// 新增账单
export function addSettleAccounts(data) {
  return request({
    url: "/settle/accounts",
    method: "post",
    data,
  });
}

// 市场部账单新增费用类型
export function getVoyageCostType(data = {}) {
  return request({
    url: "/operate/route-no/bill/getCostType",
    method: "post",
    data,
  });
}

// 市场部账单新增费用默认数据
export function getVoyageDefault(data = {}) {
  return request({
    url: "/operate/route-no/bill/init",
    method: "post",
    data,
  });
}

// 头程入库账单新增
export function postAddSettleAccounts(data) {
  return request({
    url: "/settle/accounts/addTwo",
    method: "post",
    data,
  });
}

// 编辑账单
export function updateSettleAccounts(data) {
  return request({
    url: "/settle/accounts",
    method: "put",
    data,
  });
}

// 删除账单
export function deleteSettleAccounts(id) {
  return request({
    url: `/settle/accounts/${id}`,
    method: "delete",
  });
}

// 统计订单的历史利润数据
export function getBillProfitStatement(data) {
  const { pageNum, pageSize, ...params } = data || {};
  return request({
    url: "/logistics/settle/bank/receipt/month/profitStatement/orderdetail",
    method: "get",
    params,
  });
}

// 统计订单的历史利润数据 - 海外其他订单（直清直派）专用
export function getBillProfitStatementNew(data) {
  const { pageNum, pageSize, ...params } = data || {};
  return request({
    url: "/logistics/settle/bank/receipt/month/profitStatement/orderdetailNew",
    method: "get",
    params,
  });
}

// 查询待出企业对账单列表
export function settleCusBillList(params) {
  return request({
    url: "/settle/accounts/cus-bill",
    method: "get",
    params,
  });
}
// 获取任务单详情table
export function getAccountBillInfo(id) {
  return request({
    url: `/settle/cashier/getAccountBillInfo/${id}`,
    method: "get",
  });
}

/** B1待出业务对账单 */
// 查询待出业务对账单列表
export function getBusinessList(params) {
  return request({
    url: "/settle/accounts/bus-bill",
    method: "get",
    params,
  });
}
// B11待出对账单-头部
export function getBussinessDetail(params) {
  return request({
    url: "/settle/accounts/bussinessList",
    method: "get",
    params,
  });
}
// B12账单统计
export function getBillStatisticsDetail(params) {
  return request({
    url: "/settle/bill/bus-statistics",
    method: "get",
    params,
  });
}
// B12账单统计 20220914最新
export function getSettleBillStatistics(id) {
  return request({
    url: `/settle/bill/statistics/${id}`,
    method: "get",
  });
}

// 根据企业查对账单明细
export function getAccountsenterprise(params) {
  const { pageNum, pageSize, ...opt } = params;
  return request({
    url: "/settle/accounts/enterprise",
    method: "get",
    params: opt,
  });
}

// 查询对账单列表 改成post请求
export function getBillList(data) {
  return request({
    url: "/settle/bill/list",
    method: "post",
    data,
  });
}

// 应收应付对账单列表
export function getBillNewList(data) {
  return request({
    url: "/settle/bill/listNew",
    method: "post",
    data,
  });
}

// 应收应付对账单撤销提交
export function cancelBillSubmission(id) {
  return request({
    url: `/settle/bill/cancelSubmission/${id}`,
    method: "get",
  });
}

// 应收应付对账单修改审核人
export function postBillUpdReviewedBy(data) {
  return request({
    url: `/settle/bill/updReviewedBy`,
    method: "post",
    data,
  });
}

// 应收应付对账单审核人员列表
export function postTaskByList(data) {
  return request({
    url: `/settle/bill/getTaskByList`,
    method: "post",
    data,
  });
}

// 对账单收付款记录
export function getCashierPRLog(id, type) {
  return request({
    url: `/settle/cashier/PRLog/${type}/${id}`,
    method: "get",
  });
}

// 收款账单列表
export function getBillList2(params) {
  return request({
    url: "/settle/bill/list2",
    method: "get",
    params,
  });
}

// 生成对账单
export function addBill(data) {
  return request({
    url: "/settle/bill",
    method: "post",
    data,
  });
}

// 批量生成对账单 /settle/bill/batch
export function batchGenerateBill(data) {
  return request({
    url: "/settle/bill/batch",
    method: "post",
    data,
  });
}

// 编辑对账单
export function exitBill(data) {
  return request({
    url: "/settle/bill",
    method: "put",
    data,
  });
}

// 获取对账单详情
export function getBillDetail(id) {
  return request({
    // url: `/settle/bill/${id}`,
    url: `/settle/bill/getInfo/${id}`,
    method: "get",
  });
}

// 对账单水单认领
export function putBankReceiptState(data) {
  return request({
    url: `/settle/bill/updBankReceiptState`,
    method: "put",
    data,
  });
}

// 对账单批量水单认领
export function batchUpdBankReceiptState(data) {
  return request({
    url: `/settle/bill/batchUpdBankReceiptState`,
    method: "put",
    data,
  });
}

// 对账单详情附件上传
export function detailUploadPaymentInvoice(data) {
  return request({
    url: `/settle/bill/uploadPaymentInvoice`,
    method: "put",
    data,
  });
}

// 删除对账单详情
export function deleteBillDetail(id) {
  return request({
    url: `/settle/bill/${id}`,
    method: "delete",
  });
}

// 账单确认
export function confirmBill(data) {
  return request({
    url: "/settle/bill/confirm",
    method: "post",
    data,
  });
}

// 账单撤回
export function postWithdrawBill(data = {}) {
  return request({
    url: "/settle/bill/callback",
    method: "post",
    data,
  });
}

// 账单批量确认
export function postBatchConfirmBill(data) {
  return request({
    url: "/settle/bill/batch/confirm",
    method: "post",
    data,
  });
}

// 账单提交
export function submitBill(data) {
  return request({
    url: `/settle/bill/submit/${data.id}`,
    method: "post",
    data,
  });
}

// 账单复核
export function recheckBill(data) {
  return request({
    url: "settle/bill/recheck",
    method: "post",
    data,
  });
}

// 账单复制来源订单
export function getOrderInfoList(params) {
  return request({
    url: "/settle/accounts/orderInfoList",
    method: "get",
    params,
  });
}
// 航次详情账单复制来源订单
export function getMarketOrderList(data) {
  return request({
    url: "/operate/sono/sonoList",
    method: "post",
    data,
  });
}

// 订单ID查询账单列表
export function getAccountsBillList(params) {
  return request({
    url: "/settle/accounts/billList",
    method: "get",
    params,
  });
}
// 市场航次查询账单列表
export function getMarketAccountsBillList(data) {
  return request({
    url: "/settle/accounts/getPage",
    method: "post",
    data,
  });
}
// 市场航次账单复制
export function copyMarketAccountsBill(data) {
  return request({
    url: "/settle/accounts/copy",
    method: "post",
    data,
  });
}

// 账单批量操作（新增/修改/删除）/复制 type 1-复制账单  2-全部保存
export function postBatchOperate(data) {
  return request({
    url: "/settle/accounts/batchOperate",
    method: "post",
    data,
  });
}

// 第三方入库账单新增
export function postWmsAddSettleAccounts(data) {
  return request({
    url: "/settle/accounts/wmsAdd",
    method: "post",
    data,
  });
}

// FBA订单账单新增
export function postFbaAddSettleAccounts(data) {
  return request({
    url: "/settle/accounts/fbaAdd",
    method: "post",
    data,
  });
}

// 第三方入库账单全部保存
export function postBatchWmsAddOperate(data) {
  return request({
    url: "/settle/accounts/batchWmsAdd",
    method: "post",
    data,
  });
}

// FBA订单全部保存
export function postBatchFbaAddOperate(data) {
  return request({
    url: "/settle/accounts/batchFbaAdd",
    method: "post",
    data,
  });
}

// 第三方入库与FBA订单编辑账单
export function wmsFbaUpdateSettleAccounts(data) {
  return request({
    url: "/settle/accounts/wmsFbaUpdate",
    method: "put",
    data,
  });
}

// 一件代发出库账单新增
export function postPlatformAddAccounts(data) {
  return request({
    url: "/settle/accounts/platformAdd",
    method: "post",
    data,
  });
}

// 一件代发出库账单修改
export function postPlatformUpdateAccounts(data) {
  return request({
    url: "/settle/accounts/wmsPlatformUpdate",
    method: "put",
    data,
  });
}

// 一件代发出库账单全部保存
export function postPlatformBatchAccounts(data) {
  return request({
    url: "/settle/accounts/batchPlatformAdd",
    method: "post",
    data,
  });
}

// 对接头程编辑账单
export function ecUpdateSettleAccounts(data) {
  return request({
    url: "/settle/accounts/ecUpdate",
    method: "put",
    data,
  });
}

// 对接头程全部保存
export function postBatchEcAddOperate(data) {
  return request({
    url: "/settle/accounts/batchEcAdd",
    method: "post",
    data,
  });
}

// 对账单-历史收付款记录
export function getBankReceiptRecord(data) {
  return request({
    url: "/settle/bill/bankReceiptRecord",
    method: "post",
    data,
  });
}

// 待关联明细列表查询
export function getSettleAccountsRelevancyBsList(data) {
  return request({
    url: "/settle/accounts/relevancy/bsList",
    method: "post",
    data,
  });
}

//待确认明细列表查询
export function getSettleAccountsCheckBsList(data) {
  return request({
    url: "/settle/accounts/check/bsList",
    method: "post",
    data,
  });
}

//双向费用关联
export function submitSettleAccountsRelevancy(data) {
  return request({
    url: "/settle/accounts/relevancy",
    method: "post",
    data,
  });
}

//双向费用确认
export function submitSettleAccountsCheck(data) {
  return request({
    url: "/settle/accounts/check",
    method: "post",
    data,
  });
}

//双向费用转交
export function submitSettleAccountsTransfer(data) {
  return request({
    url: "/settle/accounts/transfer",
    method: "post",
    data,
  });
}

//关联业务单号查询
export function getSettleAccountsRelevancyList(data) {
  return request({
    url: "/settle/accounts/relevancy/list",
    method: "post",
    data,
  });
}

//双向费用驳回
export function submitSettleAccountsCallback(data) {
  return request({
    url: "/settle/accounts/callback",
    method: "post",
    data,
  });
}

// 复制来源订单
export function GETAccountsOrderInfoList(params) {
  return request({
    url: "/settle/accounts/overseas/orderInfoList",
    method: "get",
    params,
  });
}

// 校验账单
export function checkAccount(data) {
  return request({
    url: "/settle/accounts/checkAccount",
    method: "post",
    data,
  });
}

// 付款任务单附件上传，目前主单不能上传附件，只有子单可以上传附件
export function POSTCashierUploadPaymentInvoice(data) {
  return request({
    url: `/settle/cashier/uploadPaymentInvoice`,
    method: "put",
    data,
  });
}
