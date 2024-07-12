import request from "@/utils/request";
//其他订单列表
export function getOrderOtherList(query) {
  return request({
    url: "/customer/order/other/list",
    method: "get",
    params: query,
  });
}

//其他订单修改-保存草稿与提交预报
export function putOrderOther(data) {
  return request({
    url: `/order/other`,
    method: "put",
    data,
  });
}
// 其他订单新增列表
export function addOtherTradition(data) {
  return request({
    url: "/order/other",
    method: "post",
    data,
  });
}
//其他订单删除列表
export function deleteOrderTradition(query) {
  return request({
    url: `/order/other/${query}`,
    method: "delete",
  });
}
//其他订单查看详情
export function getOrderOtherDetail(query) {
  return request({
    url: `/order/other/${query}`,
    method: "get",
  });
}

//目的港与装运港查表
export function portList(query) {
  return request({
    url: "/operate/port/list",
    method: "get",
    params: query,
  });
}

//其他订单列表-查询货物信息列表
export function getFreightList(query) {
  return request({
    url: "/customer/order/freight/list",
    method: "get",
    params: query,
  });
}

//其他订单-复制列表数据
export function copyOrderOther(orderId) {
  return request({
    url: `/order/other/copy?orderId=${orderId}`,
    method: "post",
    orderId,
  });
}

// 货物信息新增
export function addOrderFreight(data) {
  return request({
    url: "/customer/order/freight",
    method: "post",
    data,
  });
}

// 货物信息修改
export function editOrderFreight(data) {
  return request({
    url: "/customer/order/freight",
    method: "put",
    data,
  });
}

//提货信息修改
export function editOrderFreightTake(data) {
  return request({
    url: "/customer/order/freightTake",
    method: "put",
    data,
  });
}
//货物信息删除
export function deleteOrderFreight(query) {
  return request({
    url: `/customer/order/freight/${query}`,
    method: "delete",
  });
}

//空运订单列表-查询提货信息列表
export function getFreightTakeList(query) {
  return request({
    url: "/customer/order/freightTake/list",
    method: "get",
    params: query,
  });
}
//海运订单提货信息删除
export function deleteOrderFreighttake(query) {
  return request({
    url: `/customer/order/freightTake/${query}`,
    method: "delete",
  });
}

// 空运订单-设置提货信息
export function setOrderFreightTake(data) {
  return request({
    url: "/customer/order/freightTake/addAll",
    method: "post",
    data,
  });
}
