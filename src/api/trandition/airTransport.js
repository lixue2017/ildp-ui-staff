import request from '@/utils/request'
//海运订单列表
export function getTraditionList(query) {
  return request({
    url: '/customer/order/tradition/list',
    method: 'get',
    params: query
  })
}



//空运订单列表删除信息
export function deleteTradition(query) {
  return request({
    url: `/customer/order/tradition/${query}`,
    method: 'delete',
  })
}

//空运订单根据查看详情
export function getTraditionIdDetail(query) {
  return request({
    url: `/customer/order/tradition/${query}`,
    method: 'get',
  })
}



//空运订单修改-保存草稿与提交预报
export function putTradition(data) {
  return request({
    url: `/customer/order/tradition`,
    method: 'put',
    data
  })
}

//空运订单列表-查询货物信息列表
export function getFreightList(query) {
  return request({
    url: '/customer/order/freight/list',
    method: 'get',
    params: query
  })
}


// 货物信息新增
export function addOrderFreight(data) {
  return request({
    url: '/customer/order/freight',
    method: 'post',
    data
  })
}


// 货物信息修改
export function editOrderFreight(data) {
  return request({
    url: '/customer/order/freight',
    method: 'put',
    data
  })
}
// 提货信息修改
export function editOrderFreightTake(data) {
  return request({
    url: '/customer/order/freightTake',
    method: 'put',
    data
  })
}

//货物信息删除
export function deleteOrderFreight(query) {
  return request({
    url: `/customer/order/freight/${query}`,
    method: 'delete',
  })
}




//空运订单列表-查询提货信息列表
export function getFreightTakeList(query) {
  return request({
    url: '/customer/order/freightTake/list',
    method: 'get',
    params: query
  })
}
//海运订单提货信息删除
export function deleteOrderFreighttake(query) {
  return request({
    url: `/customer/order/freightTake/${query}`,
    method: 'delete',
  })
}

// 空运订单-设置提货信息
export function setOrderFreightTake(data) {
  return request({
    url: '/customer/order/freightTake/addAll',
    method: 'post',
    data,
  })
}


export function copyTradition(orderId) {
  return request({
    url: `/customer/order/tradition/copy?orderId=${orderId}`,
    method: 'post',
    orderId
  })
}
