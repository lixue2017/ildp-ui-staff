const searchColumns = [
  {
    span: 8,
    id: "auditTime",
    label: "审核时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    span: 5,
    id: "relatedBusiness",
    label: "应收应付：",
    placeholder: "-应收应付",
    type: "select",
    basicType: 'billType'
  },
  {
    span: 5,
    id: "currency",
    label: "结算方式：",
    placeholder: "-结算方式-",
    type: "select",
    basicType: 'billType'
  },
  {
    span: 6,
    id: "orderBun",
    label: "工作单号：",
    placeholder: "单号",
    type: "text"
  },
];

const tableColumns = [
  {
    type: "selection",
    width: 50,
    align: "center"
  },
  {
    label: "账单号码",
    prop: "billNo",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    prop: "dealingsCompanyName",
    label: "往来单位",
    width: 180,
    showOverflowTooltip: true,
  },
  {
    prop: "businessCompanyName",
    label: "记账主体",
    width: 180,
    showOverflowTooltip: true,
  },
  {
    label: "结算方式",
    prop: "settleType",
    showOverflowTooltip: true,
    sortable: true,
    basicType: "accountCycle"
  },
  {
    label: "账单数",
    prop: "billNum",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "折合本位币",
    prop: "convertBaseMoney",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "折合辅助币",
    prop: "convertHelpMoney",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "最晚收付日",
    prop: "lastPayTime",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "审核时间",
    prop: "checkTime",
    showOverflowTooltip: true,
    sortable: true,
  },
]

export { searchColumns, tableColumns };
