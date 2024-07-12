import { httpAllDealingCompanySelect } from "@/comModel/httpSelect";
import { httpLocationSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_2 = {
  id: "traySn",
  label: `${overseaLangObj.tp_bh || "托盘编号"}：`,
  placeholder: "请输入",
  type: "text",
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

const SEARCH_COL_11 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_12 = {
  id: "orderTypeList",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  placeholder: "入库来源(多选)",
  type: "select",
  multiple: true,
  basicType: "warehousingSource",
};

const SEARCH_COL_15 = {
  id: "boxSn",
  label: `${overseaLangObj.box_number || "箱序号"}：`,
  placeholder: "请输入",
  type: "text",
};

export const searchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_4, // 客户信息
                // SEARCH_COL_15, // 箱序号
                SEARCH_COL_5, // SKU
                SEARCH_COL_11, // 工作单号
                SEARCH_COL_12, // 入库来源
                {
                  id: "locationId",
                  label: `${overseaLangObj.kw_location("库位")}：`,
                  ...httpLocationSelect(),
                  type: "slot",
                }, //库位
                SEARCH_COL_2, // 托盘编号
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "locationCode",
  label: overseaLangObj.kw_location("库位"),
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "traySn",
  label: overseaLangObj.tp_bh || "托盘编码",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 130,
  fixed: "left",
};
const TABLE_COL_3 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer() || "客户信息",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};

const TABLE_COL_6 = {
  prop: "sku",
  label: "SKU",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COL_7 = {
  prop: "surplusNum",
  label: overseaLangObj.dq_kc || "当前库存",
  showOverflowTooltip: true,
  sortable: true,
  columnLink: true,
  align: "center",
  minWidth: 96,
  decimal: 0,
};
const TABLE_COL_8 = {
  prop: "applyTimeNum",
  label: "申请库存",
  showOverflowTooltip: true,
  sortable: true,
  // columnLink: true,
  align: "center",
  minWidth: 96,
  decimal: 0,
};
const TABLE_COL_9 = {
  prop: "applyResultNum",
  label: "调整库存",
  showOverflowTooltip: true,
  sortable: true,
  columnLink: true,
  align: "center",
  minWidth: 96,
  decimal: 0,
};
const TABLE_COL_10 = {
  prop: "stockAge",
  label: overseaLangObj.kl_ts("库龄/天"),
  showOverflowTooltip: true,
  sortable: true,
  align: "center",
  minWidth: 90,
  decimal: 0,
};
const TABLE_COL_11 = {
  prop: "singleVolume",
  label: overseaLangObj.dx_tj_volume("单件体积(CBM)"),
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 4,
  minWidth: 136,
};
const TABLE_COL_12 = {
  prop: "singleWeight",
  label: overseaLangObj.product_weight("单件重量(KG)"),
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 4,
  minWidth: 126,
};
const TABLE_COL_13 = {
  prop: "singleHigh",
  label: overseaLangObj.g_height() || "高(CM)",
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 1,
  minWidth: 90,
};
const TABLE_COL_14 = {
  prop: "singleWide",
  label: overseaLangObj.k_width() || "宽(CM)",
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 1,
  minWidth: 90,
};
const TABLE_COL_15 = {
  prop: "singleLong",
  label: overseaLangObj.c_length() || "长(CM)",
  showOverflowTooltip: true,
  sortable: true,
  align: "right",
  decimal: 1,
  minWidth: 90,
};

const TABLE_COL_19 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 150,
};

const TABLE_COL_20 = {
  prop: "orderType",
  label: overseaLangObj.rk_ly || "入库来源",
  minWidth: 100,
  fontColor: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehousingSource",
};

const TABLE_COL_22 = {
  prop: "applyState",
  label: overseaLangObj.zt_status || "状态",
  width: 76,
  sortable: true,
  dotColor: true,
  showOverflowTooltip: true,
  basicType: "stockAdjustApplyState",
};
const TABLE_COL_23 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_24 = {
  prop: "reviewedUserName",
  label: "审核人",
  minWidth: 86,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_99 = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: overseaLangObj.yu_yan_lang === "en-us" ? 165 : 100,
  fixed: "right",
  columnOperation: true,
};

export const tableColumns = (tName = "1") => {
  const TABLE_COLS_1 = [
    TABLE_COL_INDEX,
    TABLE_COL_1, // 库位
    TABLE_COL_2, // 托盘编号
    TABLE_COL_19, // 工作单号
    TABLE_COL_20, // 入库来源
    TABLE_COL_3, // 客户信息
    TABLE_COL_6,
    TABLE_COL_7,
    ...(tName === "1" ? [TABLE_COL_8] : []),
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    ...(tName === "1" ? [TABLE_COL_22] : []),
    TABLE_COL_23,
    TABLE_COL_24,
    ...(tName === "1" ? [TABLE_COL_99] : []),
  ];
  return TABLE_COLS_1;
};
