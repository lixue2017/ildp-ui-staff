import {
  httpAccountSelect,
  httpCostTypeSelect,
  httpUserSelect,
  httpRoleDeptUserSelect,
  httpGetCostBindCustomer,
  httpLogisticsCustomerSelect,
  httpCustomerSelect,
} from "@/comModel/httpSelect.js";
const SEARCH_COLS_1 = {
  id: "beginTime",
  label: "对账日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "payerId",
  label: "付款单位：",
  placeholder: "付款单位",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COLS_3 = {
  id: "billNo",
  label: "收/付款单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
};
const SEARCH_COLS_4 = {
  id: "currencyIdIn",
  label: "币别：",
  placeholder: "请选择币别",
  multiple: true,
  type: "autocomplete",
  category: "currency",
};
const SEARCH_COLS_5 = {
  id: "payeeId",
  label: "收款单位：",
  placeholder: "收款单位",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COLS_6 = {
  id: "orderNum",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
};
const SEARCH_COLS_7 = {
  id: "lclNumber",
  label: "拼柜号：",
  placeholder: "拼柜号",
  type: "text",
};
const SEARCH_COLS_8 = {
  id: "masterNumber",
  label: "主单号：",
  placeholder: "主单号",
  type: "text",
};
const SEARCH_COLS_9 = {
  id: "costId",
  label: "费用名称：",
  placeholder: "费用名称",
  ...httpCostTypeSelect({ type: 0 }),
};
const SEARCH_COLS_10 = {
  id: "createUserId",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
};
const SEARCH_COLS_11 = {
  id: "requestInvoiceId",
  label: "申请开票人：",
  // ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
  ...httpUserSelect(),
};
const SEARCH_COLS_12 = {
  id: "drawerId",
  label: "开票人：",
  // ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
  ...httpUserSelect(),
};
const SEARCH_COLS_13 = {
  id: "invoiceCode",
  label: "发票代码：",
  placeholder: "发票代码",
  type: "text",
};
const SEARCH_COLS_14 = {
  id: "invoiceNumber",
  label: "发票号：",
  placeholder: "发票号",
  type: "text",
};
const SEARCH_COLS_15 = {
  id: "accountInfoId",
  label: "客户名称：",
  placeholder: "客户名称",
  ...httpGetCostBindCustomer(),
};
const SEARCH_COLS_16 = {
  id: "checkId",
  label: "账单确认人：",
  placeholder: "账单确认人",
  ...httpUserSelect(),
};
const SEARCH_COLS_17 = {
  id: "operationMainId",
  label: "记账主体：",
  selectLabelKey: "businessCompanyName",
  placeholder: "记账主体",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COLS_18 = {
  id: "accountInfoId",
  label: "收款方：",
  placeholder: "收款方",
  ...httpGetCostBindCustomer(),
};
const SEARCH_COLS_19 = {
  id: "billNo",
  label: "对账单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
};
const SEARCH_COLS_20 = {
  id: "status",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "soaStatus",
  // multiple: true,
  // hideList: [30],
};
const SEARCH_COLS_21 = {
  id: "businessType",
  label: "业务类型：",
  placeholder: "业务类型",
  type: "select",
  basicType: "settlementBusinessType",
};
const searchColumns_SX = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  { ...SEARCH_COLS_3, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  { ...SEARCH_COLS_6, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_7,
  SEARCH_COLS_8,
  SEARCH_COLS_9,
  SEARCH_COLS_10,
  SEARCH_COLS_11,
  SEARCH_COLS_12,
  SEARCH_COLS_13,
  SEARCH_COLS_14,
];
const searchColumns_DC = [
  SEARCH_COLS_1,
  SEARCH_COLS_15,
  { ...SEARCH_COLS_3, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_4,
  SEARCH_COLS_7,
  { ...SEARCH_COLS_6, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_9,
  SEARCH_COLS_10,
  SEARCH_COLS_16,
  SEARCH_COLS_17,
];
const searchColumns_YH = [
  SEARCH_COLS_1,
  SEARCH_COLS_4,
  { ...SEARCH_COLS_6, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_21,
  SEARCH_COLS_18,
  { ...SEARCH_COLS_19, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_20,
  SEARCH_COLS_10,
  SEARCH_COLS_17,
];

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "对账日期",
  prop: "reconciliationDate",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_2 = {
  label: "付款单位",
  prop: "payer",
  colorProp: "payerColor",
  showOverflowTooltip: true,
  minWidth: 100,
  fixed: "left",
};
const TABLE_COLS_3 = {
  label: "付款单号",
  prop: "payerBillNo",
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_4 = {
  label: "收款单位",
  prop: "payee",
  colorProp: "payeeColor",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_5 = {
  label: "收款单号",
  prop: "payeeBillNo",
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_6 = {
  label: "拼柜号",
  prop: "lclNumber",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_7 = {
  label: "主单号",
  prop: "masterNumber",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_8 = {
  label: "工作单号",
  prop: "orderNum",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_9 = {
  label: "币别",
  prop: "currencyCode",
  colorProp: "currencyColor",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_10 = {
  label: "明细金额",
  prop: "detailedAmount",
  align: "right",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_11 = {
  label: "费用名称",
  prop: "costName",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_12 = {
  label: "数据分析",
  prop: "dataAnalysis",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_13 = {
  label: "备注",
  prop: "remark",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_14 = {
  label: "创建人",
  prop: "createBy",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_15 = {
  label: "收款确认",
  prop: "payeeCheck",
  bottomProp: "payeeCheckDate",
  columnTopBottom: true,
  align: "center",
  renderBottom: (row) => row.payeeCheckDate || "",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_16 = {
  label: "付款确认",
  prop: "payerCheck",
  bottomProp: "payerCheckDate",
  columnTopBottom: true,
  align: "center",
  renderBottom: (row) => row.payerCheckDate || "",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_17 = {
  label: "付款分配",
  prop: "generalCashier",
  bottomProp: "generalCashierDate",
  columnTopBottom: true,
  align: "center",
  renderBottom: (row) => row.generalCashierDate || "",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_18 = {
  label: "核销时间",
  prop: "verificationTime",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_19 = {
  label: "申请开票",
  prop: "applicant",
  align: "center",
  columnTopBottom: true,
  bottomProp: "rmbCostMoney",
  bottomDecimal: 2,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_20 = {
  label: "开票人",
  prop: "drawer",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_21 = {
  label: "发票代码",
  prop: "invoiceCode",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_22 = {
  label: "发票号码",
  prop: "invoiceNumber",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_23 = {
  label: "客户/堡森",
  prop: "accountInfo",
  colorProp: "accountInfoColor",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_24 = {
  label: "对冲金额",
  prop: "hedgingAmount",
  align: "right",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_25 = {
  label: "账单确认",
  prop: "checkBy",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_26 = {
  label: "记账主体",
  prop: "operationMain",
  colorProp: "operationMainColor",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_27 = {
  label: "业务类型",
  prop: "businessType",
  basicType: "settlementBusinessType",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_28 = {
  label: "金额",
  prop: "amount",
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_29 = {
  label: "记账时间",
  prop: "accountingTime",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_30 = {
  label: "状态",
  prop: "status",
  dotColor: true,
  basicType: "soaStatus",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_31 = {
  label: "收款方",
  prop: "payee",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_32 = {
  label: "手续费对账单号",
  prop: "billNo",
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_33 = {
  label: "审核人",
  prop: "auditBy",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_OPERATION = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true,
  minWidth: 80,
};
const tableColumns_SX = [
  {
    prop: "index",
    fixed: "left",
    align: "center",
    width: 50,
  },
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_13,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
  TABLE_COLS_20,
  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_OPERATION,
];
const tableColumns_DC = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_23,
  TABLE_COLS_5,
  {
    ...TABLE_COLS_3,
    fixed: undefined,
  },
  TABLE_COLS_6,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_24,
  TABLE_COLS_11,
  TABLE_COLS_14,
  TABLE_COLS_25,
  TABLE_COLS_26,
  TABLE_COLS_13,
];
const tableColumns_YH = [
  TABLE_COLS_INDEX,
  TABLE_COLS_8,
  TABLE_COLS_27,
  TABLE_COLS_9,
  TABLE_COLS_28,
  TABLE_COLS_14,
  TABLE_COLS_29,
  TABLE_COLS_30,
  TABLE_COLS_31,
  TABLE_COLS_32,
  TABLE_COLS_13,
  TABLE_COLS_26,
  TABLE_COLS_1,
  TABLE_COLS_33,
];

const searchColumns = (type = 1) => ({
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [searchColumns_SX, searchColumns_DC, searchColumns_YH][
                type - 1
              ],
            },
          ],
        },
      ],
    },
  ],
});

const tableColumns = (type = 1) => {
  return [tableColumns_SX, tableColumns_DC, tableColumns_YH][type - 1];
};

const remarkConfig = {
  title: "备注",
  width: "450px",
  labelWidth: "90px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "dataAnalysis",
                  label: "数据分析：",
                  placeholder: "备注说明",
                  type: "textarea",
                  maxlength: 500,
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注：",
                  placeholder: "备注说明",
                  type: "textarea",
                  maxlength: 500,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {},
};

export { searchColumns, tableColumns, remarkConfig };
