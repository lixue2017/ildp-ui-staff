import {
  httpCustomerSelect,
  httpPortPublicSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";
import * as recordModel from "../components/recordModel";
const SELECT_OPTIONS_1 = [
  {
    label: "集装箱到港",
    value: "0",
  },
  {
    label: "集装箱离港",
    value: "1",
  },
];

const SEARCH_COL_1 = {
  ...recordModel.createTimeCol,
  id: "declareDate",
  label: "要求送达时间：",
};
const SEARCH_COL_2 = {
  id: "code",
  label: "拖车单号：",
  placeholder: "拖车单号",
  type: "text",
};
const SEARCH_COL_3 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "工作单号",
  type: "text",
};
const SEARCH_COL_4 = {
  ...recordModel.statusCol,
  id: "stateList",
  basicType: "trailerStatus",
};
const SEARCH_COL_5 = {
  id: "exportTypeList",
  label: "类型：",
  placeholder: "类型",
  type: "select",
  basicType: "trailerType",
  hideList: [2, 3, 4],
};
const SEARCH_COL_6 = {
  id: "shipCompany",
  label: "船公司：",
  placeholder: "船公司",
  type: "text",
};
const SEARCH_COL_7 = {
  id: "xx_shipCompany",
  label: "船名&船次：",
  placeholder: "船名、船次",
  type: "text",
};
const SEARCH_COL_8 = {
  id: "ontainerSno",
  label: "箱号：",
  placeholder: "箱号",
  type: "text",
};
const SEARCH_COL_9 = {
  id: "sealingStripSno",
  label: "封号：",
  placeholder: "封号",
  type: "text",
};
const SEARCH_COL_10 = {
  id: "sono",
  label: "SO No：",
  placeholder: "SO No",
  type: "text",
};
const SEARCH_COL_11 = {
  id: "pickPort",
  label: "提柜地：",
  placeholder: "提柜地",
  type: "text",
};
const SEARCH_COL_12 = {
  id: "returnPort",
  label: "还柜地：",
  placeholder: "还柜地",
  type: "text",
};
const SEARCH_COL_13 = {
  id: "trailerRowId",
  label: "拖车行：",
  placeholder: "拖车行",
  ...httpCustomerSelect({ clientIdentity: 3 }),
};
const SEARCH_COL_14 = {
  id: "startPort",
  label: "起运港：",
  placeholder: "起运港",
  ...httpPortPublicSelect("0,3"),
};
const SEARCH_COL_15 = {
  id: "endPort",
  label: "目的港：",
  placeholder: "目的港",
  ...httpPortPublicSelect("0,3"),
};
const SEARCH_COL_16 = {
  id: "customerId",
  label: "客户名称：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const SEARCH_COL_17 = {
  id: "businessOwnership",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};

export const searchColumns = (idx) => {
  const SEARCH_TABLE_0 = [
    recordModel.createTimeCol,
    SEARCH_COL_1,
    SEARCH_COL_2,
    SEARCH_COL_3,
    SEARCH_COL_4,
    SEARCH_COL_5,
    SEARCH_COL_6,
    SEARCH_COL_7,
    SEARCH_COL_8,
    SEARCH_COL_9,
    SEARCH_COL_10,
    SEARCH_COL_11,
    SEARCH_COL_12,
    SEARCH_COL_13,
    SEARCH_COL_14,
    SEARCH_COL_15,
    SEARCH_COL_17,
  ];
  const SEARCH_TABLE_1 = [
    recordModel.createTimeCol,
    SEARCH_COL_2,
    SEARCH_COL_3,
    {
      ...SEARCH_COL_13,
      label: "拖车公司：",
      placeholder: "拖车公司",
    },
    SEARCH_COL_16,
    SEARCH_COL_17,
    // SEARCH_COL_14,
    // SEARCH_COL_15
  ];
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_TABLE_0, SEARCH_TABLE_1][idx],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COL_1 = {
  prop: "code",
  label: "拖车单号",
  customRow: true,
  fixed: "left",
  minWidth: 138,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "shortName",
  label: "拖车行",
  fixed: "left",
  minWidth: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "nameEn",
  label: "类型",
  minWidth: 100,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "shipperName",
  label: "起运地",
  minWidth: 160,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "consigneeName",
  label: "目的地",
  minWidth: 160,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "deliveryTime",
  label: "要求送达时间",
  minWidth: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "registerNo",
  label: "整柜参考号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "operationOrderNum",
  label: "关联操作单",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "shipCompany",
  label: "船公司",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "shipName",
  label: "船名",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "shipSecond",
  label: "船次",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "address",
  label: "起运地址详情",
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "addressTwo",
  label: "目的地址详情",
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "remark",
  label: "备注",
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "createTime",
  label: "创建时间",
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "createBy",
  label: "创建人员",
  width: 100,
};
const TABLE_COL_17 = {
  prop: "status",
  label: "状态",
  dotColor: true,
  width: 100,
  fixed: "right",
  basicType: "trailerInfoStatus",
};
const TABLE_COL_18 = {
  label: "操作",
  prop: "operation",
  // customRow: true,
  columnOperation: true,
  fixed: "right",
  width: "200px",
};
const TABLE_COL_19 = {
  prop: "startTime",
  label: "拖车出发时间",
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_20 = {
  prop: "finishTime",
  label: "拖车到达时间",
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_21 = {
  prop: "Uncharted_1",
  label: "拖车反馈时间",
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_22 = {
  prop: "businessOwnershipName",
  label: "所属公司",
  minWidth: 120,
  showOverflowTooltip: true,
};

const TABLE_COL_NEW_1 = {
  prop: "operationOrderNum",
  label: "工作单号",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_2 = {
  prop: "customerShortName",
  label: "客户简称",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_3 = {
  prop: "boxCode",
  label: "柜型",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_4 = {
  prop: "pickPort",
  label: "提柜地点",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_5 = {
  prop: "returnPort",
  label: "还柜地点",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_6 = {
  prop: "startPortName",
  label: "装货港",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_7 = {
  prop: "endPortName",
  label: "目的港",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_8 = {
  prop: "sono",
  label: "SO No.",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_9 = {
  prop: "cabinOpenTime",
  label: "开舱日期",
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_10 = {
  prop: "cutGateTime",
  label: "截关日期",
  width: 136,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_11 = {
  prop: "ontainerSno",
  label: "箱号",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_12 = {
  prop: "sealingStripSno",
  label: "封号",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_12_1 = {
  prop: "containerWeight",
  label: "柜重/KG",
  width: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_13 = {
  prop: "addressNum",
  label: "地址数",
  width: 120,
  showOverflowTooltip: true,
  render: (row) => row.pickAddressNum || row.finalAddressNum || "--",
};
const TABLE_COL_NEW_14 = {
  prop: "pickAddressNum",
  label: "提货地址数",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_NEW_15 = {
  prop: "finalAddressNum",
  label: "目的地址数",
  width: 120,
  showOverflowTooltip: true,
};
const TAB_1_TABLE = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  {
    ...TABLE_COL_3,
    render: (row) => {
      const rowObj =
        SELECT_OPTIONS_1.find((e) => e.value == row.trailerType) || {};
      return rowObj.label || "--";
    },
  },
  TABLE_COL_NEW_1,
  TABLE_COL_NEW_2,
  TABLE_COL_9,
  TABLE_COL_7,
  TABLE_COL_NEW_3,
  TABLE_COL_NEW_4,
  TABLE_COL_NEW_5,
  TABLE_COL_NEW_6,
  TABLE_COL_NEW_7,
  TABLE_COL_NEW_8,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_NEW_9,
  TABLE_COL_NEW_10,
  TABLE_COL_NEW_11,
  TABLE_COL_NEW_12,
  TABLE_COL_NEW_12_1, // 柜重
  TABLE_COL_NEW_13,
  TABLE_COL_14,
  // TABLE_COL_19,
  // TABLE_COL_20,
  TABLE_COL_21,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_22,
  TABLE_COL_17,
  TABLE_COL_18,
];
export const tableColumns = TAB_1_TABLE.map((e) => ({
  ...e,
  sortable: !["operation"].includes(e.prop),
}));

const TAB_2_TABLE = [
  TABLE_COL_0,
  TABLE_COL_1,
  {
    ...TABLE_COL_2,
    label: "拖车公司",
    width: 180,
  },
  TABLE_COL_NEW_1,
  TABLE_COL_NEW_2,
  // TABLE_COL_NEW_6,
  // TABLE_COL_NEW_7,
  TABLE_COL_NEW_14,
  TABLE_COL_NEW_15,
  TABLE_COL_14,
  // TABLE_COL_19,
  // TABLE_COL_20,
  TABLE_COL_21,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_22,
  TABLE_COL_17,
  TABLE_COL_18,
];
export const ordinaryTableCols = TAB_2_TABLE.map((e) => ({
  ...e,
  sortable: !["operation"].includes(e.prop),
}));
