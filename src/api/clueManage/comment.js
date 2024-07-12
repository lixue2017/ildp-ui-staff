import request from "@/utils/request";

// crm评论分页列表
export function getCommentPage(data) {
  return request({
    url: "/crm/comment/page",
    method: "post",
    data,
  });
}
// 新建、编辑crm评论
export function saveOrUpdateComment(data) {
  return request({
    url: "/crm/comment/saveOrUpdate",
    method: "post",
    data,
  });
}
// crm评论详情
export function getCommentInfo(params) {
  return request({
    url: `/crm/comment/getInfo/${id}`,
    method: "get",
    params,
  });
}
// 删除crm评论
export function delComment({ id }) {
  return request({
    url: `/crm/comment/del/${id}`,
    method: "DELETE",
  });
}
