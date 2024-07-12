import { TABLE_COLS_2 } from "@/views/enterprise/priceSystem/logisticsChannel/model.js";

const DETAIL_FORM_COL_1 = {
	span: 8,
	id: "code",
	label: "渠道代码：",
	type: "txt",
}
const DETAIL_FORM_COL_2 = {
	span: 8,
	id: "nameCn",
	label: "渠道名称(CN)：",
	type: "txt",
}
const DETAIL_FORM_COL_3 = {
	span: 8,
	id: "nameEn",
	label: "渠道名称(EN)：",
	type: "txt",
}
const DETAIL_FORM_COL_4 = {
	span: 8,
	id: "tagShowShot",
	label: "标签显示简称：",
	type: "txt",
}
const DETAIL_FORM_COL_5 = {
	span: 8,
	id: "outWarehouseMethod",
	label: "出库方式：",
	type: "txt",
	basicType: "outWarehouseWay",
}
const DETAIL_FORM_COL_6 = {
	span: 8,
	id: "traceable",
	label: "可追踪：",
	type: "txt",
	render: (row) => row.traceable ? '是' : '否'
}
const DETAIL_FORM_COL_7 = {
	span: 8,
	id: "tagType",
	label: "标签模板：",
	type: "txt",
	basicType: "tagType"
}
const DETAIL_FORM_COL_8 = {
	span: 8,
	id: "packAndShipImmediately",
	label: "打包立即签出：",
	type: "txt",
	render: (row) => row.packAndShipImmediately ? '是' : '否'
}
const DETAIL_FORM_COL_9 = {
	span: 24,
	id: "remark",
	label: "备注：",
	type: "txt",
}

export const detailColumns = () => {
	return [
		{
			fieldList: [
				{
					rows: [
						{
							cols: [
								DETAIL_FORM_COL_1,
								DETAIL_FORM_COL_2,
								DETAIL_FORM_COL_3,
								DETAIL_FORM_COL_4,
								// DETAIL_FORM_COL_5,
								DETAIL_FORM_COL_6,
								DETAIL_FORM_COL_7,
								DETAIL_FORM_COL_8,
								DETAIL_FORM_COL_9,
							],
						},
					],
				},
			],
		},
	]
}


export const detailTableColumns = () => {
	return TABLE_COLS_2
};


const EMPOWER_DLG_COL_1 = {
	span: 24,
	id: "xx_empower_1",
	label: "渠道代码：",
	type: "txt",
}
const EMPOWER_DLG_COL_2 = {
	span: 12,
	id: "attrSlot",
	label: "配置项",
	labelTxt: "配置值",
	type: "slot",
	className: 'title-attr',
}
const EMPOWER_DLG_COL_3 = {
	span: 12,
	id: "msgSlot",
	labelWidth: "0px",
	labelTxt: "配置备注",
	type: "slot",
	className: 'title-attr',
}
const EMPOWER_DLG_COL_4 = {
	span: 12,
	id: "xx_empower_4",
	label: "访问地址：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_5 = {
	span: 12,
	id: "xx_empower_5",
	labelWidth: "0px",
	type: "txt",
}
const EMPOWER_DLG_COL_6 = {
	span: 12,
	id: "xx_empower_6",
	label: "appID：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_7 = {
	span: 12,
	id: "xx_empower_7",
	label: "APPtoken：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_8 = {
	span: 12,
	id: "xx_empower_8",
	label: "Passward：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_9 = {
	span: 12,
	id: "xx_empower_9",
	label: "User：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_10 = {
	span: 12,
	id: "xx_empower_10",
	label: "DHL账号：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_11 = {
	span: 12,
	id: "xx_empower_11",
	label: "是否截取地址：",
	type: "radio",
	dicsStr: 'web_whether',
	customDicsArr: [1, 0],
}
const EMPOWER_DLG_COL_12 = {
	span: 12,
	id: "xx_empower_12",
	label: "groupProfileName：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_13 = {
	span: 12,
	id: "xx_empower_13",
	label: "isMedical：",
	type: "radio",
	dicsStr: 'web_whether',
	customDicsArr: [1, 0],
}
const EMPOWER_DLG_COL_14 = {
	span: 12,
	id: "xx_empower_14",
	label: "weightInKGType：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_15 = {
	span: 12,
	id: "xx_empower_15",
	label: "标签尺寸：",
	placeholder: "请输入",
	type: "text",
}
const EMPOWER_DLG_COL_16 = {
	span: 12,
	id: "xx_empower_16",
	label: "是否开启订单异常：",
	type: "radio",
	dicsStr: 'web_whether',
	customDicsArr: [1, 0],
}
const EMPOWER_DLG_COL_17 = {
	span: 12,
	id: "remarkSlot",
	labelWidth: "0px",
	type: "slot",
}

export const editDlgFormCols = () => {
  return [
		{
			fieldList: [
				{
					rows: [
						{
							cols: [
								EMPOWER_DLG_COL_1,
								EMPOWER_DLG_COL_2,
								EMPOWER_DLG_COL_3,
								EMPOWER_DLG_COL_4,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_6,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_7,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_8,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_9,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_10,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_11,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_12,
								EMPOWER_DLG_COL_5,
								EMPOWER_DLG_COL_13,
								EMPOWER_DLG_COL_17,
								EMPOWER_DLG_COL_14,
								{
									...EMPOWER_DLG_COL_17,
									id: "weightInSlot",
								},
								EMPOWER_DLG_COL_15,
								{
									...EMPOWER_DLG_COL_17,
									id: "tagSlot",
								},
								EMPOWER_DLG_COL_16,
								{
									...EMPOWER_DLG_COL_5,
									render: () => '是否返回特殊错误信息开启订单异常 Y:是 N:否'
								},
							],
						},
					],
				},
			],
		},
	]
}

export const dlgFormRules = () => {
	return {
    code: [
      { required: true, message: "请输入渠道代码", trigger: "blur" },
    ],
    nameCn: [
      { required: true, message: "请输入渠道名称(CN)", trigger: "blur" },
    ],
    nameEn: [
      { required: true, message: "请输入渠道名称(EN)", trigger: "blur" },
    ],
    outWarehouseWay: [
      { required: true, message: "请选择出库方式", trigger: "change" },
    ],
  }
}
