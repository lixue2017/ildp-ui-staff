import request from "@/utils/request";

// 第三方入库未接单列表
export function getThirdPartyOrderList(params) {
  return request({
    url: "/thirdPartyOrder/adminPage",
    method: "get",
    params,
  });
}

// 第三方入库已接单列表
export function getThirdPartyWmsList(params) {
  return request({
    url: "/thirdPartyOrder/wmsPage",
    method: "get",
    params,
  });
}
// 第三方入库打回
export function postOrderThirdPartyRepulse(data) {
  return request({
    url: "/thirdPartyOrder/adminCallback",
    method: "post",
    data,
  });
}
// 第三方快速收货
export function postThirdQuickReceipt(data) {
  return request({
    url: "/warehouse/storage/dsfQuickReceipt",
    method: "post",
    data,
  });
}
// 更新第三方订单Api信息
export function putThirdApiInfo(data) {
  return request({
    url: "/warehouse/storage/warehouse/updApiDsfApiInfo",
    method: "put",
    data,
  });
}

// 第三方入库详情
export function getThirdPartyOrderDetails(id) {
  return request({
    url: `/thirdPartyOrder/adminGet/${id}`,
    method: "get",
  });
}

// 仓库管理-第三方入库详情
export function getWmsOrderDetails(id) {
  return request({
    url: `/thirdPartyOrder/wmsGet/${id}`,
    method: "get",
  });
}

// 第三方入库详情头部应收/应付
export function getThirdPartyTotalBill(params) {
  return request({
    url: `/settle/accounts/totalOrder`,
    method: "get",
    params,
  });
}

// 第三方入库详情备注
export function postThirdPartyRemark(data) {
  return request({
    url: `/thirdPartyOrder/updateRemark`,
    method: "post",
    data,
  });
}

// 第三方入库货物列表
export function getThirdPartyOrderSkuList(params) {
  const { orderSn } = params || {};
  return request({
    url: `/thirdPartyOrder/adminSkuList/${orderSn}`,
    method: "get",
  });
}

// 第三方入库列表-履约
export function getPerformancePageList(params) {
  return request({
    url: "/thirdPartyOrder/performancePage",
    method: "get",
    params,
  });
}

// 第三方入库详情-履约
export function getPerformancePageDetails(id) {
  return request({
    url: `/thirdPartyOrder/performanceGet/${id}`,
    method: "get",
  });
}

// 第三方入库货物列表-履约
export function getPerformancePageSkuList(params) {
  const { orderSn } = params || {};
  return request({
    url: `/thirdPartyOrder/performanceSkuList/${orderSn}`,
    method: "get",
  });
}
// 第三方入库接单
export function putThirdPartyOrderReceiving(data) {
  return request({
    url: "/thirdPartyOrder/orderReceiving",
    method: "put",
    data,
  });
}

// 海外仓订单打回
export function postOverseasBusinessRepulse(data) {
  return request({
    url: "/order/tradition/acceptBill/overseasBusinessRepulse",
    method: "post",
    data,
  });
}
// 海外仓一件代发打回
export function postOrderPlatformRepulse(data) {
  return request({
    url: "/staff/order/platform/callback",
    method: "post",
    data,
  });
}

// 第三方入库收货详情
export function getThirdPartyReceiptDetails(id) {
  return request({
    url: `/thirdPartyOrder/receiptInfo/${id}`,
    method: "get",
  });
}

// 第三方入库收货列表
export function getThirdPartyReceiptList(id) {
  return request({
    url: `/thirdPartyOrder/receiptInfoList/${id}`,
    method: "get",
  });
}

// 第三方入库收货数据核实
export function putThirdPartyVerifyProduct(data) {
  return request({
    url: `/thirdPartyOrder/verifyProduct`,
    method: "put",
    data,
  });
}

// 收货产品批量核实
export function postSkuBatchVerification(data) {
  return request({
    url: `/wmsProductAttribute/sou`,
    method: "post",
    data,
  });
}

// 收货产品按箱核实
export function boxSouVerification(data) {
  return request({
    url: `/wmsProductAttribute/boxSou`,
    method: "post",
    data,
  });
}

// 第三方入库收货修改
export function putThirdPartyReceiptUpdate(data) {
  return request({
    url: "/thirdPartyOrder/receiptUpdate",
    method: "put",
    data,
  });
}

// 第三方入库收货删除
export function delThirdPartyReceipt(obj) {
  const { id } = obj || {};
  return request({
    url: `/thirdPartyOrder/receiptDel/${id}`,
    method: "delete",
  });
}

// 第三方入库收货绑定托盘
export function getThirdPartyReceipt(data) {
  return request({
    url: "/thirdPartyOrder/receipt",
    method: "post",
    data,
  });
}

// 第三方入库收货完成
export function putThirdPartyReceiptOk(data) {
  return request({
    url: "/thirdPartyOrder/receiptOk",
    method: "put",
    data,
  });
}

// 第三方入库上架
export function postThirdPartyPushShelf(data) {
  return request({
    url: "/warehouse/location/pushShelf",
    method: "post",
    data,
  });
}

//入库单退仓单列表
export function getWmsForecast(params) {
  return request({
    url: "/order/enterWarehouse/list",
    method: "get",
    params,
  });
}

//接单
export function orderReceiving(data) {
  return request({
    url: "/order/enterWarehouse",
    method: "put",
    data,
  });
}

//入库单退仓单详情
export function getForecastDetails(id) {
  return request({
    url: `/order/enterWarehouse/${id}`,
    method: "get",
  });
}

//入库单退仓单货物信息
export function getGoodsInfo(params) {
  return request({
    url: `/order/enterWarehouseFreight/list`,
    method: "get",
    params,
  });
}

//收货头部信息
export function getTakeDeliveryInfo(params) {
  return request({
    url: `/warehouse/storage/getOrder/info`,
    method: "get",
    params,
  });
}

//按sku收货列表
export function getSkuList(id, orderType) {
  return request({
    url: `/order/enterWarehouseFreight/list/${id}?orderType=${orderType}`,
    method: "get",
  });
}

//按箱收货列表
export function getEcOrderList(id) {
  return request({
    url: `/warehouse/storage/ecOrder/storageInfo/${id}`,
    method: "get",
  });
}

//按箱收货列表
export function getBoxList(id) {
  return request({
    url: `/order/enterWarehouseFreight/Box/list/${id}`,
    method: "get",
  });
}

//按sku收货列表(对接头程)
export function getSkuListButt(id) {
  return request({
    url: `/staff/ec/freight/sku/list?ecOrderId=${id}`,
    method: "get",
  });
}

//存仓方式&是否到货 更改(对接头程)
export function editIsAdviceEc(data) {
  return request({
    url: "/staff/ec/freight",
    method: "put",
    data,
  });
}

//是否到货
export function editIsAdvice(data) {
  return request({
    url: "/order/enterWarehouseFreight",
    method: "put",
    data,
  });
}

//电商头程列表
export function getEcommerceList(params) {
  return request({
    url: `/operation/transportation/toPutWarehouse/list`,
    method: "get",
    params,
  });
}

// 新-电商头程列表
export function getECommerceList(data) {
  return request({
    url: `/operation/transportation/freight/list`,
    method: "post",
    data,
  });
}

// 新-电商头程列表-已核实
export function getVerifiedList(data) {
  return request({
    url: `/operation/transportation/goods/list`,
    method: "post",
    data,
  });
}

//对接头程拆柜列表
export function getStrippingList(params) {
  return request({
    url: `/operation/transportation/stripping/list`,
    method: "get",
    params,
  });
}

//预约拆柜日历视图
export function getStrippingView(data) {
  return request({
    url: `/operation/transportation/stripping/view`,
    method: "post",
    data,
  });
}

//拆柜
export function stripping(data) {
  return request({
    url: "/operation/transportation",
    method: "put",
    data,
  });
}

//对接头程预报列表
export function getForecastList(params) {
  return request({
    url: `/staff/ec/warehouse/list`,
    method: "get",
    params,
  });
}

// 头程快速收货
export function postEcQuickReceipt(data) {
  return request({
    url: "/warehouse/storage/ecQuickReceipt",
    method: "post",
    data,
  });
}

//对接头程预报列表
export function getGenerateMoneyInfo(id) {
  return request({
    url: `/operation/transportation/generateMoneyInfo/${id}`,
    method: "get",
  });
}

// 对接头程详情/货物信息列表
export function getEcGoodsInfo(params) {
  const { orderId, goodsType } = params || {};
  // type 1-预报 2-核实
  return request({
    url: `/order/goods/ecGoodsInfo/${orderId}/${goodsType}`,
    method: "get",
  });
}

// 对接头程详情/账单合计
// export function getEcGoodsMoney(params) {
//   const { orderSn } = params || {};
//   return request({
//     url: `/order/goods/ecGoodsMoney/${orderSn}`,
//     method: 'get'
//   })
// }

// 对接头程详情/派送信息
export function getEcGoodsDispatch(params) {
  const { orderSn } = params || {};
  return request({
    url: `/order/goods/ecGoodsDispatch/${orderSn}`,
    method: "get",
  });
}

//一件代发列表
export function getWholeSaleList(params) {
  return request({
    url: `/staff/order/platform/list`,
    method: "get",
    params,
  });
}
// 更新一件代发订单Api信息
export function putWholeSaleApiInfo(data) {
  return request({
    url: "/warehouse/storage/warehouse/updYjdfApiInfo",
    method: "put",
    data,
  });
}

//一件代发操作单列表
export function getOperationWholeSaleList(params) {
  return request({
    url: `/staff/order/platform/getOperationList`,
    method: "get",
    params,
  });
}

//修改跟踪号-平台
export function editTrackNo(data) {
  return request({
    url: "/staff/order/platform",
    method: "put",
    data,
  });
}

//一件代发订单详情
export function getWholeSaleOrderDetails(id) {
  return request({
    url: `/staff/order/platform/${id}`,
    method: "get",
  });
}

//一件代发操作单详情
export function getWholeSaleOperationDetails(id) {
  return request({
    url: `/staff/order/platform/operationInfo/${id}`,
    method: "get",
  });
}

//一件代发海外仓详情
export function getWholeSaleDetails(id) {
  return request({
    url: `/staff/order/platform/wmsInfo/${id}`,
    method: "get",
  });
}

// 一件代发详情备注
export function postPlatformDetailsRemark(data) {
  return request({
    url: `/staff/order/platform/updateRemark`,
    method: "post",
    data,
  });
}

//查询平台货物信息
export function getPlatformGoodsInfo(params) {
  let url = "/order/platformFreight/list";
  return request({
    url,
    method: "get",
    params,
  });
}

//fba订单列表 原来：/staff/order/fba/list
export function getFbaList(params) {
  return request({
    url: `staff/order/fba/wmsList`,
    method: "get",
    params,
  });
}

//修改跟踪号-fba
export function editTrackNoFba(data) {
  return request({
    url: "/staff/order/fba",
    method: "put",
    data,
  });
}

//fba详情
export function getFbaDetails(id) {
  let url = `/staff/order/fba/wmsInfo/${id}`;
  return request({
    url,
    method: "get",
  });
}

// FBA详情备注
export function postFbaDetailsRemark(data) {
  return request({
    url: `/staff/order/fba/updateRemark`,
    method: "post",
    data,
  });
}

//查询fba货物信息
export function getFbaGoodsInfo(params) {
  let url = "/order/fbaFreight/list";
  return request({
    url,
    method: "get",
    params,
  });
}

//fba订单列表-履约
export function getFbaPerformanceList(data) {
  return request({
    url: "/staff/order/fba/performanceList",
    method: "post",
    data,
  });
}

//fba订单详情-履约
export function getFbaPerformanceDetails(id) {
  return request({
    url: `/staff/order/fba/performanceInfo/${id}`,
    method: "get",
  });
}

//更换成员
export function changeMembers(data) {
  return request({
    url: "/pop/clearance/update",
    method: "put",
    data,
  });
}

//托盘下拉
export function trayList(params) {
  let url = "/warehouse/storage/getTrayNumber/list";
  return request({
    url,
    method: "get",
    params,
  });
}

//收货
export function takeDelivery(data, source) {
  return request({
    url: `/warehouse/storage/${source}`,
    method: "post",
    data,
  });
}

//绑定托盘
export function saveTakeDelivery(data) {
  return request({
    url: `/warehouse/storage/save/ecStorageInfo`,
    method: "post",
    data,
  });
}
//收货完成
export function finishStorage(data) {
  return request({
    url: `/warehouse/storage/finishStorage `,
    method: "post",
    data,
  });
}

// 查询贴标详情
export function getTickerInfo(id) {
  let url = `/staff/order/fbaFreight/selectStickerAllByOrderId?id=${id}&isStickerList=0,1,-1`;
  return request({
    url,
    method: "get",
  });
}

// 查询贴标详情-履约
export function getTickerPerformanceInfo(id) {
  return request({
    url: "/staff/order/fba/performanceStickerAllByOrderId",
    method: "post",
    data: {
      id,
    },
  });
}

// 快递卡车详情
export function getTruckInfo(id) {
  let url = `/staff/order/platform/selectTruckOrExpress?id=${id}`;
  return request({
    url,
    method: "get",
  });
}

// 快递卡车详情-履约
export function getTruckPerformanceInfo(id) {
  return request({
    url: "/staff/order/fba/selectTruckOrExpress",
    method: "post",
    data: {
      id,
    },
  });
}

// 第三方入库获取账单列表条件IsBussiness
export function getBillIsBussiness(data) {
  const { businessType, orderId } = data;
  return request({
    url: `/settle/accounts/getIsBussiness/${businessType}/${orderId}`,
    method: "get",
  });
}

//第三方入库与FBA订单获取生成费用必要信息
export function getGenerateWmsMoneyInfo(data) {
  const { position, orderId, orderType } = data;
  return request({
    url: `settle/accounts/generateWmsMoneyInfo/${position}/${orderId}/${orderType}`,
    method: "get",
  });
}

// 派送信息导出
export function sendInfoExport(data) {
  return request({
    url: `/send/info/export`,
    method: "post",
    data,
  });
}

//派送信息
export function getSendInfoList(data) {
  return request({
    url: `/send/info/list`,
    method: "post",
    data,
  });
}

// 清关派送信息导出
export function sendInfoClearanceExport(data) {
  return request({
    url: `/clearance/send/info/export`,
    method: "post",
    data,
  });
}

// 清关派送信息
export function getClearanceSendInfoList(data) {
  return request({
    url: `/clearance/send/info/list`,
    method: "post",
    data,
  });
}

// 派送信息 -> 导出货物箱规表
export function exportBoxGauge(data) {
  return request({
    url: `/boxGauge/export`,
    method: "post",
    data,
  });
}

// 清关货物派送信息
export function getClearanceGoodsPsList(data) {
  return request({
    url: "/pop/clearance/getTpccGoodsPsInfo",
    method: "post",
    data,
  });
}

// 海外入仓-实际提拆柜
export function actualityDevann(data) {
  return request({
    url: `/oversea/clearance/order/actualityDevann`,
    method: "post",
    data,
  });
}

//查询海外仓预报列表
export function getWahouseClearancePrediction(params) {
  return request({
    url: "/oversea/clearance/order/getWahouseClearancePrediction",
    method: "get",
    params,
  });
}

// 海外仓快速收货
export function postOverseasQuickReceipt(data) {
  return request({
    url: "/warehouse/storage/hwQuickReceipt",
    method: "post",
    data,
  });
}

// 海外入仓查询详情
export function getWarehouseClearanceInfo(id) {
  return request({
    url: `/oversea/clearance/order/getWarehouseClearanceInfo/${id}`,
    method: "get",
  });
}
// 海外入仓查询体积重量
export function getClearancePrectionWeightAndVolume(id) {
  return request({
    url: `/oversea/clearance/order/getClearancePrectionWeightAndVolume/${id}`,
    method: "get",
  });
}

// 海外入仓按箱收货
export function getClearanceOrderBoxReceiptInfo(id) {
  return request({
    url: `/oversea/clearance/order/getClearanceOrderBoxReceiptInfo/${id}`,
    method: "get",
  });
}
// 海外入仓按SKU收货
export function getClearanceOrderProductReceiptInfo(id) {
  return request({
    url: `/oversea/clearance/order/getClearanceOrderProductReceiptInfo/${id}`,
    method: "get",
  });
}

// 海外入仓-收货确认
export function postReceipt(data) {
  return request({
    url: `/oversea/clearance/order/receipt`,
    method: "post",
    data,
  });
}

// 海外入仓-已收货信息修改
export function postReceiptUpdate(data) {
  return request({
    url: `/oversea/clearance/order/receiptUpdate`,
    method: "post",
    data,
  });
}

// 海外入仓-已收货信息删除
export function deleteOrderReceiptDel(obj) {
  const { id } = obj || {};
  return request({
    url: `/oversea/clearance/order/receiptDel/${id}`,
    method: "delete",
  });
}

// 海外入仓-收货完成
export function postReceiptOk(data) {
  const { id } = data;
  return request({
    url: `/oversea/clearance/order/receiptOk/${id}`,
    method: "post",
    data,
  });
}

// 第三方入库货物信息查询
export function getThirdPartyOrderGetBox(params) {
  const { orderSn } = params || {};
  return request({
    url: `/thirdPartyOrder/getBox/${orderSn}`,
    method: "get",
  });
}

// 查验单号
export function getClearanceDistinctSendInfoList(data) {
  return request({
    url: `/distinct/clearance/send/info/list`,
    method: "post",
    data,
  });
}

// 查验单号
export function getClearanceSendCheckList(params) {
  return request({
		url: `/pop/check/hehe`,
    method: "get",
    params,
  });
}

//电商绑定托盘-确认收货（新）
export function POSTEcStorageInfoNew(data) {
  return request({
    url: `/warehouse/storage/save/ecStorageInfoNew`,
    method: "post",
    data,
  });
}
// 提醒托盘上有没有货物
export function getTrayIdGoods(trayId) {
  return request({
    url: `/warehouse/tray/getTrayGoodsNoErr/${trayId}`,
    method: "get",
  });
}

//电商入库按箱查询（新）
export function POSTRcOrderStorageInfoNew(id, operationOrderId) {
  return request({
    url: `/warehouse/storage/ecOrder/storageInfoNew`,
    method: "post",
    data: {
      orderId: id,
      operationOrderId,
    },
  });
}

// 电商入库按SKU(新)
export function getEcOrderWarehouseskuStorageInfo(data) {
  return request({
    url: `/warehouse/storage/ecOrder/skuStorageInfoNew`,
    method: "post",
    data,
  });
}

//电商入库修改收货信息(按箱，按SKU)
export function updateReceipt(data) {
  return request({
    url: `/warehouse/storage/updateStorageInfoNew`,
    method: "post",
    data,
  });
}

//电商入库删除收货信息
export function deleteReceipt(id) {
  return request({
    url: `/warehouse/storage/delete/storageNew/${id}`,
    method: "post",
  });
}

// 一件代发导出费用
export function POSTOrderPlatformExportFees(data) {
  return request({
    url: `/staff/order/platform/exportFees`,
    method: "post",
    data,
  });
}

// 传统清关查验
export function PostDistinctClearanceListCT(data) {
  return request({
    url: `/distinct/clearance/send/info/listCT`,
    method: "post",
    data,
  });
}


// 第三方海外仓列表打回
export function PutThirdPartyOrderWmsRepulse(id) {
  return request({
    url: `/thirdPartyOrder/wmsRepulse/${id}`,
    method: "put",
  });
}
