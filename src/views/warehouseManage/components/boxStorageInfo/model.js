import overseaLangObj from "@/language/overseasLang.js";

const TABLE_COLS_INDEX = {
  type: 'index',
  width: 50,
  align: "center"
}

const TABLE_COLS_1 = {
  prop: "shipmentId",
  label: "Shipment ID",
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
  label: overseaLangObj.dx_mz || "单箱毛重(KG)",
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
  minWidth: 120,
}
const TABLE_COLS_4 = {
  prop: "length",
  label: overseaLangObj.xc_length || "箱长(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  prop: "width",
  label: overseaLangObj.xk_width || "箱宽(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_6 = {
  prop: "height",
  label: overseaLangObj.xg_height || "箱高(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_7 = {
  prop: "volume",
  label: overseaLangObj.dx_tj_volume() || "单箱体积(CBM)",
  showOverflowTooltip: true,
  decimal: 3,
  align: "right",
  minWidth: 120,
}
const TABLE_COLS_8 = {
  prop: "consigneeWarehouseCode",
  label: overseaLangObj.place_of_receipt || "目的地",
  showOverflowTooltip: true,
}
const TABLE_COLS_9 = {
  prop: "storageWay",
  label: overseaLangObj.cc_fs || "存仓方式",
  showOverflowTooltip: true,
  minWidth: 100,
  fontColor: true,
  dicsStr: 'storageWay',
  customDicsArr: [0, 1], // 对象属性名
  customDicsVal: "storageWay"
  // basicType: "storageType",
  // basicTypeVal: "storageType"
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
  label: overseaLangObj.xs_forecast || "预计箱数",
  align: "right",
  decimal: 0,
  showOverflowTooltip: true,
}
const TABLE_COLS_14 = {
  label: overseaLangObj.subtotal_of_volume || "体积小计(CBM)",
  prop: "volume",
  align: 'right',
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 3
}
const TABLE_COLS_15 = {
  label: overseaLangObj.subtotal_gross_weight || "毛重小计(KG)",
  prop: "weight",
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
};
const TABLE_COLS_17 = {
  labelTop: overseaLangObj.sku_mt || 'SKU(唛头)',
  labelBottom: overseaLangObj.mc_name || '名称',
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
  labelTop: overseaLangObj.product_weight('产品重量(KG)'),
  labelBottom: overseaLangObj.product_net_weight || '产品净重(KG)',
  prop: "weight",
  customRow: true,
  customHeader: true,
  decimal: 3,
  showOverflowTooltip: true,
}
const TABLE_COLS_20 = {
  labelTop: overseaLangObj.jg_declared || '申报价格',
  labelBottom: overseaLangObj.sl_num || '数量',
  prop: "declaredValue",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_21 = {
  labelTop: overseaLangObj.xh_model || '型号',
  labelBottom: overseaLangObj.pp_brand || '品牌',
  prop: "productModel",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_22 = {
  labelTop: overseaLangObj.product_ingredient || '产品成分',
  labelBottom: overseaLangObj.product_uses || '产品用途',
  prop: "businessUse",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_23 = {
  labelTop: 'Shipment ID',
  labelBottom: overseaLangObj.xh_container_no || '箱号',
  prop: "shipmentId",
  customRow: true,
  customHeader: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_24 = {
  prop: "boxSn",
  label: overseaLangObj.xh_container_no || "箱号",
  showOverflowTooltip: true,
}
const TABLE_COLS_25 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  showOverflowTooltip: true
}
const TABLE_COLS_26 = {
  prop: "skuName",
  label: "产品名称",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_27 = {
  prop: "storageType",
  label: overseaLangObj.storage_type || "存库方式",
  showOverflowTooltip: true,
  fontColor: true,
  // customRow: true,
  minWidth: 100,
  basicType: "warehouseStorage"
}

const TABLE_COL_OPERATION = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  minWidth: 80,
};

const buttOrderBoxPrediction = [
  //对接电商按箱已收货信息
  TABLE_COLS_INDEX,
  TABLE_COLS_1,//Shipment ID
  TABLE_COLS_2,//Reference ID
  TABLE_COLS_3,//单箱毛重KG
  TABLE_COLS_4,//箱长
  TABLE_COLS_5,//箱宽
  TABLE_COLS_6,//箱高
  {
    ...TABLE_COLS_7,
    decimal:2
  },//单箱体积
  {
    ...TABLE_COLS_8,
    prop: "destination"
  },//目的地
  {
    ...TABLE_COLS_9,
    render: (row) => {
      const { storageWay, type } = row;
      return storageWay == 0
        ? type == 0
          ? overseaLangObj.sku_storage || "sku存仓"
          : overseaLangObj.box_storage || "装箱存仓"
        : overseaLangObj.large_cargo_transit || "大货中转";
    },
  },//存仓方式
  {
    ...TABLE_COLS_10,
    prop: 'freightNum'
  },//已收箱数
  TABLE_COLS_11,//托盘号
  TABLE_COLS_12,//最后修改时间
	TABLE_COL_OPERATION, // 操作
]

const buttOrderBoxVerify = [
  //对接电商按箱预报货物信息
  TABLE_COLS_INDEX,
  TABLE_COLS_1,//Shipment ID
  TABLE_COLS_2,//Reference ID
  TABLE_COLS_15,//毛重小计
  TABLE_COLS_4,//箱长
  TABLE_COLS_5,//箱宽
  TABLE_COLS_6,//箱高
  {
    ...TABLE_COLS_14,
    decimal:2
  },//体积小计
  {
    ...TABLE_COLS_8,
    prop: "sourceDestination",
  }, //目的地
  {
    ...TABLE_COLS_9,
    render: (r) => {
      return r.sourceStorageWay == 0
        ? r.sourceType == 0
          ? overseaLangObj.sku_storage
          : overseaLangObj.box_storage
        : overseaLangObj.large_cargo_transit;
    },
  }, //存仓方式
  TABLE_COLS_13,//预报箱数
  TABLE_COLS_10,//已收箱数
]

const buttOrderBoxProduct = [
  //对接按箱电商产品信息
  TABLE_COLS_INDEX,
  TABLE_COLS_16,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
  TABLE_COLS_20,
  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_23,
]


export const buttOrderTableList = (row) => {
  const { index } = row
  const tableList = [buttOrderBoxPrediction, buttOrderBoxVerify, buttOrderBoxProduct]
  return tableList[index]
}



export const buttOrderTotal = (tName) => {
  //0是已核实  1是预报
  return {
    0: [
      {
        label: "毛重小计",
        value: "verifyWeight",
        decimal:3
      },
      {
        label: "体积小计",
        value: "verifyVolume",
        decimal:3
      },
      {
        label: "已收箱数",
        value: "verifyFreightNum",
      },
    ],
    1: [
      {
        label: "毛重小计",
        value: "preWeight",
        verifyParams:'verifyWeight',
        decimal:3
      },
      {
        label: "体积小计",
        value: "preVolume",
        verifyParams:'verifyVolume',
        decimal:3
      },
      {
        label: "预报箱数",
        value: "preForecastBoxNum",
        verifyParams:'preTakeFreightBoxNum',
        decimal:3
      },
      {
        label: "收货箱数量",
        value: "preTakeFreightBoxNum",
      },
    ],
    2: [
      {
        label: "产品种类",
        value: "proLength",
      },
      {
        label: "产品总数",
        value: "proNumTotal",
      },
    ],
  }[tName];
};







const thirdPartyVerify = [
  //第三方按箱已收货信息
  TABLE_COLS_INDEX,
  TABLE_COLS_24,//箱号
  TABLE_COLS_25,//产品SKU
  {
    ...TABLE_COLS_3,
    prop: "boxWeight"
  },//单箱毛重
  {
    ...TABLE_COLS_7,
    prop: 'boxVolume'
  },//单箱体积
  {
    ...TABLE_COLS_10,
    prop: "num"
  },//已收箱数
  // TABLE_COLS_8,//目的地
  TABLE_COLS_27,// 存仓方式
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
  //第三方按箱预报货物信息
  TABLE_COLS_INDEX,
  TABLE_COLS_24,//箱号
  TABLE_COLS_25,//产品SKU
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
    prop: 'boxVolume'
  },//单箱体积
  // TABLE_COLS_8,//目的地
	{
		...TABLE_COLS_27,
		prop: "sourceStorageType",
	},// 存仓方式
  {
    ...TABLE_COLS_13,
    prop: "predictionNum"
  },//预报箱数
  {
    ...TABLE_COLS_10,
    prop: "arrivalNum"
  },//已收箱数
]
const thirdPartyProduct = [
  //第三方按箱产品信息
  TABLE_COLS_INDEX,
  TABLE_COLS_16,//SKU
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
  TABLE_COLS_20,
  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_23,
]

export const thirdPartyTableList = (row = {}) => {
  const { index } = row
  const tableList = [thirdPartyVerify, thirdPartyPrediction, thirdPartyProduct]
  return tableList[index]
}



export const thirdPartyTotal = (tName) => {
  //0是已核实  1是预报
  return {
    0: [
      {
        label: "毛重小计",
        value: "verifyBoxWeight",
        decimal:3
      },
      {
        label: "体积小计",
        value: "verifyBoxVolume",
        decimal:3
      },
      {
        label: "已收箱数",
        value: "verifyNum",
      },
    ],
    1: [
      {
        label: "毛重小计",
        value: "preBoxWeight",
        verifyParams:'verifyBoxWeight',
        decimal:3
      },
      {
        label: "体积小计",
        value: "preBoxVolume",
        verifyParams:'verifyBoxVolume',
        decimal:3
      },
      {
        label: "预报箱数",
        value: "prePredictionNum",
        verifyParams:'preArrivalNum',
      },
      {
        label: "收货箱数量",
        value: "preArrivalNum",
      },
    ],
    2: [
      {
        label: "产品种类",
        value: "proLength",
      },
      {
        label: "产品总数",
        value: "proNumTotal",
      },
    ],
  }[tName];
};
const overSeasVerify = [
  //海外入仓按箱已收货信息
  TABLE_COLS_INDEX,
  {
    ...TABLE_COLS_1,
    label: `Shipment ID(${overseaLangObj.box_number || "箱序号"})`
  },//Shipment ID
  TABLE_COLS_2,//Reference ID
  TABLE_COLS_25,//产品SKU
  {
    ...TABLE_COLS_3,
    prop: "boxVolume"
  },//单箱毛重
  {
    ...TABLE_COLS_7,
    prop: "boxWeight"
  },//单箱体积
  {
    ...TABLE_COLS_14,
    prop: "boxWeightSum"
  },//毛重小计
  {
    ...TABLE_COLS_15,
    prop: "boxVolumeSum"
  },//体积小计
  {
    ...TABLE_COLS_10,
    prop: "num"
  },//已收箱数
  TABLE_COLS_8,//目的地
  TABLE_COLS_27,// 存仓方式
  {
    ...TABLE_COLS_11,
    prop: "traySn"
  },//托盘号
  {
    ...TABLE_COLS_12,
    prop: 'time'
  },//最后修改时间
	TABLE_COL_OPERATION, // 操作
]
const overSeasPrediction = [
  //海外入仓按箱预报货物信息
  TABLE_COLS_INDEX,
  {
    ...TABLE_COLS_1,
    label: `Shipment ID(${overseaLangObj.box_number || "箱序号"})`
  },//Shipment ID
  TABLE_COLS_2,//Reference ID
  TABLE_COLS_25,//产品SKU
  {
    ...TABLE_COLS_3,
    prop: "boxWeight"
  },//单箱毛重
  {
    ...TABLE_COLS_4,
    prop: 'boxLong'
  },//箱长
  {
    ...TABLE_COLS_5,
    prop: 'boxWide'
  },//箱宽
  {
    ...TABLE_COLS_6,
    prop: 'boxHigh'
  },//箱高
  {
    ...TABLE_COLS_7,
    prop: "boxVolume"
  },//单箱体积
  TABLE_COLS_8,//目的地
	{
		...TABLE_COLS_27,
		prop: "sourceStorageType",
	},// 存仓方式
  {
    ...TABLE_COLS_13,
    prop: "predictionNum"
  },//预报箱数
  {
    ...TABLE_COLS_10,
    prop: "arrivalNum"
  },//已收箱数
]
const overSeasProduct = [
  //海外入仓按箱产品信息
  TABLE_COLS_INDEX,
  TABLE_COLS_16,//SKU
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
  TABLE_COLS_20,
  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_23,
]


export const overSeasTableList = (row = {}) => {
  const { index } = row
  const tableList = [overSeasVerify, overSeasPrediction, overSeasProduct]
  return tableList[index]
}







export const overSeasTotal = (tName) => {
  //0是已核实  1是预报
  return {
    0: [
      {
        label: "毛重小计",
        value: "verifyBoxWeightSum",
        decimal:3
      },
      {
        label: "体积小计",
        value: "verifyBoxVolumeSum",
        decimal:3
      },
      {
        label: "已收箱数",
        value: "verifyNum",
      },
    ],
    1: [
      {
        label: "毛重小计",
        value: "preBoxWeight",
        verifyParams:'verifyBoxWeightSum',
        decimal:3
      },
      {
        label: "体积小计",
        value: "preBoxVolume",
        verifyParams:'verifyBoxVolumeSum',
        decimal:3
      },
      {
        label: "预报箱数",
        value: "prePredictionNum",
        verifyParams:'preArrivalNum',
      },
      {
        label: "收货箱数量",
        value: "preArrivalNum",
      },
    ],
    2: [
      {
        label: "产品种类",
        value: "proLength",
      },
      {
        label: "产品总数",
        value: "proNumTotal",
      },
    ],
  }[tName];
};
