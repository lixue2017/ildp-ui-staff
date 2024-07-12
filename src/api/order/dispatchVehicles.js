import request from "@/utils/request";

// 新建或更新约车/派车
export function addReservationCar(data) {
  return request({
    url: "/staffOrderReservationCar",
    method: "post",
    data,
  });
}

// 取消约车/派车
export function cancelReservationCar({ id }) {
  return request({
    url: `/staffOrderReservationCar/cancel/${id}`,
    method: "put",
  });
}

// 约车/派车列表
export function getReservationCarList(params) {
  return request({
    url: "/staffOrderReservationCar/page",
    method: "get",
    params,
  });
}

// 约车/派车详情
export function getReservationCarDetail(obj) {
  const { id, ...params } = obj || {};
  return request({
    url: `/staffOrderReservationCar/getInfo/${id}`,
    method: "get",
    params,
  });
}

// 入仓预约列表
export function getReservationWarehousingList(params) {
  return request({
    url: "/staffOrderReservationWarehousing/page",
    method: "get",
    params,
  });
}

// 车辆通行记录
export function getVehicleTrafficRecord(data) {
  return request({
    url: "/staffOrderReservationWarehousing/vehicleTrafficRecord",
    method: "post",
    data,
  });
}

// 待约车订单列表
export function getNotReservationCarList(params) {
  return request({
    url: "/staffOrderReservationCar/getNotReservationOrderPage",
    method: "get",
    params,
  });
}

// 已约车订单列表
export function getOrderReservationCarList(params) {
  return request({
    url: "/staffOrderReservationCar/getReservationOrderPage",
    method: "get",
    params,
  });
}

// 查询电商头程订单货物列表
export function getOrderCarEcFreightList(params) {
  return request({
    url: "/staffOrderReservationCar/getOrderEcFreightList",
    method: "get",
    params,
  });
}
