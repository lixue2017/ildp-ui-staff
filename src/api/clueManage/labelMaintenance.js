import request from "@/utils/request";

// crm标签全部数据
export function getTagAll() {
  return request({
    url: "/crm/tag/all",
    method: "post",
  });
}
// 批量删除
export function batchDelTag(data) {
  return request({
    url: "/crm/tag/batchDel",
    method: "DELETE",
    data,
  });
}
// 删除crm标签
export function delTag(id) {
  return request({
    url: `/crm/tag/del/${id}`,
    method: "DELETE",
  });
}
// crm标签详情
export function getTagInfo(params) {
  return request({
    url: `/crm/tag/getInfo/${id}`,
    method: "GET",
    params,
  });
}
// crm标签分页列表
export function getTagPage(data) {
  return request({
    url: "/crm/tag/page",
    method: "post",
    data,
  });
}
// 新建、编辑crm标签
export function saveOrUpdateTag(data) {
  return request({
    url: "/crm/tag/saveOrUpdate",
    method: "post",
    data,
  });
}
// 标签分组
export function setTagGroup(data) {
  return request({
    url: "/crm/tag/group",
    method: "post",
    data,
  });
}
// 向前移动标签
export function moveTagForward(id) {
  return request({
    url: `/crm/tag/moveTagForward/${id}`,
    method: "PUT",
  });
}
// 向后移动标签
export function moveTagBackward(id) {
  return request({
    url: `/crm/tag/moveTagBackward/${id}`,
    method: "PUT",
  });
}
