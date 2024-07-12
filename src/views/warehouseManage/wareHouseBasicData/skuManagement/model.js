import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  id: "createTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "sku",
  label: "SKU：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "userSetCode",
  label: `${overseaLangObj.zdy_bm || "自定义编码"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "productName",
  label: `${overseaLangObj.cp_name || "产品名称"}：`,
  placeholder: "请输入",
  type: "text",
};

export const searchColumns = [
  {
    className: "search-form-width",
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              SEARCH_COL_2,
              SEARCH_COL_3,
              SEARCH_COL_4,
              SEARCH_COL_5,
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  // fixed: 'left'
};
const TABLE_COL_1 = {
  prop: "sku",
  label: "SKU",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "userSetCode",
  label: overseaLangObj.zdy_bm || "自定义编码",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "productName",
  label: overseaLangObj.cp_name || "产品名称",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "owningWarehouse",
  label: overseaLangObj.ck_lb("所属仓库"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "inventoryNum",
  label: overseaLangObj.kc_sl("库存"),
  minWidth: 90,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COL_6 = {
  prop: "warehousingSource",
  label: overseaLangObj.rk_ly || "入库来源",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehousingSource",
};
const TABLE_COL_7 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer("客户信息"),
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "createUserName",
  label: overseaLangObj.cjr_create || "创建人",
  minWidth: 110,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_99 = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  width: 70,
};
const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_SELECTION,
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
  TABLE_COL_99,
];
export const tableColumns = () => {
  return TABLE_TAB_1;
};
