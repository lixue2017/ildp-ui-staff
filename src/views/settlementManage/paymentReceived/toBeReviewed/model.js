import { httpAllDealingCompanySelect, httpUserSelect } from '@/comModel/httpSelect'
import {
  getAllUser
} from "@/api/common"
const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "billNo",
  label: "财务单号：",
  placeholder: "请输入财务单号",
  type: "text",
}
const SEARCH_COL_3 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_4 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "往来单位",
  ...httpAllDealingCompanySelect()
}
const SEARCH_COL_5 = {
  id: "currencyId",
  label: "币别：",
  placeholder: "请选择币别",
  type: "autocomplete",
  category: "currency"
}
const SEARCH_COL_6 = {
  startId: "startMoney",
  endId: "endMoney",
  label: "金额：",
  startPlaceholder: "金额≤",
  endPlaceholder: "≤金额",
  type: "rangeSelect",
}
const SEARCH_COL_7 = {
  id: "taskBy",
  label: "任务所属人：",
  placeholder: "任务所属人",
  type: "autocomplete",
  httpRequest: getAllUser,
  defaultProp: {
    value: 'userId',
    label: 'userName,nickName'
  }
  // ...httpUserSelect()
}
const SEARCH_COL_8 = {
  id: "settleType",
  label: "结算方式：",
  placeholder: "结算方式",
  type: "select",
  basicType: 'accountCycle'
}
const searchColumns = [
  SEARCH_COL_1,
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_4,
  SEARCH_COL_5,
  SEARCH_COL_6,
  SEARCH_COL_7,
  SEARCH_COL_8,
];
const TABLE_COL_11 = {
  prop: "convertBaseMoney",
  label: "金额",
  showOverflowTooltip: true,
  sortable: true,
  align: "right"
}
const TABLE_COL_12 = {
  prop: "currencyCode",
  label: "币种",
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const tableColumns = [
  // {
  //   type: 'selection',
  //   width: 50,
  //   align: "center",
  //   fixed: 'left'
  // },
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    prop: "billNo",
    label: "财务单号",
    width: 120,
    showOverflowTooltip: true,
    columnLink: true,
    sortable: true,
    align: "left",
    fixed: "left"
  },
  {
    prop: "dealingsCompanyName",
    label: "往来单位",
    showOverflowTooltip: true,
    width: 120,
    sortable: true,
    align: "left",
  },
  {
    prop: "settleType",
    label: "结算方式",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
    basicType: 'accountCycle',
    align: "left",
  },
  {
    prop: "billNum",
    label: "账单数",
    showOverflowTooltip: true,
    sortable: true,
    width:100,
    align: "right"
  },
  {
    prop: "orderNo",
    label: "工作单号",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
    align: "left",
  },
  TABLE_COL_11,//金额
  TABLE_COL_12,//币种
  {
    prop: "lastPayTime",
    label: "最晚收付日",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "left",
  },
  {
    prop: "payType",
    label: "收付款方式",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    basicType: "RVPType",
    align: "left",
  },
  {
    prop: "taskByName",
    label: "任务所属人",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "left",
  },
  {
    prop: "createTime",
    label: "创建时间",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 140,
    align: "left",
  },
  {
    prop: "createBy",
    label: "创建人",
    showOverflowTooltip: true,
    sortable: true,
    width:100,
    align: "left",
  },
  {
    prop: "rejectNum",
    label: "审核次数",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
    align: "right"
  },
  {
    prop: "businessCompanyName",
    label: "业务单位",
    showOverflowTooltip: true,
    minWidth: 150,
    sortable: true,
    align: "left",
  },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    columnOperation: true,
    fixed: "right"
  },
]
export { searchColumns, tableColumns };
