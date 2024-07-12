import request from "@/utils/request";

// crm联系人分页列表
export function getSalesLeadsContact(data) {
  return request({
    url: "/crm/salesLeadsContact/page",
    method: "post",
    data,
  });
}
// 新建、编辑crm联系人
export function saveOrUpdateContact(data) {
  return request({
    url: "/crm/salesLeadsContact/saveOrUpdate",
    method: "post",
    data,
  });
}
// 批量删除
export function batchDelContact(data) {
  return request({
    url: "/crm/salesLeadsContact/batchDel",
    method: "DELETE",
    data,
  });
}
// 删除crm联系人
export function delContact({ id }) {
  return request({
    url: `/crm/salesLeadsContact/del/${id}`,
    method: "DELETE",
  });
}
// 联系人导出
export function exportSalesLeadsContact(data) {
  return request({
    url: "/crm/salesLeadsContact/export",
    method: "post",
    data,
  });
}
// crm联系人详情
export function getSalesLeadsContactInfo(id) {
  return request({
    url: `/crm/salesLeadsContact/getInfo/${id}`,
    method: "get",
  });
}
// 导入
export function importExcelContact(data) {
  return request({
    url: "/crm/salesLeadsContact/importExcel",
    method: "post",
    data,
  });
}
// 操作记录导出
export function operationRecordExport(data) {
  return request({
    url: "/crm/salesLeadsContact/operationRecordExport",
    method: "post",
    data,
  });
}
// 操作记录分页列表
export function getOperationRecordPage(data) {
  return request({
    url: "/crm/salesLeadsContact/operationRecordPage",
    method: "post",
    data,
  });
}
// 动态分页列表
export function getContactDynamicPage(data) {
  return request({
    url: "/crm/salesLeadsContact/dynamicPage",
    method: "post",
    data,
  });
}
