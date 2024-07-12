import { httpLogisticsCustomerSelect, httpCostTypeSelect,
	httpSalesmanSelect, httpLogisticsCompanySelect,httpRoleDeptUserSelect } from '@/comModel/httpSelect.js';


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
	label: "申请人：",
	// ...httpSalesmanSelect(),
  ...httpRoleDeptUserSelect({ getRoles: ['CW','YW'] }),
	type: "slot"
}
const SEARCH_COL_4 = {
	id: "costId",
	label: "费用名称：",
	...httpCostTypeSelect({type: 1}),
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
								{
									...SEARCH_COL_2,
									handle: customerHandle
								},
								{
									...SEARCH_COL_3,
									handle: salesmanHandle
								},
								SEARCH_COL_4
							],
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
  month: [{ required: true, message: "请选择统计月份", trigger: "change" }],
  customerId: [{ required: true, message: "请选择公司", trigger: "change" }],
}; // 表单校验规则

const TABLE_COL_0 = {
  type: 'index',
  align: "center",
  width: 50
}
const TABLE_COL_1 = {
  prop: "expenseNo",
  label: "工作单号",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "claimByName",
  label: "收款人/收款单位",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "costName",
  label: "费用名称",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop: "totalMoney",
  label: "金额",
  minWidth: 120,
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
	colFormat: "thousandthMark",
  decimal: 2
}
const TABLE_COL_6 = {
  prop: "type",
  label: "类型",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
	basicType: "billType",
}
const TABLE_COL_7 = {
  prop: "applicantName",
  label: "申请人",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}


export const tableColumns = [
  // TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7
]
