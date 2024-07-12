import request from "@/utils/request";

// 报价单列表
export function getQuotationSheetList(params) {
  return request({
    url: "/quotationSheet/page",
    method: "get",
    params,
  });
}

// 报价单详情
export function getQuotationSheetInfo({ id }) {
  return request({
    url: `/quotationSheet/detail/${id}`,
    method: "get",
  });
}

// 关联订单下拉数据
export function pendingRelatedOrderList(data) {
  return request({
    url: "/quotationSheet/pendingRelatedOrderList",
    method: "post",
    data,
  });
}

// 关联订单
export function orderRelated(data) {
  return request({
    url: "/quotationSheet/orderRelated",
    method: "post",
    data,
  });
}

// 关联报价
export function overseaOrderRelated(data) {
  return request({
    url: "/quotationSheet/overseaOrderRelated",
    method: "post",
    data,
  });
}

// 确认方案
export function confirmationScheme(data) {
  return request({
    url: "/quotationSheet/confirmationScheme",
    method: "post",
    data,
  });
}

// 分享报价/方案
export function getShareQuotation({ type, id, ...params }) {
  return request({
    url: `/quotationSheet/share/${type}/${id}`,
    method: "get",
    params,
  });
}

// 询价-获取报价单编辑信息
export function getEditQuotation(data) {
  return request({
    url: "/quotationSheet/getEditQuotation",
    method: "post",
    data,
  });
}

// 询价-编辑报价信息
export function editQuotation(data) {
  return request({
    url: "/quotationSheet/editQuotation",
    method: "post",
    data,
  });
}

// 报价单下拉列表
export function getQuotationSelect(params) {
  return request({
    url: "/quotationSheet/select",
    method: "get",
    params,
  });
}
