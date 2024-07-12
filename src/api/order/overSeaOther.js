import request from '@/utils/request'

// 获取海外清关订单列表
export function getOrderDirectClearanceList(params) {
  return request({
    url: '/oversea/clearance/order/getOrderDirectClearanceList',
    method: 'get',
    params
  })
}

// 获取海外清关订单详情
export function getDirectClearanceInfo({ id }) {
  return request({
    url: `/oversea/clearance/order/getOrderOverseaClearance/${id}`,
    method: 'get',
  })
}

// 获取海外提派订单列表
export function getOrderDeliveryClearanceList(params) {
  return request({
    url: '/oversea/clearance/order/getOrderDeliveryClearanceList',
    method: 'get',
    params
  })
}

// 获取海外提派操作单列表
export function getOperationDeliveryClearanceList(params) {
  return request({
    url: '/oversea/clearance/order/getOperationDeliveryClearanceList',
    method: 'get',
    params
  })
}

// 获取海外提派订单详情
export function getDeliveryClearanceInfo({ id }) {
  return request({
    url: `/oversea/clearance/order/getOrderDelivery/${id}`,
    method: 'get',
  })
}

// 订单打回
export function orderRepulse(data) {
  return request({
    url: '/oversea/clearance/order/orderRepulse',
    method: 'put',
    data
  })
}

// 业务接单
export function orderBusinessAccept(data) {
  return request({
    url: '/oversea/clearance/order/orderBusinessAccept',
    method: 'put',
    data
  })
}

// 业务提交
export function orderBusinessSubmit({ id }) {
  return request({
    url: `/oversea/clearance/order/orderBusinessSubmit/${id}`,
    method: 'put',
  })
}

// 更新业务备注
export function orderBusinessRemark(data) {
  return request({
    url: '/oversea/clearance/order/saveBusinessRemark',
    method: 'put',
    data
  })
}

// 撤回提交
export function recallSubmit({ id }) {
  return request({
    url: `/oversea/clearance/order/recallSubmit/${id}`,
    method: 'put',
  })
}



// 订单操作单直清直派操作备注保存
export function PUTOperationOverseaRemark(data) {
  return request({
    url: '/oversea/clearance/order/saveOperationRemark',
    method: 'put',
    data
  })
}


// 操作履约-导出海外派送订单
export function GetExportOperationDeliveryClearanceList(params) {
  return request({
    url: '/oversea/clearance/order/exportOperationDeliveryClearanceList',
    method: 'get',
    params
  })
}


// 操作履约-导出海外直清订单
export function GetExportOperationDirectClearanceList(params) {
  return request({
    url: '/oversea/clearance/order/exportOperationDirectClearanceList',
    method: 'get',
    params
  })
}



// 海外清关交接详情货物信息查询
export function GETGoodsFromOrderDimension({ id }) {
  return request({
    url: `/oversea/clearance/order/getGoodsFromOrderDimension/${id}`,
    method: 'get',
  })
}


// 海外清关交接订单详情
export function getDirectClearanceInfoQg({ id }) {
  return request({
    url: `/oversea/clearance/order/getOrderOverseaClearanceQg/${id}`,
    method: 'get',
  })
}
// 海外清关二审打回
export function postOverseaSecondToFirst(id) {
  return request({
    url: `/pop/clearance/secondToFirst/${id}`,
    method: "post",
    data: {},
  });
}
