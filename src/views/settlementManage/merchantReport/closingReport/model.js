import { httpLogisticsCustomerSelect } from '@/comModel/httpSelect.js';

const SEARCH_COL_1 = {
  id: "lockMonth",
  label: "结账日期：",
	placeholder: "请选择",
  type: "month",
  valueFormat: "yyyy-MM"
}
const SEARCH_COL_2 = {
  id: "unlockMonth",
  label: "反结账日期：",
	placeholder: "请选择",
  type: "month",
  valueFormat: "yyyy-MM"
}
const SEARCH_COL_3 = {
	span: 10,
  id: "billingMain",
  label: "主体：",
  selectLabelKey: "customerName",
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
									...SEARCH_COL_3,
									handle: customerHandle
								}
								// SEARCH_COL_1,
								// SEARCH_COL_2,
							]
            },
          ],
        },
      ],
    }
  ]
}

export const formRules = {
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
  prop: "code",
  label: "结账类型",
  minWidth: 120,
	render: (row) => {
		return ['反结账', '结账'][row.operationType]
	}
}
const TABLE_COL_2 = {
  prop: "freezeTime",
  label: "结账月份",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "createBy",
  label: "操作人",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_4 = {
  prop: "createTime",
  label: "操作时间",
  minWidth: 125,
  showOverflowTooltip: true,
}
const TABLE_COL_5 = {
  prop: "status",
  label: "状态",
  minWidth: 80,
	render: (row) => {
		return ['未结账', '已结账'][row.status] || '--'
	}
}
const TABLE_COL_6 = {
  prop: "updateBy",
  label: "最后更新人",
  minWidth: 105,
  showOverflowTooltip: true,
}
const TABLE_COL_7 = {
  prop: "updateTime",
  label: "最后更新时间",
  minWidth: 125,
  showOverflowTooltip: true,
}
const TABLE_COL_99 = {
	prop: "operation",
	label: "操作",
	width: 80,
	columnOperation: true,
	fixed: "right"
}

export const tableColumns = () => {
	return [
		TABLE_COL_INDEX,
		TABLE_COL_2,
		TABLE_COL_3,
		TABLE_COL_4,
    TABLE_COL_6,
    TABLE_COL_7,
		TABLE_COL_5,
	]
}


export const customDialogCols = (obj) => {
	const { typeNum = 0 } = obj || {};
	const title = ['结账', '反结账'][typeNum];
	return {
		title,
		width: '500px',
		labelWidth: '88px',
		simpleCustomCols: [{
			span: 24,
			id: "tipSlot",
			labelWidth: "12px",
			type: "slot"
		}, {
			span: 24,
			id: ['lockMonth', 'unlockMonth'][typeNum],
			label: `${title}日期：`,
			type: "txt",
		}]
	}
}
