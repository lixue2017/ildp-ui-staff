import request from '@/utils/request'

// 查询FBA仓库地址列表
export function getWarehouseList(params) {
  return request({
    url: '/warehouse/main/list',
    method: 'get',
    params
  })
}

// 新增FBA仓库地址
export function addWarehouse(data) {
  return request({
    url: '/warehouse/main',
    method: 'post',
    data
  })
}

// 编辑FBA仓库地址
export function updateWarehouse(data) {
  return request({
    url: '/warehouse/main',
    method: 'put',
    data
  })
}

// 编辑FBA仓库地址启用禁用
export function updateWarehouseStatus({ id, dataStatus }) {
  return request({
    url: `/warehouse/main/${id}/${dataStatus}`,
    method: 'put'
  })
}

// 获取FBA仓库地址详细信息
export function getWarehouseDetail(id) {
  return request({
    url: `/warehouse/main/${id}`,
    method: 'get'
  })
}

// 删除FBA仓库地址
export function delWarehouse(ids) {
  return request({
    url: `/warehouse/main/${ids}`,
    method: 'delete'
  })
}

// 获取历史记录
export function getHistoryRecord(params) {
  return request({
    url: `/warehouse/main/history/list/${params.id}/${params.warehouseId}`,
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
    }
  })
}