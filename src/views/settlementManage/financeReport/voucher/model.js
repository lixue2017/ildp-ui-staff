import {
  httpLogisticsCustomerSelect,
  httpSalesmanSelect, httpLogisticsCompanySelect
} from '@/comModel/httpSelect.js';
import { getTableCurrency } from "@/utils/index";
const SEARCH_COL_1 = {
  id: "month",
  label: "统计月份：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "monthrange",
  valueFormat: "yyyy-MM"
}
const SEARCH_COL_2 = {
  id: "customerId",
  label: "主体：",
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
const SEARCH_COL_5 = {
  id: "voucherNo",
  label: "凭证号：",
	placeholder: "请输入",
  type: "text"
}

export const searchFormCols = (obj) => {
  const { tName, customerHandle, salesmanHandle } = obj || {};
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: tName === '1' ? [
                SEARCH_COL_1,
                {
                  ...SEARCH_COL_2,
                  handle: customerHandle
                },
                {
                  ...SEARCH_COL_3,
                  handle: salesmanHandle
                },
                SEARCH_COL_4
              ] : [
								SEARCH_COL_1,
								{
                  ...SEARCH_COL_2,
									id: "billingMain",
                  handle: customerHandle
                },
								SEARCH_COL_5
							],
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
  // month: [
  //   { required: true, message: "请选择统计月份", trigger: "change" },
  // ],
  customerId: [
    { required: true, message: "请选择主体", trigger: "change" },
  ],
	billingMain: [
    { required: true, message: "请选择主体", trigger: "change" },
  ]
} // 表单校验规则

const TABLE_COL_0 = {
  type: "selection",
  align: "center",
  width: 50,
}
const TABLE_COL_INDEX = {
  type: "index",
  align: "center",
  width: 60,
}
const TABLE_COL_1 = {
  prop: "orderNo",
  label: "工作单号",
  minWidth: 160,
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
const TABLE_COL_12 = {
  prop: "type",
  label: "类型",
  width: 60,
	fontColor: true,
	basicType: "billType",
}

const TABLE_COL_201 = {
  prop: "abstractText",
  label: "摘要",
  minWidth: 170,
	showOverflowTooltip: true,
}
const TABLE_COL_202 = {
  prop: "subject",
  label: "科目",
  minWidth: 150,
	showOverflowTooltip: true,
}
const TABLE_COL_203 = {
  prop: "baseMoney",
  label: "原币金额",
  minWidth: 110,
	showOverflowTooltip: true,
	align: "right",
	decimal: 2
}
const TABLE_COL_204 = {
  prop: "currencyCode",
  label: "货币代码",
  minWidth: 100,
	showOverflowTooltip: true,
}
const TABLE_COL_205 = {
  prop: "currentMoonBaseRate",
  label: "汇率",
  minWidth: 105,
	showOverflowTooltip: true,
}
const TABLE_COL_206 = {
  prop: "debitMoney",
  label: "借方金额",
  minWidth: 110,
	showOverflowTooltip: true,
	align: "right",
	decimal: 2
}
const TABLE_COL_207 = {
  prop: "creditMoney",
  label: "贷方金额",
  minWidth: 110,
	showOverflowTooltip: true,
	align: "right",
	decimal: 2
}
const TABLE_COL_208 = {
  prop: "voucherNo",
  label: "凭证号",
  minWidth: 145,
	showOverflowTooltip: true,
}
const TABLE_COL_209 = {
  prop: "createBy",
  label: "创建人",
  minWidth: 85,
	showOverflowTooltip: true,
}
const TABLE_COL_210 = {
  prop: "createTime",
  label: "创建时间",
  width: 110,
	showOverflowTooltip: true,
}
const TABLE_COL_211 = {
  prop: "lineRow",
  label: "序号",
  width: 55,
	customRow: true,
  // showOverflowTooltip: true,
}
const TABLE_COL_212 = {
  prop: "generateTime",
  label: "生成月份",
  width: 76,
	showOverflowTooltip: true,
}

export const tableColumns = (tName = '1') => {
	if (tName === '2') {
		return [
			TABLE_COL_0,
			TABLE_COL_211,
			{
				...TABLE_COL_1,
				prop: "orderNum",
				minWidth: 150,
			},
			TABLE_COL_12,
			TABLE_COL_208,
			TABLE_COL_212,
			TABLE_COL_209,
			TABLE_COL_210,
			TABLE_COL_201,
			TABLE_COL_202,
			TABLE_COL_203,
			TABLE_COL_204,
			TABLE_COL_205,
			TABLE_COL_206,
			TABLE_COL_207,
		]
	}

	return [
		TABLE_COL_0,
		// TABLE_COL_INDEX,
		TABLE_COL_1,
		TABLE_COL_12,
		TABLE_COL_7,
		TABLE_COL_9,
		TABLE_COL_2,
		TABLE_COL_3,
		TABLE_COL_4,
		TABLE_COL_5,
		TABLE_COL_6,
	]
}





export const tableTotleLists=(rows=[])=>{
const totalLists=getTableCurrency(rows,{isTotal:true})
return totalLists

}

// export const tableTotleLists = [
//   //月业务利润报表统计
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
// 		colFormat: "thousandthMark",
// 		decimal: 2,
//     showOverflowTooltip: true
//   },
//   {
//     label: "HKD",
//     prop: "HKD",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
// 		colFormat: "thousandthMark",
// 		decimal: 2,
//     showOverflowTooltip: true
//   },
//   {
//     label: "EUR",
//     prop: "EUR",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
// 		colFormat: "thousandthMark",
// 		decimal: 2,
//     showOverflowTooltip: true
//   },
//   {
//     label: "GBP",
//     prop: "GBP",
//     minWidth: 180,
//     decimal: 2,
//     align: "right",
// 		colFormat: "thousandthMark",
// 		decimal: 2,
//     showOverflowTooltip: true
//   },
// ]
//凭证明细表
