import { getDictObj } from "@/utils/index";
import { toFixedNum } from "@/utils/instructions";
import { postBatchPushLocation } from "@/api/warehouse/manage";
import {
  httpUserSelect,
  httpAllDealingCompanySelect,
} from "@/comModel/httpSelect";
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
  id: "orderTypes",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  placeholder: "入库来源(多选)",
  multiple: true,
  type: "select",
  basicType: "warehousingSource",
};
const SEARCH_COL_3 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_4 = {
  id: "realityTrayNum",
  label: `${overseaLangObj.pallet_number() || "托盘号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_5 = {
  id: "state",
  label: `${overseaLangObj.sj_status || "上架状态"}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "trayPutState",
};
const SEARCH_COL_6 = {
  id: "packingTrackingNum",
  label: "箱号：",
  placeholder: "箱号",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "customerName",
  label: "客户名称：",
  placeholder: "客户名称",
  type: "text",
};

// ----------------------
const SEARCH_COL_8 = {
  id: "locationCode",
  label: `${overseaLangObj.sj_location || "上架库位"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_9 = {
  startId: "minTakeNum",
  endId: "maxTakeNum",
  label: `${overseaLangObj.sh_num || "收货数"}：`,
  startPlaceholder: "收货数≤",
  endPlaceholder: "<收货数",
  type: "rangeSelect",
};
const SEARCH_COL_10 = {
  startId: "UNCHARTED_SEARCH_10_START",
  endId: "UNCHARTED_SEARCH_10_END",
  label: "库存数：",
  startPlaceholder: "库存数<",
  endPlaceholder: "<库存数",
  type: "rangeSelect",
};
const SEARCH_COL_11 = {
  id: "customerId",
  label: `${overseaLangObj.kh_customer() || "客户信息"}：`,
  ...httpAllDealingCompanySelect(),
};

const SEARCH_COL_12 = {
  id: "sku",
  label: `${overseaLangObj.cp_sku || "产品SKU"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_13 = {
  id: "skuName",
  label: `${overseaLangObj.cp_name || "产品名称"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_14 = {
  id: "shipmentId",
  label: "Shipment Id：",
  placeholder: "请输入",
  type: "text",
};
export const searchColumns = (idx) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                [
                  SEARCH_COL_1,
                  SEARCH_COL_2,
                  SEARCH_COL_3,
                  SEARCH_COL_4,
                  SEARCH_COL_5,
                  SEARCH_COL_8,
                  SEARCH_COL_9,
                  // SEARCH_COL_10,
                  SEARCH_COL_11,
                  SEARCH_COL_12,
                  SEARCH_COL_13,
                ],
                [
                  SEARCH_COL_1,
                  {
                    ...SEARCH_COL_2,
                    hideList: [0, 3],
                  },
                  SEARCH_COL_3,
                  SEARCH_COL_4,
                  SEARCH_COL_5,
                  SEARCH_COL_8,
                  SEARCH_COL_9,
                  // SEARCH_COL_10,
                  SEARCH_COL_11,
                  SEARCH_COL_14,
                  SEARCH_COL_12,
                ],
              ][idx],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number() || "托盘号",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
  columnLink: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "freightNum",
  label: "数量",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "state",
  label: overseaLangObj.sj_status || "上架状态",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "trayPutState",
  dotColor: true,
  fixed: "right",
};
const TABLE_COL_4 = {
  prop: "locationCode",
  label: overseaLangObj.sj_location || "上架库位",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  minWidth: 170,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_5_1 = {
  prop: "wholeCabinetSn",
  label: overseaLangObj.gn_djh || "国内登记号",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_6 = {
  prop: "orderType",
  label: overseaLangObj.rk_ly || "入库来源",
  minWidth: 100,
  fontColor: true,
  sortable: true,
  basicType: "warehousingSource",
  fixed: "left",
};
const TABLE_COL_7 = {
  prop: "enterWarehouseTime",
  label: overseaLangObj.rk_time || "入库日期",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_1_1 = {
  prop: "sku",
  label: "产品SKU",
  minWidth: 120,
  // fixed: "left",
  className: "border-right",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_1_2 = {
  prop: "prediction_x8",
  label: "预报数",
  multiHeader: true,
  className: "border-left border-right",
  list: [
    {
      label: "SKU数",
      prop: "forecastSkuNum",
      width: 100,
      className: "border-right",
      align: "center",
      sortable: true,
      showOverflowTooltip: true,
      render: (row) => row.forecastSkuNum || 0,
    },
    {
      label: "LPN数",
      prop: "forecastLpnNum",
      width: 100,
      align: "center",
      className: "border-right",
      sortable: true,
      showOverflowTooltip: true,
      render: (row) => row.forecastLpnNum || 0,
    },
    {
      label: "总数",
      prop: "forecastTotalNum",
      width: 100,
      align: "center",
      className: "border-right",
      sortable: true,
      showOverflowTooltip: true,
      render: (row) => row.forecastTotalNum || 0,
    },
  ],
};
const TABLE_COL_1_3 = {
  prop: "receiving_x9",
  label: "收货数",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: "SKU数",
      prop: "takeFreightSkuNum",
      width: 100,
      align: "center",
      className: "border-right",
      sortable: true,
      showOverflowTooltip: true,
      render: (row) => row.takeFreightSkuNum || 0,
    },
    {
      label: "LPN数",
      prop: "takeFreightLpnNum",
      width: 100,
      align: "center",
      className: "border-right",
      sortable: true,
      showOverflowTooltip: true,
      render: (row) => row.takeFreightLpnNum || 0,
    },
    {
      label: "总数",
      prop: "takeFreightTotalNum",
      width: 100,
      align: "center",
      className: "border-right",
      sortable: true,
      showOverflowTooltip: true,
      render: (row) => row.takeFreightTotalNum || 0,
    },
  ],
};
const TABLE_COL_1_4 = {
  prop: "predictionVolume",
  label: "预报体积/m³",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 4,
};
const TABLE_COL_1_5 = {
  prop: "verifyVolume",
  label: overseaLangObj.ks_volume("核实体积/m³"),
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 4,
};
const TABLE_COL_2_1 = {
  prop: "packingTrackingNum",
  label: "箱号",
  minWidth: 120,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
// const TABLE_COL_2_7 = {
//   prop: "takeFreightBoxNum",
//   label: "箱数",
//   minWidth: 120,
//   showOverflowTooltip: true
// }
const TABLE_COL_2_2 = {
  prop: "volume",
  label: "体积/m³",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => toFixedNum(row.volume),
};
const TABLE_COL_2_3 = {
  prop: "weight",
  label: "重量/KG",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => toFixedNum(row.weight),
};
const TABLE_COL_2_4 = {
  prop: "destination",
  label: "目的地址",
  minWidth: 130,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "customerName",
  label: overseaLangObj.kh_customer() || "客户信息",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "num",
  label: overseaLangObj.sh_num || "收货数",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
const TABLE_COL_10 = {
  prop: "oofshelfNum",
  label: "已下架",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
const TABLE_COL_11 = {
  prop: "surplusNum",
  label: "库存数",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  decimal: 0,
  align: "right",
};
const TABLE_COL_12 = {
  prop: "boxSkus",
  label: overseaLangObj.cp_sku || "产品SKU",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "skuName",
  label: overseaLangObj.cp_name || "产品名称",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "shipmentId",
  label: "Shipment ID",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  customRow: true,
  fixed: "right",
  minWidth: 80,
};

const TABLE_TAB_1 = [
  TABLE_COL_INDEX,
  TABLE_COL_SELECTION,
  TABLE_COL_1, //托盘号
  TABLE_COL_5, //工作单号
  TABLE_COL_5_1, // 国内登记号
  TABLE_COL_6, //入库来源
  TABLE_COL_4, //上架库位
  TABLE_COL_7, //入库日期
  TABLE_COL_9, //收货数
  // TABLE_COL_10,//已下架
  // TABLE_COL_11,//剩余数
  // TABLE_COL_1_4,//预报体积
  TABLE_COL_1_5, //核实体积
  TABLE_COL_12, //产品SKU
  TABLE_COL_13, //产品名称
  TABLE_COL_8, //客户信息
  TABLE_COL_3, //上架状态
  TABLE_COL_OPERATION, //操作
];
const TABLE_TAB_2 = [
  TABLE_COL_INDEX,
  TABLE_COL_SELECTION,
  TABLE_COL_1, //托盘号
  TABLE_COL_5, //工作单号
  TABLE_COL_5_1, // 国内登记号
  TABLE_COL_6, //入库来源
  TABLE_COL_4, //上架库位
  TABLE_COL_7, //入库日期
  TABLE_COL_14, //箱序号
  TABLE_COL_12, //产品SKU
  TABLE_COL_9, //收货数
  // TABLE_COL_10,//已下架
  // TABLE_COL_11,//剩余数
  // TABLE_COL_1_4,//预报体积
  TABLE_COL_1_5, //核实体积
  TABLE_COL_8, //客户信息
  TABLE_COL_3, //上架状态
  TABLE_COL_OPERATION,
];
export const tableColumns = (tab = 0) => {
  return [TABLE_TAB_1, TABLE_TAB_2][tab];
};

const DETAIL_COL_0 = {
  span: 24,
  id: "slotWMSRk",
  label: "WMS入库单入库：",
  placeholder: "--",
  type: "slot",
};
const DETAIL_COL_1 = {
  span: 6,
  id: "ckdm",
  label: "WMS入库单号：",
  placeholder: "--",
  type: "txt",
};
const DETAIL_COL_2 = {
  span: 6,
  id: "ckdm",
  label: "委托单位：",
  placeholder: "--",
  type: "txt",
};
const DETAIL_COL_3 = {
  span: 6,
  id: "ckdm",
  label: "预报箱数：",
  placeholder: "--",
  type: "txt",
};
const DETAIL_COL_4 = {
  span: 6,
  id: "ckdm",
  label: "SKU类数：",
  placeholder: "--",
  type: "txt",
};
const DETAIL_COL_5 = {
  span: 6,
  id: "ckdm",
  label: "SKU数：",
  placeholder: "--",
  type: "txt",
};
const DETAIL_COL_FAB_0 = {
  span: 24,
  id: "slotFBARk",
  label: "FBA退仓入库：",
  placeholder: "--",
  type: "slot",
};
const DETAIL_COL_FAB_1 = {
  span: 6,
  id: "orderNum",
  label: "FBA退仓单号：",
  placeholder: "--",
  type: "txt",
};
const DETAIL_COL_FAB_3 = {
  span: 6,
  id: "ybbgs",
  label: "预报包裹数：",
  placeholder: "--",
  type: "txt",
};
export const detailFromCols = (typeConf = 0) => {
  const DETAIL_COL_FROM = [
    // DETAIL_COL_0,
    DETAIL_COL_1,
    DETAIL_COL_2,
    DETAIL_COL_3,
    DETAIL_COL_4,
    DETAIL_COL_5,
  ];
  const DETAIL_COL_FBA_FROM = [
    // DETAIL_COL_FAB_0,
    DETAIL_COL_FAB_1,
    DETAIL_COL_2,
    DETAIL_COL_FAB_3,
    DETAIL_COL_4,
    DETAIL_COL_5,
  ];
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [DETAIL_COL_FROM, DETAIL_COL_FBA_FROM][typeConf],
            },
          ],
        },
      ],
    },
  ];
};

const DETAIL_TABLE_COL_1 = {
  prop: "code1",
  label: "箱号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_2 = {
  prop: "code2",
  label: "产品SKU",
  minWidth: 130,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_3 = {
  prop: "code3",
  label: "长",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (rows) => `${toFixedNum(rows.productLength)}`,
};
const DETAIL_TABLE_COL_4 = {
  prop: "code4",
  label: "宽",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (rows) => `${toFixedNum(rows.productLength)}`,
};
const DETAIL_TABLE_COL_5 = {
  prop: "code5",
  label: "高",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (rows) => `${toFixedNum(rows.productLength)}`,
};
const DETAIL_TABLE_COL_6 = {
  prop: "code6",
  label: "SKU总数",
  minWidth: 120,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_7 = {
  prop: "slotFbark",
  label: "FBA入库",
  customRow: true,
  customHeader: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_COL_8 = {
  prop: "code",
  label: "收货数量",
  minWidth: 120,
  showOverflowTooltip: true,
};

const DETAIL_TABLE_TAB_2_COL_1 = {
  prop: "sku",
  label: "SKU",
  minWidth: 120,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_TAB_2_COL_2 = {
  prop: "cpxx",
  label: "产品名称",
  minWidth: 120,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_TAB_2_COL_3 = {
  prop: "cd",
  label: "长(CM)",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => `${toFixedNum(row.productLength)}`,
};
const DETAIL_TABLE_TAB_2_COL_4 = {
  prop: "kd",
  label: "宽(CM)",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => `${toFixedNum(row.productLength)}`,
};
const DETAIL_TABLE_TAB_2_COL_5 = {
  prop: "gd",
  label: "高(CM)",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => `${toFixedNum(row.productLength)}`,
};
const DETAIL_TABLE_TAB_2_COL_6 = {
  prop: "lf",
  label: "立方(CBM)",
  minWidth: 130,
  showOverflowTooltip: true,
  render: (row) => `${toFixedNum(row.productLength, 4)}`,
};
const DETAIL_TABLE_TAB_2_COL_7 = {
  prop: "mzkg",
  label: "商品毛重(KG)",
  minWidth: 130,
  showOverflowTooltip: true,
  render: (row) => `${toFixedNum(row.productLength)}`,
};
const DETAIL_TABLE_TAB_2_COL_8 = {
  prop: "yussku",
  label: "预收SKU数",
  minWidth: 120,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_TAB_2_COL_9 = {
  prop: "yissku",
  label: "已收SKU数",
  minWidth: 120,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_TAB_2_COL_10 = {
  prop: "slotXh",
  label: "箱号",
  className: "slot-row-xh",
  minWidth: 136,
  customRow: true,
  showOverflowTooltip: true,
};

const DETAIL_TABLE_TAB_1 = [
  TABLE_COL_INDEX,
  DETAIL_TABLE_COL_1,
  DETAIL_TABLE_COL_2,
  DETAIL_TABLE_COL_3,
  DETAIL_TABLE_COL_4,
  DETAIL_TABLE_COL_5,
  DETAIL_TABLE_COL_6,
  DETAIL_TABLE_COL_7,
  DETAIL_TABLE_COL_8,
];
const DETAIL_TABLE_TYPE_CONF = [
  TABLE_COL_INDEX,
  DETAIL_TABLE_TAB_2_COL_1,
  DETAIL_TABLE_TAB_2_COL_2,
  DETAIL_TABLE_TAB_2_COL_3,
  DETAIL_TABLE_TAB_2_COL_4,
  DETAIL_TABLE_TAB_2_COL_5,
  DETAIL_TABLE_TAB_2_COL_6,
  DETAIL_TABLE_TAB_2_COL_7,
];
const DETAIL_TABLE_TAB_2 = [
  ...DETAIL_TABLE_TYPE_CONF,
  DETAIL_TABLE_TAB_2_COL_8,
  DETAIL_TABLE_TAB_2_COL_9,
  DETAIL_TABLE_TAB_2_COL_10,
];
export const detailTableColumns = (tab = 0) => {
  return [DETAIL_TABLE_TAB_1, DETAIL_TABLE_TAB_2][tab];
};

const DETAIL_TABLE_FBA_COL_1 = {
  prop: "slotBgh",
  label: "包裹跟踪号",
  className: "slot-row-bgh",
  minWidth: 150,
  customRow: true,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_FBA_COL_2 = {
  prop: "slotYsSKU",
  label: "预收SKU数",
  className: "slot-row-ys-sku",
  minWidth: 120,
  customRow: true,
  showOverflowTooltip: true,
};
const DETAIL_TABLE_FBA_COL_3 = {
  prop: "slotYss",
  label: "已收数",
  className: "slot-row-yss",
  minWidth: 120,
  customRow: true,
  showOverflowTooltip: true,
};
export const detailTableFBAColumns = () => {
  return [
    ...DETAIL_TABLE_TYPE_CONF,
    DETAIL_TABLE_FBA_COL_1,
    DETAIL_TABLE_FBA_COL_2,
    DETAIL_TABLE_FBA_COL_3,
  ];
};

const EDIT_DLG_COL_1 = {
  span: 8,
  id: "trayNum",
  label: "托盘编号：",
  type: "txt",
};
const EDIT_DLG_COL_2 = {
  span: 8,
  id: "customerName",
  label: "委托人：",
  type: "txt",
};
const EDIT_DLG_COL_3 = {
  span: 8,
  id: "type",
  label: "存仓方式：",
  type: "txt",
  render: (row) => (row.type == 1 ? "按箱存仓" : "SKU存仓"),
};
const EDIT_DLG_COL_4 = {
  span: 10,
  id: "slotPhj",
  label: "",
  labelWidth: "0px",
  type: "slot",
};
const EDIT_DLG_COL_5 = {
  span: 6,
  id: "slotTag",
  label: "",
  labelWidth: "0px",
  type: "slot",
};
const EDIT_DLG_COL_6 = {
  span: 8,
  id: "slotWtr",
  label: "当前委托人：",
  type: "slot",
};

export const editDlgFormCols = (pType = 0) => {
  return {
    columns: [
      {
        ...EDIT_DLG_COL_1,
        span: pType === 4 ? 24 : 8,
      },
      ...(pType === 4 ? [] : [EDIT_DLG_COL_2, EDIT_DLG_COL_3]),
      EDIT_DLG_COL_4,
      EDIT_DLG_COL_5,
      // EDIT_DLG_COL_6
    ],
    formRules: {},
  };
};

export const tableBatchColumn = (typeIn) => {
  return [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "customerName",
      label: overseaLangObj.wtr_customer || "委托人",
      minWidth: 140,
      showOverflowTooltip: true,
      render: (r) =>
        (typeIn === "4"
          ? (r.twarehouseStorageListSonVos || [])
              .map((e) => e.customerName)
              .join(", ") || r.customerName
          : r.customerName) || "--",
    },
    {
      prop: "type",
      label: overseaLangObj.cc_fs || "存仓方式",
      width: 100,
      showOverflowTooltip: true,
      render: (r) =>
        typeIn === "4"
          ? overseaLangObj.large_cargo_transit
          : [overseaLangObj.sku_storage, overseaLangObj.box_storage][
              r.type || 0
            ],
    },
    {
      prop: "traySn",
      label: overseaLangObj.tp_bh || "托盘编号",
      minWidth: 140,
      showOverflowTooltip: true,
      render: (r) =>
        (typeIn === "4" ? r.trayNum || r.traySn : r.traySn) || "--",
    },
    {
      prop: "locationSlot",
      label: overseaLangObj.sj_location || "上架库位",
      minWidth: 160,
      customRow: true,
      request: true,
      fieldItem: {
        id: "locationId",
        selectLabelKey: "kqkw", // 导入时显示的属性名
        size: "mini",
        searchParamName: "name",
        httpRequest: postBatchPushLocation,
        getCustomData: (item) => {
          return {
            key: item.id,
            value: item.id,
            label: `${item.kuqu || "--"}${item.kuwei || ""}(${
              getDictObj("warehousePartitionType", item.kuqulwixing) || "--"
            })`,
          };
        },
      },
    },
  ];
};
