import { MAX_PRODUCT_LWH, MAX_BOX_WEIGHT, MIN_PRODUCT_NUM, MAX_PRODUCT_NUM } from "@/utils/instructions.js"
import overseaLangObj from "@/language/overseasLang.js";

//本MODEL目前仅用于第三方入仓(前WMS)和海外入仓
const TABLE_COLS_INDEX = {
  type: 'index',
  width: 50,
  align: "center"
}

const TABLE_COLS_SELECT = {
  type: 'selection',
  width: 50,
  align: "center"
}

const TABLE_COLS_1 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  showOverflowTooltip: true,
  minWidth: 80
}

const TABLE_COLS_2 = {
  prop: "boxSkuLong",
  label: overseaLangObj.c_length() || "长(CM)",
  showOverflowTooltip: true,
  align: "right",
}

const TABLE_COLS_3 = {
  prop: "boxSkuWide",
  label: overseaLangObj.k_width() || "宽(CM)",
  showOverflowTooltip: true,
  align: "right",
}

const TABLE_COLS_4 = {
  prop: "boxSkuHigh",
  label: overseaLangObj.g_height() || "高(CM)",
  showOverflowTooltip: true,
  align: "right",
}

const TABLE_COLS_5 = {
  prop: "enterWarehouse",
  label: overseaLangObj.storage_type || "存库方式",
  showOverflowTooltip: true,
  fontColor: true,
  // customRow: true,
  minWidth: 80,
  basicType: "storageType",
  basicTypeVal: "storageType"
}

const TABLE_COLS_6 = {
  prop: "predictionNum",
  label: overseaLangObj.xs_forecast || "预收箱数",
  showOverflowTooltip: true,
  minWidth: 80,
  decimal: 0,
  align: "right"
}

const TABLE_COLS_7 = {
  prop: "arrivalNum",
  label: overseaLangObj.ys_xs || "已收箱数",
  showOverflowTooltip: true,
  minWidth: 80,
  decimal: 0,
  align: "right"
}

const TABLE_COLS_8 = {
  prop: "shipmentId",
	label: `Shipment ID(${overseaLangObj.box_number || "箱序号"})`,
  showOverflowTooltip: true,
  minWidth: 160,
}

const TABLE_COLS_9 = {
  prop: "referenceId",
  label: "Reference ID",
  showOverflowTooltip: true,
  minWidth: 110,
}

const TABLE_COLS_10 = {
  prop: "boxVolume",
  label: overseaLangObj.dx_tj_volume() || "单箱体积(CBM)",
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 3,
  align: "right"
}

const TABLE_COLS_11 = {
  prop: "boxWeight",
  label: overseaLangObj.dx_mz || "单箱毛重(KG)",
  showOverflowTooltip: true,
  minWidth: 110,
	decimal: 2,
  align: "right",
}

const TABLE_COLS_12 = {
  prop: "consigneeWarehouseCode",
  label: overseaLangObj.place_of_receipt || "目的地",
  showOverflowTooltip: true,
  minWidth: 140
}

const TABLE_COLS_13 = {
  prop: "skuName",
  label: overseaLangObj.cp_name || "产品名称",
  showOverflowTooltip: true
}

const TABLE_COLS_14 = {
  prop: "num",
  label: overseaLangObj.sh_num || "收货数量",
  showOverflowTooltip: true,
  customRow: true,
  customSlot: true,
  minWidth: 120,
  config: {
    max: MAX_PRODUCT_NUM,
    decimal: 0
  }
}

const TABLE_COLS_15 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number() || "托盘号",
  showOverflowTooltip: true,
  minWidth: 150
}

const TABLE_COLS_16 = {
  prop: "time",
  label: overseaLangObj.last_modified() || "最后修改时间",
  width: "150px",
  showOverflowTooltip: true
}



const TABLE_COLS_17 = {
  prop: "verifySkuWeight",
  label: overseaLangObj.hs_mz_kg("核实商品毛重(KG)"),
  showOverflowTooltip: true,
  minWidth: 125,
  customRow: true,
  align: "right",
  config: {
    max: MAX_BOX_WEIGHT,
    decimal: 2,
  }
}
const TABLE_COLS_18 = {
  prop: "verifySkuLong",
	label: overseaLangObj.hs_length("核实长(CM)"),
	minWidth: 90,
  align: "right",
	showOverflowTooltip: true,
	customRow: true,
  config: {
    max: MAX_PRODUCT_LWH,
    decimal: 1,
  }
}
const TABLE_COLS_19 = {
  prop: "verifySkuWide",
	label: overseaLangObj.hs_width("核实宽(CM)"),
	minWidth: 90,
  align: "right",
	showOverflowTooltip: true,
	customRow: true,
  config: {
    max: MAX_PRODUCT_LWH,
    decimal: 1,
  }
}
const TABLE_COLS_20 = {
  prop: "verifySkuHigh",
	label: overseaLangObj.hs_height("核实高(CM)"),
	minWidth: 90,
  align: "right",
	showOverflowTooltip: true,
	customRow: true,
  config: {
    max: MAX_PRODUCT_LWH,
    decimal: 1,
  }
}
const TABLE_COLS_21 = {
  prop: "verifySkuVolume",
  label: overseaLangObj.ks_volume("核实体积(CBM)"),
  showOverflowTooltip: true,
  minWidth: 116,
  decimal: 3,
  align: "right"
}

const TABLE_COLS_OPERTATION = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 120,
  fixed: "right",
  customRow: true
}

const overSeaWarehousePrediction = (isSee) => {
  //海外仓入仓
  return [
    [
      TABLE_COLS_SELECT,
      TABLE_COLS_INDEX,
      TABLE_COLS_8,
      TABLE_COLS_9,
      TABLE_COLS_1,
      {
        ...TABLE_COLS_2,
        prop: "boxLong",
        label: overseaLangObj.xc_length || "箱长(CM)",
      },
      {
        ...TABLE_COLS_3,
        prop: "boxWide",
        label: overseaLangObj.xk_width || "箱宽(CM)"
      },
      {
        ...TABLE_COLS_4,
        prop: "boxHigh",
        label: overseaLangObj.xg_height || "箱高(CM)",
      },
      TABLE_COLS_10,
      TABLE_COLS_11,
      TABLE_COLS_12,
      {
        ...TABLE_COLS_5,
        prop: "storageType",
        basicType: "warehouseStorage"
      },
      {
        ...TABLE_COLS_6,
        label: overseaLangObj.forecast_box_count || "预报箱数",
      },
      {
        ...TABLE_COLS_7,
        label: overseaLangObj.sh_xs || "收货箱数",
      },
      {
        ...TABLE_COLS_14,
        decimal: 0
      }
    ],
    [
      TABLE_COLS_SELECT,
      TABLE_COLS_INDEX,
      {
        ...TABLE_COLS_1,
        label: "SKU",
        customRow: true
      },
			TABLE_COLS_13,
			TABLE_COLS_17,
			TABLE_COLS_18,
			TABLE_COLS_19,
			TABLE_COLS_20,
			TABLE_COLS_21,
			{
        ...TABLE_COLS_11,
        prop: "skuWeight",
        label: overseaLangObj.sp_mz || "商品毛重(KG)",
      },
      {
        ...TABLE_COLS_2,
        prop: "skuLong",
        label: overseaLangObj.c_length() || "长(CM)",
      },
      {
        ...TABLE_COLS_3,
        prop: "skuWide",
        label: overseaLangObj.k_width() || "宽(CM)",
      },
      {
        ...TABLE_COLS_4,
        prop: "skuHigh",
        label: overseaLangObj.g_height() || "高(CM)",
      },
      {
        ...TABLE_COLS_10,
        label: overseaLangObj.tj_volume || "体积(CBM)",
        minWidth: 100,
        prop: "skuVolume"
      },
      {
        ...TABLE_COLS_6,
        minWidth: 100,
        label: overseaLangObj.ys_sku_num || "预收SKU数",
      },
      {
        ...TABLE_COLS_7,
        minWidth: 100,
        label: overseaLangObj.received_sku_num || "已收SKU数",
      },
      {
        ...TABLE_COLS_14,
        decimal: 0
      },
      {
        ...TABLE_COLS_8,
        prop: "shipmentIds",
        customRow: true,
      },
      {
        ...TABLE_COLS_9,
        prop: "referenceIds",
        customRow: true,
      }
    ]
  ]
}

const overSeaWarehouseReceivedGood = (isSee) => {
  return [
    [
      TABLE_COLS_INDEX,
      TABLE_COLS_8,
      TABLE_COLS_9,
      TABLE_COLS_1,
      TABLE_COLS_12,
      TABLE_COLS_14,
      TABLE_COLS_15,
      TABLE_COLS_16,
      TABLE_COLS_OPERTATION
    ],
    [
      TABLE_COLS_INDEX,
      {
        ...TABLE_COLS_1,
        label: "SKU",
      },
      TABLE_COLS_13,
      TABLE_COLS_8,
      TABLE_COLS_9,
      TABLE_COLS_14,
      TABLE_COLS_15,
      TABLE_COLS_16,
      TABLE_COLS_OPERTATION
    ]
  ]
}


export const overSeaWarehousePredictionCols = (tName, isSee = false) => {
  //预报货物
  const tableArr = overSeaWarehousePrediction(isSee)[tName - 1].filter((e) => e.type || e.prop)
  if (tName == 2) {
    tableArr.push(TABLE_COLS_OPERTATION);
  }
  return tableArr;
}


export const overSeaWarehouseReceivedGoodCols = (tName, isSee = false) => {
  //收货信息
  const tableArr = overSeaWarehouseReceivedGood(isSee)[tName - 1]
  return tableArr;
}



export const overSeaTotalLists=[
  {
    label: "合计已收箱数",
    value: "num",
  },
  {
    label: "合计托盘数",
    getParamLength:true,
    value: "traySn",
  },
]
