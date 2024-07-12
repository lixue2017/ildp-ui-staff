import request from "@/utils/request";
// import { getPopCusList } from "@/api/performance/record"

// 报关列表
export function getPopCusList(params) {
  return request({
    url: "/pop/cus/list",
    method: "get",
    params,
  });
}

// 报关列表申报/审核查验
export function popCusUpdateStatus(data) {
  return request({
    url: "/pop/cus/updateStatus",
    method: "put",
    data,
  });
}

// 报关列表删除
export function delPopCus(ids) {
  return request({
    url: `/pop/cus/${ids}`,
    method: "delete",
  });
}

// 新增报关业务列表
export function getPopCusBustypeList(params) {
  return request({
    url: "/pop/cus/getBustypeList",
    method: "get",
    params,
  });
}

// 新增报关
export function popCusPost(data) {
  return request({
    url: "/pop/cus",
    method: "post",
    data,
  });
}

// 修改报关
export function popCusPut(data) {
  return request({
    url: "/pop/cus",
    method: "put",
    data,
  });
}

// 报关详情头部
export function popCusOperationTit(params) {
  return request({
    url: "/pop/cus/getOperationInfo",
    method: "get",
    params,
  });
}

// 报关详情报关信息
export function popCusOperationContent(params) {
  return request({
    url: "/pop/cus/getOperationContnetInfo",
    method: "get",
    params,
  });
}

// 报关详情操作单信息
export function popCusOperationList(params) {
  return request({
    url: "/pop/cus/getOperationExplicitInfo",
    method: "get",
    params,
  });
}

// 获取编辑弹窗报关信息
export function popCusCusById(params) {
  return request({
    url: "/pop/cus/getCusById",
    method: "get",
    params,
  });
}

// 查询附件 type 1:报关附件 2：保险附件
export function getAttachInfoList({ id, type }) {
  return request({
    url: `/operation/transportation/getAttachInfoList/${id}/${type}`,
    method: "get",
  });
}

// 维护放行资料
export function updateAttachInfo(data) {
  return request({
    url: "/operation/transportation",
    method: "PUT",
    data,
  });
}

// 下载附件 type  1：箱单发票下载 2:批量下载报关资料  3:Sono下载（订舱附件）  4:拖车附件下载  5:报关资料(放行资料)
export function batchDownloadAttach(data) {
  return request({
    url: "/pop/cus/batchDownloadAttach",
    method: "post",
    data,
  });
}

// 获取新增弹窗报关信息
export function popCusOperationOrderId(params) {
  return request({
    url: "/pop/cus/getCusBySortBoxIdOroperationId",
    method: "get",
    params,
  });
}

/**
 * 拖车 - 操作单信息查询
 * type   0：到港  1：离港
 * operationOrderId           操作的ID
 */
export function getSelectTrailerByLcl(params) {
  return request({
    url: "/pop/trailer/initTrailerInfo",
    method: "get",
    params,
  });
}

/**
 * 一般拖车初始化信息
 */
export function getTrailerAddressList(params) {
  return request({
    url: "/pop/trailer/selectTrailerAddressListByBs",
    method: "get",
    params,
  });
}

/**
 * 拖车列表
 */
export function getTrailerList(params) {
  return request({
    url: "/pop/trailer/list",
    method: "get",
    params,
  });
}

/**
 * 拖车新增
 */
export function popTrailerPost(data) {
  return request({
    url: "/pop/trailer",
    method: "post",
    data,
  });
}

/**
 * 拖车编辑
 */
export function popTrailerPut(data) {
  return request({
    url: "/pop/trailer",
    method: "put",
    data,
  });
}

/**
 * 拖车Id查询拖车详细
 */
export function getTrailerDetail(id) {
  return request({
    url: `/pop/trailer/detail/${id}`,
    method: "get",
  });
}

/**
 * 拖车Id查询拖车地址列表
 */
export function getTrailerAddress(data) {
  return request({
    url: `/pop/address/list`,
    method: "post",
    data,
  });
}

/**
 * 拖车删除地址
 */
export function delTrailerAddress(id) {
  return request({
    url: `/pop/address/${id}`,
    method: "delete",
  });
}

/**
 * 拖车预览
 */
export function getTrailerPreview(obj) {
  const { tId } = obj || {};
  return request({
    url: `/pop/trailer/upload/${tId}`,
    method: "get",
  });
}

/**
 * 拖车列表删除
 */
export function delPopTrailer(id) {
  return request({
    url: `/pop/trailer/${id}`,
    method: "delete",
  });
}

/**
 * 拖车列表复制
 */
export function copyPopTrailer(data) {
  return request({
    url: "/pop/trailer/copy",
    method: "post",
    data,
  });
}

/**
 * 拖车审核查验
 */
export function setTrailerStatus(data) {
  return request({
    url: "/pop/trailer/updateStatus",
    method: "put",
    data,
  });
}

/**
 * 待清关/堡森列表
 */
export function getclearanceBsList(params) {
  return request({
    url: "/pop/clearance/bs-list",
    method: "get",
    params,
  });
}

/**
 * 待清关/同行列表
 */
export function getclearancePeerList(params) {
  return request({
    url: "/pop/clearance/peer-list",
    method: "get",
    params,
  });
}

/**
 * 待清关 -> 堡森/同行列表
 * 0-堡森 1-同行
 */
export function getclearanceCustomsList(params) {
  return request({
    url: "/pop/clearance/list/toCustoms",
    method: "get",
    params,
  });
}
/**
 * 待清关 -> 清关交接详情
 */
export function getclearanceInfoList(id) {
  return request({
    url: `/pop/clearance/info/${id}`,
    method: "get",
  });
}

/**
 * 清关管理/整柜/散货列表
 * typeList	装柜类型：0，1-整柜，2-拼柜
 */
export function getclearanceFclist(params) {
  return request({
    // url: '/pop/clearance/fcl',
    url: "/pop/clearance/list",
    method: "get",
    params,
  });
}

/**
 * 清关管理/散货列表
 */
export function getclearanceLclist(params) {
  return request({
    url: "/pop/clearance/lcl",
    method: "get",
    params,
  });
}

/**
 * 清关管理/状态/清关登记
 * "status": 清关状态,
 * "warehouseStatus": 入仓状态,
 * "trailerStatus": 拖车状态,
 */
export function popClearancePut(data) {
  return request({
    url: "/pop/clearance",
    method: "put",
    data,
  });
}
export function newPopClearancePut(data) {
  return request({
    url: "/pop/clearance/update",
    method: "put",
    data,
  });
}

/**
 * 清关电商一审/传统交接
 */
export function popClearancePost(data) {
  return request({
    // url: "/pop/clearance/add",
    url: "/tpcc/dstcFirstInstance",
    method: "post",
    data,
  });
}
// 电商订单国内清关二审
export function popTwoClearancePost(data) {
  return request({
    url: "/tpcc/dstcSecondInstance",
    method: "post",
    data,
  });
}
/**
 * 清关管理 -> 清关登记详情
 */
export function getclearanceRegisterInfo(id) {
  return request({
    url: `/pop/clearance/manage/info/${id}`,
    method: "get",
  });
}

/**
 * 清关管理/详情 交接信息-列表
 */
export function popClearanceInfoList(params) {
  return request({
    // url: '/pop/clearance/info-list',
    url: "/pop/check/list",
    method: "get",
    params,
  });
}

/**
 * 清关管理/详情 应收应付-操作单列表
 */
export function getSearchBusinessUnit(data = {}) {
  return request({
    url: "/pop/check/searchBusinessUnit",
    method: "post",
    data,
  });
}

/**
 * 清关管理/查验登记
 */
export function popClearanceInfoSave(data) {
  return request({
    // url: '/pop/clearance/info-save',
    url: "/pop/check",
    method: "put",
    data,
  });
}
/**
 * 清关管理/入仓登记
 */
export function warehousingRegistrationPut(data) {
  return request({
    url: `/operation/transportation/warehousing/register`,
    method: "put",
    data,
  });
}

/**
 * 清关管理/详情
 */
export function popClearanceDetail(id) {
  return request({
    // url: '/pop/clearance/detail',
    url: `/pop/clearance/CustomsInfo/${id}`,
    method: "get",
  });
}
// 对账单跳转清关详情
export function popBillClearanceDetail(id) {
  return request({
    url: `/pop/clearance/CustomsInfoById/${id}`,
    method: "get",
  });
}

// 海外仓提拆柜信息
export function getOverseaClearanceSalesman(id) {
  return request({
    url: `/oversea/clearance/order/getSalesmanAndWms/${id}`,
    method: "get",
  });
}

/**
 * 获取清关信息
 * type = 0清关交接 1清关登记
 * orderNo 操作单号
 */
export function popClearanceOrder(params) {
  return request({
    url: "/pop/clearance/order-clearance",
    method: "get",
    params,
  });
}

/**
 * 清关管理/拖车状态修改
 */
export function popClearanceTrailer(data) {
  return request({
    url: "/pop/clearance/trailer-edit",
    method: "post",
    data,
  });
}

/**
 * 待审核电商列表查询
 */
export function getEsUnconfirmed(data) {
  return request({
    url: "/pop/clearance/list/toCustoms/es/unconfirmed",
    method: "POST",
    data,
  });
}

/**
 * 已提交电商列表查询
 */
export function getEsConfirmed(data) {
  return request({
    url: "/pop/clearance/list/toCustoms/ec/confirmed",
    method: "POST",
    data,
  });
}

/**
 * 待审核传统列表查询
 */
export function getTraditionUnconfirmed(data) {
  return request({
    url: "/pop/clearance/list/toCustoms/tradition/unconfirmed",
    method: "POST",
    data,
  });
}

/**
 * 已提交传统列表查询
 */
export function getTraditionConfirmed(data) {
  return request({
    url: "/pop/clearance/list/toCustoms/tradition/confirmed",
    method: "POST",
    data,
  });
}

/**
 * 清关审核/备注查询
 */
export function getLogList(data) {
  return request({
    url: "/system/log/list",
    method: "POST",
    data,
  });
}
/**
 * 清关详情查询
 */
export function getPopClearanceInfoList(data) {
  return request({
    url: "/pop/clearance/info/list",
    method: "POST",
    data,
  });
}

/**
 * 获取订单内货物
 */
export function getOrderTransportationGoods(tootId, importType) {
  return request({
    url: `/operation/transportation/orderGoods/${tootId}/${importType || 3}`,
    method: "get",
  });
}
// 订单内货物更改地址
export function putOrderGoodsAddress(data) {
  return request({
    url: "/order/goods/changeAddress",
    method: "put",
    data,
  });
}

/**
 * 清关审核交接
 */
export function clearanceToCustomseEid(data) {
  return request({
    url: "/pop/clearance/list/toCustoms/etid",
    method: "POST",
    data,
  });
}

/**
 * 清关审核/备注确认
 */
export function submitLogSystemLog(data) {
  return request({
    url: "/system/log",
    method: "POST",
    data,
  });
}
/**
 * 清关HBL资料下载
 */
export function previewDownloadHblList(data) {
  return request({
    url: "/pop/bill/previewDownloadHblList",
    method: "POST",
    data,
  });
}
// 清关派送表导出
export function getExportClearanceVerify({ id }) {
  return request({
    url: `/clearanceGoods/exportVerifyOrderGoods/${id}`,
    method: "get",
  });
}

/**
 * 清关HBL资料下载
 */
export function batchExportZipDownload(data) {
  return request({
    url: "/customer/product/invoice/batchExportZip",
    method: "POST",
    data,
  });
}

/**
 * 清关箱单发票资料下载-电商
 */
export function batchExportZipDownloadEC(data) {
  return request({
    url: "/customer/product/clearance/invoice/batchExportZip",
    method: "POST",
    data,
  });
}

/**
 * 清关附件上传
 */
export function clearanceAccessory(data) {
  return request({
    url: "/pop/clearance/accessory",
    method: "POST",
    data,
  });
}
// 清关附件删除
export function delClearanceAccessory(ids) {
  return request({
    url: `/customer/order/attach/${ids}`,
    method: "delete",
  });
}

/**
 * 清关交接获取数据
 */
export function getClearanceGenerateNumber(data) {
  return request({
    url: "/pop/clearance/generateNumber",
    method: "POST",
    data,
  });
}

/**
 * 海外清关管理导出
 */
export function exportExcelList(data) {
  return request({
    url: "/pop/clearance/exportExcelList",
    method: "POST",
    data,
  });
}

/**
 * 直清完结
 */
export function PUTPopClearanceOrderCompleted(data) {
  const { id, ...obj } = data;
  return request({
    url: `/pop/clearance/orderCompleted/${id}`,
    method: "put",
    obj,
  });
}

// 获取国内清关以及海外清关列表组合
export function getClearanceAllList(params) {
  return request({
    url: "/pop/clearance/getClearanceAllList",
    method: "get",
    params,
  });
}

/**
 * 清关交接UMA导出
 */
export function POSTClearanceUmaExport(data) {
  return request({
    url: "/customer/product/clearance/umaExport",
    method: "POST",
    data,
  });
}

/**
 * 清关交接PVA导出
 */
export function POSTClearancePvaExport(data) {
  return request({
    url: "/customer/product/clearance/pvaExportZip",
    method: "POST",
    data,
  });
}

/**
 * 海外清关审核交接（一审）
 */
export function POSTFirstInstance(data) {
  return request({
    url: "/pop/clearance/firstInstance",
    method: "POST",
    data,
  });
}

// 海外清关订单清关交接信息
export function getCustomsClearanceInfo(id) {
  return request({
    url: `/pop/clearance/customsClearanceInfo/${id}`,
    method: "get",
  });
}

/**
 * 海外清关审核交接（二审）
 */
export function POSTSecondInstance(data) {
  return request({
    url: "/pop/clearance/secondInstance",
    method: "POST",
    data,
  });
}

/**
 * 海外清关交接附件上传
 */
export function clearanceAccessoryQg(data) {
  return request({
    url: "/pop/clearance/accessoryQg",
    method: "POST",
    data,
  });
}

/**
 * 电商头程订单国内清关列表
 */
export function postEcInstancePage(data) {
  return request({
    url: "/tpcc/dstcInstancePage",
    method: "POST",
    data,
  });
}
// 箱单发票维护记录
export function postPackingRecord(data) {
  return request({
    url: "/tpcc/xdfpwhjl",
    method: "POST",
    data,
  });
}
// 清关详情预报/核实备注
export function postClearanceItemRemark(data) {
  return request({
    url: "/tpcc/itemRemark",
    method: "POST",
    data,
  });
}
// 获取国内清关邮件收件人
export function getClearanceEmailRecipient(data) {
  return request({
    url: "/tpcc/getEmailRecipient",
    method: "post",
    data,
  });
}
// 国内清关电商二审打回
export function postEcSecondToFirst(tootId) {
  return request({
    url: `/tpcc/dstcSecondToFirst/${tootId}`,
    method: "post",
    data: {},
  });
}
