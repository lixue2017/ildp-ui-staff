import request from '@/utils/request'
// 公共接口文档 https://console-docs.apipost.cn/preview/1906f8488f8d39f6/002d1acd39b7bb41

// 仓库公共接口
export function getWarehousePublicList(params) {
  return request({
    url: '/cus/warehouse/main/publicList',
    method: 'get',
    params
  })
}
// 一件代发收件人
export function getPlatformPublicList(params) {
  return request({
    url: '/staff/order/platform/concat/list',
    method: 'get',
    params
  })
}
// 联系人公共接口
export function getContactsPublicList(params) {
  return request({
    url: '/customer/contacts/main/publicList',
    method: 'get',
    params
  })
}
// 提货地址公共接口
export function getConsigneeMainPublicList(params) {
  return request({
    url: '/customer/consigneeMain/publicList',
    method: 'get',
    params
  })
}
// 产品公共接口
export function getProductMainPublicList(params) {
  return request({
    url: '/customer/product-main/publicList',
    method: 'get',
    params
  })
}


// 港口公共接口
export function getPortPublicList(params) {
  return request({
    url: '/operate/port/publicList',
    method: 'get',
    params
  })
}

//企业公共信息
export function getCrmInfoPublicList(params) {
  return request({
    url: '/crm/info/publicList',
    method: 'get',
    params
  })
}
