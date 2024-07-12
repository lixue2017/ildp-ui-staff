import request from "@/utils/request";

// 获取销售物流价格列表
export function getCostLogisticsList(data) {
  return request({
    url: "/costSaleLogisticsPrice/getPage",
    method: "post",
    data,
  });
}

// 获取重量段模板配置项模板复制列表
export function getWeightSectionTempList(data) {
  return request({
    url: "/weightSectionTemp/itemCopyList",
    method: "post",
    data,
  });
}

// 新建、编辑销售物流价格
export function addOrUpdSaleLogistics(data) {
  return request({
    url: "/costSaleLogisticsPrice/addOrUpd",
    method: "post",
    data,
  });
}

// 获取销售物流价格详情
export function getCostLogisticsInfo(id) {
  return request({
    url: `/costSaleLogisticsPrice/getInfo/${id}`,
    method: "get",
  });
}

// 销售物流价格状态流转
export function updStateCostLogistics(data) {
  return request({
    url: "/costSaleLogisticsPrice/updState",
    method: "put",
    data,
  });
}

// 删除销售物流价格
export function deleteCostLogistics({ id }) {
  return request({
    url: `/costSaleLogisticsPrice/del/${id}`,
    method: "delete",
  });
}

// 销售操作价格列表
export function getSaleOptPriceList(data) {
  return request({
    url: "/costSaleOptPrice/getPage",
    method: "post",
    data,
  });
}

// 新建、编辑销售物流价格
export function addOrUpdSaleOptPrice(data) {
  return request({
    url: "/costSaleOptPrice/addOrUpd",
    method: "post",
    data,
  });
}

// 销售物流价格详情
export function getSaleOptPriceInfo(id) {
  return request({
    url: `/costSaleOptPrice/getInfo/${id}`,
    method: "get",
  });
}

// 销售操作价格启用禁用
export function enableDisableSaleOptPrice({ id }) {
  return request({
    url: `/costSaleOptPrice/enableDisable/${id}`,
    method: "put",
  });
}

// 删除销售操作价格
export function deleteSaleOptPrice({ id }) {
  return request({
    url: `/costSaleOptPrice/del/${id}`,
    method: "delete",
  });
}

// 复制销售操作价格
export function copySaleOptPrice(id) {
  return request({
    url: `/costSaleOptPrice/copyInfo/${id}`,
    method: "get",
  });
}

// 费用试算
export function costTrialCalculate(data) {
  return request({
    url: "/costTrial/calculate",
    method: "post",
    data,
  });
}

// 客户等级分页列表数据（等级维度）
export function getCustomerLevel(data) {
  return request({
    url: "/customerlevel/pagelist",
    method: "post",
    data,
  });
}

// 获取是否是通用规则
export function getIsBindAllCustomer(wmsId) {
  return request({
    url: `/costSaleOptPrice/isBindAllCustomer/${wmsId}`,
    method: "get",
  });
}

// 销售物流价格升级
export function getCostSaleLogisticsPriceUp(id) {
  return request({
    url: `/costSaleLogisticsPrice/up/${id}`,
    method: "get",
  });
}


// 销售物流价格修改生效时间
export function putCostSaleLogisticsPriceUpdEnablingTime(data) {
  return request({
    url: "/costSaleLogisticsPrice/updEnablingTime",
    method: "put",
    data,
  });
}

// 销售物流价格取消升级
export function putCostSaleLogisticsPriceCancelUp( id ) {
  return request({
    url: `/costSaleLogisticsPrice/cancelUp/${id}`,
    method: "put",
  });
}

// 销售物流价格复制
export function getCostSaleLogisticsPriceCopy(id) {
  return request({
    url: `/costSaleLogisticsPrice/copy/${id}`,
    method: "get",
  });
}


// 销售操作价格启用禁用
export function putCostSaleOptPriceEnableDisable(data) {
  return request({
    url: "/costSaleOptPrice/enableDisable",
    method: "put",
    data,
  });
}


// 销售操作费价格升级
export function getcostSaleOptPriceUp(id) {
  return request({
    url: `/costSaleOptPrice/up/${id}`,
    method: "get",
  });
}

// 销售操作价格启用禁用
export function putCostSaleOptPriceUpdEnablingTime(data) {
  return request({
    url: "/costSaleOptPrice/updEnablingTime",
    method: "put",
    data,
  });
}

// 销售操作价格取消升级
export function putCostSaleOptPriceCancelUp( id ) {
  return request({
    url: `/costSaleOptPrice/cancelUp/${id}`,
    method: "put",
  });
}


