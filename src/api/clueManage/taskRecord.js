import request from "@/utils/request";

// 任务分页列表
export function getTaskPage(data) {
  return request({
    url: "/crm/task/page",
    method: "post",
    data,
  });
}
// 归档任务
export function archiveTask({ id }) {
  return request({
    url: `/crm/task/archive/${id}`,
    method: "put",
  });
}
// 批量删除
export function batchDelTask(data) {
  return request({
    url: "/crm/task/batchDel",
    method: "DELETE",
    data,
  });
}
// 取消任务
export function cancelTask(data) {
  return request({
    url: "/crm/task/cancel",
    method: "put",
    data,
  });
}
// 完成任务
export function completeTask(data) {
  return request({
    url: "/crm/task/complete",
    method: "put",
    data,
  });
}
// 任务打回
export function repulseTask({ id }) {
  return request({
    url: `/crm/task/repulse/${id}`,
    method: "put",
  });
}
// 删除任务
export function delTask({ id }) {
  return request({
    url: `/crm/task/del/${id}`,
    method: "DELETE",
  });
}
// 任务导出
export function exportTask(data) {
  return request({
    url: "/crm/task/export",
    method: "post",
    data,
  });
}
// 任务跟进
export function followUpTask(data) {
  return request({
    url: "/crm/task/followUp",
    method: "put",
    data,
  });
}
// 任务详情
export function getTaskInfo(id) {
  return request({
    url: `/crm/task/getInfo/${id}`,
    method: "get",
  });
}
// 操作记录
export function getOperationRecord(data) {
  return request({
    url: "/crm/task/operationRecord",
    method: "post",
    data,
  });
}
// 保存备注
export function saveTaskRemark(data) {
  return request({
    url: "/crm/task/remark",
    method: "post",
    data,
  });
}
// 备注列表
export function getTaskRemarkList(id) {
  return request({
    url: `/crm/task/remark/${id}`,
    method: "GET",
  });
}
// 新建、编辑任务
export function saveOrUpdateTask(data) {
  return request({
    url: "/crm/task/saveOrUpdate",
    method: "post",
    data,
  });
}
// 拜访签到记录
export function getVisitAndSignInRecord(data) {
  return request({
    url: "/crm/task/visitAndSignInRecord",
    method: "post",
    data,
  });
}
// 拜访签到记录导出
export function exportVisitAndSignInRecord(data) {
  return request({
    url: "/crm/task/visitAndSignInRecord/export",
    method: "post",
    data,
  });
}
