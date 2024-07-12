import overseaLangObj from "@/language/overseasLang.js";
import { toFixedNum } from "@/utils/instructions";

const DETAILS_PACKAGE_COL_1 = {
  span: 8,
  id: "trackSn",
  label: `${overseaLangObj.tracking_no_fn("包裹跟踪号")}：`,
  type: "txt",
};
const DETAILS_FORM_COL_1 = {
  span: 8,
  id: "customerBelongShortName",
  label: `${overseaLangObj.kh_gs || "客户归属"}：`,
  type: "txt",
};
const DETAILS_PACKAGE_COL_2 = {
  span: 8,
  id: "wmsCodeName",
  label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
  render: (r) => `${r.wmsCode || "--"}/${r.wmsName || "--"}`,
};
const DETAILS_PACKAGE_COL_3 = {
  span: 8,
  id: "referenceNo",
  label: `${overseaLangObj.ck_bm || "参考编号"}：`,
  type: "txt",
};
const DETAILS_PACKAGE_COL_4 = {
  span: 8,
  id: "wmsBelongCompany",
  label: "仓库归属：",
  type: "txt",
};
const DETAILS_PACKAGE_COL_5 = {
  span: 8,
  id: "returnType",
  label: `退仓原因：`,
  type: "txt",
  basicType: "returnType",
  fontColor: true,
};

export const packageHeadCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                DETAILS_PACKAGE_COL_1,
                DETAILS_PACKAGE_COL_2,
                DETAILS_PACKAGE_COL_3,
                DETAILS_PACKAGE_COL_4,
                DETAILS_PACKAGE_COL_5,
              ],
            },
          ],
        },
      ],
    },
  ];
};
const TABLE_INDEX_SLOT = {
  prop: "tagSlot",
  width: 1,
  customRow: true,
};
const TABLE_COL_1 = {
  prop: "sku",
  label: "SKU",
  minWidth: 148,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "customsCode",
  label: "自定义编码",
  minWidth: 128,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "productNameCn",
  label: "产品名称(CN)",
  minWidth: 128,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "singleLength",
  label: "产品长宽高(CM)",
  width: 139,
  showOverflowTooltip: true,
  render: (r) =>
    `${toFixedNum(r.singleLength, 1)}*${toFixedNum(
      r.singleWidth,
      1
    )}*${toFixedNum(r.singleHeight, 1)}`,
};
const TABLE_COL_5 = {
  prop: "singleWeight",
  label: "重量(KG)",
  width: 90,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const TABLE_COL_6 = {
  prop: "xx_t_6",
  label: "LPN数",
  width: 90,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_7 = {
  prop: "num",
  label: "预报数",
  width: 90,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_8 = {
  prop: "takeNum",
  label: "实收数",
  width: 90,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_9 = {
  prop: "attachList",
  label: "图片",
  width: 220,
  customRow: true,
  editCellKeyName: "temp_secondId",
  isEditEasyCell: true,
  fieldItem: {
    type: "attachList",
  },
};
export const packageTableCols = () => [
  TABLE_INDEX_SLOT,
  {
    type: "index",
    width: 50,
    align: "center",
  },
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  // TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
];
