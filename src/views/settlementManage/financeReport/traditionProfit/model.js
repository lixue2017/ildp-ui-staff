import { httpLogisticsCustomerSelect,httpSalesmanSelect } from "@/comModel/httpSelect.js"
import { logisticsSalesmanNew } from "@/api/settlementManage/paymentReceived.js"
import { formatMoney,getTableCurrency } from "@/utils/index";
const FORM_COLS_1 = {
  id: "monthBy",
  label: "统计月份：",
  valueFormat: "yyyy/MM",
	startPlaceholder: "开始日期",
	endPlaceholder: "结束日期",
	type: "monthrange",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  }
}

const FORM_COLS_2 = {
  id: "customerId",
  label: "所属公司：",
  placeholder: "请选择所属公司",
  ...httpLogisticsCustomerSelect(),
  selectLabelKey: "customerName",
  isDefaultSelectVal: true
}

const FORM_COLS_3 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "选择业务员",
  type: "autocomplete",
  ...httpSalesmanSelect({
    httpRequest: logisticsSalesmanNew,
  }),
  type:"slot"
}

const FORM_COLS_4 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入工作单号",
  type: 'text'
}

const FORM_COLS_5 = {
  id: "otype",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type: 'select',
  basicType: "reportOrderBusType",
  hideList: [2,102,3,4,5,7,11,12,13],
}



const FORM_COLS_6 = {
  id: "endDealDate",
  label: "截止日期：",
  placeholder:"请选择截止日期",
  type: "date",
  valueFormat: "yyyy/MM/dd",
}


export const searchForm=(row)=>{
  const {changeCustomer}=row
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                {
                  ...FORM_COLS_2,
                  handle:changeCustomer
                },
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_6,
                FORM_COLS_5,
              ],
            },
          ],
        },
      ],
    },
  ]
}




const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left"
}
const TABLE_COL_1 = {
  prop: "orderNo",
  label: "工作单号",
  minWidth: 120,
  fixed: "left",
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 120,
  fixed: "left",
  showOverflowTooltip: true,
}


const TABLE_COL_3 = {
  prop: "otypeName",
  label: "业务类型",
  minWidth: 120,
  fixed: "left",
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "customerName",
  label: "客户名称",
  minWidth: 120,
  fixed: "left",
  showOverflowTooltip: true,
}

const TABLE_COL_5 =(rows=[])=>{
  const list=getTableCurrency(rows,{parentProp:'collList'})
  return {
    prop: "collList",
    label: "应收",
    multiHeader: true,
    className: "border-right",
    list
  }
}
const TABLE_COL_6 =(rows=[])=>{
  const list=getTableCurrency(rows,{parentProp:'payList'})
  return {
    prop: "payList",
    label: "应付",
    multiHeader: true,
    className: "border-right",
    list
  }
}
const TABLE_COL_7 =(rows=[])=>{
  const list=getTableCurrency(rows,{parentProp:'proList'})
  return {
    prop: "proList",
    label: "利润",
    multiHeader: true,
    className: "border-right",
    list
  }
}

const TABLE_COL_8 = {
  prop: "transportModeName",
  label: "运输方式",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_9 = {
  prop: "tradeClauseName",
  label: "贸易条款",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_10 = {
  prop: "countryName",
  label: "国家",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_11 = {
  prop: "encasementWayName",
  label: "装箱方式",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_12 = {
  prop: "realFreightBoxInfo",
  label: "箱型箱量",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_13 = {
  prop: "realFreightNum",
  label: "件数",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_14 = {
  prop: "realFreightWeight",
  label: "毛重/KG",
  minWidth: 120,
  decimal:2,
  showOverflowTooltip: true,
}
const TABLE_COL_15 = {
  prop: "realFreightVolume",
  label: "体积/m³",
  minWidth: 120,
  decimal:2,
  showOverflowTooltip: true,
  className: "border-right",
}

const TABLE_COL_16 =(rows=[])=>{
  const list=getTableCurrency(rows,{parentProp:'refundList'})
  return {
    prop: "refundList",
    label: "已回款金额",
    multiHeader: true,
    className: "border-right",
    list
  }
}
const TABLE_COL_17 =(rows=[])=>{
  const list=getTableCurrency(rows,{parentProp:'expendList'})
  return {
    prop: "expendList",
    label: "已付款金额",
    multiHeader: true,
    className: "border-right",
    list
  }
}


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
export const tableColumns =(row={})=>{
  const {currencyList}=row
  const TABLE_COLLLIST=TABLE_COLS_98(currencyList,{parentProp:'collList',parentLabel:'应收'})//应收
  const TABLE_PAYLIST=TABLE_COLS_98(currencyList,{parentProp:'payList',parentLabel:'应付'})//应付
  const TABLE_PROLIST=TABLE_COLS_98(currencyList,{parentProp:'proList',parentLabel:'利润'})//利润
  const TABLE_REFUNDLIST=TABLE_COLS_98(currencyList,{parentProp:'refundList',parentLabel:'已回款金额'})//已回款金额
  const TABLE_EXPENDLIST=TABLE_COLS_98(currencyList,{parentProp:'expendList',parentLabel:'已付款金额'})//已付款金额
  return [
    TABLE_COL_INDEX,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_8,
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COLLLIST,
    TABLE_PAYLIST,
    TABLE_PROLIST,
    TABLE_REFUNDLIST,
    TABLE_EXPENDLIST
    // TABLE_COL_5(rows),
    // TABLE_COL_6(rows),
    // TABLE_COL_7(rows),
    // TABLE_COL_16(rows),
    // TABLE_COL_17(rows)
  ]
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


export const tableTotleLists=(row={})=>{
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


export const formRules = {
  monthBy: [
    { required: true, message: "请选择统计月份", trigger: "change" },
  ],
} // 表单校验规则
// 传统润统计表
