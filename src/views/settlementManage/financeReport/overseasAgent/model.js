import { httpCustomerSelect } from '@/comModel/httpSelect.js';


const SEARCH_COL_1 = {
	id: "month",
	label: "统计月份：",
  placeholder: "年/月",
  type: "month",
  valueFormat: "yyyy/MM",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
		},
  }
}
const SEARCH_COL_2 = {
	id: "customerId",
	label: "代理公司：",
	...httpCustomerSelect({clientIdentity: 3})
}

export const searchFormCols = (obj) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
								SEARCH_COL_1,
								SEARCH_COL_2
							],
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
  beginTime: [
    { required: true, message: "请选择统计月份", trigger: "change" },
  ]
} // 表单校验规则

const TABLE_COL_0 = {
  type: 'index',
  align: "center",
  width: 50
}
const TABLE_COL_1 = {
  prop: "month",
  label: "日期",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "orderNo",
  label: "工作单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "costTypeName",
  label: "费用名称",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 80,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_6 = {
  prop: "collMoney",
  label: "应收金额",
  minWidth: 120,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_7 = {
  prop: "payMoney",
  label: "应付金额",
  minWidth: 120,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_8 = {
  prop: "unCollPayMoney",
  label: "未收/未付金额",
  minWidth: 126,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_9 = {
  prop: "billNo",
  label: "催请款单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_10 = {
  prop: "cashOutDate",
  label: "催请款日期",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_11 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_12 = {
  prop: "operatorName",
  label: "操作员",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}


export const tableColumns = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
	TABLE_COL_8,
	TABLE_COL_9,
	TABLE_COL_10,
	TABLE_COL_11,
	TABLE_COL_12
]
