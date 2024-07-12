import request from "@/utils/request";

// 批次库存
export function getBatchStockList(params) {
  return request({
    url: "/warehouse/location/batch-stock",
    method: "get",
    params,
  });
}

// 批量库存-新
export function getBatchStockLogList(data) {
  return request({
    url: "/warehouse/batchStock/page",
    method: "post",
    data,
  });
}

// 库存调整
export function postAdjustStock(data) {
  return request({
    // url: '/warehouse/batchStock/adjustStock',
    url: "/wsaac/apply",
    method: "post",
    data,
  });
}

// 移动库位
export function postMoveLocation(data) {
  return request({
    url: "/warehouse/batchStock/moveLocation",
    method: "post",
    data,
  });
}

// 批次库存导出
export function exportBatchInventory(data) {
  return request({
    url: "/warehouse/batchStock/exprotExcelList",
    method: "post",
    data,
  });
}

// 批次库存统计
export function getBatchStockPageSum(data) {
  return request({
    url: "/warehouse/batchStock/pageSum",
    method: "post",
    data,
  });
}

// 库存审批列表
export function getStockApprovalList(data) {
  return request({
    url: "/wsaac/pageList",
    method: "post",
    data,
  });
}

// 库存审核打回
export function postStockApprovalReject(data) {
  return request({
    url: "/wsaac/reviewReject",
    method: "post",
    data,
  });
}

// 库存审核通过
export function postStockApprovalSave(data) {
  return request({
    url: "/wsaac/approved",
    method: "post",
    data,
  });
}

// 库存审核修改
export function postStockApprovalEdit(data) {
  return request({
    url: "/wsaac/updApply",
    method: "post",
    data,
  });
}

// 库存审核删除
export function delStockApproval(applyId) {
  return request({
    url: `/wsaac/delApple/${applyId}`,
    method: "DELETE",
  });
}
