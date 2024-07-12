
const searchColumns = [
  {
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "companyName",
    label: "创建来源客户：",
    placeholder: "请输入创建来源客户",
    type: "text",
    labelWidth: "120px",
  },
  {
    id: "contacts",
    label: "联系人：",
    placeholder: "联系人",
    type: "text",
  },
  {
    id: "phone",
    label: "联系电话：",
    placeholder: "联系电话",
    type: "text",
  },
  {
    id: "state",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    collapseTags: true,
    basicType: 'status'
  }
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "code",
    label: "地址代码",
    customRow: true,
    sortable: true,
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    prop: "addresName",
    label: "公司名称",
    sortable: true,
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: "contacts",
    label: "联系人",
    width: 150,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "phone",
    label: "联系电话",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    // prop: "address",
    prop: "detailsAddr",
		label: "详细地址",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
  },
  {
    prop: "status",
    label: "状态",
    width: '120px',
    sortable: true,
    customRow: true,
    basicType: "status",
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 200,
    sortable: true,
    fixed: 'right',
  },
  {
    prop: "nickName",
    label: "创建客户",
    minWidth: 120,
    fixed: 'right',
    sortable: true,
    showOverflowTooltip: true,
  }
]


const EDIT_FORM_COL_1 = {
	span: 8,
	id: "addresName",
	label: "公司名称：",
	placeholder: "--",
	type: "txt"
}
const EDIT_FORM_COL_2 = {
	span: 8,
	id: "code",
	label: "地址代码：",
	placeholder: "--",
	type: "txt"
}
const EDIT_FORM_COL_3 = {
	span: 8,
	id: "contacts",
	label: "联系人：",
	placeholder: "--",
	type: "txt"
}
const EDIT_FORM_COL_4 = {
	span: 8,
	id: "phone",
	label: "联系电话：",
	placeholder: "--",
	type: "txt",
}
const EDIT_FORM_COL_5 = {
	span: 24,
	id: "detailsAddr",
	label: "详细地址：",
	placeholder: "--",
	type: "txt"
}
const EDIT_FORM_COL_6 = {
	span: 24,
	id: "remark",
	label: "备注：",
	placeholder: "--",
	type: "txt",
}
const EDIT_FORM_COL_7 = {
	span: 8,
	id: "isDefault",
	text: "设为默认",
	type: "singleCheckbox",
	disabled: true,
}
/** 详情弹窗模板 */
const DETAIL_FORM_COLS = [
	EDIT_FORM_COL_2,
	EDIT_FORM_COL_1,
	{
		span: 8,
		id: "slotStatus",
		type: "slot",
		basicType: "status",
		basicTypeVal: "status"
	},
	EDIT_FORM_COL_3,
	EDIT_FORM_COL_4,
	EDIT_FORM_COL_7,
	EDIT_FORM_COL_5,
	EDIT_FORM_COL_6,
]

const detailColumns = {
  from: DETAIL_FORM_COLS,
  table: [{
    type: "index",
    width: "50",
    align: "center"
  },
  {
    labelTop: "失效操作人",
    labelBtm: "失效时间",
    prop: "invalid",
    customRow: true,
    customHeader: true
  },
  {
    labelTop: "公司名称",
    labelBtm: "联系人/联系电话",
    prop: "contacts",
    customRow: true,
    customHeader: true
  },
  {
    labelTop: "详细地址",
    labelBtm: "备注",
    prop: "addr",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true,
  }]
}


export { searchColumns, tableColumns, detailColumns };
