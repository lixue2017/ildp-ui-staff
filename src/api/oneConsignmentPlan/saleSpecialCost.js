import request from "@/utils/request";

// 查询oda设置列表
export function getCostOdaSettingsList(params) {
  return request({
    url: "/costOdaSettings/list",
    method: "get",
    params,
  });
}
// 查询oda设置详情
export function getCostOdaSettingsInfo(id) {
  return request({
    url: `/costOdaSettings/${id}`,
    method: "get",
  });
}

// 销售特殊费用规则列表
export function getCostSpecialRuleList(params) {
  return request({
    url: "/costSpecialChargesRule/page",
    method: "get",
    params,
  });
}

// 新建、编辑销售特殊费用规则
export function saveOrUpdateSpecialRule(data) {
  return request({
    url: "/costSpecialChargesRule/saveOrUpdate",
    method: "post",
    data,
  });
}

// 销售特殊费用规则详情
export function getSpecialRuleInfo(id) {
  return request({
    url: `/costSpecialChargesRule/getInfo/${id}`,
    method: "get",
  });
}

// 销售特殊费用规则启用禁用
export function enableDisableSpecialRule({ id }) {
  return request({
    url: `/costSpecialChargesRule/enableDisable/${id}`,
    method: "put",
  });
}

// 删除销售特殊费用规则
export function deleteSpecialRule({ id }) {
  return request({
    url: `/costSpecialChargesRule/del/${id}`,
    method: "delete",
  });
}

// 销售特殊费用价格列表
export function getChargesPriceList(params) {
  return request({
    url: "/costSpecialChargesPrice/page",
    method: "get",
    params,
  });
}

// 新建、编辑销售特殊费用价格
export function saveOrUpdateChargesPrice(data) {
  return request({
    url: "/costSpecialChargesPrice/saveOrUpdate",
    method: "post",
    data,
  });
}

// 销售特殊费用价格详情
export function getChargesPriceInfo(id) {
  return request({
    url: `/costSpecialChargesPrice/getInfo/${id}`,
    method: "get",
  });
}

// 销售特殊费用价格启用禁用
export function enableDisableChargesPrice(data) {
  return request({
    url: `/costSpecialChargesPrice/enableDisable`,
    method: "put",
    data
  });
}

// 删除销售特殊费用价格
export function deleteChargesPrice({ id }) {
  return request({
    url: `/costSpecialChargesPrice/del/${id}`,
    method: "delete",
  });
}

// 复制销售特殊费用价格
export function copyChargesPriceInfo(id) {
  return request({
    url: `/costSpecialChargesPrice/copy/${id}`,
    method: "get",
  });
}

// 销售特殊费用规则下拉列表
export function getCostSpecialChargesRule(params) {
  return request({
    url: "/costSpecialChargesRule/select",
    method: "get",
    params,
  });
}

// 获取是否是通用规则
export function getSpecialIsBindAllCustomer(wmsId, logisticsProductId) {
  return request({
    url: `/costSpecialChargesPrice/isBindAllCustomer/${wmsId}/${logisticsProductId}`,
    method: "get",
  });
}


// 销售特殊费用价格升级
export function getCostSpecialChargesPriceUp(id) {
  return request({
    url: `/costSpecialChargesPrice/up/${id}`,
    method: "get",
  });
}



// 销售特殊费用价格修改生效时间
export function putCostSpecialChargesPriceUpdEnablingTime(data) {
  return request({
    url: `/costSpecialChargesPrice/updEnablingTime`,
    method: "put",
    data
  });
}


// 销售特殊费用价格修改生效时间
export function putCostSpecialChargesPriceCancelUp(id) {
  return request({
    url: `/costSpecialChargesPrice/cancelUp/${id}`,
    method: "put",
  });
}


// 销售特殊费用规则复制查询
export function getCostSpecialChargesRuleCopy(id) {
  return request({
    url: `/costSpecialChargesRule/copy/${id}`,
    method: "get",
  });
}



