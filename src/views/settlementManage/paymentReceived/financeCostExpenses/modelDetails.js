import { formatMoney } from "@/utils/index";

const FORM_COLS_1 = {
  span: 12,
  id: "typeName",
  label: "类型：",
  type: "txt",
  // basicType: 'expenseType',
};
const FORM_COLS_2 = {
  span: 12,
  id: "flowType",
  label: "流程：",
  type: "txt",
  basicType: "expenseFlow",
  hideList: [4],
};
const FORM_COLS_3 = {
  span: 12,
  id: "businessCompanyName",
  label: "记账主体：",
  type: "txt",
};
const FORM_COLS_4 = {
  span: 12,
  id: "applicantName",
  label: "申请人：",
  type: "txt",
};
const FORM_COLS_5 = {
  span: 12,
  id: "applyDeptName",
  label: "报销部门：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 12,
  id: "claimByName",
  label: "领款人：",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 12,
  id: "borrowMoney",
  label: "原借款：",
  type: "txt",
  colFormat: "thousandthMark",
  decimal: 2,
};
const FORM_COLS_8 = {
  span: 12,
  id: "spareMoney",
  label: "应退余款：",
  type: "txt",
  colFormat: "thousandthMark",
  decimal: 2,
};
const FORM_COLS_10 = {
  span: 12,
  id: "verificationMoney",
  label: "本次核销金额：",
  type: "txt",
  colFormat: "thousandthMark",
  decimal: 2,
};
const FORM_COLS_11 = {
  span: 12,
  id: "cashierByName",
  label: "出纳：",
  type: "txt",
};
const FORM_COLS_12 = {
  span: 12,
  id: "verificationByName",
  label: "核销人：",
  type: "txt",
};
const FORM_COLS_13 = {
  span: 12,
  id: "latestPaymentDate",
  label: "最迟付款日：",
  type: "txt",
};
const FORM_COLS_14 = {
  span: 12,
  id: "invoiceNumber",
  label: "发票号码：",
  type: "txt",
};
const FORM_COLS_15 = {
  span: 12,
  id: "invoiceDate",
  label: "发票日期：",
  type: "txt",
};
const FORM_COLS_16 = {
  span: 12,
  id: "invoiceMoney",
  label: "发票金额：",
  type: "txt",
  colFormat: "thousandthMark",
  decimal: 2,
};
const FORM_COLS_17 = {
  span: 12,
  id: "totalMoney",
  label: "付款金额：",
  type: "txt",
  render: (r) => formatMoney(r.totalMoney) + " " + r.currencyCode,
};
const FORM_COLS_18 = {
  span: 12,
  id: "currencyCode",
  label: "币别：",
  type: "txt",
};
const FORM_COLS_19 = {
  span: 24,
  id: "remark",
  label: "付款原因：",
  type: "txt",
  textLineClamp: 2,
};
const FORM_COLS_21 = {
  span: 12,
  id: "latestPaymentDate",
  label: "预计还款日期：",
  type: "txt",
};
const FORM_COLS_22 = {
  span: 12,
  id: "monthBy",
  label: "账单所属月份：",
  type: "txt",
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 80,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  showOverflowTooltip: true,
  basicType: "billType",
  fontColor: true,
};
const TABLE_COLS_2 = {
  prop: "costName",
  label: "费用名称",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "currencyCode",
  label: "币种",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "money",
  label: "金额",
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true,
};

/** 个人报销 */
export const individualVerification = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_6,
                FORM_COLS_7,
                FORM_COLS_8,
                {
                  ...FORM_COLS_17,
                  label: "报销总金额：",
                },
                FORM_COLS_10,
                FORM_COLS_22,
              ],
            },
          ],
        },
      ],
    },
  ],
  column: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
  ],
};

/** 付款申请 */
export const payApply = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                {
                  ...FORM_COLS_3,
                  label: "付款单位：",
                },
                FORM_COLS_17,
                {
                  ...FORM_COLS_13,
                  noValueShow: true,
                },
                {
                  ...FORM_COLS_14,
                  noValueShow: true,
                },
                {
                  ...FORM_COLS_15,
                  noValueShow: true,
                },
                {
                  ...FORM_COLS_16,
                  noValueShow: true,
                },
                FORM_COLS_22,
                FORM_COLS_19,
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** 借款 */
export const borrowMoney = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                {
                  ...FORM_COLS_5,
                  label: "借款部门：",
                },
                // FORM_COLS_6,
                {
                  ...FORM_COLS_17,
                  label: "应退余额：",
                },
                FORM_COLS_22,
                FORM_COLS_21,
                {
                  ...FORM_COLS_19,
                  label: "借款理由：",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** 收款详情 */
export const collectionCols = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                {
                  ...FORM_COLS_17,
                  label: "金额：",
                },
                {
                  ...FORM_COLS_13,
                  label: "收款日期：",
                },
                FORM_COLS_22,
                {
                  ...FORM_COLS_19,
                  label: "收款原因：",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const HISTORY_TABLE_COL_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const HISTORY_TABLE_COL_201 = {
  label: "水单号",
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
// const HISTORY_TABLE_COL_203 = {
//   label: "水单认领",
//   prop: "generalCashierName",
//   minWidth: 120,
//   showOverflowTooltip: true,
// }
// const HISTORY_TABLE_COL_204 = {
//   label: "收款确认",
//   prop: "cashierByName",
//   minWidth: 120,
//   showOverflowTooltip: true,
// }
// const HISTORY_TABLE_COL_205 = {
//   label: "收款核销",
//   prop: "verificationByName",
//   minWidth: 120,
//   showOverflowTooltip: true,
// }
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
  prop: cType === 0 ? "receiptPaymentBankAccount" : "bankAccount",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_214 = (cType) => ({
  label: "付款开户行",
  prop: cType === 0 ? "receiptPaymentAccountOpeningBank" : "openingBank",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_215 = (cType) => ({
  label: "付款账号名称",
  prop: cType === 0 ? "receiptPaymentAccountName" : "accountName",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_216 = (cType) => ({
  label: "收款账号",
  prop: cType === 0 ? "bankAccount" : "receiptPaymentBankAccount",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_217 = (cType) => ({
  label: "收款账号开户行",
  prop: cType === 0 ? "openingBank" : "receiptPaymentAccountOpeningBank",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_218 = (cType) => ({
  label: "收款账号名称",
  prop: cType === 0 ? "accountName" : "receiptPaymentAccountName",
  minWidth: 130,
  showOverflowTooltip: true,
});
const HISTORY_TABLE_COL_219 = {
  label: "状态",
  prop: "status",
  minWidth: 120,
  fixed: "right",
  dotColor: true,
  showOverflowTooltip: true,
};
const HISTORY_TABLE_COL_220 = {
  label: "任务单生成时间",
  prop: "createTime",
  minWidth: 160,
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
  // HISTORY_TABLE_COL_215(cType),
  HISTORY_TABLE_COL_216(cType),
  HISTORY_TABLE_COL_217(cType),
  HISTORY_TABLE_COL_218(cType),
  {
    ...HISTORY_TABLE_COL_219,
    basicType: cType == 1 ? "collectionTaskState" : "RVPStatus",
  },
  HISTORY_TABLE_COL_220,
];
export const historyTableCols = (cType) => {
  // 0-付款 1-收款
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
};
