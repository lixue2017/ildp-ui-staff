import request from "@/utils/request";

// 查询费用管理
export function settleCostTypeList(params) {
  return request({
    url: "/settle/cost/type/list",
    method: "get",
    params,
  });
}

// 查询汇率信息
export function settleExchangeRateList(params) {
  return request({
    url: "/settle/exchange/rate/list",
    method: "get",
    params,
  });
}

// 查当前月份汇率数据
export function getExchangeRateMonth(params) {
  return request({
    url: `/settle/exchange/rate/month`,
    method: "get",
    params
  });
}

// 更新汇率
export function settleExchangeRateBatch(data) {
  return request({
    url: "/settle/exchange/rate/batch",
    method: "post",
    data,
  });
}

// 账户管理列表
export function getAccountList(params) {
  return request({
    url: "/crm/address/accountInfo",
    method: "get",
    params,
  });
}

// 账户管理列表
export function getAccountInfoFromSD(params) {
  return request({
    url: "/crm/address/accountInfoFromSD",
    method: "get",
    params,
  });
}

// 查询账单锁单信息
export function settleAccountLockList(params) {
  return request({
    url: "/settle/account/lock/list",
    method: "get",
    params,
  });
}

// 新增锁单信息
export function addSettleAccountLock(data) {
  return request({
    url: "/settle/account/lock",
    method: "post",
    data,
  });
}

// 修改锁单信息
export function editSettleAccountLock(data) {
  return request({
    url: "/settle/account/lock",
    method: "put",
    data,
  });
}

// 查询报销单审核规则列表
export function getExpenseBillRuleList(data) {
  return request({
    url: "/settle/expense/rule/list",
    method: "post",
    data,
  });
}
// 对账单审核规则列表
export function getStatementRuleList(params) {
  return request({
    url: "/settle/bill/rule/list",
    method: "get",
    params,
  });
}

// 报销单审核导出
export function exportExpenseBillRule(data) {
  return request({
    url: "/logistics/settle/bank/receipt/expenseBill/rule/export",
    method: "post",
    data,
  });
}

// 费用模板列表
export function getCostTempList(data) {
  return request({
    url: "/costTemp/page",
    method: "post",
    data,
  });
}

// 新增编辑模板
export function postAddCostTemp(data) {
  return request({
    url: "/costTemp/sou",
    method: "post",
    data,
  });
}

// 费用模板详情
export function getAddCostDetail(id) {
  return request({
    url: `/costTemp/detail/${id}`,
    method: "get",
  });
}

// 删除费用模板
export function delCostTempList(id) {
  return request({
    url: `/costTemp/del/${id}`,
    method: "DELETE",
  });
}


// 币别配置-list
export function GETCurrencyConfigList(params) {
  return request({
    url: "/settle/base/currencyConfig/list",
    method: "get",
    params,
  });
}


// 币别配置-add
export function POSTCurrencyConfig(data) {
  return request({
    url: "/settle/base/currencyConfig",
    method: "post",
    data,
  });
}


// 报销单规则修改
export function getExpenseBillRule(data) {
  return request({
    url: "/settle/expense/rule",
    method: "post",
    data,
  });
}



// 对账单审核规则-详情
export function GETBillRuleDetail(params) {
  return request({
    url: "/settle/bill/rule/detail",
    method: "get",
    params,
  });
}


// 报销单规则修改
export function POSTSettleBillRule(data) {
  return request({
    url: "/settle/bill/rule",
    method: "post",
    data,
  });
}


// 更新汇率
export function POSTExchangeRateBatchEdit(data) {
  return request({
    url: "/settle/exchange/rate/batchEdit",
    method: "post",
    data,
  });
}
