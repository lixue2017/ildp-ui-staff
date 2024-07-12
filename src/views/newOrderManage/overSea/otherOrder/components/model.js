import {
  httpCountrySelect,
  shipCompanyList,
  httpCustomerSelect,
  httpUserSelect,
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
  placeholder: "目的国",
  ...httpCountrySelect,
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
  placeholder: "请选择",
  ...httpDeliveryChannelSelect(),
};
const SEARCH_COLS_6 = {
  id: "warehouseId",
  label: "目的仓：",
  placeholder: "目的仓",
  ...httpWarehousePublicSelect({ typeList: "2", isHaveComId: 1 }),
};
const SEARCH_COLS_7 = {
  id: "airlineName",
  label: "船司/航司：",
  placeholder: "船司/航司",
  ...shipCompanyList(),
};
const SEARCH_COLS_8 = {
  id: "freightType",
  label: "装箱方式：",
  placeholder: "装箱方式",
  type: "select",
  basicType: "freightType",
};
const SEARCH_COLS_9 = {
  id: "flightName",
  label: "船名/航名：",
  placeholder: "船名/航名",
  type: "text",
};
const SEARCH_COLS_10 = {
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "船次/航次",
  type: "text",
};
const SEARCH_COLS_11 = {
  id: "registerNo",
  label: "箱号：",
  placeholder: "箱号",
  type: "text",
};
const SEARCH_COLS_12 = {
  id: "mblNum",
  label: "MBL：",
  placeholder: "MBL",
  type: "text",
};
const SEARCH_COLS_13 = {
  id: "deliveryPlaceType",
  label: "发货地类型：",
  type: "select", // 选择框
  placeholder: "发货地类型",
  basicType: "clearanceDeliveryPlaceType",
};
const SEARCH_COLS_14 = {
  id: "amazonDeliveryNumber",
  label: "Amazon发货号：",
  placeholder: "Amazon发货号",
  type: "text",
};
const SEARCH_COLS_15 = {
  id: "amazonReferenceNumber",
  label: "Amazon参考号：",
  placeholder: "Amazon参考号",
  type: "text",
};
const SEARCH_COLS_16 = {
  id: "platformStore",
  label: "平台店铺：",
  placeholder: "平台店铺",
  type: "text",
};
const SEARCH_COLS_17 = {
  id: "referenceNumber",
  label: "参考号：",
  placeholder: "参考号",
  type: "text",
};
const SEARCH_COLS_18 = {
  id: "overallStatusIn",
  label: "状态：",
  type: "select", // 选择框
  multiple: true,
  placeholder: "状态",
  basicType: "nlOverAllStatus",
  hideList: [20],
};
const SEARCH_COLS_19 = {
  id: "bailorPeopleId",
  label: "委托人：",
  placeholder: "委托人",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_20 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "业务员",
  ...httpUserSelect(),
};
const SEARCH_COLS_21 = {
  id: "overseaBusinessTypes",
  label: "业务类型：",
  placeholder: "业务类型",
  type: "select", // 选择框
  basicType: "overseaBusinessTypes",
};
const SEARCH_COLS_22 = {
  ...SEARCH_COLS_21,
  id: "deliveryBusinessTypes",
  basicType: "deliveryBusinessTypes",
};
const SEARCH_COLS_23 = {
  ...SEARCH_COLS_6,
  label: "入库仓：",
  placeholder: "入库仓",
};
const SEARCH_COLS_24 = {
  id: "transportMode",
  label: "运输方式：",
  basicType: "headTransportMode",
  type: "select", // 选择框
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "jobNo",
  label: "工作单号",
  minWidth: 140,
  sortable: true,
  align: "left",
  fixed: "left",
  columnLink: true,
  columnCopyTxt: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "contryName",
  label: "目的国",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "registerNo",
  label: "箱号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "mblNum",
  label: "MBL",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "flightName",
  label: "船名",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "voyageNumber",
  label: "船次",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "reachTime",
  label: "ETA预计到港",
  minWidth: 130,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "warehouseName",
  label: "入库仓",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "freightType",
  label: "装箱方式",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  basicType: "freightType",
};
const TABLE_COLS_10 = {
  prop: "logisticsChannelName",
  label: "派送渠道",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "overallStatus",
  label: "状态",
  minWidth: 100,
  sortable: true,
  align: "left",
  fixed: "right",
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "nlOverAllStatus",
};
const TABLE_COLS_13 = {
  prop: "deliveryPlaceType",
  label: "发货地类型",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  basicType: "clearanceDeliveryPlaceType",
};
const TABLE_COLS_14 = {
  prop: "deliveryPlaceName",
  label: "发货地",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "amazonDeliveryNumber",
  label: "Amazon发货号",
  minWidth: 140,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "amazonReferenceNumber",
  label: "Amazon参考号",
  minWidth: 140,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "platformStore",
  label: "平台店铺",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  prop: "referenceNumber",
  label: "参考号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "remark",
  label: "备注",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  prop: "overallStatus",
  label: "状态",
  minWidth: 100,
  sortable: true,
  align: "left",
  fixed: "right",
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "nlOverAllStatus",
};
const TABLE_COLS_21 = {
  prop: "bailorPeopleName",
  label: "委托人",
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: true,
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  prop: "airlineName",
  label: "船司/航司",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_24 = {
  prop: "overseaBusinessTypes",
  label: "业务类型",
  minWidth: 120,
  sortable: true,
  align: "left",
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
const TABLE_COLS_25 = {
  ...TABLE_COLS_24,
  render: (row) => {
    const [type1, type2] = row.overseaBusinessTypes || [2];
    const obj = {
      2: "直派",
      3: "入仓+派送",
    };
    return obj[type2 || type1];
  },
};
const TABLE_COLS_26 = {
  prop: "warehousingTime",
  label: "预计入仓时间",
  minWidth: 160,
  align: "left",
  showOverflowTooltip: true,
};

const TABLE_COLS_27 = {
  prop: "transportMode",
  label: "运输方式",
  minWidth: 100,
  basicType: "headTransportMode",
  showOverflowTooltip: true,
};
const TABLE_COLS_28 = {
  prop: "ontainerSno",
  label: "国内登记号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_29 = {
  prop: "overseasOperatorName",
  label: "操作员",
  sortable: true,
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 140,
  columnOperation: true,
  columnMoreOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};

// 海外清关订单
export const customsClearance = {
  searchColumns: [
    SEARCH_COLS_1, // 创建时间
    SEARCH_COLS_19, // 委托人
    SEARCH_COLS_2, // 工作单号
    SEARCH_COLS_21, // 业务类型
    SEARCH_COLS_3, // 目的国
    SEARCH_COLS_4, // 清关状态
    SEARCH_COLS_5, // 派送渠道
    SEARCH_COLS_6, // 目的仓
    SEARCH_COLS_7, // 船司/航司
    SEARCH_COLS_8, // 装箱方式
    SEARCH_COLS_9, // 船名/航名
    SEARCH_COLS_10, // 船次/航次
    SEARCH_COLS_11, // 箱号
    SEARCH_COLS_12, // MBL
    SEARCH_COLS_20, // 业务员
    SEARCH_COLS_24, //运输方式
  ],
  tableColumns: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1, // 工作单号
    TABLE_COLS_21, // 委托人
    TABLE_COLS_24, // 业务类型
    TABLE_COLS_2, // 目的国
    TABLE_COLS_3, // 箱号
    TABLE_COLS_4, // MBL
    TABLE_COLS_23, // 船司/航司
    TABLE_COLS_5, // 船名
    TABLE_COLS_6, // 船次
    TABLE_COLS_7, // ETA预计到港
    TABLE_COLS_8, // 入库仓
    TABLE_COLS_9, // 装箱方式
    TABLE_COLS_10, // 派送渠道
    TABLE_COLS_11, // 创建时间
    TABLE_COLS_22, // 业务员
    TABLE_COLS_27, //运输方式
    TABLE_COLS_28, //国内登记号
    TABLE_COLS_12, // 状态
    TABLE_COLS_OPERATION, // 操作
  ],
};

// 海外提派订单
export const delivery = {
  searchColumns: [
    SEARCH_COLS_1, // 创建时间
    SEARCH_COLS_19, // 委托人
    SEARCH_COLS_2, // 工作单号
    SEARCH_COLS_3, // 目的国
    SEARCH_COLS_18, // 状态
    SEARCH_COLS_5, // 派送渠道
    SEARCH_COLS_13, // 发货地类型
    SEARCH_COLS_22, // 业务类型
    SEARCH_COLS_23, // 入库仓
    SEARCH_COLS_8, // 装箱方式
    SEARCH_COLS_14, // Amazon发货号
    // SEARCH_COLS_15, // Amazon参考号
    SEARCH_COLS_16, // 平台店铺
    SEARCH_COLS_17, //  参考号
    SEARCH_COLS_20, // 业务员
    SEARCH_COLS_24, //运输方式
  ],
  tableColumns: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1, // 工作单号
    TABLE_COLS_21, // 委托人
    TABLE_COLS_10, // 派送渠道
    TABLE_COLS_2, // 目的国
    TABLE_COLS_13, // 发货地类型
    TABLE_COLS_14, // 发货地
    TABLE_COLS_25, // 业务类型
    TABLE_COLS_8, // 入库仓
    TABLE_COLS_26, // 预计入仓时间
    TABLE_COLS_9, // 装箱方式
    TABLE_COLS_15, // Amazon发货号
    // TABLE_COLS_16, // Amazon参考号
    TABLE_COLS_17, // 平台店铺
    TABLE_COLS_18, // 参考号
    TABLE_COLS_19, // 备注
    TABLE_COLS_22, // 业务员
    TABLE_COLS_29, //操作员
    TABLE_COLS_27, //运输方式
    TABLE_COLS_28, //国内登记号
    TABLE_COLS_3, //海外提派订单列表
    TABLE_COLS_20, // 状态
    TABLE_COLS_OPERATION, // 操作
  ],
};

// 海外清关操作单
export const customsClearanceOperation = {
  searchColumns: [
    SEARCH_COLS_1, // 创建时间
    SEARCH_COLS_19, // 委托人
    SEARCH_COLS_2, // 工作单号
    SEARCH_COLS_21, // 业务类型
    SEARCH_COLS_3, // 目的国
    SEARCH_COLS_4, // 清关状态
    SEARCH_COLS_5, // 派送渠道
    SEARCH_COLS_6, // 目的仓
    SEARCH_COLS_7, // 船司/航司
    SEARCH_COLS_8, // 装箱方式
    SEARCH_COLS_9, // 船名/航名
    SEARCH_COLS_10, // 船次/航次
    SEARCH_COLS_11, // 箱号
    SEARCH_COLS_12, // MBL
    SEARCH_COLS_20, // 业务员
    SEARCH_COLS_24, //运输方式
  ],
  tableColumns: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1, // 工作单号
    TABLE_COLS_21, // 委托人
    TABLE_COLS_24, // 业务类型
    TABLE_COLS_2, // 目的国
    TABLE_COLS_3, // 箱号
    TABLE_COLS_4, // MBL
    TABLE_COLS_23, // 船司/航司
    TABLE_COLS_5, // 船名
    TABLE_COLS_6, // 船次
    TABLE_COLS_7, // ETA预计到港
    TABLE_COLS_8, // 入库仓
    TABLE_COLS_9, // 装箱方式
    TABLE_COLS_10, // 派送渠道
    TABLE_COLS_11, // 创建时间
    TABLE_COLS_22, // 业务员
    TABLE_COLS_27, //运输方式
    TABLE_COLS_12, // 状态
  ],
};

// 海外提派操作单
export const deliveryOperation = {
  searchColumns: [
    SEARCH_COLS_1, // 创建时间
    SEARCH_COLS_19, // 委托人
    SEARCH_COLS_2, // 工作单号
    SEARCH_COLS_3, // 目的国
    SEARCH_COLS_18, // 状态
    SEARCH_COLS_5, // 派送渠道
    SEARCH_COLS_13, // 发货地类型
    SEARCH_COLS_22, // 业务类型
    SEARCH_COLS_23, // 入库仓
    SEARCH_COLS_8, // 装箱方式
    SEARCH_COLS_14, // Amazon发货号
    // SEARCH_COLS_15, // Amazon参考号
    SEARCH_COLS_16, // 平台店铺
    SEARCH_COLS_17, //  参考号
    SEARCH_COLS_20, // 业务员
    SEARCH_COLS_24, //运输方式
  ],
  tableColumns: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1, // 工作单号
    TABLE_COLS_21, // 委托人
    TABLE_COLS_10, // 派送渠道
    TABLE_COLS_2, // 目的国
    TABLE_COLS_13, // 发货地类型
    TABLE_COLS_14, // 发货地
    TABLE_COLS_25, // 业务类型
    TABLE_COLS_8, // 入库仓
    TABLE_COLS_26, // 预计入仓时间
    TABLE_COLS_9, // 装箱方式
    TABLE_COLS_15, // Amazon发货号
    // TABLE_COLS_16, // Amazon参考号
    TABLE_COLS_17, // 平台店铺
    TABLE_COLS_18, // 参考号
    TABLE_COLS_19, // 备注
    TABLE_COLS_22, // 业务员
    TABLE_COLS_29, //操作员
    TABLE_COLS_27, //运输方式
    TABLE_COLS_3, //箱号
    TABLE_COLS_20, // 状态
  ],
};

const BAT_BTN_COL_1 = {
  isTabShow: false,
  tabKey: "stateBar",
  name: "轨迹",
};
const BAT_BTN_COL_2 = {
  name: "备注",
  tabKey: "remarkBar",
  isTabShow: false,
  className: "remarks-bar-length",
};

export const barTabConfig = (row) => {
  const { menuType } = row;
  return [BAT_BTN_COL_1, ...(menuType == "operation" ? [BAT_BTN_COL_2] : [])];
};
