import { WAREHOUSE_TYPE } from "@/utils/mixin";
import overseaLangObj from "@/language/overseasLang.js";

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center"
}
const TABLE_COL_1 = {
  prop: "code",
  label: overseaLangObj.tc_bm || "拖车编码",
  customRow: true,
  fixed: 'left',
  minWidth: 136,
  showOverflowTooltip: true
}
const TABLE_COL_2 = {
  prop: "shipCompany",
  label: overseaLangObj.shipping_company || "船公司",
  fixed: 'left',
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COL_3 = {
  prop: "sono",
  label: overseaLangObj.so_no || "SO NO号",
  fixed: 'left',
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COL_4 = {
  prop: "shipName",
  label: overseaLangObj.shipping_name || "船名",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_5 = {
  prop: "shipSecond",
  label: overseaLangObj.hc_voyages || "航次",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_6 = {
  prop: "boxCode",
  label: overseaLangObj.zg_xx || "整柜信息",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_7 = {
  prop: "shortName",
  label: overseaLangObj.tch_company || "拖车行",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_8 = {
  prop: "cutGateTime",
  label: "截关时间",
  minWidth: 136,
  showOverflowTooltip: true
}
const TABLE_COL_9 = {
  prop: "pickPort",
  label: "提柜地点",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_10 = {
  prop: "returnPort",
  label: "还柜地点",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_11 = {
  prop: "ontainerSno",
  label: overseaLangObj.xh_container_no || "箱号",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_12 = {
  prop: "sealingStripSno",
  label: "封号",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_13 = {
  prop: "totalWeight",
  label: "货物重量/KG",
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true
}
const TABLE_COL_14 = {
  prop: "weigh",
  label: "过磅",
  minWidth: 100,
  render: row => row.weigh ? '√是' : '否'
}
const TABLE_COL_15 = {
  prop: "stifling",
  label: "熏蒸",
  minWidth: 100,
  render: row => row.stifling ? '√是' : '否'
}
const TABLE_COL_16 = {
  prop: "dispatchRemark",
  label: "调度备注",
  minWidth: 150,
  showOverflowTooltip: true
}
const TABLE_COL_17 = {
  prop: "remark",
  label: overseaLangObj.bz_remark() || "备注",
  minWidth: 150,
  showOverflowTooltip: true
}
const TABLE_COL_18 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: 200
}

export const trailerTableCols = [
  {
    ...TABLE_COL_0,
    fixed: 'left'
  },
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_18
]



const TABLE_ADDRESS_COL_1 = {
  prop: "presentTime",
  label: overseaLangObj.dc_sj || "到场时间",
  minWidth: 136,
  showOverflowTooltip: true
}
const TABLE_ADDRESS_COL_2 = {
  prop: "company",
  label: overseaLangObj.gs_gcm || "公司/工厂名",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_ADDRESS_COL_3 = {
  prop: "xx_address_3",
  label: overseaLangObj.lx_type()|| "类型",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => WAREHOUSE_TYPE[row.addressType]
}
const TABLE_ADDRESS_COL_4 = {
  prop: "contactName",
  label: overseaLangObj.lxr_contacts || "联系人",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_ADDRESS_COL_5 = {
  prop: "contactPhone",
  label: overseaLangObj.lx_dh_telephone() || "联系电话",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_ADDRESS_COL_6 = {
  prop: "addressDetail",
  label: overseaLangObj.dz_address() || "地址",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_ADDRESS_COL_7 = {
  prop: "xx_address_7",
  label: overseaLangObj.bz_remark() || "备注",
  minWidth: 150,
  showOverflowTooltip: true
}
export const addressTableCols = [
  TABLE_COL_0,
  TABLE_ADDRESS_COL_1,
  TABLE_ADDRESS_COL_2,
  TABLE_ADDRESS_COL_3,
  TABLE_ADDRESS_COL_4,
  TABLE_ADDRESS_COL_5,
  TABLE_ADDRESS_COL_6,
  TABLE_ADDRESS_COL_7
]
