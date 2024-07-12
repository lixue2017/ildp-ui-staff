import request from '@/utils/request'

// 排货架信息查询
export function getLocationInfoList(params) {
  return request({
    url: '/warehouse/location/location-list',
    method: 'get',
    params
  })
}

// 库位汇总查询
export function getLocationTotalList(params) {
  return request({
    url: '/warehouse/location/total',
    method: 'get',
    params
  })
} 
