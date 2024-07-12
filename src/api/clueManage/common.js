import request from "@/utils/request";

export function getAttachPage(params) {
  return request({
    url: "/crm/attach/page",
    method: "get",
    params,
  });
}
export function uploadAttach(data) {
  return request({
    url: "/crm/attach/fileUpload",
    method: "post",
    data,
  });
}
export function delAttach(ids) {
  return request({
    url: `/crm/attach/${ids}`,
    method: "DELETE",
  });
}
export function batchEditRemark(data) {
  return request({
    url: "/crm/attach/batchEditRemark",
    method: "PUT",
    data,
  });
}
