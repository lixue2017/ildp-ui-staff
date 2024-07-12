const summationConfig = [
  {
    label: "选择账单数量：",
    prop: "count",
  },
  // {
  //   label: '合计本位币：',
  //   prop: 'standardCurrency',
  // },
  // {
  //   label: '合计辅助币：',
  //   prop: 'assistCurrency',
  // }
];

const businessBillColumns = [
  {
    type: "selection",
    align: "center",
    fixed: "left",
    width: 45,
  },
  {
    label: "应收应付",
    prop: "type",
    showOverflowTooltip: true,
    sortable: true,
    width: 98,
    fontColor: true,
    basicType: "billType",
    fixed: "left",
  },
  {
    label: "费用名称",
    prop: "costName",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    fixed: "left",
  },
  {
    label: "往来单位",
    prop: "dealingsCompanyName",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    fixed: "left",
  },
  {
    label: "币别",
    prop: "currencyCode",
    showOverflowTooltip: true,
    width: 76,
    sortable: true,
    fixed: "left",
  },
  {
    label: "单价",
    prop: "unitPrice",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 2,
    colFormat: "thousandthMark",
    fixed: "left",
    align: "right",
    width: 96,
  },
  {
    label: "数量",
    prop: "num",
    showOverflowTooltip: true,
    sortable: true,
    fixed: "left",
    align: "right",
    width: 96,
  },
  {
    label: "金额",
    prop: "totalMoney",
    showOverflowTooltip: true,
    sortable: true,
    fixed: "left",
    width: 96,
    decimal: 2,
    colFormat: "thousandthMark",
    align: "right",
  },
  // {
  //   label: "PPORCC",
  //   prop: "pc",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100
  // },
  {
    label: "本位币汇率",
    prop: "currentMoonBaseRate",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "right",
  },
  {
    label: "辅助币汇率",
    prop: "currentMoonHelpRate",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "right",
  },
  // {
  //   label: "含税",
  //   prop: "hs",
  //   showOverflowTooltip: true,
  //   sortable: true
  // },
  // {
  //   label: "税率(%)",
  //   prop: "sl",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100
  // },
  // {
  //   label: "税额",
  //   prop: "se",
  //   showOverflowTooltip: true,
  //   sortable: true
  // },
  // {
  //   label: "不含税金额",
  //   prop: "noje",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 120
  // },
  // {
  //   label: "应收应付日期",
  //   prop: "rq",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 140
  // },
  {
    label: "是否锁单",
    prop: "lockOrder",
    width: 80,
    render: (row) => {
      return row.lockOrder ? "是" : "否";
    },
  },
  {
    label: "备注",
    prop: "remark",
    showOverflowTooltip: true,
  },
  // {
  //   label: "对账单",
  //   prop: "dzd",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100,
  //   fixed: 'right'
  // },
  // {
  //   label: "收款单",
  //   prop: "skd",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100,
  //   fixed: 'right'
  // },
];

const enterpriseBillColumns = [
  {
    type: "selection",
    align: "center",
    width: 45,
  },
  {
    label: "类型",
    prop: "billType",
    showOverflowTooltip: true,
    sortable: true,
    customRow: true,
    basicType: "billType",
    fixed: "left",
    width: 80,
  },
  {
    label: "费用名称",
    prop: "costName",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    fixed: "left",
  },
  {
    label: "记账日期",
    prop: "accountingTime",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    label: "币别",
    prop: "currency",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "单价",
    prop: "dj",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "数量",
    prop: "count",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "金额",
    prop: "totalAmount",
    showOverflowTooltip: true,
    sortable: true,
    colFormat: "thousandthMark",
    decimal: 2,
  },
  {
    label: "税额",
    prop: "se",
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    label: "不含税金额",
    prop: "bhl",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
  },
  {
    label: "备注",
    prop: "remark",
    showOverflowTooltip: true,
  },
  {
    label: "工作单号",
    prop: "skd",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    fixed: "right",
  },
];

export { summationConfig, businessBillColumns, enterpriseBillColumns };
