const summationConfig = [
  // {
  //   label: '选择账单数量：',
  //   prop: 'count',
  // },
  // {
  //   label: '合计本位币：',
  //   prop: 'standardCurrency',
  // },
  // {
  //   label: '合计辅助币：',
  //   prop: 'assistCurrency',
  // },
  {
    label: "金额：",
    prop: "totalMoney",
  },
];

const HISTORY_TABLE_COL_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const MODEL_COL_9 = {
  label: "关联业务",
  prop: "businessType",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  basicType: "settlementBusinessType",
};
const MODEL_COL_10 = {
  label: "工作单号",
  prop: "orderNum",
  cPageNoKey: "pageNo",
  cOrderIdKey: "jumpId",
  cOrderType: "ddType",
  showOverflowTooltip: true,
  sortable: true,
  columnLink: true,
  minWidth: 120,
};
const MODEL_COL_12 = {
  label: "已核销金额",
  prop: "verificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
  colFormat: "thousandthMark",
  showOverflowTooltip: true,
};
const MODEL_COL_13 = {
  label: "核销中金额",
  prop: "underwayVerificationMoney",
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
  colFormat: "thousandthMark",
  showOverflowTooltip: true,
};
const MODEL_COL_14 = {
  label: "全部核销",
  prop: "verificationStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
};
const MODEL_COL_15 = {
  label: "已开票金额",
  prop: "invoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  colFormat: "thousandthMark",
  showOverflowTooltip: true,
};
const MODEL_COL_16 = {
  label: "开票中金额",
  prop: "underwayInvoiceMoney",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  colFormat: "thousandthMark",
  showOverflowTooltip: true,
};

const MODEL_COL_17 = {
  label: "全部开票",
  prop: "invoiceStatus",
  minWidth: 120,
  sortable: true,
  fontColor: true, //表格字体颜色
  basicType: "trueOrFalse",
  align: "center",
  showOverflowTooltip: true,
};

const MODEL_COL_18 = {
  label: "关联水单",
  prop: "contactsBankNo",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  columnLink: true,
};

const MODEL_COL_19 = {
  label: "本次开票信息",
  prop: "invoiceInfo",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
};
const billColumns = (cType) => [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    type: "selection",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    label: "类型",
    prop: "type",
    basicType: "billType",
    fontColor: true,
    showOverflowTooltip: true,
    sortable: true,
    fixed: "left",
  },
  {
    label: "费用名称",
    prop: "costName",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
    fixed: "left",
  },
  {
    label: "金额",
    prop: "totalMoney",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 2,
    colFormat: "thousandthMark",
    minWidth: 100,
    align: "right",
  },
  // {
  //   label: "往来单位",
  //   prop: "dealingsCompanyName",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   width: 120,
  //   fixed: 'left'
  // },
  {
    label: "币别",
    prop: "currencyCode",
    showOverflowTooltip: true,
    sortable: true,
    align: "right",
    minWidth: 100,
  },
  {
    prop: "unitPrice",
    label: "单价",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 2,
    colFormat: "thousandthMark",
    minWidth: 100,
    align: "right",
    // minWidth: 100,
  },
  {
    prop: "num",
    label: "数量",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 3,
    minWidth: 100,
    align: "right",
  },
  {
    prop: "customerName",
    label: "客户名称",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "left",
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
    cOrderType: "joinDdType",
  },
  MODEL_COL_12,
  MODEL_COL_13,
  MODEL_COL_14,
  ...(cType == 0 ? [] : [MODEL_COL_15, MODEL_COL_16, MODEL_COL_17]),
  ...(cType == 1 ? [MODEL_COL_19] : []),
  { ...MODEL_COL_18, columnLink: cType == 0 },
  {
    prop: "operateUser",
    label: "操作员",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    prop: "businessUser",
    label: "业务员",
    sortable: true,
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    label: "含税",
    prop: "isIncludeTax",
    showOverflowTooltip: true,
    sortable: true,
    render: (row) => {
      return row.isIncludeTax ? "是" : "否";
    },
  },
  {
    label: "税率(%)",
    prop: "taxRate",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    decimal: 2,
    colFormat: "thousandthMark",
    align: "right",
  },
  {
    label: "税额",
    prop: "taxMoney",
    showOverflowTooltip: true,
    sortable: true,
    align: "right",
    decimal: 2,
    colFormat: "thousandthMark",
    minWidth: 100,
  },
  {
    label: "备注",
    prop: "remark",
    minWidth: 230,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    label: "记账时间",
    prop: "accountingTime",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
];

const operation = {
  prop: "operation",
  label: "操作",
  showOverflowTooltip: true,
  width: 80,
  customRow: true,
  fixed: "right",
};
export { summationConfig, billColumns, operation };

const HISTORY_TABLE_COL_201 = {
  label: "关联水单号",
  prop: "bankReceiptNo",
  minWidth: 130,
  fixed: "left",
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_202 = {
  label: "任务单号",
  prop: "taskBillNo",
  minWidth: 130,
  fixed: "left",
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_203 = {
  label: "水单认领",
  prop: "generalCashierName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_204 = {
  label: "收款确认",
  prop: "cashierByName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_205 = {
  label: "收款核销",
  prop: "verificationByName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_206 = {
  label: "水单交易日",
  prop: "dealDate",
  minWidth: 160,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_207 = {
  label: "水单币别",
  prop: "bankReceiptCurrencyCode",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_208 = {
  label: "水单金额",
  prop: "bankReceiptMoney",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const HISTORY_TABLE_COL_209 = {
  label: "本次核销金额",
  prop: "verificationMoney",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const HISTORY_TABLE_COL_210 = {
  label: "手续费",
  prop: "serviceCharge",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const HISTORY_TABLE_COL_211 = {
  label: "汇兑损益",
  prop: "exchangeLoss",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
};
const HISTORY_TABLE_COL_212 = {
  label: "购汇汇率",
  prop: "foreignExchangePurchasing",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
};
const HISTORY_TABLE_COL_213 = (cType) => ({
  label: "付款账号",
  prop: cType == 0 ? "receiptPaymentBankAccount" : "bankAccount",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_214 = (cType) => ({
  label: "付款开户行",
  prop: cType == 0 ? "receiptPaymentAccountOpeningBank" : "openingBank",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_215 = (cType) => ({
  label: "付款账号名称",
  prop: cType == 0 ? "receiptPaymentAccountName" : "accountName",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_216 = (cType) => ({
  label: "收款账号",
  prop: cType == 0 ? "bankAccount" : "receiptPaymentBankAccount",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_217 = (cType) => ({
  label: "收款账号开户行",
  prop: cType == 0 ? "openingBank" : "receiptPaymentAccountOpeningBank",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_218 = (cType) => ({
  label: "收款账号名称",
  prop: cType == 0 ? "accountName" : "receiptPaymentAccountName",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_219 = {
  label: "状态",
  prop: "status",
  minWidth: 110,
  fixed: "right",
  // basicType: "RVPStatus",
  dotColor: true,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_220 = {
  label: "任务单生成时间",
  prop: "createTime",
  minWidth: 152,
  // fixed: "right",
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_221 = {
  prop: "isApplyInvoice",
  label: "是否开票",
  basicType: "isApplyInvoiceStatus",
  fontColor: true,
  fixed: "right",
  showOverflowTooltip: true,
};

const HISTORY_TABLE_COL_303 = {
  label: "总出纳",
  prop: "generalCashierName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_304 = {
  label: "付款出纳",
  prop: "cashierByName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_305 = {
  label: "水单登记",
  prop: "bankReceiptCheckByName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_306 = {
  label: "付款核销",
  prop: "verificationByName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  customRow: true,
  minWidth: 140,
  fixed: "right",
};
const HIS_TABLE_COLS_1 = (cType) => [
  HISTORY_TABLE_COL_206,
  HISTORY_TABLE_COL_207,
  HISTORY_TABLE_COL_208,
  HISTORY_TABLE_COL_209,
  HISTORY_TABLE_COL_210,
  HISTORY_TABLE_COL_211,
  HISTORY_TABLE_COL_212,
  HISTORY_TABLE_COL_213(cType),
  HISTORY_TABLE_COL_214(cType),
  HISTORY_TABLE_COL_215(cType),
  HISTORY_TABLE_COL_216(cType),
  HISTORY_TABLE_COL_217(cType),
  HISTORY_TABLE_COL_218(cType),
  HISTORY_TABLE_COL_220,
  {
    ...HISTORY_TABLE_COL_219,
    basicType: cType == 1 ? "collectionTaskState" : "paymentTaskState",
  },
  ...(cType == 1 ? [HISTORY_TABLE_COL_221] : []),
];
export const historyTableCols = (cType) => {
  console.log("cType", cType);
  if (cType == 0) {
    return [
      HISTORY_TABLE_COL_INDEX,
      HISTORY_TABLE_COL_201,
      HISTORY_TABLE_COL_202,
      HISTORY_TABLE_COL_303,
      HISTORY_TABLE_COL_304,
      HISTORY_TABLE_COL_305,
      HISTORY_TABLE_COL_306,
      ...HIS_TABLE_COLS_1(cType),
    ];
  }
  return [
    HISTORY_TABLE_COL_INDEX,
    HISTORY_TABLE_COL_201,
    HISTORY_TABLE_COL_202,
    HISTORY_TABLE_COL_203,
    HISTORY_TABLE_COL_204,
    HISTORY_TABLE_COL_205,
    ...HIS_TABLE_COLS_1(cType),
    HISTORY_TABLE_COL_OPERATION,
  ];
};

export const jumpPageParams = (row = {}) => {
  //已全部配入数据字典的路由路径中，弃用此方法
  //在这获取对应页面列表跳转详情的附加参数,数据字典为：billPageNo（账单明细业务单跳转）
  const { pageNo } = row;
  return {
    105: {
      menuType: "operation",
    },
    207: {},
    208: {
      pageType: 2,
    },
    209: {
      pageType: 1,
    },
  }[pageNo];
};
