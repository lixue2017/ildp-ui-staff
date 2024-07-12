import request from "@/utils/request";

// 查询运价列表
export function getFreightRateList(params) {
  return request({
    url: "/operate/freightRate/page",
    method: "get",
    params,
  });
}

// 新建、编辑运价信息
export function saveOrUpdateFreightRate(data) {
  return request({
    url: "/operate/freightRate/saveOrUpdate",
    method: "post",
    data,
  });
}

// 运价信息详情
export function getFreightRateInfo(id) {
  return request({
    url: `/operate/freightRate/getInfo/${id}`,
    method: "get",
  });
}

// 运价附加费信息列表
export function getSurchargeList(id) {
  return request({
    url: `/operate/freightRate/surcharge/${id}`,
    method: "get",
  });
}

// 运价信息启用禁用
export function enableDisableFreightRate({ id }) {
  return request({
    url: `/operate/freightRate/enableDisable/${id}`,
    method: "PUT",
  });
}

// 删除运价信息
export function delFreightRate({ id }) {
  return request({
    url: `/operate/freightRate/del/${id}`,
    method: "delete",
  });
}

// 复制运价信息
export function copyFreightRate(id) {
  return request({
    url: `/operate/freightRate/copy/${id}`,
    method: "get",
  });
}

// 获取订舱预估费用
export function getBookingCost(params) {
  return request({
    url: "/operate/freightRate/bookingCost",
    method: "get",
    params,
  });
}

// 获取待订舱的数据
export function getWaitBooking(data) {
  return request({
    url: "/operate/freightRate/waitBooking",
    method: "post",
    data,
  });
}

// 订舱
export function freightRateBooking(data) {
  return request({
    url: "/operate/freightRate/booking",
    method: "post",
    data,
  });
}

// 获取附加费类型列表
export function getFreightRateCostType() {
  return request({
    url: "/operate/freightRate/getCostType",
    method: "get",
  });
}
