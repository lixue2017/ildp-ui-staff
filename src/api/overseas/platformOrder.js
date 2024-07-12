import request from "@/utils/request";

//获取海外订单列表
export function getOverseasList(params) {
  let url = "/staff/order/overseas/list";
  return request({
    url,
    method: "get",
    params,
  });
}

//平台订单列表
export function getPlatformOrderList(params) {
  let url = "/staff/order/platform/list";
  return request({
    url,
    method: "get",
    params,
  });
}

// FBA/一件代发贴标计划分页列表
export function getOutboundLabelList(data) {
  return request({
    url: `/outboundLabeling/pageList`,
    method: "post",
    data,
  });
}

// FBA/一件代发贴标完成
export function putOutboundLabelFinish(data) {
  return request({
    url: "/outboundLabeling/finish",
    method: "PUT",
    data,
  });
}