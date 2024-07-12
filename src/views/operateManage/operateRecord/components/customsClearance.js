import {
  httpCountrySelect,
  httpCustomerSelect,
  httpUserSelect,
  httpEnterprisetSelect,
  shipCompanyList,
  httpPortPublicSelect,
} from "@/comModel/httpSelect";
import * as comModel from "../components/recordModel";
const FORM_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
  labelWidth: "100px",
};

const FORM_COLS_2 = {
  id: "entrust",
  label: "委托人：",
  placeholder: "委托人",
  ...httpCustomerSelect(),
};

const FORM_COLS_3 = {
  id: "operator",
  label: "操作员：",
  placeholder: "请选择操作员",
  ...httpUserSelect(),
};

const FORM_COLS_4 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
};

const FORM_COLS_5 = {
  id: "country",
  label: "国家：",
  placeholder: "国家",
  type: "autocomplete",
  category: "country",
  labelWidth: "100px",
  defaultProp: {
    value: "id",
    label: "twoCode,nameCn",
  },
};

const FORM_COLS_6 = {
  id: "exportType",
  label: "类型：",
  placeholder: "请选择类型",
  type: "select",
  basicType: "importExportType",
};

const FORM_COLS_7 = {
  id: "ontainerSno",
  label: "箱号：",
  placeholder: "请输入箱号",
  type: "text",
};

const FORM_COLS_8 = {
  id: "customsClearanceStatusType",
  label: "状态：",
  placeholder: "请选择状态",
  type: "select",
  basicType: "clearanceReview",
  hideList: [2],
};

const FORM_COLS_9 = {
  id: "overseasAgency",
  label: "海外代理：",
  placeholder: "请选择海外代理",
  ...httpEnterprisetSelect({ typeList: "0,1,2,3" }),
};

const FORM_COLS_10 = {
  id: "shipCompany",
  label: "航空/船公司：",
  placeholder: "请选择航空/船公司",
  labelWidth: "100px",
  ...shipCompanyList(),
};

const FORM_COLS_11 = {
  id: "flightName",
  label: "船名/航名：",
  placeholder: "请输入船名/航名",
  type: "text",
};

const FORM_COLS_12 = {
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "请输入船次/航次",
  type: "text",
};

const FORM_COLS_13 = {
  id: "startPortId",
  label: "起运港：",
  placeholder: "请输入起运港",
  ...httpPortPublicSelect(),
};
const FORM_COLS_14 = {
  id: "endPortId",
  label: "目的港：",
  placeholder: "请输入目的港",
  labelWidth: "100px",
  ...httpPortPublicSelect(),
};

const FORM_COLS_15 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "请选择业务员",
  ...httpUserSelect(),
};

const FORM_COLS_16 = {
  id: "csOperatorName",
  label: "湖南操作：",
  placeholder: "请选择湖南操作",
  ...httpUserSelect(),
};

const FORM_COLS_17 = {
  id: "overseasOperatorName",
  label: "海外操作：",
  placeholder: "请选择海外操作",
  ...httpUserSelect(),
};

const FORM_COLS_18 = {
  id: "tradeClauseSearch",
  label: "贸易条款：",
  placeholder: "贸易条款",
  type: "select",
  basicType: "tradeClause",
};
const FORM_COLS_19 = {
  id: "sortBoxRegisterNo",
  label: "国内登记号：",
  placeholder: "请输入国内登记号",
  type: "text",
};
const FORM_COLS_20 = {
  id: "expectWarehouseType",
  label: "预报入库仓：",
  basicType: "clearanceReservationWarehouse",
  type: "select",
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COLS_1 = {
  prop: "operationOrderNum1",
  label: "工作单号",
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
  customRow: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_2 = {
  prop: "operateShortName",
  label: "海外代理",
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
  showOverflowTooltip: true,
};

const TABLE_COLS_3 = {
  prop: "bailorPeople",
  label: "委托人",
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
  showOverflowTooltip: true,
};

const TABLE_COLS_4 = {
  prop: "tradeClause",
  label: "贸易条款",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "tradeClause",
};

const TABLE_COLS_5 = {
  prop: "operationOrderType",
  label: "类型",
  // customRow: true,
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  render: (row) => {
    return `${comModel.CLEARANCE_TYPE[row.operationOrderType] || "--"}${
      comModel.CLEARANCE_BUSINESS_TYPE[row.orderBusinessType] || "--"
    }`;
  },
};

const TABLE_COLS_6 = {
  prop: "ontainerSno",
  label: "箱号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "startPortName",
  label: "起运港",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "endPortName",
  label: "目的港",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "shipCompany",
  label: "航空/船公司",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "flightName",
  label: "船名/航名",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "voyageNumber",
  label: "船次/航次",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "openPositionTime",
  label: "ETD",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "etaTime",
  label: "ETA",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "countryName",
  label: "目的国",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "operatorName",
  label: "操作员",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "taskCreateTime",
  label: "创建时间",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "updateTime",
  label: "最后修改时间",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  width: 140,
};
const TABLE_COLS_18 = {
  prop: "overseasOperatorName",
  label: "海外操作",
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COLS_19 = {
  prop: "overseasAgencyName",
  label: "海外代理",
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COLS_20 = {
  prop: "countsum",
  label: "审核/备注",
  minWidth: 120,
  sortable: true,
  customRow: true,
  align: "right",
  fixed: "right",
  showOverflowTooltip: true,
  width: 120,
};
const TABLE_COLS_21 = {
  prop: "customsClearanceStatus",
  label: "状态",
  minWidth: 80,
  sortable: true,
  showOverflowTooltip: true,
  align: "center",
  fixed: "right",
  dotColor: true,
  basicType: "clearanceReview",
  // dicsStr: 'customsClearance_status',
  // customDicsArr: [0, 1, 2], // 对象属性名
  // customDicsVal: "customsClearanceStatus"
};
const TABLE_COLS_26 = {
  prop: "nlCode",
  label: "海外清关单号",
  sortable: true,
  showOverflowTooltip: true,
  width: 132,
};
const TABLE_COLS_28 = {
  prop: "remark",
  label: "备注信息",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};

const TABLE_COLS_99 = {
  prop: "operation",
  label: "操作",
  minWidth: 100,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
  fixed: "right",
};
const TABLE_COLS_23 = {
  prop: "operationOrderNum",
  label: "子单号",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COLS_24 = {
  prop: "csOperatorName",
  label: "湖南操作",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_25 = {
  prop: "sortBoxRegisterNo",
  label: "国内登记号",
  minWidth: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_27 = {
  prop: "mblNum",
  label: "MBL",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_29 = {
  prop: "expectWarehouseType",
  label: "预报入库仓",
  minWidth: 160,
  sortable: true,
  basicType: "clearanceReservationWarehouse",
  showOverflowTooltip: true,
};
const TABLE_COLS_30 = {
  prop: "warehouseName",
  label: "实际入库仓",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
};
const publicFormConfig = [
  FORM_COLS_1, //创建时间
  FORM_COLS_2, //委托人
  FORM_COLS_4, //工作单号
  FORM_COLS_19, //国内登记号
  FORM_COLS_3, //操作员
  FORM_COLS_5, //国家
  FORM_COLS_6, //类型
  FORM_COLS_7, //箱号
  FORM_COLS_20,
];

export const ecPendApproval = () => {
  //待审核电商
  const config = {
    lists: [
      ...publicFormConfig,
      FORM_COLS_8, //状态
      FORM_COLS_9, //海外代理
      FORM_COLS_10, //航空/船公司
      FORM_COLS_11, //船名/航名
      FORM_COLS_12, //船次/航次
      FORM_COLS_13, //装运港
      FORM_COLS_14, //目的港
    ],
    tableColumns: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1, //工作单号
      TABLE_COLS_25, //国内登记号
      // TABLE_COLS_2,//交换主体
      TABLE_COLS_3, //委托人
      // TABLE_COLS_4,//贸易条款
      TABLE_COLS_5, //类型
      TABLE_COLS_23, //子单号
      TABLE_COLS_6, //箱号
      TABLE_COLS_27, //MBL
      TABLE_COLS_7, //起运港
      TABLE_COLS_8, //目的港
      TABLE_COLS_29, //预报入库仓
      TABLE_COLS_30, //实际入库仓
      TABLE_COLS_9, //航空/船公司
      TABLE_COLS_10, //船名/航名
      TABLE_COLS_11, //船次/航次
      TABLE_COLS_12, //ETD
      TABLE_COLS_13, //ETA
      // TABLE_COLS_28, // 备注
      TABLE_COLS_14, //目的国
      TABLE_COLS_15, //操作员
      TABLE_COLS_16, //创建时间
      // TABLE_COLS_17,//最后修改时间
      TABLE_COLS_19, //海外代理
      TABLE_COLS_20, //审核备注
      TABLE_COLS_21, //状态
      TABLE_COLS_99, //操作
    ],
  };
  return config;
};

export const ecSubmitted = () => {
  //已提交电商
  const config = {
    lists: [
      ...publicFormConfig,
      FORM_COLS_9, //海外代理
      FORM_COLS_10, //航空/船公司
      FORM_COLS_11, //船名/航名
      FORM_COLS_12, //船次/航次
      FORM_COLS_13, //装运港
      FORM_COLS_14, //目的港
      FORM_COLS_16, //湖南操作
      FORM_COLS_17, //海外操作
    ],
    tableColumns: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1, //工作单号
      TABLE_COLS_25, //国内登记号
      // TABLE_COLS_2,//交换主体
      TABLE_COLS_3, //委托人
      // TABLE_COLS_4,//贸易条款
      TABLE_COLS_5, //类型
      TABLE_COLS_23, //子单号
      TABLE_COLS_6, //箱号
      TABLE_COLS_26, // 海外清关单号
      TABLE_COLS_7, //起运港
      TABLE_COLS_8, //目的港
      TABLE_COLS_29, //预报入库仓
      TABLE_COLS_30, //实际入库仓
      TABLE_COLS_9, //航空/船公司
      TABLE_COLS_10, //船名/航名
      TABLE_COLS_11, //船次/航次
      TABLE_COLS_12, //ETD
      TABLE_COLS_13, //ETA
      // TABLE_COLS_28, // 备注
      TABLE_COLS_14, //目的国
      TABLE_COLS_15, //操作员
      TABLE_COLS_16, //创建时间
      // TABLE_COLS_17,//最后修改时间
      TABLE_COLS_18, //海外操作
      TABLE_COLS_24, //湖南操作
      {
        ...TABLE_COLS_19,
        fixed: "right",
      }, //海外代理
      {
        ...TABLE_COLS_20,
        fixed: "right",
      }, //审核备注
    ],
  };
  return config;
};
export const tradPendApproval = () => {
  //待审核传统
  const config = {
    lists: [
      ...publicFormConfig,
      FORM_COLS_18, //贸易条款
      FORM_COLS_9, //海外代理
      FORM_COLS_10, //航空/船公司
      FORM_COLS_11, //船名/航名
      FORM_COLS_12, //船次/航次
      FORM_COLS_13, //装运港
      FORM_COLS_14, //目的港
    ],
    tableColumns: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1, //工作单号
      TABLE_COLS_25, //国内登记号
      // TABLE_COLS_2,//交换主体
      TABLE_COLS_3, //委托人
      TABLE_COLS_4, //贸易条款
      TABLE_COLS_5, //类型
      TABLE_COLS_6, //箱号
      TABLE_COLS_7, //起运港
      TABLE_COLS_8, //目的港
      TABLE_COLS_29, //预报入库仓
      // TABLE_COLS_30,//实际入库仓
      TABLE_COLS_9, //航空/船公司
      TABLE_COLS_10, //船名/航名
      TABLE_COLS_11, //船次/航次
      TABLE_COLS_12, //ETD
      TABLE_COLS_13, //ETA
      // TABLE_COLS_28, // 备注
      TABLE_COLS_14, //目的国
      TABLE_COLS_15, //操作员
      TABLE_COLS_16, //创建时间
      // TABLE_COLS_17,//最后修改时间
      TABLE_COLS_19, //海外代理
      TABLE_COLS_20, //审核备注
      TABLE_COLS_21, //状态
      TABLE_COLS_99, //操作
    ],
  };
  return config;
};
export const tradSubmitted = () => {
  //已提交传统
  const config = {
    lists: [
      ...publicFormConfig,
      FORM_COLS_18, //贸易条款
      FORM_COLS_9, //海外代理
      FORM_COLS_10, //航空/船公司
      FORM_COLS_11, //船名/航名
      FORM_COLS_12, //船次/航次
      FORM_COLS_13, //装运港
      FORM_COLS_14, //目的港
      FORM_COLS_17, //海外操作
    ],
    tableColumns: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1, //工作单号
      TABLE_COLS_25, //国内登记号
      // TABLE_COLS_2,//交换主体
      TABLE_COLS_3, //委托人
      TABLE_COLS_4, //贸易条款
      TABLE_COLS_5, //类型
      TABLE_COLS_6, //箱号
      TABLE_COLS_26, // 海外清关单号
      TABLE_COLS_7, //起运港
      TABLE_COLS_8, //目的港
      TABLE_COLS_29, //预报入库仓
      // TABLE_COLS_30,//实际入库仓
      TABLE_COLS_9, //航空/船公司
      TABLE_COLS_10, //船名/航名
      TABLE_COLS_11, //船次/航次
      TABLE_COLS_12, //ETD
      TABLE_COLS_13, //ETA
      // TABLE_COLS_28, // 备注
      TABLE_COLS_14, //目的国
      TABLE_COLS_15, //操作员
      TABLE_COLS_16, //创建时间
      // TABLE_COLS_17,//最后修改时间
      TABLE_COLS_18, //海外操作
      {
        ...TABLE_COLS_19,
        fixed: "right",
      }, //海外代理
      {
        ...TABLE_COLS_20,
        fixed: "right",
      }, //审核备注
    ],
  };
  return config;
};
