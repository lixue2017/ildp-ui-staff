import { httpLogisticsCustomerSelect } from "@/comModel/httpSelect";

const FORM_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_2 = {
  id: "byMonth",
  label: "对应月份：",
  placeholder: "--年--月",
  type: "month",
  valueFormat: "yyyy-MM",
};
const FORM_COLS_3 = {
  id: "currencyName",
  label: "货币名称：",
  placeholder: "货币名称",
  type: "text",
};
const FORM_COLS_4 = {
  id: "currencyCode",
  label: "货币代码：",
  placeholder: "货币代码",
  type: "text",
};
const FORM_COLS_5 = {
  id: "createBy",
  label: "创建人：",
  placeholder: "创建人",
  type: "text",
};
const FORM_COLS_6 = {
  id: "billingMain",
  label: "所属公司：",
  isDefaultSelectVal: true,
  currData: true,
  ...httpLogisticsCustomerSelect(),
  type: "slot",
};

const searchColumns = [
  {
    className: "search-form-width",
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COLS_1,
              FORM_COLS_2,
              FORM_COLS_6,
              FORM_COLS_3,
              FORM_COLS_4,
              FORM_COLS_5,
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COLS_1 = {
  prop: "currencyName",
  label: "货币名称",
  showOverflowTooltip: true,
  sortable: true,
  width: 100,
  align: "left",
};
const TABLE_COLS_2 = {
  prop: "currencyCode",
  label: "货币代码",
  showOverflowTooltip: true,
  sortable: true,
  width: 100,
  align: "center",
};
const TABLE_COLS_3 = {
  prop: "currencySymbol",
  label: "货币符号",
  showOverflowTooltip: true,
  sortable: true,
  width: 100,
  align: "center",
};
const TABLE_COLS_4 = {
  prop: "funCurrencyCost",
  label: "本位币汇率",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  className: "head-blue",
  decimal: 10,
};
const TABLE_COLS_5 = {
  prop: "auxCurrencyCost",
  label: "辅助币汇率",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  align: "right",
  className: "head-blue",
  decimal: 10,
};
const TABLE_COLS_6 = {
  prop: "funCurrencyInvoice",
  label: "发票本位币汇率",
  minWidth: 140,
  sortable: true,
  align: "right",
  className: "head-orange",
  decimal: 10,
};
const TABLE_COLS_7 = {
  prop: "auxCurrencyInvoice",
  label: "发票辅助币汇率",
  minWidth: 140,
  sortable: true,
  align: "right",
  className: "head-orange",
  decimal: 10,
};
const TABLE_COLS_8 = {
  prop: "byMonth",
  label: "对应月份",
  showOverflowTooltip: true,
  sortable: true,
  width: 98,
  align: "left",
};
const TABLE_COLS_9 = {
  prop: "effectTime",
  label: "生效时间",
  showOverflowTooltip: true,
  sortable: true,
  width: 98,
  align: "left",
};
const TABLE_COLS_10 = {
  prop: "failureTime",
  label: "失效时间",
  showOverflowTooltip: true,
  sortable: true,
  width: 98,
  align: "left",
};
const TABLE_COLS_11 = {
  prop: "updateBy",
  label: "创建人",
  width: 100,
  fixed: "right",
  sortable: true,
  align: "left",
  render: (row) => {
    const { updateBy, createBy } = row;
    return updateBy || createBy || "--";
  },
};

const TABLE_COLS_12 = {
  prop: "updateTime",
  label: "创建时间",
  width: 150,
  fixed: "right",
  sortable: true,
  align: "left",
  render: (row) => {
    const { updateTime, createTime } = row;
    return updateTime || createTime || "--";
  },
};

const TABLE_COLS_13 = {
  prop: "funCurrencyVoucher",
  label: "凭证汇率",
  width: 140,
  sortable: true,
  align: "right",
  className: "head-orange",
  decimal: 10,
};
const TABLE_COLS_14 = {
  prop: "customerName",
  label: "公司",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "currencyList",
  label: "币别",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => {
    const { currencyList } = row;
    const str = (currencyList.map((e) => e.currencyCode) || []).join(",");
    return str;
  },
};
const TABLE_COLS_16 = {
  prop: "convertCurrencyList",
  label: "折合币别",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => {
    const { convertCurrencyList } = row;
    const str = (convertCurrencyList.map((e) => e.currencyCode) || []).join(
      ","
    );
    return str;
  },
};
const TABLE_COLS_17 = {
  prop: "businessModel",
  labelTop: "业务模块",
  labelBottom: "(费用汇总-记账主体)",
  minWidth: 100,
  fontColor: true,
  headerTopBottom: true,
  align: "center",
  basicType: "trueOrFalse",
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  prop: "tabList",
  label: "适配报表",
  minWidth: 300,
  showOverflowTooltip: true,
  render: (row) => {
    const { tabList } = row;
    const str = (tabList.map((e) => e.tabName) || []).join(",");
    return str;
  },
};
const TABLE_COLS_19 = {
  prop: "funCurrencyVoucher",
  label: "凭证汇率",
  minWidth: 140,
  sortable: true,
  align: "right",
  className: "head-orange",
  decimal: 10,
};

const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true, //MODEL中的配置
  minWidth: 120,
  fixed: "right",
};
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_19,
  // TABLE_COLS_13,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
];

const currentTableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_OPERATION,
];

export { searchColumns, tableColumns, currentTableColumns };
