import overseaLangObj from "@/language/overseasLang.js";
import {
  MAX_PRODUCT_LWH,
  MAX_BOX_WEIGHT,
  MIN_PRODUCT_NUM,
  MAX_PRODUCT_NUM,
  MAX_SKU_NUM,
} from "@/utils/instructions.js";
import { httpPushLocationSelect } from "@/views/warehouseManage/predictionManage/receiving/components/batchGrounding/model.js";

const YS_FORM_COL_1 = {
  span: 8,
  id: "gndjh",
  label: `国内登记号：`,
  type: "txt",
};
const YS_FORM_COL_2 = {
  span: 8,
  id: "nlCode",
  label: `NL编号：`,
  type: "txt",
};
const YS_FORM_COL_3 = {
  span: 8,
  id: "orderSn",
  label: `工作单号：`,
  type: "txt",
};
const YS_FORM_COL_4 = {
  span: 8,
  id: "rkcCode",
  label: `入库仓：`,
  type: "txt",
};
const YS_FORM_COL_5 = {
  span: 8,
  id: "cgOrRcYySj",
  label: `拆柜/入仓预约时间：`,
  type: "txt",
};
const YS_FORM_COL_6 = {
  span: 8,
  id: "cgOrRcSjSj",
  label: `卸柜时间：`,
  type: "txt",
};
export const detailColumns = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                YS_FORM_COL_1,
                YS_FORM_COL_2,
                YS_FORM_COL_3,
                YS_FORM_COL_4,
                YS_FORM_COL_5,
                YS_FORM_COL_6,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const YS_TABLE_COL_1 = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const YS_TABLE_COL_2 = {
  prop: "orderSn",
  labelTop: "Job No.",
  labelBottom: "工作单号",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  fixed: "left",
};
const YS_TABLE_COL_3 = {
  prop: "psfs",
  labelTop: "Deliveried by",
  labelBottom: "派送方式",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  fixed: "left",
  customRow: true,
  basicType: "distributionType",
  className: "second-layer-css",
};
const YS_TABLE_COL_4 = {
  prop: "sku",
  labelTop: "SKU",
  labelBottom: "产品代码",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  fixed: "left",
  customRow: true,
};
const YS_TABLE_COL_5 = {
  prop: "skuNameCn",
  labelTop: "SKU CN Name",
  labelBottom: "货品中文名称",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_6 = {
  prop: "skuNameEn",
  labelTop: "SKU EN Name",
  labelBottom: "货品英文名称",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_7 = {
  prop: "dsjzs",
  labelTop: "Number of shelves",
  labelBottom: "待上架总数",
  headerTopBottom: true,
  minWidth: 142,
  // showOverflowTooltip: true,
  customRow: true,
  align: "right",
  className: "second-layer-css",
};
const YS_TABLE_COL_8 = {
  prop: "traySn",
  labelTop: "PLT ID",
  labelBottom: "托盘号",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
  className: "third-layer-css",
};
const YS_TABLE_COL_9 = {
  prop: "kwSn",
  labelTop: "Location",
  labelBottom: "库位号",
  headerTopBottom: true,
  minWidth: 136,
  // showOverflowTooltip: true,
  customRow: true,
  // request: true,
  // editCellKeyName: "temp_secondId",
  // isEditEasyCell: true,
  fieldItem: {
    id: "kwId",
    selectLabelKey: "kwSn",
    // noClearable: true,
    type: "autocomplete",
    ...httpPushLocationSelect(),
    // selectParamObj: {
    //   warehouseId: 650,
    // },
  },
};
const YS_TABLE_COL_10 = {
  prop: "newGoods",
  labelTop: "IF NEW",
  labelBottom: "是否是新品要核查",
  headerTopBottom: true,
  minWidth: 124,
  fontColor: true,
  basicType: "trueOrFalse",
  customRow: true,
};
const YS_TABLE_COL_11 = {
  prop: "remark",
  labelTop: "Remark",
  labelBottom: "备注",
  headerTopBottom: true,
  minWidth: 210,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_12 = {
  prop: "num",
  labelTop: "Actual number",
  labelBottom: "实际上架数",
  headerTopBottom: true,
  width: 120,
  align: "right",
  // showOverflowTooltip: true,
  decimal: 0,
  customRow: true,
};
const YS_TABLE_COL_13 = {
  prop: "length",
  verifyProp: "verifyLength",
  label: overseaLangObj.c_length("长(CM)"),
  minWidth: 90,
  align: "right",
  // showOverflowTooltip: true,
  decimal: 1,
  customRow: true,
  // isEditEasyCell: true,
  // editCellKeyName: "newGoods",
  fieldItem: {
    type: "inputNumber",
    max: MAX_PRODUCT_LWH,
    minGreaterZero: true,
    requiredKeyArr: ["length"],
  },
};
const YS_TABLE_COL_14 = {
  prop: "width",
  verifyProp: "verifyWidth",
  label: overseaLangObj.k_width("宽(CM)"),
  minWidth: 90,
  align: "right",
  // showOverflowTooltip: true,
  decimal: 1,
  customRow: true,
  // isEditEasyCell: true,
  // editCellKeyName: "newGoods",
  fieldItem: {
    type: "inputNumber",
    max: MAX_PRODUCT_LWH,
    minGreaterZero: true,
    requiredKeyArr: ["width"],
  },
};
const YS_TABLE_COL_15 = {
  prop: "height",
  verifyProp: "verifyHeight",
  label: overseaLangObj.g_height("高(CM)"),
  minWidth: 90,
  align: "right",
  // showOverflowTooltip: true,
  decimal: 1,
  customRow: true,
  // isEditEasyCell: true,
  // editCellKeyName: "newGoods",
  fieldItem: {
    type: "inputNumber",
    max: MAX_PRODUCT_LWH,
    minGreaterZero: true,
    requiredKeyArr: ["height"],
  },
};
const YS_TABLE_COL_16 = {
  prop: "weight",
  verifyProp: "verifyWeight",
  label: overseaLangObj.zl_fn_weight("重量(KG)"),
  // showOverflowTooltip: true,
  minWidth: 100,
  align: "right",
  decimal: 2,
  customRow: true,
  // isEditEasyCell: true,
  // editCellKeyName: "newGoods",
  fieldItem: {
    type: "inputNumber",
    max: MAX_BOX_WEIGHT,
    minGreaterZero: true,
    requiredKeyArr: ["weight"],
  },
};

const YS_TABLE_COL_204 = {
  prop: "huowu",
  labelTop: "SHIPMENT ID",
  labelBottom: "货件号",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_205 = {
  prop: "mdcCode",
  labelTop: "Warehouse code",
  labelBottom: "目的仓",
  headerTopBottom: true,
  minWidth: 130,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_206 = {
  // prop: "dsjZs",
  // labelTop: "SHIPMENT CTNS",
  // labelBottom: "货件总箱数",
  // headerTopBottom: true,
  // minWidth: 130,
  // showOverflowTooltip: true,
  // customRow: true,
};
const YS_TABLE_COL_209 = {
  prop: "psyjsj",
  labelTop: "LOADING DATE",
  labelBottom: "派送时间",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_210 = {
  prop: "pszxs",
  labelTop: "CTNs",
  labelBottom: "派送总数",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_212 = {
  prop: "psgzh",
  labelTop: "CMR No",
  labelBottom: "派送跟踪号",
  headerTopBottom: true,
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_213 = {
  prop: "time",
  label: "收货上架时间",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
  minWidth: 150,
  // showOverflowTooltip: true,
  customRow: true,
};
const YS_TABLE_COL_214 = {
  prop: "num",
  label: "收货上架数量",
  minWidth: 120,
  // showOverflowTooltip: true,
  customRow: true,
  // editCellKeyName: "temp_secondId",
  // isEditEasyCell: true,
  fieldItem: {
    max: MAX_SKU_NUM,
    type: "inputNumber",
    minGreaterZero: true,
    requiredKeyArr: ["takeAmountBox"],
  },
};

const YS_TABLE_COL_99 = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 86,
  fixed: "right",
  customRow: true,
};

export const ysTableCols = (tName, isEdit) => {
  const YS_TABLE_COLS_1 = [
    YS_TABLE_COL_3, // 派送方式
    YS_TABLE_COL_204,
    YS_TABLE_COL_7,
    YS_TABLE_COL_205, // 目的仓
    YS_TABLE_COL_209,
    YS_TABLE_COL_210,
    YS_TABLE_COL_212,
    YS_TABLE_COL_8, // 托盘号
    YS_TABLE_COL_9,
    YS_TABLE_COL_214,
  ];
  const YS_TABLE_COLS_2 = [
    YS_TABLE_COL_4,
    YS_TABLE_COL_204, // 货件号
    YS_TABLE_COL_5,
    YS_TABLE_COL_6,
    YS_TABLE_COL_7,
    YS_TABLE_COL_10,
    YS_TABLE_COL_13, // 长
    YS_TABLE_COL_14,
    YS_TABLE_COL_15,
    YS_TABLE_COL_16, // 重量
    YS_TABLE_COL_8,
    YS_TABLE_COL_9, // 库位号
    {
      ...YS_TABLE_COL_12,
      customRow: true,
      // editCellKeyName: "temp_secondId",
      // isEditEasyCell: true,
      fieldItem: {
        max: MAX_SKU_NUM,
        type: "inputNumber",
        minGreaterZero: true,
        requiredKeyArr: ["num"],
      },
    },
  ];
  return [
    YS_TABLE_COL_1,
    YS_TABLE_COL_2,
    ...[YS_TABLE_COLS_1, YS_TABLE_COLS_2][tName - 1],
    YS_TABLE_COL_213,
    YS_TABLE_COL_11, // 备注
    ...(isEdit ? [YS_TABLE_COL_99] : []),
  ];
};
