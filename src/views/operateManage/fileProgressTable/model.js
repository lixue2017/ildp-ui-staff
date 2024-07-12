import {
  httpCustomerSelect,
  httpRoleDeptUserSelect,
  httpRouteGroup,
} from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "registerNo",
  label: "国内登记号：",
  placeholder: "国内登记号",
  type: "text",
};
const SEARCH_COLS_2 = {
  id: "orderNum",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "fileMemberId",
  label: "文件员：",
  placeholder: "文件员",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const SEARCH_COLS_4 = {
  id: "operatorId",
  label: "操作员：",
  placeholder: "操作员",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const SEARCH_COLS_5 = {
  id: "customerId",
  label: "委托人：",
  placeholder: "委托人",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_6 = {
  id: "operationOrderType",
  label: "业务类型：",
  placeholder: "业务类型",
  type: "select",
  options: [
    {
      value: 2,
      label: "电商订单",
    },
    {
      value: 3,
      label: "传统订单",
    },
  ],
};
const SEARCH_COLS_7 = {
  id: "bookingQueryStatus",
  label: "订舱状态：",
  placeholder: "订舱状态",
  type: "select",
  basicType: "bookingQueryStatus",
};
const SEARCH_COLS_8 = (options) => ({
  id: "routeManageId",
  label: "航线：",
  placeholder: "航线",
  type: "select",
  options,
});
const SEARCH_COLS_9 = {
  id: "operationOrderStatus",
  label: "操作状态：",
  placeholder: "操作状态",
  type: "select",
  basicType: "operationQueryNodeStatus",
};
const searchColumns = (countType, options) => [
  SEARCH_COLS_1,
  { ...SEARCH_COLS_2, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  // SEARCH_COLS_6,
  ...(countType == 380
    ? [SEARCH_COLS_7, SEARCH_COLS_8(options)]
    : [SEARCH_COLS_9]),
];

const searchConfig = (countType, options) => ({
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns(countType, options),
            },
          ],
        },
      ],
    },
  ],
});

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "国内登记号",
  prop: "registerNo",
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_2 = {
  label: "文件备注",
  labelTop: "文件备注",
  labelBottom: "(双击可编辑)",
  headerTopBottom: true,
  prop: "fileRemark",
  className: "padding_0",
  classNameBottom: "header_bottom_no_weight header_bottom_blue",
  minWidth: 120,
  fixed: "left",
  customRow: true,
  fieldItem: {
    placeholder: "文件备注",
    type: "text",
    maxlength: 250,
  },
};
const TABLE_COLS_3 = (options) => ({
  label: "航线",
  labelTop: "航线",
  labelBottom: "(双击可编辑)",
  headerTopBottom: true,
  prop: "routeManageName",
  minWidth: 120,
  fixed: "left",
  customRow: true,
  className: "padding_0",
  classNameBottom: "header_bottom_no_weight header_bottom_blue",
  fieldItem: {
    id: "routeManageId",
    placeholder: "航线",
    type: "select",
    options,
  },
});
const TABLE_COLS_4 = {
  label: "业务员",
  prop: "salesmanName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  label: "客户名称",
  prop: "customerName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  label: "工作单号",
  prop: "orderNum",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_6_1 = {
  label: "主单号",
  prop: "masterNumber",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  label: "起运港",
  prop: "startPortName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  label: "目的港",
  prop: "endPortName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  label: "目的国",
  prop: "countryName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  label: "柜型柜量",
  prop: "cabinetInfo",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  label: "保险",
  prop: "insured",
  minWidth: 120,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_12 = {
  label: "报关",
  prop: "reportCustomsWayName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  label: "头程运输",
  prop: "headTransportMode",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "headTransportMode",
};
const TABLE_COLS_14 = {
  label: "头程代理",
  prop: "bookingSpaceProxyName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  label: "尾程运输",
  prop: "outWarehouseWay",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "outWarehouseWay",
};
const TABLE_COLS_16 = {
  label: "尾程代理",
  prop: "overseasAgencyName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  label: "操作员",
  prop: "operatorName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  label: "文件员",
  prop: "fileMemberName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  label: "操作接单时间",
  prop: "operateTime",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  label: "SO",
  prop: "soNo",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_21 = {
  label: "柜号",
  prop: "containerSno",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  label: "同行/船司",
  prop: "shipCompanyName",
  className: "border-right-td",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  label: "船名/航次",
  prop: "flightName",
  className: "border-right-td",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_24 = {
  label: "ATD",
  prop: "atdTime",
  className: "border-right-td",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_25 = {
  label: "ETA",
  prop: "etaTime",
  className: "border-right-td",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_26 = {
  label: "保险",
  labelTop: "保险",
  labelBottom: "(开船前完成)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "insureNo",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_27 = {
  label: "保险金额",
  prop: "insuredAmount",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_28 = {
  label: "退税提单",
  labelTop: "退税提单",
  labelBottom: "(开船后1天内Rachel)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "taxRebateTimeRemark",
  bottomProp: "taxRebateTime",
  columnTopBottom: true,
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_29 = {
  label: "预报邮件",
  labelTop: "预报邮件",
  labelBottom: "(船开5个工作日Rachel)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "forecastMailTimeRemark",
  bottomProp: "forecastMailTime",
  columnTopBottom: true,
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_30 = {
  // 这期先不做空着
  labelTop: "HBL",
  labelBottom: "(到港两周前Rachel)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "table_xx_30",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_31 = {
  label: "清关审核发出",
  labelTop: "清关审核发出",
  labelBottom: "(到港2周前YUKIl)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "clearanceAuditTimeRemark",
  bottomProp: "clearanceAuditTime",
  columnTopBottom: true,
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_32 = {
  // 这期先不做空着
  labelTop: "派送表",
  labelBottom: "(到港10天前Sindy)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "table_xx_32",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_33 = {
  // 这期先不做空着
  labelTop: "MONDAY",
  labelBottom: "(到港10天前Sindy)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "table_xx_33",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_34 = {
  // 这期先不做空着
  labelTop: "头程对冲ZJB",
  labelBottom: "(船开3周内Sindy)",
  headerTopBottom: true,
  classNameBottom: "header_bottom_no_weight",
  prop: "table_xx_34",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_35 = {
  label: "实际到港",
  prop: "fullReachTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_36 = {
  label: "清关放行",
  prop: "clearanceReleaseTime",
  minWidth: 120,
  showOverflowTooltip: true,
};

const tableColumns = (options = []) => [
  TABLE_COLS_INDEX,
  {
    ...TABLE_COLS_1,
    labelTop: "国内登记号",
    labelBottom: "(双击可编辑)",
    headerTopBottom: true,
    customRow: true,
    className: "padding_0",
    classNameBottom: "header_bottom_no_weight header_bottom_blue",
    fieldItem: {
      placeholder: "国内登记号",
      type: "text",
      maxlength: 250,
    },
  },
  TABLE_COLS_2,
  TABLE_COLS_3(options),
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_13,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
];

const tableColumnsOther = [
  TABLE_COLS_INDEX,
  { ...TABLE_COLS_1, showOverflowTooltip: true },
  TABLE_COLS_20,
  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_23,
  TABLE_COLS_24,
  TABLE_COLS_25,
  TABLE_COLS_6,
  TABLE_COLS_6_1,
  TABLE_COLS_5,
  TABLE_COLS_4,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_26,
  TABLE_COLS_27,
  TABLE_COLS_28,
  TABLE_COLS_29,
  TABLE_COLS_31,
  TABLE_COLS_35,
  TABLE_COLS_36,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
];

export { searchConfig, tableColumns, tableColumnsOther };
