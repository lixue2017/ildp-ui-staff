import {
  httpAllDealingCompanySelect,
  httpUserSelect,
  httpDeptSelect,
  httpLogisticsCustomerSelect,
  httpPOSTCusList,
  httpCustomerSelect,
} from "@/comModel/httpSelect";
import {
  SEARCH_SETTLEMENT_COL_1,
  SEARCH_SETTLEMENT_COL_2,
} from "@/views/settlementManage/components/comModel.js";

const SEARCH_COL_1 = {
  id: "auditTime",
  label: "交易时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "accountName",
  label: "对方户名：",
  placeholder: "对方户名",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "bankAccount",
  label: "对方账户：",
  placeholder: "对方账户",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "receiptPaymentAccountBank",
  label: "银行名称：",
  placeholder: "银行名称",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "serialCode",
  label: "流水号：",
  placeholder: "流水号",
  type: "text",
};
const SEARCH_COL_6 = {
  ...SEARCH_SETTLEMENT_COL_1,
  id: "currencyCode",
};
const SEARCH_COL_7 = {
  ...SEARCH_SETTLEMENT_COL_2,
};
const SEARCH_COL_8 = {
  id: "companyBy",
  label: "收款公司：",
  selectLabelKey: "companyByName",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_9 = {
  id: "claimTime",
  label: "认领时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_10 = {
  id: "claimBy",
  label: "认领人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const SEARCH_COL_11 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  ...httpAllDealingCompanySelect(),
};
const SEARCH_COL_12 = {
  id: "type",
  label: "认领类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "bankReceiptType",
};
const SEARCH_COL_13 = {
  id: "createTaskBy",
  label: "创建人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};

export const searchColumns = (tName = "1") => {
  let SEARCH_COLS = [
    SEARCH_COL_1,
    SEARCH_COL_5,
    SEARCH_COL_2,
    SEARCH_COL_3,
    SEARCH_COL_4,
    SEARCH_COL_6,
    SEARCH_COL_7,
    SEARCH_COL_8,
    SEARCH_COL_13,
  ];
  if (tName === "2") {
    SEARCH_COLS = [...SEARCH_COLS, SEARCH_COL_9, SEARCH_COL_10, SEARCH_COL_12];
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
  ];
};

const TABLE_COL_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "serialCode",
  label: "流水号",
  showOverflowTooltip: true,
  customRow: true,
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "dealDate",
  label: "交易日期",
  showOverflowTooltip: true,
  customRow: true,
  width: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_3 = {
  prop: "receiptPaymentAccountBank",
  label: "银行名称",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_4 = {
  prop: "currencyCode",
  label: "币种",
  showOverflowTooltip: true,
  minWidth: 80,
  sortable: true,
  align: "center",
};
const TABLE_COL_5 = {
  prop: "money",
  label: "往来金额",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COL_6 = {
  prop: "accountName",
  label: "对方户名",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_7 = {
  prop: "bankAccount",
  label: "对方账号",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_8 = {
  prop: "openingBank",
  label: "对方开户行",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_9 = {
  prop: "receiptPaymentBankAccount",
  label: "记账账号",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_10 = {
  prop: "receiptPaymentAccountName",
  label: "记账账号名称",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: true,
  align: "left",
};
const TABLE_COL_11 = {
  prop: "companyByName",
  label: "收款公司",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  align: "left",
};

const TABLE_COL_12 = {
  prop: "backNum",
  label: "打回次数",
  minWidth: 100,
  sortable: true,
  align: "right",
};
const TABLE_COL_13 = {
  prop: "xx_table_13",
  label: "打回备注",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
  align: "left",
};
const TABLE_COL_14 = {
  prop: "claimTime",
  label: "认领时间",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: true,
  align: "left",
};
const TABLE_COL_15 = {
  prop: "claimByName",
  label: "认领人",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "left",
};
const TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  columnOperation: true,
  width: 140,
  fixed: "right",
};
const TABLE_COL_17 = {
  prop: "isApplyInvoice",
  label: "是否开票",
  showOverflowTooltip: true,
  fontColor: true,
  minWidth: 100,
  sortable: true,
  basicType: "isApplyInvoiceStatus",
  fixed: "right",
  align: "center",
};
const TABLE_COL_18 = {
  prop: "status",
  label: "状态",
  showOverflowTooltip: true,
  minWidth: 100,
  dotColor: true,
  sortable: true,
  fixed: "right",
  align: "center",
  basicType: "exchangeStatus",
};

const TABLE_COL_19 = {
  prop: "createTaskByName",
  label: "创建人",
  minWidth: 100,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_20 = {
  prop: "type",
  label: "认领类型",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  basicType: "bankReceiptType",
  align: "center",
  fontColor: true,
};
const TABLE_COL_21 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  showOverflowTooltip: true,
  sortable: true,
};
export const tableColumns = (tName = "1") => {
  const publicCols = [
    TABLE_COL_21, // 创建时间
    TABLE_COL_4, //币种
    TABLE_COL_5, //往来金额
    TABLE_COL_3, //银行名称
    TABLE_COL_6, //对方户名
    TABLE_COL_7, //对方账号
    TABLE_COL_8, //对方开户行
    TABLE_COL_9, //记账账号
    TABLE_COL_10, //记账账号名称
    TABLE_COL_11, //收款公司
  ];
  return {
    1: [
      TABLE_COL_INDEX,
      TABLE_COL_1, //流水号
      TABLE_COL_2, //交易日期
      ...publicCols,
      TABLE_COL_19,
      TABLE_COL_OPERATION,
    ],
    2: [
      TABLE_COL_INDEX,
      {
        ...TABLE_COL_1,
        minWidth: 180,
      }, //流水号
      TABLE_COL_2, //交易日期
      TABLE_COL_14, //认领时间
      ...publicCols,
      TABLE_COL_15, //认领人
      TABLE_COL_19,
      TABLE_COL_20,
      TABLE_COL_17, //是否开票
      TABLE_COL_18, //状态
      TABLE_COL_OPERATION,
    ],
  }[tName];
};

export const suborder = [
  // {
  //   label:"流水号",
  //   value:'serialCode',
  // },
  {
    label: "认领金额",
    value: "verificationMoney",
    unitValue: "currency",
  },
  {
    label: "往来单位",
    value: "dealingsCompanyName",
  },
  {
    label: "工作单号",
    value: "orderNo",
  },
  {
    label: "关联发票",
    value: "WEB_invoice",
  },
];

const DIALOG_SEARCH_COL_1 = {
  span: 24,
  id: "receiptPaymentBankAccount",
  label: "收款账号：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_SEARCH_COL_2 = {
  span: 24,
  id: "receiptPaymentAccountName",
  label: "收款公司：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_SEARCH_COL_3 = {
  span: 24,
  id: "bankAccount",
  label: "对方账号：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_SEARCH_COL_4 = {
  span: 24,
  id: "accountName",
  label: "记账主体：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_SEARCH_COL_5 = {
  span: 24,
  id: "money",
  label: "金额：",
  placeholder: "--",
  type: "txt",
  render: (row) => {
    const { money, currencyCode } = row;
    return `${money ? money : 0}${currencyCode}`;
  },
};
const DIALOG_SEARCH_COL_6 = {
  span: 24,
  id: "customerId",
  label: "充值客户：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const DIALOG_SEARCH_COL_7 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
  rows: 3,
};

export const waterClaimDialogCols = () => {
  return {
    title: "充值认领",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      DIALOG_SEARCH_COL_1,
      DIALOG_SEARCH_COL_2,
      DIALOG_SEARCH_COL_3,
      DIALOG_SEARCH_COL_4,
      DIALOG_SEARCH_COL_5,
      DIALOG_SEARCH_COL_6,
      DIALOG_SEARCH_COL_7,
    ],
    formRules: {
      customerId: [{ required: true, message: `请选择客户`, trigger: "blur" }],
    },
  };
};
