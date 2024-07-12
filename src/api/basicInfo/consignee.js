import request from "@/utils/request";

// 查询提货地址信息列表
export function getConsigneeList(params) {
  return request({
    url: "/system/consignee/list",
    method: "get",
    params,
  });
}

// 获取提货地址详细信息
export function getConsigneeDetail(id) {
  return request({
    url: `/system/consignee/${id}`,
    method: "get",
  });
}

// 获取历史记录
export function getHistoryRecord(params) {
  return request({
    url: `/system/consignee/getConsigneeByMainId/${params.id}/${params.consigneeId}`,
    method: "get",
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
    },
  });
}

// 新增提货地址信息
export function addConsignee(data) {
  return request({
    url: "/customer/consigneeMain",
    method: "post",
    data,
  });
}

// 编辑提货地址信息
export function updateConsignee(data) {
  return request({
    url: "/customer/consigneeMain",
    method: "put",
    data,
  });
}

// 维护地址详情
export function maintainConsignee(id) {
  return request({
    url: `/customer/consigneeMain/consignee/${id}`,
    method: "get",
  });
}
