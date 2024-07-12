import request from '@/utils/request'

//空运订单列表查询
export function getAirTraditionList(query) {
  return request({
    url: '/order/tradition/list',
    method: 'get',
    params: query
  })
}
