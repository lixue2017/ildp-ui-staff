import {
  httpAllDealingCompanySelect,
  httpUserSelect,
  httpBusinessSalesmanSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";
import {
  SEARCH_SETTLEMENT_COL_1,
  SEARCH_SETTLEMENT_COL_2,
} from "@/views/settlementManage/components/comModel.js";
import { postTaskByList } from "@/api/settlementManage/statementManage";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "billNo",
  label: "财务单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 2000,
  residueCol: 2,
};
const SEARCH_COL_3 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 2000,
  residueCol: 2,
};
const SEARCH_COL_4 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  ...httpAllDealingCompanySelect({ clientIdentity: "0,1,2,3,4,9" }),
};
const SEARCH_COL_5 = {
  id: "statusList",
  label: "账单状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "soaStatus",
  multiple: true,
  hideList: [30],
};
const SEARCH_COL_6 = {
  id: "accountingStatusList",
  label: "核销状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "verificationStatus",
};
const SEARCH_COL_7 = {
  id: "taskBy",
  label: "默认审核人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const SEARCH_COL_8 = {
  id: "createBy",
  label: "创建人：",
  placeholder: "请选择",
  ...httpUserSelect(),
  defaultProp: {
    //这里要传中文字符串搜索
    value: "userName",
    label: "userName,nickName",
  },
};
const SEARCH_COL_9 = {
  id: "invoiceNo",
  label: "关联发票号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "settleType",
  label: "结算方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "accountCycle",
};
const SEARCH_COL_11 = {
  id: "businessCompany",
  label: "记账主体：",
  selectLabelKey: "businessCompanyName",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_12 = {
  ...SEARCH_SETTLEMENT_COL_1,
  id: "currencyId",
};
const SEARCH_COL_13 = {
  id: "bankReceiptNo",
  label: "关联水单号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_14 = {
  id: "settleModel",
  label: "结算模式：",
  placeholder: "请选择",
  type: "select",
  basicType: "settleModel",
};
const SEARCH_COL_15 = {
  id: "bankReceiptState",
  label: "水单认领：",
  placeholder: "请选择",
  type: "select",
  basicType: "trueOrFalse",
};

const searchColumns = (row = {}) => {
  const { activeName, type } = row;
  return {
    0: [
      //应付对账单
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_1,
                  SEARCH_COL_4,
                  SEARCH_COL_2,
                  ...(activeName == 2 ? [] : [SEARCH_COL_5]),
                  SEARCH_COL_7,
                  ...(activeName == 2
                    ? [SEARCH_COL_9, SEARCH_COL_3]
                    : [SEARCH_COL_3, SEARCH_COL_9]),
                  SEARCH_COL_13,
                  SEARCH_COL_12,
                  SEARCH_SETTLEMENT_COL_2,
                  SEARCH_COL_8,
                  SEARCH_COL_10,
                  SEARCH_COL_11,
                  SEARCH_COL_15,
                ],
              },
            ],
          },
        ],
      },
    ],
    1: [
      //应收对账单
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_1,
                  SEARCH_COL_4,
                  SEARCH_COL_2,
                  ...(activeName == 2 ? [] : [SEARCH_COL_5]),
                  SEARCH_COL_7,
                  ...(activeName == 2
                    ? [SEARCH_COL_9, SEARCH_COL_3]
                    : [SEARCH_COL_3, SEARCH_COL_9]),
                  SEARCH_COL_13,
                  SEARCH_COL_12,
                  SEARCH_SETTLEMENT_COL_2,
                  SEARCH_COL_8,
                  SEARCH_COL_10,
                  SEARCH_COL_11,
                  SEARCH_COL_14,
                ],
              },
            ],
          },
        ],
      },
    ],
  }[type];
};
const TABLE_COL_1 = {
  prop: "billNo",
  label: "财务单号",
  columnLink: true,
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
  minWidth: 120,
};
const TABLE_COL_3 = {
  prop: "settleType",
  label: "结算方式",
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
  minWidth: 100,
  basicType: "accountCycle",
};
const TABLE_COL_4 = {
  prop: "billNum",
  label: "账单数",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  align: "right",
};
const TABLE_COL_5 = {
  prop: "orderNo",
  label: "工作单号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  align: "left",
};
const TABLE_COL_6 = {
  prop: "salesmanName",
  label: "默认审核人",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 110,
  align: "left",
};
const TABLE_COL_7 = {
  prop: "convertBaseMoney",
  label: "金额",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  align: "right",
  decimal: 2,
};
const TABLE_COL_8 = {
  prop: "currencyCode",
  label: "币别",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 80,
  align: "left",
};
const TABLE_COL_9 = {
  prop: "lastPayTime",
  label: "最晚收付日",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  align: "left",
};

const TABLE_COL_10 = {
  prop: "payType",
  label: "收付款方式",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  basicType: "RVPType",
  align: "left",
};
const TABLE_COL_11 = {
  prop: "invoiceNo",
  label: "关联发票号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COL_12 = {
  prop: "rejectNum",
  label: "打回次数",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  align: "right",
};
const TABLE_COL_13 = {
  prop: "checkBy",
  label: "审核人",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  align: "left",
};
const TABLE_COL_14 = {
  prop: "checkTime",
  label: "审核时间",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 140,
  align: "left",
};
const TABLE_COL_15 = {
  prop: "createTime",
  label: "创建时间",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 160,
  align: "left",
};
const TABLE_COL_16 = {
  prop: "createBy",
  label: "创建人",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  align: "left",
};
const TABLE_COL_17 = {
  prop: "taskByName",
  label: "任务所属人",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  align: "left",
};
const TABLE_COL_18 = {
  prop: "businessCompanyName",
  label: "记账主体",
  showOverflowTooltip: true,
  minWidth: 150,
  sortable: true,
  align: "left",
};
const TABLE_COL_19 = {
  prop: "accountingStatus",
  label: "核销状态",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  basicType: "verificationStatus",
  align: "left",
  // fixed: "right"
};
const TABLE_COL_20 = {
  prop: "status",
  label: "状态",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  dotColor: true,
  basicType: "soaStatus",
  align: "left",
  fixed: "right",
};

const TABLE_COL_22 = {
  prop: "accountingTime",
  label: "核销时间",
  showOverflowTooltip: true,
  minWidth: 160,
  sortable: true,
};
const TABLE_COL_23 = {
  ...TABLE_COL_11,
  prop: "checkNo",
};
const TABLE_COL_24 = {
  prop: "verificationMoney",
  label: "已核销金额",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
};
const TABLE_COL_25 = {
  prop: "serialCode",
  label: "已核销流水号",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true,
};
const TABLE_COL_26 = {
  prop: "joinBillNo",
  label: "关联对账单",
  showOverflowTooltip: true,
  columnLink: true,
  minWidth: 130,
  sortable: true,
};
const TABLE_COL_27 = {
  prop: "invoiceMoney",
  label: "开票金额",
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 2,
  align: "right",
  sortable: true,
};
const TABLE_COL_28 = {
  prop: "invoiceWater",
  label: "发票流水号",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
};
const TABLE_COL_29 = {
  prop: "invoiceStatus",

  label: "全部开票",
  showOverflowTooltip: true,
  minWidth: 100,
  fontColor: true,
  basicType: "billInvoiceStatus",
  fixed: "right",
};
const TABLE_COL_30 = {
  prop: "verificationStatus",
  label: "全部核销",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  // fixed: "right",
};
const TABLE_COL_31 = {
  prop: "billSubtotal",
  label: "明细小计",
  decimal: 2,
  colFormat: "thousandthMark",
  align: "left",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
};
const TABLE_COL_32 = {
  prop: "verificationSubtotal",
  label: "已核销小计",
  decimal: 2,
  colFormat: "thousandthMark",
  align: "left",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
};
const TABLE_COL_33 = {
  prop: "invoiceSubtotal",
  label: "已开票小计",
  decimal: 2,
  colFormat: "thousandthMark",
  align: "left",
  showOverflowTooltip: true,
  minWidth: 140,
  sortable: true,
};
const TABLE_COL_34 = {
  prop: "bankReceiptNo",
  label: "关联水单号",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true,
};
const TABLE_COL_35 = {
  prop: "settleModel",
  label: "结算模式",
  showOverflowTooltip: true,
  minWidth: 100,
  basicType: "settleModel",
  align: "center",
  fontColor: true,
  sortable: true,
};
const TABLE_COL_36 = {
  prop: "bankReceiptState",
  label: "水单认领",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
  fontColor: true,
  basicType: "trueOrFalse",
  // fixed: "right",
};
const TABLE_COL_37 = {
  prop: "invoiceInfo",
  label: "本次开票信息",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_99 = {
  prop: "operation",
  label: "操作",
  width: 150,
  columnOperation: true,
  fixed: "right",
};

const tableColumns = {
  collectionLists: [
    //应收对账单
    {
      type: "selection",
      width: 50,
      align: "center",
      fixed: "left",
    },
    {
      type: "index",
      width: 50,
      align: "center",
      fixed: "left",
    },
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_35,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_31,
    TABLE_COL_8,
    TABLE_COL_25,
    {
      ...TABLE_COL_32,
      labelTop: "已核销小计",
      labelBottom: "(包含核销中)",
      headerTopBottom: true,
    },
    TABLE_COL_33,
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_28,
    TABLE_COL_11,
    TABLE_COL_34,
    TABLE_COL_26,
    // TABLE_COL_12,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
    TABLE_COL_18,
    TABLE_COL_22,
    TABLE_COL_19, //核销状态
    TABLE_COL_30,
    TABLE_COL_37, //本次开票信息
    TABLE_COL_20,
    TABLE_COL_29,
    TABLE_COL_99,
  ],
  payMentLists: [
    //应付对账单
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
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_31,
    TABLE_COL_8,
    TABLE_COL_25,
    TABLE_COL_32,
    TABLE_COL_33,
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_28,
    TABLE_COL_23,
    TABLE_COL_34,
    TABLE_COL_26,
    // TABLE_COL_12,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
    TABLE_COL_18,
    TABLE_COL_22,
    TABLE_COL_19, //核销状态
    TABLE_COL_30,
    TABLE_COL_36,
    TABLE_COL_20,
    {
      ...TABLE_COL_99,
      columnMoreOperation: true,
      minWidth: 165,
    },
  ],
};

/** 应收、应付对账单列表有引用 */
export const operationBtn = [
  {
    text: "提交",
    type: "submit",
    statusBtnArr: [0, 4],
  },
  {
    text: "修改",
    type: "edit",
    statusBtnArr: [0, 4],
  },
  {
    text: "删除",
    type: "delete",
    color: "#FF6767",
    statusBtnArr: [0, 4],
  },
  {
    text: "撤销提交",
    type: "cancelSubmit",
    statusBtnArr: [1],
  },
  {
    text: "修改审核人",
    type: "editReviewedBy",
    statusBtnArr: [1],
  },
  {
    text: "修改发票号",
    type: "editInvoice",
    statusBtnArr: [1, 2, 11, 20, 30],
    isJoinBs: [0],
    isType: [0, "0"],
    hasPermission: ["settlementManagement:invoice:numEdit"],
  },
  {
    text: "水单认领",
    type: "paymentReceiptClaim",
    statusBtnArr: [20, 30],
    isBankReceiptState: [0],
    isType: [0, "0"],
    // hasPermission: ["settlementManagement:payment:waterBillClaim"],
  },
  {
    text: "取消认领",
    type: "paymentCancelReceiptClaim",
    serialStausArr: [80, 100],
    isBankReceiptState: [1],
    isType: [0, "0"],
    // hasPermission: ["settlementManagement:payment:cancelWaterBillClaim"],
  },
];

export { searchColumns, tableColumns };

export const changeReviewedCols = () => {
  return {
    title: "修改审核人",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        id: "taskBy",
        selectLabelKey: "taskByName",
        label: "审核人：",
        placeholder: "请选择",
        ...httpBusinessSalesmanSelect({ httpRequest: postTaskByList }),
      },
    ],
    formRules: {
      taskBy: [{ required: true, message: "请选择审核人", trigger: "change" }],
    },
  };
};
