import {
  httpCountryListSelect,
  shipCompanyList,
  httpCustomerSelect,
  httpRoleDeptUserSelect,
  httpEnterprisetSelect,
  httpPortPublicSelect,
} from "@/comModel/httpSelect";
import {
  httpWarehousePublicSelect,
  httpDeliveryChannelSelect,
} from "@/comModel/warehouse";

const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "jobNo",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
  residueCol: 2,
};
const SEARCH_COLS_3 = {
  id: "countryId",
  label: "目的国：",
  ...httpCountryListSelect(),
};
const SEARCH_COLS_4 = {
  id: "overallStatusIn",
  label: "状态：",
  type: "select", // 选择框
  multiple: true,
  placeholder: "状态",
  basicType: "nlOverAllStatus",
};
const SEARCH_COLS_5 = {
  id: "logisticsChannelId",
  label: "派送渠道：",
  ...httpDeliveryChannelSelect(),
};
const SEARCH_COLS_6 = {
  id: "warehouseId",
  label: "目的仓：",
  ...httpWarehousePublicSelect({ typeList: "2", isHaveComId: 1 }),
};
const SEARCH_COLS_7 = {
  id: "airlineName",
  label: "航空/船公司：",
  ...shipCompanyList(),
};
const SEARCH_COLS_8 = {
  id: "freightType",
  label: "装箱方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "freightType",
};
const SEARCH_COLS_9 = {
  id: "flightName",
  label: "船名/航名：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_10 = {
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_11 = {
  id: "registerNo",
  label: "箱号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_12 = {
  id: "mblNum",
  label: "MBL：",
  placeholder: "MBL",
  type: "text",
};
const SEARCH_COLS_19 = {
  id: "bailorPeopleId",
  label: "委托人：",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_20 = {
  id: "salesman",
  label: "业务员：",
  ...httpRoleDeptUserSelect(),
};
const SEARCH_COLS_21 = {
  id: "overseaBusinessTypes",
  label: "业务类型：",
  placeholder: "请选择",
  type: "select", // 选择框
  basicType: "overseaBusinessTypes",
};
const SEARCH_COLS_24 = {
  id: "transportMode",
  label: "运输方式：",
  basicType: "headTransportMode",
  type: "select", // 选择框
};
const SEARCH_COLS_25 = {
  id: "expectWarehouseType",
  label: "预报入库仓：",
  basicType: "clearanceReservationWarehouse",
  type: "select",
};
const SEARCH_COLS_26 = {
  id: "ontainerSno",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_27 = {
  id: "overseasOperator",
  label: "海外操作员：",
  ...httpRoleDeptUserSelect(),
};
const SEARCH_COLS_28 = {
  id: "xx_s_28",
  label: "贸易条款：",
  placeholder: "请选择",
  type: "select",
  basicType: "tradeClause",
};
const SEARCH_COLS_29 = {
  id: "agent",
  label: "海外代理：",
  ...httpEnterprisetSelect({ typeList: "0,1,2,3" }),
};
const SEARCH_COLS_30 = {
  id: "startPortId",
  label: "起运港：",
  ...httpPortPublicSelect(),
};
const SEARCH_COLS_31 = {
  id: "endPortId",
  label: "目的港：",
  ...httpPortPublicSelect(),
};

export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COLS_1, // 创建时间
              SEARCH_COLS_19, // 委托人
              SEARCH_COLS_2, // 工作单号
              SEARCH_COLS_26, // 国内登记号
              SEARCH_COLS_27, // 操作员
              SEARCH_COLS_3, // 目的国
              SEARCH_COLS_21, // 业务类型
              SEARCH_COLS_11, // 箱号
              // SEARCH_COLS_28, // 贸易条款
              SEARCH_COLS_29, // 海外代理
              // SEARCH_COLS_4, // 清关状态
              // SEARCH_COLS_5, // 派送渠道
              // SEARCH_COLS_6, // 目的仓
              SEARCH_COLS_7, // 船司/航司
              // SEARCH_COLS_8, // 装箱方式
              SEARCH_COLS_9, // 船名/航名
              SEARCH_COLS_10, // 船次/航次
              SEARCH_COLS_30,
              SEARCH_COLS_31,
              // SEARCH_COLS_12, // MBL
              SEARCH_COLS_20, // 业务员
              // SEARCH_COLS_24, //运输方式
              SEARCH_COLS_25, // 预报入库仓
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "jobNo",
  label: "工作单号",
  showOverflowTooltip: true,
  columnLink: true,
  fixed: "left",
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_2 = {
  prop: "ontainerSno",
  label: "国内登记号",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
  sortable: true,
};
const TABLE_COL_3 = {
  prop: "bailorPeopleName",
  label: "委托人",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
  sortable: true,
};
const TABLE_COL_4 = {
  prop: "overseaBusinessTypes",
  label: "业务类型",
  minWidth: 96,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => {
    const [type1, type2] = row.overseaBusinessTypes || [1];
    const obj = {
      1: "仅清关",
      2: "清关+派送",
      3: "清关+入仓",
    };
    return obj[type2 || type1];
  },
};
const TABLE_COL_5 = {
  prop: "contryName",
  label: "目的国",
  showOverflowTooltip: true,
  minWidth: 82,
  sortable: true,
};
const TABLE_COL_6 = {
  prop: "registerNo",
  label: "箱号",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
};
const TABLE_COL_7 = {
  prop: "mblNum",
  label: "MBL",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
};
const TABLE_COL_8 = {
  prop: "nlCode",
  label: "海外清关单号",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_9 = {
  prop: "startPortName",
  label: "起运港",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_10 = {
  prop: "endPortName",
  label: "目的港",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_11 = {
  prop: "expectWarehouseType",
  label: "预报入库仓",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "clearanceReservationWarehouse",
  sortable: true,
};
const TABLE_COL_12 = {
  prop: "gxgl",
  label: "柜型柜量",
  showOverflowTooltip: true,
  minWidth: 100,
  sortable: true,
};
const TABLE_COL_13 = {
  prop: "airlineName",
  label: "航空/船公司",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_14 = {
  prop: "flightName",
  label: "船名/航名",
  showOverflowTooltip: true,
  minWidth: 110,
  sortable: true,
};
const TABLE_COL_15 = {
  prop: "voyageNumber",
  label: "船次/航次",
  showOverflowTooltip: true,
  minWidth: 110,
  sortable: true,
};
const TABLE_COL_16 = {
  prop: "departureTime",
  label: "ETD",
  showOverflowTooltip: true,
  minWidth: 92,
  sortable: true,
};
const TABLE_COL_17 = {
  prop: "reachTime",
  label: "ETA",
  showOverflowTooltip: true,
  minWidth: 92,
  sortable: true,
};
const TABLE_COL_18 = {
  prop: "registerNo",
  label: "CNTR No.",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_20 = {
  prop: "overseasOperatorName",
  label: "操作员",
  showOverflowTooltip: true,
};
const TABLE_COL_21 = {
  prop: "createTime",
  label: "创建时间",
  showOverflowTooltip: true,
  minWidth: 120,
  sortable: true,
};
const TABLE_COL_22 = {
  prop: "updateTime",
  label: "最后修改时间",
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COL_23 = {
  prop: "overseasOperatorName",
  label: "海外操作",
  showOverflowTooltip: true,
  minWidth: 96,
  sortable: true,
};
const TABLE_COL_24 = {
  prop: "overallStatus",
  label: "状态",
  minWidth: 100,
  sortable: true,
  fixed: "right",
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "nlOverAllStatus",
};
const TABLE_COL_25 = {
  prop: "remarkCount",
  label: "审核/备注",
  showOverflowTooltip: true,
  customRow: true,
  fixed: "right",
  sortable: true,
  minWidth: 102,
};
const TABLE_COL_26 = {
  prop: "agentName",
  label: "海外代理",
  showOverflowTooltip: true,
  minWidth: 110,
  sortable: true,
  fixed: "right",
};
const TABLE_COL_27 = {
  prop: "registerStatus",
  label: "清关登记状态",
  minWidth: 120,
  sortable: true,
  dotColor: true,
  showOverflowTooltip: true,
  fixed: "right",
  basicType: "registerStatusLists",
};
const TABLE_COL_28 = {
  prop: "qgStatus",
  label: "清关状态",
  // fixed: "right",
  minWidth: 98,
  sortable: true,
  dotColor: true,
  basicType: "clearanceStatus",
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  columnMoreOperation: true,
  moreBtnLen: 2,
  fixed: "right",
};
export const tableColumns = (vPage) => {
  return [
    TABLE_COL_INDEX,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_7,
    ...(["one_1"].includes(vPage) ? [] : [TABLE_COL_8]), // 清关单号
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
    TABLE_COL_18,
    // TABLE_COL_20,
    TABLE_COL_21,
    TABLE_COL_22,
    TABLE_COL_23,
    ...(["one_1"].includes(vPage) ? [] : [TABLE_COL_28]),
    ...(["one_2", "two_2"].includes(vPage) ? [TABLE_COL_26] : []),
    TABLE_COL_24, // 状态
    ...(["one_1"].includes(vPage) ? [] : [TABLE_COL_25]),
    TABLE_COL_27,
    {
      ...TABLE_COL_OPERATION,
      minWidth: ["two_1"].includes(vPage) ? 196 : 132,
    },
  ];
};
