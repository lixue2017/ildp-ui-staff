import request from "@/utils/request";
// 接收订单
export function takeOrders(data) {
  return request({
    url: "/operation/transportation",
    method: "post",
    data,
  });
}

// 更换成员
export function updateOperation(data) {
  return request({
    url: "/operation/transportation",
    method: "put",
    data,
  });
}

// 获取订单销售员信息
export function getSalesman(params) {
  return request({
    url: "/operation/transportation/order/getSalesman",
    method: "get",
    params,
  });
}

// 获取操作单列表（海运传统，空运传统）
export function traditionOperationList(data) {
  return request({
    url: "/operation/transportation/getCTOrderList",
    method: "post",
    data,
  });
}

// 获取操作单列表（海运传统，空运传统，其他）
export function getOperationList(params) {
  return request({
    url: "/operation/transportation/list",
    method: "get",
    params,
  });
}

// 获取传统操作单列表（海运/空运/其他）
export function getTraditionAllOperationList(data) {
  return request({
    url: "/operation/transportation/getCTAndQTOrderList",
    method: "post",
    data,
  });
}

// 获取操作单列表(海运电商，空运电商)
export function getOperationListNew(data) {
  return request({
    // url: '/operation/transportation/listNew',
    url: "/operation/transportation/getDSOrderList",
    method: "post",
    data,
  });
}

// 获取操作单列表（其他）
export function getOtherOperateList(data) {
  return request({
    url: "/operation/transportation/getQTOrderList",
    method: "post",
    data,
  });
}

// 获取操作单详情
export function getTakeOrders(id) {
  return request({
    url: `/operation/transportation/${id}`,
    method: "get",
  });
}

// 获取头程入库单详情
export function getWmsTakeOrders(id) {
  return request({
    url: `/operation/transportation/wms/${id}`,
    method: "get",
  });
}

// HYX单获取货物信息
export function getListByOperationId(params) {
  return request({
    url: "/customer/ec/freight/listByOperationOrderId",
    method: "get",
    params,
  });
}

// 散货-整柜核实
export function freightVerify(data) {
  return request({
    url: "/operation/transportation/freight/verify",
    method: "post",
    data,
  });
}

// 放货登记
export function releaseCargoRecord(data) {
  return request({
    url: "/operation/releaseCargoRecord",
    method: "post",
    data,
  });
}

// 获取放货登记
export function getReleaseCargoRecord(operationId) {
  return request({
    url: "/operation/releaseCargoRecord/list",
    method: "get",
    params: {
      operationId,
    },
  });
}

// 获取操作单物流节点
export function getOrderLogistics(id) {
  return request({
    url: `/logistics/order/list/${id}`,
    method: "get",
  });
}
// 操作节点-发送账单
export function putOrderBillSending(data) {
  return request({
    url: `/logistics/order`,
    method: "put",
    data,
  });
}
// 获取清关物流节点
export function orderClearanceLogistics(id) {
  return request({
    url: `/logistics/order/clearance/list/${id}`,
    method: "get",
  });
}

// 获取仓库预报物流节点
export function getStorageLogistics(params) {
  return request({
    url: `/logistics/order/list/byOrder`,
    method: "get",
    params,
  });
}

// 物流信息节点详情
export function getNodeDetail(id) {
  return request({
    url: `/logistics/node/${id}`,
    method: "get",
  });
}

// 新增轨迹
export function addLogistics(data) {
  return request({
    url: "/logistics/info",
    method: "post",
    data,
  });
}

// 新增轨迹(仓库预报)
export function addStorageLogs(data) {
  return request({
    url: "/logistics/order/editByOrderId",
    method: "put",
    data,
  });
}

// 获取物流轨迹
export function getLogisticsList(id, orderType) {
  return request({
    url: `/logistics/info/list/${id}`,
    method: "get",
    params: {
      orderType,
    },
  });
}

// 清关物流轨迹
export function getClearanceLogistics(id) {
  return request({
    url: `/logistics/info/clearance/list/${id}`,
    method: "get",
  });
}

// 尾程物流轨迹
export function getTailLogistics(id) {
  return request({
    url: `/logistics/info/tail/list/${id}`,
    method: "get",
  });
}

// 删除节点
export function deleteLogistics(obj) {
  const { ids } = obj || {};
  return request({
    url: `/logistics/info/delete/node/msg/${ids}`,
    method: "delete",
  });
}

// 预计到港离港时间
export function postNodeTime(data) {
  return request({
    url: `/logistics/info/add/node/msg`,
    method: "post",
    data,
  });
}

// 操作单详情判断是否显示预计时间配置
export function postNodeBtn(data) {
  return request({
    url: `/logistics/info/judage/node/msg`,
    method: "post",
    data,
  });
}

// 客户端节点显示
export function postClientNodeShow(data) {
  return request({
    url: `/logistics/info/cus/node/show`,
    method: "post",
    data,
  });
}

// 保险节点
export function getLogisticsOrder(data) {
  return request({
    url: "/logistics/order",
    method: "put",
    data,
  });
}

// 操作单备注
export function editOperationRemark(data) {
  return request({
    url: "/operation/transportation/editOperationRemark",
    method: "post",
    data,
  });
}

// 查找操作单节点
export function postOperationNode(data) {
  return request({
    url: "/logistics/order/list/big/node",
    method: "post",
    data,
  });
}

// 根据贸易条款查找节点
export function postTradeClauseNode(data) {
  return request({
    url: "/logistics/order/list/big/node/by/clause",
    method: "post",
    data,
  });
}

// 保存节点
export function postSaveOperationNode(data) {
  return request({
    url: "/logistics/order/change/order/big/node",
    method: "post",
    data,
  });
}

// 更改内容订单初始信息
export function getOperationContentInfo(obj) {
  const { oId } = obj || {};
  return request({
    url: `/operation/transportation/getOrderInfo/${oId}`,
    method: "get",
  });
}

// 更改内容订单初始信息
export function putOperationContent(data) {
  return request({
    url: `/operation/transportation/updOrderInfo`,
    method: "put",
    data,
  });
}

// 更改内容订单初始信息(订单)
export function putOperationContentStaff(data) {
  return request({
    url: `/operation/transportation/staff/updOrderInfo`,
    method: "put",
    data,
  });
}
// 节点是否完成 回参：state：-1 : 没有节点 0：未激活  3已完成
export function getNodeState(data) {
  return request({
    url: `/logistics/info/judage/node/state`,
    method: "post",
    data,
  });
}

// 打印入箱清单-预览
export function getPrintWarehousingPreview(data) {
  return request({
    url: "/staff/ec/warehousing/preview",
    method: "post",
    data,
  });
}

// 获取收发通
export function getOperationContactsInfo(obj) {
  const { oId } = obj || {};
  return request({
    url: `/operation/transportation/getContactInfo/${oId}`,
    method: "get",
  });
}

// 更改收发通
export function putOperationContacts(data) {
  return request({
    url: `/operation/transportation/updContactInfo`,
    method: "put",
    data,
  });
}

// 更改收发通(订单)
export function putOperationContactsStaff(data) {
  return request({
    url: `/operation/transportation/staff/updContactInfo`,
    method: "put",
    data,
  });
}

// 箱单发票下载
export function exportInvoiceBatchExportZip(data) {
  return request({
    url: "/customer/product/invoice/batchExportZip",
    method: "post",
    data,
  });
}

/**
 * 清关箱单发票下载-新
 */
export function batchExportDownload(params) {
  return request({
    url: "/customer/product/invoice/export",
    method: "get",
    params,
  });
}

// 海外入仓详情备注保存
export function updateWarehouseRemark(data) {
  return request({
    url: `/oversea/clearance/order/updateWarehouseRemark`,
    method: "put",
    data,
  });
}

// 电商头程入仓详情备注保存
export function updateEcWarehouseRemark(data) {
  return request({
    url: `/customer/ec/updateWarehouseRemark`,
    method: "put",
    data,
  });
}

// 获取第三方物流节点
export function getLogisticsByOrder({ id, ...params }) {
  return request({
    url: `/logistics/order/list/third/${id}`,
    method: "get",
    params,
  });
}

// 电商操作单导出
export function exportDSOrderList(data) {
  return request({
    url: "/operation/transportation/exportDSOrderList",
    method: "post",
    data,
  });
}
// 传统操作单导出
export function exportCTOrderList(data) {
  return request({
    url: "/operation/transportation/exportCTOrderList",
    method: "post",
    data,
  });
}

// 其他操作单导出
export function exportQTOrderList(data) {
  return request({
    url: "/operation/transportation/exportQTOrderList",
    method: "post",
    data,
  });
}

// 清关详情业务配置保存
export function POSTClearanceUpdateBusinessConfig(data) {
  return request({
    url: "/pop/clearance/updateBusinessConfig",
    method: "post",
    data,
  });
}

// 获取电商入仓详情物流节点
export function orderWarehouseLogistics(id) {
  return request({
    url: `/logistics/order/warehouse/list/${id}`,
    method: "get",
  });
}

// 获取电商入仓详情物流轨迹
export function getWarehouseLogistics(id) {
  return request({
    url: `/logistics/info/warehouse/list/${id}`,
    method: "get",
  });
}

// 传统海空运操作单详情节点配置查询
export function POSTNodeByClause(data) {
  return request({
    url: "/logistics/order/list/big/node/by/clause/new",
    method: "post",
    data,
  });
}

// 获取操作单详情（电商，海运传统，空运传统）
export function getOperationDetailExtend(operationOrderId) {
  return request({
    url: `/oot/detailExtend/getEcDetail/${operationOrderId}`,
    method: "get",
  });
}

// 拆客户子单
export function splitOrder(data) {
  return request({
    url: "/clearanceGoods/splitOrder ",
    method: "post",
    data,
  });
}
// 取消拆柜
export function cancelSplitOrder(data) {
  return request({
    url: "/clearanceGoods/cancelSplitOrder",
    method: "post",
    data,
  });
}
// 拆客户子单列表查询
export function getSplitOrderList(data) {
  return request({
    url: "/clearanceGoods/splitOrderList",
    method: "post",
    data,
  });
}
// 删除拆客户子单
export function deleteSplitOrder(data) {
  return request({
    url: "/clearanceGoods/deleteSplitOrder",
    method: "post",
    data,
  });
}
// 复制拆客户子单
export function copySplitOrder(data) {
  return request({
    url: "/clearanceGoods/copySplitOrder",
    method: "post",
    data,
  });
}



// 账单预览模板-获取
export function GETBillPreviewView(params) {
  return request({
    url: `/settle/bill/billPreviewView`,
    method: "get",
    params
  });
}


// 账单预览模版-保存
export function POSTBillPreviewView(data) {
  return request({
    url: "/settle/bill/billPreviewView",
    method: "post",
    data,
  });
}



// 海外清关 预计/实际派送
export function POSTAddExpectOrActualDeliveryNode(data) {
  return request({
    url: `/oversea/clearance/order/addExpectOrActualDeliveryNode`,
    method: "post",
    data,
  });
}
