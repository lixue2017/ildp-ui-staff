import request from '@/utils/request'

// 库存查询
export function getStockCbmList(params) {
  return request({
    url: '/warehouse/stock/page',
    method: 'get',
    params
  })
}

// 库存导出
export function stockExportExcel(params) {
  return request({
    url: '/warehouse/stock/exportExcelList',
    method: 'get',
    params
  })
}

// 库存合计
export function getWarehouseStockTotal(params) {
  return request({
    url: '/warehouse/stock/pageSum',
    method: 'get',
    params
  })
}