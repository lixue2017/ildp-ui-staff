import request from '@/utils/request'

// 查询服务商信息列表
export function getProviderList(params) {
  return request({
    url: '/pricesystem/provider/list',
    method: 'get',
    params
  })
}

// 新增服务商信息
export function addProvider(data) {
  return request({
    url: '/pricesystem/provider',
    method: 'post',
    data
  })
}

// 编辑服务商信息
export function updateProvider(data) {
  return request({
    url: '/pricesystem/provider',
    method: 'put',
    data
  })
}

// 获取服务商信息
export function getProviderDetail(id) {
  return request({
    url: `/pricesystem/provider/${id}`,
    method: 'get'
  })
}

// 删除服务商信息
export function delProvider(ids) {
  return request({
    url: `/pricesystem/provider/${ids}`,
    method: 'delete'
  })
}


// 查询服务渠道列表
export function getChannelList(params) {
  return request({
    url: '/pricesystem/channel/list',
    method: 'get',
    params
  })
}

// 新增服务渠道信息
export function addChannel(data) {
  return request({
    url: '/pricesystem/channel',
    method: 'post',
    data
  })
}

// 编辑服务渠道信息
export function updateChannel(data) {
  return request({
    url: '/pricesystem/channel',
    method: 'put',
    data
  })
}

// 获取服务渠道信息
export function getChannelDetail(id) {
  return request({
    url: `/pricesystem/channel/${id}`,
    method: 'get'
  })
}

// 删除服务渠道信息
export function delChannel(ids) {
  return request({
    url: `/pricesystem/channel/${ids}`,
    method: 'delete'
  })
}

// 获取后线服务员名称
export function getCustServiceNameList({ name, pageNum = 1, pageSize = 10 }) {
  return request({
    url: `/pricesystem/channel/getCustServiceNameList`,
    method: 'get',
    params: {
      name,
      pageNum,
      pageSize
    }
  })
}


// 获取服务商名称下拉列表
export function getProviderName({ name, pageNum = 1, pageSize = 10 }) {
  return request({
    url: `/pricesystem/channel/getProviderName`,
    method: 'get',
    params: {
      name,
      pageNum,
      pageSize
    }
  })
}

// 查询物流渠道列表
export function getLogisticsList(params) {
  return request({
    url: '/basic/channel/list',
    method: 'get',
    params
  })
}
// 新增物流渠道列表
export function basicChannelPost(data) {
  return request({
    url: '/basic/channel',
    method: 'post',
    data
  })
}
// 修改物流渠道列表
export function basicChannelPut(id) {
  return request({
    // url: '/basic/channel',
		url: `/logisticsChannel/enableDisable/${id}`,
    method: 'put',
    data: {}
  })
}
// 删除物流渠道列表
export function basicChannelDel(id) {
  return request({
    // url: `/basic/channel/${id}`,
		url: `/logisticsChannel/del/${id}`,
    method: 'delete'
  })
}
// 新建、编辑物流渠道
export function postLogisticsChannel(data) {
  return request({
    url: '/logisticsChannel/saveOrUpdate',
    method: 'post',
    data
  })
}
// 物流渠道详情
export function getLogisticsInfo(id) {
  return request({
    url: `/logisticsChannel/getInfo/${id}`,
    method: 'get',
  })
}