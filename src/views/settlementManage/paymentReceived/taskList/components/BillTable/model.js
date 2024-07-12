const summationConfig = [
  {
    label: '选择账单数量：',
    prop: 'count',
  },
  {
    label: '合计本位币：',
    prop: 'standardCurrency',
  },
  {
    label: '合计辅助币：',
    prop: 'assistCurrency',
  }
]
const TABLE_COL_0 = {
  type: 'index',
  align: "center",
  width: 50
}
const MODEL_COL_9 = {
  label: "关联业务",
  prop: "businessType",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  basicType: "settlementBusinessType"
}
const MODEL_COL_10 = {
  label: "工作单号",
  prop: "orderNum",
  cPageNoKey: "pageNo",
  cOrderIdKey: "jumpId",
	cOrderType: "ddType",
  showOverflowTooltip: true,
  sortable: true,
  columnLink: true,
  minWidth: 140
}

const MODEL_COL_11 = {
  label: "已核销金额",
  prop: "verificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
	colFormat: "thousandthMark",
  showOverflowTooltip: true,
}
const MODEL_COL_12 = {
  label: "核销中金额",
  prop: "underwayVerificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
	colFormat: "thousandthMark",
  showOverflowTooltip: true,
}
const MODEL_COL_13 = {
  label: "全部核销",
  prop: "verificationStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
}
const MODEL_COL_14 = {
  label: "已开票金额",
  prop: "invoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
	colFormat: "thousandthMark",
  showOverflowTooltip: true,
}
const MODEL_COL_15 = {
  label: "开票中金额",
  prop: "underwayInvoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
	colFormat: "thousandthMark",
  showOverflowTooltip: true,
}

const MODEL_COL_16 = {
  label: "全部开票",
  prop: "invoiceStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
}
const MODEL_COL_17 = {
  label: "关联水单",
  prop: "contactsBankNo",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const MODEL_COL_18 = {
  label: "本次核销金额",
  prop: "thisMoney",
  width: 124,
  sortable: true,
  align: "right",
  decimal: 2,
	colFormat: "thousandthMark",
  showOverflowTooltip: true,
}
const MODEL_COL_19 = {
  label: "本次开票信息",
  prop: "invoiceInfo",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
}
const billColumns = [
  {
    ...TABLE_COL_0,
    fixed: 'left'
  },
  {
    label: "应收应付",
    prop: "type",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    fontColor: true,
    basicType: 'billType',
    fixed: 'left'
  },
  {
    label: "费用名称",
    prop: "costName",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    fixed: 'left'
  },
  {
    label: "金额",
    prop: "totalMoney",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    decimal: 2,
		colFormat: "thousandthMark",
    align: "right"
  },
  {
    label: "币别",
    prop: "currencyCode",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "单价",
    prop: "unitPrice",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 2,
		colFormat: "thousandthMark",
    minWidth: 100,
    align: "right"
  },
  {
    label: "数量",
    prop: "num",
    decimal: 2,
    showOverflowTooltip: true,
    sortable: true,
    align: "right"
  },
  {
    label: "含税",
    prop: "isIncludeTax",
    showOverflowTooltip: true,
    sortable: true,
    render: row => ['否', '是'][row.isIncludeTax] || '--'
  },
  {
    label: "税率",
    prop: "taxRate",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "税额",
    prop: "taxMoney",
    decimal: 2,
		colFormat: "thousandthMark",
    showOverflowTooltip: true,
    sortable: true,
  },
  MODEL_COL_9,
  MODEL_COL_10,
  MODEL_COL_19,
  {
    ...MODEL_COL_9,
    label: "相关业务",
    prop: "joinBusinessType",
  },
  {
    ...MODEL_COL_10,
    label: "相关单号",
    prop: "joinOrderNum",
    cPageNoKey: "joinPageNo",
    cOrderIdKey: "joinJumpId",
		cOrderType: "joinDdType"
  },
  MODEL_COL_11,
  MODEL_COL_12,
	MODEL_COL_18,
  MODEL_COL_13,
  MODEL_COL_14,
  MODEL_COL_15,
  MODEL_COL_16,
  MODEL_COL_17,
  {
    label: "操作员",
    prop: "operateUser",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    label: "业务员",
    prop: "salesmanNick",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    label: "备注",
    prop: "remark",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "记账时间",
    prop: "accountingTime",
    sortable: true,
    minWidth: 108,
    showOverflowTooltip: true
  },
]


const taskPayColumns = [
  //付款任务单
  {
    ...TABLE_COL_0,
    fixed: 'left',
  },
  {
    prop: "serialCode",
    label: "流水号",
    showOverflowTooltip: true,
    width: 120,
    sortable: true,
    fixed: 'left'
  },
  {
    prop: "dealingsCompanyName",
    label: "往来单位",
    showOverflowTooltip: true,
    minWidth: 150,
    sortable: true,
    fixed: 'left'
  },
  // {
  //   prop: "DZDH",
  //   label: "对账单号",
  //   showOverflowTooltip: true,
  //   minWidth: 150,
  //   sortable: true,
  //   render: (rows) => {
  //     console.log(rows)
  //     return rows.statement.billNo
  //   }
  // },
  {
    prop: "latestPaymentDate",
    label: "最迟付款日",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
  },
  {
    prop: "currency",
    label: "币别",
    showOverflowTooltip: true,
    width: 80,
    sortable: true,
  },
  {
    prop: "money",
    label: "金额",
    showOverflowTooltip: true,
    width: 100,
    sortable: true,
    decimal: 2,
		colFormat: "thousandthMark",
    align: "right"
  },
  {
    prop: "cashierByName",
    label: "付款出纳",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true
  },
  {
    prop: "bankReceiptCheckByName",
    label: "水单登记人",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true
  },
  {
    prop: "generalCashierName",
    label: "总出纳",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true
  },
  {
    prop: "methodOfSettle",
    label: "结算方式",
    showOverflowTooltip: true,
    width: 100,
    basicType: "accountCycle",
    sortable: true
  },
  {
    prop: "methodOfPayment",
    label: "付款方式",
    showOverflowTooltip: true,
    width: 100,
    basicType: "RVPType",
    sortable: true
  },
  {
    prop: "createTime",
    label: "任务生成时间",
    showOverflowTooltip: true,
    minWidth: 140,
    sortable: true
  },
  {
    prop: "bankReceiptSerialCode",
    label: "关联水单",
    showOverflowTooltip: true,
    minWidth: 140,
    sortable: true
  },
  // {
  //   prop: "xx_businessCompanyName",
  //   label: "记账主体",
  //   showOverflowTooltip: true,
  //   minWidth: 100,
  //   sortable: true,
  // },
  {
    prop: "businessCompanyShortName",
    label: "所属公司",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true,
  },
  {
    prop: "openingBank",
    label: "银行名称",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true,
  },
  {
    prop: "accountName",
    label: "对方户名",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true,
  },
  {
    prop: "bankAccount",
    label: "对方账号",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true,
  },
  {
    prop: "openingAddress",
    label: "对方开户行",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
  },

  {
    prop: "taskByName",
    label: "任务所属人",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
    fixed: 'right'
  },
  {
    prop: "status",
    label: "状态",
    showOverflowTooltip: true,
    dotColor: true,
    minWidth: 100,
    sortable: true,
    fixed: 'right',
    basicType: "RVPStatus"
  },
  // {
  //   prop: "operation",
  //   label: "操作",
  //   width: 180,
  //   fixed: 'right',
  //   customRow: true
  // }
]

export { summationConfig, billColumns, taskPayColumns };


const TABLE_COL_301 = {
  prop: "XX_301",
  label: "任务单号",
  showOverflowTooltip: true,
  width: 130,
  fixed: 'left'
}
const TABLE_COL_302 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  showOverflowTooltip: true,
  width: 120
}
const TABLE_COL_303 = {
  prop: "XX_303",
  label: "关联工作单号",
  showOverflowTooltip: true,
  width: 130
}
const TABLE_COL_304 = {
  prop: "bankReceiptSerialCode",
  label: "关联水单号",
  showOverflowTooltip: true,
  width: 120
}
const TABLE_COL_305 = {
  prop: "latestPaymentDate",
  label: "最迟付款日",
  showOverflowTooltip: true,
  width: 120
}
const TABLE_COL_306 = {
  prop: "currency",
  label: "币别",
  showOverflowTooltip: true,
  width: 90
}
const TABLE_COL_307 = {
  prop: "money",
  label: "金额",
  showOverflowTooltip: true,
  decimal: 2,
	colFormat: "thousandthMark",
  align: "right",
  width: 110
}
const TABLE_COL_308 = {
  prop: "methodOfSettle",
  label: "结算方式",
  showOverflowTooltip: true,
  basicType: "accountCycle",
  width: 110
}
const TABLE_COL_309 = {
  prop: "methodOfPayment",
  label: "收付款方式",
  showOverflowTooltip: true,
  basicType: "RVPType",
  width: 110
}
const TABLE_COL_310 = {
  prop: "XX_310",
  label: "发票号",
  showOverflowTooltip: true,
  width: 110
}
const TABLE_COL_311 = {
  prop: "XX_311",
  label: "完全核销",
  fontColor: true,
  basicType: "trueOrFalse",
  width: 100
}
const TABLE_COL_312 = {
  prop: "XX_312",
  label: "付款公司",
  showOverflowTooltip: true,
  width: 110
}
const TABLE_COL_313 = {
  prop: "XX_313",
  label: "账单确认人",
  showOverflowTooltip: true,
  width: 110
}
const TABLE_COL_314 = {
  prop: "createTime",
  label: "任务单生成时间",
  showOverflowTooltip: true,
  width: 120
}

export const mergeTableCols = [
  {
    ...TABLE_COL_0,
    fixed: 'left'
  },
  TABLE_COL_301,
  TABLE_COL_302,
  TABLE_COL_303,
  TABLE_COL_304,
  TABLE_COL_305,
  TABLE_COL_306,
  TABLE_COL_307,
  TABLE_COL_308,
  TABLE_COL_309,
  TABLE_COL_310,
  TABLE_COL_311,
  TABLE_COL_312,
  TABLE_COL_313,
  TABLE_COL_314
]

const TABLE_COL_601 = {
  prop: "result",
  label: "结果",
  showOverflowTooltip: true,
  width: 120
}
const TABLE_COL_602 = {
  prop: "step",
  label: "业务节点",
  showOverflowTooltip: true,
  width: 130
}
const TABLE_COL_603 = {
  prop: "auditRemark",
  label: "审核备注",
  showOverflowTooltip: true,
  minWidth: 160
}
const TABLE_COL_604 = {
  prop: "auditBy",
  label: "操作人",
  showOverflowTooltip: true,
  width: 120
}
const TABLE_COL_605 = {
  prop: "auditTime",
  label: "操作时间",
  showOverflowTooltip: true,
  width: 160
}

/** 财务报销详情有引用 */
export const resultsTableCols = [
  TABLE_COL_0,
  TABLE_COL_601,
  TABLE_COL_602,
  TABLE_COL_603,
  TABLE_COL_604,
  TABLE_COL_605
]


const typeLists=[
  {
    label: "应收账单合同",
    fBtnParam: {
      type: "131"
    },
    showType:[0,1]//0付  1收
  },
  {
    label: "应付账单发票",
    fBtnParam: {
      type: "125"
    },
    showType:[0]
  },
  {
    label: "应付账单其他",
    fBtnParam: {
      type: "130"
    },
    showType:[0]
  },
  {
    label: "收款水单",
    fBtnParam: {
      type: "126"
    },
    showStatus:[100],
    showType:[1]
  },
  {
    label: "付款水单",
    fBtnParam: {
      type: "127"
    },
    showStatus:[100],
    showType:[0]
  },
]

export const uploadFilesType=(row={})=>{
  const {status,type} = row
  let showTypeArr=[]
  const fileTypeArr=typeLists.filter((e)=>{
    const {showStatus,showType,fBtnParam}=e
    if((showStatus?showStatus.includes(status):true)&&(showType?showType.includes(type):true)){
      showTypeArr.push(fBtnParam.type)
      return true
    }
    return
  })
  return {
    fileTypeArr,
    showTypeArr
  }
}
