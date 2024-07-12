import request from "@/utils/request";
// 账龄分析表
export function getBillAgingList(data) {
  return request({
    url: "/logistics/settle/bank/receipt/billAging/list",
    method: "post",
    data,
  });
}

// 账龄分析表导出
export function getBillAgingExport(data) {
  return request({
    url: "/logistics/settle/bank/receipt/billAging/export",
    method: "post",
    data,
  });
}
