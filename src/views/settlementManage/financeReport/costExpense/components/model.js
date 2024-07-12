import { httpCostTypeSelect, httpLogisticsCustomerSelect,
	httpSalesmanSelect, httpLogisticsCompanySelect } from '@/comModel/httpSelect.js';
  import {getTableCurrency,formatMoney} from "@/utils/index.js"
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
	...httpLogisticsCustomerSelect(),
	isDefaultSelectVal: true
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
const SEARCH_COL_5 = {
	id: "costId",
	label: "费用名称：",
	...httpCostTypeSelect({type: 0}),
	multiple: true
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
								SEARCH_COL_5,
								{
									...SEARCH_COL_2,
									handle: customerHandle
								},
								{
									...SEARCH_COL_3,
									handle: salesmanHandle
								},
								SEARCH_COL_4,
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
  prop: "costName",
  label: "费用维度",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
	className: "border-right",
}
const TABLE_COL_2 = {
	prop: "xx_2",
	label: "币别",
	multiHeader: true,
	className: "border-right",
	list: [
		{
			label: 'RMB',
			prop: 'rmb',
			minWidth: 120,
			sortable: true,
			align: "right",
			showOverflowTooltip: true,
			className: "border-right",
			decimal: 2
		},
		{
			label: 'USD',
			prop: 'usd',
			minWidth: 120,
			sortable: true,
			align: "right",
			showOverflowTooltip: true,
			className: "border-right",
			decimal: 2
		},
		{
			label: 'EUR',
			prop: 'eur',
			minWidth: 120,
			sortable: true,
			align: "right",
			showOverflowTooltip: true,
			className: "border-right",
			decimal: 2
		},
		{
			label: 'HKD',
			prop: 'hkd',
			minWidth: 120,
			sortable: true,
			align: "right",
			showOverflowTooltip: true,
			className: "border-right",
			decimal: 2
		},
		{
			label: 'GBP',
			prop: 'gbp',
			minWidth: 120,
			sortable: true,
			align: "right",
			showOverflowTooltip: true,
			className: "border-right",
			decimal: 2
		}
	]
}

// export const tableColumns = [
//   TABLE_COL_0,
//   TABLE_COL_1,
//   TABLE_COL_2,
// ]
// export const tableColumns=(rows)=>{
//   const TABLE_COL_2={
//     prop: "currency",
//     label: "币别",
//     multiHeader: true,
//     className: "border-right",
//     list:getTableCurrency(rows,{parentProp:'moneyList'})
//   }
//   return [
//     TABLE_COL_0,
//     TABLE_COL_1,
//     TABLE_COL_2,
//   ]
// }
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
export const tableColumns=(row={})=>{
  const {currencyList}=row
  const TABLE_MONEYLIST=TABLE_COLS_98(currencyList,{parentProp:'moneyList',parentLabel:'币别'})
  return [
    TABLE_COL_0,
    TABLE_COL_1,
    TABLE_MONEYLIST,
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

// export const tableTotleLists=(rows)=>{
//   const totalConfig=getTableCurrency(rows,{isTotal:true})
//   return totalConfig
// }

//成本费用维度明细表  收入费用维度明细表
