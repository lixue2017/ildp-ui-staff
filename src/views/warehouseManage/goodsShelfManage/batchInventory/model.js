import {
  httpAllDealingCompanySelect,
  httpRoleDeptUserSelect,
} from "@/comModel/httpSelect";
import { httpLocationSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.rk_time || "入库时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "traySn",
  label: `${overseaLangObj.tp_bh || "托盘编号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "locationId",
  label: `${overseaLangObj.kw_location("库位")}：`,
  ...httpLocationSelect(),
  type: "slot",
};

const SEARCH_COL_4 = {
  id: "customerId",
  label: `${overseaLangObj.kh_customer() || "客户信息"}：`,
  ...httpAllDealingCompanySelect(),
};
const SEARCH_COL_5 = {
  id: "sku",
  label: "SKU：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_6 = {
  id: "productName",
  label: `${overseaLangObj.cp_name || "产品名称"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "productCode",
  label: `${overseaLangObj.zdy_bm || "自定义编码"}：`,
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COL_8 = {
  id: "xx_search_8",
  label: "所属企业：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_9 = {
  id: "xx_search_9",
  label: "业务员：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "boxSn",
  label: "客户箱号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_11 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_12 = {
  id: "orderTypes",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  placeholder: "入库来源(多选)",
  type: "select",
  multiple: true,
  basicType: "warehousingSource",
};

const SEARCH_COL_13 = {
  startId: "minSurplusNum",
  endId: "maxSurplusNum",
  label: `${overseaLangObj.kc_sl("库存数")}：`,
  startPlaceholder: "库存数≤",
  endPlaceholder: "<库存数",
  type: "rangeSelect",
};

const SEARCH_COL_14 = {
  startId: "minStockAge",
  endId: "maxStockAge",
  label: `${overseaLangObj.kl_ts("库存天数")}：`,
  startPlaceholder: "库存天数≤",
  endPlaceholder: "<库存天数",
  type: "rangeSelect",
};
const SEARCH_COL_15 = {
  id: "shipmentId",
  label: "Shipment Id：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_16 = {
  id: "isZero",
  type: "multiCheckbox",
  options: [
    {
      label: overseaLangObj.is_kc_wl || "当前库存为0",
      value: 1,
    },
  ],
};

export const searchColumns = (tName = "1") => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_4, // 客户信息
                ...(tName === "2" ? [SEARCH_COL_15] : []), // 箱序号
                SEARCH_COL_5, // SKU
                ...(tName === "1" ? [SEARCH_COL_6] : []), // 产品名称
                SEARCH_COL_11, //工作单号
                SEARCH_COL_1, //入库时间
                SEARCH_COL_12, //入库来源
                SEARCH_COL_3, //库位
                SEARCH_COL_2, //托盘编号
                SEARCH_COL_13, //库存数
                SEARCH_COL_14, //库存天数
                SEARCH_COL_7, //自定义编码
                SEARCH_COL_16,
              ],
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
  prop: "locationCode",
  label: overseaLangObj.kw_location("库位"),
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "traySn",
  label: overseaLangObj.tp_bh || "托盘编码",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 130,
  fixed: "left",
};
const TABLE_COLS_3 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer() || "客户信息",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COLS_4 = {
  prop: "xx_table_4",
  label: "所属企业",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_5 = {
  prop: "xx_table_5",
  label: "业务员",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_6 = {
  prop: "sku",
  label: "SKU",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_7 = {
  prop: "productCode",
  label: overseaLangObj.zdy_bm || "自定义编码",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 130,
};
const TABLE_COLS_8 = {
  prop: "productName",
  label: overseaLangObj.cp_name || "产品名称",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 200,
};
const TABLE_COLS_9 = {
  prop: "surplusNum",
  labelTop: "当前库存",
  labelBottom: "(不含锁定)",
  headerTopBottom: true,
  showOverflowTooltip: true,
  sortable: true,
  columnLink: true,
  align: "center",
  width: 120,
  decimal: 0,
};
const TABLE_COLS_10 = {
  prop: "stockAge",
  label: overseaLangObj.kl_ts("库龄/天"),
  showOverflowTooltip: true,
  sortable: true,
  align: "center",
  minWidth: 100,
  decimal: 0,
};
const TABLE_COLS_11 = {
  prop: "singleVolume",
  label: overseaLangObj.dx_tj_volume("单件体积(CBM)"),
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 4,
  minWidth: 140,
};
const TABLE_COLS_12 = {
  prop: "singleWeight",
  label: overseaLangObj.product_weight("单件重量(KG)"),
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 4,
  minWidth: 130,
};
const TABLE_COLS_13 = {
  prop: "singleHigh",
  label: overseaLangObj.g_height() || "高(CM)",
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 1,
  minWidth: 100,
};
const TABLE_COLS_14 = {
  prop: "singleWide",
  label: overseaLangObj.k_width() || "宽(CM)",
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 1,
  minWidth: 100,
};
const TABLE_COLS_15 = {
  prop: "singleLong",
  label: overseaLangObj.c_length() || "长(CM)",
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 1,
  minWidth: 100,
};
const TABLE_COLS_16 = {
  prop: "putShelfTime",
  label: overseaLangObj.rk_time || "入库时间",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 160,
};
const TABLE_COLS_17 = {
  prop: "boxSn",
  label: "客户箱号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_18 = {
  prop: "boxSkuNum",
  label: overseaLangObj.single_box_sku || "单箱SKU数",
  showOverflowTooltip: true,
  sortable: true,
  align: "center",
  minWidth: 130,
  decimal: 0,
};
const TABLE_COLS_19 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 180,
};

const TABLE_COLS_20 = {
  prop: "orderType",
  label: overseaLangObj.rk_ly || "入库来源",
  minWidth: 100,
  fontColor: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehousingSource",
};
const TABLE_COLS_21 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  prop: "partitionName",
  label: overseaLangObj.ss_qy || "所属区域",
  minWidth: 136,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  prop: "adjustApplyLockNum",
  label: "审核锁定",
  showOverflowTooltip: true,
  sortable: true,
  align: "center",
  minWidth: 100,
  decimal: 0,
};
const TABLE_COLS_24 = {
  prop: "outWarehouseLockNum",
  label: "出库锁定",
  showOverflowTooltip: true,
  sortable: true,
  align: "center",
  minWidth: 100,
  decimal: 0,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: overseaLangObj.yu_yan_lang === "en-us" ? 185 : 120,
  fixed: "right",
  columnOperation: true,
};

const table_fixed_first = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_19,
  TABLE_COLS_3,
  // TABLE_COLS_4,
  // TABLE_COLS_5
];
const table_fixed_last = [
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_13,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
];

const table_public = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1, //库位
  TABLE_COLS_2, //托盘编号
  TABLE_COLS_19, //工作单号
  TABLE_COLS_20, //入库来源
  TABLE_COLS_22,
  TABLE_COLS_3, //客户信息
];
export const tableColumns = (key = "1") => {
  const other =
    key === "1"
      ? [
          TABLE_COLS_6,
          TABLE_COLS_7,
          TABLE_COLS_8,
          TABLE_COLS_9,
          TABLE_COLS_23,
          TABLE_COLS_24,
          TABLE_COLS_10,
          TABLE_COLS_11,
          TABLE_COLS_12,
          TABLE_COLS_13,
          TABLE_COLS_14,
          TABLE_COLS_15,
          TABLE_COLS_16,
        ]
      : [
          TABLE_COLS_21,
          TABLE_COLS_6,
          TABLE_COLS_18,
          TABLE_COLS_9,
          TABLE_COLS_10,
          TABLE_COLS_11,
          TABLE_COLS_12,
          TABLE_COLS_13,
          TABLE_COLS_14,
          TABLE_COLS_15,
          TABLE_COLS_16,
        ];
  return [...table_public, ...other, TABLE_COLS_OPERATION];
};

const DLG_FORM_COL_501 = {
  span: 24,
  id: "surplusNum",
  label: `${overseaLangObj.dq_kc || "当前库存"}：`,
  type: "txt",
};
const DLG_FORM_COL_502 = {
  span: 24,
  id: "applyResultNum",
  label: `${overseaLangObj.kc_tzw("调整库存")}：`,
  placeholder: "请输入",
  type: "inputNumber",
  noSlotLabel: true,
};
const DLG_FORM_COL_503 = {
  span: 24,
  id: "remark",
  label: `${overseaLangObj.yy_reason("原因")}：`,
  placeholder: "请输入",
  type: "textarea",
  maxlength: 500,
};
const DLG_FORM_COL_504 = {
  span: 24,
  id: "reviewedUserId",
  label: "审批人：",
  ...httpRoleDeptUserSelect(),
};
const DLG_FORM_COL_505 = {
  span: 24,
  id: "adjustReason",
  label: "调整原因：",
  type: "select",
  placeholder: "请选择",
  basicType: "stockAdjustReason",
};
export const inventoryAdjustmentCols = () => {
  return {
    title: overseaLangObj.tz_kc || "调库存",
    width: "600px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "190px" : "105px",
    simpleCustomCols: [
      // DLG_FORM_COL_504,
      DLG_FORM_COL_501,
      DLG_FORM_COL_502,
      DLG_FORM_COL_505,
      {
        ...DLG_FORM_COL_503,
        id: "applyRemark",
        label: `${overseaLangObj.yy_reason("备注")}：`,
      },
      {
        span: 24,
        id: "tableSlot",
        type: "slot",
        labelWidth: "0px",
      },
    ],
    formRules: {
      // reviewedUserId: [
      //   { required: true, message: `请选择审批人`, trigger: "change" },
      // ],
      applyResultNum: [
        { required: true, message: `请输入调整库存`, trigger: "blur" },
      ],
      adjustReason: [
        { required: true, message: `请选择调整原因`, trigger: "change" },
      ],
      // remark: [{ required: true, message: `请输入调整原因`, trigger: "blur" }],
    },
  };
};

export const inventoryApproveCols = () => {
  return {
    title: "调库存审批",
    width: "600px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "190px" : "105px",
    simpleCustomCols: [
      DLG_FORM_COL_501,
      {
        ...DLG_FORM_COL_502,
        type: "txt",
      },
      {
        ...DLG_FORM_COL_505,
        type: "txt",
      },
      {
        span: 24,
        id: "applyRemark",
        label: `${overseaLangObj.yy_reason("备注")}：`,
        type: "txt",
      },
      {
        ...DLG_FORM_COL_503,
        id: "remark",
        label: `${overseaLangObj.yy_reason("审核备注")}：`,
      },
    ],
  };
};

const DLG_FORM_COL_601 = {
  span: 24,
  id: "sku",
  label: `${overseaLangObj.cp_dm || "产品代码"}：`,
  type: "txt",
};
const DLG_FORM_COL_602 = {
  span: 24,
  id: "locationCode",
  label: `${overseaLangObj.dq_kw || "当前库位"}：`,
  type: "txt",
};
const DLG_FORM_COL_603 = {
  span: 24,
  id: "targetLocationId",
  label: `${overseaLangObj.mb_kw || "目标库位"}：`,
  ...httpLocationSelect({ isMove: 1 }),
  type: "slot",
  basicType: "pickingFreightType",
  basicTypeVal: "pickingFreightType",
};
const DLG_FORM_COL_604 = {
  span: 24,
  id: "txt_604",
  labelWidth: "5px",
  type: "txt",
  fontTxtColor: "#ff6767",
  textLineClamp: 2,
  render: () =>
    overseaLangObj.ykw_sm ||
    "注意：当目标库位为良品库位时，库存转为良品，其他类型库位也是如此",
};
export const relocationCols = () => {
  return {
    title: overseaLangObj.yd_kw || "移库位",
    width: "560px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "155px" : "100px",
    dictionaryWords: ["pickingFreightType"],
    simpleCustomCols: [
      DLG_FORM_COL_601,
      DLG_FORM_COL_602,
      DLG_FORM_COL_501,
      DLG_FORM_COL_603,
      DLG_FORM_COL_503,
      DLG_FORM_COL_604,
    ],
    formRules: {
      targetLocationId: [
        { required: true, message: `请选择目标库位`, trigger: "change" },
      ],
    },
  };
};
