import {
  httpCustomerSelect,
  httpSalesmanSelect,
  httpAccountSelect,
  httpLogisticsCustomerSelect,
  httpAllDealingCompanySelect
} from "@/comModel/httpSelect.js";
import {
  getSalesmanMonth,
  logisticsSalesmanNew,
} from "@/api/settlementManage/paymentReceived.js";
import {getTableCurrency} from "@/utils/index.js"
import { formatMoney } from "@/utils/index";
const FORM_COLS_1 = {
  id: "createTime",
  label: "统计日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy/MM/dd",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
    },
  },
};
const FORM_COLS_2 = {
  id: "customerId",
  label: "所属公司：",
  placeholder: "请选择所属公司",
  // isBackAll: true,
  isAutoInitRequest: true,
  ...httpLogisticsCustomerSelect(),
  selectLabelKey: "customerName",
  // ...httpCustomerSelect({ clientIdentity: 0 })
};
const FORM_COLS_3 = {
  id: "accountId",
  label: "银行账号：",
  // isBackAll: true,
  ...httpAccountSelect({ type: 0 }),
  selectLabelKey: "accountName",
  type: "slot",
};
const FORM_COLS_4 = {
  id: "UNCHARTED_FORM_4",
  label: "公司名称：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_5 = {
  id: "UNCHARTED_FORM_5",
  label: "银行名称：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_6 = {
  id: "UNCHARTED_FORM_6",
  label: "银行账号：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_7 = {
  id: "UNCHARTED_FORM_7",
  label: "日期：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_8 = {
  id: "UNCHARTED_FORM_8",
  label: "制单人：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_9 = {
  id: "UNCHARTED_FORM_9",
  label: "制表日期：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_10 = {
  id: "monthBy",
  label: "统计月份：",
  // placeholder: "年/月",
  // type: "month",
  valueFormat: "yyyy/MM",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "monthrange",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
      // const date = new Date()
      // const year = date.getFullYear()
      // let month = date.getMonth() + 1
      // if (month >= 1 && month <= 9) {
      //   month = '0' + month
      // }
      // const currentDate = year.toString() + month.toString()
      // const timeYear = time.getFullYear()
      // let timeMonth = time.getMonth() + 1
      // if (timeMonth >= 1 && timeMonth <= 9) {
      //   timeMonth = '0' + timeMonth
      // }
      // const timeDate = timeYear.toString() + timeMonth.toString()
      // return timeDate >= currentDate
    },
  },
};
const FORM_COLS_11 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "选择业务员",
  type: "autocomplete",
  httpRequest: (row) => {
    return getSalesmanMonth(row);
  },
  defaultProp: {
    value: "userId",
    label: "userName,nickName",
  },
  type: "slot",
};

const FORM_COLS_12 = {
  id: "otype",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type: "select",
  basicType: "reportOrderBusType",
  hideList: [2],
};
const FORM_COLS_13 = {
  id: "isV",
  label: "核销状态：",
  placeholder: "核销状态",
  type: "select",
  options: [
    {
      label: "待核销",
      value: 0,
    },
    {
      label: "已核销",
      value: 1,
    },
  ],
};

const FORM_COLS_14 = {
  id: "dfAccountName",
  label: "银行系统名称：",
  placeholder: "请输入银行系统名称",
  type:'text'
};

const FORM_COLS_15 = {
  id: "dealingsCompanyObj",
  label: "往来单位：",
  placeholder: "往来单位",
  isBackAll:true,
  ...httpAllDealingCompanySelect()
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "customerName",
  label: "公司名称",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "openingBank",
  label: "银行名称",
  sortable: true,
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "bankAccount",
  label: "账号",
  sortable: true,
  width: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "orderNo",
  label: "工作单号",
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  width: 120,
};
const TABLE_COLS_5 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  sortable: true,
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "costName",
  label: "费用名称",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 80,
  sortable: true,
  showOverflowTooltip: true,
  align: "center",
};
const TABLE_COLS_8 = {
  prop: "totalMoney",
  label: "费用金额",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 2,
};
const TABLE_COLS_9 = {
  prop: "applyMoney",
  label: "已核销金额",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 2,
};
const TABLE_COLS_10 = {
  prop: "type",
  label: "应收应付",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "billType",
  align: "center",
};
const TABLE_COLS_11 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  width: 100,
};
const TABLE_COLS_12 = {
  prop: "customerName",
  label: "客户名称",
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  width: 100,
};
const TABLE_COLS_13 = {
  prop: "sailOpenTime",
  label: "开航日期",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COLS_14 = {
  prop: "reachTime",
  label: "到达日期",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COLS_15 = {
  prop: "fullSailOpenTime",
  label: "应收日期",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COLS_16 = {
  prop: "fullReachTime",
  label: "实收日期",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
  className: "border-right",
};

const TABLE_COLS_17 =(rows=[]) => {
  const collListConfig =getTableCurrency(rows,{parentProp:"collList"});
  return {
    prop: "collList",
    label: "应收",
    multiHeader: true,
    className: "border-right",
    list: collListConfig,
  };
};
const TABLE_COLS_18 = (rows=[]) => {
  const payListConfig = getTableCurrency(rows,{parentProp:"payList"});
  return {
    prop: "payList",
    label: "应付",
    multiHeader: true,
    className: "border-right",
    list: payListConfig,
  };
};
const TABLE_COLS_19 = (rows=[]) => {
  const proListConfig = getTableCurrency(rows,{parentProp:"proList"});
  return {
    prop: "proList",
    label: "利润",
    multiHeader: true,
    className: "border-right",
    list: [
      ...proListConfig,
      {
        label: "折RMB",
        prop: "equivalentProfitRMB",
        width: 130,
        sortable: true,
        align: "right",
        render:(row)=>{
          const { RMB }=row.equList||{}
          return formatMoney( RMB || 0 , 2)
        }
      },
      {
        label: "折USD",
        prop: "equivalentProfitUSD",
        width: 130,
        sortable: true,
        className: "border-right",
        align: "right",
        render:(row)=>{
          const { USD }=row.equList||{}
          return formatMoney( USD || 0 , 2 )
        }
      },
    ],
  };
};

const TABLE_COLS_20 = {
  prop: "applyCurrencyCode",
  label: "核销币别",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  align: "center",
};
const TABLE_COLS_21 = {
  prop: "wholeCabinetSn",
  label: "国内登记号",
  sortable: true,
  showOverflowTooltip: true,
  width: 120,
  fixed: "left",
};
const TABLE_COLS_22 = {
  prop: "otype",
  label: "业务类型",
  sortable: true,
  showOverflowTooltip: true,
  width: 120,
  basicType: "reportOrderBusType",
  fixed: "left",
};
const TABLE_COLS_23 = {
  prop: "bankReceiptNo",
  label: "水单号",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 140,
  fixed: "left",
};
const TABLE_COLS_24 = {
  prop: "dealDate",
  label: "交易日期",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
  fixed: "left",
};
const TABLE_COLS_25 = {
  prop: "amountCollection",
  label: "收款",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "币别",
      prop: "ccCode",
      width: 120,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "金额",
      prop: "ctMoney",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "余额",
      prop: "cssMoney",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
    },
  ],
};
const TABLE_COLS_26 = {
  prop: "amountPayment",
  label: "付款",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "币别",
      prop: "pcCode",
      width: 120,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "金额",
      prop: "ptMoney",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "余额",
      prop: "pssMoney",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
      className: "border-right",
    },
  ],
};
const TABLE_COLS_27 = {
  prop: "isV",
  label: "是否核销",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
  yesOrNo: true,
};
const TABLE_COLS_28 = {
  prop: "zhaiyao",
  label: "摘要",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_29 = {
  prop: "title",
  label: "",
  showOverflowTooltip: true,
  width: 120,
  className: "border-right",
  align: "right",
};
const TABLE_COLS_30 = {
  prop: "collSubtotal",
  label: "收款",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "RMB",
      prop: "coll_rmb",
      width: 120,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "USD",
      prop: "coll_usd",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "HKD",
      prop: "coll_hkd",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "EUR",
      prop: "coll_eur",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "GBP",
      prop: "coll_gbp",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      className: "border-right",
      align: "right",
    },
  ],
};
const TABLE_COLS_31 = {
  prop: "paySubtotal",
  label: "付款",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "RMB",
      prop: "pay_rmb",
      width: 120,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "USD",
      prop: "pay_usd",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "HKD",
      prop: "pay_hkd",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "EUR",
      prop: "pay_eur",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      align: "right",
    },
    {
      label: "GBP",
      prop: "pay_gbp",
      width: 130,
      sortable: true,
      colFormat: "thousandthMark",
      decimal: 2,
      className: "border-right",
      align: "right",
    },
  ],
};
const TABLE_COLS_32 = {
  prop: "dfAccountName",
  label: "银行系统名称",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_33 = {
  prop: "subtotal",
  label: "当日小计",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 120,
};
const TABLE_COLS_34 = {
  prop: "surplus",
  label: "账户结余",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 120,
};
const paymentReceivedDetailForm = (handleFunc) => {
  //收付款明细表FORM列表
  const { customerIdHandle } = handleFunc;
  return [
    FORM_COLS_1,
    {
      ...FORM_COLS_2,
      handle: customerIdHandle,
    },
    FORM_COLS_3,
    FORM_COLS_13,
    FORM_COLS_14,
    FORM_COLS_15
  ];
};
const TABLE_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  defaultExpandShow: true,
  width: 50,
  list: [
    TABLE_COLS_INDEX,
    TABLE_COLS_23, // 水单号
    TABLE_COLS_24, // 交易日期
    TABLE_COLS_1, //公司名称
    TABLE_COLS_2, //银行名称
    TABLE_COLS_3, //账号
    {
      ...TABLE_COLS_5,
      className: "border-right",
    }, //往来单位
    TABLE_COLS_25, // 收款
    TABLE_COLS_26, // 付款
    TABLE_COLS_27, // 是否核销
    TABLE_COLS_28, // 摘要
  ],
};
export const paymentReceivedDetailTable = [
  //收付款明细表TABLE列表
  // TABLE_COLS_EXPAND,
  TABLE_COLS_23, // 水单号
  TABLE_COLS_24, // 交易日期
  TABLE_COLS_1, //公司名称
  TABLE_COLS_2, //银行名称
  TABLE_COLS_32,
  TABLE_COLS_3, //账号
  {
    ...TABLE_COLS_5,
    className: "border-right",
  }, //往来单位
  TABLE_COLS_25, // 收款
  TABLE_COLS_26, // 付款
  TABLE_COLS_27, // 是否核销
  TABLE_COLS_33,//当日小计
  TABLE_COLS_34,//账户结余
  TABLE_COLS_28, // 摘要
];
export const paymentReceivedDetailTotal = [
  TABLE_COLS_29,
  TABLE_COLS_30,
  TABLE_COLS_31,
];

const monthlyBusinessProfitForm = (handleFunc) => {
  //月利润统计表
  const { customerIdHandle, monthByHandle } = handleFunc;
  return [
    {
      ...FORM_COLS_10,
      handleTimeChange: monthByHandle,
      span:5
    },
    {
      id: "customerId",
      label: "公司：",
      ...httpLogisticsCustomerSelect(),
      handle: customerIdHandle,
      selectLabelKey: "customerName",
      span:5
    },
    {
      id: "salesman",
      label: "业务员：",
      ...httpSalesmanSelect({
        httpRequest: logisticsSalesmanNew,
      }),
      type: "slot",
      span:5
    },
    {
      id: "orderNo",
      label: "工作单号：",
      placeholder: "请输入",
      type: "text",
      span:9
    },
    {
      ...FORM_COLS_12,
      span:5
    },
  ];
};






const TABLE_COLS_98 =(rows=[],item={}) => {
  const {parentProp,parentLabel,isEquivalent}=item
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
  if(isEquivalent){
    list=[
      ...list,
      {
        label: "折RMB",
        prop: "equivalentProfitRMB",
        width: 130,
        sortable: true,
        align: "right",
        render:(row)=>{
          const { RMB }=row.equList||{}
          return formatMoney( RMB || 0 , 2)
        }
      },
      {
        label: "折USD",
        prop: "equivalentProfitUSD",
        width: 130,
        sortable: true,
        className: "border-right",
        align: "right",
        render:(row)=>{
          const { USD }=row.equList||{}
          return formatMoney( USD || 0 , 2 )
        }
      },
    ]
  }
  return {
    prop: parentProp,
    label: parentLabel,
    multiHeader: true,
    className: "border-right",
    list,
  };
};
export const publicTableConfig=(row={})=>{
  //表格
  //monthSourceType==MonthlyBusinessProfit(月利润统计表)    MonthlyBusinessProfitUK（月利润统计表英国分润）
  const {currencyList,monthSourceType}=row
  const TABLE_COLLLIST=TABLE_COLS_98(currencyList,{parentProp:'collList',parentLabel:'应收'})//应收
  const TABLE_PAYLIST=TABLE_COLS_98(currencyList,{parentProp:'payList',parentLabel:'应付'})//应付
  const TABLE_PROLIST=TABLE_COLS_98(currencyList,{parentProp:'proList',parentLabel:'利润',isEquivalent:true})//利润
  let config={
    'MonthlyBusinessProfit':[
      TABLE_COLS_INDEX,
      TABLE_COLS_4,
      TABLE_COLS_11,
      TABLE_COLS_22,
      TABLE_COLS_12,
      TABLE_COLS_13,
      TABLE_COLS_14,
      TABLE_COLS_15,
      TABLE_COLS_16,
      TABLE_COLLLIST,
      TABLE_PAYLIST,
      TABLE_PROLIST
    ],
    'MonthlyBusinessProfitUK':[
      TABLE_COLS_INDEX,
      TABLE_COLS_4,
      TABLE_COLS_11,
      TABLE_COLS_22,
      TABLE_COLS_21,
      {
        ...TABLE_COLS_12,
        className: "border-right",
      },
      TABLE_COLLLIST,
      TABLE_PAYLIST,
      TABLE_PROLIST
    ]
  }[monthSourceType]
  return config
}


const TABLE_COLS_99 =(rows=[]) => {
  const list=rows.map((e)=>{
    return {
      label: e.currencyCode,
      prop: e.currencyCode,
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: 'border-right',
      render:(row)=>{
        return formatMoney(row[e.currencyCode]||0,2)
      }
    }
  })
  return list
};
export const publicTotalConfig=(row={})=>{
  //下方小计
  const {currencyList}=row
  const TotalListConfig=TABLE_COLS_99(currencyList)
  const config=[
    {
      prop: "leftHeader",
      customRow: true,
      showOverflowTooltip: true,
    },
    ...TotalListConfig
  ]
  return config

}
export const publicRulesConfig=(row={})=>{
  //列表必填搜索
  const {monthSourceType}=row
  const rules={
    'MonthlyBusinessProfit':{
      monthBy: [{ required: true, message: "请选择统计月份", trigger: "change" }],
      customerId: [{ required: true, message: "请选择公司", trigger: "change" }],
    },
    'MonthlyBusinessProfitUK':{
      monthBy: [{ required: true, message: "请选择统计月份", trigger: "change" }],
    }
  }[monthSourceType]
  return rules
}



// export const monthlyBusinessProfitConfig=(rows=[])=>{
//   return {
//     tableLists: [
//       TABLE_COLS_INDEX,
//       TABLE_COLS_4,
//       TABLE_COLS_11,
//       TABLE_COLS_22,
//       TABLE_COLS_12,
//       TABLE_COLS_13,
//       TABLE_COLS_14,
//       TABLE_COLS_15,
//       TABLE_COLS_16,
//       TABLE_COLS_17(rows),
//       TABLE_COLS_18(rows),
//       TABLE_COLS_19(rows),
//     ],
//     tableTotleLists:getTableCurrency(rows,{isTotal:true}),
//     formRules: {
//       monthBy: [{ required: true, message: "请选择统计月份", trigger: "change" }],
//       customerId: [{ required: true, message: "请选择公司", trigger: "change" }],
//     },
//   }
// }
// export const monthlyBusinessProfitUKConfig=(rows=[])=>{
//   return {
//     tableLists: [
//       TABLE_COLS_INDEX,
//       TABLE_COLS_4,
//       TABLE_COLS_11,
//       TABLE_COLS_22,
//       TABLE_COLS_21,
//       {
//         ...TABLE_COLS_12,
//         className: "border-right",
//       },
//       TABLE_COLS_17(rows),
//       TABLE_COLS_18(rows),
//       TABLE_COLS_19(rows),
//     ],
//     tableTotleLists:getTableCurrency(rows,{isTotal:true}),
//     formRules: {
//       monthBy: [{ required: true, message: "请选择统计月份", trigger: "change" }],
//     },
//   }
// }

const formConfigs = (handleFunc, type) => {
  const formLists = {
    PaymentReceivedDetail: paymentReceivedDetailForm(handleFunc),
    MonthlyBusinessProfit: monthlyBusinessProfitForm(handleFunc),
  };
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [...formLists[type]],
            },
          ],
        },
      ],
    },
  ];
};

const lists = {
  //用户-财务报销
  titleConfigs: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
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
      ],
    },
  ],
};

export const formRules = {
  createTime: [
    { required: true, message: "请选择统计日期", trigger: "change" },
  ],
  customerId: [
    { required: true, message: "请选择所属公司", trigger: "change" },
  ],
}; // 表单校验规则
export { lists, formConfigs };
// 月利润统计表   月利润统计表(英国分润)
