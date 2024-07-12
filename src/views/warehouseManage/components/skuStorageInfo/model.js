import overseaLangObj from "@/language/overseasLang.js";

const TABLE_COLS_INDEX = {
  type: 'index',
  width: 50,
  align: "center"
}

const TABLE_COLS_1 = {
  prop: "shipmentId",
	label: `Shipment ID(${overseaLangObj.box_number || "箱序号"})`,
  showOverflowTooltip: true,
  minWidth: 160
}
const TABLE_COLS_2 = {
  prop: "referenceId",
  label: "Reference ID",
  showOverflowTooltip: true,
  minWidth: 120
}
const TABLE_COLS_3 = {
  prop: "weight",
  label: overseaLangObj.sp_mz || "商品毛重(KG)",
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
  minWidth: 120,
}
const TABLE_COLS_4 = {
  prop: "length",
  label: overseaLangObj.c_length() || "长(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  prop: "width",
  label: overseaLangObj.k_width() || "宽(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_6 = {
  prop: "height",
  label: overseaLangObj.g_height() || "高(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_7 = {
  prop: "volume",
  label: overseaLangObj.sp_tj || "商品体积(CBM)",
  showOverflowTooltip: true,
  decimal: 3,
  align: "right",
  minWidth: 120,
}
const TABLE_COLS_8 = {
  prop: "destination",
  label: "目的地",
  showOverflowTooltip: true,
}
const TABLE_COLS_9 = {
  prop: "storageWay",
  label: "存仓方式",
  showOverflowTooltip: true,
  minWidth: 100,
  fontColor: true,
  // dicsStr: 'storageWay',
  // customDicsArr: [0, 1], // 对象属性名
  // customDicsVal: "storageWay"
  basicType: "storageType",
  basicTypeVal: "storageType"
}
const TABLE_COLS_10 = {
  prop: "takeFreightBoxNum",
  label: overseaLangObj.ys_xs || "已收箱数",
  showOverflowTooltip: true,
  decimal: 0,
  min: 1,
  align: "right",
}
const TABLE_COLS_11 = {
  prop: "trayNum",
  label: overseaLangObj.pallet_number() || "托盘号",
  showOverflowTooltip: true,
  minWidth: 180
}
const TABLE_COLS_12 = {
  prop: "updateTime",
  label: overseaLangObj.last_modified() || "最后修改时间",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_13 = {
  prop: "forecastBoxNum",
  label: "预计箱数",
  align: "right",
  decimal: 0,
  showOverflowTooltip: true,
}
const TABLE_COLS_14 = {
  label: overseaLangObj.subtotal_of_volume || "体积小计(CBM)",
  prop: "boxVolume",
  align: 'right',
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 3
}
const TABLE_COLS_15 = {
  label: overseaLangObj.subtotal_gross_weight || "毛重小计(KG)",
  prop: "boxWeight",
  align: 'right',
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 2
}
const TABLE_COLS_16 = {
  prop: "volume",
  width: 70,
  align: "center",
  customRow: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_17 = {
  labelTop: '唛头',
  labelBottom: '名称',
  prop: "sku",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
  minWidth: 80
}
const TABLE_COLS_18 = {
  labelTop: 'HS CODE',
  labelBottom: 'ASIN',
  prop: "code",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_19 = {
  labelTop: '产品重量(KG)',
  labelBottom: '产品净重(KG)',
  prop: "weight",
  customRow: true,
  customHeader: true,
  decimal: 3,
  showOverflowTooltip: true,
}
const TABLE_COLS_20 = {
  labelTop: '申报价格',
  labelBottom: '数量',
  prop: "declaredValue",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_21 = {
  labelTop: '型号',
  labelBottom: '品牌',
  prop: "productModel",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_22 = {
  labelTop: '产品成分',
  labelBottom: '产品用途',
  prop: "businessUse",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_23 = {
  labelTop: 'Shipment ID',
  labelBottom: '箱号',
  prop: "shipmentId",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_24 = {
  prop: "boxSn",
  label: "箱号",
  showOverflowTooltip: true,
}
const TABLE_COLS_25 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  showOverflowTooltip: true
}
const TABLE_COLS_26 = {
  prop: "skuName",
  label: overseaLangObj.cp_name || "产品名称",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_27 = {
  prop: "predictionNum",
  label: overseaLangObj.ys_sku_num || "预收SKU数",
  minWidth: 120,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true
}
const TABLE_COLS_28 = {
  prop: "arrivalNum",
  label: overseaLangObj.received_sku_num || "已收SKU数",
  minWidth: 120,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true
}

const thirdPartyVerify = [
  //第三方按SKU已收货信息
  TABLE_COLS_INDEX,
  TABLE_COLS_25,//产品SKU
  TABLE_COLS_26,//产品名称
  {
    ...TABLE_COLS_1,
    prop: "boxSn"
  },//Shipment ID
  TABLE_COLS_2,//Reference ID
  {
    ...TABLE_COLS_3,
    prop: "boxWeight"
  },//单箱毛重
  {
    ...TABLE_COLS_7,
    prop: "boxVolume"
  },//单箱体积
  {
    ...TABLE_COLS_10,
    prop: "num",
    label: overseaLangObj.ys_num || "已收数量"
  },//已收箱数
  {
    ...TABLE_COLS_11,
    prop: "traySn"
  },//托盘号
  {
    ...TABLE_COLS_12,
    prop: "time"
  }//最后修改时间
]
const thirdPartyPrediction = [
  //第三方按SKU预报货物信息
  TABLE_COLS_INDEX,
  TABLE_COLS_25,//产品SKU
  TABLE_COLS_26,//产品名称
  {
    ...TABLE_COLS_3,
    prop: "boxWeight"
  },//单箱毛重
  {
    ...TABLE_COLS_4,
    prop: "boxSkuLong"
  },//箱长
  {
    ...TABLE_COLS_5,
    prop: "boxSkuWide"
  },//箱宽
  {
    ...TABLE_COLS_6,
    prop: "boxSkuHigh"
  },//箱高
  {
    ...TABLE_COLS_7,
    prop: "boxVolume"
  },//单箱体积
  // TABLE_COLS_13,//预报箱数
  // TABLE_COLS_10,//已收箱数
  TABLE_COLS_27,//预收SKU数
  TABLE_COLS_28,//已收SKU数
  {
    ...TABLE_COLS_1,
    prop: "boxSn"
  },//Shipment ID
  TABLE_COLS_2,//Reference ID
]


export const thirdPartyTableList = (row = {}) => {
  const { index } = row
  const tableList = [thirdPartyVerify, thirdPartyPrediction]
  return tableList[index]
}


export const thirdPartyTotal = (tName) => {
  return {
    0: [
      {
        label: "毛重小计",
        value: "verifyBoxWeight",
        decimal:3
      },
      {
        label: "商品小计",
        value: "verifyBoxVolume",
        decimal:3
      },
      {
        label: "已收数量",
        value: "verifyNum",
      },
    ],
    1: [
      {
        label: "毛重小计",
        value: "preBoxWeight",
        verifyParams:'verifyBoxWeight',
        decimal:3,
        unit:'KG'
      },
      {
        label: "体积小计",
        value: "preBoxVolume",
        verifyParams:'verifyBoxVolume',
        decimal:3,
        unit:'CBM'
      },
      {
        label: "预收SKU数",
        value: "prePredictionNum",
        verifyParams:'preArrivalNum',
        decimal:3
      },
      {
        label: "已收SKU数",
        value: "preArrivalNum",
      },
    ],
  }[tName];
};





const overSeasVerify = [
  //海外入仓按SKU已收货信息
  TABLE_COLS_INDEX,
  TABLE_COLS_25,//产品SKU
  TABLE_COLS_26,//产品名称
  TABLE_COLS_1,//Shipment ID
  TABLE_COLS_2,//Reference ID
  {
    ...TABLE_COLS_3,
    prop: "skuWeight"
  },//商品毛重
  {
    ...TABLE_COLS_7,
    prop: "skuVolume"
  },//商品体积
  {
    ...TABLE_COLS_15,
    prop: "skuWeightSum"
  },//毛重小计
  {
    ...TABLE_COLS_14,
    prop: "skuVolumeSum"
  },//体积小计
  {
    ...TABLE_COLS_10,
    prop: "num"
  },//已收箱数
  {
    ...TABLE_COLS_11,
    prop: "traySn"
  },//托盘号
  {
    ...TABLE_COLS_12,
    prop: "time"
  }//最后修改时间
]
const overSeasPrediction = [
  //海外入仓按SKU预报货物信息
  TABLE_COLS_INDEX,
  TABLE_COLS_25,//产品SKU
  TABLE_COLS_26,//产品名称
  {
    ...TABLE_COLS_3,
    prop: "skuWeight"
  },//单箱毛重
  {
    ...TABLE_COLS_4,
    prop: "skuLong"
  },//箱长
  {
    ...TABLE_COLS_5,
    prop: "skuWide"
  },//箱宽
  {
    ...TABLE_COLS_6,
    prop: "skuHigh"
  },//箱高
  {
    ...TABLE_COLS_7,
    prop: "skuVolume"
  },//单箱体积
  TABLE_COLS_27,//预报SKU数
  TABLE_COLS_28,//已收SKU数
  {
    ...TABLE_COLS_1,
    customRow: true,
    prop: "shipmentIds"
  },//Shipment ID
  {
    ...TABLE_COLS_2,
    customRow: true,
    prop: "referenceIds"
  },//Reference ID
]

export const overSeasTableList = (row = {}) => {
  const { index } = row
  const tableList = [overSeasVerify, overSeasPrediction]
  return tableList[index]
}

export const overSeasTotal = (tName) => {
  return {
    0: [
      {
        label: "商品毛重",
        value: "verifySkuWeight",
        decimal:3
      },
      {
        label: "商品体积",
        value: "verifySkuVolume",
        decimal:3
      },
      {
        label: "毛重小计",
        value: "verifySkuWeightSum",
        decimal:3
      },
      {
        label: "体积小计",
        value: "verifySkuVolumeSum",
        decimal:3
      },
      {
        label: "已收数量",
        value: "verifyNum",
      },
    ],
    1: [
      {
        label: "毛重小计",
        value: "preSkuWeight",
        verifyParams:'verifySkuWeightSum',
        decimal:3
      },
      {
        label: "体积小计",
        value: "preSkuVolume",
        verifyParams:'verifySkuVolumeSum',
        decimal:3
      },
      {
        label: "合计箱数",
        value: "prePredictionNum",
        verifyParams:'preArrivalNum',
        decimal:3
      },
      {
        label: "已收SKU数量",
        value: "preArrivalNum",
      },
    ],
  }[tName];
};




const BUTTORDER_FORM_1 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_2 = {
  prop: "skuName",
  label: overseaLangObj.cp_name || "产品名称",
  showOverflowTooltip: true,
  minWidth: 120
}

const BUTTORDER_FORM_3={
  prop: "shipmentId",
	label: `Shipment ID(${overseaLangObj.box_number || "箱序号"})`,
  showOverflowTooltip: true,
  minWidth: 160
}

const BUTTORDER_FORM_4={
  prop: "referenceId",
  label: "Reference ID",
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_5={
  prop: "weight",
  label: overseaLangObj.sp_mz || "商品毛重(KG)",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 140
}

const BUTTORDER_FORM_6={
  prop: "volume",
  label: overseaLangObj.sp_tj || "商品体积(CBM)",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 140
}

const BUTTORDER_FORM_7={
  prop: "totleWeight",
  label: overseaLangObj.subtotal_gross_weight || "毛重小计(KG)",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 140
}

const BUTTORDER_FORM_8={
  prop: "totleVolume",
  label: overseaLangObj.subtotal_of_volume || "体积小计(CBM)",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 140
}

const BUTTORDER_FORM_9={
  prop: "freightNum",
  label: overseaLangObj.received_sku_num || "已收SKU数",
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_10={
  prop: "trayNum",
  label: overseaLangObj.pallet_number("托盘号"),
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_11={
  prop: "updateTime",
  label: overseaLangObj.last_modified("最后修改时间"),
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_12={
  prop: "length",
  label: overseaLangObj.c_length() || "长(CM)",
  showOverflowTooltip: true,
  decimal:1,
  minWidth: 140
}

const BUTTORDER_FORM_13={
  prop: "width",
  label: overseaLangObj.k_width() || "宽(CM)",
  showOverflowTooltip: true,
  decimal:1,
  minWidth: 140
}

const BUTTORDER_FORM_14={
  prop: "height",
  label: overseaLangObj.g_height() || "高(CM)",
  showOverflowTooltip: true,
  decimal:1,
  minWidth: 140
}

const BUTTORDER_FORM_15={
  prop: "forecastSkuNum",
  label: overseaLangObj.ys_sku_num || "预收SKU数",
  showOverflowTooltip: true,
  minWidth: 140
}

const BUTTORDER_FORM_16={
  prop: "takeFreightSkuNum",
  label: overseaLangObj.received_sku_num || "已收SKU数",
  showOverflowTooltip: true,
  minWidth: 140
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
]

const buttOrderPrediction = [
  TABLE_COLS_INDEX,
  BUTTORDER_FORM_1,//产品SKU
  BUTTORDER_FORM_2,//产品名称
  BUTTORDER_FORM_5,//商品毛重(KG)
  BUTTORDER_FORM_12,//长
  BUTTORDER_FORM_13,//宽
  BUTTORDER_FORM_14,//高
  BUTTORDER_FORM_6,//商品体积(CBM)
  BUTTORDER_FORM_15,//预收SKU数
  BUTTORDER_FORM_16,//已收SKU数
  BUTTORDER_FORM_3,//Shipment ID(箱序号)
  BUTTORDER_FORM_4,//Reference ID
]

export const buttOrderTableList = (row = {}) => {
  const { index } = row
  const tableList = [ buttOrderVerify , buttOrderPrediction ]
  return tableList[index]
}

export const buttOrderTotal = (tName) => {
  return {
    0: [
      {
        label: "商品毛重",
        value: "verifyWeight",
        decimal:3
      },
      {
        label: "商品体积",
        value: "verifyVolume",
        decimal:3
      },
      {
        label: "毛重小计",
        value: "verifyTotleWeight",
        decimal:3
      },
      {
        label: "体积小计",
        value: "verifyTotleVolume",
        decimal:3
      },
      {
        label: "已收SKU数量",
        value: "verifyFreightNum",
      },
    ],
    1: [
      {
        label: "毛重小计",
        value: "preWeight",
        verifyParams:'verifyTotleWeight',
        decimal:3
      },
      {
        label: "体积小计",
        value: "preVolume",
        verifyParams:'verifyTotleVolume',
        decimal:3
      },
      {
        label: "合计箱数",
        value: "preForecastSkuNum",
        verifyParams:'preTakeFreightSkuNum',
        decimal:3
      },
      {
        label: "已收SKU数量",
        value: "preTakeFreightSkuNum",
      },
    ],
  }[tName];
};
