import {
  httpCountrySelect,
  httpCustomerSelect,
  httpEnterprisetSelect,
  httpUserSelect,
  httpRoleDeptUserSelect,
  httpHaveAirFlightSelect,
} from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";

const SEARCH_COL_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "nlCode",
  label: "NL编号：",
  placeholder: "NL编号",
  type: "text",
};

const SEARCH_COL_3 = {
  id: "wholeCabinetSn",
  label: "国内登记号：",
  placeholder: "国内登记号",
  type: "text",
};

const SEARCH_COL_4 = {
  id: "orderNumber",
  label: "工作单号：",
  placeholder: "工作单号/子单号",
  type: "text",
};

const SEARCH_COL_5 = {
  id: "reachTime",
  label: "到港时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COL_6 = {
  id: "countryId",
  label: `目的国：`,
  ...httpCountrySelect,
};

const SEARCH_COL_7 = {
  id: "businessType",
  label: `业务类型：`,
  placeholder: "请选择",
  type: "select",
  basicType: "overseaBusinessTypes",
};

const SEARCH_COL_9 = {
  id: "status",
  label: "清关状态：",
  type: "select", // 选择框
  // multiple: true,
  placeholder: "请选择",
  basicType: "clearanceStatus",
};

const SEARCH_COL_10 = {
  id: "bailorPeopleId",
  label: `委托人：`,
  ...httpCustomerSelect(),
};

const SEARCH_COL_11 = {
  id: "customsBroker",
  label: "清关行：",
  placeholder: "清关行(多选)",
  multiple: true,
  ...httpEnterprisetSelect({ typeList: "3" }),
};

const SEARCH_COL_12 = {
  id: "pdo",
  label: "DO：",
  placeholder: "DO",
  type: "select",
  basicType: "do",
};

const SEARCH_COL_13 = {
  id: "pod",
  label: "POD：",
  placeholder: "POD",
  type: "select",
  basicType: "pod",
};
const SEARCH_COL_14 = {
  id: "mblNum",
  label: "MBL：",
  placeholder: "MBL",
  type: "text",
};
const SEARCH_COL_15 = {
  id: "ontainerSno",
  label: "箱号：",
  placeholder: "箱号",
  type: "text",
};
const SEARCH_COL_16 = {
  id: "warehouseId",
  label: "目的仓：",
  ...httpWarehousePublicSelect({
    typeList: "2",
    isHaveComId: 1,
    flagAvailable: "h",
  }),
};

const SEARCH_COL_17 = {
  id: "warehouseStatus",
  label: "入仓状态：",
  type: "select", // 选择框
  // multiple: true,
  placeholder: "状态",
  basicType: "inWarehouseStatus",
};

const SEARCH_COL_18 = {
  id: "agent",
  label: "海外代理：",
  ...httpEnterprisetSelect({ isQueryFirstDept: 1 }),
};

const SEARCH_COL_19 = {
  id: "salesman",
  label: `业务员：`,
  ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
};
const SEARCH_COL_20 = {
  id: "customerId",
  label: `客户信息：`,
  ...httpCustomerSelect(),
};

const SEARCH_COL_21 = {
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "头程运输方式",
  type: "select",
  basicType: "headTransportMode",
};
const SEARCH_COL_22 = {
  id: "registerStatus",
  label: "清关登记状态：",
  placeholder: "清关登记状态",
  type: "select",
  basicType: "registerStatusLists",
};
const SEARCH_COL_23 = {
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_24 = {
  id: "expectWarehouseType",
  label: "预报入库仓：",
  basicType: "clearanceReservationWarehouse",
  multiple: true,
  type: "select",
};
const SEARCH_COL_25 = {
  id: "splitBoxTime",
  label: "拆柜预约时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_26 = {
  id: "flightName",
  label: "船名：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_27 = {
  id: "voyageNumber",
  label: "航次：",
  placeholder: "请输入",
  type: "text",
  // ...httpHaveAirFlightSelect({ statusList: "1,2,3" }),
};
const SEARCH_COL_28 = {
  id: "secondState",
  label: "二审状态：",
  basicType: "qgSecondState",
  type: "select",
};
const SEARCH_COL_29 = {
  id: "sendFile",
  label: "发送文件：",
  basicType: "trueOrFalse",
  type: "select",
};
const SEARCH_COL_30 = {
  id: "productAttributeList",
  label: "产品属性：",
  placeholder: "请选择（多选）",
  type: "select",
  multiple: true,
  basicType: "orderProductAttribute",
};
const SEARCH_COL_31 = {
  id: "examineStatus",
  label: "查验状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "clearanceExamineStatus",
};

export const FclOrLclSearchColumns = (tName) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...(tName === "1"
                  ? [
                      SEARCH_COL_25, // 拆柜预约时间
                    ]
                  : [
                      SEARCH_COL_1, //创建时间
                    ]),
                SEARCH_COL_2, //NL编号
                SEARCH_COL_3, //国内登记号
                SEARCH_COL_4, //工作单号
                SEARCH_COL_5, //到港时间
                SEARCH_COL_6, //目的国
                SEARCH_COL_7, //业务类型
                SEARCH_COL_9, //清关状态
                SEARCH_COL_10, //委托人
                SEARCH_COL_11, //清关行
                SEARCH_COL_12, //DO
                SEARCH_COL_13, //POD
                SEARCH_COL_14, //MBL
                SEARCH_COL_15, //箱号
                SEARCH_COL_16, //目的仓
                SEARCH_COL_17, //入仓状态
                SEARCH_COL_18, //海外代理
                SEARCH_COL_19, //业务员
                SEARCH_COL_20, //客户信息
                SEARCH_COL_21,
                SEARCH_COL_22,
                SEARCH_COL_23,
                SEARCH_COL_24,
                SEARCH_COL_26,
                SEARCH_COL_27,
                SEARCH_COL_28, // 二审状态
                SEARCH_COL_29,
                SEARCH_COL_30,
                SEARCH_COL_31,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left",
};
const TABLE_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "nlCode",
  label: "NL编号",
  fixed: "left",
  columnLink: true,
  minWidth: 152,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_2 = {
  prop: "bailorPeopleName",
  label: "委托人",
  fixed: "left",
  minWidth: 130,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_3 = {
  prop: "wholeCabinetSn",
  label: "国内登记号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COL_4 = {
  prop: "businessTypeName",
  label: "业务类型",
  minWidth: 110,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "orderNumber",
  label: "工作单号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "checkInfo",
  label: "查验",
  minWidth: 80,
  sortable: true,
  showOverflowTooltip: true,
  // render: row => row.checkSum ? `${row.check || 0}/${row.checkSum}` : 0
};
const TABLE_COL_7 = {
  prop: "pdo",
  label: "DO",
  minWidth: 116,
  sortable: true,
  // showOverflowTooltip: true,
  // fontColor: true,
  // colBgColor: true,
  basicType: "do",
  customRow: true,
};
const TABLE_COL_8 = {
  prop: "pod",
  label: "POD",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  fontColor: true,
  colBgColor: true,
  basicType: "pod",
};
const TABLE_COL_9 = {
  prop: "warehouseName",
  label: "入库仓",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "logisticsChannelName",
  label: "派送渠道",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "remark",
  label: "备注",
  minWidth: 210,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "ontainerSno",
  label: "箱号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "mblNum",
  label: "MBL",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "shipCompanyName",
  label: "船司/航司",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "flightName",
  label: "船名",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "voyageNumber",
  label: "船次",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  prop: "reachTime",
  label: "ETA预计到港",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
  valueFormat: "yyyy-MM-dd HH:mm",
  customRow: true,
};
const TABLE_COL_18 = {
  prop: "customsBrokerName",
  label: "清关行",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_19 = {
  prop: "operationOrderType",
  label: "操作单类型",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => {
    const CLEARANCE_TYPE = ["海运", "空运"];
    const CLEARANCE_BUSINESS_TYPE = ["出口", "进口"];
    return `${CLEARANCE_TYPE[row.operationOrderType] || "--"}${
      CLEARANCE_BUSINESS_TYPE[row.orderBusinessType] || "--"
    }`;
  },
};
const TABLE_COL_20 = {
  prop: "countryName",
  label: "目的国",
  minWidth: 90,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_21 = {
  prop: "subOrderNumber",
  label: "子单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_22 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 90,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_23 = {
  prop: "overseasOperatorName",
  label: "操作员",
  minWidth: 90,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_24 = {
  prop: "agentName",
  label: "海外代理",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_25 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 132,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_26 = {
  prop: "customerName",
  label: "客户信息",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_27 = {
  prop: "warehouseStatus",
  label: "入仓状态",
  minWidth: 100,
  sortable: true,
  dotColor: true,
  basicType: "inWarehouseStatus",
};
const TABLE_COL_28 = {
  prop: "status",
  label: "清关状态",
  fixed: "right",
  minWidth: 98,
  sortable: true,
  dotColor: true,
  basicType: "clearanceStatus",
};
const TABLE_COL_29 = {
  prop: "expectWarehouseType",
  label: "预报入库仓",
  minWidth: 160,
  basicType: "clearanceReservationWarehouse",
  // showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_30 = {
  prop: "warehouseName",
  label: "实际入库仓",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_31 = {
  prop: "countsum",
  label: "审核/备注",
  minWidth: 100,
  sortable: true,
  customRow: true,
  align: "right",
  fixed: "right",
  showOverflowTooltip: true,
};
const TABLE_COL_32 = {
  prop: "headTransportMode",
  label: "头程运输方式",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "headTransportMode",
};
const TABLE_COL_33 = {
  prop: "registerStatus",
  label: "清关登记状态",
  minWidth: 120,
  sortable: true,
  dotColor: true,
  showOverflowTooltip: true,
  fixed: "right",
  basicType: "registerStatusLists",
};
const TABLE_COL_34 = {
  prop: "isOverseaOrders",
  label: "头程订单类型",
  minWidth: 110,
  showOverflowTooltip: true,
  render: (r) => ["电商订单", "海外订单"][r.isOverseaOrders] || "--",
};
const TABLE_COL_35 = {
  prop: "splitBoxTime",
  label: "拆柜预约时间",
  minWidth: 160,
  sortable: true,
  valueFormat: "yyyy-MM-dd HH:mm",
  customRow: true,
};

const TABLE_COL_36 = {
  prop: "quotationSheetNo",
  label: "报价单号",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_37 = {
  prop: "pdoExpireTime",
  label: "DO过期日",
  placeholder: "年-月-日",
  type: "datetime",
  minWidth: 160,
  valueFormat: "yyyy-MM-dd HH:mm",
  customRow: true,
};
const TABLE_COL_38 = {
  prop: "examineStatusStr",
  label: "查验状态",
  minWidth: 120,
  sortable: true,
  basicType: "clearanceExamineStatus",
  showOverflowTooltip: true,
  // customRow: true,
  // editCellKeyName: "temp_secondId",
  // isEditEasyCell: true,
};
const TABLE_COL_39 = {
  prop: "secondState",
  label: "二审状态",
  width: 94,
  sortable: true,
  basicType: "qgSecondState",
};
const TABLE_COL_40 = {
  prop: "sendFile",
  label: "发送文件",
  width: 94,
  sortable: true,
  basicType: "trueOrFalse",
  customRow: true,
  editCellKeyName: "temp_secondId",
  isEditEasyCell: true,
};
const TABLE_COL_41 = {
  prop: "productAttributeList",
  label: "产品属性",
  minWidth: 110,
  showOverflowTooltip: true,
  basicType: "orderProductAttribute",
};
const TABLE_COLS_43 = {
  prop: "yjpsTime",
  label: "派送时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_42 = {
  prop: "checkIndex",
  label: "查验序号",
  minWidth: 110,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  minWidth: 160,
  columnOperation: true,
  columnMoreOperation: true,
  fixed: "right",
};

export const FclOrLclTableColumns = (
  tName,
  { onSelectChange, onWhetherChange }
) => {
  return [
    TABLE_COL_INDEX,
    TABLE_COL_SELECTION,
    TABLE_COL_1, //NL编号
    TABLE_COL_2, //委托人
    TABLE_COL_3, //国内登记号
    TABLE_COL_36,
    TABLE_COL_34,
    TABLE_COL_4, //业务类型
    TABLE_COL_5, //工作单号
    TABLE_COL_42,
    TABLE_COL_6, //查验
    TABLE_COL_7, //do
    ...(tName === "1"
      ? [
          TABLE_COL_37, //DO过期日期
          TABLE_COL_35, // 拆柜预约
        ]
      : []),
    TABLE_COL_8, //POD
    TABLE_COL_29, //预报入库仓
    TABLE_COL_30, //实际入库仓
    TABLE_COL_10, //派送渠道
    TABLE_COL_11, //备注
    TABLE_COL_12, //箱号
    TABLE_COL_13, //MBL
    TABLE_COL_14, //船司/航司
    TABLE_COL_15, //船名
    TABLE_COL_16, //船次
    TABLE_COL_17, //ETA到港时间
    TABLE_COL_18, //清关行
    TABLE_COL_19, //类型
    TABLE_COL_20, //目的国
    ...(tName === "1"
      ? [
          TABLE_COL_21, //子单号
        ]
      : []),
    TABLE_COL_41,
    TABLE_COL_22, //业务员
    TABLE_COL_23, //操作员
    TABLE_COL_24, //海外代理
    TABLE_COL_25, //创建时间
    TABLE_COLS_43,
    TABLE_COL_26, //客户信息
    TABLE_COL_32,
    TABLE_COL_27, //入仓状态
    {
      ...TABLE_COL_38,
      // fieldItem: {
      //   type: "select",
      //   clearable: false,
      //   onSelectChange,
      // },
    },
    TABLE_COL_39,
    {
      ...TABLE_COL_40,
      fieldItem: {
        type: "select",
        isShowNumber: true,
        clearable: false,
        onSelectChange: onWhetherChange,
      },
    },
    TABLE_COL_33, //清关登记状态
    TABLE_COL_31, //审核备注
    TABLE_COL_28, //清关状态
    TABLE_COL_OPERATION,
  ];
};

const RELEASE_COLS_1 = {
  span: 24,
  id: "customsReleaseTime",
  label: "海关放行时间：",
  placeholder: "海关放行时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
};
const RELEASE_COLS_2 = {
  span: 24,
  id: "checkRemark",
  label: "备注说明：",
  placeholder: "备注说明",
  type: "textarea",
};

// 清关放行
export const releaseFormConfig = {
  title: "清关放行",
  width: "450px",
  labelWidth: "120px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [RELEASE_COLS_1, RELEASE_COLS_2],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customsReleaseTime: [
      { required: true, message: "请选择海关放行时间", trigger: "change" },
    ],
  },
};

const FORM_COLS_1 = {
  span: 24,
  id: "nlCode",
  label: "NL编号：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 12,
  id: "bailorPeopleName",
  label: "委托人：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 12,
  id: "operationMainName",
  label: "客户所属公司：",
  type: "txt",
};
const FORM_COLS_4 = (row = {}) => {
  const { salesman } = row;
  return {
    span: 12,
    id: "warehouseId",
    label: "入库仓：",
    ...httpWarehousePublicSelect({
      typeList: "2",
      isHaveComId: 1,
      flagAvailable: "h",
      salesman,
      permissionType: 2,
    }),
    selectLabelKey: "warehouseName",
  };
};
const FORM_COLS_5 = {
  span: 12,
  id: "warehousingTime",
  label: "预计入仓时间：",
  placeholder: "预计入仓时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
};
const FORM_COLS_6 = {
  span: 12,
  id: "trailerId",
  label: "拖车行：",
  placeholder: "拖车行",
  ...httpCustomerSelect({ clientIdentity: 3 }),
};
const FORM_COLS_7 = {
  span: 12,
  id: "businessUnitName",
  label: "海外业务单位：",
  type: "txt",
};
const FORM_COLS_8 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  placeholder: "备注说明",
  type: "textarea",
  maxlength: 500,
};
// 预约入仓
export const warehousingFormConfig = (obj) => {
  const { salesman, activeName } = obj || {};
  return {
    title: activeName == 1 ? "预计提拆柜" : "入仓登记",
    width: "550px",
    labelWidth: "102px",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  FORM_COLS_1,
                  FORM_COLS_2,
                  FORM_COLS_3,
                  FORM_COLS_4({ salesman }),
                  FORM_COLS_5,
                  ...(activeName == 1 ? [] : [FORM_COLS_6]), // FORM_COLS_6,
                  FORM_COLS_7,
                  FORM_COLS_8,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      warehouseId: [
        { required: true, message: "请选择入库仓", trigger: "change" },
      ],
      warehousingTime: [
        { required: true, message: "请选择预计入仓时间", trigger: "change" },
      ],
    },
  };
};

export const batchEditDialogConfig = () => {
  return {
    title: "批量修改",
    width: "600px",
    labelWidth: "140px",
    simpleCustomCols: [
      {
        id: "etaTime",
        label: "ETA预计到港时间：",
        placeholder: "年-月-日",
        type: "date",
        valueFormat: "yyyy-MM-dd",
      },
    ],
    formRules: {
      etaTime: [
        { required: true, message: `请输入ETA预计到港时间`, trigger: "blur" },
      ],
    },
  };
};
