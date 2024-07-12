import request from '@/utils/request'
import { SYSTEM } from '@/utils/mixin'

// 查询私人仓库地址列表
export function getPrivateWarehouseList(params, system) {
  let url = '/system/privateWarehouse/list'
  return request({
    url,
    method: 'get',
    params
  })
}

// 新增私人仓库地址
export function addPrivateWarehouse(data) {
  return request({
    url: '/customer/privateWarehouse',
    method: 'post',
    data
  })
}

// 编辑私人仓库地址
export function updatePrivateWarehouse(data) {
  return request({
    url: '/customer/privateWarehouse',
    method: 'put',
    data
  })
}

// 获取私人仓库地址详细信息
export function getPrivateWarehouseDetail(id) {
  let url = `/system/privateWarehouse/${id}`
  return request({
    url,
    method: 'get'
  })
}

// 删除私人仓库地址
export function delPrivateWarehouse(ids) {
  return request({
    url: `/customer/privateWarehouse/${ids}`,
    method: 'delete'
  })
}