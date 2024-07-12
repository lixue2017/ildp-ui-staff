import overseaLangObj from "@/language/overseasLang.js";

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COL_1 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  width: 120,
  fixed: "left",
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_2 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer_name || "客户名称",
  width: 140,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_3 = {
  prop: "headTransportMode",
  label: overseaLangObj.tc_xs_fs || "头程运输方式",
  width: 130,
  showOverflowTooltip: true,
  basicType: "headTransportMode",
};
const TABLE_COL_4 = {
  prop: "vatNo",
  label: "VAT No.",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "shipmentId",
  label: "Shipment ID",
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "referenceId",
  label: "Reference ID",
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "pltNum",
  label: overseaLangObj.plt_tps || "PLT(托盘数)",
  width: 100,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_8 = {
  prop: "forecastNum",
  label: overseaLangObj.yb_sl || "预报数量",
  width: 120,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "forecastVolume",
  label: overseaLangObj.yb_volume("预报体积/CBM"),
  width: 140,
  decimal: 2,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_10 = {
  prop: "outWarehouseWay",
  label: overseaLangObj.wc_xs_fs || "尾程运输方式",
  width: 130,
  showOverflowTooltip: true,
  basicType: "outWarehouseWay",
};
const TABLE_COL_11 = {
  prop: "deliveryCode",
  label: overseaLangObj.cmr_kc_bh || "CMR号(卡车编号)",
  width: 160,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "receivingCompanyName",
  label: overseaLangObj.sh_gs_nc || "收货公司名称",
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "targetWmsAddress",
  label: overseaLangObj.md_c_dz("目的仓地址"),
  minWidth: 156,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_14 = {
  prop: "forecastWeight",
  label: overseaLangObj.yb_weight("预报重量/KGS"),
  width: 140,
  decimal: 2,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_15 = {
  prop: "domesticRegistrationSn",
  label: overseaLangObj.gn_djh || "国内登记号",
  width: 120,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "receivedNum",
  label: overseaLangObj.sh_num || "收货数量",
  width: 120,
  decimal: 0,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_17 = {
  prop: "deliveryNum",
  label: overseaLangObj.hs_sl("派送数量"),
  width: 120,
  decimal: 0,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
};
const TABLE_COL_18 = {
  prop: "deliveryVolume",
  label: overseaLangObj.ks_volume("派送体积/CBM"),
  width: 133,
  decimal: 2,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
};
const TABLE_COL_19 = {
  prop: "deliveryWeight",
  label: overseaLangObj.ks_weight("派送重量/KGS"),
  width: 133,
  decimal: 2,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
};
const TABLE_COL_20 = {
  prop: "deliveryType",
  label: overseaLangObj.delivery_ps_fs || "派送方式",
  width: 80,
  showOverflowTooltip: true,
  basicType: "distributionType",
  customRow: true,
};
const TABLE_COL_21 = {
  prop: "deliveryTime",
  label: overseaLangObj.dj_sj || "登记时间",
  width: 136,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_22 = {
  prop: "deliveryState",
  label: overseaLangObj.zt_status_fn("派送状态"),
  width: 90,
  showOverflowTooltip: true,
  customRow: true,
  basicType: "distributionPlanKcState",
};
const TABLE_COL_23 = {
  prop: "targetWmsName",
  label: overseaLangObj.mdc_warehouse("目的仓"),
  minWidth: 120,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_24 = {
  prop: "storageType",
  label: overseaLangObj.rk_purpose || "入库用途",
  minWidth: 120,
	showOverflowTooltip: true,
	basicType: "warehouseStorage",
};

export const psTableColumns = (obj) => {
  const { psType } = obj || {};
  const COLS_1 = [
    TABLE_COL_INDEX,
    TABLE_COL_15, // 国内登记号
    TABLE_COL_1, // 工作单号
    TABLE_COL_2, // 客户名称
    TABLE_COL_3, // 头程运输方式
    TABLE_COL_10, // 尾程运输方式
    TABLE_COL_12, // 收货公司名称
    TABLE_COL_4, // VAT No.
  ];
  const COLS_2 = [
    TABLE_COL_INDEX,
    TABLE_COL_1, // 工作单号
    {
      ...TABLE_COL_2,
      fixed: "left",
    }, // 客户名称
    TABLE_COL_24, // 入库用途
  ];
  const COLS_COM = [
    TABLE_COL_5, // Shipment ID
    TABLE_COL_6, // Reference ID
    TABLE_COL_8, // 预报数量
    TABLE_COL_9, // 预报体积
    TABLE_COL_14, // 预报重量
    TABLE_COL_16, // 收货数量
    TABLE_COL_17, // 派送数量
    TABLE_COL_18, // 派送体积
    TABLE_COL_19, // 派送重量
    TABLE_COL_23, // 目的仓
    TABLE_COL_13, // 目的仓地址
    TABLE_COL_7, // PLT(托盘数)
    TABLE_COL_20, //派送方式
    TABLE_COL_21, // 登记时间
    TABLE_COL_22, // 派送状态
    TABLE_COL_11, // CMR号(卡车编号)
  ];
  return psType == 2 ? [...COLS_2, ...COLS_COM] : [...COLS_1, ...COLS_COM];
};

const TABLE_COL_201 = {
  prop: "sku",
  label: "SKU",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_202 = {
  prop: "num",
  label: overseaLangObj.hs_sl("上架数量"),
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
};
const TABLE_COL_203 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number("托盘号"),
  minWidth: 120,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_204 = {
  prop: "localCode",
  label: overseaLangObj.kw_location("库位号"),
  minWidth: 120,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_205 = {
  prop: "receiptType",
  label: overseaLangObj.cc_fs || "存仓方式",
  minWidth: 120,
  showOverflowTooltip: true,
  customRow: true,
  basicType: "xx_dict",
};

export const storageTableCols = (obj) => {
  const { psType } = obj || {};
  const COLS_1 = [
    TABLE_COL_INDEX,
    TABLE_COL_15, // 国内登记号
    TABLE_COL_1, // 工作单号
    TABLE_COL_2, // 客户名称
    TABLE_COL_10, // 尾程运输方式
  ];
  const COLS_2 = [
    TABLE_COL_INDEX,
    TABLE_COL_1, // 工作单号
    {
      ...TABLE_COL_2,
      fixed: "left",
    }, // 客户名称
    TABLE_COL_24, // 入库用途
  ];
  const COLS_COM = [
    TABLE_COL_5, // Shipment ID
    TABLE_COL_6, // Reference ID
    ...(psType != 2 ? [TABLE_COL_201] : []), // sku
    TABLE_COL_8, // 预报数量
    TABLE_COL_9, // 预报体积
    TABLE_COL_14, // 预报重量
    // TABLE_COL_23, // 目的仓
    TABLE_COL_16, // 收货数量
    TABLE_COL_202, // 上架数量
    TABLE_COL_203, // 托盘号
    TABLE_COL_204, // 库位号
    TABLE_COL_205, // 存仓方式
  ];
  return psType == 2 ? [...COLS_2, ...COLS_COM] : [...COLS_1, ...COLS_COM];
};
