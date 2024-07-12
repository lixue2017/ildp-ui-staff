import overseaLangObj from "@/language/overseasLang.js";

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COL_1 = {
  prop: "domesticRegistrationSn",
  label: overseaLangObj.gn_djh || "国内登记号",
  width: 120,
  fixed: "left",
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_2 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  width: 120,
  fixed: "left",
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_3 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer_name || "客户名称",
  width: 140,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_4 = {
  prop: "headTransportMode",
  label: overseaLangObj.tc_xs_fs || "头程运输方式",
  width: 100,
  showOverflowTooltip: true,
  basicType: "headTransportMode",
};
const TABLE_COL_5 = {
  prop: "outWarehouseWay",
  label: overseaLangObj.wc_xs_fs || "尾程运输方式",
  width: 100,
  showOverflowTooltip: true,
  basicType: "outWarehouseWay",
  fontColor: true,
};
const TABLE_COL_6 = {
  prop: "receivingCompanyName",
  label: overseaLangObj.sh_gs_nc || "收货公司名称",
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "targetWmsName",
  label: overseaLangObj.mdc_warehouse("目的仓"),
  minWidth: 120,
  showOverflowTooltip: true,
  render: (r) => `${r.targetWmsCode || "--"}/${r.targetWmsName || "--"}`,
};

const TABLE_COL_8 = {
  prop: "shipmentId",
  label: "Shipment ID",
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "referenceId",
  label: "Reference ID",
  width: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "sku",
  label: "SKU",
  minWidth: 120,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_11 = {
  prop: "forecastNum",
  label: overseaLangObj.yb_sl || "预报数量",
  width: 80,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_12 = {
  prop: "forecastVolume",
  label: overseaLangObj.yb_volume("预报体积/CBM"),
  width: 110,
  decimal: 2,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
};
const TABLE_COL_13 = {
  prop: "forecastWeight",
  label: overseaLangObj.yb_weight("预报重量/KGS"),
  width: 110,
  decimal: 2,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
};
const TABLE_COL_14 = {
  prop: "receivedNum",
  label: overseaLangObj.sh_num || "收货数量",
  width: 80,
  decimal: 0,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
};
const TABLE_COL_15 = {
  prop: "rowCabinetSort",
  label: "装柜顺序",
  width: 100,
  showOverflowTooltip: true,
  sortable: true,
};

const TABLE_COL_201 = {
  prop: "shipmentId",
  label: `Shipment ID(${overseaLangObj.box_number || "箱序号"})`,
  width: 148,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_202 = {
  prop: "referenceId",
  label: "Reference ID",
  width: 140,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_203 = {
  prop: "boxLong",
  label: overseaLangObj.xc_length || "箱长(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
};
const TABLE_COL_204 = {
  prop: "boxWide",
  label: overseaLangObj.xk_width || "箱宽(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
};
const TABLE_COL_205 = {
  prop: "boxHigh",
  label: overseaLangObj.xg_height || "箱高(CM)",
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
};
const TABLE_COL_206 = {
  prop: "boxWeight",
  label: overseaLangObj.dx_mz || "单箱毛重(KG)",
  showOverflowTooltip: true,
  decimal: 2,
  align: "right",
  minWidth: 120,
};
const TABLE_COL_207 = {
  prop: "storageType",
  label: overseaLangObj.rk_purpose || "入库用途",
  showOverflowTooltip: true,
  basicType: "storageType",
};
const TABLE_COL_208 = {
  prop: "targetWmsCode",
  label: overseaLangObj.place_of_receipt || "目的地",
  showOverflowTooltip: true,
  minWidth: 140,
  render: (r) => `${r.targetWmsCode || "--"}/${r.targetWmsName || "--"}`,
};
const TABLE_COL_209 = {
  prop: "boxVolume",
  label: overseaLangObj.dx_tj_volume("单箱体积(CBM)"),
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 3,
  align: "right",
};

export const hwTableColumns = (obj) => {
  const { tName = "1" } = obj || {};
  const COLS_1 = [
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_15,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_9,
  ];
  const COLS_2 = [
    TABLE_COL_201,
    TABLE_COL_202,
    TABLE_COL_203,
    TABLE_COL_204,
    TABLE_COL_205,
    TABLE_COL_209, // 体积
    TABLE_COL_206, // 毛重
    TABLE_COL_207,
    TABLE_COL_208,
  ];
  return [
    TABLE_COL_INDEX,
    ...[COLS_1, COLS_2][tName - 1],
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
  ];
};
