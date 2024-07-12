import {
  httpLogisticsCustomerSelect,
  httpSalesmanSelect, httpLogisticsCompanySelect
} from '@/comModel/httpSelect.js';
import {getTableCurrency} from "@/utils/index.js"
import { formatMoney } from "@/utils/index";
const SEARCH_COL_1 = {
  id: "month",
  label: "统计月份：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "monthrange",
  valueFormat: "yyyy/MM"
}
const SEARCH_COL_2 = {
  id: "customerId",
  label: "公司：",
  selectLabelKey: "customerName",
  isDefaultSelectVal: true,
  ...httpLogisticsCustomerSelect()
}
const SEARCH_COL_3 = {
  id: "salesmanId",
  label: "业务员：",
  ...httpSalesmanSelect(),
  type: "slot"
}
const SEARCH_COL_4 = {
  id: "dealingsCompanyId",
  label: "往来单位：",
  ...httpLogisticsCompanySelect(),
  type: "slot"
}
const FORM_COLS_5 = {
  id: "businessType",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type: 'select',
  basicType: "settlementBusinessType",
  hideList: [2]
}
export const searchFormCols = (obj) => {
  const { customerHandle, salesmanHandle } = obj || {};
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_1,
                {
                  ...SEARCH_COL_2,
                  handle: customerHandle
                },
                {
                  ...SEARCH_COL_3,
                  handle: salesmanHandle
                },
                SEARCH_COL_4,
                FORM_COLS_5
              ],
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
  month: [
    { required: true, message: "请选择统计月份", trigger: "change" },
  ],
  customerId: [
    { required: true, message: "请选择公司", trigger: "change" },
  ]
} // 表单校验规则

const TABLE_COL_0 = {
  type: 'index',
  align: "center",
  width: 50
}
const TABLE_COL_1 = {
  prop: "orderNo",
  label: "工作单号",
  minWidth: 150,
  customRow: true,
  // sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  minWidth: 105,
  // sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "costName",
  label: "费用名称",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop: "totalMoney",
  label: "金额",
  minWidth: 105,
  // align: "right",
  showOverflowTooltip: true,
  decimal: 2
}
const TABLE_COL_6 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_7 = {
  prop: "billNo",
  label: "财务单号",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_8 = {
  prop: "routeBsNo",
  label: "订舱相关单号",
  minWidth: 125,
  showOverflowTooltip: true,
}
const TABLE_COL_9 = {
  prop: "businessTypeName",
  label: "业务类型",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_10 = {
  prop: "invoiceNo",
  label: "发票号",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_11 = {
  prop: "invoiceDate",
  label: "开票日期",
  minWidth: 105,
  showOverflowTooltip: true,
}





// export const tableTotleLists=(rows)=>{
//   const totalConfig=getTableCurrency(rows,{isTotal:true})
//   return totalConfig
// }

const TABLE_COLS_99 = (rows = []) => {
  const list = rows.map((e) => {
    return {
      label: e.currencyCode,
      prop: e.currencyCode,
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      render: (row) => {
        return formatMoney(row[e.currencyCode] || 0, 2);
      },
    };
  });
  return list;
};

export const tableTotleLists = (row = {}) => {
  //下方小计
  const { currencyList } = row;
  const TotalListConfig = TABLE_COLS_99(currencyList);
  const config = [
    {
      prop: "leftHeader",
      customRow: true,
      showOverflowTooltip: true,
    },
    ...TotalListConfig,
  ];
  return config;
};






// export const tableTotleLists = [
//   //汇总数据
//   {
//     prop: "leftHeader",
//     customRow: true,
//     showOverflowTooltip: true
//   },
//   {
//     label: "RMB",
//     prop: "RMB",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
//     showOverflowTooltip: true
//   },
//   {
//     label: "USD",
//     prop: "USD",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
//     showOverflowTooltip: true
//   },
//   {
//     label: "HKD",
//     prop: "HKD",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
//     showOverflowTooltip: true
//   },
//   {
//     label: "EUR",
//     prop: "EUR",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
//     showOverflowTooltip: true
//   },
//   {
//     label: "GBP",
//     prop: "GBP",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
//     showOverflowTooltip: true
//   },
// ]
const TABLE_COL_12 = {
  prop: "invoiceMaintainNum",
  label: "发票修改次数",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_13 = {
  prop: "invoiceMaintainRemark",
  label: "发票修改记录",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_14 = {
  prop: "vmoney",
  label: "核销金额",
  minWidth: 105,
  decimal:2,
  showOverflowTooltip: true,
}
const TABLE_COL_15 = {
  prop: "invoiceInfo",
  label: "本次开票信息",
  minWidth: 200,
  showOverflowTooltip: true,
}
export const tableColumns = [
  //成本往来单位明细表
  // TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_7,
  TABLE_COL_9,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_14,
  TABLE_COL_6,
  TABLE_COL_10,
  TABLE_COL_12,
  TABLE_COL_13
]

export const tableIncomeColumns = [
  //收入往来单位明细表
  // TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_15
]










