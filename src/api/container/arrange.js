import request from '@/utils/request'

// 排柜列表
export function getWaitSort(params) {
  return request({
    url: '/box/sort/wait-sort',
    method: 'get',
    params
  })
}

// 排柜详情列表编辑备注
export function postRowCabinetRemark(data) {
  return request({
    url: '/box/sort/wait-sort/rowCabinetRemark',
    method: 'post',
    data
  })
}

// 排柜导出
export function getExportList(params) {
  return request({
    url: '/box/sort/exportList',
    method: 'get',
    params
  })
}
// 批量排柜保存
export function boxSortSave(data) {
  return request({
    url: `/box/sort`,
    method: 'post',
    data
  })
}


// 批量排柜 - 修改
export function updateBoxSort(data) {
  return request({
    url: `/box/sort`,
    method: 'put',
    data
  })
}

// 堡森排柜列表
export function getBoxSortList(params) {
  return request({
    url: '/box/sort/list',
    method: 'get',
    params
  })
}

// 堡森排柜 - 列表删除
export function delBoxSort(ids) {
  return request({
    url: `/box/sort/${ids}`,
    method: 'delete'
  })
}

// 堡森排柜详情 - 装柜信息
export function getBoxSortDes(id) {
  return request({
    url: `/box/sort/detail/${id}`,
    method: 'get'
  })
}

//操作单详情-排柜信息
export function getBoxSortByOperationId(operationId) {
  return request({
    // url: `/box/sort/${id}`,
    url: `/box/sort/getBy/orderId/${operationId}`,
    method: 'get'
  })
}

// 堡森排柜详情 - 航次信息
export function getOperateRouteNo(id) {
  return request({
    url: `/operate/route-no/${id}`,
    method: 'get'
  })
}

// 出库计划列表
export function getSortBoxList(data) {
  return request({
    url: '/box/sort/getSortBoxList',
    method: 'post',
    data
  })
}

// 装柜完成
export function getSortBoxStatus(data) {
  return request({
    url: '/box/sort/stuffingFinish',
    method: 'post',
    data
  })
}

// 出库计划
export function exportSortBoxList(data) {
  return request({
    url: '/box/sort/exportSortBoxList',
    method: 'post',
    data
  })
}


// 激活/关闭排柜收货核实
export function POSTEditOperationRemark(data) {
  return request({
    url: '/operation/transportation/editOperationRemark',
    method: 'post',
    data
  })
}




// 排柜订舱路线查询
export function GETConfigMianOrderList(params) {
  return request({
    url: '/box/sort/getConfigMianOrderList',
    method: 'get',
    params
  })
}


// 排柜订舱路线新接口查询
export function getConfigMianOrderListVo(params) {
  return request({
    url: '/operate/route/getConfigMianOrderListVo',
    method: 'get',
    params
  })
}


// 取消出库
export function POSTCancelDelivery(data) {
  return request({
    url: '/operation/transportation/cancelDelivery',
    method: 'post',
    data
  })
}
