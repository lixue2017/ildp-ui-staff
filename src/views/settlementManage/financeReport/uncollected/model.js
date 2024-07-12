import { httpCustomerSelect, httpUserSelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect.js'
import { httpAllDealingCompanySelect } from '@/comModel/httpSelect'
import {
  getNotPaymentCustomer,
  getNotPaymentSalesman,
  getNotPaymentConsignor
} from "@/api/settlementManage/paymentReceived";
import {getTableCurrency} from "@/utils/index.js"
import {formatMoney} from "@/utils/index.js"
// 所属公司

const paymentCustomerSelect = () => {
  return {
    ...httpCustomerSelect(),
    httpRequest: (params) => {
      return getNotPaymentCustomer(params)
    },
  }
}

const paymentSalesmanSelect = () => {
  return {
    ...httpUserSelect(),
    httpRequest: (params) => {
      const { nameCn, salesman, ...nParams } = params;
      return getNotPaymentSalesman(nParams)
    }
  }
}

const paymentConsignorSelect = () => {
  return {
    ...httpCustomerSelect(),
    httpRequest: (params) => {
      const { customerId, nameCn, ...nParams } = params;
      return getNotPaymentConsignor(nParams)
    }
  }
}

const SEARCH_COL_1 = {
  id: "deadline",
  label: "记账日期：",
  placeholder: "年/月/日",
  type: "daterange",
  valueFormat: "yyyy/MM/dd"
}
const SEARCH_COL_7 = {
  id: "deadlineV",
  label: "核销日期：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy/MM/dd"
}

/** 未付款明细表有引用 */
export const searchFormCols = (obj) => {
  const { customerHandle, salesmanHandle, webViewSource } = obj || {}
  const SEARCH_COL_2 = {
    id: "customerId",
    label: "所属公司：",
    noClearable: true,
    selectLabelKey: "customerName",
    ...httpLogisticsCustomerSelect(),
    handle: customerHandle
  }
  const SEARCH_COL_3 = {
    id: "slotSalesman",
    label: "业务员：",
    // isBackAll: true,
    ...paymentSalesmanSelect(),
    handle: salesmanHandle,
		multiple: true,
    type: "slot"
  }
  const SEARCH_COL_4 = {
    id: "slotConsignor",
    label: "委托人：",
    // isBackAll: true,
    ...paymentConsignorSelect(),
    type: "slot"
  }
  const SEARCH_COL_5 = {
    id: "businessType",
    label: "业务类型：",
    placeholder: "请选择业务类型",
    type: 'select',
    basicType: "settlementBusinessType",
    hideList: [2]
  }
	const SEARCH_COL_6 = {
    id: "orderNum",
    label: "工作单号：",
		placeholder: "请输入",
    type: "text"
  }
  const SEARCH_COL_8 = {
    id: "isHedging",
    text: "不显示对冲",
    labelWidth: "70px",
    type: "singleCheckbox",
  }
  const SEARCH_COL_9 = {
    id: "dealingsCompany",
    label: "往来单位：",
    placeholder: "往来单位",
    ...httpAllDealingCompanySelect()
  }
  const searchArr = [
    //uncollectedStatistics业务未收款统计表   uncollected业务未收款明细表    UnpaidReport业务未付款明细表
    SEARCH_COL_1,
    SEARCH_COL_7,
    SEARCH_COL_2,
    SEARCH_COL_3,
    SEARCH_COL_4,
    SEARCH_COL_5,
    SEARCH_COL_6,
    SEARCH_COL_9,
    webViewSource == "uncollectedStatistics" ? SEARCH_COL_8 : { isHide: true },
  ].filter((e) => !e.isHide)
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: searchArr,
            },
          ],
        },
      ],
    }
  ]
}

/** 未付款明细表有引用 */
export const formRules = {
  deadline: [
    { required: true, message: "请选择记账日期", trigger: "change" },
  ],
	deadlineV: [
    { required: true, message: "请选择核销日期", trigger: "change" },
  ],
  customerId: [
    { required: true, message: "请选择所属公司", trigger: "change" },
  ]
} // 表单校验规则

const TABLE_COL_0 = {
  type: 'index',
  align: "center",
  width: 50
}
const TABLE_COL_1 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
  align: "left",
}
const TABLE_COL_2 = {
  prop: "outPortTime",
  label: "ETD", // 离港时间
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "reachTime",
  label: "ETA", // 到港时间
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "orderNo",
  label: "工作单号",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop:"paymentDate",
  label: "应收日期",
  width: 140,
  sortable: true,
  className: "border-right",
  showOverflowTooltip: true,
}
const TABLE_COL_6 = {
  prop: "moneyRMB",
  label: "RMB",
  minWidth: 80,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_7 = {
  prop: "moneyUSD",
  label: "USD",
  minWidth: 80,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_8 = {
  prop: "moneyHKD",
  label: "HKD",
  minWidth: 80,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_9 = {
  prop: "moneyEUR",
  label: "EUR",
  minWidth: 80,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_10 = {
  prop: "moneyGBP",
  label: "GBP",
  minWidth: 80,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_11 = {
  prop: "salesman",
  label: "业务员",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_12 = {
  prop: "businessTypeName",
  label: "业务类型",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_13 = {
  prop: "customerName",
  label: "客户名称",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_14 = {
  prop: "billStatusName",
  label: "对账单状态",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
  fontColor:true,
  fixed:'right',
}
const TABLE_COL_15 = {
  prop:"accountingTime",
  label: "记账日期",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COL_16 = {
  prop:"settleCycle",
  label: "客户结算方式",
  minWidth: 120,
  basicType: "accountCycle",
  showOverflowTooltip: true,
}


const TABLE_COL_17 = {
  prop:"joinBsOrderNo",
  label: "双向关联工作单",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_18 = {
  prop:"joinBsBillNo",
  label: "双向关联对账单",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_19 = {
  prop: "createBy",
  label: "创建人",
  width: 110,
  showOverflowTooltip: true,
}
// /** 未付款明细表有引用   目前仅业务未付款明细表，业务未收款统计表用到*/
// export const tableColumns = [
//   TABLE_COL_0,
//   TABLE_COL_1, // 往来单位
//   TABLE_COL_11, // 业务员
//   TABLE_COL_13,//客户名称
//   TABLE_COL_2, // ETD
//   TABLE_COL_3, // ETA
//   {
// 		...TABLE_COL_4,
// 		customRow: true,
// 	}, // 工作单号
//   TABLE_COL_12, // 业务类型
//   TABLE_COL_5, // 应收日期
//   TABLE_COL_6, // RMB
//   TABLE_COL_7, // USD
//   TABLE_COL_8, // HKD
//   TABLE_COL_9, // EUR
//   TABLE_COL_10 // GBP
// ]


const getCurrencyConfig = (row = {}) => {
  const { currencyList,parentProp } = row;
  const arr=currencyList.map((e)=>{
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
  return arr
};


export const tableColumns=(row={})=>{
  // uncollected（业务未收款明细表）    uncollectedStatistics(业务未收款统计表)   UnpaidReport(业务未付款明细表)
  const {currencyList,sourceType}=row
  const TABLE_LIST=getCurrencyConfig({currencyList,parentProp:'moneyList'})
  const config={
    'uncollected':detailTableColumns(TABLE_LIST),
    'uncollectedStatistics':uncollectedColumns(TABLE_LIST),
    'UnpaidReport':unpaidColumns(TABLE_LIST)
  }[sourceType]
  return config
}


//业务未收款统计表
export const uncollectedColumns=(TABLE_LIST=[])=>{
  // const currencyLists=getTableCurrency(rows,{
  //   width:90,
  //   parentProp:'moneyList'
  // })
  return [
    TABLE_COL_0,
    TABLE_COL_1, // 往来单位
    TABLE_COL_11, // 业务员
    TABLE_COL_13,//客户名称
    TABLE_COL_2, // ETD
    TABLE_COL_3, // ETA
    {
      ...TABLE_COL_4,
      customRow: true,
    }, // 工作单号
    TABLE_COL_12, // 业务类型
    TABLE_COL_17,
    TABLE_COL_18,
    TABLE_COL_5, // 应收日期
    ...TABLE_LIST
  ]
}



//业务未付款明细表
export const unpaidColumns=(TABLE_LIST=[])=>{
  // const currencyLists=getTableCurrency(rows,{
  //   width:90,
  //   parentProp:'moneyList'
  // })
  return [
    TABLE_COL_0,
    TABLE_COL_1, // 往来单位
    TABLE_COL_11, // 业务员
    TABLE_COL_13,//客户名称
    TABLE_COL_2, // ETD
    TABLE_COL_3, // ETA
    {
      ...TABLE_COL_4,
      customRow: true,
    }, // 工作单号
    TABLE_COL_12, // 业务类型
    TABLE_COL_17,
    TABLE_COL_18,
    TABLE_COL_15,
    {...TABLE_COL_5,prop:"receivableDate",label: "应付日期",}, // 应收日期
    ...TABLE_LIST,
		TABLE_COL_19,
    TABLE_COL_14,
  ]
}




//业务未收款明细表
export const detailTableColumns=(TABLE_LIST=[])=>{
  // const currencyLists=getTableCurrency(rows,{
  //   width:90,
  //   parentProp:'moneyList'
  // })
  return [
    TABLE_COL_0,
    TABLE_COL_16,
    TABLE_COL_1, // 往来单位
    { ...TABLE_COL_11, prop: "salesmanName" }, // 业务员
    TABLE_COL_13, // 客户名称
    { ...TABLE_COL_2, prop: "etd" }, // ETD
    { ...TABLE_COL_3, prop: "eta" }, // ETA
    { ...TABLE_COL_4, prop: "orderNumber" }, // 工作单号
    { ...TABLE_COL_12, prop: "businessType", basicType: "settlementBusinessType", }, // 业务类型
    TABLE_COL_17,
    TABLE_COL_18,
    TABLE_COL_15,
    { ...TABLE_COL_5, prop: "receivableDate" }, // 应收日期
    ...TABLE_LIST,
		TABLE_COL_19,
    TABLE_COL_14,
  ]
}


export const totalConfig = [{
  label: "RMB：",
  prop: "moneyRMB"
}, {
  label: "USD：",
  prop: "moneyUSD"
}, {
  label: "HKD：",
  prop: "moneyHKD"
}, {
  label: "EUR：",
  prop: "moneyEUR"
}, {
  label: "GBP：",
  prop: "moneyGBP"
}]

export const detailTotalConfig=(rows)=>{
  const config=getTableCurrency(rows,{isTotal:true})
  return config
}



//业务未收款明细表  业务未收款统计表  业务未付款明细表
