import {
  httpUserSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect.js";
import { getNotPaymentSalesman } from "@/api/settlementManage/paymentReceived";
import { toFixedNum } from "@/utils/instructions";
const paymentSalesmanSelect = () => {
  return {
    ...httpUserSelect(),
    httpRequest: (params) => {
      const { nameCn, salesman, ...nParams } = params;
      return getNotPaymentSalesman(nParams);
    },
  };
};
const SEARCH_COLS_1 = {
  id: "assessmentDate",
  label: "记账日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "slot",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "businessCompany",
  label: "所属公司：",
  selectLabelKey: "customerName",
  noClearable: true,
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COLS_3 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "业务员(多选)",
  ...paymentSalesmanSelect(),
  multiple: true,
  type: "slot",
};
const SEARCH_COLS_4 = (cusIde) => ({
  id: "tolType",
  label: "统计类型：",
  placeholder: "统计类型(多选)",
  multiple: true,
  type: "select",
  options: [
    {
      value: 1,
      label: cusIde === 2 ? "应收金额" : "应付金额",
    },
    {
      value: 2,
      label: cusIde === 2 ? "未收金额" : "未付金额",
    },
    ...(cusIde === 2
      ? [
          {
            value: 3,
            label: "超龄金额",
          },
        ]
      : []),
  ],
});
const SEARCH_COLS_5 = {
  id: "businessType",
  label: "业务类型：",
  placeholder: "业务类型",
  type: "select",
  basicType: "settlementBusinessType",
  hideList: [2],
};
const SEARCH_COLS_6 = {
  id: "settleType",
  label: "结算方式：",
  placeholder: "结算方式",
  type: "select",
  basicType: "accountCycle",
};
const SEARCH_COLS_7 = {
  id: "checkDate",
  label: "回款考核日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "slot",
  valueFormat: "yyyy-MM-dd",
};

const searchColumns = (cusIde) => [
  SEARCH_COLS_2,//所属公司
  SEARCH_COLS_3,//业务员
  SEARCH_COLS_4(cusIde),//统计类型
  SEARCH_COLS_1,//记账日期
  SEARCH_COLS_7,//考核日期
  SEARCH_COLS_5,//业务类型
  SEARCH_COLS_6,//结算方式
];

const formConfig = (cusIde) => ({
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns(cusIde),
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    assessmentDate: [
      { required: true, message: "请选择记账日期", trigger: "blur" },
    ],
    businessCompany: [
      { required: true, message: "请选择所属公司", trigger: "blur" },
    ],
  },
});
//校验修改集合
export const formRulesLists = {
  assessmentDate: [
    { required: true, message: "请选择记账日期", trigger: "change" },
  ],
  checkDate: [
    { required: true, message: "请选择回款考核日期", trigger: "change" },
  ],
};
const TABLE_COLS_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "customerName",
  label: "客户信息",
  minWidth: 140,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 100,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "currencyCode",
  label: "币别",
  align: "center",
  minWidth: 100,
  fixed: "left",
  showOverflowTooltip: true,
  className: "border-right",
};
const TABLE_COLS_4 = {
  prop: "collMoneyList",
  label: "应收金额",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "<=30天",
      prop: "collMoneyList1",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.collMoneyList ? toFixedNum(row.collMoneyList["<=30天"]) : "--",
    },
    {
      label: "31-60天",
      prop: "collMoneyList2",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.collMoneyList ? toFixedNum(row.collMoneyList["31-60天"]) : "--",
    },
    {
      label: "61-90天",
      prop: "collMoneyList3",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.collMoneyList ? toFixedNum(row.collMoneyList["61-90天"]) : "--",
    },
    {
      label: "91-120天",
      prop: "collMoneyList4",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.collMoneyList ? toFixedNum(row.collMoneyList["91-120天"]) : "--",
    },
    {
      label: ">120天",
      prop: "collMoneyList5",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.collMoneyList ? toFixedNum(row.collMoneyList[">120天"]) : "--",
    },
    {
      label: "小计",
      prop: "collMoneyList6",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      className: "border-right",
      align: "right",
      showOverflowTooltip: true,
      render: (row) =>
        row.collMoneyList ? toFixedNum(row.collMoneyList["小计"]) : "--",
    },
  ],
};
const TABLE_COLS_5 = {
  prop: "unCollMoneyList",
  label: "未收金额",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "<=30天",
      prop: "unCollMoneyList1",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.unCollMoneyList ? toFixedNum(row.unCollMoneyList["<=30天"]) : "--",
    },
    {
      label: "31-60天",
      prop: "unCollMoneyList2",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.unCollMoneyList ? toFixedNum(row.unCollMoneyList["31-60天"]) : "--",
    },
    {
      label: "61-90天",
      prop: "unCollMoneyList3",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.unCollMoneyList ? toFixedNum(row.unCollMoneyList["61-90天"]) : "--",
    },
    {
      label: "91-120天",
      prop: "unCollMoneyList4",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.unCollMoneyList
          ? toFixedNum(row.unCollMoneyList["91-120天"])
          : "--",
    },
    {
      label: ">120天",
      prop: "unCollMoneyList5",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.unCollMoneyList ? toFixedNum(row.unCollMoneyList[">120天"]) : "--",
    },
    {
      label: "小计",
      prop: "unCollMoneyList6",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      className: "border-right",
      align: "right",
      showOverflowTooltip: true,
      render: (row) =>
        row.unCollMoneyList ? toFixedNum(row.unCollMoneyList["小计"]) : "--",
    },
  ],
};
const TABLE_COLS_6 = {
  prop: "overageMoneyList",
  label: "超龄金额",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "<=30天",
      prop: "overageMoneyList1",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.overageMoneyList
          ? toFixedNum(row.overageMoneyList["<=30天"])
          : "--",
    },
    {
      label: "31-60天",
      prop: "overageMoneyList2",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.overageMoneyList
          ? toFixedNum(row.overageMoneyList["31-60天"])
          : "--",
    },
    {
      label: "61-90天",
      prop: "overageMoneyList3",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.overageMoneyList
          ? toFixedNum(row.overageMoneyList["61-90天"])
          : "--",
    },
    {
      label: "91-120天",
      prop: "overageMoneyList4",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.overageMoneyList
          ? toFixedNum(row.overageMoneyList["91-120天"])
          : "--",
    },
    {
      label: ">120天",
      prop: "overageMoneyList5",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
      showOverflowTooltip: true,
      render: (row) =>
        row.overageMoneyList
          ? toFixedNum(row.overageMoneyList[">120天"])
          : "--",
    },
    {
      label: "小计",
      prop: "overageMoneyList6",
      minWidth: 110,
      colFormat: "thousandthMark",
      decimal: 2,
      className: "border-right",
      align: "right",
      showOverflowTooltip: true,
      render: (row) =>
        row.overageMoneyList ? toFixedNum(row.overageMoneyList["小计"]) : "--",
    },
  ],
};
const TABLE_COLS_7 = {
  prop: "currencyCode",
  label: "合计",
  minWidth: 120,
  align: "center",
  fixed: "left",
  showOverflowTooltip: true,
  className: "border-right",
};
const TABLE_COLS_8 = {
  prop: "customerName",
  label: "服务商信息",
  minWidth: 140,
  fixed: "left",
  showOverflowTooltip: true,
};
// cusIde:客户身份(2:客户/3服务商)
const tableColumns = (cusIde, tolType) => [
  TABLE_COLS_INDEX,
  cusIde === 2 ? TABLE_COLS_1 : TABLE_COLS_8,
  TABLE_COLS_2,
  TABLE_COLS_3,
  ...(tolType || (cusIde === 2 ? [1, 2, 3] : [1, 2])).map(
    (k) =>
      [
        "",
        { ...TABLE_COLS_4, label: cusIde === 2 ? "应收金额" : "应付金额" },
        { ...TABLE_COLS_5, label: cusIde === 2 ? "未收金额" : "未付金额" },
        TABLE_COLS_6,
      ][k]
  ),
];

const totalTableColumns = (cusIde, tolType) => [
  TABLE_COLS_7,
  ...(tolType || (cusIde === 2 ? [1, 2, 3] : [1, 2])).map(
    (k) =>
      [
        "",
        { ...TABLE_COLS_4, label: cusIde === 2 ? "应收金额" : "应付金额" },
        { ...TABLE_COLS_5, label: cusIde === 2 ? "未收金额" : "未付金额" },
        TABLE_COLS_6,
      ][k]
  ),
];
export { formConfig, tableColumns, totalTableColumns };
