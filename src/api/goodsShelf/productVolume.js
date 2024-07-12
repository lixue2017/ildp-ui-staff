import request from "@/utils/request";

// 产品体积查询
export function getProductCbmList(data) {
  return request({
    url: "/warehouse/stock/page/volume",
    method: "post",
    data,
  });
}

// 整箱体积查询
export function getVolumeBoxList(data) {
  return request({
    url: "/warehouse/stock/page/volumeBox",
    method: "post",
    data,
  });
}
