const TABLE_COLS_SELECT={
    type: 'selection',
    width: 50,
    align: "center"
}

const TABLE_COLS_INDEX = {
  type: 'index',
  width: 50,
  align: "center"
}

const BUTTORDER_FORM_1 = {
  prop: "sku",
  label: "产品SKU",
  showOverflowTooltip: true,
  customRow:true,
  minWidth: 142
}

const BUTTORDER_FORM_2 = {
  prop: "skuName",
  label: "产品名称",
  showOverflowTooltip: true,
  minWidth: 120
}

const BUTTORDER_FORM_3={
  prop: "shipmentId",
  label: "Shipment ID",
  showOverflowTooltip: true,
  minWidth: 150
}

const BUTTORDER_FORM_4={
  prop: "referenceId",
  label: "Reference ID",
  showOverflowTooltip: true,
  minWidth: 130
}

const BUTTORDER_FORM_5={
  prop: "weight",
  label: "商品毛重(KG)",
	showOverflowTooltip: true,
	align: "right",
	decimal: 2,
  minWidth: 120
}

const BUTTORDER_FORM_6={
  prop: "volume",
  label: "商品体积(CBM)",
  showOverflowTooltip: true,
	minWidth: 120,
	align: "right",
	decimal: 3,
}

const BUTTORDER_FORM_7={
  prop: "totleWeight",
  label: "毛重小计(KG)",
	showOverflowTooltip: true,
	align: "right",
	decimal: 2,
  minWidth: 120
}

const BUTTORDER_FORM_8={
  prop: "totleVolume",
  label: "体积小计(CBM)",
	showOverflowTooltip: true,
	align: "right",
	decimal: 3,
  minWidth: 120
}

const BUTTORDER_FORM_9={
  prop: "freightNum",
  label: "已收SKU数",
  showOverflowTooltip: true,
	minWidth: 110,
	align: "right",
  customRow:true,
}

const BUTTORDER_FORM_10={
  prop: "trayNum",
  label: "托盘号",
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_11={
  prop: "updateTime",
  label: "最后修改时间",
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_12={
  prop: "length",
  label: "预报长(CM)",
  showOverflowTooltip: true,
	minWidth: 100,
	align: "right",
	decimal: 1,
}

const BUTTORDER_FORM_13={
  prop: "width",
  label: "预报宽(CM)",
  showOverflowTooltip: true,
	minWidth: 100,
	align: "right",
	decimal: 1,
}

const BUTTORDER_FORM_14={
  prop: "height",
  label: "预报高(CM)",
  showOverflowTooltip: true,
	minWidth: 100,
	align: "right",
	decimal: 1,
}

const BUTTORDER_FORM_15={
  prop: "forecastSkuNum",
  label: "预收SKU数",
	showOverflowTooltip: true,
	align: "right",
  minWidth: 100
}

const BUTTORDER_FORM_16={
  prop: "takeFreightSkuNum",
  label: "已收SKU数",
	showOverflowTooltip: true,
	align: "right",
  minWidth: 100,
}

const BUTTORDER_FORM_17={
  prop: "takeAmountSku",
  label: "收货数量",
  showOverflowTooltip: true,
	minWidth: 105,
	align: "right",
  customRow:true,
	fixed: "right",

}

const BUTTORDER_FORM_18 = {
  prop: "verifyWeight",
  label: "核实商品毛重(KG)",
  showOverflowTooltip: true,
	minWidth: 140,
	align: "right",
	decimal: 2,
	customRow: true,
}
const BUTTORDER_FORM_19 = {
  prop: "verifyLength",
  label: "核实长(CM)",
  showOverflowTooltip: true,
	minWidth: 100,
	align: "right",
	decimal: 1,
	customRow: true,
}
const BUTTORDER_FORM_20 = {
  prop: "verifyWidth",
  label: "核实宽(CM)",
  showOverflowTooltip: true,
	minWidth: 100,
	align: "right",
	decimal: 1,
	customRow: true,
}
const BUTTORDER_FORM_21 = {
  prop: "verifyHeight",
  label: "核实高(CM)",
  showOverflowTooltip: true,
	minWidth: 100,
	align: "right",
	decimal: 1,
	customRow: true,
}
const BUTTORDER_FORM_22 = {
  prop: "verifyVolume",
  label: "核实商品体积(CBM)",
  showOverflowTooltip: true,
	minWidth: 140,
	align: "right",
	decimal: 3,
}

const TABLE_COLS_OPERTATION = {
  prop: "operation",
  label: "操作",
  width: 100,
  fixed: "right",
  columnOperation: true,
}

const buttOrderVerify = [
  TABLE_COLS_INDEX,
  BUTTORDER_FORM_1,//产品SKU
  BUTTORDER_FORM_2,//产品名称
  BUTTORDER_FORM_3,//Shipment ID(箱序号)
  BUTTORDER_FORM_4,//Reference ID
  BUTTORDER_FORM_5,//商品毛重(KG)
  BUTTORDER_FORM_6,//商品体积(CBM)
  BUTTORDER_FORM_7,//毛重小计(KG)
  BUTTORDER_FORM_8,//体积小计(CBM)
  BUTTORDER_FORM_9,//已收箱数
  BUTTORDER_FORM_10,//托盘号
  BUTTORDER_FORM_11,//最后修改时间
  {
    ...TABLE_COLS_OPERTATION,
    columnOperation: false,
    customRow:true,
  }
]

const buttOrderPrediction = [
  TABLE_COLS_SELECT,
  TABLE_COLS_INDEX,
  BUTTORDER_FORM_1,//产品SKU
	BUTTORDER_FORM_2,//产品名称
	
	BUTTORDER_FORM_18,
	BUTTORDER_FORM_19,
	BUTTORDER_FORM_20,
	BUTTORDER_FORM_21,
	BUTTORDER_FORM_22,

  BUTTORDER_FORM_5,//商品毛重(KG)
  BUTTORDER_FORM_12,//长
  BUTTORDER_FORM_13,//宽
  BUTTORDER_FORM_14,//高
  BUTTORDER_FORM_6,//商品体积(CBM)
  BUTTORDER_FORM_15,//预收SKU数
  BUTTORDER_FORM_16,//已收SKU数
  BUTTORDER_FORM_3,//Shipment ID(箱序号)
	BUTTORDER_FORM_4,//Reference ID
	BUTTORDER_FORM_17,//收货数量
  TABLE_COLS_OPERTATION
]

export const buttOrderTableList = (row = {}) => {
  const { index } = row
  const tableList = [ buttOrderPrediction,buttOrderVerify ]
  return tableList[index]
}
