import request from "@/utils/request";

// 跟进记录分页列表
export function getFollowPage(data) {
  return request({
    url: "/crm/follow/page",
    method: "post",
    data,
  });
}
// 新建、编辑crm跟进记录
export function saveOrUpdateFollow(data) {
  return request({
    url: "/crm/follow/saveOrUpdate",
    method: "post",
    data,
  });
}
// 导出
export function followExport(data) {
  return request({
    url: "/crm/follow/export",
    method: "post",
    data,
  });
}
// 导入
export function importExcelFollow(data) {
  return request({
    url: "/crm/follow/importExcel",
    method: "post",
    data,
  });
}
// 删除crm跟进记录
export function delFollow({ id }) {
  return request({
    url: `/crm/follow/del/${id}`,
    method: "delete",
  });
}
// 批量删除
export function batchDelFollow(data) {
  return request({
    url: "/crm/follow/batchDel",
    method: "delete",
    data,
  });
}
// 跟进记录详情
export function getFollowInfo(id) {
  return request({
    url: `/crm/follow/getInfo/${id}`,
    method: "get",
  });
}
