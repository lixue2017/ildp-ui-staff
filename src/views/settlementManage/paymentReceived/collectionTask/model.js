import {
  httpAllDealingCompanySelect,
  httpUserSelect,
  httpRoleDeptUserSelect,
  httpLogisticsCustomerSelect,
  httpAccountSelect,
} from "@/comModel/httpSelect";
import {
  SEARCH_SETTLEMENT_COL_1,
  SEARCH_SETTLEMENT_COL_2,
} from "@/views/settlementManage/components/comModel.js";
const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "statementsCode",
  label: "财务单号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  ...httpAllDealingCompanySelect(),
};
const SEARCH_COL_5 = {
  id: "checkNo",
  label: "关联发票号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_6 = {
  ...SEARCH_SETTLEMENT_COL_1,
  id: "currencyCode",
};
const SEARCH_COL_7 = {
  id: "methodOfPayment",
  label: "收付款方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "RVPType",
};
const SEARCH_COL_8 = {
  id: "methodOfSettle",
  label: "结算方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "accountCycle",
};
const SEARCH_COL_9 = {
  id: "bankReceiptNo",
  label: "关联水单号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "openingBank",
  label: "银行名称：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_11 = {
  id: "accountName",
  label: "对方户名：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_12 = {
  id: "bankAccount",
  label: "对方账号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_13 = {
  id: "statusIn",
  label: "状态：",
  placeholder: "请选择",
  type: "select",
  multiple: true,
  basicType: "collectionTaskState",
  hideList: [100],
};
const SEARCH_COL_14 = {
  id: "taskBy",
  selectLabelKey: "taskUserName",
  label: "任务所属人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const SEARCH_COL_15 = {
  id: "deptBy",
  label: "收款公司：",
  selectLabelKey: "deptByName",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_16 = {
  id: "verificationBy",
  label: "核销人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};
const SEARCH_COL_17 = {
  id: "isApplyInvoiceIn",
  label: "是否开票：",
  placeholder: "请选择",
  type: "select",
  multiple: true,
  basicType: "isApplyInvoiceStatus",
};
const SEARCH_COL_18 = {
  id: "settleModel",
  label: "结算模式：",
  placeholder: "请选择",
  type: "select",
  basicType: "settleModel",
};
const SEARCH_COL_19 = {
  id: "timeV",
  label: "核销日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_20 = {
  id: "receiptPaymentAccount",
  label: "收款账号：",
  placeholder: "请输入",
  ...httpAccountSelect({ type: 0 }),
};
const SEARCH_COL_21 = {
  id: "DealDate",
  label: "交易日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const searchColumns = {
  collectionLists: {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_1,
                  SEARCH_COL_14,
                  SEARCH_COL_2,
                  SEARCH_COL_3,
                  SEARCH_COL_4,
                  SEARCH_COL_5,
                  SEARCH_COL_6,
                  SEARCH_SETTLEMENT_COL_2,
                  SEARCH_COL_7,
                  SEARCH_COL_8,
                  SEARCH_COL_9,
                  SEARCH_COL_10,
                  SEARCH_COL_11,
                  SEARCH_COL_12,
                  SEARCH_COL_13,
                  SEARCH_COL_15,
                  SEARCH_COL_17,
                  SEARCH_COL_18,
                  SEARCH_COL_20,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  verificationLists: {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_1,
                  SEARCH_COL_2,
                  SEARCH_COL_3,
                  SEARCH_COL_4,
                  SEARCH_COL_5,
                  SEARCH_COL_6,
                  SEARCH_SETTLEMENT_COL_2,
                  SEARCH_COL_7,
                  SEARCH_COL_8,
                  SEARCH_COL_9,
                  SEARCH_COL_10,
                  SEARCH_COL_11,
                  SEARCH_COL_12,
                  SEARCH_COL_15,
                  SEARCH_COL_16,
                  SEARCH_COL_17,
                  SEARCH_COL_18,
                  SEARCH_COL_19,
                  SEARCH_COL_20,
                  SEARCH_COL_21,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

const TABLE_COL_1 = {
  prop: "serialCode",
  label: "流水号",
  showOverflowTooltip: true,
  minWidth: 175,
  columnLink: true,
  sortable: true,
  align: "left",
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
  align: "left",
  fixed: "left",
};
const TABLE_COL_3 = {
  prop: "statementsCode",
  label: "财务单号",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
  align: "left",
};
const TABLE_COL_4 = {
  prop: "orderNo",
  label: "工作单号",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
  align: "left",
};
const TABLE_COL_5 = {
  prop: "salesmanName",
  label: "业务员",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
  align: "left",
};
const TABLE_COL_6 = {
  prop: "checkNo",
  label: "关联发票号",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
  align: "left",
};
const TABLE_COL_7 = {
  prop: "latestPaymentDate",
  label: "最迟收款日",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_8 = {
  prop: "money",
  label: "金额",
  showOverflowTooltip: true,
  width: 100,
  sortable: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COL_9 = {
  prop: "currency",
  label: "币别",
  showOverflowTooltip: true,
  width: 80,
  sortable: true,
  align: "left",
};
const TABLE_COL_10 = {
  prop: "verificationMoney",
  label: "核销金额",
  showOverflowTooltip: true,
  width: 100,
  sortable: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COL_11 = {
  prop: "verificationByName",
  label: "核销人",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
};
const TABLE_COL_12 = {
  prop: "cashierByName",
  label: "收款出纳",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
};
const TABLE_COL_13 = {
  prop: "generalCashierName",
  label: "水单认领人",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_14 = {
  prop: "methodOfSettle",
  label: "结算方式",
  showOverflowTooltip: true,
  width: 100,
  sortable: true,
  align: "left",
  basicType: "accountCycle",
};
const TABLE_COL_15 = {
  prop: "methodOfPayment",
  label: "付款方式",
  showOverflowTooltip: true,
  width: 100,
  basicType: "RVPType",
  sortable: true,
  align: "left",
};
const TABLE_COL_16 = {
  prop: "createTime",
  label: "任务生成时间",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
  align: "left",
};
const TABLE_COL_17 = {
  prop: "bankReceiptSerialCode",
  label: "关联水单",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
};
const TABLE_COL_18 = {
  prop: "openingBank",
  label: "银行名称",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
};
const TABLE_COL_19 = {
  prop: "accountName",
  label: "对方户名",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
};
const TABLE_COL_20 = {
  prop: "bankAccount",
  label: "对方账号",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
};
const TABLE_COL_21 = {
  prop: "openingAddress",
  label: "对方开户行",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
};
// TABLE_COL_13,
const TABLE_COL_22 = {
  prop: "businessCompanyName",
  label: "记账主体",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
  align: "left",
};
const TABLE_COL_23 = {
  prop: "businessCompanyShortName",
  label: "收款公司",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  align: "left",
};
const TABLE_COL_24 = {
  prop: "taskByName",
  label: "任务所属人",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "right",
};
const TABLE_COL_25 = {
  prop: "status",
  label: "状态",
  showOverflowTooltip: true,
  dotColor: true,
  minWidth: 100,
  sortable: true,
  align: "center",
  fixed: "right",
  basicType: "collectionTaskState",
};
const TABLE_COL_26 = {
  prop: "isApplyInvoice",
  label: "是否开票",
  showOverflowTooltip: true,
  fontColor: true, // 字体是否有颜色
  minWidth: 100,
  sortable: true,
  align: "center",
  fixed: "right",
  basicType: "isApplyInvoiceStatus",
};
const TABLE_COL_27 = {
  prop: "invoiceWater",
  label: "发票流水号",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true,
};

const TABLE_COL_28 = {
  prop: "settleModel",
  label: "结算模式",
  showOverflowTooltip: true,
  minWidth: 100,
  basicType: "settleModel",
  align: "center",
  fontColor: true,
  sortable: true,
};

const TABLE_COL_29 = {
  prop: "receiptPaymentBankAccount",
  label: "收款账号",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
};

const TABLE_COL_30 = {
  prop: "dealDate",
  label: "交易日期",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
};
const TABLE_COL_31 = {
  prop: "bxMoney",
  label: "佰信核销",
  showOverflowTooltip: true,
  minWidth: 130,
  decimal: 2,
  sortable: true,
};
const taskColumns = [
  //收款任务单
  // {
  //   type: 'selection',
  //   align: "center",
  //   width: 50,
  //   fixed: 'left'
  // },
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_28,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_27,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_18,
  TABLE_COL_19,
  TABLE_COL_20,
  TABLE_COL_21,
  // TABLE_COL_22,
  TABLE_COL_29,
  TABLE_COL_23,
  TABLE_COL_31,
  TABLE_COL_24,
  TABLE_COL_25,
  TABLE_COL_26,
  {
    prop: "operation",
    label: "操作",
    width: 130,
    fixed: "right",
    columnOperation: true,
  },
];
const writeTaskColumns = [
  //已核销
  {
    type: "selection",
    align: "center",
    width: 50,
    fixed: "left",
  },
  {
    type: "index",
    align: "center",
    width: 50,
    fixed: "left",
  },
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_28,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_7,
  TABLE_COL_30,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  {
    prop: "receiptPaymentBankAccount",
    label: "核销账号",
    width: 120,
    showOverflowTooltip: true,
    sortable: true,
    align: "left",
  },
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_27,
  TABLE_COL_6,
  TABLE_COL_17,
  TABLE_COL_18,
  TABLE_COL_19,
  TABLE_COL_20,
  TABLE_COL_21,
  // TABLE_COL_22,
  TABLE_COL_29,
  TABLE_COL_23,
  TABLE_COL_31,
  {
    prop: "verificationTime",
    label: "核销时间",
    showOverflowTooltip: true,
    minWidth: 152,
    sortable: true,
    fixed: "right",
  },
  // TABLE_COL_26
  // TABLE_COL_25,
];

export { searchColumns, taskColumns, writeTaskColumns };
