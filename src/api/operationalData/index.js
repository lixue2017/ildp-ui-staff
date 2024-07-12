import request from '@/utils/request'

// 查询航线代码列表
export function getRouteCodeList(params) {
  return request({
    url: '/operate/code/list',
    method: 'get',
    params
  })
}

// 查询区域代码列表
export function getAreaCodeList(params) {
  return request({
    url: '/operate/area/list',
    method: 'get',
    params
  })
}

// 查询港口代码列表，无法根据多个字段进行模糊查询
export function getportList(params, statu, type) {
  return request({
    url: '/operate/port/list',
    method: 'get',
    params
  })
}

// 查询港口代码列表，适配了根据多个字段模糊查询
export function getportList2(params, statu, type) {
  return request({
    url: '/operate/port/list2',
    method: 'get',
    params
  })
}

// 查询箱型尺寸列表，空运港口与海运港口公用
export function getsizeList(params) {
  return request({
    url: '/operate/size/list',
    method: 'get',
    params
  })
}

// 基础档案列表 - 新增
export function addOperateData(data) {
  return request({
    url: '/operate/data',
    method: 'post',
    data
  })
}

// 基础档案列表 - 修改
export function updateOperateData(data) {
  return request({
    url: '/operate/data',
    method: 'put',
    data
  })
}

// 基础档案列表 - 删除
export function delOperateData(id) {
  return request({
    url: `/operate/data/${id}`,
    method: 'delete'
  })
}

// 查询基础档案列表
export function getBasicDataList(params) {
  return request({
    url: '/operate/data/list',
    method: 'get',
    params
  })
}



// 查询运营数据-基础档案树形列表
export function getBasicArchivesTreeList(params) {
  return request({
    url: '/operate/dataType/list',
    method: 'get',
    params
  })
}



// 查询页面数据字典
export function getBasicArchives(params) {
  return request({
    url: '/operate/data/listByTypeEns',
    method: 'get',
    params
  })
}

// 运营数据-基础档案树形列表 - 新增
export function addOperateDataType(data) {
  return request({
    url: '/operate/dataType',
    method: 'post',
    data
  })
}

// 运营数据-基础档案树形列表 - 修改
export function updateOperateDataType(data) {
  return request({
    url: '/operate/dataType',
    method: 'put',
    data
  })
}

// 运营数据-基础档案树形列表 - 删除
export function delOperateDataType(id) {
  return request({
    url: `/operate/dataType/${id}`,
    method: 'delete'
  })
}
