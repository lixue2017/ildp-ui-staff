const FORM_VERIFY_COL_1 = {
	span: 12,
	id: "businessSn",
  label: "工作单号：",
  type: "txt",
	txtClassName: 'base-flex-align',
	txtTagArr: [{
		basicType: "distributionBusinessType",
		basicTypeVal: 'businessType'
	}]
}
const FORM_VERIFY_COL_2 = {
	span: 12,
	id: "singleWeight",
  label: "单件总量：",
  type: "txt",
	decimal: 2,
	colUnit: 'KG'
}
const FORM_VERIFY_COL_3 = {
	span: 12,
	id: "verificationNum",
  label: "核实总数：",
  type: "txt",
}
const FORM_VERIFY_COL_4 = {
	span: 12,
	id: "singleVolume",
  label: "单件体积：",
  type: "txt",
	decimal: 2,
	colUnit: 'CBM'
}

export const goodsVerifyFormCols = () => {
	return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
								FORM_VERIFY_COL_1,
								FORM_VERIFY_COL_2,
								FORM_VERIFY_COL_3,
								FORM_VERIFY_COL_4
							],
            },
          ],
        },
      ],
    },
  ]
}

const TABLE_VERIFY_COL_0 = {
  type: "index",
  width: 50,
  align: "center"
}
const TABLE_VERIFY_COL_1 = {
	prop: "distributionType",
  label: "出库方式",
  width: 90,
  showOverflowTooltip: true,
	basicType: "distributionType",
	fontColor: true,
}
const TABLE_VERIFY_COL_2 = {
	prop: "code",
  label: "单号",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_VERIFY_COL_3 = {
	prop: "num",
  label: "计划数量",
  width: 110,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_VERIFY_COL_4 = {
	prop: "verifyNum",
  label: "核实数量",
  minWidth: 120,
  showOverflowTooltip: true,
	align: "right",
	customRow: true,
	decimal: 0
}
const TABLE_VERIFY_COL_5 = {
	prop: "infoTotalNum",
  label: "整单总数",
  width: 110,
  showOverflowTooltip: true,
	align: "right",
}
const TABLE_VERIFY_COL_6 = {
	prop: "infoTotalWeight",
  labelTop: "总重量/KG",
	labelBottom: "(整车/快递)",
	headerTopBottom: true,
  width: 110,
  showOverflowTooltip: true,
	align: "right",
	decimal: 2,
}
const TABLE_VERIFY_COL_7 = {
	prop: "infoTotalVolume",
  labelTop: "总体积/CBM",
	labelBottom: "(整车/快递)",
	headerTopBottom: true,
  width: 110,
  showOverflowTooltip: true,
	align: "right",
	decimal: 2,
}
const TABLE_VERIFY_COL_8 = {
	prop: "createTime",
  label: "创建时间",
  width: 139,
  showOverflowTooltip: true,
}

export const goodsVerifyTableColumn = () => {
	return [
		TABLE_VERIFY_COL_0,
		TABLE_VERIFY_COL_1,
		TABLE_VERIFY_COL_2,
		TABLE_VERIFY_COL_3,
		TABLE_VERIFY_COL_4,
		TABLE_VERIFY_COL_5,
		TABLE_VERIFY_COL_6,
		TABLE_VERIFY_COL_7,
		TABLE_VERIFY_COL_8
	]
}

const GOODS_TABLE_COL_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  width: 1,
  // fixed: "left",
}
const TRUCK_TABLE_COL_304 = {
	prop: "xx_tg_4",
  label: "整车总数",
  minWidth: 120,
  showOverflowTooltip: true,
	align: "right",
	decimal: 0
}
const TRUCK_TABLE_COL_305 = {
	prop: "xx_tg_6",
  labelTop: "整车总重量",
	labelBottom: "（KG）",
	headerTopBottom: true,
  width: 110,
  showOverflowTooltip: true,
	align: "right",
	decimal: 2,
}
const TRUCK_TABLE_COL_306 = {
	prop: "xx_tg_7",
  labelTop: "整车总体积",
	labelBottom: "（CBM）",
	headerTopBottom: true,
  width: 110,
  showOverflowTooltip: true,
	align: "right",
	decimal: 2,
}
const TRUCK_TABLE_COL_307 = {
	prop: "xx_tg_8",
  label: "创建时间",
  width: 136,
  showOverflowTooltip: true,
}
export const truckVerifyTableColumn = () => {
	return [
		TABLE_VERIFY_COL_0,
		GOODS_TABLE_COL_EXPAND,
		TABLE_VERIFY_COL_1,
		TABLE_VERIFY_COL_2,
		TABLE_VERIFY_COL_3,
		TRUCK_TABLE_COL_304,
		TRUCK_TABLE_COL_305,
		TRUCK_TABLE_COL_306,
		TRUCK_TABLE_COL_307
	]
}
export const truckVerifyExpandCols = () => {
	return [
		{
			prop: "xx_ex_1",
			label: "",
			width: 51,
			customRow: true,
		},
		TABLE_VERIFY_COL_1,
		TABLE_VERIFY_COL_2,
		TABLE_VERIFY_COL_3,
		{
			...TRUCK_TABLE_COL_304,
			customRow: true,
		},
		TRUCK_TABLE_COL_305,
		TRUCK_TABLE_COL_306,
		TRUCK_TABLE_COL_307
	]
}