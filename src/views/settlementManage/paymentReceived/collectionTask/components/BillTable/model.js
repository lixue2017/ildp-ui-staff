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
  minWidth: 120
}
const MODEL_COL_12 = {
  label: "已核销金额",
  prop: "verificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
}
const MODEL_COL_13 = {
  label: "核销中金额",
  prop: "underwayVerificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
}
const MODEL_COL_14 = {
  label: "全部核销",
  prop: "verificationStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
}
const MODEL_COL_15 = {
  label: "已开票金额",
  prop: "invoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
}
const MODEL_COL_16 = {
  label: "开票中金额",
  prop: "underwayInvoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
}

const MODEL_COL_17 = {
  label: "全部开票",
  prop: "invoiceStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
}

const MODEL_COL_18 = {
  label: "关联水单",
  prop: "contactsBankNo",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const billColumns = [
  {
    type: 'index',
    align: "center",
    fixed: 'left',
    width: 45
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
    fixed: 'left',
    decimal: 2,
    align: "right",
    minWidth: 100
  },
  // {
  //   label: "往来单位",
  //   prop: "dealingsCompanyName",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100,
  //   fixed: 'left'
  // },
  {
    label: "币别",
    prop: "currency",
    showOverflowTooltip: true,
    sortable: true,
    fixed: 'left'
  },
  {
    label: "单价",
    prop: "unitPrice",
    showOverflowTooltip: true,
    sortable: true,
    fixed: 'left',
    align: "right",
    decimal: 2,
    minWidth: 100
  },
  {
    label: "数量",
    prop: "num",
    showOverflowTooltip: true,
    sortable: true,
    fixed: 'left',
    align: "right",
    decimal: 2,
    minWidth: 100
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
    showOverflowTooltip: true,
    sortable: true,
  },
  MODEL_COL_9,
  MODEL_COL_10,
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
  MODEL_COL_12,
  MODEL_COL_13,
  MODEL_COL_14,
  MODEL_COL_15,
  MODEL_COL_16,
  MODEL_COL_17,
  MODEL_COL_18,
  {
    label: "操作员",
    prop: "operatorUser",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    label: "业务员",
    prop: "salesman",
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

export { summationConfig, billColumns };
