import request from "@/utils/request";

/**
 * 分区管理列表
 */
export function getPartitionList(params) {
  return request({
    url: "/warehouse/partition/list",
    method: "get",
    params,
  });
}
// 新增分区
export function partitionPost(data) {
  return request({
    url: "/warehouse/partition",
    method: "post",
    data,
  });
}
// 编辑分区
export function partitionPut(data) {
  return request({
    url: "/warehouse/partition",
    method: "put",
    data,
  });
}
// 删除分区
export function delPartition(id) {
  return request({
    url: `/warehouse/partition/${id}`,
    method: "delete",
  });
}

/**
 * 库位管理
 */
export function getLocationList(params) {
  return request({
    url: "/warehouse/location/list",
    method: "get",
    params,
  });
}
// 新增库位
export function locationPost(data) {
  return request({
    url: "/warehouse/location",
    method: "post",
    data,
  });
}
// 编辑库位
export function locationPut(data) {
  return request({
    url: "/warehouse/location",
    method: "put",
    data,
  });
}
// 删除库位
export function delLocation(id) {
  return request({
    url: `/warehouse/location/${id}`,
    method: "delete",
  });
}
// 打印库位
export function printWarehouseLocation(data) {
  return request({
    url: "/warehouse/tray/storageLocationPrint",
    method: "post",
    data,
  });
}

/**
 * 库位类型列表
 */
export function getLocationTypeList(params) {
  return request({
    url: "/warehouse/locationType/list",
    method: "get",
    params,
  });
}
// 新增库位类型
export function locationTypePost(data) {
  return request({
    url: "/warehouse/locationType",
    method: "post",
    data,
  });
}
// 编辑库位类型
export function locationTypePut(data) {
  return request({
    url: "/warehouse/locationType",
    method: "put",
    data,
  });
}
// 删除库位类型
export function delLocationType(id) {
  return request({
    url: `/warehouse/locationType/${id}`,
    method: "delete",
  });
}

/**
 * 包材信息列表
 */
export function getPackingList(params) {
  return request({
    url: "/warehouse/packingMmaterials/list",
    method: "get",
    params,
  });
}

/**
 * 包材消耗列表
 */
export function getPackagingConsumeList(params) {
  return request({
    url: "/warehouse/packingMaterialsLog/list",
    method: "get",
    params,
  });
}
// 新增包材消耗
export function packagingConsumePost(data) {
  return request({
    url: "/warehouse/packingMaterialsLog",
    method: "post",
    data,
  });
}
// 编辑包材消耗
export function packagingConsumePut(data) {
  return request({
    url: "/warehouse/packingMaterialsLog",
    method: "put",
    data,
  });
}
// 删除包材消耗
export function delPackagingConsume(id) {
  return request({
    url: `/warehouse/packingMaterialsLog/${id}`,
    method: "delete",
  });
}

// 货架查询
export function getWarehouseShelfList(params) {
  return request({
    url: "/warehouse/location/shelf-list",
    method: "get",
    params,
  });
}

// 分区方案列表
export function costPartitionSchemeList(data) {
  return request({
    url: "/costPartitionScheme/page",
    method: "post",
    data,
  });
}
// 新建、编辑分区方案
export function saveCostPartitionScheme(data) {
  return request({
    url: "/costPartitionScheme/saveOrUpdate",
    method: "post",
    data,
  });
}
// 分区方案启用禁用
export function putCostPartitionScheme(id) {
  return request({
    url: `/costPartitionScheme/enableDisable/${id}`,
    method: "put",
    data: {},
  });
}
// 删除分区方案
export function delCostPartitionScheme(id) {
  return request({
    url: `/costPartitionScheme/del/${id}`,
    method: "delete",
  });
}
// 分区方案详情
export function getCostPartitionSchemeInfo(id) {
  return request({
    url: `/costPartitionScheme/getInfo/${id}`,
    method: "get",
  });
}
// 分区信息分页列表
export function costPartitionInfoList(data) {
  return request({
    url: "/costPartitionInfo/page",
    method: "post",
    data,
  });
}
// 新建、编辑分区信息
export function saveCostPartitionInfo(data) {
  return request({
    url: "/costPartitionInfo/saveOrUpdate",
    method: "post",
    data,
  });
}
// 批量新建、编辑分区信息
export function saveBatchCostPartitionInfo(data) {
  return request({
    url: "/costPartitionInfo/batchSaveOrUpdate",
    method: "post",
    data,
  });
}
// 查询分区下区域数量
export function getCostPartitionInfoSonCount(id) {
  return request({
    url: `/costPartitionInfo/getSonCount/${id}`,
    method: "get",
  });
}
// 删除分区信息
export function delCostPartitionInfo(id) {
  return request({
    url: `/costPartitionInfo/del/${id}`,
    method: "delete",
  });
}
// 分区明细邮编分页列表
export function costPartitionDetailList(data) {
  return request({
    url: "/costPartitionDetail/page",
    method: "post",
    data,
  });
}
// 新建、编辑分区明细邮编
export function saveCostPartitionDetail(data) {
  return request({
    url: "/costPartitionDetail/saveOrUpdate",
    method: "post",
    data,
  });
}
// 批量新建、编辑分区明细
export function costBatchPartitionDetailList(data) {
  return request({
    url: "/costPartitionDetail/batchSaveOrUpdate",
    method: "post",
    data,
  });
}
// 删除分区明细邮编
export function delCostPartitionDetail(id) {
  return request({
    url: `/costPartitionDetail/del/${id}`,
    method: "delete",
  });
}

// 重量段模板分页列表
export function weightSectionTempList(data) {
  return request({
    url: "/weightSectionTemp/page",
    method: "post",
    data,
  });
}
// 新建、编辑重量段模板
export function postWeightSectionTemp(data) {
  return request({
    url: "/weightSectionTemp/saveOrUpdate",
    method: "post",
    data,
  });
}
// 分区方案启用禁用
export function putWeightSectionTemp(id) {
  return request({
    url: `/weightSectionTemp/enableDisable/${id}`,
    method: "put",
    data: {},
  });
}
// 删除重量段模板
export function delWeightSectionTemp(id) {
  return request({
    url: `/weightSectionTemp/del/${id}`,
    method: "delete",
  });
}
// 重量段模板详情
export function getWeightSectionTempInfo(id) {
  return request({
    url: `/weightSectionTemp/getInfo/${id}`,
    method: "get",
  });
}
// 复制重量段模板详情
export function getCopyWeightSectionTempInfo(id) {
  return request({
    url: `/weightSectionTemp/getCopyInfo/${id}`,
    method: "get",
  });
}

// 物流渠道列表
export function logisticsChannelList(data) {
  return request({
    url: "/logisticsChannel/page",
    method: "post",
    data,
  });
}

// 物流产品列表
export function logisticsProductList(data) {
  return request({
    url: "/logisticsProduct/page",
    method: "post",
    data,
  });
}
// 新建、编辑物流渠道
export function postLogisticsProduct(data) {
  return request({
    url: "/logisticsProduct/saveOrUpdate",
    method: "post",
    data,
  });
}
// 物流产品启用禁用
export function putLogisticsProduct(id) {
  return request({
    url: `/logisticsProduct/enableDisable/${id}`,
    method: "put",
    data: {},
  });
}
// 删除物流产品
export function delLogisticsProduct(id) {
  return request({
    url: `/logisticsProduct/del/${id}`,
    method: "delete",
  });
}
// 物流产品详情
export function getLogisticsProductInfo(id) {
  return request({
    url: `/logisticsProduct/getInfo/${id}`,
    method: "get",
  });
}

// 托盘号管理 - 列表
export function getWarehouseTrayList(data) {
  return request({
    url: "/warehouse/tray/page",
    method: "post",
    data,
  });
}
// 添加托盘号
export function postWarehouseTrayAdd(data) {
  return request({
    url: "/warehouse/tray/batchAdd",
    method: "post",
    data,
  });
}
// 删除托盘号
export function delWarehouseTray(id) {
  return request({
    url: `/warehouse/tray/${id}`,
    method: "delete",
  });
}
// 打印托盘
export function printWarehouseTray(data) {
  return request({
    url: "/warehouse/tray/trayPrint",
    method: "post",
    data,
  });
}
// 轮询打印
export function getDownShippingMark(params) {
  return request({
    url: "/staff/ec/get/downShippingMark",
    method: "get",
    params,
  });
}
// 托盘上货物
export function getWarehouseTrayGoods(id) {
  return request({
    url: `/warehouse/tray/getTrayGoods/${id}`,
    method: "get",
  });
}
// 移货物
export function postTrayMovingGoods(data) {
  return request({
    url: "/warehouse/tray/movingGoods",
    method: "post",
    data,
  });
}

// API列表
export function POSTApiConfigGetPage(data) {
  return request({
    url: "/apiConfig/getPage",
    method: "post",
    data,
  });
}

// 产品SKU管理 - 列表
export function getProductSkuList(params) {
  return request({
    url: "/product-main/page",
    method: "get",
    params,
  });
}
// 下载sku条码
export function printProductSku(id) {
  return request({
    url: `/product-main/downSku/${id}`,
    method: "get",
  });
}

/**
 * 第三方 上传打印sku
 */
export function POSTThirdUploadPrintSku(data) {
  return request({
    url: "/thirdPartyOrder/uploadPrintSku",
    method: "POST",
    data,
  });
}

// 第三方 获取打印Sku信息
export function GETThirdDownPrintSku(params) {
  return request({
    url: "/thirdPartyOrder/get/downPrintSku",
    method: "get",
    params,
  });
}

// 第三方入库唛头打印
export function printWarehouseThird(data) {
  return request({
    url: `/warehouse/tray/thirdOrOverseasOrderPrint`,
    method: "post",
    data,
  });
}
// 第三方入库清单打印
export function getWarehousingPrint(id) {
  return request({
    url: `/thirdPartyOrder/warehousingPrint/${id}`,
    method: "get",
  });
}

// 第三方订单-下载汇总入仓单
export function getCollectPrint(id) {
  return request({
    url: `/thirdPartyOrder/collectPrint/${id}`,
    method: "get",
  });
}

// 第三方入库按箱打印
export function getWarehousingBoxPrint(id) {
  return request({
    url: `/thirdPartyOrder/boxPrint/${id}`,
    method: "get",
  });
}