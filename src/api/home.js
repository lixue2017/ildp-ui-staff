import request from "@/utils/request";

// 获取组件数据
export function getComponentInfo(data) {
  return request({
    url: "/staging/getComponentInfo",
    method: "post",
    data,
  });
}
// 获取客户
export function getByYeWu(data) {
  return request({
    url: "/crm/info/getByYeWu",
    method: "post",
    data,
  });
}

// 登录获取所有固定的查询列表
export function getSystemSearchList(params) {
  return request({
    url: "/userCustomColumn/getRegularList",
    method: "get",
    params,
  });
}

// 根据路由获取统计数
export function getRouteStateCount(params) {
  return request({
    url: "/userCustomColumn/getCountTypeListVoByRouteAndTab",
    method: "get",
    params,
  });
}

// 设置默认查询
export function setRouteDefaultState(id) {
  return request({
    url: `/userCustomColumn/setDefault/${id}`,
    method: "get",
  });
}

// 保存自定义查询条件
export function postSaveCustomSearch(data) {
  return request({
    url: "/userCustomColumn/save",
    method: "post",
    data,
  });
}

// 获取某个路由下tab自定义查询条件
export function getTabCustomSearch(params) {
  return request({
    url: "/userCustomColumn/getCustomList",
    method: "get",
    params,
  });
}

// 根据id删除查询条件
export function delCustomSearch(id) {
  return request({
    url: `/userCustomColumn/remove/${id}`,
    method: "DELETE",
  });
}

// 页签设置为隐藏
export function postSetHideStateTab(id) {
  return request({
    url: `/userCustomColumn/setHideById/${id}`,
    method: "post",
    data: {},
  });
}

// 页签删除隐藏 （显示）
export function postSetShowStateTab(id) {
  return request({
    url: `/userCustomColumn/delHideById/${id}`,
    method: "DELETE",
  });
}
