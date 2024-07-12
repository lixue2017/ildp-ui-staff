import request from "@/utils/request";

// 电商拼柜表(拼柜)
export function getDsSortBoxPage(params) {
  return request({
    url: "/dsSortBoxOrder/getList",
    method: "get",
    params,
  });
}

// 电商拼柜表(Fcl或者Lcl)
export function getDsSortBoxFclOrLclPage(params) {
  return request({
    url: "/dsSortBoxOrder/getFclOrLclList",
    method: "get",
    params,
  });
}

// 导出电商拼柜表(拼柜)
export function exportDsSortBoxOrder(params) {
  return request({
    url: "/dsSortBoxOrder/exportList",
    method: "get",
    params,
  });
}

// 导出电商拼柜表(Fcl或者Lcl)
export function exportDsSortBoxOrderFclOrLcl(params) {
  return request({
    url: "/dsSortBoxOrder/exportFclOrLclList",
    method: "get",
    params,
  });
}

// 修改操作单航线信息
export function updateOperationRouteManage(data) {
  return request({
    url: "/dsSortBoxOrder/updateOperationRouteManage",
    method: "put",
    data,
  });
}
