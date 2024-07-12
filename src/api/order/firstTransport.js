import request from "@/utils/request";

// 获取运输方式下拉列表
export function getServiceChannel(params) {
  return request({
    url: "/customer/ec/service/channel/list",
    method: "get",
    params,
  });
}

// 获取清关方式下拉列表
export function getCustomsClearance(cusContactsId, clearanceTypes) {
  const WEB_PARAMS =
    typeof clearanceTypes == "object"
      ? {
          cusContactsId,
          ...clearanceTypes,
        }
      : {
          cusContactsId,
          clearanceTypes,
        };
  return request({
    url: "/customer/customsClearance/list",
    method: "get",
    params: WEB_PARAMS,
  });
}

// 新增清关方式
export function addCustomsClearance(data) {
  return request({
    url: "/customer/customsClearance/staff",
    method: "post",
    data,
  });
}

// 获取电商头程列表
export function getECList(params) {
  return request({
    url: "/staff/ec/list",
    method: "get",
    params,
  });
}

// 获取订单电商头程列表
export function getOrderECList(data) {
  return request({
    url: "/staff/ec/getDsPage",
    method: "post",
    data,
  });
}

// 获取电商头程详情
export function getECDetail(id) {
  return request({
    url: `/customer/ec/${id}`,
    method: "get",
  });
}

// 获取货物信息列表
export function getFreightList(params) {
  return request({
    url: "/customer/ec/freight/list",
    method: "get",
    params,
  });
}

// 获取货物信息列表
export function getEcFreightList(params) {
  return request({
    url: "/staff/ec/freight/verifyList",
    method: "get",
    params,
  });
}

// 维护电商货物信息列表
export function getEcFreightEdit(data) {
  return request({
    url: "/staff/ec/freight/edit",
    method: "post",
    data,
  });
}

// 维护电商货物信息列表-New
export function getEcFreightNewEdit(data) {
  return request({
    url: "/staff/ec/freight/newEdit",
    method: "post",
    data,
  });
}

// 核实货物信息
export function getGoodsList(data) {
  return request({
    url: "/order/goods/list",
    method: "post",
    data,
  });
}

// 获取货物产品列表
export function getFreightProductList(params) {
  if (!params.orderEcId) {
    return new Promise((resolve) => {
      resolve({});
    });
  }
  return request({
    url: "/customer/ec/freight/get/ec/product/info",
    method: "GET",
    params,
  });
}

// 获取提货信息列表
export function getTakeList(params) {
  return request({
    url: "/customer/ec/take/list",
    method: "get",
    params,
  });
}
// 电商订单详情获取整柜列表
export function getEcBoxList(params) {
  return request({
    url: "/staff/ec/box/list",
    method: "get",
    params,
  });
}
// 获取整柜信息列表
export function getBoxList(data) {
  return request({
    url: "/order/goods/list",
    method: "post",
    data,
  });
}
// export function getBoxList(params) {
//   return request({
//     url: '/customer/ec/box/list',
//     method: 'get',
//     params
//   })
// }

// 新增整柜信息
export function saveOrderBox(data) {
  return request({
    url: "/order/goods/save",
    method: "post",
    data,
  });
}

// 修改整柜信息
export function updateOrderBox(data) {
  return request({
    url: "/order/goods/update",
    method: "post",
    data,
  });
}

// 删除&恢复整柜信息
export function operationBoxState(data) {
  return request({
    url: "/order/goods/deleteOrRecover",
    method: "post",
    data,
  });
}

// 订单业务提交
export function businessSubmit(id) {
  return request({
    url: `/staff/ec/acceptBill/businessSubmit/${id}`,
    method: "put",
  });
}

// 订单操作接单
export function operateSubmit(id, status, data) {
  return request({
    url: `/staff/ec/acceptBill/operate/${id}/${status}`,
    method: "put",
    data,
  });
}

// 业务提交最新集合接口
export function businessSubmitGather(type, id, businessRemark) {
  return request({
    url: `/order/tradition/acceptBill/businessSubmit`,
    method: "post",
    data: {
      type,
      id,
      businessRemark,
    },
  });
}

// 操作接单最新集合接口
export function operateSubmitGather(type, id, status, data) {
  return request({
    url: `/order/tradition/acceptBill/operate/${type}/${id}/${status}`,
    method: "put",
    data,
  });
}

// 操作单操作接单接口
export function operateById(id, status, data = {}) {
  return request({
    url: `/order/tradition/acceptBill/operateById/${id}/${status}`,
    method: "put",
    data,
  });
}

// 操作单操作批量接单
export function postBatchOrderReceiving(data) {
  return request({
    url: `/order/tradition/acceptBill/operateById/savelist`,
    method: "post",
    data,
  });
}

// 操作接单后打回
export function postBusinessRepulse(data) {
  return request({
    url: `/order/tradition/operation/businessRepulse`,
    method: "post",
    data,
  });
}

// 根据订单Id查询订舱信息
export function getRouteByOrderId(params) {
  return request({
    url: "/operate/route-no/getRouteByOrderId",
    method: "GET",
    params,
  });
}

// 订单详情修改业务备注
export function businessRemarkSubmit(data) {
  return request({
    url: "/order/tradition/acceptBill/businessRemarkSubmit",
    method: "post",
    data,
  });
}

// 打回
export function businessRepulse(data) {
  return request({
    url: "/order/tradition/acceptBill/businessRepulse",
    method: "post",
    data,
  });
}

// 入库核实导出
export function exportOperationTransportation(data) {
  return request({
    url: "/operation/transportation/export",
    method: "post",
    data,
  });
}

// 电商核实货物信息导出
export function exportOrderGoods(data) {
  return request({
    url: "/order/goods/exportExcelList",
    method: "post",
    data,
  });
}

// 获取货物列表
export function getMaintainGoodsList(orderId, type) {
  return request({
    url: `/customer/ec/getFreghtInfo/${orderId}/${type}`,
    method: "get",
  });
}

// 更新货物信息
export function updateMaintainGoodsList(data) {
  return request({
    url: "/customer/ec/updFreghtInfo",
    method: "put",
    data,
  });
}

// 电商入仓详情获取货物列表（按箱）
export function getProductOrderEc(orderId) {
  return request({
    url: `/warehouse/stroage/product/orderEc/${orderId}`,
    method: "get",
  });
}

// 第三方入仓详情获取货物列表（按箱）
export function getEcProductThirdPartyOrder(orderId) {
  return request({
    url: `/warehouse/stroage/product/thirdPartyOrder/${orderId}`,
    method: "get",
  });
}

// 海外入仓详情获取货物列表（按箱）
export function getEcProductClearance(orderId) {
  return request({
    url: `/warehouse/stroage/product/clearance/${orderId}`,
    method: "get",
  });
}

// 电商订单导出
export function exportQTOrderList(data) {
  return request({
    url: "/staff/ec/exportDsPage",
    method: "post",
    data,
  });
}

// 传统订单导出
export function exportTraditionList(params) {
  return request({
    url: "/order/tradition/exportList",
    method: "get",
    params,
  });
}

// 其他订单导出
export function exportOtherList(params) {
  return request({
    url: "/order/other/exportList",
    method: "get",
    params,
  });
}

// 接单动态字段
export function getOrderConfigList(orderId, orderType) {
  return request({
    url: `/take/orderIsolateConfig/getOrderConfigList/${orderId}/${orderType}`,
    method: "get",
  });
}

// 接单动态字段-操作单id获取
export function getOperationOrderConfigList(operationOrderId) {
  return request({
    url: `/take/orderIsolateConfig/getOperationOrderConfigList/${operationOrderId}`,
    method: "get",
  });
}

// 业务提交新方法（电商和传统）
export function billBusinessSubmit(data) {
  return request({
    url: "/order/tradition/acceptBill/newBusinessSubmit",
    method: "post",
    data,
  });
}

// 根据记账主体获取订舱类型
export function getTypeByOperationList(operationMain) {
  return request({
    url: `/take/orderIsolateConfig/getOrderConfigListByOpertaionMain/${operationMain}`,
    method: "get",
  });
}

// 获取电商头程详情
export function getECDetailNew(id) {
  return request({
    // url: `/customer/ec/${id}`,
    url: `/customer/ec/client/get/${id}`,
    method: "get",
  });
}

// 编辑电商头程
export function editEC(data) {
  return request({
    url: "/customer/ec",
    method: "put",
    data,
  });
}



// 传统其他订单动态标签页导出
export function exportTraditionNewExportList(params) {
  return request({
    url: "/order/tradition/newExportList",
    method: "get",
    params,
  });
}
