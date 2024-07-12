const FORM_COLS_1 = {
  span: 12,
  id: "type",
  label: "类型：",
  type: "txt",
  basicType: "expenseType",
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
  label: "主体：",
  type: "txt",
};
const FORM_COLS_4 = {
  span: 12,
  id: "latestPaymentDate",
  label: "最迟付款日：",
  type: "txt",
};
const FORM_COLS_5 = {
  span: 12,
  id: "invoiceDate",
  label: "发票日期：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 12,
  id: "currencyCode",
  label: "币别：",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 12,
  id: "invoiceNumber",
  label: "发票号：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COLS_8 = {
  span: 12,
  id: "invoiceMoney",
  label: "发票金额：",
  placeholder: "请输入",
  type: "inputNumber",
  numDecimal: 2,
};
const FORM_COLS_9 = {
  span: 12,
  id: "remark",
  label: "付款原因：",
  type: "txt",
};
const FORM_COLS_10 = {
  span: 24,
  id: "applicantName",
  label: "申请人：",
  type: "txt",
};
const FORM_COLS_11 = {
  span: 24,
  id: "dealingsCompanyName",
  label: "收款单位：",
  type: "txt",
};
const FORM_COLS_12 = {
  span: 24,
  id: "receiptPaymentBankAccount",
  label: "收款账号：",
  type: "txt",
};
const FORM_COLS_13 = {
  span: 24,
  id: "openingBank",
  label: "收款开户行：",
  type: "txt",
};
const FORM_COLS_14 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};
const FORM_COLS_15 = {
  span: 24,
  id: "uploadFile",
  labelWidth: "0",
  type: "slot",
};
export const formLists = (row = {}) => {
  return [
    {
      className: "invoice-col",
      scaleWidth: 1,
      fieldList: [
        {
          rowClassName: "invoice-cols-left",
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
                FORM_COLS_9,
              ],
            },
          ],
        },
        {
          rowClassName: "invoice-cols-right",
          rows: [
            {
              cols: [FORM_COLS_10],
            },
            {
              colClassName: "right-bottom",
              cols: [FORM_COLS_11, FORM_COLS_12, FORM_COLS_13],
            },
          ],
        },
      ],
    },
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_14, FORM_COLS_15],
            },
          ],
        },
      ],
    },
  ];
};

export const formRules = {
  // type: [
  //   { required: true, message: "请选择类型", trigger: "change" },
  // ],
  invoiceNumber: [
    { required: true, message: "请输入发票号码", trigger: "change" },
  ],
  invoiceMoney: [
    { required: true, message: "请输入发票金额", trigger: "change" },
  ],
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
  basicType: 'billType',
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
};
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "UNCHARTED_6",
  label: "操作",
  columnOperation: true,
  fixed: "right",
};
export const tableColumns = () => {
  return [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    // TABLE_COLS_OPERATION,
  ];
};
