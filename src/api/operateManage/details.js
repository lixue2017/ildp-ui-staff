import request from "@/utils/request";

// 获取报关信息
export function getCustomInfo(params) {
  return request({
    url: "/pop/cus/getDecleareByOperationOrderId",
    method: "get",
    params,
  });
}

// 获取拖车信息
export function getTrailerInfo(params) {
  return request({
    url: "/pop/trailer/getTrailerByOperationOrderId",
    method: "get",
    params,
  });
}

// 操作节点获取一般拖车ID
export function getGeneralTrailer(params) {
  return request({
    url: "/pop/trailer/getYbTrailerByOperationOrderId",
    method: "get",
    params,
  });
}

// 获取操作单当前主体
export function getOperateMain(params) {
  return request({
    url: `operation/transportation/getOperateMain?operationOrderNum=${params}`,
    method: "get",
  });
}

// 保险附件
export function postUploadInsurance(data) {
  return request({
    url: "/logistics/order/uploadInsuranceAttach",
    method: "post",
    data,
  });
}

// 货物数据模板导出
export function exportGoodsRelationProduct(params) {
  return request({
    url: "/customer/product/exportGoodsRelationProduct",
    method: "get",
    params,
  });
}

// 提交单箱发票导入数据-已核实
export function addGoodOfProduct(data) {
  return request({
    url: "/customer/product/addGoodOfProduct",
    method: "post",
    data,
  });
}

// 提交单箱发票导入数据-已预报未核实
export function addForecastGoodOfProduct(data) {
  return request({
    url: "/customer/product/addForecastGoodOfProduct",
    method: "post",
    data,
  });
}

// 货物数据模板导出-客户箱单发票
export function exportGoodsCustomerInvoice(params) {
  return request({
    url: "/customer/product/verify/exportGoodsRelationProduct",
    method: "get",
    params,
  });
}

// 客户箱单发票-查询/维护
export function getCustomerInvoiceList(params) {
  return request({
    url: "/customer/product/verify/exportGoodsRelationProductList",
    method: "get",
    params,
  });
}

// 提交单箱发票导入数据-客户箱单发票
export function addVerifyGoodOfProduct(data) {
  return request({
    url: "/customer/product/verify/addGoodOfProduct",
    method: "post",
    data,
  });
}

// 获取清报关信息
export function getCustomDeclarationInfo(data) {
  return request({
    url: "/pop/cus/getDecleareInfoListByOperationOrderId",
    method: "post",
    data,
  });
}

// 下载清报关资料
export function postCustomBatchDownloadAttach(data) {
  return request({
    url: "/pop/cus/batchDownloadAttach",
    method: "post",
    data,
  });
}
