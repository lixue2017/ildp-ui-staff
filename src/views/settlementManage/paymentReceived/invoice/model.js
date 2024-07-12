
import { httpUserSelect, httpRoleDeptUserSelect, httpCrmListSelect, httpInvoiceCurrencySelect, httpAllDealingCompanySelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect'
import { SEARCH_SETTLEMENT_COL_2 } from '@/views/settlementManage/components/comModel.js'
import { formatMoney } from '@/utils/index'


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
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_3 = {
  id: "buyerId",
  label: "购买方：",
  placeholder: "请选择",
  ...httpCrmListSelect(),
}
const SEARCH_COL_4 = {
  id: "sellerId",
  label: "销售方：",
  placeholder: "请选择",
  ...httpCrmListSelect(),
}
const SEARCH_COL_5 = {
  id: "invoiceNumber",
  label: "发票号码：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_6 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_7 = {
  id: "drawer",
  label: "开票人：",
  selectLabelKey: "drawerName",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] })
}
const SEARCH_COL_8 = {
  id: "serialCode",
  label: "流水号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_9 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  // type: "text",
  ...httpAllDealingCompanySelect(),
}
const SEARCH_COL_10 = {
  id: "invoiceType",
  label: "发票类型：",
  type: "select",
  placeholder: "请选择",
  basicType: 'invoiceType'
}
const SEARCH_COL_11 = {
  id: "invoiceCurrencyId",
  label: "发票币别：",
  placeholder: "请选择",
  ...httpInvoiceCurrencySelect()
}
const SEARCH_COL_12 = {
  id: "invoiceMedium",
  label: "发票介质：",
  type: "select",
  placeholder: "请选择",
  basicType: "invoiceMedium"
}
const SEARCH_COL_13 = {
  id: "statusArr",
  label: "状态：",
  placeholder: "状态（多选）",
  multiple: true,
  type: "select",
  basicType: "invoiceS"
}
const SEARCH_COL_14 = {
  id: "businessCompany",
  label: "记账主体：",
  selectLabelKey: "businessCompanyName",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
}
const SEARCH_COL_15 = {
  id: "invoiceCode",
  label: "发票代码：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_16 = {
  id: "applicant",
  label: "创建人：",
  selectLabelKey: "applicantName",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] })
}
const SEARCH_COL_17 = {
  id: "operator",
  label: "操作员：",
  selectLabelKey: "operatorName",
  ...httpRoleDeptUserSelect({ getRoles: ['CZ'] })
}
const SEARCH_COL_18 = {
  id: "salesman",
  label: "业务员：",
  ...httpRoleDeptUserSelect({ getRoles: ['YW'] })
}
const SEARCH_COL_19 = {
  id: "sInvoiceTime",
  label: "开发票时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}

const onGoingForm = [
  //进行中
  SEARCH_COL_1,//创建时间
  SEARCH_COL_2,//财务单号
  SEARCH_COL_6,//工作单号
  SEARCH_COL_8,//流水号
  SEARCH_COL_3,//购买方
  SEARCH_COL_4,//销售方
  SEARCH_COL_10,//发票类型
  SEARCH_COL_12,//发票介质
  SEARCH_COL_9,//往来单位
  SEARCH_COL_14,//记账主体
  SEARCH_COL_11,//发票币别
  SEARCH_SETTLEMENT_COL_2,//金额
  SEARCH_COL_7,//开票人
	SEARCH_COL_18
]

const CompletedForm = [
  //已完结发票
  SEARCH_COL_1,
	SEARCH_COL_19,
  SEARCH_COL_2,
  SEARCH_COL_7,
  SEARCH_COL_15,
  SEARCH_COL_5,
  SEARCH_COL_6,
  SEARCH_COL_8,
  SEARCH_COL_10,
  SEARCH_COL_12,
  SEARCH_COL_3,
  SEARCH_COL_4,
  SEARCH_COL_11,
  SEARCH_SETTLEMENT_COL_2,
  SEARCH_COL_9,
  SEARCH_COL_14,
	SEARCH_COL_18
]







export const searchColumns = (row) => {
  const { activeName, menuType = "" } = row
  // hideList 0草稿  1待开票  2已开票  3已驳回  4已作废
  const hideList = {
    '1': [2, 4],//发票管理进行中
    '2': [0, 1, 3],
    '10': [2, 4],//发票信息(我的)进行中
    '20': [0, 1, 3],
    '11': [0, 2, 4],//发票信息(审核)进行中
    '21': [0, 1, 3]
  }
  let extraForm = []
  if (menuType == 0) {
    extraForm = [
      SEARCH_COL_16
    ]
  }
  const tagsSearchForm = {
    1: [
      ...onGoingForm,
      { ...SEARCH_COL_13, hideList: hideList[activeName + menuType] },
      ...extraForm,
      SEARCH_COL_17
    ],
    2: [
      ...CompletedForm,
      { ...SEARCH_COL_13, hideList: hideList[activeName + menuType] },
      ...extraForm,
      SEARCH_COL_17
    ]
  }
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: tagsSearchForm[activeName]
            },
          ],
        },
      ],
    },
  ]
};


const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left"
}
const TABLE_COL_1 = {
  prop: "serialCode",
  label: "流水号",
  columnLink: true,
  width: 110,
  showOverflowTooltip: true,
  sortable: "custom",
  fixed: "left"
}
const TABLE_COL_2 = {
  prop: "invoiceTitle",
  label: "开票抬头",
  showOverflowTooltip: true,
  sortable: "custom",
  minWidth: 130,
  fixed: "left"
}
const TABLE_COL_3 = {
  prop: "invoiceCurrencyCode",
  label: "开票币别",
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "costMoney",
  label: "开票金额",
  minWidth: 120,
  showOverflowTooltip: true,
  render: row => formatMoney(row.costMoney),
  align: "right",
}
const TABLE_COL_5 = {
  prop: "costRMBMoney",
  label: "开票金额(RMB)",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 2,
	colFormat: "thousandthMark",
  align: "right",
}
const TABLE_COL_6 = {
  label: "发票类型",
  prop: "invoiceType",
  sortable: "custom",
  minWidth: 120,
  basicType: 'invoiceType',
  showOverflowTooltip: true,
}
const TABLE_COL_7 = {
  prop: "invoiceMedium",
  label: "发票介质",
  showOverflowTooltip: true,
  sortable: "custom",
  basicType: "invoiceMedium",
  minWidth: 100
}
const TABLE_COL_8 = {
  prop: "billNo",
  label: "财务单号",
  minWidth: 150,
  showOverflowTooltip: true,
}
const TABLE_COL_9 = {
  prop: "orderNo",
  label: "工作单号",
  minWidth: 150,
  showOverflowTooltip: true,
}
const TABLE_COL_10 = {
  prop: "drawerName",
  label: "开票人",
  minWidth: 100,
  showOverflowTooltip: true,
}
const TABLE_COL_11 = {
  prop: "taskCreateByName",
  label: "创建人",
  showOverflowTooltip: true,
  sortable: "custom",
  minWidth: 120
}
const TABLE_COL_12 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  showOverflowTooltip: true,
}
const TABLE_COL_13 = {
  prop: "backNum",
  label: "退回次数",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
}
const TABLE_COL_14 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_15 = {
  prop: "businessCompanyName",
  label: "记账主体",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: "custom",
}
const TABLE_COL_16 = {
  prop: "status",
  label: "状态",
  showOverflowTooltip: true,
  basicType: "invoiceS",
  sortable: "custom",
  dotColor: true,
  minWidth: 100,
  fixed: "right"
}
const TABLE_COL_17 = {
  prop: "invoiceNumber",
  label: "发票号",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_18 = {
  prop: "invoiceDate",
  label: "开票时间",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_19 = {
  prop: "invoiceCode",
  label: "发票代码",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_49 = {
  type: "selection",
  width: 50,
  align: "center",
  fixed: "left"
}
const TABLE_COL_50 = {
  prop: "operation",
  label: "操作",
  width: 130,
  columnOperation: true,
  fixed: "right"
}
const TABLE_COL_51 = {
  prop: "isRateChange",
  label: "汇率影响",
  sortable: "custom",
  fontColor: true,//表格字体颜色
  basicType: "rateChanges",
  minWidth: 100,
  fixed: "right"
}
const TABLE_COL_52 = {
  prop: "operatorName",
  label: "操作员",
  minWidth: 100,
  showOverflowTooltip: true,
}
const TABLE_COL_53 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 100,
  showOverflowTooltip: true,
}

const TABLE_COL_COM = [
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_52,
	TABLE_COL_53
]
// export const tableColumns = [
//   //已完结
//   TABLE_COL_0,//序号
//   TABLE_COL_49,//选择框
//   ...TABLE_COL_COM,
//   TABLE_COL_10,
//   TABLE_COL_11,
//   TABLE_COL_12,
//   TABLE_COL_13,
//   TABLE_COL_14,
//   TABLE_COL_15,
//   TABLE_COL_16,
//   TABLE_COL_51,
//   TABLE_COL_50
// ]

export const writeColumns = [
  //已完结发票
  TABLE_COL_0,
  ...TABLE_COL_COM,
  TABLE_COL_19,
  TABLE_COL_17,
  TABLE_COL_10,
  TABLE_COL_18,
  TABLE_COL_11,
  TABLE_COL_12,
  // TABLE_COL_13,
  TABLE_COL_14,
  {
    ...TABLE_COL_15,
    fixed: "right"
  },
  TABLE_COL_16,
  TABLE_COL_50
]

export const onGoingTable = (row = {}) => {
  //进行中发票
  const { menuType } = row
  let headTable = []
  if (menuType == 0) {
    //发票信息（我的）
    headTable = [
      TABLE_COL_0,//序号
    ]
  } else {
    //发票信息（审核）
    headTable = [
      TABLE_COL_0,//序号
      TABLE_COL_49,//选择框
    ]
  }
  return [
    ...headTable,
    ...TABLE_COL_COM,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    // TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_51,
    TABLE_COL_50
  ]
}


const DIALOG_COL_1={
  span: 24,
  id: "invoiceNumber",
  label: "发票号：",
  placeholder: "请输入",
  type: "text",
  maxlength:60,
}
const DIALOG_COL_2={
  span: 24,
  id: "invoiceMoney",
  label: "发票金额：",
  placeholder: "请输入",
  type: "inputNumber",
  numDecimal: 2,
}

export const editInvoiceDialogCols = (row={}) => {
  const {menuType}=row //taskList 付款任务单   Invoice发票审核
  return {
    title: '修改发票号',
    width: '500px',
    // labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_COL_1,
      ...(menuType=='Invoice'||menuType=='taskList'?[]:[DIALOG_COL_2])
  ],
    formRules: {
      invoiceNumber: [
        { required: true, message: `请输入发票号`, trigger: "change" }
      ],
    }
  }
}
