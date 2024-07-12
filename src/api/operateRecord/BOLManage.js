import request from "@/utils/request";

// 新增提单信息
export function addPopBill(data) {
  return request({
    url: "/pop/bill",
    method: "post",
    data,
  });
}

// 编辑提单信息
export function updatePopBill(data) {
  return request({
    url: "/pop/bill",
    method: "put",
    data,
  });
}

// 删除提单信息
export function deletePopBill(obj) {
  const { id, operationOrderId } = obj || {};
  return request({
    url: `/pop/bill/${id}/${operationOrderId}`,
    method: "delete",
  });
}

// 修改提单信息与DRAFT查验
export function editPopBill(data) {
  return request({
    url: "/pop/bill/updateStatus",
    method: "put",
    data,
  });
}

// 查询提单新增列表
export function getHblOrMblList(params) {
  return request({
    url: "/pop/bill/getHblOrMblList",
    method: "get",
    params,
  });
}

// 查询提单新增列表
export function getPopBillList(data) {
  return request({
    url: "/pop/bill/list",
    method: "post",
    data,
  });
}

// 查询提单详情
export function getPopBillDetail(id) {
  return request({
    url: `/pop/bill/getBillById?id=${id}`,
    method: "get",
  });
}

// 查询提单详情装货类型(HBL或MBL)   只有修改用这个
export function getHblorMblDetail(params, isOperation) {
  let url = `/pop/bill/getBillByOperationOrderId?isOperation=${
    isOperation || 0
  }`;
  return request({
    url,
    method: "get",
    params,
  });
}

// 操作单详情获取MBL单数据
export function getDetailMblList(params) {
  return request({
    url: `/pop/bill/selectBillMblByOrderId`,
    method: "get",
    params,
  });
}

// 提单预览
export function getBillDetailPreview(params) {
  return request({
    url: `/pop/bill/checkPreviewDownload`,
    method: "get",
    params,
  });
}

// 提单预览-电放保函
export function getBackLetterDetailPreview(params) {
  return request({
    url: "/pop/bill/backletter/checkPreviewDownload",
    method: "get",
    params,
  });
}

// operationOrderId操作单Id查询HBl列表 isMerge=0 - 查询退税提单
export function getDetailHblList(params) {
  return request({
    url: `/pop/bill/selectBillHblByOrderId`,
    method: "get",
    params,
  });
}

// 操作单Id查询退税提单
export function getTaxRefundList(params) {
  return request({
    url: `/pop/bill/selectBillRefundByOpId`,
    method: "get",
    params,
  });
}

// 电商操作单提单退税详情
export function getTaxRefundBillById(params) {
  return request({
    url: `/pop/bill/getRefundBillById`,
    method: "get",
    params,
  });
}

// 电商操作单新增提单退税
export function postTaxRefundBill(data) {
  return request({
    url: `/pop/bill/addRefundBill`,
    method: "post",
    data,
  });
}

// 查询提单详情装货类型
export function getLCLdetail(sortBoxId, id) {
  return request({
    url: `/pop/bill/getBillBySortBoxId?sortBoxId=${sortBoxId}&id=${id}`,
    method: "get",
  });
}

// 查询单个ID拼柜详情
export function getLCLDetailById(id) {
  return request({
    url: `/pop/bill/getBillSortBoxById?id=${id}`,
    method: "get",
  });
}

// 查询提单新增与编辑详情 ?operationOrderId=${operationOrderId}&type=${type}&queryType=${queryType}
export function getBillByOperationOrderinfo(params) {
  return request({
    url: `/pop/bill/getBillByOperationOrderinfo`,
    method: "get",
    params,
  });
}

// 通过操作单ID查提单ID
export function getLadingBillByOperationOrderId(operationOrderId) {
  return request({
    url: `/pop/bill/getLadingBillByOperationOrderId?operationOrderId=${operationOrderId}`,
    method: "get",
  });
}

// 通过操作单ID查提单详情
export function getBillByIdInfo(operationOrderId) {
  return request({
    url: `/pop/bill/getBillByIdInfo?operationOrderId=${operationOrderId}`,
    method: "get",
  });
}

// 提单/删除货物信息
export function delLadingOrRecover(data) {
  return request({
    url: `/order/goods/deleteOrRecover`,
    method: "post",
    data,
  });
}

// 保险模板导出导出
export function insurancePreviewDownload(params) {
  return request({
    url: "/pop/bill/insurancePreviewDownload",
    method: "get",
    params,
  });
}

// 中进宝补料导出
export function getZJBPreviewDownload(params) {
  return request({
    url: "/pop/bill/supplementaryFeedingPreviewDownload",
    method: "get",
    params,
  });
}

// 提单MBL/HBL/货物信息下载预览
export function GETCtCheckPreviewDownload(params) {
  return request({
    url: "/pop/bill/ctCheckPreviewDownload",
    method: "get",
    params,
  });
}
