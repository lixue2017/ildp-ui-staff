import request from "@/utils/request";

// 日统计报表
export function getReportOfDay(data) {
  return request({
    url: "/reportOfDay",
    method: "post",
    data,
  });
}
// 月统计报表
export function getReportOfMonth(data) {
  return request({
    url: "/reportOfMonth",
    method: "post",
    data,
  });
}
// 委托人统计报表
export function getReportOfCustomer(data) {
  return request({
    url: "/reportOfCustomer",
    method: "post",
    data,
  });
}
// 业务员统计报表
export function getReportOfSalesMan(data) {
  return request({
    url: "/reportOfSalesMan",
    method: "post",
    data,
  });
}
// 月业务类型统计报表
export function getReportOfMonthAndOrderType(data) {
  return request({
    url: "/reportOfMonthAndOrderType",
    method: "post",
    data,
  });
}
// 统计报表总览
export function getReportOfGeneralView(data) {
  return request({
    url: "/reportOfGeneralView",
    method: "post",
    data,
  });
}
// 业务报表-导出
export function reportOfGeneralViewExport(data) {
  return request({
    url: "/reportOfGeneralViewExport",
    method: "post",
    data,
  });
}
