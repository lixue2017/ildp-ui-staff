import request from '@/utils/request'

// 获取运输方式下拉列表
export function download(params) {
  return request({
    url: '/fileDownload',
    method: 'get',
    params
  })
}



// 下载
export function previewDownloadRequest(params) {
  return request({
    url: `/pop/bill/previewDownload`,
    method: 'get',
    params
  })
}

// 清关箱单发票下载
export function previewDownloadClplRequest(params) {
  return request({
    url: "/pop/bill/previewDownloadClpl",
    method: 'get',
    params
  })
}


// 清关箱单发票下载 2022/09/13替换清关管理详情-交接信息-箱单发票下载
export function exportProductInvoice(params) {
  return request({
    url: "/customer/product/invoice/export",
    method: 'get',
    params
  })
}

/**
 * 清关HBL资料下载 operationOrderId=150
 */
export function getPreviewDownloadHbl(params) {
  return request({
    url: "/pop/bill/previewDownloadHbl",
    method: 'get',
    params
  })
}