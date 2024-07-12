import request from "@/utils/request";
import qs from "qs";

// 查询航线组列表
export function getAirGroupList(params) {
  return request({
    url: "/operate/code/list",
    method: "get",
    params,
  });
}

// 航线组详情查询
export function getAirlineGroupDetails(id) {
  return request({
    url: `/operate/code/${id}`,
    method: "get",
  });
}

// 查询航线信息
export function getAirlineList(params) {
  return request({
    url: "/operate/route/list",
    method: "get",
    params,
  });
}

// 查询航次信息
export function getAirFlightList(params) {
  return request({
    url: "/operate/route-no/list",
    method: "get",
    params,
  });
}

// 查询航线组的全部航次信息
export function getAllFlightList(params, code) {
  return request({
    url: `/operate/route-no/get-no/${code}`,
    method: "get",
    params,
  });
}

//航次新增
export function addAirFlight(data) {
  return request({
    url: `/operate/route-no`,
    method: "post",
    data,
  });
}

//航次订舱
export function operationBooking(data) {
  return request({
    url: "/operate/freightRate/operationBooking",
    method: "post",
    data,
  });
}

// 航次详情查询
export function getAirFlightDetails(id) {
  return request({
    url: `/operate/route-no/${id}`,
    method: "get",
  });
}

/**
 * 操作单详情航次详情查询
 * id: 航次ID
 * orderId: 操作单ID
 */
export function getOperateAirFlightDetails(id, orderId) {
  return request({
    url: `/operate/route-no/${id}/${orderId}`,
    method: "get",
  });
}

//航次修改
export function editAirFlight(data) {
  return request({
    url: `/operate/route-no`,
    method: "put",
    data,
  });
}

//航次删除
export function deleteAirFlight(id) {
  return request({
    url: `/operate/route-no/${id}`,
    method: "delete",
  });
}

// 航次新增舱位
export function addSortBatch(data) {
  return request({
    url: `/box/sort/batch`,
    method: "post",
    data,
  });
}

// 航次编辑舱位
export function editSortBatch(data) {
  return request({
    url: `/operate/route-no/edit-box`,
    method: "post",
    data,
  });
}

//航次删除
export function deleteSortBatch(id) {
  return request({
    url: `/box/sort/${id}`,
    method: "delete",
  });
}

//待订舱列表
export function getForBookingList(params) {
  return request({
    url: "/operate/route-no/wait-route",
    method: "get",
    params,
  });
}

//so No.登记列表
export function getSoNoList(params) {
  return request({
    url: "/box/sort/get-sono",
    method: "get",
    params,
  });
}

//补充so No.登记
export function addSoNoCheckIn(data) {
  return request({
    url: "/box/sort/batch",
    method: "post",
    data,
  });
}

//订舱
export function soNoCheckIn(data) {
  return request({
    url: "/operate/route-no/shipping-route",
    method: "post",
    data,
  });
}

//订舱编辑
export function editSoNoCheckIn(data) {
  return request({
    url: "/operate/route-no/edit-box",
    method: "post",
    data,
  });
}

//同行散货订舱
export function addPeerShipping(data) {
  return request({
    url: "/operate/route-no/peer-shipping",
    method: "post",
    data,
  });
}

// 航次详情操作单列表
export function getRouteOrder(params) {
  return request({
    url: "/box/sort/route-order",
    method: "get",
    params,
  });
}

//新增航线组信息
export function addOperateCode(data) {
  return request({
    url: "/operate/code",
    method: "post",
    data,
  });
}

//修改航线组信息
export function putOperateCode(data) {
  return request({
    url: "/operate/code",
    method: "put",
    data,
  });
}

//删除航线组信息
export function deleteOperateCode(id) {
  return request({
    url: `/operate/code/${id}`,
    method: "delete",
  });
}

//新增航线信息
export function addOperateRoute(data) {
  return request({
    url: "/operate/route",
    method: "post",
    data,
  });
}

//修改航线信息
export function putOperateRoute(data) {
  return request({
    url: "/operate/route",
    method: "post",
    data,
  });
}

//删除航线信息
export function deleteOperateRoute(id) {
  return request({
    url: `/operate/route/${id}`,
    method: "delete",
  });
}

//订舱登记
export function sonoCheck(data) {
  return request({
    url: "operate/sono/check",
    method: "post",
    data,
  });
}

//新增航次舱位
export function addSono(data) {
  return request({
    url: "operate/sono",
    method: "post",
    data,
  });
}

//so No.登记列表
export function getOperateSoNoList(params) {
  return request({
    url: "/operate/sono/list",
    method: "get",
    params,
  });
}

//so No.登记列表
export function getSonoGroupBoxModelList(params) {
  return request({
    url:
      "/operate/sono/groupBoxModel/list" +
      "?" +
      qs.stringify(params, { arrayFormat: "repeat" }),
    method: "get",
  });
}

// 查询航次管理详情左侧SONO信息
export function getRouteNoRoute(params) {
  return request({
    url: `/operate/route-no/route/${params.routeId}?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
    method: "get",
  });
}

//删除航次管理详情左侧SONO信息
export function deleteOperateSono(id) {
  return request({
    url: `/operate/sono/${id}`,
    method: "delete",
  });
}

//新增航次管理详情左侧SONO信息
export function addOperateSono(data) {
  return request({
    url: `/operate/sono`,
    method: "post",
    data,
  });
}
//修改航次管理详情左侧SONO信息
export function editOperateSono(data) {
  return request({
    url: `/operate/sono`,
    method: "put",
    data,
  });
}

/**
 * 操作单详情航次详情查询
 * operationId: 操作单ID
 */
export function getrouteNoByoperationId(operationId) {
  return request({
    url: `/operate/route-no/getBy/orderId/${operationId}`,
    method: "get",
  });
}

//查询操作单信息
export function getsonoDetailsData(id) {
  return request({
    url: `/operate/sono/getOperationOrderInfo/${id}`,
    method: "get",
  });
}

//SONO信息列表接口
export function getSonoPageLists(data) {
  return request({
    url: `/operate/sono/list/page`,
    method: "post",
    data,
  });
}

//SONO信息列表删除
export function deleteSono(id) {
  return request({
    url: `/operate/sono/page/${id}`,
    method: "get",
  });
}

//SONO信息视图查询
export function getSonoViewLists(data) {
  return request({
    url: `/operate/sono/list/page/view`,
    method: "post",
    data,
  });
}

//市场订舱与操作订舱列表
export function getRouteNoWaitRouteNew(data) {
  return request({
    url: `/operate/route-no/wait-route/new`,
    method: "post",
    data,
  });
}

// 市场订舱与操作已订舱解绑
export function putBookingUnCheck(opt) {
  const { id, ...data } = opt || {};
  return request({
    url: `/operate/sono/unCheck/${id}`,
    method: "put",
    data,
  });
}

//获取订舱初始化数据
export function getRouteNoBookingInfo(id) {
  return request({
    url: `/operate/route-no/getBookingInfo/${id}`,
    method: "get",
  });
}

// 海运操作单订舱代理信息
export function getOperationBookingInfo(obj) {
  const { id } = obj || {};
  return request({
    url: `/operation/transportation/getReplaceBookingAgentInfo/${id}`,
    method: "get",
  });
}

// 可选更换订舱代理
export function postOperationBookingList(data) {
  return request({
    url: `/operation/transportation/getReplaceBookingAgentList`,
    method: "post",
    data,
  });
}

// 订舱代理变更保存
export function postOperationBookingChange(data) {
  return request({
    url: `/operation/transportation/changeReplaceBookingAgent`,
    method: "post",
    data,
  });
}

// 分单号维护

export function editHblNo(data) {
  return request({
    url: "/operate/route-no/editHblNo",
    method: "post",
    data,
  });
}

//FCL航次登记修改
export function POSTRouteNoManageFcl(data) {
  return request({
    url: "/operate/sono/updateRouteNoManageFcl",
    method: "post",
    data,
  });
}

//航次新增编辑前调用
export function POSTOrderIsolateConfig(params) {
  return request({
    url: "/take/orderIsolateConfig/getAllByType",
    method: "get",
    params,
  });
}

// 当前sono操作单绑定多少个sono数量
export function getAssociatedQuantity(id) {
  return request({
    url: `/operate/sono/associatedQuantity/${id}`,
    method: "get",
  });
}

// 更改航次
export function changeRouteNoManage(data) {
  return request({
    url: "/operate/sono/changeRouteNoManage",
    method: "post",
    data,
  });
}

// 海外清关离港
export function updateClearanceArrival(data) {
  return request({
    url: `/oversea/clearance/order/updateArrival`,
    method: "put",
    data,
  });
}

// // 当前sono操作单绑定多少个sono数量
// export function getAssociatedQuantity(id) {
//   return request({
//     url: `/operate/sono/associatedQuantity/${id}`,
//     method: "get",
//   });
// }

// // 更改航次
// export function changeRouteNoManage(data) {
//   return request({
//     url: "/operate/sono/changeRouteNoManage",
//     method: "post",
//     data,
//   });
// }

// 航线组信息启用
export function setRouteEnable(id) {
  return request({
    url: `/operate/route/enable/${id}`,
    method: "put",
  });
}
// 航线组信息禁用
export function setRouteDisable(id) {
  return request({
    url: `/operate/route/disable/${id}`,
    method: "put",
  });
}

// 航线信息启用
export function setCodeEnable(id) {
  return request({
    url: `/operate/code/enable/${id}`,
    method: "put",
  });
}
// 航线信息禁用
export function setCodeDisable(id) {
  return request({
    url: `/operate/code/disable/${id}`,
    method: "put",
  });
}
// 订舱打回
export function sendBackFcl({ id, ...data }) {
  return request({
    url: `/operate/route-no/sendBackFcl/${id}`,
    method: "post",
    data,
  });
}
