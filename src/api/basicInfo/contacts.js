import request from "@/utils/request";
import { SYSTEM } from "@/utils/mixin";

// 查询提货地址/联系人信息列表
export function getContactsList(params) {
  return request({
    url: "/system/contacts/main/list",
    method: "get",
    params,
  });
}

// 新增提货地址信息
export function addContacts(data) {
  return request({
    url: "/customer/contacts/main",
    method: "post",
    data,
  });
}

// 新增提货地址信息-员工端
export function addContactsStaff(data) {
  return request({
    url: "/customer/contacts/main/staff ",
    method: "post",
    data,
  });
}

// 编辑提货地址信息
export function updateContacts(data) {
  return request({
    url: "/customer/contacts/main",
    method: "put",
    data,
  });
}

// 获取提货地址详细信息
export function getContactsDetail(id) {
  return request({
    url: `/customer/contacts/main/${id}`,
    method: "get",
  });
}

// 删除提货地址信息
export function delContacts(ids) {
  return request({
    url: `/customer/contacts/main/${ids}`,
    method: "delete",
  });
}

// 获取历史记录
export function getHistoryRecord(params) {
  return request({
    url: "/customer/contacts/list",
    method: "get",
    params,
  });
}
