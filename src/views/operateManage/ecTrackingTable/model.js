import {
  httpCustomerSelect,
  httpRoleDeptUserSelect,
  httpListNameEnIsSortBox,
} from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "operator",
  label: "操作员：",
  placeholder: "操作员",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const SEARCH_COLS_4 = {
  id: "fileMember",
  label: "文件员：",
  placeholder: "文件员",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const SEARCH_COLS_5 = {
  id: "customerId",
  label: "委托人：",
  placeholder: "委托人",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_6 = {
  id: "sortBoxStatus",
  label: "排柜状态：",
  placeholder: "排柜状态(多选)",
  type: "select",
  multiple: true,
  basicType: "dsSortBoxStatus",
};
const SEARCH_COLS_7 = (options) => ({
  id: "routeManageName",
  label: "排柜组：",
  placeholder: "排柜组",
  type: "select",
  options,
});
const SEARCH_COLS_8 = {
  id: "wholeCabinetSn",
  label: "国内登记号：",
  placeholder: "国内登记号",
  type: "text",
};
const searchColumns = (countType, routeList) => [
  ...(countType == 440 ? [SEARCH_COLS_1] : [SEARCH_COLS_8]), // 待拼柜countType：440
  ...([500, 510].includes(Number(countType)) ? [SEARCH_COLS_5] : []),
  { ...SEARCH_COLS_2, maxlength: 1000, residueCol: 2 },
  SEARCH_COLS_3,
  ...(![500, 510].includes(Number(countType))
    ? [SEARCH_COLS_4, SEARCH_COLS_5, SEARCH_COLS_6, SEARCH_COLS_7(routeList)]
    : []), // FCL countType：500; LCL countType：510
];
const searchConfig = (countType, routeList) => ({
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns(countType, routeList),
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
  label: "操作备注",
  prop: "operationRemark",
  minWidth: 120,
  fixed: "left",
  labelTop: "操作备注",
  labelBottom: "(双击可编辑)",
  headerTopBottom: true,
  customRow: true,
  className: "padding_0",
  classNameBottom: "header_bottom_no_weight header_bottom_blue",
  fieldItem: {
    placeholder: "操作备注",
    type: "text",
  },
};
const TABLE_COLS_2 = (options) => ({
  label: "排柜组",
  prop: "routeManageName",
  minWidth: 120,
  fixed: "left",
  labelTop: "排柜组",
  labelBottom: "(双击可编辑)",
  headerTopBottom: true,
  customRow: true,
  className: "padding_0",
  classNameBottom: "header_bottom_no_weight header_bottom_blue",
  fieldItem: {
    placeholder: "排柜组",
    id: "routeManageId",
    type: "select",
    options,
  },
});
const TABLE_COLS_3 = {
  label: "业务",
  prop: "salesmanName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  label: "客户名称",
  prop: "customerName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  label: "工作单号",
  prop: "operationOrderNum",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  label: "起运港",
  prop: "startPortName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  label: "目的港",
  prop: "endPortName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  label: "目的国",
  prop: "countryName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  label: "头程运输",
  prop: "headTransportModeName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  label: "头程代理",
  prop: "bookingSpaceProxyName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  label: "尾程运输",
  prop: "outWarehouseWayName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  label: "海外代理",
  prop: "overseasAgencyName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  label: "客户单号",
  prop: "cusOrderNumber",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  label: "拖车",
  prop: "trailerStr",
  className: "header-red",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  label: "预计入仓时间",
  prop: "warehousingTime",
  className: "header-red",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  label: "实际入仓时间",
  prop: "realWarehousingTime",
  className: "header-red",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  label: "件数",
  prop: "warehouseNumber",
  className: "header-red",
  minWidth: 100,
  align: "center",
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  label: "毛重",
  prop: "warehouseWeight",
  className: "header-red",
  minWidth: 100,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  label: "体积",
  prop: "warehouseVolume",
  className: "header-red",
  minWidth: 100,
  align: "right",
  decimal: 3,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  label: "仓库代码",
  prop: "transactionWarehouseName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_21 = {
  label: "FBA ID",
  prop: "fbaId",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  label: "保险",
  prop: "insured",
  minWidth: 120,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_23 = {
  label: "报关",
  prop: "reportCustomsWayName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_24 = {
  label: "操作员",
  prop: "operatorName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_25 = {
  label: "文件员",
  prop: "fileMemberName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_26 = {
  label: "操作接单时间",
  prop: "operateTime",
  minWidth: 160,
  showOverflowTooltip: true,
};
// 拼柜订单
const TABLE_COLS_27 = {
  label: "编号/做柜时间",
  labelTop: "编号/做柜时间",
  labelBottom: "起运港/目的港",
  headerTopBottom: true,
  prop: "table_xx_27",
  className: "border-left-td border-right-td",
  minWidth: 180,
  customRow: true,
};
const TABLE_COLS_28 = {
  label: "SO",
  labelTop: "SO",
  labelBottom: "柜号/封条",
  headerTopBottom: true,
  prop: "table_xx_28",
  className: "border-right-td",
  minWidth: 180,
  customRow: true,
};
const TABLE_COLS_29 = {
  label: "报关行/船司/船名航次",
  prop: "table_xx_29",
  className: "border-right-td",
  minWidth: 200,
  customRow: true,
};
const TABLE_COLS_30 = {
  label: "ETD",
  prop: "etdTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_31 = {
  label: "实际到港",
  prop: "ataTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_32 = {
  label: "ETA",
  prop: "etaTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_33 = {
  label: "实际离港",
  prop: "atdTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_34 = {
  label: "港前备注",
  prop: "operationRemark",
  minWidth: 180,
  showOverflowTooltip: true,
};
const TABLE_COLS_35 = {
  label: "报关方式",
  prop: "clearanceProfileStatus",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_36 = {
  label: "箱单",
  prop: "cusProfileStatus",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_37 = {
  label: "发客户账单",
  prop: "sendBillTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_38 = {
  label: "保险（到仓万分之2、上架千分之1.6）",
  prop: "insureMessage",
  minWidth: 250,
  showOverflowTooltip: true,
};
const TABLE_COLS_39 = {
  label: "理论应付拼柜主体费用(RMB)",
  prop: "payZjbMoney",
  minWidth: 200,
  showOverflowTooltip: true,
};
const TABLE_COLS_40 = {
  label: "系统收付",
  prop: "payAndAwayStr",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_41 = {
  label: "收费项目",
  prop: "table_xx_41",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_42 = {
  label: "清关完成时间",
  prop: "clearanceOverTime",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_43 = {
  label: "清关备注",
  prop: "clearanceRemark",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_44 = {
  label: "递延回执",
  prop: "table_xx_44",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_45 = {
  label: "拆柜",
  prop: "devannTime",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_46 = {
  label: "清关到拆柜时效",
  prop: "clearanceAndDevannAgeing",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_47 = {
  label: "派送时间",
  prop: "dispatchTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_48 = {
  label: "POD",
  prop: "podTime",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_49 = {
  label: "POD回传时效(天)",
  prop: "podAgeing",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_50 = {
  label: "港后备注",
  prop: "table_xx_50",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_51 = {
  label: "从拆柜到派送时效/天",
  prop: "devannAndDispatchAgeing",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_52 = {
  label: "从开船到派送时效/天",
  prop: "sailAgeing",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_53 = {
  label: "库存",
  prop: "table_xx_53",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_54 = {
  label: "后段费用(应付)",
  prop: "table_xx_54",
  minWidth: 140,
  showOverflowTooltip: true,
};
// FCL
const TABLE_COLS_55 = {
  label: "做柜时间",
  prop: "presentTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_56 = {
  label: "柜子编号",
  prop: "ontainerSno",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_57 = {
  label: "分单号",
  prop: "table_xx_57",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_58 = {
  ...TABLE_COLS_6,
  label: "装运港",
};
const TABLE_COLS_59 = {
  label: "截补料",
  prop: "table_xx_59",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_60 = {
  label: "SO",
  prop: "soNo",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_61 = {
  label: "船司/同行",
  prop: "shipCustomerName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_62 = {
  label: "柜号",
  prop: "wholeCabinetSn",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_63 = {
  label: "柜号柜型",
  prop: "boxSizeAndNumber",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_64 = {
  label: "船名航次",
  prop: "shipName",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) =>
    row.shipName || row.shipNumber
      ? `${row.shipName || "--"}/${row.shipNumber || "--"}`
      : "--",
};
const TABLE_COLS_65 = {
  label: "发送账单",
  prop: "sendBillTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_66 = {
  label: "清关&退税提单制作",
  prop: "table_xx_66",
  minWidth: 135,
  showOverflowTooltip: true,
};
const TABLE_COLS_67 = {
  label: "港前备注佰信备注",
  prop: "table_xx_67",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COLS_68 = {
  label: "派送表上传时间一件代发的入库单号要放在主标题monday",
  prop: "table_xx_68",
  minWidth: 200,
  showOverflowTooltip: true,
};
const TABLE_COLS_69 = {
  label: "发票提供时间",
  prop: "clearanceHandoverTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_70 = {
  label: "品名",
  prop: "productNames",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_71 = {
  label: "MBL已发",
  prop: "mblTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_72 = {
  label: "清关份数",
  prop: "table_xx_72",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_73 = {
  label: "清关预报",
  prop: "clearancePredictionTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_74 = {
  label: "二审问题",
  prop: "secondCheckProblem",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_75 = {
  label: "清关交接",
  prop: "clearanceHandoverTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_76 = {
  label: "查验",
  prop: "clearanceCheckTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_77 = {
  label: "查验费",
  prop: "table_xx_77",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_78 = {
  label: "拿到税单",
  prop: "table_xx_78",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_79 = {
  label: "税金发出",
  prop: "sjSendBillTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_80 = {
  label: "税金请款",
  prop: "table_xx_80",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_81 = {
  label: "派送账单",
  prop: "psSendBillTime",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_82 = {
  label: "业务员",
  prop: "salesmanName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_83 = {
  label: "业务助理",
  prop: "kaNames",
  minWidth: 120,
  showOverflowTooltip: true,
};

const tableColumns_DPG = (routeList = []) => [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2(routeList),
  TABLE_COLS_3,
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
  TABLE_COLS_20,
  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_23,
  TABLE_COLS_24,
  TABLE_COLS_25,
  TABLE_COLS_82,
  TABLE_COLS_83,
  TABLE_COLS_26,
];
const tableColumns_PG = [
  TABLE_COLS_INDEX,
  TABLE_COLS_27,
  TABLE_COLS_28,
  TABLE_COLS_29,
  TABLE_COLS_30,
  TABLE_COLS_31,
  TABLE_COLS_32,
  TABLE_COLS_33,
  TABLE_COLS_3,
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
  TABLE_COLS_20,
  TABLE_COLS_21,
  TABLE_COLS_34,
  TABLE_COLS_35,
  TABLE_COLS_36,
  TABLE_COLS_37,
  TABLE_COLS_38,
  TABLE_COLS_39,
  TABLE_COLS_40,
  TABLE_COLS_41,
  TABLE_COLS_42,
  TABLE_COLS_43,
  TABLE_COLS_44,
  TABLE_COLS_45,
  TABLE_COLS_46,
  TABLE_COLS_47,
  TABLE_COLS_48,
  TABLE_COLS_49,
  TABLE_COLS_50,
  TABLE_COLS_51,
  TABLE_COLS_52,
  TABLE_COLS_53,
  TABLE_COLS_54,
  TABLE_COLS_24,
  TABLE_COLS_25,
  TABLE_COLS_82,
  TABLE_COLS_83,
  TABLE_COLS_26,
];
const tableColumns_FCL = [
  TABLE_COLS_INDEX,
  {
    ...TABLE_COLS_1,
    label: "备注",
  },
  {
    ...TABLE_COLS_26,
    label: "接单时间",
  },
  TABLE_COLS_55,
  TABLE_COLS_56,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_57,
  TABLE_COLS_58,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_13,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_30,
  TABLE_COLS_31,
  TABLE_COLS_32,
  TABLE_COLS_33,
  TABLE_COLS_59,
  TABLE_COLS_60,
  TABLE_COLS_61,
  TABLE_COLS_62,
  TABLE_COLS_63,
  TABLE_COLS_64,
  TABLE_COLS_22,
  TABLE_COLS_35,
  TABLE_COLS_36,
  TABLE_COLS_65,
  TABLE_COLS_66,
  TABLE_COLS_67,
  TABLE_COLS_68,
  TABLE_COLS_69,
  TABLE_COLS_70,
  TABLE_COLS_71,
  TABLE_COLS_72,
  TABLE_COLS_73,
  TABLE_COLS_74,
  TABLE_COLS_75,
  TABLE_COLS_76,
  TABLE_COLS_77,
  TABLE_COLS_78,
  TABLE_COLS_79,
  TABLE_COLS_80,
  TABLE_COLS_45,
  TABLE_COLS_46,
  { ...TABLE_COLS_47, label: "派送" },
  TABLE_COLS_51,
  TABLE_COLS_48,
  TABLE_COLS_49,
  TABLE_COLS_81,
  TABLE_COLS_52,
  TABLE_COLS_53,
  TABLE_COLS_24,
  TABLE_COLS_25,
  TABLE_COLS_82,
  TABLE_COLS_83,
  TABLE_COLS_26,
];

export { searchConfig, tableColumns_DPG, tableColumns_PG, tableColumns_FCL };
