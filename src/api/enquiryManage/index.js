import request from "@/utils/request";

// 新建编辑询价单
export function saveOrUpdateEnquiry(data) {
  return request({
    url: "/inquirySheet/saveOrUpdate",
    method: "post",
    data,
  });
}

// 删除询价单
export function deleteEnquiry({ id }) {
  return request({
    url: `/inquirySheet/delInquirySheet/${id}`,
    method: "delete",
  });
}

// 询价单变更（提交、撤回提交）
export function updateEnquiryState(data) {
  return request({
    url: "/inquirySheet/updInquirySheetState",
    method: "put",
    data,
  });
}

// 我的询价单列表
export function getEnquiryList(data) {
  return request({
    url: "/inquirySheet/page",
    method: "post",
    data,
  });
}

// 我的询价单详情
export function getEnquiryInfo({ id, queryPage }) {
  return request({
    url: `/inquirySheet/info/${queryPage}/${id}`,
    method: "get",
  });
}

// 打回报价单
export function rollbackQuotationSheet(data) {
  return request({
    url: "/inquirySheet/rollback",
    method: "put",
    data,
  });
}

// 报价单变更（提交、撤回提交）
export function updateQuotationState(data) {
  return request({
    url: "/inquirySheet/submitOrUnSubmit",
    method: "put",
    data,
  });
}

// 确认报价单
export function confirmQuotationSheet(id) {
  return request({
    url: `/inquirySheet/confirmQuotationSheet/${id}`,
    method: "put",
  });
}

// 新建、编辑方案
export function saveOrUpdateScheme(data) {
  return request({
    url: "/inquirySheet/saveOrUpdateScheme",
    method: "post",
    data,
  });
}

// 删除方案
export function delQuotationScheme(id) {
  return request({
    url: `/inquirySheet/delQuotationScheme/${id}`,
    method: "delete",
  });
}

// 分享方案
export function shareScheme(id) {
  return request({
    url: `/inquirySheet/shareScheme/${id}`,
    method: "get",
  });
}

// 更改报价人
export function updQuotationUser(data) {
  return request({
    url: "/inquirySheet/updQuotationUser",
    method: "put",
    data,
  });
}

// 更改港口
export function updatePort(data) {
  return request({
    url: "/inquirySheet/updatePort",
    method: "post",
    data,
  });
}

// 运价-获取报价信息
export function getQuotationInfo(data) {
  return request({
    url: "/operate/freightRate/quotation",
    method: "post",
    data,
  });
}

// 询价-获取报价信息
export function getCustomerQuotation(data) {
  return request({
    url: "/inquirySheet/getCustomerQuotation",
    method: "post",
    data,
  });
}

// 运价-生成报价单
export function saveFreightRateQuotation(data) {
  return request({
    url: "/quotationSheet/saveFreightRateQuotation",
    method: "post",
    data,
  });
}

// 询价-生成报价单
export function setCustomerQuotation(data) {
  return request({
    url: "/inquirySheet/setCustomerQuotation",
    method: "post",
    data,
  });
}

// 询价单复制列表
export function getCopyPage(data) {
  return request({
    url: "/inquirySheet/copyPage",
    method: "post",
    data,
  });
}

// 复制方案
export function copyQuotationScheme({ queryPage, id }) {
  return request({
    url: `/inquirySheet/copyQuotationScheme/${queryPage}/${id}`,
    method: "get",
  });
}

// 获取应付利润
export function getPayableProfit(data) {
  return request({
    url: "/inquirySheet/getPayableProfit",
    method: "post",
    data,
  });
}

// 设置应付利润
export function setPayableProfit(data) {
  return request({
    url: "/inquirySheet/setPayableProfit",
    method: "post",
    data,
  });
}
