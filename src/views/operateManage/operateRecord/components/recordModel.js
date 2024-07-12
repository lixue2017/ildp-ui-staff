import { httpCountrySelect, httpCustomerSelect } from '@/comModel/httpSelect'

export const createTimeCol = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}

export const typeCol = {
  id: "exportType",
  label: "类型：",
  placeholder: "进出口类型",
  type: "select",
  basicType: 'importExportType'
}


export const statusCol = {
  id: "status",
  label: "状态：",
  type: "select", // 选择框
  multiple: true,
  placeholder: "状态（多选）",
  basicType: "sortRegisterStatus"
}

export const cusSearch = {
  id: "cusBId",
  label: "报关行：",
  placeholder: "报关行",
  type: "select",
  basicType: 'clientIdentity',
}

export const clientSearch = {
  id: "entrust",
  label: "委托人：",
  placeholder: "委托人",
  ...httpCustomerSelect()
}

export const destinationCountry = {
  id: "aimCountry",
  label: "目的国：",
  placeholder: "目的国",
  ...httpCountrySelect
}

export const TRAILER_ROW = {
  id: "routeCode",
  label: "拖车行：",
  placeholder: "拖车行",
  type: "select",
  basicType: 'clientIdentity'
}

// 清关
export const CLEARANCE_TYPE = ['海运', '空运']
export const CLEARANCE_BUSINESS_TYPE = ['出口', '进口']
export const CLEARANCE_FREIGHT_TYPE = ['整柜', '散货', '拼柜']
export const CLEARANCE_SEARCH_COL_0 = {
  id: "orderType",
  label: "类型：",
  placeholder: "类型",
  type: "select",
  basicType: 'importExportType',
  hideList: [4, 5]
}
