import request from '@/utils/request'

// 批量日志
export function getWarehouseLogList(params) {
  return request({
    url: '/warehouse/log/list',
    method: 'get',
    params
  })
}

// 批量日志-新
export function getWarehouseStockLogList(data) {
  return request({
    url: '/warehouse/stockLog/page',
    method: 'post',
    data
  })
}

// 批次日志导出
export function exportBatchLog(data) {
  return request({
    url: '/warehouse/stockLog/exportPage',
    method: 'post',
    data
  })
}