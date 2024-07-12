import request from "@/utils/request";

// 双向对账单列表
export function getTwoWayStatementPage(params) {
  return request({
    url: "/operationSettlement/twoWayStatementPage",
    method: "get",
    params,
  });
}

// 导出双向对账单
export function exportTwoWayStatement(params) {
  return request({
    url: "/operationSettlement/exportTwoWayStatement",
    method: "get",
    params,
  });
}

// 银行手续费列表
export function getBankChargesPage(params) {
  return request({
    url: "/operationSettlement/bankChargesPage",
    method: "get",
    params,
  });
}

// 导出银行手续费信息
export function exportBankCharges(params) {
  return request({
    url: "/operationSettlement/exportBankCharges",
    method: "get",
    params,
  });
}

// 对冲对账单列表
export function getHedgingStatementPage(params) {
  return request({
    url: "/operationSettlement/hedgingStatementPage",
    method: "get",
    params,
  });
}

// 导出对冲对账单列表
export function exportHedgingStatement(params) {
  return request({
    url: "/operationSettlement/exportHedgingStatement",
    method: "get",
    params,
  });
}

// 新建、编辑对账单备注
export function saveOrUpdateRemark(data) {
  return request({
    url: "/operationSettlement/saveOrUpdateRemark",
    method: "post",
    data,
  });
}
