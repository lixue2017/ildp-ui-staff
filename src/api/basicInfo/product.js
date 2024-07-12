import request from '@/utils/request'
import { SYSTEM } from '@/utils/mixin'

// 产品信息列表
export function getProductInfo(params, system) {
  let url = '/customer/product/list'
  if (system) {
    url = `${SYSTEM}/product/list`
  }
  return request({
    url,
    method: 'get',
    params
  })
}

// 产品信息新增
export function addProductInfo(data) {
  return request({
    url: "/customer/product-main",
    method: "post",
    data,
  });
}

// 修改
export function updateProductInfo(data) {
  return request({
    url: "/customer/product-main",
    method: "put",
    data,
  });
}

//禁用启用状态
export function changeStatus(params) {
  return request({
    url: `/customer/product/${params.id}/${params.oldStatus}/${params.newStatus}`,
    method: 'put',
  })
}

//删除
export function deleteProductInfo(id) {
  return request({
    url: `/customer/product/${id}`,
    method: 'delete',
  })
}

//产品信息详情
export function getDetails(id, system) {
  let url = `/customer/product/${id}`
  if (system) {
    url = `${SYSTEM}/product/${id}`
  }
  return request({
    url,
    method: 'get',
  })
}


//导出
export function exportProductInfo() {
  return request({
    url: `/customer/product/export`,
    method: 'get',
  })
}




