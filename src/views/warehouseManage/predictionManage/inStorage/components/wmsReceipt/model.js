import overseaLangObj from "@/language/overseasLang.js";
import { MAX_PRODUCT_LWH, MAX_BOX_WEIGHT, MIN_PRODUCT_NUM, MAX_PRODUCT_NUM } from "@/utils/instructions.js"
const WMS_RECEIVED_TABLE_COL_1 = {
  type: 'index',
  width: 50,
  align: "center"
}
const WMS_TABLE_COL_1 = {
  type: 'selection',
  width: 50,
  align: "center"
}
const WMS_TABLE_COL_2 = {
  prop: "boxSn",
  label: overseaLangObj.xh_container_no || "箱号",
  showOverflowTooltip: true,
}
const WMS_TABLE_COL_3 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  showOverflowTooltip: true
}
const WMS_TABLE_COL_4 = {
  prop: "boxSkuLong",
  label: overseaLangObj.c_length() || "长(CM)",
  align: "right",
  showOverflowTooltip: true,
}
const WMS_TABLE_COL_5 = {
  prop: "boxSkuWide",
  label: overseaLangObj.k_width() || "宽(CM)",
  align: "right",
  showOverflowTooltip: true,
}
const WMS_TABLE_COL_6 = {
  prop: "boxSkuHigh",
  label: overseaLangObj.g_height() || "高(CM)",
  align: "right",
  showOverflowTooltip: true,
}
const WMS_TABLE_COL_7 = {
  prop: "skuNum",
  label: overseaLangObj.sku_total || "SKU总数",
  decimal: 0,
  align: "right",
  showOverflowTooltip: true
}
const WMS_TABLE_COL_8 = {
  prop: "enterWarehouse",
  label: overseaLangObj.storage_type || "存库方式",
  showOverflowTooltip: true,
  fontColor: true,
  // customRow: true,
  minWidth: 120,
  basicType: "storageType",
  basicTypeVal: "storageType"
}
const WMS_TABLE_COL_9 = {
  prop: "predictionNum",
  label: overseaLangObj.xs_forecast || "预收箱数",
  minWidth: 90,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true,
}
const WMS_TABLE_COL_10 = {
  prop: "arrivalNum",
  label: overseaLangObj.ys_xs || "已收箱数",
  minWidth: 90,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true,
}
const WMS_TABLE_COL_11 = {
  prop: "takeAmountBox",
  label: overseaLangObj.sh_xs || "收货箱数",
  minWidth: 120,
  align: "right",
  showOverflowTooltip: true,
  config: {
    max: MAX_PRODUCT_NUM,
    decimal: 0,
  }
}

const WMS_TABLE_COL_12 = {
  prop: "boxVolume",
  label: overseaLangObj.lf_cbm("立方(CBM)"),
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 3,
  align: "right"
}

const WMS_TABLE_COL_13 = {
  prop: "boxWeight",
  label: overseaLangObj.sp_mz || "商品毛重(KG)",
  showOverflowTooltip: true,
  minWidth: 120,
  align: "right",
}

const WMS_TABLE_COL_14 = {
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
const WMS_TABLE_COL_15 = {
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
const WMS_TABLE_COL_16 = {
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
const WMS_TABLE_COL_17 = {
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
const WMS_TABLE_COL_18 = {
  prop: "verifySkuVolume",
  label: overseaLangObj.ks_volume("核实立方(CBM)"),
  showOverflowTooltip: true,
  minWidth: 116,
  decimal: 3,
  align: "right"
}

const WMS_TABLE_COL_99 = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 120,
  fixed:"right",
  customRow: true
}


const WMS_TABLE_COL_202 = {
  prop: "skuName",
  label: overseaLangObj.cp_name || "产品名称",
  minWidth: 120,
  showOverflowTooltip: true
}


export const wmsTableCols = (tName, isSee = false) => {
  const WMS_TABLE_COL_IS_EDIT = WMS_TABLE_COL_1
  const WMS_TABLE_COLS_1 = [
    WMS_TABLE_COL_IS_EDIT,
    WMS_TABLE_COL_2,
    WMS_TABLE_COL_3,
    WMS_TABLE_COL_4,
    WMS_TABLE_COL_5,
    WMS_TABLE_COL_6,
    WMS_TABLE_COL_7,
    WMS_TABLE_COL_8,
    WMS_TABLE_COL_9,
    WMS_TABLE_COL_10,
    {
      ...WMS_TABLE_COL_11,
      customRow: true
    }
  ]

  const WMS_TABLE_COLS_2 = [
    WMS_TABLE_COL_IS_EDIT,
    {
      ...WMS_TABLE_COL_3,
      label: "SKU",
      customRow: true,
      minWidth: 120,
    },
    WMS_TABLE_COL_202,
		WMS_TABLE_COL_2,

		WMS_TABLE_COL_14,
		WMS_TABLE_COL_15,
		WMS_TABLE_COL_16,
		WMS_TABLE_COL_17,
		WMS_TABLE_COL_18,

		WMS_TABLE_COL_13,
    WMS_TABLE_COL_4,
    WMS_TABLE_COL_5,
    WMS_TABLE_COL_6,
    WMS_TABLE_COL_12,
    {
      ...WMS_TABLE_COL_9,
      label: overseaLangObj.ys_sku_num || "预收SKU数"
    },
    {
      ...WMS_TABLE_COL_10,
      label: overseaLangObj.received_sku_num || "已收SKU数"
    },
    {
      ...WMS_TABLE_COL_11,
      customRow: true,
      label: overseaLangObj.sh_num || "收货数量"
    },
    WMS_TABLE_COL_99
  ]
  return [WMS_TABLE_COLS_1, WMS_TABLE_COLS_2][tName - 1];
}


const WMS_RECEIVED_TABLE_COL_3 = {
  prop: "num",
  label: overseaLangObj.ys_xs || "已收箱数",
  showOverflowTooltip: true,
  customRow: true,
  customSlot: true,
  minWidth: 150,
  config: {
    max: MAX_PRODUCT_NUM,
    decimal: 0,
  }

}
const WMS_RECEIVED_TABLE_COL_4 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number() || "托盘号",
  showOverflowTooltip: true,
  minWidth: 150
}
const WMS_RECEIVED_TABLE_COL_5 = {
  prop: "time",
  label: overseaLangObj.last_modified() || "最后修改时间",
  width: "150px",
  showOverflowTooltip: true
}

// 收货信息
export const wmsReceivedTableCols = (tName, isSee = false) => {
  let WMS_RECEIVED_TABLE_COLS_1 = [
    WMS_RECEIVED_TABLE_COL_1,
    WMS_TABLE_COL_2,
    WMS_TABLE_COL_3,
    WMS_RECEIVED_TABLE_COL_3,
    WMS_RECEIVED_TABLE_COL_4,
    WMS_RECEIVED_TABLE_COL_5,
    WMS_TABLE_COL_99
  ]
  let WMS_RECEIVED_TABLE_COLS_2 = [
    WMS_RECEIVED_TABLE_COL_1,
    {
      ...WMS_TABLE_COL_3,
      label: "SKU",
    },
    WMS_TABLE_COL_202,
    WMS_TABLE_COL_2,
    {
      ...WMS_RECEIVED_TABLE_COL_3,
      label: overseaLangObj.ys_num || "已收数量"
    },
    WMS_RECEIVED_TABLE_COL_4,
    WMS_RECEIVED_TABLE_COL_5,
    WMS_TABLE_COL_99
  ]
  return [WMS_RECEIVED_TABLE_COLS_1, WMS_RECEIVED_TABLE_COLS_2][tName - 1];
}







export const wmsReceivedTotalLists=[
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
