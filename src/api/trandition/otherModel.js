import request from '@/utils/request'

//其他订单列表查询
export function getOrderOtherList(query) {
  return request({
    url: '/order/other/list',
    method: 'get',
    params: query
  })
}


//海运订单查看详情
export function  getOrderOtherDetail(query) {
  return request({
    url: `/order/other/${query}`,
    method: 'get',
  })
}
