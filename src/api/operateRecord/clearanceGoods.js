import request from "@/utils/request";

// 获取清关信息
export function getClearanceInfos(data) {
  return request({
    url: "/clearanceGoods/clearanceInfos",
    method: "post",
    data,
  });
}

// 操作记录查询
export function getOperationRecords(data) {
  return request({
    url: "/clearanceGoods/operationRecords",
    method: "post",
    data,
  });
}

// 临时页面新增
export function addClearanceProductInvoiceInPage(data) {
  return request({
    url: "/clearanceGoods/addClearanceProductInvoiceInPage",
    method: "post",
    data,
  });
}

// 查询清关箱单发票信息
export function selectClearanceInvoice(data) {
  return request({
    url: "/clearanceGoods/selectClearanceProductInvoiceByOperationId",
    method: "post",
    data,
  });
}

// 清关箱单发票导出
export function exportClearanceInvoice(data) {
  return request({
    url: "/clearanceGoods/clearance/invoice/export",
    method: "post",
    data,
  });
}
// 清关合并
export function clearanceMerge(data) {
  return request({
    url: "/clearanceGoods/clearanceMerge",
    method: "post",
    data,
  });
}
