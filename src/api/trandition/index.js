import request from "@/utils/request";

// 传统订单汇总列表查询
export function getTraditionListAll(query) {
  return request({
    url: "/order/tradition/listAll",
    method: "get",
    params: query,
  });
}

// 根据订单信息删除提货信息
export function deleteFreightTakerAll(data) {
  return request({
    url: "order/freightTake/deleteByOrder",
    method: "DELETE",
    data,
  });
}
