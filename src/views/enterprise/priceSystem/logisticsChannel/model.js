import { httpUserSelect, httpEnterprisetSelect } from '@/comModel/httpSelect'

const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: 'right',
  width: '136px'
}

const SEARCH_COL_1 = {
	id: "createTime",
	label: "创建时间：",
	startPlaceholder: "开始日期",
	endPlaceholder: "结束日期",
	type: "daterange",
	valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
	id: "codeEq",
	label: "渠道代码：",
	placeholder: "请输入",
	type: "text",
}
const SEARCH_COL_3 = {
	id: "nameLike",
	label: "渠道名称：",
	placeholder: "渠道名称（中英文）",
	type: "text",
}
const SEARCH_COL_4 = {
	id: "serviceIdEq",
	label: "服务商渠道：",
	placeholder: "请选择",
  ...httpEnterprisetSelect({ typeList: 3 })
}
const SEARCH_COL_5 = {
	id: "xx_search_5",
	label: "方案编码：",
	placeholder: "请输入",
	type: "text",
}
const SEARCH_COL_6 = {
	id: "outWarehouseMethodEq",
	label: "出库方式：",
	type: "select",
  placeholder: "请选择",
  basicType: "outWarehouseWay",
	hideList: [20, 30, 40]
}
const SEARCH_COL_7 = {
	id: "stateEq",
	label: "状态：",
	type: "select",
  placeholder: "请选择",
  basicType: "status"
}
const SEARCH_COL_8 = {
	id: "createUserIdEq",
	label: "创建人：",
	placeholder: "请选择",
  ...httpUserSelect()
}

const SEARCH_COL_202 = {
	id: "code",
	label: "服务代码：",
	placeholder: "请输入",
	type: "text",
}

export const searchColumns = (tName = '1') => {
	const SEARCH_COLS_1 = [
		SEARCH_COL_1,
		SEARCH_COL_2,
		SEARCH_COL_3,
		SEARCH_COL_4,
		// SEARCH_COL_6,
		SEARCH_COL_7,
		SEARCH_COL_8
	]
	const SEARCH_COLS_2 = [
		SEARCH_COL_1,
		SEARCH_COL_202,
		SEARCH_COL_4,
		SEARCH_COL_7
	]
	return [
		{
			className: "search-form-width",
			fieldList: [
				{
					rows: [
						{
							cols: SEARCH_COLS_1
							// cols: [
							// 	SEARCH_COLS_1,
							// 	SEARCH_COLS_2
							// ][tName - 1],
						},
					],
				},
			],
		},
	]
}

const TABLE_COL_0 = {
	type: "index",
	width: 50,
	align: "center"
}
const TABLE_COL_1 = {
	prop: "code",
	label: "渠道代码",
	columnLink: true,
	sortable: true,
	minWidth: 130,
	showOverflowTooltip: true
}
const TABLE_COL_2 = {
	prop: "nameCn",
	label: "渠道名称(CN)",
	minWidth: 140,
	sortable: true,
	showOverflowTooltip: true
}
const TABLE_COL_3 = {
	prop: "nameEn",
	label: "渠道名称(EN)",
	minWidth: 140,
	sortable: true,
	showOverflowTooltip: true
}
const TABLE_COL_4 = {
	prop: "outWarehouseMethod",
	label: "出库方式",
	width: 100,
	sortable: true,
	showOverflowTooltip: true,
	basicType: "outWarehouseWay"
}
const TABLE_COL_5 = {
	prop: "serviceName",
	label: "所属服务商",
	minWidth: 120,
	sortable: true,
	showOverflowTooltip: true
}
const TABLE_COL_6 = {
	prop: "tagShowShot",
	label: "标签显示简称",
	minWidth: 140,
	sortable: true,
	showOverflowTooltip: true
}
const TABLE_COL_7 = {
	prop: "tagType",
	label: "标签模板",
	minWidth: 120,
	sortable: true,
	showOverflowTooltip: true,
	basicType: "tagType"
}
const TABLE_COL_8 = {
	prop: "traceable",
	label: "可追踪",
	width: 60,
	fontColor: true,
	basicType: "trueOrFalse"
	// render: (row) => row.traceable ? '是' : '否'
}
const TABLE_COL_9 = {
	prop: "packAndShipImmediately",
	label: "打包立即签出",
	width: 100,
	fontColor: true,
	basicType: "trueOrFalse"
	// render: (row) => row.packAndShipImmediately ? '是' : '否'
}
const TABLE_COL_10 = {
	prop: "remark",
	label: "备注",
	minWidth: 130,
	// sortable: true,
	showOverflowTooltip: true
}
const TABLE_COL_11 = {
	prop: "state",
	label: "状态",
	dotColor: true,
	sortable: true,
	width: 80,
	basicType: "status"
}
const TABLE_COL_12 = {
	prop: "createTime",
	label: "创建时间",
	sortable: true,
	width: 150,
	showOverflowTooltip: true,
}

const TABLE_COL_201 = {
	prop: "xx_table_201",
	label: "服务代码",
	sortable: true,
	minWidth: 130,
	showOverflowTooltip: true,
}
const TABLE_COL_202 = {
	prop: "xx_table_202",
	label: "API类型",
	sortable: true,
	width: 120,
	showOverflowTooltip: true,
}
const TABLE_COL_203 = {
	prop: "xx_table_203",
	label: "渠道代码",
	sortable: true,
	minWidth: 120,
	showOverflowTooltip: true,
}
const TABLE_COL_204 = {
	prop: "xx_table_204",
	label: "渠道名称",
	sortable: true,
	minWidth: 120,
	showOverflowTooltip: true,
}
const TABLE_COL_205 = {
	prop: "xx_table_205",
	label: "服务地址",
	sortable: true,
	minWidth: 160,
	showOverflowTooltip: true,
}
const TABLE_COL_206 = {
	prop: "xx_table_206",
	label: "标签",
	sortable: true,
	minWidth: 100,
	showOverflowTooltip: true,
}
const TABLE_COL_207 = {
	prop: "xx_table_207",
	label: "标签尺寸",
	sortable: true,
	minWidth: 120,
	showOverflowTooltip: true,
}
const TABLE_COL_208 = {
	prop: "xx_table_208",
	label: "状态",
	sortable: true,
	minWidth: 100,
	showOverflowTooltip: true,
}
const TABLE_COL_209 = {
	prop: "xx_table_209",
	label: "创建时间",
	sortable: true,
	minWidth: 136,
	showOverflowTooltip: true,
}
const TABLE_COL_210 = {
	prop: "xx_table_210",
	label: "最后操作时间",
	sortable: true,
	minWidth: 136,
	showOverflowTooltip: true,
}

const TABLE_COLS_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
	TABLE_COL_3,
  // TABLE_COL_4,
	TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
	TABLE_COL_9,
	TABLE_COL_10,
	TABLE_COL_11,
	TABLE_COL_12,
  // {
  //   prop: "createBy",
  //   label: "创建人",
  //   sortable: true,
  //   width: 100,
  // },
  TABLE_COL_99
]

/** 详情有引用 @/views/enterprise/priceSystem/logisticsChannel/model.js */
export const TABLE_COLS_2 = [
	TABLE_COL_0,
	TABLE_COL_201,
	TABLE_COL_202,
	TABLE_COL_203,
	TABLE_COL_204,
	TABLE_COL_205,
	TABLE_COL_206,
	TABLE_COL_207,
	TABLE_COL_208,
	TABLE_COL_209,
	TABLE_COL_210,
	TABLE_COL_99
]

export const tableColumns = (tName = 1) => {
	return [TABLE_COLS_1, TABLE_COLS_2][tName - 1]
};


const EDIT_DLG_COL_1 = {
  span: 12,
  id: "code",
  label: "渠道代码：",
  placeholder: "请输入",
  type: "text",
	maxlength: 20,
}
const EDIT_DLG_COL_2 = {
  span: 12,
  id: "tagShowShot",
  label: "标签显示简称：",
  placeholder: "请输入",
  type: "text",
	maxlength: 20,
}
const EDIT_DLG_COL_3 = {
  span: 12,
  id: "nameCn",
  label: "渠道名称(CN)：",
  placeholder: "请输入",
  type: "text",
	maxlength: 20,
}
const EDIT_DLG_COL_4 = {
  span: 12,
  id: "nameEn",
  label: "渠道名称(EN)：",
  placeholder: "请输入",
  type: "text",
	maxlength: 30,
}
const EDIT_DLG_COL_5 = {
  span: 12,
  id: "outWarehouseMethod",
  label: "出库方式：",
  type: "radio",
  basicType: "outWarehouseWay",
	hideList: [20, 30, 40]
}
const EDIT_DLG_COL_6 = {
  span: 12,
  id: "traceable",
  label: "可追踪：",
  type: "radio",
  options: [{
    label: '否',
    value: false,
  }, {
    label: '是',
    value: true,
  }]
}
const EDIT_DLG_COL_7 = {
  span: 12,
  id: "tagType",
  label: "标签模板：",
	type: "select",
  placeholder: "请选择",
  basicType: "tagType"
}
const EDIT_DLG_COL_8 = {
  span: 12,
  id: "packAndShipImmediately",
  label: "打包立即签出：",
  type: "radio",
  options: [{
    label: '否',
    value: false,
  }, {
    label: '是',
    value: true,
  }]
}
const EDIT_DLG_COL_9 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "此处填写备注信息",
  type: "textarea",
	maxlength: 200,
}
const EDIT_DLG_COL_10 = {
	span: 12,
	id: "serviceId",
	label: "所属服务商：",
	placeholder: "请选择",
	...httpEnterprisetSelect({ typeList: 3 })
}
const EDIT_DLG_FORM_COLS = [
  EDIT_DLG_COL_1,
  EDIT_DLG_COL_2,
  EDIT_DLG_COL_3,
  EDIT_DLG_COL_4,
	EDIT_DLG_COL_10,
  // EDIT_DLG_COL_5,
  EDIT_DLG_COL_6,
  EDIT_DLG_COL_8,
	EDIT_DLG_COL_7,
  EDIT_DLG_COL_9
]


const SEE_DLG_FORM_COLS = EDIT_DLG_FORM_COLS.map(e => {
	let see_item = {
		...e
	}
	if (e.type === "radio") {
		see_item.disable = true
	} else {
		if (e.id === "labelShortName") {
			see_item.type = "txt";
			see_item.txtTagArr = [{
				basicType: 'status',
				basicTypeVal: 'status'
			}];
		} else {
			see_item.type = "txt"
		}
	}
	return see_item
})

export const editDlgFormCols = (mode_type = 0) => {
  return [
		{
			fieldList: [
				{
					rows: [
						{
							cols: [EDIT_DLG_FORM_COLS, SEE_DLG_FORM_COLS][mode_type],
						},
					],
				},
			],
		},
	]
}

export const dlgFormRules = (mode_type = 0) => {
	return mode_type === 0 ? {
    code: [
      { required: true, message: "请输入渠道代码", trigger: "blur" },
    ],
    nameCn: [
      { required: true, message: "请输入渠道名称(CN)", trigger: "blur" },
    ],
    nameEn: [
      { required: true, message: "请输入渠道名称(EN)", trigger: "blur" },
    ],
		serviceId: [
      { required: true, message: "请选择所属服务商", trigger: "change" },
    ],
    outWarehouseMethod: [
      { required: true, message: "请选择出库方式", trigger: "change" },
    ],
  } : {}
}
