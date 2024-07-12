import request from '@/utils/request'
/**
 * 存仓上架/大货中转 （存仓上架已不再使用这个接口）
 * type: 0-SKU存仓 1-按箱存仓 1-大货中转
 * storageWay 1-大货中转
 */
export function warehouseStorageList(params) {
  return request({
    url: '/warehouse/storage/list',
    method: 'get',
    params
  })
}
/**
 * 大货中转列表
 */
export function getTransferList(params) {
  return request({
    url: '/warehouse/storage/transferListNew',
    method: 'get',
    params
  })
}
// 排货架
export function warehouseShelfLayer(params) {
  return request({
    url: '/warehouse/location/freightShel/choose',
    method: 'get',
    params
  })
}
// 上架库位展示列表
export function warehouseFreightShelfList(params) {
  return request({
    url: '/warehouse/location/freightShelf/list',
    method: 'get',
    params
  })
}
// 上架
export function warehousePutawayPut(data) {
  return request({
    url: '/warehouse/location/putaway',
    method: 'put',
    data
  })
}

// 存仓上架
export function postLocationPushShelf(data) {
  return request({
    url: "/warehouse/location/pushShelfNew",
    method: 'post',
    data
  })
}

// 存仓批量上架
export function postLocationBatchPushShelf(data) {
  return request({
    url: "/warehouse/location/batchPushShelfNew",
    method: 'post',
    data
  })
}

// 大货中转批量上架
export function postTransferBatchPushShelf(data) {
  return request({
    url: "/warehouse/storage/batchDhzzStorage",
    method: 'post',
    data
  })
}

// 可上架库位
export function postBatchPushLocation(data) {
  return request({
    url: "/warehouse/location/ksjKuwei",
    method: 'post',
    data
  })
}

// 大货中转详情货物明细列表
export function warehouseTrayFreightList(params) {
  return request({
    url: `/warehouse/storage/tray/freight/list`,
    method: 'get',
    params
  })
}
// 大货中转上架
export function dhzzWarehouseStorage(data) {
  return request({
    url: '/warehouse/storage/dhzzStorage',
    method: 'post',
    data
  })
}


/**
 * 未知客户退仓列表
 */
export function getUnKnownReturnList(data) {
  return request({
    // url: '/warehouse/unKnownReturn/list', // get
		url: "/claimOrder/pageList",
    method: 'post',
    data
  })
}
// 新增
export function unKnownReturnPost(data) {
  return request({
    // url: '/warehouse/unKnownReturn',
    url: "/claimOrder/sou",
    method: "post",
    data,
  });
}
// 编辑
export function unKnownReturnPut(data) {
  return request({
    url: '/warehouse/unKnownReturn',
    method: 'put',
    data
  })
}
// 提交
export function putUnKnownReturnSubmit(data) {
  return request({
    url: "/claimOrder/batchSubmit",
    method: "put",
    data,
  });
}
// 删除
export function delUnKnownReturnList(data) {
  return request({
    url: "/claimOrder/batchDel",
    method: "delete",
    data,
  });
}
// 未知客户绑定托盘
export function unKnownRelevanceTray(data, id) {
  return request({
    url: `/warehouse/unKnownReturn/relevanceTray/${id}`,
    method: 'post',
    data
  })
}

// 未知客户详情
export function unKnownReturnDetail(id) {
  return request({
    // url: `/warehouse/unKnownReturn/${id}`,
		url: `/claimOrder/getInfo/${id}`,
    method: 'get'
  })
}

// 获取详情货物信息列表
export function unKnownReturnFreightList(params) {
  return request({
    url: `/warehouse/unKnownReturnFreight/list`,
    method: 'get',
    params
  })
}



// 新增
export function warehouseStoragePost(data) {
  return request({
    url: '/warehouse/storage',
    method: 'post',
    data
  })
}
// 编辑
export function warehouseStoragePut(data) {
  return request({
    url: '/warehouse/storage',
    method: 'put',
    data
  })
}
// 获取详情
export function warehouseStorageDetail(id) {
  return request({
    url: `/warehouse/storage/${id}`,
    method: 'get'
  })
}

/**
 * 出库管理/快递出库
 */
export function getSelectExpressList(params) {
  return request({
    url: '/staff/order/platform/selectExpressList',
    method: 'get',
    params
  })
}
// 快速登记
export function exwarehousePost(data) {
  return request({
    url: '/exwarehouse/record',
    method: 'post',
    data
  })
}
// 快递出库/卡车出库 -> 更新轨迹/已送达
export function deliveryTrajectoryPut(data) {
  return request({
    url: '/staff/order/platform',
    method: 'put',
    data
  })
}
// 快递出库 -> 批量派送
export function deliveryBatchPost(data) {
  return request({
    url: '/exwarehouse/record/batchUpdateStatus',
    method: 'post',
    data
  })
}

/**
 * 出库管理/卡车出库
 */
export function getTruckList(data) {
  return request({
    url: '/staff/order/platform/selectTruckList',
    method: 'post',
    data
  })
}

/**
 * 出库管理/卡车出库
 */
export function getTruckFreightList(params) {
  return request({
    url: '/staff/order/platform/selectTruckFreightList',
    method: 'get',
    params
  })
}
export function postTruckFreightList(data) {
  return request({
    url: '/staff/order/platform/selectTruckFreightListTwins',
    method: 'post',
    data
  })
}
// 已送达
export function platformUpdateTruckPost(data) {
  return request({
    url: '/staff/order/platform/updateTruck',
    method: 'post',
    data
  })
}
// 出库完成
export function putTruckUpdateStatus(data) {
  return request({
    url: '/exwarehouse/truck/updateStatus',
    method: 'put',
    data
  })
}
// 编辑保存
export function exwarehouseTruckPost(data) {
  return request({
    url: '/exwarehouse/truck',
    method: 'post',
    data
  })
}
// 编辑保存
export function updateExwarehouseTruck(data) {
  return request({
    url: '/exwarehouse/truck/update',
    method: 'put',
    data
  })
}

/**
 * 出库管理/拣货单管理
 */
export function getPickingList(params) {
  return request({
    url: '/system/picking/list',
    method: 'get',
    params
  })
}
// 新增/编辑列表
export function getPickingOrderList(params) {
  return request({
    url: '/system/picking/getOrderList',
    method: 'get',
    params
  })
}
// 新增
export function pickingPost(data) {
  return request({
    url: '/system/picking',
    method: 'post',
    data
  })
}
// 编辑
export function pickingPut(data) {
  return request({
    url: '/system/picking',
    method: 'put',
    data
  })
}
// 删除
export function delPicking(params) {
  return request({
    url: `/system/picking/deletePickingByid`,
    method: 'delete',
    params
  })
}
// 详情订单列表
export function getPickingOrderByList(params) {
  return request({
    url: '/system/picking/getPickingOrderById',
    method: 'get',
    params
  })
}
// 详情产品列表
export function getPickingByList(params) {
  return request({
    url: '/system/picking/getPickingById',
    method: 'get',
    params
  })
}
// 面单打印查询
export function postSearchPicking(data) {
  return request({
    url: "/wpc/obtainDataForPrintableWaybills",
    method: "post",
    data,
  });
}
// 批量打印面单 - 跳转到静默打印页面
export function postSetUrlList(data) {
  return request({
    url: "/redis/setUrlList",
    method: "post",
    data,
  });
}

// 出库自提登记列表查询
export function getOrderPlatform(params) {
  return request({
    url: '/staff/order/platform/selectCustomerPickUp',
    method: 'get',
    params
  })
}

// 出库自提下载
export function pickUpPreviewDownload(params) {
  return request({
    url: '/exwarehouse/pickUp/previewDownload',
    method: 'get',
    params
  })
}


// 出库自提登记列表查询
export function getExwarehouseList(params) {
  return request({
    url: '/exwarehouse/pickUp/list',
    method: 'get',
    params
  })
}


// 快速登记
export function getexWarehousePickUp(data) {
  return request({
    url: '/exwarehouse/pickUp',
    method: 'post',
    data
  })
}



/**
 * 存仓上架
 * 必填参数：
 * type: 0-SKU存仓 1-按箱存仓
 * warehouseId 仓库ID
 */
 export function getStorageShelveList(params) {
  return request({
    url: "/warehouse/wmsReceipt/getStorageShelveList",
    method: "get",
    params,
  });
}
// 存仓上架入库明细导出
export function getExportStorageShelveList(params) {
  return request({
    url: "/warehouse/wmsReceipt/exportStorageShelveList",
    method: "get",
    params,
  });
}

// 托盘详情
export function getDeailByTraySn(traySn) {
  return request({
    url: `/warehouse/wmsReceipt/getDeailByTraySn/${traySn}`,
    method: 'get'
  })
}

// 转派送
export function postStorageToPs(data) {
  return request({
    url: "/warehouse/storage/toPs",
		method: 'post',
		data
  })
}

// 转存仓
export function postStorageToCc(data) {
  return request({
    url: "/warehouse/storage/toCc",
		method: 'post',
		data
  })
}

// 更改大货中转
export function getStorageSameBatchGoods(twsId) {
  return request({
    url: `/warehouse/storage/getSameBatchGoods/${twsId}`,
		method: 'post',
		data: {}
  })
}

// 大货中转更改地址
export function postStorageSameBatchGoods(data) {
  return request({
    url: "/warehouse/storage/changeDeliveryAddress",
		method: 'post',
		data
  })
}

/**
 * 海外提派/卡车出库
 */
export function getTruckDeliveryList(data) {
  return request({
    url: '/distributionPlan/truckPage',
    method: 'post',
    data
  })
}
// 卡车详情 1=卡车出库；2=派卡车信息
export function getTruckDeliveryInfo(obj) {
	const { pageLocation, id } = obj || {};
	const ids = `${id}`.split(',')
  return request({
    url: `/distributionTruckInfo/info/${pageLocation}/${ids[0]}`,
    method: 'post',
    data: {}
  })
}
// 新增派车信息
export function postTruckDeliverySave(data) {
  return request({
    url: '/distributionTruckInfo/savePlan',
    method: 'post',
    data
  })
}
// 获取计划存放信息
export function getTruckDeliveryPlan(data = {}) {
  return request({
    url: '/distributionTruckInfo/storageOfPlan',
    method: 'post',
    data
  })
}
// 托盘编辑编辑货物（修改卡车信息时使用）
export function putItemByTrayPlan(refId) {
  return request({
    url: `/distributionTruckInfo/updItemByTray/${refId}`,
    method: 'put',
    data: {}
  })
}
// 托盘获取相关计划
export function getTruckListPlan(data = {}) {
  return request({
    url: '/distributionTruckInfo/planByTray',
    method: 'post',
    data
  })
}
// 卡车内货物列表
export function getTruckCargoList(obj) {
	const { idList, pageLocation, id } = obj || {};
  return request({
    url: `/distributionTruckInfo/freightInfo/${pageLocation}`,
    method: 'post',
		data: {
			idList: idList ? idList :`${id}`.split(',')
		}
  })
}
// 移除货物（修改卡车信息时使用）
export function delTruckCargoItem(id) {
  return request({
    url: `/distributionTruckInfo/delItem/${id}`,
    method: 'delete',
  })
}
// 新增货物（修改卡车信息时使用）
export function addTruckCargoItem(data) {
  return request({
    url: '/distributionTruckInfo/addItem',
    method: 'put',
    data
  })
}
// 编辑货物（修改卡车信息时使用）
export function updTruckCargoItem(data) {
  return request({
    url: '/distributionTruckInfo/updItem',
    method: 'put',
    data
  })
}
// 更新派车信息
export function putPlanTruckCargo(data) {
  return request({
    url: '/distributionTruckInfo/updPlan',
    method: 'put',
    data
  })
}
// 获取核实计划详情
export function getTruckDeliveryVerification(id) {
  return request({
    url: `/distributionPlan/verifyDistributionPlanInfo/${id}`,
    method: 'get'
  })
}
// 核实计划
export function putDeliveryVerification(data) {
  return request({
    url: '/distributionPlan/verifyDistributionPlan',
    method: 'put',
    data
  })
}

/**
 * 海外提派/快递信息列表
 */
 export function getExpressDeliveryList(data) {
  return request({
    url: '/distributionPlan/fastMailPage',
    method: 'post',
    data
  })
}
// 新增快递信息
export function postExpressDeliverySave(data) {
  return request({
    url: '/distributionFastMailInfo/savePlan',
    method: 'post',
    data
  })
}
// 更新快递信息
export function putExpressDeliverySave(data) {
  return request({
    url: '/distributionFastMailInfo/updPlan',
    method: 'put',
    data
  })
}
// 快递详情
export function getDeliveryDetails(obj) {
	const { pageLocation, id } = obj || {};
  return request({
    url: `/distributionFastMailInfo/info/${pageLocation}/${id}`,
    method: 'post',
    data: {}
  })
}
// 批量快递列表
export function getExpressFreightList(data) {
  return request({
    url: "/distributionFastMailInfo/freightInfo",
    method: 'post',
    data
  })
}
// 派送完成
export function putExpressDeliveryCompleted(data) {
  return request({
    url: '/distributionFastMailInfo/deliveryCompleted',
    method: 'put',
    data
  })
}
// 派送登记
export function putDeliveryRegistration(data) {
  return request({
    url: '/distributionFastMailInfo/deliveryRegistration',
    method: 'put',
    data
  })
}
// 批量派送登记
export function putBatchDeliveryRegistration(data) {
  return request({
    url: '/distributionFastMailInfo/batchDeliveryRegistration',
    method: 'put',
    data
  })
}

// 自提列表
export function POSTDistributionPlanPickupPage(data) {
  return request({
    url: '/distributionPlan/pickupPage',
    method: 'post',
    data
  })
}

// 自提快速登记
export function POSTDistributionPickupInfoSavePlan(data) {
  return request({
    url: '/distributionPickupInfo/savePlan',
    method: 'post',
    data
  })
}

// 拣货单打印
export function GetDownPickingSku(id) {
  return request({
    url: `/system/picking/downPickingSku/${id}`,
    method: 'get'
  })
}

// 自提提货查询货物信息
export function POSTDistributionPickupInfoFreightInfo(data) {
  return request({
    url: '/distributionPickupInfo/freightInfo',
    method: 'post',
    data
  })
}



// 已登记货物信息提货查询详情
export function GETdIstributionPickupInfo(id) {
  return request({
    url: `/distributionPickupInfo/info/${2}/${id}`,
		method: 'get',
  })
}




// 已登记自提提货
export function PUTDistributionPickupInfoDeliveryCompleted(data) {
  return request({
    url: '/distributionPickupInfo/deliveryCompleted',
    method: 'put',
    data
  })
}


// 卡车信息CMR No校验
export function POSTDistributionTruckInfo(params) {
  return request({
    url: "/distributionTruckInfo/getCountByBsRef",
    method: 'get',
    params
  })
}


/**
 * 获取还货列表
 */
export function getReturnGoodsGetList(params) {
  return request({
    url: '/warehouse/returnGoods/getList',
    method: 'get',
    params
  })
}



// 查询还货详情信息
export function getReturnGoodsDetailById(row) {
  const {id,...params}=row
  return request({
    url: `/warehouse/returnGoods/getGoodsDetailById/${id}`,
		method: 'get',
    params
  })
}

//库位
export function getReturnGoodsDetailLocationList(params) {
  return request({
    url: `/warehouse/location/getCustomerLocationList`,
		method: 'get',
    params
  })
}

//托盘
export function getReturnGoodsDetailTrayListVo(params) {
  return request({
    url: `/warehouse/tray/queryNullTrayListVo`,
		method: 'get',
    params
  })
}



// 保存还货计划
export function POSTReturnGoodsSavePlan(data) {
  return request({
    url: '/warehouse/returnGoods/savePlan',
    method: 'post',
    data
  })
}

// 打印还货单
export function getReturnGoodsPintById(id) {
  return request({
    url: `/warehouse/returnGoods/pintById/${id}`,
		method: 'get',
  })
}

// 完成还货
export function PUTReturnGoodsOver(id) {
  return request({
    url: `/warehouse/returnGoods/overReturnGoods/${id}`,
    method: 'put',
  })
}

// 按SKU批量打印面单
export function postWpcSkuPrinting(data) {
  return request({
    url: "/wpc/printing",
    method: "post",
    data,
  });
}

// 面单打印前合并
export function POSTMergeLablePdf(data) {
  return request({
    url: "/wpc/mergeLablePdf",
    method: "post",
    data,
  });
}


// 新增货物（修改卡车信息时使用）
export function PUTEditPrintLableSign(data) {
  return request({
    url: '/order/platform/editPrintLableSign',
    method: 'put',
    data
  })
}
