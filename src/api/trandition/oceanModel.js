import request from '@/utils/request'

//海运订单列表查询
export function getOceanTraditionList(query) {
  return request({
    url: '/order/tradition/list',
    method: 'get',
    params: query
  })
}


//海运订单查看详情
export function  getSeaTraditionDetail(query) {
  return request({
    url: `/order/tradition/${query}`,
    method: 'get',
  })
}

//海运订单查询货物信息
export function  getSeaTraditionFreightList(params) {
  return request({
    url: `/customer/order/freight/list`,
    method: 'get',
    params
  })
}

//海运订单查询货物信息
export function  getOtherFreightGoodsList(params) {
  return request({
    url: `/customer/order/freight/goods/list`,
    method: 'get',
    params
  })
}

//海运订单查询提货信息
export function  getSeaTraditionFreightTakeList(query) {
  return request({
    url: `/customer/order/freightTake/list`,
    method: 'get',
    params: query
  })
}



//整柜VGM核实新
export function getPopBillGoods(id) {
  return request({
    url: `/pop/bill/goods/${id}`,
    method: 'get',
  })
}

/**
 * 订单物流轨迹
 * type : 订单类型(1:操作单/2:电商头程/7:第三方/8:海外订单/30：fba/31:一件代发)
 * id: 订单id
 */
export function  getLogisticsTypeList(id, oType) {
  return request({
    url: `/logistics/info/list/byOrderId/${oType}/${id}`,
    method: 'get'
  })
}


export function submitTransportationGoods(data) {
  return request({
    url: `/operation/transportation/goods`,
    method: 'put',
    data
  })
}
