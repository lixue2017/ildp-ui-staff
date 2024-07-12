import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import {
  httpCustomerSelect,
  httpUserSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";
import { toFixedNum } from "@/utils/instructions";
import overseaLangObj from "@/language/overseasLang.js";

const SEARCH_COL_2 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
  residueCol: 2,
};
export const searchColumns = (colsConf) => {
  let SEARCH_COLS = [
    {
      id: "beginTime",
      label: `${overseaLangObj.create_time || "创建时间"}：`,
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      type: "daterange",
      valueFormat: "yyyy-MM-dd",
    },
    {
      id: "customerIdSearch",
      label: `${overseaLangObj.wtr_customer || "委托人"}：`,
      ...httpCustomerSelect({
        queryType: colsConf === "orderReceiving" ? 1 : undefined,
      }),
    },
    SEARCH_COL_2,
    {
      id: "warehousingSource",
      label: `${overseaLangObj.rc_ly() || "入仓来源"}：`,
      placeholder: "入仓来源（多选）",
      type: "select",
      multiple: true,
      basicType: "warehousingSource",
    },
    // {
    // 	id: "targetWarehouseId",
    // 	label: "目的仓：",
    // 	placeholder: "目的仓",
    // 	...httpWarehousePublicSelect({ itemId: "parentId" }),
    // }
  ];
  // if (colsConf !== "orderReceiving") {
  SEARCH_COLS.push({
    id: "statusSearch",
    label: `${overseaLangObj.zt_status || "状态"}：`,
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    basicType: "orderState",
    hideList: colsConf !== "orderReceiving" ? [0, 1] : [],
  });
  // }
  if (["orderReceiving", "operationReceiving"].includes(colsConf)) {
    SEARCH_COLS.push(
      {
        id: "operationMain",
        label: "所属公司：",
        ...httpLogisticsCustomerSelect(),
      },
      {
        id: "salesman",
        label: "业务员：",
        ...httpUserSelect(),
      }
    );
  }
  SEARCH_COLS.push({
    id: "consultSn",
    label: `${overseaLangObj.ck_bm || "参考编号"}：`,
    placeholder: "请输入",
    type: "text",
  });
  return SEARCH_COLS;
};

const TABLE_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "operationMainName",
  label: "所属公司",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_2 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_3 = {
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  showOverflowTooltip: true,
  minWidth: 150,
  // customRow: true,
  columnLink: true,
  columnCopyTxt: true,
  sortable: "custom",
  fixed: "left",
};
const TABLE_COL_4 = {
  prop: "warehousingSource",
  label: overseaLangObj.rc_ly() || "入仓来源",
  showOverflowTooltip: true,
  sortable: "custom",
  minWidth: 100,
  fixed: "left",
  basicType: "warehousingSource",
};
const TABLE_COL_5 = {
  prop: "customerName",
  label: overseaLangObj.wtr_customer || "委托人",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COL_6 = {
  prop: "consultSn",
  label: overseaLangObj.ck_bm || "参考编号",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_7 = {
  prop: "targetWarehouse",
  label: "目的仓",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COL_8 = {
  prop: "forecastCount",
  label: overseaLangObj.yb_sl || "预报数量",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: overseaLangObj.bg_num || "包裹数",
      prop: "totalPredictionBoxNum",
      sortable: "custom",
      width: 86,
    },
    {
      label: overseaLangObj.sku_num() || "SKU数",
      prop: "totalPredictionSkuNum",
      sortable: "custom",
      width: 86,
      className: "border-right",
    },
  ],
};
const TABLE_COL_9 = {
  prop: "arrivalCount",
  label: overseaLangObj.dh_num || "到货数量",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: overseaLangObj.bg_num || "包裹数",
      prop: "totalArrivalBoxNum",
      sortable: "custom",
      width: 86,
    },
    {
      label: overseaLangObj.sku_num() || "SKU数",
      prop: "totalArrivalSkuNum",
      sortable: "custom",
      width: 86,
      className: "border-right",
    },
  ],
};
const TABLE_COL_10 = {
  prop: "balanceCount",
  label: overseaLangObj.ce_num || "差额数量",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: overseaLangObj.bg_num || "包裹数",
      prop: "differenceBoxNum",
      sortable: "custom",
      width: 86,
    },
    {
      label: overseaLangObj.sku_num() || "SKU数",
      prop: "differenceSkuNum",
      sortable: "custom",
      width: 86,
      className: "border-right",
    },
  ],
};
const TABLE_COL_11 = {
  prop: "estimateWarehousingTime",
  label: overseaLangObj.yj_rc_sj || "预计入仓时间",
  sortable: "custom",
  showOverflowTooltip: true,
  width: 136,
};
const TABLE_COL_12 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  sortable: "custom",
  showOverflowTooltip: true,
  width: 136,
};
const TABLE_COL_13 = {
  prop: "firstTakeFreightTime",
  label: overseaLangObj.sc_sh_time || "首次收货时间",
  sortable: "custom",
  showOverflowTooltip: true,
  width: 136,
};
const TABLE_COL_14 = {
  prop: "remark",
  label: overseaLangObj.bz_remark() || "备注",
  sortable: "custom",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_15 = {
  prop: "orderState",
  label: overseaLangObj.zt_status || "状态",
  width: 86,
  dotColor: true,
  sortable: "custom",
  basicType: "orderState",
  fixed: "right",
};
const TABLE_COL_16 = {
  prop: "operatorName",
  label: "操作员",
  sortable: "custom",
  showOverflowTooltip: true,
  className: "border-right",
  minWidth: 120,
};
const TABLE_OPERATION = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 124,
  fixed: "right",
  columnOperation: true,
};

export const tableColumns = (vType) => {
  return [
    TABLE_COL_0,
    ...(vType === "warehouseReceiving" ? [TABLE_COL_SELECTION] : []),
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    {
      ...TABLE_COL_6,
      // className: vType !== "warehouseReceiving" ? "" : "border-right",
    },
    ...(vType !== "warehouseReceiving" ? [TABLE_COL_1, TABLE_COL_2] : []),
    // TABLE_COL_7,
    TABLE_COL_16,
    TABLE_COL_8,
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    ...(vType !== "operationReceiving" ? [TABLE_OPERATION] : []),
  ];
};

export const grossTotal = [
  {
    label: `${overseaLangObj.zxs_total("合计箱数")}：`,
    prop: "totalPredictionBoxNum",
  },
  // {
  //   label: 'SKU类数：',
  //   prop: 'skuTypeNum'
  // },
  {
    label: `${overseaLangObj.sku_total || "合计SKU数"}：`,
    prop: "totalPredictionSkuNum",
  },
  {
    label: `${overseaLangObj.total_volume("合计体积")}：`,
    prop: "totalVolume",
  },
  {
    label: `${overseaLangObj.total_weight("合计重量")}：`,
    prop: "totalWeight",
  },
];

const GOODS_TABLE_COL_1 = {
  prop: "storageType",
  label: "存仓类型",
  showOverflowTooltip: true,
  basicType: "stockNumType",
};
const GOODS_TABLE_COL_2 = {
  prop: "boxSn",
  label: overseaLangObj.box_number || "箱序号",
  showOverflowTooltip: true,
};
const GOODS_TABLE_COL_3 = {
  label: "箱长宽高(CM)",
  prop: "boxLong",
  minWidth: 150,
  showOverflowTooltip: true,
  render: (row) =>
    `${toFixedNum(row.boxLong, 1)}*${toFixedNum(row.boxWide, 1)}*${toFixedNum(
      row.boxHigh,
      1
    )}`,
};
const GOODS_TABLE_COL_4 = {
  prop: "predictionNum",
  label: overseaLangObj.forecast_box_count || "预报箱数",
  showOverflowTooltip: true,
  align: "right",
};
const GOODS_TABLE_COL_5 = {
  prop: "skuNum",
  label: "单箱产品数",
  showOverflowTooltip: true,
  align: "right",
};
const GOODS_TABLE_COL_51 = {
  prop: "boxWeight",
  label: overseaLangObj.dx_weight() || "单箱重量",
  showOverflowTooltip: true,
  align: "right",
};
const GOODS_TABLE_COL_6 = {
  prop: "sku",
  label: "SKU",
  showOverflowTooltip: true,
};
const GOODS_TABLE_COL_7 = {
  label: "产品名称(CN)",
  prop: "skuName",
  showOverflowTooltip: true,
};
const GOODS_TABLE_COL_8 = {
  label: "产品长宽高(CM)",
  prop: "skuLong",
  minWidth: 150,
  showOverflowTooltip: true,
  render: (row) =>
    `${toFixedNum(row.skuLong, 1)}*${toFixedNum(row.skuWide, 1)}*${toFixedNum(
      row.skuHigh,
      1
    )}`,
};

const GOODS_TABLE_COL_9 = {
  label: overseaLangObj.xc_length || "箱长(CM)",
  prop: "boxLong",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
  decimal: 1,
};
const GOODS_TABLE_COL_10 = {
  label: overseaLangObj.xk_width || "箱宽(CM)",
  prop: "boxWide",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
  decimal: 1,
};
const GOODS_TABLE_COL_11 = {
  label: overseaLangObj.xg_height || "箱高(CM)",
  prop: "boxHigh",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
  decimal: 1,
};
const GOODS_TABLE_COL_12 = {
  prop: "boxVolume",
  label: overseaLangObj.dx_tj_volume() || "单箱体积(CBM)",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const GOOD_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  width: 1,
  fixed: "left",
};

export const goodsTableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  GOOD_COLS_EXPAND,
  GOODS_TABLE_COL_2, //箱序号
  GOODS_TABLE_COL_1, //入库用途
  GOODS_TABLE_COL_4, //预报箱数
  GOODS_TABLE_COL_9, //长
  GOODS_TABLE_COL_10, //宽
  GOODS_TABLE_COL_11, //高
  GOODS_TABLE_COL_12, //单箱体积
  GOODS_TABLE_COL_51, //单箱重量
];

const tabsConfig = {
  columns: [
    {
      label: overseaLangObj.ax_sh || "按箱收货",
      isBox: true,
      key: 10,
    },
    {
      label: overseaLangObj.a_sku_sh || "按SKU收货",
      isSku: true,
      key: 20,
    },
    {
      label: overseaLangObj.base_info || "基本信息",
      key: 30,
    },
    {
      label: overseaLangObj.receivable_payable || "应收应付",
      key: 40,
    },
    {
      label: overseaLangObj.fj_attachment || "附件信息",
      key: 50,
    },
    {
      label: overseaLangObj.logistics_trajectory || "物流信息",
      key: 60,
    },
    {
      label: overseaLangObj.operation_records || "操作记录",
      key: 70,
    },
  ],
  active: 1,
};

const DETAILS_FORM_COL_1 = {
  span: 9,
  id: "operateMainName",
  label: `${overseaLangObj.kh_gs || "客户归属"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_2 = {
  span: 8,
  id: "warehouseName",
  label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_3 = {
  span: 7,
  id: "estimateWarehousingTime",
  label: `${overseaLangObj.yj_rc_sj || "预计入仓时间"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_4 = {
  span: 9,
  id: "warehousingSource",
  label: `${overseaLangObj.rk_ly || "入库来源"}：`,
  type: "radio",
  basicType: "downListWarehousingSource",
  disable: true,
};
const DETAILS_FORM_COL_5 = {
  span: 8,
  id: "trackingSn",
  label: `${overseaLangObj.tracking_no || "跟踪号"}：`,
  type: "txt",
};
const DETAILS_FORM_COL_6 = {
  span: 7,
  id: "consultSn",
  label: `${overseaLangObj.ck_bm || "参考编号"}：`,
  type: "txt",
};

export const warehouseHeadCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                DETAILS_FORM_COL_1,
                DETAILS_FORM_COL_2,
                DETAILS_FORM_COL_3,
                DETAILS_FORM_COL_4,
                DETAILS_FORM_COL_5,
                DETAILS_FORM_COL_6,
                // {
                // 	span: 24,
                // 	id: "remark",
                // 	label: "补充说明：",
                // 	type: "txt"
                // },
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const warehouseTypeCols = (viewType) => {
  let warehouseRows = [
    {
      // className: 'border-top-solid',
      rows: [
        {
          cols: [
            {
              span: 24,
              id: "tableData",
              labelWidth: "0",
              type: "slot",
            },
          ],
        },
      ],
    },
  ];
  if (viewType === "orderReceiving") {
    // 订单-第三方入库详情
    warehouseRows.push({
      rows: [
        {
          cols: [
            {
              span: 24,
              id: "remark",
              label: "入仓补充说明",
              type: "txt",
              className: "label-top-title",
            },
            {
              span: 24,
              id: "businessRemark",
              label: "业务备注",
              type: "textarea",
              placeholder: "请输入",
              className: "label-top-title",
            },
          ],
        },
      ],
    });
  }
  return [
    {
      fieldList: warehouseRows,
    },
  ];
};

export { tabsConfig };
