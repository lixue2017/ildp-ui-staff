import {
  httpCustomerSelect,
  httpUserSelect,
  httpLogisticsCustomerSelect,
  httpRoleDeptUserSelect
} from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";
const SEARCH_COL_1 = {
  id: "beginTime",
  label: `${overseaLangObj.create_time || "创建时间"}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_3 = {
  id: "orderSn",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
  residueCol: 2,
};
const SEARCH_COL_5 = {
  startId: "xx_Start_5",
  endId: "xx_End_5",
  label: "包裹数：",
  startPlaceholder: "包裹数<",
  endPlaceholder: "≤包裹数",
  type: "rangeSelect",
};
const SEARCH_COL_6 = {
  startId: "xx_Start_6",
  endId: "xx_End_6",
  label: "产品数：",
  startPlaceholder: "产品数<",
  endPlaceholder: "≤产品数",
  type: "rangeSelect",
};
const SEARCH_COL_7 = {
  id: "stateList",
  label: `${overseaLangObj.zt_status || "状态"}：`,
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "returnWmsOrderState",
};
const SEARCH_COL_8 = {
  id: "referenceNo",
  label: `${overseaLangObj.ck_bm || "参考编号"}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_9 = {
  id: "salesmanId",
  label: "业务员：",
  ...httpUserSelect(),
};
const SEARCH_COL_10 = {
  id: "customerBelongId",
  label: "所属公司：",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_202 = {
  id: "trackSn",
  label: `${overseaLangObj.tracking_no_fn("包裹跟踪号")}：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_204 = {
  id: "stateList",
  label: "状态：",
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "returnWmsOrderPackageState",
  hideList: [0, 1, 11],
};
const SEARCH_COL_205 = {
  id: "sku",
  label: "SKU：",
  placeholder: "请输入",
  type: "text",
};
export const searchColumns = (cType, tName) => {
  const stateHideList = {
    tc_order: [0, 11],
    tc_operate: [0, 1, 11],
    tc_warehouse: [0, 1, 11],
  };
  let SEARCH_COLS_1 = [
    SEARCH_COL_1,
    {
      id: "customerId",
      label: `${overseaLangObj.wtr_customer || "委托人"}：`,
      ...httpCustomerSelect({
        queryType: cType === "tc_order" ? 1 : undefined,
      }),
    },
    SEARCH_COL_3,
    {
      id: "wmsId",
      label: `${overseaLangObj.rkc_warehouse || "入库仓"}：`,
      ...httpWarehousePublicSelect({
        typeList: "2",
        isHaveComId: 1,
        flagAvailable: "h",
      }),
    },
    // SEARCH_COL_5,
    // SEARCH_COL_6,
    {
      ...SEARCH_COL_7,
      hideList: stateHideList[cType] || [],
    },
    SEARCH_COL_8,
    SEARCH_COL_9,
    SEARCH_COL_10,
  ];
  if (cType === "tc_warehouse") {
    if (tName === "1") {
      SEARCH_COLS_1 = [
        SEARCH_COL_1,
        {
          id: "customerId",
          label: `${overseaLangObj.wtr_customer || "委托人"}：`,
          ...httpCustomerSelect(),
        },
        SEARCH_COL_3,
        {
          ...SEARCH_COL_7,
          hideList: stateHideList[cType] || [],
        },
      ];
    }
    if (tName === "2") {
      SEARCH_COLS_1 = [
        SEARCH_COL_1,
        SEARCH_COL_202,
        SEARCH_COL_204,
        SEARCH_COL_8,
        SEARCH_COL_205,
      ];
    }
  }
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_COLS_1,
            },
          ],
        },
      ],
    },
  ];
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
  prop: "orderSn",
  label: overseaLangObj.gz_dh || "工作单号",
  showOverflowTooltip: true,
  minWidth: 139,
  columnLink: true,
  columnCopyTxt: true,
  // sortable: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "customerShortName",
  label: overseaLangObj.wtr_customer || "委托人",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COL_3 = {
  prop: "wmsCodeName",
  label: overseaLangObj.rkc_warehouse || "入库仓",
  showOverflowTooltip: true,
  minWidth: 120,
  render: (r) => `${r.wmsCode || "--"}[${r.wmsName || "--"}]`,
};
const TABLE_COL_4 = {
  prop: "referenceNo",
  label: overseaLangObj.ck_bm || "参考编号",
  showOverflowTooltip: true,
  minWidth: 130,
};
const TABLE_COL_5 = {
  prop: "returnType",
  label: overseaLangObj.yy_reason("退仓原因"),
  showOverflowTooltip: true,
  width: 82,
  basicType: "returnType",
};
const TABLE_COL_6 = {
  prop: "forecastCount",
  label: overseaLangObj.yb_sl || "预报数量",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: overseaLangObj.bg_num || "包裹数",
      prop: "forecastPackageNum",
      width: 86,
    },
    {
      label: overseaLangObj.sku_num() || "SKU数",
      prop: "forecastSkuNum",
      width: 86,
      className: "border-right",
    },
  ],
};
const TABLE_COL_7 = {
  prop: "arrivalCount",
  label: overseaLangObj.dh_num || "到货数量",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: overseaLangObj.bg_num || "包裹数",
      prop: "takePackageNum",
      width: 86,
    },
    {
      label: overseaLangObj.sku_num() || "SKU数",
      prop: "takeSkuNum",
      width: 86,
      className: "border-right",
    },
  ],
};
const TABLE_COL_8 = {
  prop: "balanceCount",
  label: overseaLangObj.ce_num || "差额数量",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: overseaLangObj.bg_num || "包裹数",
      prop: "differPackageNum",
      width: 86,
    },
    {
      label: overseaLangObj.sku_num() || "SKU数",
      prop: "differSkuNum",
      width: 86,
      className: "border-right",
    },
  ],
};
const TABLE_COL_9 = {
  // prop: "xx_t_9",
  // label: overseaLangObj.yj_rc_sj || "预计入仓时间",
  // showOverflowTooltip: true,
  // width: 136,
};
const TABLE_COL_10 = {
  prop: "firstTakeTime",
  label: overseaLangObj.sc_sh_time || "首次收货时间",
  showOverflowTooltip: true,
  width: 136,
};
const TABLE_COL_11 = {
  prop: "remark",
  label: overseaLangObj.bz_remark() || "备注",
  showOverflowTooltip: true,
  minWidth: 180,
};
const TABLE_COL_12 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  showOverflowTooltip: true,
  width: 136,
};
const TABLE_COL_13 = {
  prop: "salesmanName",
  label: "业务员",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_14 = {
  prop: "customerBelongShortName",
  label: "所属公司",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_15 = {
  prop: "state",
  label: overseaLangObj.zt_status || "状态",
  width: 86,
  dotColor: true,
  basicType: "returnWmsOrderState",
  fixed: "right",
};
const TABLE_COL_16 = {
  prop: "forecastTime",
  label: overseaLangObj.yb_time || "预报时间",
  showOverflowTooltip: true,
  width: 136,
};
const TABLE_COL_17 = {
  prop: "operatorName",
  label: "操作员",
  showOverflowTooltip: true,
  className: "border-right",
  minWidth: 120,
};
const TABLE_OPERATION = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 110,
  fixed: "right",
  columnOperation: true,
};
export const tableColumns = (vType) => {
  if (vType === "tc_warehouse") {
    return [
      TABLE_COL_0,
      TABLE_COL_1,
      {
        ...TABLE_COL_2,
        render: (r) =>
          r.customerBelongId !== r.wmsBelongId
            ? r.customerBelongShortName
            : r.customerShortName,
      },
      {
        ...TABLE_COL_4,
        // className: "border-right",
      },
      TABLE_COL_17,
      TABLE_COL_6,
      TABLE_COL_7,
      TABLE_COL_8,
      TABLE_COL_16,
      TABLE_COL_10,
      {
        ...TABLE_COL_11,
        minWidth: 136,
      },
      TABLE_COL_12,
      TABLE_COL_15,
    ];
  }
  return [
    TABLE_COL_0,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_17,
    TABLE_COL_6,
    TABLE_COL_7,
    TABLE_COL_8,
    // TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    ...(["tc_order"].includes(vType) ? [TABLE_OPERATION] : []),
  ];
};

const TABLE_COL_201 = {
  prop: "trackSn",
  label: overseaLangObj.tracking_no_fn("包裹跟踪号"),
  showOverflowTooltip: true,
  minWidth: 150,
  columnLink: true,
  // noTxtLink: true,
  // columnCopyTxt: true,
  // sortable: "custom",
  fixed: "left",
};
const TABLE_COL_205 = {
  prop: "sku",
  label: overseaLangObj.cp_sku || "产品SKU",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COL_206 = {
  prop: "forecastSkuNum",
  label: overseaLangObj.yb_sku_num || "预报SKU数",
  showOverflowTooltip: true,
  minWidth: 92,
  align: "right",
  decimal: 0,
};
const TABLE_COL_207 = {
  prop: "takeSkuNum",
  label: overseaLangObj.sku_num("到货SKU数"),
  showOverflowTooltip: true,
  minWidth: 92,
  align: "right",
  decimal: 0,
};
const TABLE_COL_208 = {
  prop: "forecastTotalWeight",
  label: overseaLangObj.zl_weight || "重量(KG)",
  showOverflowTooltip: true,
  minWidth: 106,
  align: "right",
  decimal: 2,
};
const TABLE_COL_209 = {
  prop: "forecastTotalVolume",
  label: overseaLangObj.tj_m_volume || "体积(m³)",
  showOverflowTooltip: true,
  minWidth: 106,
  align: "right",
  decimal: 2,
};
export const packageTableColumns = () => [
  TABLE_COL_0,
  TABLE_COL_201,
  {
    ...TABLE_COL_1,
    columnCopyTxt: false,
  },
  TABLE_COL_5,
  TABLE_COL_4,
  TABLE_COL_205,
  TABLE_COL_206,
  TABLE_COL_207,
  TABLE_COL_208,
  TABLE_COL_209,
  TABLE_COL_11,
  TABLE_COL_12,
  {
    ...TABLE_COL_15,
    basicType: "returnWmsOrderPackageState",
  },
  {
    ...TABLE_OPERATION,
    width: 60,
  },
];




export const wmsCustomDialogCols = () => {
  return {
    title: "接单",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        span: 24,
        id: "operator",
        label: "操作员：",
        placeholder: "请选择操作员",
        ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
      }
    ],
    formRules: {
      operator: [
        { required: true, message: "请选择操作员", trigger: "change" },
      ],
    },
  };
};
