import request from '@/utils/request'

//费用试用数据查询
export function getSchemeTrial(id, data) {
  return request({
    url: `/scheme/trial/${id}`,
    method: 'get',
    params: data
  })
}

/**
 * 费用方案列表查询
 * costType:1-服务商  2-客户
 *
 */
export function getSchemePage(data) {
  return request({
    url: '/scheme/page',
    method: 'post',
    data
  })
}

// 关联成本规则
export function getSchemeList(data) {
  return request({
    url: '/scheme/list',
    method: 'post',
    data
  })
}

// 新增费用方案获取ID
export function addScheme(data) {
  return request({
    url: '/scheme',
    method: 'post',
    data
  })
}



//查询费用方案详情
export function getSchemeDetail(id, data) {
  return request({
    url: `/scheme/detail/${id}`,
    method: 'get',
    params: data
  })
}


// 复制费用方案
export function copyScheme(data) {
  return request({
    url: '/scheme/copy',
    method: 'post',
    data
  })
}

// //查询关联服务商
// export function getRelation(id, data) {
//   return request({
//     url: `/relation/${id}`,
//     method: 'get',
//     params: data
//   })
// }

// 新增价格信息
export function addConfig(data) {
  return request({
    url: '/config',
    method: 'post',
    data
  })
}

// 编辑价格信息
export function updateConfig(data) {
  return request({
    url: '/config',
    method: 'put',
    data
  })
}



// // 获取仓库信息
// export function getRelationWarehouse(data) {
//   return request({
//     url: '/relation/warehouse',
//     method: 'post',
//     data
//   })
// }




// 获取关联服务商
export function getRelationList(data) {
  return request({
    url: '/relation/list',
    method: 'post',
    data
  })
}


// 删除报销
export function deleteConfig(id) {
  return request({
    url: `/config/${id}`,
    method: 'delete',
  })
}


// 查询已关联或未关联的客户
export function getRelationVo(data) {
  return request({
    url: '/relation/vo',
    method: 'post',
    data
  })
}




// 获取仓库信息
export function getRelationWarehouse(data) {
  return request({
    url: '/relation/warehouse/origin',
    method: 'post',
    data
  })
}

// 获取仓库信息
export function addRelation(data) {
  return request({
    url: '/relation',
    method: 'post',
    data
  })
}

// 获取价格信息关联仓库信息
export function getPriceRelationWarehouse(data) {
  return request({
    url: '/relation/warehouse',
    method: 'post',
    data
  })
}




// 修改费用方案
export function updateScheme(data) {
  return request({
    url: '/scheme',
    method: 'put',
    data
  })
}


// 费用方案状态修改
export function updateSchemeStatus(data) {
  return request({
    url: '/scheme/changeStatus',
    method: 'put',
    data
  })
}


// 删除费用方案
export function deleteScheme(id) {
  return request({
    url: `/scheme/${id}`,
    method: 'delete',
  })
}


// 升级费用方案
export function upgradeScheme(data) {
  return request({
    url: '/scheme/upgrade',
    method: 'post',
    data
  })
}


//查询费用方案详情
export function getSchemeConfigInfo(row, data) {
  const { costId } = row
  return request({
    url: `/scheme/configInfo/${costId}`,
    method: 'get',
    params: data
  })
}


//客户预览
export function previewScheme(id) {
  console.log(id)
  return request({
    url: `/scheme/preview/${id}`,
    method: 'get',
  })
}

// 仓租方案管理列表查询
export function getStorageSchemeList(data) {
  return request({
    url: '/storage/scheme/list',
    method: 'post',
    data
  })
}

//客户仓储方案列表查询
export function getStorageSchemeCustomerList(data) {
  return request({
    url: '/storage/scheme/customer/list',
    method: 'post',
    data
  })
}

// 删除仓租方案
export function deleteStorageScheme(id) {
  return request({
    url: `/storage/scheme/${id}`,
    method: 'delete',
  })
}

//计费公司/计费仓库查询
export function getBillCompanyList(data) {
  return request({
    url: '/storage/scheme/billCompany/list',
    method: 'post',
    data
  })
}

//仓租方案详情
export function getStorageScheme(id) {
  return request({
    url: `/storage/scheme/${id}`,
    method: 'get',
  })
}

//新增仓租方案
export function addStorageScheme(data) {
  return request({
    url: '/storage/scheme',
    method: 'post',
    data
  })
}

//修改仓租方案
export function updateStorageScheme(data) {
  return request({
    url: '/storage/scheme',
    method: 'put',
    data
  })
}



//新增仓租方案列表
export function addStorageSchemeQueryAddList(data) {
  return request({
    url: '/storage/scheme/queryAdd/list',
    method: 'post',
    data
  })
}



//仓租方案列表复制接口
export function getStorageSchemeCopy(id) {
  return request({
    url: `/storage/scheme/copy/${id}`,
    method: 'get',
  })
}



//客户仓租方案查询关联服务商/客户列表
export function getStorageRelationVo(data) {
  return request({
    url: '/storage/relation/vo',
    method: 'post',
    data
  })
}

//新增客户仓租方案
export function addStorageRelation(data) {
  return request({
    url: '/storage/relation',
    method: 'post',
    data
  })
}


//获取仓租费用匹配/未匹配记录
export function getStorageMatchList(data) {
  return request({
    url: '/storage/match/list',
    method: 'post',
    data
  })
}


// //仓租日账单附件查询
// export function getAttachSelectAllById(id) {
//   return request({
//     url: `/customer/order/attach/selectAllById?attach=${id}`,
//     method: 'get',
//   })
// }
//仓租日账单附件查询
export function getMonthlyBillAttachInfos(id) {
  return request({
    url: `/monthly/bill/attachInfos/${id}`,
    method: 'get',
  })
}

//仓租日账单（订单）
export function getMonthlyBillOrderList(data) {
  return request({
    url: '/monthly/bill/order/list',
    method: 'post',
    data
  })
}


//仓租日账单（操作单）
export function getMonthlyBillOperationList(data) {
  return request({
    url: '/monthly/bill/operation/list',
    method: 'post',
    data
  })
}


//仓租日账单（海外仓）
export function getMonthlyBillOverseasList(data) {
  return request({
    url: '/monthly/bill/overseas/list',
    method: 'post',
    data
  })
}


//仓租日账单详情查询
export function getMonthlyBillDetail(id) {
  return request({
    url: `/monthly/bill/${id}`,
    method: 'get',
  })
}


//修改仓租日账单信息(目前只用于附件上传和删除)
export function updateMonthlyBill(data) {
  return request({
    url: '/monthly/bill',
    method: 'put',
    data
  })
}




//仓租日账单查询货物信息
export function getMonthlyBillGoodsInfo(data) {
  return request({
    url: '/monthly/bill/goodsInfo',
    method: 'post',
    data
  })
}




// 费用试算查询未关联的客户
export function POSTRelationOriginRelations(data) {
  return request({
    url: '/relation/originRelations',
    method: 'post',
    data
  })
}
// 费用试算查询已关联的客户
export function POSTRelationExistRelations(data) {
  return request({
    url: '/relation/existRelations',
    method: 'post',
    data
  })
}

// 删除报销
export function DELETERelationRemoveCustomer(data) {
  return request({
    url: `/relation/removeCustomer`,
    method: 'delete',
    data,
  })
}



// 客户仓租方案查询未关联的客户
export function POSTStorageRelationOriginRelations(data) {
  return request({
    url: '/storage/relation/originRelations',
    method: 'post',
    data
  })
}


// 客户仓租方案查询已关联的客户
export function POSTStorageRelationExistRelations(data) {
  return request({
    url: '/storage/relation/existRelations',
    method: 'post',
    data
  })
}



//仓租方案根据仓库ID判断是否有通用规则
export function GETCountByBillWarehouseId(params) {
  return request({
    url: `/storage/scheme/getCountByBillWarehouseId`,
    method: 'get',
    params
  })
}


//仓租日账单货物信息
export function GetListByBill(params) {
  return request({
    url: `/monthly/bill/goods/getListByBill`,
    method: 'get',
    params
  })
}



//仓租日账单导出
export function EXPORTOrderBillListAndDetail(data) {
  return request({
    url: '/monthly/bill/exprotOrderBillListAndDetail',
    method: 'post',
    data
  })
}
// 操作单仓租日账单导出
export function postOperationBillListAndDetail(data) {
  return request({
    url: "/monthly/bill/exprotOperationBillListAndDetail",
    method: "post",
    data,
  });
}
// 海外仓租日账单导出
export function postOverseaBillListAndDetail(data) {
  return request({
    url: "/monthly/bill/exprotOverseaBillListAndDetail",
    method: "post",
    data,
  });
}

//仓租日账单生成仓租
export function POSTStorageMatchRegeneration(data) {
  return request({
    url: '/storage/match/regeneration',
    method: 'post',
    data
  })
}



// 仓租日账单列表删除
export function deleteMonthlyBillRemove(id) {
  return request({
    url: `/monthly/bill/remove/${id}`,
    method: 'delete',
  })
}





// 服务成本价格修改修改生效时间
export function putSchemeUpdEnablingTime(data) {
  return request({
    url: "/scheme/updEnablingTime",
    method: "put",
    data,
  });
}



// 服务成本价格取消升级
export function putSchemeCancelUp( id ) {
  return request({
    url: `/scheme/cancelUp/${id}`,
    method: "put",
  });
}




// 仓租方案升级
export function getStorageSchemeUpgrade(data={}) {
  const {id}=data
  return request({
    url: `/storage/scheme/upgrade/${id}`,
    method: "post",
  });
}


// 仓租方案取消升级
export function putStorageSchemeCancelUp( id ) {
  return request({
    url: `/storage/scheme/cancelUp/${id}`,
    method: "put",
  });
}


// 仓促方案修改生效时间
export function putStorageSchemeUpdEnablingTime(data) {
  return request({
    url: "/storage/scheme/updEnablingTime",
    method: "put",
    data,
  });
}
