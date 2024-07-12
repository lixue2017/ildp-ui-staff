import overseaLangObj from "@/language/overseasLang.js";
import {
  httpWarehousePublicSelect,
  httpTraySelect,
} from "@/comModel/warehouse";

const SEARCH_COL_1 = {
  span: 8,
  id: "traySn",
  label: `${overseaLangObj.pallet_number("托盘号")}：`,
  type: "txt",
};

const SEARCH_COL_2 = {
  span: 8,
  id: "storageMode",
  label: `${overseaLangObj.yt_tray || "托盘用途"}：`,
  type: "txt",
  dicsStr: "storageMode",
  customDicsArr: [0, 1, 2], // 对象属性名
  customDicsVal: "storageMode",
};

const SEARCH_COL_3 = {
  span: 8,
  id: "latestUsageTime",
  label: `${overseaLangObj.zx_sy_time || "最新使用时间"}：`,
  type: "txt",
};
const SEARCH_COL_4 = {
  span: 8,
  id: "customerName",
  label: `${overseaLangObj.kh_customer("客户信息")}：`,
  type: "txt",
};

const SEARCH_COL_5 = {
  span: 8,
  id: "locationCode",
  label: `${overseaLangObj.sj_location || "上架库位"}：`,
  type: "txt",
  render: (r) => `${r.locationArea || "--"}/${r.locationSn || "--"}`,
};
const SEARCH_COL_6 = {
  span: 8,
  id: "latestListingTime",
  label: `${overseaLangObj.zx_sj_time || "最新上架时间"}：`,
  type: "txt",
};

const searchLists = {
  0: [
    SEARCH_COL_1,
    SEARCH_COL_2,
    SEARCH_COL_3,
    SEARCH_COL_4,
    SEARCH_COL_5,
    SEARCH_COL_6,
  ],
  1: [
    SEARCH_COL_1,
    SEARCH_COL_2,
    SEARCH_COL_3,
    SEARCH_COL_4,
    SEARCH_COL_5,
    SEARCH_COL_6,
  ],
  2: [SEARCH_COL_1, SEARCH_COL_2, SEARCH_COL_3, SEARCH_COL_4],
};

export const searchColumns = (type) => {
  const cols = searchLists[type];
  return [
    {
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

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  fixed: "left",
  align: "center",
};

const TABLE_COL_1 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "receivingSource",
  label: overseaLangObj.rk_ly || "入库来源",
  minWidth: 100,
  fontColor: true,
  basicType: "warehousingSource",
};
const TABLE_COL_3 = {
  prop: "boxSn",
  label: overseaLangObj.box_number || "箱序号",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "volume",
  label: overseaLangObj.tj_m_volume || "体积/m³",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 4,
};
const TABLE_COL_5 = {
  prop: "weight",
  label: overseaLangObj.zl_weight || "重量/KG",
  width: 100,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 4,
};
const TABLE_COL_6 = {
  prop: "destination",
  label: overseaLangObj.md_dz || "目的地址",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "warehousingTime",
  label: overseaLangObj.rk_time || "入库日期",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "customerName",
  label: "客户信息",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "UNCHARTED_TABLE_16",
  label: "派车单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "UNCHARTED_TABLE_17",
  label: "派送时间",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_11 = {
  prop: "warehouseCode",
  label: overseaLangObj.mdc_warehouse() || "目的仓",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "totalNum",
  label: overseaLangObj.sh_num || "收货数",
  minWidth: 120,
  align: "right",
  decimal: 0,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "oofshelfNum",
  label: "已下架",
  minWidth: 120,
  align: "right",
  decimal: 0,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "surplusNum",
  label: "剩余数",
  minWidth: 120,
  align: "right",
  decimal: 0,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "productName",
  label: overseaLangObj.cp_name || "产品名称",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_18 = {
  prop: "totalNum",
  label: overseaLangObj.sl_num || "数量",
  width: 80,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const TABLE_COL_OPERATION = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  minWidth: 80,
};

export const tableConfig = (type, isEdit) => {
  const tableLists = {
    0: [
      TABLE_COL_12, //收货数
      // TABLE_COL_13,//已下架
      // TABLE_COL_14,//剩余数
      TABLE_COL_7, //入库日期
      TABLE_COL_15, //产品SKU
      TABLE_COL_16, //产品名称
    ],
    1: [
      TABLE_COL_12, //收货数
      // TABLE_COL_13,//已下架
      // TABLE_COL_14,//剩余数
      TABLE_COL_7, //入库日期
      TABLE_COL_15, //产品SKU
      TABLE_COL_16, //产品名称
    ],
    2: [
      TABLE_COL_11, //目的仓
      TABLE_COL_6, //目的地址
      TABLE_COL_7, //入库日期
      // TABLE_COL_8,//客户信息
      // TABLE_COL_9,//派车单号
      // TABLE_COL_10,//派送时间
      TABLE_COL_OPERATION,
    ],
  };
  return [
    TABLE_COL_INDEX,
    ...(isEdit ? [TABLE_COL_SELECTION] : []),
    { ...TABLE_COL_1, sortable: true, fixed: "left" }, //工作单号
    { ...TABLE_COL_2, sortable: true, fixed: "left" }, //入库来源
    ...(type != 0 ? [TABLE_COL_3] : []), //箱序号
    ...(type == 2 ? [TABLE_COL_17, TABLE_COL_18] : []), // 数量
    TABLE_COL_4, //体积
    TABLE_COL_5, //重量
    ...tableLists[type],
  ];
};

const DLG_FORM_COL_1 = {
  span: 12,
  id: "traySn",
  label: `${overseaLangObj.pallet_number()}：`,
  type: "txt",
};
const DLG_FORM_COL_2 = {
  span: 12,
  id: "distributionType",
  label: `${overseaLangObj.zh_ps("转派送方式")}：`,
  type: "select",
  placeholder: "请选择",
  basicType: "distributionType",
};
const DLG_FORM_COL_3 = {
  span: 12,
  id: "isNew",
  label: `${overseaLangObj.tp_type || "托盘类型"}：`,
  type: "radio",
  options: [
    {
      value: 1,
      label: overseaLangObj.new_tray || "新托盘",
    },
    {
      value: 0,
      label: overseaLangObj.yy_tray || "已有托盘",
    },
  ],
};
const DLG_FORM_COL_4 = {
  span: 12,
  id: "targetWmsId",
  label: `${overseaLangObj.place_of_receipt || "目的地"}：`,
  ...httpWarehousePublicSelect({
    typeList: "0,1,2,3,4",
  }),
  type: "slot",
};

export const dialogFormCols = (val, obj) => {
  const { isDisable, storageMode } = obj || {};
  let cols = [
    DLG_FORM_COL_1,
    ...(storageMode == 2 ? [] : [DLG_FORM_COL_2]),
    {
      ...DLG_FORM_COL_3,
      // disable: isDisable,
    },
    ...(storageMode == 2 ? [] : [DLG_FORM_COL_4]),
  ];
  if (val !== 1) {
    cols.push({
      span: 12,
      id: "targetTrayId",
      selectLabelKey: "targetTraySnName",
      label: `${overseaLangObj.tp_bh || "托盘编号"}：`,
      ...httpTraySelect(),
      type: "slot",
      // disabled: isDisable,
    });
  }
  return [
    {
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
  ];
};

export const dialogFormRules = () => {
  return {
    distributionType: [
      { required: true, message: "请选择转派送方式", trigger: "change" },
    ],
    targetWmsId: [
      { required: true, message: "请选择目的地", trigger: "change" },
    ],
    targetTrayId: [
      { required: true, message: "请选择托盘编号", trigger: "change" },
    ],
  };
};

export const tableDialogColumn = (storageMode) => {
  return [
    TABLE_COL_INDEX,
    TABLE_COL_1, //工作单号
    TABLE_COL_2, //入库来源
    {
      prop: "storageModeName",
      label: overseaLangObj.cc_fs || "存仓方式",
      minWidth: 120,
      showOverflowTooltip: true,
      render: (r) => ["SKU存仓", "整箱存仓", "大货中转"][storageMode] || "--",
    },
    { ...TABLE_COL_12, sortable: undefined }, //收货数
    { ...TABLE_COL_15, sortable: undefined }, //产品SKU
  ];
};

const TABLE_NUM_COL_301 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_NUM_COL_302 = {
  prop: "traySn",
  label: "托盘",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_NUM_COL_303 = {
  prop: "targetWmsCode",
  label: "目的仓",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_NUM_COL_304 = {
  prop: "num",
  label: "数量",
  width: 80,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
export const tableNumDialogCols = () => {
  return [
    TABLE_NUM_COL_301,
    TABLE_NUM_COL_302,
    TABLE_NUM_COL_303,
    TABLE_NUM_COL_304,
  ];
};

export const customDialogCols = () => {
  return {
    title: "更改",
    width: "1165px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        span: 12,
        id: "shipmentId",
        label: "Shipment ID：",
        placeholder: "请输入",
        type: "text",
      },
      {
        span: 12,
        id: "targetWmsId",
        label: "目的仓：",
        ...httpWarehousePublicSelect({
          typeList: "0,1,2,3,4",
        }),
      },
      {
        span: 24,
        id: "tableSlot",
        labelWidth: "0px",
        type: "slot",
      },
    ],
    formRules: {
      shipmentId: [
        { required: true, message: `请输入Shipment ID`, trigger: "blur" },
      ],
      targetWmsId: [
        { required: true, message: `请选择目的仓`, trigger: "change" },
      ],
    },
  };
};
