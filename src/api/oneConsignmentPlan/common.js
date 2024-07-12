import request from '@/utils/request'

// 获取客户绑定关系
export function getCostBindCustomerList(data) {
  return request({
    url: '/costBindCustomer/bindList',
    method: 'post',
    data
  })
}

// 批量新增客户绑定关系
export function addCostBindCustomer(data) {
  return request({
    url: '/costBindCustomer/batchAdd',
    method: 'post',
    data
  })
}

// 批量移除客户绑定关系
export function deleteCostBindCustomer(data) {
  return request({
    url: '/costBindCustomer/batchDel',
    method: 'delete',
    data
  })
}

// 客户列表
export function getCostBindCustomer(data) {
  return request({
    url: '/costBindCustomer/cusPage',
    method: 'post',
    data
  })
}
