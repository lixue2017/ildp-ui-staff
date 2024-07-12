import {
  httpAllDealingCompanySelect,
  httpGoodsSelect,
} from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  span: 6,
  id: "sku",
  label: `${overseaLangObj.cp_sku || "产品SKU"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_2 = {
  span: 6,
  id: "productType",
  label: "产品种类：",
  ...httpGoodsSelect(),
};
const SEARCH_COL_3 = {
  span: 6,
  id: "warehouseId",
  label: "仓库：",
  ...httpWarehousePublicSelect(),
};
const SEARCH_COL_4 = {
  span: 6,
  id: "customerId",
  label: `${overseaLangObj.kh_customer() || "客户信息"}：`,
  ...httpAllDealingCompanySelect(),
};
const SEARCH_COL_5 = {
  span: 6,
  id: "productName",
  label: `${overseaLangObj.cp_name || "产品名称"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_6 = {
  span: 6,
  startId: "minQuantityInventory",
  endId: "maxQuantityInventory",
  label: `${overseaLangObj.available_sale("可售数")}：`,
  startPlaceholder: "可售数≤",
  endPlaceholder: "<可售数",
  type: "rangeSelect",
};
const SEARCH_COL_7 = {
  span: 6,
  startId: "minQuantityOnWay",
  endId: "maxQuantityOnWay",
  label: `${overseaLangObj.in_transit_quantity || "在途数"}：`,
  startPlaceholder: "在途数≤",
  endPlaceholder: "<在途数",
  type: "rangeSelect",
};
const SEARCH_COL_8 = {
  span: 6,
  startId: "minQuantityOnput",
  endId: "maxQuantityOnput",
  label: `${overseaLangObj.d_sj_num || "待上架数"}：`,
  startPlaceholder: "待上架数≤",
  endPlaceholder: "<待上架数",
  type: "rangeSelect",
};
const SEARCH_COL_9 = {
  span: 6,
  startId: "minQuantityOutbound",
  endId: "maxQuantityOutbound",
  label: `${overseaLangObj.dd_ck("待出库数")}：`,
  startPlaceholder: "待出库数≤",
  endPlaceholder: "<待出库数",
  type: "rangeSelect",
};

const SEARCH_COL_10 = {
  span: 6,
  id: "shipmentId",
  label:"Shipment Id：",
  placeholder: "请输入",
  type: "text",
};

const formLists = {
  1: [
    SEARCH_COL_4, //客户信息
    SEARCH_COL_1, //产品SKU
    SEARCH_COL_5, //产品名称
    SEARCH_COL_6, //可售数
    SEARCH_COL_7, //在途数
    SEARCH_COL_8, //待上架数
    SEARCH_COL_9, //待出库数
  ],
  2: [
    SEARCH_COL_4, //客户信息
    SEARCH_COL_10, //箱序号
    SEARCH_COL_1, //产品SKU
    SEARCH_COL_6, //可售数
    SEARCH_COL_7, //在途数
    SEARCH_COL_8, //待上架数
    SEARCH_COL_9, //待出库数
  ],
};
const searchColumns = (tName) => {
  const cols = formLists[tName];
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: cols,
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COLS_1 = {
  prop: "productName",
  label: overseaLangObj.cp_name || "产品名称",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_2 = {
  prop: "quantityAlreadyOut",
  label: overseaLangObj.yck_zs || "已出库数",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  align: "right",
  decimal: 0,
};

const TABLE_COL_3 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer() || "客户信息",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COL_4 = {
  prop: "quantityOnWay",
  label: overseaLangObj.in_transit_quantity || "在途数",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  decimal: 0,
  align: "right",
};
const TABLE_COL_5 = {
  prop: "quantityOnPut",
  label: overseaLangObj.d_sj_num || "待上架数",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  decimal: 0,
  align: "right",
};
const TABLE_COL_6 = {
  prop: "quantityInventory",
  label: overseaLangObj.available_sale("可销售数"),
  showOverflowTooltip: true,
  sortable: true,
  customRow: true,
  minWidth: 100,
  decimal: 0,
  align: "right",
};
const TABLE_COL_12 = {
  prop: "quantityOutbound",
  label: overseaLangObj.dd_ck("待出库数"),
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  decimal: 0,
  align: "right",
};

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    prop: "sku",
    label: "SKU",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  TABLE_COLS_1,
  // {
  //   prop: "productName",
  //   label: "产品名称",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100
  // },
  // {
  //   prop: "productTypeName",
  //   label: "产品种类",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 120
  // },
  TABLE_COL_3,
  // {
  //   prop: "warehouseName",
  //   label: "仓库名称",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100
  // },
  {
    prop: "productNetWeight",
    label: overseaLangObj.product_weight("产品重量"),
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    decimal: 3,
    align: "right",
  },
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_12,
  {
    prop: "quantityDefective",
    label: overseaLangObj.defective_product("不良品数"),
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    decimal: 0,
    align: "right",
  },
  {
    prop: "quantityDefectiveOut",
    label: overseaLangObj.dck_blp || "待出库不良品",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 130,
    decimal: 0,
    align: "right",
  },
  TABLE_COLS_2,
];

const boxTableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    prop: "shipmentId",
    label: "Shipment ID",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
  },
  // {
  //   prop: "warehouseBoxNum",
  //   label: "仓库箱号",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   minWidth: 100
  // },
  TABLE_COL_3,
  {
    prop: "sku",
    label: "SKU",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    prop: "boxSkuCount",
    label: overseaLangObj.single_box_sku || "单箱SKU数",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
  },
  {
    prop: "warehouseName",
    label: overseaLangObj.ck_name || "仓库名称",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    prop: "warehousingWeight",
    label: overseaLangObj.dx_weight() || "单箱重量",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    align: "right",
  },
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_12,
  TABLE_COLS_2,
];

export { searchColumns, tableColumns, boxTableColumns };
