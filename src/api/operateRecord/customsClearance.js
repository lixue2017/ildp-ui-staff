import request from "@/utils/request";

// 新增海外下单
export function saveOverseaOrder(data) {
  return request({
    url: "/oversea/clearance/order",
    method: "post",
    data,
  });
}

// 删除清关信息
export function removeClearance({ id, removeSource }) {
  return request({
    url: `/oversea/clearance/order/removeClearance/${id}/${removeSource}`,
    method: "delete",
  });
}

// 清关登记、清关编辑
export function clearanceRegister(data) {
  return request({
    url: "/oversea/clearance/order/clearanceRegister",
    method: "post",
    data,
  });
}

// 清关放行
export function clearanceRelease(data) {
  return request({
    url: "/oversea/clearance/order/clearanceRelease",
    method: "post",
    data,
  });
}

// 查询发货地址信息列表
export function getDeliveryPlaceList({ customerId, ...params }) {
  return request({
    url: `/oversea/clearance/order/getDeliveryPlaceList/${customerId}`,
    method: "get",
    params,
  });
}

// 获取海外清关订单列表
export function getDirecrClearanceList(params) {
  return request({
    url: "/oversea/clearance/order/getDirecrClearanceList",
    method: "get",
    params,
  });
}

// 获取海外清关操作单列表
export function getOperationDirecrClearanceList(params) {
  return request({
    url: "/oversea/clearance/order/getOperationDirectClearanceList",
    method: "get",
    params,
  });
}

// 获取海外清关订单详情
export function getDirecrClearanceInfo(id) {
  return request({
    url: `/oversea/clearance/order/getDirecrClearanceInfo/${id}`,
    method: "get",
  });
}

// 获取海外提派订单列表
export function getDeliveryClearanceList(params) {
  return request({
    url: "/oversea/clearance/order/getDeliveryClearanceList",
    method: "get",
    params,
  });
}

// 获取海外提派订单详情
export function getDeliveryClearanceInfo(id) {
  return request({
    url: `/oversea/clearance/order/getDeliveryClearanceInfo/${id}`,
    method: "get",
  });
}

// 获取海外入仓订单列表
export function getWarehouseClearanceList(params) {
  return request({
    url: "/oversea/clearance/order/getWarehouseClearanceList",
    method: "get",
    params,
  });
}

// 获取海外入仓订单详情
export function getWarehouseClearanceInfo(id) {
  return request({
    url: `/oversea/clearance/order/getWarehouseClearanceInfo/${id}`,
    method: "get",
  });
}

// 获取货物列表
export function getBoxProductListVo(id) {
  return request({
    url: `/oversea/clearance/order/getBoxProductListVo/${id}`,
    method: "get",
  });
}

// 保存货物
export function saveBoxProduct(data) {
  return request({
    url: "/oversea/clearance/order/saveBoxProduct",
    method: "post",
    data,
  });
}

// 删除货物
export function deleteBoxProduct({ id }) {
  return request({
    url: `/oversea/clearance/order/deleteBoxProduct/${id}`,
    method: "delete",
  });
}

// 获取国内清关货物信息-电商
export function getDsGoodsClearanceList(obj) {
  const { id } = obj || {};
  return request({
    url: `/pop/clearance/getDsGoodsInfoList/${id}`,
    method: "post",
    data: {},
  });
}

// 获取海外清关货物信息
export function getHwGoodsClearanceList(obj) {
  const { id } = obj || {};
  return request({
    url: `/pop/clearance/getHwGoodsInfoList/${id}`,
    method: "post",
    data: {},
  });
}

// 获取查验列表
export function getExamineList(params) {
  return request({
    url: "/clearance/examine/list",
    method: "get",
    params,
  });
}

// 修改查验
export function updateExamine(data) {
  return request({
    url: "/clearance/examine",
    method: "put",
    data,
  });
}

// 新增查验
export function addExamine(data) {
  return request({
    url: "/clearance/examine",
    method: "post",
    data,
  });
}

// 删除查验
export function deleteExamine({ id }) {
  return request({
    url: `/clearance/examine/${id}`,
    method: "delete",
  });
}

// 更新预计离港或者预计到港时间
export function updateExpectPortTime(data) {
  return request({
    url: "/oversea/clearance/order/updateExpectPortTime",
    method: "post",
    data,
  });
}

// 保存附件信息
export function uploadAttach(data) {
  return request({
    url: "/oversea/clearance/order/uploadAttach",
    method: "post",
    data,
  });
}

// 入仓登记或者预计提拆柜（根据类型来修改状态信息）
export function warehousingRegistration(data) {
  return request({
    url: "/oversea/clearance/order/warehousingRegistration",
    method: "post",
    data,
  });
}

// 清关打回
export function clearanceRepulse(data) {
  return request({
    url: "/oversea/clearance/order/clearanceRepulse",
    method: "put",
    data,
  });
}

// 清关登记
export function clearanceRegistration(data) {
  return request({
    url: "/oversea/clearance/order/clearanceRegistration",
    method: "put",
    data,
  });
}

// 复制清关信息
export function postCopyJoinBrief(data) {
  return request({
    url: "/pop/clearance/joinBriefInfo",
    method: "post",
    data,
  });
}

// 批量新增查验
export function POSTBatchAddOperation(data) {
  return request({
    url: "/clearance/examine/batchAddOperation",
    method: "post",
    data,
  });
}

// 海外清关详情头部应收/应付
export function getHeaderTotalBill(params) {
  return request({
    url: `/settle/accounts/totalOrderNew`,
    method: "get",
    params,
  });
}

// 清关管理修改DO
export function updateClearancePdo(data) {
  return request({
    url: "/pop/clearance/updatePdo",
    method: "put",
    data,
  });
}

// 清关管理修改二审状态
export function popUpdSecondState(id) {
  return request({
    url: `/pop/clearance/updSecondState/${id}/${1}`,
    method: "put",
    data: {},
  });
}

// 清关管理是否发送文件
export function popClearanceSendFile(id, state = 1) {
  return request({
    url: `/pop/clearance/updSendFile/${id}/${state}`,
    method: "put",
    data: {},
  });
}

// 修改预约拆柜时间
export function putUpdateSplitBoxTime(data) {
  return request({
    url: "/pop/clearance/updateSplitBoxTime",
    method: "put",
    data,
  });
}

// 清关管理修改预报入库仓
export function updateExpectWarehouseType(data) {
  return request({
    url: "/pop/clearance/updateExpectWarehouseType",
    method: "put",
    data,
  });
}

// 修改清关登记状态：已登记
export function PUTPopClearanceRegisterStatusOver(id) {
  return request({
    url: `/pop/clearance/registerStatusOver/${id}`,
    method: "put",
    data: {},
  });
}

// 修改清关登记状态：撤销登记
export function PUTPopClearanceRegisterStatusRevoke(id) {
  return request({
    url: `/pop/clearance/registerStatusRevoke/${id}`,
    method: "put",
    data: {},
  });
}


/**
 * 清关管理导出
 */
export function GETExportClearanceAllList(params) {
  return request({
    url: "/pop/clearance/exportClearanceAllList",
    method: "get",
    params
  });
}



// 批量修改ETA
export function PUTBatchUpdateEtaTime(data) {
  return request({
    url: "/pop/clearance/batchUpdateEtaTime",
    method: "put",
    data,
  });
}
