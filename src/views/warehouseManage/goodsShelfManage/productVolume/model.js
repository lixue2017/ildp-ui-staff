import { httpAllDealingCompanySelect } from "@/comModel/httpSelect";
import { MAX_BOX_WEIGHT, MAX_PRODUCT_LWH } from "@/utils/instructions.js";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_1 = {
  span: 6,
  id: "sku",
  label: "SKU：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_2 = {
  span: 6,
  id: "productName",
  label: `${overseaLangObj.cp_name || "产品名称"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  span: 6,
  id: "customerId",
  label: `${overseaLangObj.kh_customer() || "客户信息"}：`,
  ...httpAllDealingCompanySelect(),
};
const SEARCH_COL_4 = {
  span: 6,
  startId: "minQuantityInventory",
  endId: "maxQuantityInventory",
  label: `${overseaLangObj.available_sale("可售数")}：`,
  startPlaceholder: "可售数≤",
  endPlaceholder: "<可售数",
  type: "rangeSelect",
};
const SEARCH_COL_5 = {
  span: 6,
  startId: "minQuantityOutbound",
  endId: "maxQuantityOutbound",
  label: `${overseaLangObj.dd_ck("待出库数")}：`,
  startPlaceholder: "待出库数≤",
  endPlaceholder: "<待出库数",
  type: "rangeSelect",
};

const searchColumns = [
  SEARCH_COL_3, //客户信息
  SEARCH_COL_1, //sku
  SEARCH_COL_2, //产品名称
  SEARCH_COL_4, //可售数
  SEARCH_COL_5, //待出库数
];

const TABLE_COL_5 = {
  prop: "verifyLength",
  label: overseaLangObj.c_length("核实长(CM)"),
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_6 = {
  prop: "verifyWidth",
  label: overseaLangObj.k_width("核实宽(CM)"),
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_7 = {
  prop: "verifyHeight",
  label: overseaLangObj.g_height("核实高(CM)"),
  decimal: 1,
  align: "right",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
  className: "border-right",
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
    minWidth: 180,
  },
  {
    prop: "productName",
    label: overseaLangObj.cp_name || "产品名称",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 140,
  },
  {
    prop: "customerName",
    label: overseaLangObj.kh_customer() || "客户信息",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 140,
  },
  {
    prop: "productNetWeight",
    label: overseaLangObj.product_weight("产品重量"),
    showOverflowTooltip: true,
    sortable: true,
    align: "right",
    minWidth: 100,
    decimal: 3,
  },
  {
    prop: "productVolume",
    label: `${overseaLangObj.tj_volume || "体积"} m³`,
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    className: "border-right",
    align: "right",
    decimal: 6,
  },
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  {
    prop: "vendibility",
    label: overseaLangObj.available_sale("可售"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "quantityInventory",
        width: 100,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "quantityInventoryVolume",
        width: 120,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        className: "border-right",
        decimal: 6,
      },
    ],
  },
  {
    prop: "wDelivered",
    label: overseaLangObj.dd_ck("待出库"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "quantityOutbound",
        width: 100,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "quantityOutboundVolume",
        width: 120,
        align: "right",
        sortable: true,
        className: "border-right",
        showOverflowTooltip: true,
        decimal: 6,
      },
    ],
  },
  {
    prop: "rejects",
    label: overseaLangObj.defective_product("不良品"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "quantityDefective",
        width: 100,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "quantityDefectiveVolume",
        width: 120,
        align: "right",
        sortable: true,
        className: "border-right",
        showOverflowTooltip: true,
        decimal: 6,
      },
    ],
  },
  {
    prop: "destroyed",
    label: overseaLangObj.dd_xh || "待销毁",
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "quantityDestroy",
        width: 100,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "quantityDestroyVolume",
        width: 120,
        align: "right",
        sortable: true,
        className: "border-right",
        showOverflowTooltip: true,
        decimal: 6,
      },
    ],
  },
  {
    prop: "total",
    label: overseaLangObj.zs_total("总计"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "totalCount",
        width: 100,
        align: "right",
        sortable: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "totalVolume",
        width: 120,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        className: "border-right",
        decimal: 6,
      },
    ],
  },
  {
    prop: "operation",
    label: overseaLangObj.cz_operation || "操作",
    width: 120,
    fixed: "right",
    columnOperation: true,
  },
];

const FCLTableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    prop: "packingTrackingNum",
    label: overseaLangObj.box_number || "箱序号",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 180,
  },
  {
    prop: "customerName",
    label: overseaLangObj.kh_customer() || "客户信息",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 140,
  },
  {
    prop: "sku",
    label: "SKU",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 180,
  },
  {
    prop: "productNetWeight",
    label: overseaLangObj.product_weight("单箱重量KG"),
    showOverflowTooltip: true,
    sortable: true,
    align: "right",
    minWidth: 120,
    decimal: 3,
  },
  {
    prop: "productVolume",
    label: "单箱体积m³",
    label: overseaLangObj.dx_tj_volume("单箱体积m³"),
    showOverflowTooltip: true,
    sortable: true,
    className: "border-right",
    align: "right",
    minWidth: 120,
    decimal: 6,
  },
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  {
    prop: "vendibility",
    label: overseaLangObj.available_sale("可售"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "quantityInventory",
        width: 100,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "quantityInventoryVolume",
        width: 135,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        className: "border-right",
        decimal: 6,
      },
    ],
  },
  {
    prop: "wDelivered",
    label: overseaLangObj.dd_ck("待出库"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "quantityOutbound",
        width: 100,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "quantityOutboundVolume",
        width: 135,
        align: "right",
        sortable: true,
        className: "border-right",
        showOverflowTooltip: true,
        decimal: 6,
      },
    ],
  },
  {
    prop: "rejects",
    label: overseaLangObj.defective_product("不良品"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "quantityDefective",
        width: 100,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "quantityDefectiveVolume",
        width: 135,
        align: "right",
        sortable: true,
        className: "border-right",
        showOverflowTooltip: true,
        decimal: 6,
      },
    ],
  },
  {
    prop: "total",
    label: overseaLangObj.zs_total("总计"),
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: overseaLangObj.sl_num || "数量",
        prop: "totalCount",
        width: 100,
        align: "right",
        sortable: true,
        decimal: 0,
      },
      {
        label: `${overseaLangObj.tj_volume || "体积"} m³`,
        prop: "totalVolume",
        width: 135,
        align: "right",
        sortable: true,
        showOverflowTooltip: true,
        className: "border-right",
        decimal: 6,
      },
    ],
  },
  {
    prop: "operation",
    label: overseaLangObj.cz_operation || "操作",
    width: 120,
    fixed: "right",
    columnOperation: true,
  },
];

export { searchColumns, tableColumns, FCLTableColumns };

export const customDialogCols = (type) => {
  return {
    title: overseaLangObj.wh_cc || "维护尺寸",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      ...(type == 1
        ? [
            {
              span: 24,
              id: "sku",
              label: "SKU：",
              type: "txt",
            },
          ]
        : [
            {
              span: 24,
              id: "packingTrackingNum",
              label: "箱序号：",
              type: "txt",
            },
          ]),
      {
        span: 24,
        id: "productNetWeight",
        label: `${overseaLangObj.product_weight("产品重量")}：`,
        placeholder: "请输入",
        type: "inputNumber",
        numDecimal: 3,
        unit: "KG",
        max: MAX_BOX_WEIGHT,
      },
      {
        span: 24,
        id: "verifyLength",
        label: `${overseaLangObj.c_length("核实长(CM)")}：`,
        placeholder: "请输入",
        type: "inputNumber",
        numDecimal: 1,
        unit: "CM",
        max: MAX_PRODUCT_LWH,
      },
      {
        span: 24,
        id: "verifyWidth",
        label: `${overseaLangObj.k_width("核实宽(CM)")}：`,
        placeholder: "请输入",
        type: "inputNumber",
        numDecimal: 1,
        unit: "CM",
        max: MAX_PRODUCT_LWH,
      },
      {
        span: 24,
        id: "verifyHeight",
        label: `${overseaLangObj.g_height("核实高(CM)")}：`,
        placeholder: "请输入",
        type: "inputNumber",
        numDecimal: 1,
        unit: "CM",
        max: MAX_PRODUCT_LWH,
      },
    ],
    formRules: {
      productNetWeight: [
        { required: true, message: `请输入产品重量`, trigger: "blur" },
      ],
      verifyLength: [
        { required: true, message: `请输入核实长`, trigger: "blur" },
      ],
      verifyWidth: [
        { required: true, message: `请输入核实宽`, trigger: "blur" },
      ],
      verifyHeight: [
        { required: true, message: `请输入核实高`, trigger: "blur" },
      ],
    },
  };
};
