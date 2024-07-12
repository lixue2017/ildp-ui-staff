import request from '@/utils/request'
// import { getSelectStickerAllList } from "@/api/warehouse/process"

/**
 * 贴标列表
 */
export function getSelectStickerAllList(params) {
  return request({
    url: '/staff/order/fbaFreight/selectStickerAll',
    method: 'get',
    params
  })
}
// 贴标
export function fbaFreightPut(data) {
  return request({
    url: '/staff/order/fbaFreight',
    method: 'put',
    data
  })
}
// 编辑
export function fbaFreightPost(data) {
  return request({
    url: '/staff/order/fbaFreight/update',
    method: 'post',
    data
  })
}

/**
 * 快递信息
 */
 export function exwarehouseRecordList(params) {
  return request({
    url: '/exwarehouse/record/list',
    method: 'get',
    params
  })
}

/**
 * 派卡车信息
 */
 export function exwarehouseTruckList(params) {
  return request({
    url: '/exwarehouse/truck/list',
    method: 'get',
    params
  })
}

/**
 * 派卡车详情货物列表
 */
 export function getDetailTruckFreightList(params) {
	const { truckId } = params
  return request({
    url: `/exwarehouse/recordTruck/truckFreightList/${truckId}`,
    method: 'get',
    // params
  })
}

/**
 * 卡车详情ID查询订单信息
 */
 export function truckRecordDetails(id) {
  return request({
    url: `/exwarehouse/truck/${id}`,
    method: 'get'
  })
}

/**
 * 删除卡车信息
 */
 export function delTruckRecord(id) {
  return request({
    url: `/exwarehouse/truck/${id}`,
    method: 'delete'
  })
}

/**
 * 卡车详情ID查询订单信息
 */
 export function recordTruckList(params) {
  return request({
    url: '/exwarehouse/recordTruck/list',
    method: 'get',
    params
  })
}

/**
 * 卡车详情订单附件保存
 */
 export function truckSaveAttrch(data) {
  return request({
    url: '/exwarehouse/truck/saveAttrch',
    method: 'post',
    data
  })
}

/**
 * 卡车详情整箱附件保存
 */
 export function truckSaveBoxAttrch(data) {
  return request({
    url: '/exwarehouse/truck/saveAttrchPodBox',
    method: 'post',
    data
  })
}

/**
 * 卡车详情pod附件保存
 */
 export function postSaveTruckPod(data) {
  return request({
    url: '/warehouse/pod/save',
    method: 'post',
    data
  })
}

/**
 * 订单集合查询附件列表
 */
 export function truckOrderFiles(data) {
  return request({
    // url: '/exwarehouse/truck/getTruckAttchByOrderIds',
		url: '/warehouse/pod/list',
    method: 'post',
    data
  })
}

/**
 * 订单POD附件删除
 */
 export function delTruckPodFile(params) {
	const { podId } = params || {};
  return request({
    url: `/warehouse/pod/del/${podId}`,
    method: 'delete'
  })
}

/**
 * 出库转换
 */
 export function truckServerTypeConvert(data) {
  return request({
    url: '/exwarehouse/truck/serverTypeConvert',
    method: 'post',
    data
  })
}

// 派卡车预览
export function truckPreviewDownload(params) {
  return request({
    url: '/exwarehouse/truck/previewDownload',
    method: 'get',
    params
  })
}
// 派卡车预览2
export function getDeliveryTruckPreview(obj) {
	const { id } = obj || {};
  return request({
    url: `/distributionTruckInfo/preview/${id}`,
    method: 'get'
  })
}

/**
 * 派卡车信息列表
 */
 export function getDistributionTruckList(data = {}) {
  return request({
    url: '/distributionTruckInfo/getPage',
    method: 'post',
    data
  })
}
// 删除卡车
export function delDistributionTruck(id) {
  return request({
    url: `/distributionTruckInfo/del/${id}`,
    method: 'delete'
  });
}
// 卡车登记校验订单状态 type: 1-卡车，2-快递，3-自提
export function getTruckCheckOrderState(data) {
  return request({
    url: `/distributionPlan/ckAdditionalCheck`,
		method: "post",
		data
  });
}
// 卡车登记校验货物状态
export function postTruckCheck(data) {
  return request({
    url: '/distributionTruckInfo/ckCheck',
    method: 'post',
    data
  })
}
// 派送登记
export function putTruckRegistration(data) {
  return request({
    url: '/distributionTruckInfo/deliveryRegistration',
    method: 'put',
    data
  })
}
// 派送完成
export function putTruckDeliveryArrival(data) {
  return request({
    url: '/distributionTruckInfo/deliverySuccessful',
    method: 'put',
    data
  })
}
// 派送方式转换
export function changePlanDistributionType(data) {
  return request({
    url: '/distributionPlan/changeDistributionType',
    method: 'put',
    data
  })
}
// 派送信息绑定POD附件
export function postPodTruckAttach(data) {
  return request({
    url: '/distributionAttachRef/bind',
    method: 'post',
    data
  })
}
// 派送信息附件解绑
 export function delPodTruckAttach(obj) {
	const { bindId } = obj || {};
  return request({
    url: `/distributionAttachRef/del/${bindId}`,
    method: 'delete'
  })
}

/**
 * 快递信息列表
 */
 export function getExpressInfoPageList(data) {
  return request({
    url: '/distributionFastMailInfo/getPage',
    method: 'post',
    data
  })
}
// 快递导出
export function exportExpressList(data) {
  return request({
    url: '/distributionFastMailInfo/exportList',
    method: 'post',
    data
  })
}
// 删除快递
export function delExpressInfo(id) {
  return request({
    url: `/distributionFastMailInfo/del/${id}`,
    method: 'delete'
  })
}

// WMS退仓订单列表
export function getReturnWmsOrderList(data) {
  return request({
    url: `/returnWmsOrder/pageList`,
    method: "post",
    data,
  });
}

// WMS退仓包裹列表
export function getReturnWmsPackageList(data) {
  return request({
    url: `/returnWmsOrder/packagePageList`,
    method: "post",
    data,
  });
}

// WMS退仓订单接单
export function putReturnWmsOrderReceiving(data) {
  return request({
    url: `/returnWmsOrder/batchReceivingOrders`,
    method: "put",
    data,
  });
}

// WMS退仓订单打回
export function putReturnWmsOrderRepulse(data) {
  return request({
    url: `/returnWmsOrder/repulse`,
    method: "put",
    data,
  });
}

// WMS退仓订单详情
export function getReturnWmsOrderInfo(id) {
  return request({
    url: `/returnWmsOrder/getInfo/${id}`,
    method: "get",
  });
}

// WMS退仓包裹详情
export function getReturnWmsPackageInfo(id) {
  return request({
    url: `/returnWmsOrder/getPackageInfo/${id}`,
    method: "get",
  });
}

// WMS退仓订单内包裹列表
export function getReturnWmsOrderPackages(obj) {
  const { id } = obj || {};
  return request({
    url: `/returnWmsOrder/getPackagesFromOrder/${id}`,
    method: "get",
  });
}

// WMS退仓订单业务备注
export function putReturnWmsOrderRemark(data) {
  return request({
    url: `/returnWmsOrder/saveRemark`,
    method: "put",
    data,
  });
}

// 检索可收货信息
export function getSearchStorageReceipt(data) {
  return request({
    url: `/tWarehouseStorageMp/searchReceipt`,
    method: "post",
    data,
  });
}

// 根据ID查询收货信息
export function getSearchReceiptList(data) {
  return request({
    url: `/tWarehouseStorageMp/searchReceiptInfo`,
    method: "post",
    data,
  });
}

// WMS退仓收货
export function postReturnReceipt(data) {
  return request({
    url: `/tWarehouseStorageMp/receiptGoods`,
    method: "post",
    data,
  });
}

// WMS退仓编辑收货数量
export function putReturnReceipt(data) {
  return request({
    url: `/tWarehouseStorageMp/updReceipt`,
    method: "put",
    data,
  });
}
// WMS退仓上传收货附件
export function uploadReturnReceipt(data) {
  return request({
    url: `/tWarehouseStorageMp/uploadShAttach`,
    method: "post",
    data,
  });
}
// WMS退仓收货编辑备注
export function putRemarkReturnReceipt(data) {
  return request({
    url: `/tWarehouseStorageMp/updShRemark`,
    method: "put",
    data,
  });
}

// WMS退仓删除收货记录
export function delReturnReceipt(id) {
  return request({
    url: `/tWarehouseStorageMp/rmReceipt/${id}`,
    method: "delete",
  });
}

// WMS退仓收货完成
export function postReturnReceiptOk(data) {
  return request({
    url: `/tWarehouseStorageMp/receiptOk`,
    method: "post",
    data,
  });
}

// WMS退仓重新收货
export function putResetReceiptGoods(data) {
  return request({
    url: `/tWarehouseStorageMp/resetReceiptGoods`,
    method: "put",
    data,
  });
}

// 收货批量上架
export function postStorageGrounding(data) {
  return request({
    url: "/tWarehouseStorageMp/grounding",
    method: 'post',
    data
  })
}

// 收货新增SKU
export function postReceiptAddSku(data) {
  return request({
    url: `/tWarehouseStorageMp/addSku`,
    method: "post",
    data,
  });
}

// 收货新增包裹
export function postReceiptAddPackage(data) {
  return request({
    url: `/tWarehouseStorageMp/addPackage`,
    method: "post",
    data,
  });
}

// 退仓批量新增包裹
export function addReturnWmsPackageList(data) {
  return request({
    url: `/returnWmsOrder/batchAddPackage`,
    method: "post",
    data,
  });
}

/** 预收货上架 - 订单信息 */
export function getExpectedInfo(data) {
  return request({
    url: `/shelvePlan/yshsjddxx`,
    method: "post",
    data,
  });
}
// 预收货物信息
export function getExpectedGoods(data) {
  return request({
    url: `/shelvePlan/yshsjhwxx`,
    method: "post",
    data,
  });
}
// 保存预收货计划
export function putSaveExpectedGoods(data) {
  return request({
    url: `/shelvePlan/updPlan`,
    method: "put",
    data,
  });
}
// 保存预收货计划
export function postConfirmListing(data) {
  return request({
    url: `/shelvePlan/confirmListing`,
    method: "post",
    data,
  });
}
// 移除预排库上架信息
export function delKwShelvePlan(cId) {
  return request({
    url: `/shelvePlan/delShelvePlanKw/${cId}`,
    method: "DELETE",
  });
}
// 新增预排库上架信息
export function addKwShelvePlan(data) {
  return request({
    url: "/shelvePlan/addShelvePlanKw",
    method: "post",
    data,
  });
}

// 排库计划列表
export function getInventoryList(data) {
  return request({
    url: `/shelvePlan/pageList`,
    method: "post",
    data,
  });
}
// 删除排库计划
export function delInventoryPlan(shelvePlanId) {
  return request({
    url: `/shelvePlan/delPlan/${shelvePlanId}`,
    method: "DELETE",
  });
}
// 排库计划详情
export function getInventoryById(shelvePlanId) {
  return request({
    url: `/shelvePlan/yshsjddxxById/${shelvePlanId}`,
    method: "get",
  });
}
