import { httpLogisticsCustomerSelect } from '@/comModel/httpSelect.js';

const SEARCH_COL_1 = {
	span: 10,
  id: "byMonth",
  label: "月份：",
	placeholder: "请选择",
  type: "month",
  valueFormat: "yyyy-MM"
}
const SEARCH_COL_2 = {
	span: 10,
  id: "billingMain",
  label: "主体：",
  isDefaultSelectVal: true,
  ...httpLogisticsCustomerSelect()
}

export const searchFormCols = (obj) => {
	const { customerHandle } = obj || {};
  return [
    {
      fieldList: [
        {
          rows: [
            {
							cols: [
								{
									...SEARCH_COL_2,
									handle: customerHandle
								},
								SEARCH_COL_1,
							]
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
	byMonth: [
    { required: true, message: "请选择月份", trigger: "change" },
  ],
  billingMain: [
    { required: true, message: "请选择主体", trigger: "change" },
  ]
} // 表单校验规则


const TABLE_COL_INDEX = {
  type: "index",
  align: "center",
  width: 60,
}
const TABLE_COL_2 = {
  prop: "byMonth",
  label: "月份",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "voucherRate",
  label: "凭证汇率",
  minWidth: 125,
  showOverflowTooltip: true,
	// customRow: true,
	// request: true
}
const TABLE_COL_5 = {
  prop: "updateBy",
  label: "操作人",
  minWidth: 120,
	showOverflowTooltip: true,
}
const TABLE_COL_6 = {
  prop: "updateTime",
  label: "操作时间",
  width: 152,
  showOverflowTooltip: true,
}

const TABLE_COL_99 = {
	prop: "operation",
	label: "操作",
	width: 90,
	columnOperation: true,
	fixed: "right"
}

export const tableColumns = () => {
	return [
		TABLE_COL_INDEX,
		TABLE_COL_2,
		TABLE_COL_3,
		TABLE_COL_4,
		TABLE_COL_5,
		TABLE_COL_6,
		// TABLE_COL_99
	]
}
