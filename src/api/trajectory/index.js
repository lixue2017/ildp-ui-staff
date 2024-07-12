import request from '@/utils/request'

// 物流信息节点列表查询
export function getNodeList(params) {
  return request({
    url: '/logistics/node/list',
    method: 'get',
    params
  })
}



// 物流信息流程列表查询
export function getFlowList(params) {
  return request({
    url: '/logistics/flow/list',
    method: 'get',
    params
  })
}


// 物流信息流程线列表查询
export function getLinkList(params) {
  return request({
    url: '/logistics/link/list',
    method: 'get',
    params
  })
}


// 物流轨迹记录列表查询
export function getInfoList(params) {
  return request({
    url: '/logistics/info/list',
    method: 'get',
    params
  })
}

// 业务配置列表查询
export function getKAList(data) {
  return request({
    url: '/system/ka/list',
    method: 'post',
    data
  })
}
