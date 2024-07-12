import request from '@/utils/request'

// 查询品类管理列表
export function getCategoryList(params) {
  return request({
    url: '/basic/categoryManage/list',
    method: 'get',
    params
  })
}

// 查询品类管理树数据
export function getCategoryTree() {
  return request({
    url: '/basic/categoryManage/tree',
    method: 'get'
  })
}

// 查询国家管理列表
export function getCountryList(params) {
  return request({
    url: '/basic/countryManage/list',
    method: 'get',
    params
  })
}

// 查询州城市资料列表
export function getAddressList(params) {
  return request({
    url: '/basic/addressManage/list',
    method: 'get',
    params
  })
}

// 查询州城市资料树数据
export function getAddressTree() {
  return request({
    url: '/basic/addressManage/tree',
    method: 'get'
  })
}

// 查询货币管理列表
export function getCurrencyList(params) {
  return request({
    url: '/basic/currencyManage/list',
    method: 'get',
    params
  })
}

// 查询费用管理列表
export function getFeeManageList(params) {
  return request({
    url: '/basic/feeManage/list',
    method: 'get',
    params
  })
}


//修改货币显示
export function PUTCurrencyManage(data) {
  return request({
    url: '/basic/currencyManage',
    method: 'put',
    data
  })
}
