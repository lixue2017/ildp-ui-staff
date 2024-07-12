import request from '@/utils/request'


// 查询扣货管理操作员
export function getListSingle(params) {
  return request({
    url: '/operation/transportation/listSingle',
    method: 'get',
    params
  })
}
// 一般拖车工作单号
export function getGeneralJobNo(params) {
  return request({
    url: '/operation/transportation/orderListOfTrailer',
    method: 'get',
    params
  })
}

// 扣货列表删除
export function deletePopDetain(id) {
  return request({
    url: `/pop/detain/${id}`,
    method: 'delete'
  })
}

// 扣货管理新增
export function addPopDetain(data) {
  return request({
    url: '/pop/detain',
    method: 'post',
    data
  })
}

// 查询扣货管理列表
export function getDetainList(params) {
  return request({
    url: '/pop/detain/list',
    method: 'get',
    params
  })
}

// 扣货管理查看详情
export function getPopDetail(id) {
  return request({
    url: `/pop/detain/${id}`,
    method: 'get',
  })
}


// // 扣货管理查看详情
// export function getPopDetail(id) {
//   return request({
//     url: `/pop/detain/list?operationOrderId=${id}`,
//     method: 'get',
//   })
// }


// 扣货管理审核查验
export function editDetain(data) {
  return request({
    url: '/pop/detain/updateStatus',
    method: 'put',
    data
  })
}

