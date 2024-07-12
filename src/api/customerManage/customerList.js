import request from "@/utils/request";

// 查询客户列表
export function getCustomerList(params) {
  return request({
    url: "/crm/info/list",
    method: "get",
    params,
  });
}

// 新增客户信息
export function addCustomer(data) {
  return request({
    url: "/crm/info",
    method: "post",
    data,
  });
}

// 完善客户信息
export function perfectCustomer(data) {
  return request({
    url: "/crm/info/addCustomerPerfect",
    method: "post",
    data,
  });
}

// 编辑客户信息
export function updateCustomer(data) {
  return request({
    url: "/crm/info",
    method: "put",
    data,
  });
}

// 删除客户信息
export function delCustomer(ids) {
  return request({
    url: `/crm/info/${ids}`,
    method: "delete",
  });
}

// 获取客户详细信息
export function getCustomerDetail(id) {
  return request({
    url: `/crm/info/${id}`,
    method: "get",
  });
}

//获取银行开户列表
export function getBankInfo(params) {
  return request({
    url: `/crm/address/getBankAddressByCustomerId/${params.id}`,
    method: "get",
    params,
  });
}

//新增银行开户
export function addBankInfo(data) {
  return request({
    url: `/crm/address/add`,
    method: "post",
    data,
  });
}

//修改银行开户
export function editBankInfo(data) {
  return request({
    url: `/crm/address/update`,
    method: "POST",
    data,
  });
}

//删除银行开户
export function removeBankInfo(id) {
  return request({
    url: `/crm/address/${id}`,
    method: "delete",
  });
}

//获取联系人信息
export function getContactsInfo(params) {
  return request({
    url: `/crm/contacts/getContactsByCustomerId/${params.id}`,
    method: "get",
    params,
  });
}

//新增联系人
export function addContacts(data) {
  return request({
    url: `/crm/contacts`,
    method: "post",
    data,
  });
}

//修改联系人
export function editContacts(data) {
  return request({
    url: `/crm/contacts`,
    method: "put",
    data,
  });
}

//删除联系人
export function removeContacts(id) {
  return request({
    url: `/crm/contacts/${id}`,
    method: "delete",
  });
}

//获取地址信息
export function getAddressInfo(opt) {
  const { id, ...params } = opt || {};
  return request({
    url: `/customer/consignee/getConsigneeByCustomerId/${id}`,
    method: "get",
    params,
  });
}
//获取多个地址信息
export function getAddressIdsInfo(opt) {
  const { id, ...params } = opt || {};
  return request({
    url: `/customer/consignee/getConsigneeByCustomerIds/${id}`,
    method: "get",
    params,
  });
}

//新增地址
export function addAddress(data) {
  return request({
    url: `/customer/consignee/addConsignee`,
    method: "post",
    data,
  });
}

//修改地址
export function editAddress(data) {
  return request({
    url: `/customer/consignee/consigneeEdit`,
    method: "put",
    data,
  });
}

//删除地址
export function removeAddress(id) {
  return request({
    url: `/customer/consignee/deleteConsigneeById/${id}`,
    method: "delete",
  });
}

//获取附件
export function getAttachInfo(params) {
  return request({
    url: `/crm/attach/list/${params.id}`,
    method: "get",
    params,
  });
}

// 新增客户合同信息
export function postAddContacts(data) {
  return request({
    url: "/crm/contacts/add",
    method: "post",
    data,
  });
}

// 修改客户合同信息
export function putEditContacts(data) {
  return request({
    url: "/crm/contacts/edit",
    method: "put",
    data,
  });
}

// 根据客户id获取合同信息
export function postContactsList(obj) {
  const { customerId, ...params } = obj || {};
  return request({
    url: `/crm/contacts/getListByCustomerId/${customerId}`,
    method: "get",
    params,
  });
}

// 删除客户合同信息
export function delContactsRow(id) {
  return request({
    url: `/crm/contacts/del/${id}`,
    method: "delete",
  });
}

//根据附件ID查询附件详情
export function getAttachInfoById(id) {
  return request({
    url: `/crm/attach/${id}`,
    method: "get",
  });
}

//删除附件
export function removeAttach(id) {
  return request({
    url: `/crm/attach/${id}`,
    method: "delete",
  });
}

//修改客户状态
export function modifyCustStatus(data) {
  return request({
    url: `/crm/info/editStatus`,
    method: "put",
    data,
  });
}

//根据ID查询用户信息
export function getUserInfo(id) {
  return request({
    url: `/system/user/getUserById/${id}`,
    method: "get",
  });
}

//开通账号
export function openAccount(data) {
  return request({
    url: `/crm/info/updateAccount`,
    method: "put",
    data,
  });
}

//禁用启用账号
export function changeAccountStatus(data) {
  return request({
    url: `/system/user/changeStatus`,
    method: "put",
    data,
  });
}

//重置密码
export function resetPwd(data) {
  return request({
    url: `/system/user/resetPwd`,
    method: "put",
    data,
  });
}

//标签展示、用户状态&登录时间
export function getShowInfo(id) {
  return request({
    url: `/crm/info/getCustomerLabelStatus/${id}`,
    method: "get",
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

//更换客户归属
export function changeBelong(data) {
  return request({
    url: `/crm/info/editBasicCustomerInfo`,
    method: "put",
    data,
  });
}

// 获取当前登录者信息
export function getUserBy() {
  return request({
    url: `/basic/login/user`,
    method: "get",
  });
}

//根据部门获取用户
export function getUserDept(deptId, params) {
  return request({
    url: `/system/user/dept/${deptId}`,
    method: "get",
    params,
  });
}

// 获取当前记账主体
export function getAccountSubject(params) {
  return request({
    url: `/basic/login/user/accountSubject`,
    method: "get",
    params,
  });
}

// 获取所以记账主体集合
export function getAccountSubjectList(params) {
  return request({
    url: `/system/dept/accountSubjectList`,
    method: "get",
    params,
  });
}

//根据部门获取记账主体的所有用户

export function getAccSubListByDept(deptId, params) {
  return request({
    url: `/system/user/dept/accSub/list/${deptId}`,
    method: "get",
    params,
  });
}

/**
 * 客户列表
 */
export function getCustlist(params) {
  return request({
    url: `/crm/info/Custlist`,
    method: "get",
    params,
  });
}

/**
 * 服务商列表
 */
export function getFacilitatorlist(params) {
  return request({
    url: `/crm/info/facilitatorlist`,
    method: "get",
    params,
  });
}

/**
 * 堡森列表
 */
export function getBsList(params) {
  return request({
    url: `/crm/info/Bslist`,
    method: "get",
    params,
  });
}

/**
 * 个人列表
 */
export function getPersonlist(params) {
  return request({
    url: `/crm/info/Personlist`,
    method: "get",
    params,
  });
}

// 员工列表新增，修改，启用，停用
export function updateStaffList(data) {
  return request({
    url: "/crm/info/updateStaffInfo",
    method: "post",
    data,
  });
}

// 新增提货地址信息
export function addMainContacts(data) {
  return request({
    url: "/customer/contacts/main",
    method: "post",
    data,
  });
}

// 编辑提货地址信息
export function updateMainContacts(data) {
  return request({
    url: "/customer/contacts/main",
    method: "put",
    data,
  });
}

// 查询联系人
export function getMainContactsList(params) {
  let url = "/customer/contacts/main/staffList";
  return request({
    url,
    method: "get",
    params: {
      ...params,
    },
  });
}

// 提单联系人新增清关资料
export function addContactsCustomsClearance(data) {
  return request({
    url: "/customer/customsClearance",
    method: "post",
    data,
  });
}

// 提单联系人编辑清关资料
export function putContactsCustomsClearance(data) {
  return request({
    url: "/customer/customsClearance",
    method: "put",
    data,
  });
}

// 提单联系人删除清关资料
export function delContactsCustomsClearance(obj) {
  const { id } = obj || {};
  return request({
    url: `/customer/customsClearance/${id}`,
    method: "delete",
  });
}

// 删除提单人信息
export function delContacts(id) {
  return request({
    url: `/customer/contacts/main/${id}`,
    method: "delete",
  });
}

// 编辑提单人状态
export function updateContacts(data) {
  return request({
    url: "/customer/contacts/main",
    method: "put",
    data,
  });
}

/**
 * 堡森业务员列表查询
 */
export function getCustomerSalesmanList(params) {
  return request({
    url: `/settleCustomerSalesman/getCustomerSalesmanList`,
    method: "get",
    params,
  });
}

/**
 * 堡森业务员修改
 */
export function updateCustomerSalesman(data) {
  return request({
    url: "/settleCustomerSalesman/updateCustomerSalesman",
    method: "post",
    data,
  });
}

// 查询员工详情
export function getStaffDetail(id) {
  return request({
    url: `/system/user/staffDetail/${id}`,
    method: "get",
  });
}

// 查询所有公司
export function getOperateMainList(params) {
  return request({
    url: `/crm/info/operateMainList`,
    method: "get",
    params,
  });
}

// 查询收款凭证配置列表
export function getSettleCashierTaskPrintConfig(params) {
  return request({
    url: `/settleCashierTaskPrintConfig/getList`,
    method: "get",
    params,
  });
}

/**
 * 收款凭证配置修改
 */
export function postSettleCashierTaskPrintConfig(data) {
  return request({
    url: "/settleCashierTaskPrintConfig/save",
    method: "post",
    data,
  });
}

// 查询收付款初始化人员
export function getSettleCashierTaskPrintConfigCashierList(params) {
  return request({
    url: `/settleCashierTaskPrintConfig/cashier/list`,
    method: "get",
    params,
  });
}
/**
 * 收付款初始化人员修改
 */
export function postSettleCashierTaskPrintConfigCashierSave(data) {
  return request({
    url: "/settleCashierTaskPrintConfig/cashier/save",
    method: "post",
    data,
  });
}

//获取钱包信息金额统计
export function getCustomerWalletInfo(id) {
  return request({
    url: `/customerwallet/getCustomerWalletInfo/${id}`,
    method: "get",
  });
}

/**
 * 钱包信息数据
 */
export function postCustomerWalletOptInfoGetPage(data) {
  return request({
    url: "/customerWalletOptInfo/getPage",
    method: "post",
    data,
  });
}

/**
 * 客户费用方案查询
 */
export function POSTCustomerInfoLevelPage(data) {
  const { pageNum, pageSize, ...obj } = data;
  return request({
    url: "/customerlevel/getCustomerInfoLevelPage",
    method: "post",
    data: obj,
  });
}

/**
 * 冻结客户
 */
export function POSTFreeze(data) {
  const { id } = data;
  return request({
    url: `/crm/info/freeze/${id}`,
    method: "post",
    data,
  });
}

/**
 * 解冻客户
 */
export function POSTUnFreeze(data) {
  const { id } = data;
  return request({
    url: `/crm/info/unFreeze/${id}`,
    method: "post",
    data,
  });
}

/**
 * 服务商禁用
 */
export function disableFacilitator({ id }) {
  return request({
    url: `/crm/info/disableFacilitator/${id}`,
    method: "post",
  });
}

/**
 * 服务商启用
 */
export function enableFacilitator({ id }) {
  return request({
    url: `/crm/info/enableFacilitator/${id}`,
    method: "post",
  });
}

// 企业管理查询所有订单代理配置
export function GETQueryListVo(params) {
  return request({
    url: `/take/orderIsolateConfig/queryListVo`,
    method: "get",
    params,
  });
}

// 企业管理查询所有的拼柜路线
export function GETQuerySortBoxList(params) {
  return request({
    url: `/take/orderIsolateConfig/querySortBoxList`,
    method: "get",
    params,
  });
}

// 修改订舱代理配置
export function udpateTakeOrderIsolateConfig(data) {
  return request({
    url: "/take/orderIsolateConfig/udpateTakeOrderIsolateConfig",
    method: "put",
    data,
  });
}

// 企业管理修改拼柜路线
export function updateSortBox(data) {
  return request({
    url: "/take/orderIsolateConfig/updateSortBox",
    method: "put",
    data,
  });
}

// 查询工资记录列表
export function GETStaffPayrollListVo(params) {
  return request({
    url: `/staffPayroll/getListVo`,
    method: "get",
    params,
  });
}

// 查询工资详细记录列表
export function GETStaffPayrollDetailListVo(params) {
  return request({
    url: `/staffPayroll/getDetailListVo`,
    method: "get",
    params,
  });
}

/**
 * 添加工资记录
 */
export function POSTStaffPayrollAdd(data) {
  return request({
    url: "/staffPayroll/add",
    method: "post",
    data,
  });
}

// 删除工资记录
export function DELETEStaffPayrollDel(id) {
  return request({
    url: `/staffPayroll/del/${id}`,
    method: "delete",
  });
}

//下载工资详细
export function GETStaffPayrollDownloadDetailList(id) {
  return request({
    url: `/staffPayroll/downloadDetailList/${id}`,
    method: "get",
  });
}

// 员工工资条修改备注
export function PUTStaffPayrollUpdateRemark(data) {
  return request({
    url: "/staffPayroll/updateRemark",
    method: "put",
    data,
  });
}

//工资条查询费用明细
export function GETStaffPayrollBillList(id) {
  return request({
    url: `/staffPayroll/getBillList/${id}`,
    method: "get",
  });
}

/**
 * 工资条重新加载员工记录
 */
export function POSTStaffPayrollReload(id) {
  return request({
    url: `/staffPayroll/reload/${id}`,
    method: "post",
  });
}

//根据公司id查询上个月得工资记录id
export function GETCountByMonthAndCustomerId(id) {
  return request({
    url: `/staffPayroll/getCountByMonthAndCustomerId/${id}`,
    method: "get",
  });
}

//工资提交详情查询
export function GETStaffPayrollStaffApplicantInfo(id) {
  return request({
    url: `/staffPayroll/getStaffApplicantInfo/${id}`,
    method: "get",
  });
}

/**
 * 新建、编辑api
 */
export function POSTApiConfigSaveOrUpdate(data) {
  return request({
    url: "/apiConfig/saveOrUpdate",
    method: "post",
    data,
  });
}

// 删除API
export function DELETEApiConfigDel(id) {
  return request({
    url: `/apiConfig/del/${id}`,
    method: "delete",
  });
}

// API启用禁用
export function PUTApiConfigEnableDisable(data) {
  return request({
    url: "/apiConfig/enableDisable",
    method: "put",
    data,
  });
}

/**
 * 同步api
 */
export function POSTApiConfigSyncOrder(data) {
  return request({
    url: "/apiConfig/syncOrder",
    method: "post",
    data,
  });
}

/**
 * 接口访问记录列表查询
 */
export function POSTApiRequestInfoGetPage(data) {
  return request({
    url: "/apiRequestInfo/getPage",
    method: "post",
    data,
  });
}

/**
 * 明细列表
 */
export function POSTApiRequestInfoGetDetailPage(data) {
  return request({
    url: "/apiRequestInfo/getDetailPage",
    method: "post",
    data,
  });
}

/**
 * 商品差异
 */
export function POSTApiProductDifferenceGetPage(data) {
  return request({
    url: "/apiProductDifference/getPage",
    method: "post",
    data,
  });
}

/**
 * 重新发货
 */
export function POSTApiRequestInfoResend(data) {
  return request({
    url: "/apiRequestInfo/resend",
    method: "post",
    data,
  });
}

/**
 * 获取海外仓商品SKU
 */
export function POSTOverseasWarehouseSkuPage(data) {
  return request({
    url: "/apiProduct/getOverseasWarehouseSkuPage",
    method: "post",
    data,
  });
}

/**
 * 新建、编辑商品管理
 */
export function POSTSaveOrUpdate(data) {
  return request({
    url: "/apiProduct/saveOrUpdate",
    method: "post",
    data,
  });
}

// 删除商品管理
export function delApiProductDel(id) {
  return request({
    url: `/apiProduct/del/${id}`,
    method: "delete",
  });
}

/**
 * 同步库存
 */
export function POSTSyncInventory(data) {
  return request({
    url: "/apiProduct/syncInventory",
    method: "post",
    data,
  });
}

/**
 * 同步sku
 */
export function POSTSyncSku(data) {
  return request({
    url: "/apiProduct/syncSku",
    method: "post",
    data,
  });
}

/**
 * 获取客户权限列表
 */
export function getCusRoleList(customerInfoId) {
  return request({
    url: `/crm/info/getCusRoleList/${customerInfoId}`,
    method: "get",
  });
}

/**
 * 修改客户权限
 */
export function updateCusRole(data) {
  return request({
    url: "/crm/info/updateCusRole",
    method: "put",
    data,
  });
}

/**
 * 获取客户可以编辑权限列表
 */
export function getRoleList() {
  return request({
    url: "/crm/info/getRoleList",
    method: "get",
  });
}

// 业务回款配置列表
export function GETOrderSettleGetList(params) {
  return request({
    url: `/crm/order/settle/getList`,
    method: "get",
    params,
  });
}


// 保存业务配置 数组方式
export function POSTOrderSettleSave(data) {
  return request({
    url: "/crm/order/settle/saveBusinessConfigList",
    method: "post",
    data,
  });
}


// 获取回款配置保存参数
export function GETSaveBusinessConfigListParam(params) {
  return request({
    url: `/crm/order/settle/getSaveBusinessConfigListParam`,
    method: "get",
    params,
  });
}



/**
 * 获取客户回款保存参数
 */
export function GETOrderSettleSaveParam(customerId) {
  return request({
    url: `/crm/order/settle/getSaveParam/${customerId}`,
    method: "get",
  });
}

// 保存客户回款
export function POSTOrderSettleSubmit(data) {
  return request({
    url: "/crm/order/settle/save",
    method: "post",
    data,
  });
}
