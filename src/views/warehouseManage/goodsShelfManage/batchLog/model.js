import {
  httpAllDealingCompanySelect,
  httpUserSelect,
} from "@/comModel/httpSelect";
import { httpLocationSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COLS_1 = {
  id: "createTime",
  label: `${overseaLangObj.operator_time || "操作时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "customerId",
  label: `${overseaLangObj.kh_customer() || "客户信息"}：`,
  ...httpAllDealingCompanySelect(),
};
const SEARCH_COLS_4 = {
  id: "optTypeList",
  label: `${overseaLangObj.cz_type || "操作类型"}：`,
  placeholder: "操作类型(多选)",
  type: "select",
  multiple: true,
  collapseTags: true,
  basicType: "wmsOptType",
};
const SEARCH_COLS_5 = {
  id: "sku",
  label: "SKU：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_6 = {
  id: "productName",
  label: `${overseaLangObj.cp_name || "产品名称"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_7 = {
  id: "productCode",
  label: `${overseaLangObj.zdy_bm || "自定义编码"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_8 = {
  id: "consultSn",
  label: "参考号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_9 = {
  id: "locationId",
  label: `${overseaLangObj.kw_location("库位")}：`,
  ...httpLocationSelect(),
  type: "slot",
};
const SEARCH_COLS_10 = {
  id: "traySn",
  label: `${overseaLangObj.tp_bh || "托盘编号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_11 = {
  id: "enterpriseId",
  label: "所属企业：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_12 = {
  id: "salesmanId",
  label: "业务员：",
  ...httpUserSelect(),
};
const SEARCH_COLS_13 = {
  id: "boxSn",
  label: "客户箱号：",
  placeholder: "请输入",
  type: "text",
};

const SEARCH_COLS_14 = {
  id: "optName",
  label: `${overseaLangObj.czr_operator || "操作人"}：`,
  ...httpUserSelect(),
  defaultProp: {
    value: "userName",
    label: "userName,nickName",
  },
};

const SEARCH_COLS_15 = {
  id: "orderTypes",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  placeholder: "入库来源(多选)",
  type: "select",
  multiple: true,
  basicType: "warehousingSource",
};

const SEARCH_COLS_16 = {
  id: "trackingSn",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_17 = {
  id: "shipmentId",
  label: "Shipment Id：",
  placeholder: "请输入",
  type: "text",
};
const search_fixed_first = (key) => {
  const searchList = {
    1: [
      SEARCH_COLS_3, //客户信息
      SEARCH_COLS_5, //SKU
      SEARCH_COLS_6, //产品名称
      SEARCH_COLS_2, //工作单号
      SEARCH_COLS_1, //入库时间
      SEARCH_COLS_15, //入库来源
      SEARCH_COLS_9, //库位
      SEARCH_COLS_10, //托盘编号
      SEARCH_COLS_7, //自定义编码
      SEARCH_COLS_16, //跟踪号
      SEARCH_COLS_4, //操作类型
      SEARCH_COLS_14, //操作人
    ],
    2: [
      SEARCH_COLS_3, //客户信息
      SEARCH_COLS_17, //箱序号
      SEARCH_COLS_5, //SKU
      SEARCH_COLS_2, //工作单号
      SEARCH_COLS_1, //入库时间
      SEARCH_COLS_15, //入库来源
      SEARCH_COLS_9, //库位
      SEARCH_COLS_10, //托盘编号
      SEARCH_COLS_7, //自定义编码
      SEARCH_COLS_16, //跟踪号
      SEARCH_COLS_4, //操作类型
      SEARCH_COLS_14, //操作人
    ],
  };
  return searchList[key];
};

const searchColumns = (key = "1") => {
  const cols = search_fixed_first(key);
  return {
    searchNum: cols.length,
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols,
              },
            ],
          },
        ],
      },
    ],
  };
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 180,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "consultSn",
  label: overseaLangObj.ck_bm || "参考号",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_3 = {
  prop: "optType",
  label: overseaLangObj.cz_type || "操作类型",
  showOverflowTooltip: true,
  minWidth: 100,
  fontColor: true,
  basicType: "wmsOptType",
  fixed: "right",
};
const TABLE_COLS_4 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer() || "客户信息",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_5 = {
  prop: "sku",
  label: "SKU",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_6 = {
  prop: "productCode",
  label: overseaLangObj.zdy_bm || "自定义编码",
  showOverflowTooltip: true,
  minWidth: 130,
};
const TABLE_COLS_7 = {
  prop: "productName",
  label: overseaLangObj.cp_name || "产品名称",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_8 = {
  prop: "trackingSn",
  label: overseaLangObj.tracking_no || "跟踪号",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_9 = {
  prop: "locationName",
  label: overseaLangObj.kw_location("库位号"),
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_10 = {
  prop: "traySn",
  label: overseaLangObj.tp_bh || "托盘编码",
  showOverflowTooltip: true,
  minWidth: 135,
};
const TABLE_COLS_11 = {
  prop: "oldNum",
  label: overseaLangObj.ys_kc || "原始库存",
  showOverflowTooltip: true,
  minWidth: 100,
  decimal: 0,
  align: "right",
};
const TABLE_COLS_12 = {
  prop: "optNum",
  label: overseaLangObj.adjust_kc || "调整库存",
  showOverflowTooltip: true,
  minWidth: 100,
  align: "right",
  decimal: 0,
  customRow: true,
};
const TABLE_COLS_13 = {
  prop: "newNum",
  label: overseaLangObj.dq_kc || "当前库存",
  showOverflowTooltip: true,
  minWidth: 100,
  decimal: 0,
  align: "right",
};
const TABLE_COLS_14 = {
  prop: "optName",
  label: overseaLangObj.czr_operator || "操作人",
  showOverflowTooltip: true,
  minWidth: 100,
  align: "center",
};
const TABLE_COLS_15 = {
  prop: "optTime",
  label: overseaLangObj.operator_time || "操作时间",
  showOverflowTooltip: true,
  minWidth: 160,
  align: "center",
};
const TABLE_COLS_16 = {
  prop: "boxSn",
  label: "客户箱号",
  showOverflowTooltip: true,
  minWidth: 100,
  align: "center",
};
const TABLE_COLS_17 = {
  prop: "remark",
  label: overseaLangObj.bz_remark() || "备注",
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_18 = {
  prop: "orderType",
  label: overseaLangObj.rk_ly || "入库来源",
  minWidth: 100,
  fontColor: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehousingSource",
  fixed: "left",
};
const TABLE_COLS_19 = {
  prop: "shipmentId",
  label: "Shipment ID",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_20 = {
  prop: "partitionName",
  label: overseaLangObj.ss_qy || "所属区域",
  minWidth: 136,
  sortable: true,
  showOverflowTooltip: true,
};

const tableConfig = (key) => {
  const tableLists = {
    1: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1, //工作单号
      TABLE_COLS_18, //入库来源
      TABLE_COLS_20,
      TABLE_COLS_9, //库位号
      TABLE_COLS_10, //托盘编号
      TABLE_COLS_4, //客户信息
      TABLE_COLS_5, //SKU
      TABLE_COLS_6, //自定义编码
      TABLE_COLS_7, //产品名称
      TABLE_COLS_2, //参考号
      TABLE_COLS_8, //跟踪号
      TABLE_COLS_11, //原始库存
      TABLE_COLS_12, //调整库存
      TABLE_COLS_13, //当前库存
      TABLE_COLS_14, //操作人
      TABLE_COLS_15, //操作时间
      TABLE_COLS_17, //备注
      TABLE_COLS_3, //操作类型
    ],
    2: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1, //工作单号
      TABLE_COLS_18, //入库来源
      TABLE_COLS_20,
      TABLE_COLS_4, //客户信息
      TABLE_COLS_19, //箱序号
      TABLE_COLS_5, //SKU
      TABLE_COLS_2, //参考号
      TABLE_COLS_8, //跟踪号
      TABLE_COLS_9, //库位号
      TABLE_COLS_10, //托盘编号
      TABLE_COLS_11, //原始库存
      TABLE_COLS_12, //调整库存
      TABLE_COLS_13, //当前库存
      TABLE_COLS_14, //操作人
      TABLE_COLS_15, //操作时间
      TABLE_COLS_17, //备注
      TABLE_COLS_3, //操作类型
    ],
  };
  return tableLists[key];
};

const tableColumns = (key = "1") => {
  const cols = tableConfig(key);
  return [...cols];
};

export { searchColumns, tableColumns };
