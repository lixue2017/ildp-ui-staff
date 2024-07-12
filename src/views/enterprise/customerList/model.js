import { httpUserSelect } from '@/comModel/httpSelect'

const FORM_COLS_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COLS_2 = {
  id: "nameCn",
  label: "公司名称：",
  placeholder: "输入公司名称/简称/代码",
  type: "text",
}
const FORM_COLS_3 = {
  id: "status",
  label: "客户状态：",
  placeholder: "客户状态",
  type: "select",
  basicType: "customerStatus",
  multiple: true,
}
const FORM_COLS_4 = {
  id: "userStatus",
  label: "账号状态：",
  placeholder: "账号状态",
  type: "select",
  basicType: "accountStatus",
  multiple: true,
}
const FORM_COLS_5 = {
  id: "level",
  label: "客户等级：",
  placeholder: "客户等级",
  type: "select",
  multiple: true,
  basicType: "level",
}
const FORM_COLS_6 = {
  id: "salesmanId",
  label: "业务员：",
  placeholder: "业务员",
  ...httpUserSelect()
}
const FORM_COLS_7 = {
  id: "UNCHARTED_FORM_7",
  label: "姓名：",
  placeholder: "请输入姓名",
  type: "text",
}
const FORM_COLS_8 = {
  id: "UNCHARTED_FORM_8",
  label: "员工状态：",
  placeholder: "请选择员工状态",
  type: "select",
  dicsStr: 'staff_status',
  customDicsArr: [1, 2, 3, 4, 5]
}
const FORM_COLS_9 = {
  id: "UNCHARTED_FORM_9",
  label: "子公司状态：",
  placeholder: "请选择子公司状态",
  type: "select",
  dicsStr: 'staff_status',
  customDicsArr: [1, 2, 3, 4, 5]
}
const FORM_COLS_10 = {
  prop: "UNCHARTED_FORM_10",
  label: "结算周期",
  showOverflowTooltip: true,
  basicType: "accountCycle",
  basicTypeVal: "settleCycle",
}
const FORM_COLS_11 = {
  id: "UNCHARTED_FORM_11",
  label: "供应商类型：",
  placeholder: "请选择供应商类型",
  type: "select",
  basicType: "supplierType",
  // dicsStr: 'supplier_type',
  // customDicsArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
}
// -----------------------------------------------
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center"
}
const TABLE_COLS_1 = {
  prop: "nameCn",
  label: "公司名称",
  customRow: true,
  sortable: true,
  width: 150,
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  prop: "shortName",
  label: "简称",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "code",
  label: "代码",
  width: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_4 = {
  prop: "level",
  label: "等级",
  sortable: true,
  basicType: "level",
  basicTypeVal: "level",
}
const TABLE_COLS_5 = {
  prop: "clientIdentity",
  label: "身份",
  showOverflowTooltip: true,
  sortable: true,
  basicType: "clientIdentity",
  basicTypeVal: "clientIdentity",
}
const TABLE_COLS_6 = {
  prop: "category",
  label: "客户类别",
  sortable: true,
  basicType: "clientCategory",
  basicTypeVal: "category",
}
const TABLE_COLS_7 = {
  prop: "source",
  label: "客户来源",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  basicType: "clientSource",
  basicTypeVal: "source",
}
const TABLE_COLS_8 = {
  prop: "businessOwnershipName",
  label: "客户归属",
  showOverflowTooltip: true,
  sortable: true,
  width: 120
}
const TABLE_COLS_9 = {
  prop: "salesman",
  label: "业务员",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_10 = {
  prop: "status",
  label: "客户状态",
  width: 100,
  customRow: true,
  sortable: true,
  basicType: "customerStatus",
  basicTypeVal: "status",
}
const TABLE_COLS_11 = {
  prop: "userStatus",
  label: "账号状态",
  width: 100,
  customRow: true,
  sortable: true,
  basicType: "accountStatus",
  basicTypeVal: "userStatus",
}
const TABLE_COLS_12 = {
  prop: "UNCHARTED_TABLE_12",
  label: "创建人",
  showOverflowTooltip: true,
  sortable: true,
}
const TABLE_COLS_13 = {
  prop: "UNCHARTED_TABLE_13",
  label: "创建时间",
  showOverflowTooltip: true,
  sortable: true,
}
const TABLE_COLS_14 = {
  prop: "UNCHARTED_TABLE_14",
  label: "状态",
  showOverflowTooltip: true,
  sortable: true,
}
const TABLE_COLS_15 = {
  prop: "UNCHARTED_TABLE_15",
  label: "子公司状态",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_16 = {
  prop: "UNCHARTED_TABLE_16",
  label: "供应商名称",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_17 = {
  prop: "UNCHARTED_TABLE_17",
  label: "结算周期",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_18 = {
  prop: "UNCHARTED_TABLE_18",
  label: "供应商类别",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: '200px'
}

export const customer = () => {
  //客户列表
  return {
    formLists: [
      FORM_COLS_1,
      FORM_COLS_2,
      FORM_COLS_3,
      FORM_COLS_4,
      FORM_COLS_5,
      FORM_COLS_6
    ],
    tableLists: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_4,
      TABLE_COLS_6,
      TABLE_COLS_8,
      TABLE_COLS_9,
      TABLE_COLS_10,
      TABLE_COLS_11,
      TABLE_COLS_OPERATION
    ]
  }
}

export const supplier = () => {
  //服务商列表
  return {
    formLists: [
      FORM_COLS_1,
      FORM_COLS_2,
      FORM_COLS_10,
      FORM_COLS_11,
      FORM_COLS_9
    ],
    tableLists: [
      TABLE_COLS_INDEX,
      TABLE_COLS_16,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_17,
      TABLE_COLS_18,
      TABLE_COLS_14,
      TABLE_COLS_12,
      TABLE_COLS_13,
      TABLE_COLS_OPERATION
    ]
  }
}

export const subsidiary = () => {
  //堡森列表
  return {
    formLists: [
      FORM_COLS_1,
      FORM_COLS_2,
      FORM_COLS_9
    ],
    tableLists: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_15,
      TABLE_COLS_12,
      TABLE_COLS_13,
      TABLE_COLS_OPERATION
    ]
  }
}

export const staff = () => {
  //员工列表
  return {
    formLists: [
      FORM_COLS_1,
      FORM_COLS_7,
      FORM_COLS_8

    ],
    tableLists: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_12,
      TABLE_COLS_13,
      TABLE_COLS_14,
      TABLE_COLS_OPERATION
    ]
  }
}

