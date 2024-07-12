import request from "@/utils/request";
//海运订单列表
export function tradition(query) {
  return request({
    url: "/customer/order/tradition/list",
    method: "get",
    params: query,
  });
}

//海运订单查看详情
export function traditionId(query) {
  return request({
    url: `/order/tradition/${query}`,
    method: "get",
  });
}
//海运订单修改详情
export function putTradition(data) {
  return request({
    url: `/order/tradition/update`,
    method: "put",
    data,
  });
}

//海运订单列表-查询货物信息列表
export function getFreightList(query) {
  return request({
    url: "/customer/order/freight/list",
    method: "get",
    params: query,
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
//海运订单货物信息删除
export function deleteOrderFreight(query) {
  return request({
    url: `/customer/order/freight/${query}`,
    method: "delete",
  });
}

//海运订单列表-查询提货信息列表
export function getFreightTakeList(query) {
  return request({
    url: "/customer/order/freightTake/list",
    method: "get",
    params: query,
  });
}

// 产品信息新增
export function addTradition(data) {
  return request({
    url: "/order/tradition",
    method: "post",
    data,
  });
}

//海运订单删除数据
export function deleteTradition(query) {
  return request({
    url: `/order/tradition/${query}`,
    method: "delete",
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
//目的港与装运港筛选查表
export function portList2(query) {
  return request({
    url: "/operate/port/list2",
    method: "get",
    params: query,
  });
}

// 查询箱型尺寸列表
export function getSizeListSea(params) {
  return request({
    url: "/operate/size/list",
    method: "get",
    params: {
      ...params,
      nameCn: params.name,
    },
  });
}

// 海运订单设置提货地址
export function addfreightTake(data) {
  return request({
    url: "/customer/order/freightTake/addAll",
    method: "post",
    data,
  });
}

//海运订单提货信息删除
export function deleteOrderFreightTake(query) {
  return request({
    url: `/customer/order/freightTake/${query}`,
    method: "delete",
  });
}

// 列表复制
export function copyTradition(orderId) {
  return request({
    url: `/order/tradition/copy?orderId=${orderId}`,
    method: "post",
    orderId,
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

// 提货信息修改
export function editOrderFreightTake(data) {
  return request({
    url: "/customer/order/freightTake",
    method: "put",
    data,
  });
}

//传统订单动态标签
export function GETTraditionNewList(params) {
  return request({
    url: "/order/tradition/newList",
    method: "get",
    params,
  });
}
