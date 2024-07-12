import request from "@/utils/request";

// 销售线索分页列表
export function getSalesLeads(data) {
  return request({
    url: "/crm/salesLeads/page",
    method: "post",
    data,
  });
}
// 领取线索
export function getSalesClaimLead(data) {
  return request({
    url: "/crm/salesLeads/claimLead",
    method: "post",
    data,
  });
}
// 导出公共线索
export function getCommunalExport(data) {
  return request({
    url: "/crm/salesLeads/communalExport",
    method: "post",
    data,
  });
}
// 公共线索分页列表
export function getCommunalPage(data) {
  return request({
    url: "/crm/salesLeads/communalPage",
    method: "post",
    data,
  });
}
// 删除销售线索
export function delSalesLeads(id) {
  return request({
    url: `/crm/salesLeads/del/${id}`,
    method: "DELETE",
  });
}
// 导出销售线索
export function salesLeadsExport(data) {
  return request({
    url: "/crm/salesLeads/export",
    method: "post",
    data,
  });
}
// 销售线索详情
export function getSalesLeadsInfo(id) {
  return request({
    url: `/crm/salesLeads/getInfo/${id}`,
    method: "get",
  });
}
// 操作记录导出
export function operationRecordExport(data) {
  return request({
    url: "/crm/salesLeads/operationRecordExport",
    method: "post",
    data,
  });
}
// 操作记录分页列表
export function getOperationRecordPage(data) {
  return request({
    url: "/crm/salesLeads/operationRecordPage",
    method: "post",
    data,
  });
}
// 置顶销售线索
export function getSalesLeadsPinned(id) {
  return request({
    url: `/crm/salesLeads/pinned/${id}`,
    method: "put",
  });
}
// 新建、编辑销售线索
export function saveOrUpdateSalesLeads(data) {
  return request({
    url: "/crm/salesLeads/saveOrUpdate",
    method: "post",
    data,
  });
}
// 转移线索
export function transferSalesLeads(data) {
  return request({
    url: "/crm/salesLeads/transferLead",
    method: "post",
    data,
  });
}
// 转为客户
export function transferToCustomer(data) {
  return request({
    url: "/crm/salesLeads/transferToCustomer",
    method: "post",
    data,
  });
}
// 修改销售线索状态
export function updateSalesLeadsState(data) {
  return request({
    url: "/crm/salesLeads/updateState",
    method: "put",
    data,
  });
}
// 转为客户
export function convertCommunalize(data) {
  return request({
    url: "/crm/salesLeads/communalize",
    method: "post",
    data,
  });
}

// 动态分页列表
export function getSalesLeadsDynamicPage(data) {
  return request({
    url: "/crm/salesLeads/dynamicPage",
    method: "post",
    data,
  });
}
