import request from '@/utils/request'

//查询fba货物信息
export function getFbaGoodsInfo(params) {
    let url = '/order/fbaFreight/list'
    return request({
        url,
        method: 'get',
        params
    })
}

//查询fba货物信息-履约
export function getFbaGoodsPerformanceInfo(data) {
    let url = '/staff/order/fba/freightList'
    return request({
        url,
        method: 'post',
        data
    })
}

//fba订单列表
export function getFbaOrderList(params) {
    let url = '/staff/order/fba/list'
    return request({
        url,
        method: 'get',
        params
    })
}
// 海外仓订单FBA打回
export function postOrderFbaRepulse(data) {
  return request({
    url: '/staff/order/fba/callback',
    method: 'post',
    data
  })
}

//详情
export function getEditFbaOrder(id) {
    let url = `/staff/order/fba/${id}`
    return request({
        url,
        method: 'get',
    })
}

//附件信息查询
export function getAttachList(params) {
    let url = '/staff/order/fba/getFbaAttachList'
    return request({
        url,
        method: 'get',
        params
    })
}




