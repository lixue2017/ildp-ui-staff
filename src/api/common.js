import request from "@/utils/request";
import store from "@/store";
import { getContactsList as apiGetContactsList } from "@/api/basicInfo/contacts";
import { getWarehouseList as apiGetWarehouseList } from "@/api/basicInfo/warehouse";

// import { comRepeatedRequest } from "@/api/common";
export function comRepeatedRequest(_self, httpRequest, opt = {}) {
  /**
   * 有连续应用此方法时，需要取消延时返回，否则后一个接口会报‘重复点击’
   * 可以在后一个接口调用前 this.preventRepeatedClicks = false 重置状态
   */
  return new Promise((resolve, reject) => {
    if (_self.preventRepeatedClicks) {
      // 防止重复点击请求
      return reject("重复点击");
    }
    _self.preventRepeatedClicks = true;

    httpRequest(opt)
      .then((res) => {
        resolve(res);
      })
      .finally(() => {
        setTimeout(() => {
          // 加延时防止提交后获取接口改变状态前，再次点击
          _self.preventRepeatedClicks = false;
        }, 600);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/** 防止重复保存-button显示loading效果 post与put请求，get请求不要用这个方法（无效） */
export function comSaveRepeatedRequest(saveHttpRequest, saveParam = {}) {
  return new Promise((resolve, reject) => {
    if (store.getters.getIsRepeatedClick) {
      // 防止重复点击请求
      return reject("重复点击");
    }

    store.dispatch("settings/actionFormSubmit", true);
    setTimeout(() => {
      /** 提交时其他校验未通过，且返回不是Promise时 */
      store.dispatch("settings/actionFormSubmit", false);
    }, 300);

    saveHttpRequest(saveParam)
      .then((res) => {
        resolve(res);
      })
      .finally(() => {
        setTimeout(() => {
          // 加延时防止提交后获取接口改变状态前，再次点击
          store.dispatch("settings/actionRepeatedClick", false);
        }, 100);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/** 有连续请求，需要取消延时返回，否则后一个接口会报‘重复点击’ */
export function comContinuityRepeatedRequest(saveHttpRequest, saveParam = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      store.dispatch("settings/actionRepeatedClick", false);
      comSaveRepeatedRequest(saveHttpRequest, saveParam)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 110);
  });
}

//模糊搜索
export function querySearch(query) {
  return request({
    url: "/customer/category/list",
    method: "get",
    params: query,
  });
}

//图片上传
export function upLoad(data) {
  return request({
    url: "/customer/upload/avatar",
    method: "get",
    data,
  });
}

// 获取产品信息历史修订记录
export function getProductList(params) {
  const url = `/system/product/list/${params.id}/${params.cusProductId}`;
  delete params.id;
  delete params.cusProductId;
  return request({
    url,
    method: "get",
    params,
  });
}

//获取历史修订记录
export function getHistoryRecord(params) {
  const url = `/history/revision/${params.id}/${params.type}`;
  delete params.id;
  delete params.type;
  return request({
    url,
    method: "get",
    params,
  });
}

// 下拉框模糊搜索
export function querySearchList(params) {
  return request({
    url: "/basic/info/list",
    method: "get",
    params: params,
  });
}

// 查询页面数据字典
export function getBasicArchives(params) {
  return request({
    url: "/operate/data/listByTypeEns",
    method: "get",
    params,
  });
}

//查询发货仓收货仓
export function getPrivateWarehouseList(params, platformType) {
  return apiGetWarehouseList({
    statusList: params.dataStatus,
    pageSize: 999,
    ...params,
    warehouseCode: params.name,
    platformTypeList: platformType,
  });
}

// 查询联系人
export function getContactsList(params) {
  return apiGetContactsList({
    ...params,
    pageSize: 999,
  });
}

//获取来源客户
export function getSourceCustomer(params) {
  let url = "/staff/order/fba/getCustServiceList";
  return request({
    url,
    method: "get",
    params,
  });
}

//获取负责员工列表
export function getChargeStaff({ name, pageNum = 1, pageSize = 10 }) {
  return request({
    url: `/crm/info/getCustServiceList`,
    method: "get",
    params: {
      name,
      pageNum,
      pageSize,
    },
  });
}

// 查询客户列表
export function getCustomerList({
  clientIdentity,
  pageNum = 1,
  pageSize = 10,
}) {
  return request({
    url: "/crm/info/list",
    method: "get",
    params,
  });
}

// 身份筛选客户列表
export function getIdentityList(params) {
  return request({
    url: "/crm/info/identityList",
    method: "get",
    params,
  });
}

//创建人下拉
export function getUserList(params) {
  let url = "/staff/ec/user/list";
  return request({
    url,
    method: "get",
    params,
  });
}

//订舱代理
export function bookingAgent(params, routeProxy) {
  let url = `/operate/route-no/cabin-proxy${
    routeProxy ? "/" + routeProxy : "/-1"
  }`;
  return request({
    url,
    method: "get",
    params,
  });
}

// 查询箱型尺寸列表，空运港口与海运港口公用
export function getSizeList(params) {
  return request({
    url: "/operate/size/list",
    method: "get",
    params: {
      ...params,
      nameCn: params.name,
    },
  });
}

// 获取目的地下拉列表
export function getCustomerWarehouseList(params) {
  return request({
    url: "/customer/ec/warehouse/list",
    method: "get",
    params,
  });
}

/**
 * 获取拖车运送地址
 * 仓库/提货地址/联系人地址
 */
export function getTotalWarehouseList(params) {
  return request({
    url: "/pop/trailer/selectTotalWarehouseList",
    method: "get",
    params,
  });
}

//客户信息新客户归属
export function getoptMainList() {
  return request({
    url: "/system/dept/optMain/list",
    method: "get",
  });
}

//获取记账主体
export function getAccmainCus() {
  return request({
    url: "/basic/login/user/accMain/cus",
    method: "get",
  });
}

// 通过记账主体ID获取往来单位
export function getforeclose(id, params) {
  return request({
    url: `/crm/info/list/foreclose/${id}`,
    method: "get",
    params,
  });
}

// 获取市场部主体
export function getBazaarList(params) {
  return request({
    url: "/crm/info/bazaar/list",
    method: "get",
    params,
  });
}

// 获取记账主体
export function getBillingMain(params) {
  let url = "/settle/accounts/dim/billingMain";
  return request({
    url,
    method: "get",
    params,
  });
}

// 获取部门的往来单位
export function getDealingCompany(params) {
  let url = "/settle/accounts/dim/dealingCompany";
  return request({
    url,
    method: "get",
    params,
  });
}

// 获取全部往来单位
export function getAllDealingCompany(params) {
  return request({
    url: "/crm/info/listAll",
    method: "get",
    params,
  });
}

// 获取部门
export function getDept(params) {
  let url = "/settle/accounts/dim/dept";
  return request({
    url,
    method: "get",
    params,
  });
}

// 获取所有员工
export function getAllUser(name) {
  return request({
    url: `/system/user/all`,
    method: "get",
    params: name,
  });
}

// 获取顶级部门相关角色的人员 roleIdList=1,2
export function getTopDeptUser(params) {
  return request({
    url: `/system/user/getListVoByRoleAndDept`,
    method: "get",
    params,
  });
}

// 获取相关角色的人员 roleIdList=1,2
export function getRelatedRoleUser(params) {
  return request({
    url: `/system/user/getListVoByRole`,
    method: "get",
    params,
  });
}

// 根据部门ID查询一级部门员工
export function getUserByDept(deptId, data) {
  return request({
    url: `/system/user/getByDept/${deptId}`,
    method: "get",
    params: data,
  });
}

// 当前登录人的仓库(1个)
export function getUserWarehouse(params) {
  return request({
    url: `/cus/warehouse/main/opeMain`,
    method: "get",
    params,
  });
}

// 账单预览
export function uploadSettleBill(paramData) {
  const { idStr, ...data } = paramData || {};
  return request({
    url: `/settle/bill/upload`,
    // url: `/settle/bill/upload/${idStr}`,
    method: "post",
    data,
  });
}

// 结算付款申请单预览
export function postPaymentApplyBill(data) {
  const { id } = data || {};
  return request({
    url: `/settle/bill/preview/paymentApplyBill/${id}`,
    method: "post",
  });
}

// 拣货单预览
export function uploadPickingBill(data) {
  return request({
    url: `/system/picking/upload`,
    method: "post",
    data,
  });
}

// 附件删除
export function deleteAttach(ids) {
  return request({
    url: `/customer/order/attach/${ids}`,
    method: "delete",
  });
}

// 自定义列查询 routeType-路由
export function systemColumnList(data) {
  return request({
    url: `/system/column/list`,
    method: "post",
    data,
  });
}

// 自定义列保存
export function saveSystemColumn(data) {
  return request({
    url: `/system/column`,
    method: "post",
    data,
  });
}

// 根据企业查询账户信息
export function getCrmList(params) {
  return request({
    url: "/crm/address/list",
    method: "get",
    params,
  });
}

/**
 * 附件列表
 * operationOrderId - 操作单Id
 * orderId - 订单Id
 * orderType - 订单类型
 * queryType - 1:客户端订单 2:员工端订单 3:员工端操作单
 */
export function getOrderAttachList(params) {
  return request({
    url: "/customer/order/attach/orderAttachList",
    method: "get",
    params,
  });
}

/**
 * 附件列表
 * operationOrderId - 操作单Id
 * orderId - 订单Id
 * orderType - 订单类型
 * 用于有类型选择的附件上传后查询最新的附件数据
 */
export function newGetAttachListByOrderId(data) {
  return request({
    url: "/customer/order/attach/newGetAttachListByOrderId",
    method: "POST",
    data,
  });
}

// 对账单邮箱附件
export function getBillAttachListByTootId(data) {
  return request({
    url: "/customer/order/attach/newGetAttachListByTootId",
    method: "post",
    data,
  });
}

// 获取附件资料
export function getAttachListByOrderId(data) {
  return request({
    url: "/customer/order/attach/getAttachListByOrderId",
    method: "POST",
    data,
  });
}

// 保存附件资料
export function updateAttachListByOrderId(data) {
  return request({
    url: "/customer/order/attach/updateAttachListByOrderId",
    method: "POST",
    data,
  });
}

//对账单与任务单详情账单明细汇总数据
export function getAccountsSubtotal(data) {
  return request({
    url: "/settle/accounts/subtotal",
    method: "POST",
    data,
  });
}

//当前登录者名下客户
export function getListByFollowUserIdAndKa(params) {
  return request({
    url: "/crm/info/getListByFollowUserIdAndKa",
    method: "get",
    params,
  });
}

// 操作单上传附件（目前仅用于上传客户端订单两种类型的附件）
export function updateAttachListByOrderIdNew(data) {
  return request({
    url: "/customer/order/attach/updateAttachListByOrderIdNew",
    method: "POST",
    data,
  });
}

// 操作记录
// 电商、传统、其他
export function getOperatorInfo(data) {
  return request({
    url: "/operation/transportation/operatorInfo",
    method: "POST",
    data,
  });
}
// 一件代发
export function getPlatformOperatorInfo(data) {
  return request({
    url: "/staff/order/platform/operatorInfo",
    method: "POST",
    data,
  });
}
// FBA
export function getFBAOperatorInfo(data) {
  return request({
    url: "/staff/order/fba/operatorInfo",
    method: "POST",
    data,
  });
}
// 第三方入库
export function getThirdPartyOperatorInfo(data) {
  return request({
    url: "/thirdPartyOrder/operatorInfo",
    method: "POST",
    data,
  });
}
// 海外清关直派操作记录
export function getClearanceOperatorInfo(data) {
  return request({
    url: "/oversea/clearance/order/operatorInfo",
    method: "POST",
    data,
  });
}

// 根据委托人查询提货地址信息列表
export function getPickupAddressList(params) {
  return request({
    url: `/inquirySheet/getPickupAddressList`,
    method: "get",
    params,
  });
}

// 应收/应付对账单导出
export function POSTExportListAndGoods(data) {
  return request({
    url: "/settle/accounts/exportListAndGoods",
    method: "POST",
    data,
  });
}

// 打印唛头10*10格式
export function getShippingMark(data) {
  return request({
    url: "/staff/ec/shipping-mark",
    method: "post",
    data,
  });
}

// 打印唛头A4格式
export function getShippingMarkFour(data) {
  return request({
    url: "/staff/ec/shipping-mark-four",
    method: "post",
    data,
  });
}

// 打印唛头
export function getDownShippingMark(params) {
  return request({
    url: "/staff/ec/get/downShippingMark",
    method: "get",
    params,
  });
}

// 打印入箱清单
export function getPrintWarehousing(data) {
  return request({
    url: "/staff/ec/warehousing",
    method: "post",
    data,
  });
}

// 发票明细获取业务员
export function POSTSettleAccountsSalesman(data) {
  return request({
    url: "/settle/accounts/getSalesman",
    method: "POST",
    data,
  });
}

// 报销单账户企业名称查询
export function GETAddressAccountInfoByCus(params) {
  return request({
    url: "/crm/address/accountInfoByCus",
    method: "get",
    params,
  });
}

// 报销单账户银行账户查询
export function GETAddressAccountInfoByName(params) {
  return request({
    url: "/crm/address/accountInfoByName",
    method: "get",
    params,
  });
}

// 获取航线下拉数据
export function getRouteGroup(params) {
  return request({
    url: "/operate/route/group",
    method: "get",
    params,
  });
}

// 获取排柜下拉数据
export function getListNameEnIsSortBox(params) {
  return request({
    url: "/operate/route/listNameEnIsSortBox",
    method: "get",
    params,
  });
}

// 子单打印唛头10*10格式
export function getShippingMarkByOperation(data) {
  return request({
    url: "/staff/ec/shipping-mark/byOperation",
    method: "post",
    data,
  });
}

// 子单打印唛头A4格式
export function getShippingMarkFourByOperation(data) {
  return request({
    url: "/staff/ec/shipping-mark-four/byOperation",
    method: "post",
    data,
  });
}

// 获取拣货订单所有列表（待拣货信息）
export function GETSystemPickingOrderAllList(params) {
  return request({
    url: "/system/picking/getOrderAllList",
    method: "get",
    params,
  });
}

// 获取拣货订单所有列表（所有搜索Sku的ids）
export function GETPickingOrderAllProductIds(params) {
  return request({
    url: "/system/picking/getOrderAllProductIds",
    method: "get",
    params,
  });
}
//获取拣货订单所有列表（所有搜索客户ids）
export function GETPickingOrderAllCustomerIds(params) {
  return request({
    url: "/system/picking/getOrderAllCustomerIds",
    method: "get",
    params,
  });
}
//获取拣货订单所有列表（所有搜索物流产品ids）
export function GETPickingOrderAllLogisticsProductIds(params) {
  return request({
    url: "/system/picking/getOrderAllLogisticsProductIds",
    method: "get",
    params,
  });
}

//部分拣货完成
export function PUTPartPickingOrder(data) {
  return request({
    url: `/system/picking/partPickingOrder`,
    method: "put",
    data,
  });
}

// 线索管理-根据业务类型获取下拉选项
export function getSalesLeadsSelectPage(data) {
  return request({
    url: "/crm/salesLeads/selectPage",
    method: "post",
    data,
  });
}

// 获取自己或自己可视下属
export function getDeptByUser(params) {
  return request({
    url: "/system/user/deptBy",
    method: "get",
    params,
  });
}

// 根据人员id获取客户归属主体
export function getBusinessOwnership(id) {
  return request({
    url: `/crm/salesLeads/getBusinessOwnership/${id}`,
    method: "get",
  });
}
