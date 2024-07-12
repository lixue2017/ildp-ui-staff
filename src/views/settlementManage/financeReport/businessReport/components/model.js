import {
  httpLogisticsCustomerSelect,
  httpBusinessSalesmanSelect,
  httpLogisticsCompanySelect,
  httpSalesmanSelect,
} from "@/comModel/httpSelect.js";
import { formatMoney } from "@/utils/index";
import {
  getECSalesman,
  getTraditionSalesman,
} from "@/api/settlementManage/paymentReceived.js";
const CLEARANCE_TYPE = ["海运操作单", "空运操作单", "其他操作单"];

const SEARCH_COLS_1 = {
  id: "oDate",
  label: "费用日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy/MM/dd",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  },
};
const SEARCH_COLS_2 = {
  id: "customerId",
  label: "公司：",
  ...httpLogisticsCustomerSelect(),
  selectLabelKey: "customerName",
  // isDefaultSelectVal: true,
};
const SEARCH_COLS_3 = (httpRequest) => ({
  // id: "salesmanIds",
  label: "业务员：",
  // ...httpBusinessSalesmanSelect({ httpRequest }),
  id: "salesmanId",
  ...httpSalesmanSelect(),
  type: "slot",
  // multiple: true,
  // collapseTags: true,
});
const SEARCH_COLS_4 = {
  id: "dealingsCompanyId",
  label: "客户：",
  ...httpLogisticsCompanySelect(),
  type: "slot",
};
const SEARCH_COLS_5 = {
  id: "accountingStatus",
  label: "是否收款：",
  type: "select",
  placeholder: "请选择",
  basicType: "trueOrFalse",
};
const searchFormCols = (obj) => {
  const { customerHandle, salesmanHandle, type } = obj || {};
  const httpRequest = {
    ec: getECSalesman,
    tradition: getTraditionSalesman,
  };
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...SEARCH_COLS_1,
                  // handleTimeChange: customerHandle,
                },
                {
                  ...SEARCH_COLS_2,
                  handle: customerHandle,
                },
                {
                  ...SEARCH_COLS_3(httpRequest[type]),
                  handle: salesmanHandle,
                },
                SEARCH_COLS_4,
                SEARCH_COLS_5,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const formRules = {
  // oDate: [
  //   { required: true, message: "请选择费用日期", trigger: "change" },
  // ],
  customerId: [{ required: true, message: "请选择公司", trigger: "change" }],
}; // 表单校验规则

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  defaultExpandShow: true,
  width: 1,
};
const TABLE_COLS_1 = {
  label: "下单日期",
  prop: "placeOrderDate",
  width: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  label: "工作号",
  prop: "orderNo",
  width: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  label: "ZJB单号",
  prop: "mainOrderNo",
  width: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  label: "FBAID",
  prop: "sono",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  label: "目的港",
  prop: "destination",
  width: 160,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  label: "电商渠道",
  prop: "channleNames",
  width: 160,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  label: "品名",
  prop: "productNames",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  label: "件数",
  prop: "packages",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  align: "center",
};
const TABLE_COLS_9 = {
  label: "CBM",
  prop: "cbms",
  width: 100,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COLS_10 = {
  label: "KGS",
  prop: "kgs",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  className: "border-right",
};
const TABLE_COLS_11 = {
  label: "RMB",
  prop: "moneyRMB",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COLS_12 = {
  label: "USD",
  prop: "moneyUSD",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COLS_13 = {
  label: "HKD",
  prop: "moneyHKD",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COLS_14 = {
  label: "EUR",
  prop: "moneyEUR",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COLS_15 = {
  label: "GBP",
  prop: "moneyGBP",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
  className: "border-right",
};
const TABLE_COLS_16 = (rows = []) => {
  const list = getTableCurrency(rows, { parentProp: "moneyList" });
  return {
    prop: "moneyList",
    label: "总金额",
    multiHeader: true,
    className: "border-right",
    list,
  };
};
const TABLE_COLS_17 = {
  label: "业务类型",
  prop: "operationOrderType",
  width: 100,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
  render: (row) => CLEARANCE_TYPE[row.operationOrderType] || "--",
};
const TABLE_COLS_18 = {
  label: "ETD",
  prop: "etaTime",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  label: "柜型柜量",
  prop: "cabinetTypeQuantity",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  label: "柜号",
  prop: "ontainerSno",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_21 = {
  label: "业务员",
  prop: "salesmanName",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  label: "起运港",
  prop: "startPort",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  label: "国内交货仓",
  prop: "transactionWarehouseName",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_24 = {
  label: "国内入仓时间",
  prop: "putWarehouseTime",
  width: 123,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_25 = {
  labelTop: "预计离港",
  labelBottom: "实际离港时间",
  headerTopBottom: true,
  prop: "etdTime",
  width: 123,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_26 = {
  labelTop: "预计到港",
  labelBottom: "实际到港时间",
  headerTopBottom: true,
  prop: "etaTime",
  width: 123,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_27 = {
  label: "对账单号",
  prop: "billNo",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_28 = {
  label: "头程运输方式",
  prop: "headTransportModeName",
  width: 126,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_29 = {
  label: "尾程运输方式",
  prop: "outWarehouseWayName",
  width: 126,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_30 = {
  label: "客户单号",
  prop: "cusOrderNumber",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_98 =(rows=[],item={}) => {
  const {parentProp,parentLabel}=item
  let list=rows.map((e)=>{
    return {
      label: e.currencyCode,
      prop: e.currencyCode,
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: 'border-right',
      render:(row)=>{
        return formatMoney((row[parentProp]&&row[parentProp][e.currencyCode])||row[e.currencyCode]||0,2)
      }
    }
  })
  return {
    prop: parentProp,
    label: parentLabel,
    multiHeader: true,
    className: "border-right",
    list,
  };
};
export const tableColumns = (row={}) => {
  const {currencyList}=row
  const TABLE_MONEYLIST = TABLE_COLS_98(currencyList, {
    parentProp: "moneyList",
    parentLabel: "总金额",
  });
  return [
    TABLE_COLS_INDEX,
    TABLE_COLS_EXPAND,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_30,
    TABLE_COLS_27,
    TABLE_COLS_28,
    TABLE_COLS_29,
    TABLE_COLS_4,
    TABLE_COLS_23,
    TABLE_COLS_24,
    TABLE_COLS_25,
    {
      ...TABLE_COLS_5,
      label: "目的仓",
    },
    TABLE_COLS_26,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_9,
    TABLE_COLS_10,
    TABLE_MONEYLIST,
    TABLE_COLS_21,
  ];
};

// export const tableColumns = (rows = []) => {
//   return [
//     TABLE_COLS_INDEX,
//     TABLE_COLS_EXPAND,
//     TABLE_COLS_1,
//     TABLE_COLS_2,
//     TABLE_COLS_30,
//     TABLE_COLS_27,
//     TABLE_COLS_28,
//     TABLE_COLS_29,
//     TABLE_COLS_4,
//     TABLE_COLS_23,
//     TABLE_COLS_24,
//     TABLE_COLS_25,
//     {
//       ...TABLE_COLS_5,
//       label: "目的仓",
//     },
//     TABLE_COLS_26,
//     TABLE_COLS_7,
//     TABLE_COLS_8,
//     TABLE_COLS_9,
//     TABLE_COLS_10,
//     TABLE_COLS_16(rows),
//     TABLE_COLS_21,
//   ];
// };


export const tableColumns_tradition = (row={})=>{
  const {currencyList}=row
  const TABLE_MONEYLIST = TABLE_COLS_98(currencyList, {
    parentProp: "moneyList",
    parentLabel: "总金额",
  });
  return [
    TABLE_COLS_INDEX,
    TABLE_COLS_EXPAND,
    {
      ...TABLE_COLS_1,
      label: "发货日期",
    },
    TABLE_COLS_2,
    TABLE_COLS_27,
    TABLE_COLS_17,
    TABLE_COLS_22,
    TABLE_COLS_25,
    TABLE_COLS_5,
    TABLE_COLS_26,
    TABLE_COLS_19,
    TABLE_COLS_20,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_9,
    TABLE_COLS_10,
    TABLE_MONEYLIST,
    TABLE_COLS_21,
  ];
}


// export const tableColumns_tradition = (rows = []) => {
//   return [
//     TABLE_COLS_INDEX,
//     TABLE_COLS_EXPAND,
//     {
//       ...TABLE_COLS_1,
//       label: "发货日期",
//     },
//     TABLE_COLS_2,
//     TABLE_COLS_27,
//     TABLE_COLS_17,
//     TABLE_COLS_22,
//     // ...isEn ? [TABLE_COLS_22] : [],
//     TABLE_COLS_25,
//     TABLE_COLS_5,
//     TABLE_COLS_26,
//     // TABLE_COLS_18,
//     TABLE_COLS_19,
//     TABLE_COLS_20,
//     TABLE_COLS_7,
//     TABLE_COLS_8,
//     TABLE_COLS_9,
//     TABLE_COLS_10,
//     TABLE_COLS_16(rows),
//     TABLE_COLS_21,
//   ];
// };
export { searchFormCols, formRules };

//月结对账单(电商/传统)
