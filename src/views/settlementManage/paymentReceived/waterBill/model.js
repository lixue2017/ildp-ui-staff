import { httpUserSelect, httpDeptSelect, httpAccountSelect, httpAllDealingCompanySelect, httpEnterprisetSelect,httpLogisticsCustomerSelect } from '@/comModel/httpSelect'
import { SEARCH_SETTLEMENT_COL_1, SEARCH_SETTLEMENT_COL_2 } from '@/views/settlementManage/components/comModel.js'
import { formatMoney } from '@/utils/index'

const SEARCH_COL_1 = {
  id: "auditTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy/MM/dd"
}
const SEARCH_COL_2 = {
  id: "statementBillCode",
  label: "财务单号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_3 = {
  id: "serialCode",
  label: "流水号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_4 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  ...httpAllDealingCompanySelect()
}
const SEARCH_COL_5 = {
  id: "transactionTime",
  label: "交易时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy/MM/dd"
}
const SEARCH_COL_6 = {
  id: "companyBy",
  label: "所属公司：",
  selectLabelKey:"companyByName",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect()
}
const SEARCH_COL_7 = {
  id: "status",
  label: "状态：",
  placeholder: "请选择（多选）",
  multiple: true,
  type: "select",
  basicType: "exchangeStatus",
  hideList: [2]
}
const SEARCH_COL_8 = {
  id: "receiptPaymentAccountBank",
  label: "银行名称：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_9 = {
  id: "receiptPaymentBankAccount",
  label: "记账账号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_10 = {
  id: "receiptPaymentAccountName",
  label: "记账账号名称：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_11 = {
  id: "verificationTime",
  label: "核销日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy/MM/dd"
}
const SEARCH_COL_12 = {
  id: "accountName",
  label: "对方户名：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_13 = {
  id: "bankAccount",
  label: "对方账户：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_14 = {
  id: "verificationBy",
  label: "核销人：",
  placeholder: "请选择",
  type: "autocomplete",
  ...httpUserSelect()
}
const SEARCH_COL_15 = {
  id: "payAccount",
  label: "收付款账号：",
  placeholder: "请选择",
  ...httpAccountSelect({ type: '0' })
}
const SEARCH_COL_16= {
  id: "createTaskBy",
  label: "创建人：",
  placeholder: "请选择",
  ...httpUserSelect()
};
const SEARCH_COL_17= {
  id: "type",
  label: "认领类型：",
  placeholder: "请选择",
  type:"select",
  basicType:"bankReceiptType"
};

const SEARCH_COL_COM = [
  SEARCH_COL_1,
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_4,
  SEARCH_COL_5,
  {
    ...SEARCH_SETTLEMENT_COL_1,
    id: "currencyCode"
  },
  SEARCH_SETTLEMENT_COL_2,
]
export const searchColumns = (tName = '1') => {
  let SEARCH_COLS = [
    ...SEARCH_COL_COM,
    {
      ...SEARCH_COL_6,
      label: "收款公司："
    },
    SEARCH_COL_7,
    SEARCH_COL_8,
    SEARCH_COL_9,
    SEARCH_COL_10,
    SEARCH_COL_17,
    SEARCH_COL_16,
    SEARCH_COL_12
  ]
  if (tName === '2') {
    SEARCH_COLS = [
      ...SEARCH_COL_COM,
      {
        ...SEARCH_COL_6,
        label: "收款公司："
      },
      SEARCH_COL_11,
      SEARCH_COL_8,
      SEARCH_COL_12,
      SEARCH_COL_13,
      SEARCH_COL_14,
      SEARCH_COL_9,
      SEARCH_COL_10,
    ]
  }
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_COLS,
            },
          ],
        },
      ],
    },
  ]
}

/**
 * 付款水单管理引用
 */
export const paymentSearchColumns = (tName = '1') => {
  const PAYMENT_SEARCH_COL_COM = [
    SEARCH_COL_1,
    SEARCH_COL_2,
    SEARCH_COL_3,
    SEARCH_COL_4
  ]
  let PAYMENT_SEARCH_COLS = [
    ...PAYMENT_SEARCH_COL_COM,
    // SEARCH_COL_7,
    {
      ...SEARCH_SETTLEMENT_COL_1,
      id: "currencyCode"
    },
    SEARCH_SETTLEMENT_COL_2,
    {
      ...SEARCH_COL_6,
      label: "付款公司："
    },
    SEARCH_COL_8,
    SEARCH_COL_12,
    SEARCH_COL_13,
    SEARCH_COL_16
  ]
  if (tName === '2') {
    PAYMENT_SEARCH_COLS = [
      ...SEARCH_COL_COM,
      {
        ...SEARCH_COL_6,
        label: "付款公司："
      },
      SEARCH_COL_11,
      SEARCH_COL_8,
      SEARCH_COL_12,
      SEARCH_COL_13,
      SEARCH_COL_14,
      SEARCH_COL_9,
      SEARCH_COL_10
    ]
  }
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: PAYMENT_SEARCH_COLS,
            },
          ],
        },
      ],
    },
  ]
}

const TABLE_COL_0 = {
  type: 'index',
  align: "center",
  width: 50,
  fixed: 'left'
}
const TABLE_COL_1 = {
  prop: "serialCode",
  label: "流水号",
  showOverflowTooltip: true,
  customRow: true,
  width: 120,
  sortable: "custom",
  align: "left",
  fixed: 'left'
}
const TABLE_COL_2 = {
  prop: "dealDate",
  label: "交易日期",
  showOverflowTooltip: true,
  width: 120,
  sortable: "custom",
  align: "left",
  fixed: 'left'
}
const TABLE_COL_3 = {
  prop: "receiptPaymentBankAccount",
  label: "记账账号",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_4 = {
  prop: "receiptPaymentAccountName",
  label: "记账账号名称",
  showOverflowTooltip: true,
  minWidth: 190,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_5 = {
  prop: "receiptPaymentAccountBank",
  label: "银行名称",
  showOverflowTooltip: true,
  minWidth: 190,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_6 = {
  prop: "currencyCode",
  label: "币种",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_7 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_8 = {
  prop: "statementBillCode",
  label: "财务单号",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_9 = {
  prop: "money",
  label: "往来金额",
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 2,
	colFormat: "thousandthMark",
  sortable: "custom",
  align: "right"
}
const TABLE_COL_10 = {
  prop: "remark",
  label: "认领备注",
  showOverflowTooltip: true,
  minWidth: 136,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_11 = {
  prop: "claimTime",
  label: "认领时间",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_12 = {
  prop: "claimByName",
  label: "认领人",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_13 = {
  prop: "createTime",
  label: "创建时间",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_14 = {
  prop: "createTaskByName",
  label: "创建人",
  showOverflowTooltip: true,
  minWidth: 105,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_15 = {
  prop: "audit.auditNum",
  label: "审核次数",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 98,
  align: "right"
  // sortable: "custom",
}
const TABLE_COL_16 = {
  prop: "companyByName",
  label: "所属公司",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_17 = {
  prop: "status",
  label: "状态",
  showOverflowTooltip: true,
  dotColor: true,
  minWidth: 105,
  sortable: "custom",
  align: "left",
  fixed: 'right',
  basicType: "exchangeStatus"
}
const TABLE_COL_18 = {
  prop: "taskByName",
  label: "任务所属人",
  showOverflowTooltip: true,
  minWidth: 115,
  sortable: "custom",
  align: "left",
}

const TABLE_COL_19 = {
  prop: "accountName",
  label: "对方户名",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_20 = {
  prop: "bankAccount",
  label: "对方账号",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_21 = {
  prop: "openingBank",
  label: "对方开户行",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_22 = {
  prop: "verificationTime",
  label: "核销时间",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_23 = {
  prop: "verificationByName",
  label: "核销人",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_24 = {
  prop: "cashierByName",
  label: "付款出纳",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_25 = {
  prop: "createTime",
  label: "任务生成时间",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_26 = {
  prop: "cashierRemark",
  label: "出纳备注",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: "custom",
  align: "left",
}
const TABLE_COL_27 = {
  prop: "originalMoney",
  label: "水单金额",
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 2,
	colFormat: "thousandthMark",
  sortable: "custom",
  align: "right"
}
const TABLE_COL_29 = {
  prop: "type",
  label: "认领类型",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  basicType:"bankReceiptType",
  align: "center",
  fontColor:true
};
const TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  width: 170,
  fixed: 'right',
  columnOperation: true,
  columnMoreOperation: true
}
export const tableColumns = (tName = '1') => {
return[
  [
    TABLE_COL_0,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_13,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_9,//往来金额
    TABLE_COL_19,
    TABLE_COL_6,//币种
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_20,
    TABLE_COL_21,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_14,
    TABLE_COL_18,//任务所属人
    TABLE_COL_29,
    TABLE_COL_17,
    {
      ...TABLE_COL_16,
      label: "收款公司",
      fixed: 'right'
    },//收款公司
    TABLE_COL_OPERATION
  ],
  [
    TABLE_COL_0,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_27,//水单金额
    TABLE_COL_9,//往来金额
    TABLE_COL_6,//币种
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_19,
    TABLE_COL_20,
    TABLE_COL_21,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_22,
    TABLE_COL_23,
    TABLE_COL_24,
    TABLE_COL_25,
    {
      ...TABLE_COL_16,
      label: "收款公司",
      fixed: 'right',
    }
  ]
][tName-1]
}

/**
 * 付款水单管理引用
 */
export const paymentTableColumns = (tName = '1') => {
  return [
    [
      TABLE_COL_0,
      TABLE_COL_1,
      {
        ...TABLE_COL_7,
        fixed: 'left',
      },
      TABLE_COL_8,
      TABLE_COL_6,
      TABLE_COL_19,
      TABLE_COL_20,
      TABLE_COL_21,
      TABLE_COL_26,
      TABLE_COL_13,
      TABLE_COL_14,
      {
        ...TABLE_COL_17,
        fixed: undefined
      },//状态
      TABLE_COL_18,//任务所属人
      {
        ...TABLE_COL_16,
        label: "付款公司",
        fixed: 'right',
      },
    ],
    [
      TABLE_COL_0,
      TABLE_COL_1,
      TABLE_COL_2,
      TABLE_COL_8,
      TABLE_COL_7,
      TABLE_COL_5,
      TABLE_COL_27,
      TABLE_COL_9,
      TABLE_COL_6,
      TABLE_COL_19,
      TABLE_COL_20,
      TABLE_COL_21,
      TABLE_COL_26,
      TABLE_COL_3,
      TABLE_COL_4,
      TABLE_COL_13,
      TABLE_COL_14,
      // TABLE_COL_15,
      TABLE_COL_23,
      TABLE_COL_22,
      {
        ...TABLE_COL_16,
        label: "付款公司",
        fixed: 'right',
      }
    ]
  ][tName-1]
}

const taskColumns = [
  {
    prop: "payType",
    label: "类型",
    showOverflowTooltip: true,
    minWidth: 100,
    basicType: "billType",
    sortable: "custom",
  },
  // {
  //   prop: "createTaskByName",
  //   label: "任务创建人",
  //   showOverflowTooltip: true,
  //   minWidth: 120,
  //   sortable: "custom"
  // },
  // {
  //   prop: "auditBy",
  //   label: "审核人",
  //   showOverflowTooltip: true,
  //   minWidth: 100,
  //   sortable: "custom"
  // },
  // {
  //   prop: "auditTime",
  //   label: "审核时间",
  //   showOverflowTooltip: true,
  //   minWidth: 140,
  //   sortable: "custom"
  // },
]


// 佰信核销
export const baiXinWriteOffCols = {
  title: '佰信核销',
  width: '470px',
  labelWidth: "82px",
  simpleCustomCols: [
    {
      span: 24,
      id: "money",
      label: "待核销金额：",
      type: "txt",
      render: r => `${formatMoney(r.money)} ${r.currencyCode}`
    },
    {
      span: 24,
      id: "verificationMoney",
      label: "核销金额：",
      placeholder: "请输入",
      type: "inputNumber",
      numDecimal: 2,
      unitKey: "currencyCode",
      maxNumKey: "money"
    },
    {
      span: 24,
      id: "remark",
      label: "备注：",
      placeholder: "请输入",
      type: "textarea",
    },
  ],
  formRules: {
    verificationMoney: [
      { required: true, message: "请输入核销金额", trigger: "blur" },
    ],
  }
}
