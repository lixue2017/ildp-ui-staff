import request from "@/utils/request";

// FCL文件进度表列表
export function getFileProgressChartPage(params) {
  return request({
    url: "/fileProgressChart/page",
    method: "get",
    params,
  });
}

// 修改FCL文件进度表信息
export function updateFileProgressChart(data) {
  return request({
    url: "/fileProgressChart/updateFileProgressChart",
    method: "post",
    data,
  });
}

// FCL文件进度表导出
export function exportFileProgressChart(params) {
  return request({
    url: "/fileProgressChart/export",
    method: "get",
    params,
  });
}
