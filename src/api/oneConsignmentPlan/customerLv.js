import request from "@/utils/request";
// 客户等级列表查询
export function POSTCustomerlevelList(data) {
  return request({
    url: "/customerlevel/list",
    method: "post",
    data,
  });
}

// 删除客户等级数据
export function DELETECustomerlevel(id) {
  return request({
    url: `/customerlevel/delete/${id}`,
    method: "delete",
  });
}

// 客户等级详情查询
export function GETCustomerlevelInfo(id) {
  return request({
    url: `/customerlevel/info/${id}`,
    method: "get",
  });
}

//客户等级新增保存
export function POSTSaveCustomerlevel(data) {
  return request({
    url: "/customerlevel/save",
    method: "post",
    data,
  });
}

//客户额度/客户预充值列表
export function POSTCustomerlimitapplicationList(data) {
  return request({
    url: "/customerlimitapplication/list",
    method: "post",
    data,
  });
}

//客户额度/客户预充值列表状态转换
export function POSTCustomerlimitapplicationAuditing(data) {
  return request({
    url: "/customerlimitapplication/auditing",
    method: "post",
    data,
  });
}

//客户额度/客户预充值列表新增修改
export function POSTCreditApplication(data) {
  return request({
    url: "/customerlimitapplication/creditApplication",
    method: "post",
    data,
  });
}

// 查询客户或服务商的企业信息
export function POSTCusList(data) {
  return request({
    url: `/customerlimitapplication/cusList`,
    method: "post",
    data,
  });
}

// 根据/customerlimitapplication/cusList 选择的ID查询堡森账户
export function POSTBaAccount(id) {
  return request({
    url: `/customerlimitapplication/bsAccount/${id}`,
    method: "get",
  });
}

// 根据/customerlimitapplication/cusList 选择ID查询账户
export function POSTcrmAddress(id) {
  return request({
    url: `/crm/address/${id}`,
    method: "get",
  });
}

// 删除客户额度或客户预充值列表数据
export function DELETECustomerlimitapplication(id) {
  return request({
    url: `/customerlimitapplication/delete/${id}`,
    method: "delete",
  });
}

// 客户等级列表状态扭转
export function PUTCustomerlevelDispose(data) {
  return request({
    url: "/customerlevel/dispose",
    method: "put",
    data,
  });
}

// 客户等级修改
export function PUTCustomerlevelUpdate(data) {
  return request({
    url: "/customerlevel/update",
    method: "put",
    data,
  });
}

// 客户额度和客户预充值修改
export function PUTCustomerlimitapplication(data) {
  return request({
    url: "/customerlimitapplication/update",
    method: "put",
    data,
  });
}



// 审核记录
export function getCustomerlimitapplicationauditrecords(id) {
  return request({
    url: `/customerlimitapplicationauditrecords/list/${id}`,
    method: "get",
  });
}



// 客户额度管理，根据申请币别和客户ID查询当前额度
export function POSTCustomerwalletSelectone(data) {
  return request({
    url: `/customerwallet/selectone`,
    method: "post",
    data,
  });
}



// 客户预充值，根据ID查附件
export function GETCustomerlimitapplicationAttach(id) {
  return request({
    url: `/customerlimitapplication/attach/${id}`,
    method: "get",
  });
}
