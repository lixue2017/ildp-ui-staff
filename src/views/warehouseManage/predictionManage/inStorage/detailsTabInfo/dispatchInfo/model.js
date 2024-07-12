import overseaLangObj from "@/language/overseasLang.js";

const DISPATCH_FORM_COL_1 = {
  span: 12,
  id: "code",
  label: "卡车编号：",
  placeholder: "--",
  // type: "txt"
  type: "slot",
};
const DISPATCH_FORM_COL_2 = {
  span: 12,
  id: "amazonId",
  label: "Amazon Appointment ID：",
  placeholder: "--",
  labelWidth: "162px",
  type: "txt",
};
const DISPATCH_FORM_COL_3 = {
  span: 12,
  id: "tname",
  label: "派送渠道：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_4 = {
  span: 12,
  id: "scheduledTime",
  label: "Scheduled Time：",
  labelWidth: "162px",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_5 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "--",
  type: "txt",
};

const DISPATCH_FORM_COL_201 = {
  span: 8,
  id: "code",
  label: "快递信息编号：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_202 = {
  span: 8,
  id: "expressOmpany",
  label: "快递公司：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_203 = {
  span: 8,
  id: "expressNum",
  label: "快递单号：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_204 = {
  span: 8,
  id: "mailTime",
  label: "寄件日期：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_205 = {
  span: 8,
  id: "xx_dispatch_205",
  label: "目的地类型：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_206 = {
  span: 8,
  id: "namePhone",
  label: "收件人信息：",
  placeholder: "--",
  type: "txt",
  render: (row) => `${row.name || "--"}(${row.phone || "--"})`,
};
const DISPATCH_FORM_COL_207 = {
  span: 24,
  id: "address",
  label: "收件人地址：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_208 = {
  span: 24,
  id: "attachId",
  label: "附件信息：",
  type: "customUploadFile",
  disable: true,
  detailDisplay: true,
};

const DISPATCH_FORM_COL_301 = {
  span: 8,
  id: "company",
  label: "卡车公司/快递公司：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_302 = {
  span: 8,
  id: "code",
  label: "订单号：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_303 = {
  span: 8,
  id: "pickUpCode",
  label: "自提码：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_304 = {
  span: 8,
  id: "licenseNumber",
  label: "车牌号：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_305 = {
  span: 8,
  id: "namePhone",
  label: "收件人信息：",
  placeholder: "--",
  type: "txt",
  render: (row) => `${row.name || "--"}(${row.phone || "--"})`,
};
const DISPATCH_FORM_COL_306 = {
  span: 8,
  id: "scheduledTime",
  label: "提货日期：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_307 = {
  span: 24,
  id: "detailsAddr",
  label: "收件人地址：",
  placeholder: "--",
  type: "txt",
};
const DISPATCH_FORM_COL_308 = {
  span: 24,
  id: "attachId",
  label: "附件信息：",
  type: "customUploadFile",
  disable: true,
  detailDisplay: true,
};

const DISPATCH_COLS_1 = [
  DISPATCH_FORM_COL_1,
  DISPATCH_FORM_COL_2,
  DISPATCH_FORM_COL_3,
  DISPATCH_FORM_COL_4,
  DISPATCH_FORM_COL_5,
];
const DISPATCH_COLS_2 = [
  DISPATCH_FORM_COL_201,
  DISPATCH_FORM_COL_202,
  DISPATCH_FORM_COL_203,
  DISPATCH_FORM_COL_204,
  // DISPATCH_FORM_COL_205,
  DISPATCH_FORM_COL_206,
  DISPATCH_FORM_COL_207,
  DISPATCH_FORM_COL_208,
];
const DISPATCH_COLS_3 = [
  DISPATCH_FORM_COL_301,
  DISPATCH_FORM_COL_302,
  DISPATCH_FORM_COL_303,
  DISPATCH_FORM_COL_304,
  DISPATCH_FORM_COL_305,
  DISPATCH_FORM_COL_306,
  DISPATCH_FORM_COL_307,
  DISPATCH_FORM_COL_308,
];
export const dispatchFormCols = (index = 0) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [DISPATCH_COLS_1, DISPATCH_COLS_2, DISPATCH_COLS_3][index],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COLS_1 = {
  prop: "bsNo",
  label: overseaLangObj.gz_dh || "工作单号",
  width: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_2 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer_name || "客户名称",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_3 = {
  prop: "headTransportModeName",
  label: overseaLangObj.tc_xs_fs || "头程运输方式",
  width: 130,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_3_1 = {
  prop: "outWarehouseWayName",
  label: overseaLangObj.wc_xs_fs || "尾程运输方式",
  width: 130,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_4 = {
  prop: "vatNo",
  label: "VAT No.",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_5 = {
  prop: "shipmentId",
  label: "Shipment ID",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_6 = {
  prop: "referenceId",
  label: "Reference ID",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_7 = {
  prop: "pltNum",
  label: overseaLangObj.plt_tps || "PLT(托盘数)",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_8 = {
  prop: "ecNum",
  label: overseaLangObj.tc_x_s || "头程箱数",
  width: 120,
  decimal: 0,
  align: "right",
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_9 = {
  prop: "checkNum",
  label: "预报体积/CBM",
  width: 140,
  decimal: 2,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};

const TABLE_COLS_10 = {
  prop: "desWarehouse",
  label: overseaLangObj.mdc_warehouse() || "目的仓",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_11 = {
  prop: "sendWay",
  label: overseaLangObj.delivery_ps_fs || "派送方式",
  width: 120,
  dicsStr: "delivery_Method",
  customDicsArr: [0, 10, 20],
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_12 = {
  prop: "entruckTime",
  label: overseaLangObj.zc_sj_time || "装车时间",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_13 = {
  prop: "cmrNo",
  label: overseaLangObj.cmr_kc_bh || "CMR号(卡车编号)",
  width: 160,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "canNo",
  label: "拼柜登记号",
  width: 140,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "receiveCompany",
  label: overseaLangObj.sh_gs_nc || "收货公司名称",
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "desWarehouseAddress",
  label: overseaLangObj.md_c_dz("目的仓地址"),
  width: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "checkWeight",
  label: "预报重量/KGS",
  width: 140,
  decimal: 2,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COLS_18 = {
  prop: "canNo",
  label: overseaLangObj.gn_djh || "国内登记号",
  width: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "verifyNum",
  label: overseaLangObj.hwc_hs_xs || "海外仓核实箱数",
  minWidth: 140,
  decimal: 0,
  align: "right",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  prop: "checkNum",
  label: overseaLangObj.hs_mz_kg("核实毛重/KG"),
  minWidth: 140,
  decimal: 2,
  align: "right",
  sortable: true,
  showOverflowTooltip: true,
};
export const tableColumns = [
  TABLE_COLS_INDEX,
  // TABLE_COLS_14,//拼柜登记号
  TABLE_COLS_18, //国内登记号
  TABLE_COLS_1, //工作单号
  TABLE_COLS_2, //客户名称
  TABLE_COLS_3, //头程运输方式
  TABLE_COLS_3_1, //尾程运输方式
  TABLE_COLS_15, //收货公司名称
  TABLE_COLS_4, //VAT No.
  TABLE_COLS_16, //目的仓地址
  TABLE_COLS_5, //Shipment ID
  TABLE_COLS_6, //Reference ID
  TABLE_COLS_7, //PLT(托盘数)
  TABLE_COLS_8, //头程箱数
  TABLE_COLS_19, //海外仓核实箱数
  TABLE_COLS_20, //核实体重
  TABLE_COLS_10, //目的仓
  TABLE_COLS_11, //派送方式
  TABLE_COLS_12, //装车时间
  TABLE_COLS_13, //CMR号(卡车编号)
];
