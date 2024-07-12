import { getContactsPublicList } from "@/api/publicInterface/index.js"; //公共接口
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import {
  httpCustomerSelect,
  httpRoleDeptUserSelect,
  httpPortPublicSelect,
  httpGetServiceChannel,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";

const SEARCH_COLS_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "customerName",
  label: "委托人：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_3 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
  residueCol: 2,
};
const SEARCH_COLS_4 = {
  id: "operator",
  label: "操作员：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
// const SEARCH_COLS_5 = {
//   id: "serviceChannelId",
//   label: "运输方式：",
//   placeholder: "请选择",
//   ...httpGetServiceChannel()
// }
const SEARCH_COLS_5 = {
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "头程运输方式",
  type: "select",
  basicType: "headTransportMode",
};
const SEARCH_COLS_5_1 = {
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  placeholder: "尾程运输方式",
  type: "select",
  basicType: "outWarehouseWay",
};
const SEARCH_COLS_6 = {
  id: "countryId",
  label: "国家：",
  placeholder: "请选择",
  type: "autocomplete",
  category: "country",
  defaultProp: {
    value: "id",
    label: "twoCode,nameCn",
  },
};
const SEARCH_COLS_7 = {
  id: "inlandExportParam",
  label: "产品情况：",
  placeholder: "请选择",
  type: "select",
  basicType: "productSituation",
};
const SEARCH_COLS_8 = {
  id: "operationOrderStatusIn",
  label: "状态：",
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "orderStatus",
  hideList: [0, 1, 45],
};
const SEARCH_COLS_9 = {
  id: "sono",
  label: "SO No.：",
  placeholder: "SO No.",
  type: "text",
};
const SEARCH_COLS_10 = {
  id: "ontainerSno",
  label: "箱号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_11 = {
  id: "mblNo",
  label: "MBL号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_12 = {
  id: "sortBoxRegisterNo",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_13 = {
  id: "startPortId",
  label: "起运港：",
  placeholder: "请选择",
  ...httpPortPublicSelect("0"),
};
const SEARCH_COLS_14 = {
  id: "endPortId",
  label: "目的港：",
  placeholder: "请选择",
  ...httpPortPublicSelect("0"),
};
const SEARCH_COLS_15 = {
  id: "transactionWarehouse",
  label: "国内交货仓：",
  placeholder: "请选择",
  ...httpWarehousePublicSelect({
    itemId: "parentId",
    flagAvailable: "y",
    dataStatusIn: "1,2",
  }),
};
const SEARCH_COLS_16 = {
  id: "destinationWarehouseName",
  label: "目的仓：",
  placeholder: "请选择",
  ...httpWarehousePublicSelect({ typeList: "0,1,2,3,4", itemId: "code" }),
  // type: "text",
};
const SEARCH_COLS_17 = {
  id: "reportCustomsWays",
  label: "报关类型：",
  placeholder: "报关类型（多选）",
  type: "select",
  multiple: true,
  basicType: "customsDeclarationType",
};
const SEARCH_COLS_18 = {
  id: "customsClearanceId",
  label: "清关方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "customsClearanceType",
};
const SEARCH_COLS_19 = {
  id: "freightType",
  label: "装箱方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "freightType",
};
const SEARCH_COLS_20 = {
  id: "cusOrderNumber",
  label: "客户单号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_21 = {
  id: "bookingSpaceProxy",
  label: "订舱代理：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_22 = {
  id: "shipCompanyId",
  label: "航空/船公司：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_23 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
};
// const SEARCH_COLS_24 = {
//   id: "salesAssistant",
//   label: "业务助理：",
//   placeholder: "请选择",
//   ...httpRoleDeptUserSelect({ getRoles: ['YW'] })
// }
const SEARCH_COLS_25 = {
  id: "shipperId",
  label: "发货人：",
  placeholder: "请选择",
  type: "autocomplete",
  searchParamName: "orderSearch",
  httpRequest: (params) => getContactsPublicList({ ...params, typeList: 1 }),
  getCustomData: (item) => {
    return {
      key: item.id,
      // label: `${item.name}(${item.phone})`,
      label: `${item.company}`,
      value: item.id,
      // title: `${item.name}(${item.phone})/${item.company}`,
      title: `${item.company}`,
      subtitle: `${item.address}`,
    };
  },
};
const SEARCH_COLS_26 = {
  id: "consigneeId",
  label: "收货人：",
  placeholder: "请选择",
  type: "autocomplete",
  searchParamName: "orderSearch",
  httpRequest: (params) => getContactsPublicList({ ...params, typeList: 0 }),
  getCustomData: (item) => {
    return {
      key: item.id,
      // label: `${item.name}(${item.phone})`,
      label: `${item.company}`,
      value: item.id,
      // title: `${item.name}(${item.phone})/${item.company}`,
      title: `${item.company}`,
      subtitle: `${item.address}`,
    };
  },
};
const SEARCH_COLS_27 = {
  id: "fsaId",
  label: "海外代理：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_28 = {
  id: "tradeClauseSearch",
  label: "贸易条款：",
  placeholder: "贸易条款（多选）",
  type: "select",
  multiple: true,
  basicType: "tradeClause",
};
const SEARCH_COLS_29 = {
  id: "orderBusinessType",
  label: "业务类型：",
  placeholder: "请选择",
  type: "select",
  // multiple: true,
  basicType: "orderBusinessType",
  hideList: [2, 3, 4, 5],
};
const SEARCH_COLS_30 = {
  id: "trailerMethod",
  label: "拖车方式：",
  placeholder: "请选择",
  type: "select",
  options: [
    {
      value: "我司拖车/提货",
      label: "我司拖车/提货",
    },
    {
      value: "客户自拖/自送",
      label: "客户自拖/自送",
    },
  ],
};
const SEARCH_COLS_31 = {
  id: "fileMember",
  label: "文件员：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const SEARCH_COLS_32 = {
  id: "declareCurrencyId",
  label: "清关币别：",
  placeholder: "请选择",
  type: "autocomplete",
  category: "currency",
};
const SEARCH_COLS_33 = {
  id: "flightName",
  label: "航线/船名：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_34 = {
  id: "voyageNumber",
  label: "航次/船次：",
  placeholder: "请输入",
  type: "text",
};

// 传统运输方式
const SEARCH_COLS_35 = {
  id: "serviceChannelId",
  label: "运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "transportMode",
};
//  其他
const SEARCH_COLS_36 = {
  ...SEARCH_COLS_29,
  hideList: [0, 1],
};
const SEARCH_COLS_40 = {
  ...SEARCH_COLS_10,
  label: "柜号：",
  placeholder: "柜号",
};
const SEARCH_COLS_37 = {
  id: "notifierId",
  label: "通知人：",
  placeholder: "通知人",
  type: "autocomplete",
  searchParamName: "orderSearch",
  httpRequest: (params) => getContactsPublicList({ ...params, typeList: 0 }),
  getCustomData: (item) => {
    return {
      key: item.id,
      label: `${item.name}(${item.phone})`,
      value: item.id,
      title: `${item.name}(${item.phone})/${item.company}`,
      subtitle: `${item.address}`,
    };
  },
};
const SEARCH_COLS_38 = {
  id: "customerOrderSn",
  label: "客户单号：",
  placeholder: "客户单号",
  type: "text",
};
const SEARCH_COLS_39 = {
  id: "wholeCabinetSn",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_41 = {
  id: "insured",
  label: "单独购买保险：",
  placeholder: "单独购买保险",
  type: "select",
  options: [
    {
      value: 1,
      label: "是",
    },
    {
      value: 0,
      label: "否",
    },
  ],
};
const SEARCH_COLS_42 = {
  id: "productAttributeList",
  label: "产品属性：",
  placeholder: "请选择",
  type: "select",
  multiple: true,
  basicType: "orderProductAttribute",
};
const SEARCH_COLS_640 = {
  id: "customerId",
  label: "委托人：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const SEARCH_COLS_641 = {
  id: "consigneeWarehouseId",
  label: "目的仓：",
  placeholder: "请选择",
  ...httpWarehousePublicSelect({ typeList: "0,1,2,3,4" }),
};
const SEARCH_COLS_642 = {
  ...SEARCH_COLS_6,
  id: "country",
};
const SEARCH_COLS_643 = {
  ...SEARCH_COLS_38,
  id: "cusOrderNumber",
};
const SEARCH_COLS_644 = {
  id: "shipCompany",
  label: "航空/船公司：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_645 = {
  id: "operationOrderType",
  label: "操作单类型：",
  placeholder: "操作单类型",
  type: "select",
  options: [
    {
      value: 0,
      label: "海运",
    },
    {
      value: 1,
      label: "空运",
    },
  ],
};
const SEARCH_COLS_646 = {
  id: "operateMain",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COLS_647 = {
  id: "sourceNumber",
  label: "来源订单号：",
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COLS_648 = {
  id: "nodeStatus",
  label: "节点状态：",
  placeholder: "节点状态（多选）",
  type: "select",
  multiple: true,
  basicType: "operationQueryNodeStatus",
};

// 搜索
const SEARCH_COL_OBJ = {
  S1: SEARCH_COLS_1,
  S3: SEARCH_COLS_3,
  S4: SEARCH_COLS_4,
  S5: SEARCH_COLS_5,
  S5_1: SEARCH_COLS_5_1,
  S8: SEARCH_COLS_8,
  S9: SEARCH_COLS_9,
  S10: SEARCH_COLS_10,
  S11: SEARCH_COLS_11,
  S13: SEARCH_COLS_13,
  S14: SEARCH_COLS_14,
  S15: SEARCH_COLS_15,
  S19: SEARCH_COLS_19,
  S20: SEARCH_COLS_20,
  S21: SEARCH_COLS_21,
  S23: SEARCH_COLS_23,
  S28: SEARCH_COLS_28,
  S31: SEARCH_COLS_31,
  S36: SEARCH_COLS_36,
  S39: SEARCH_COLS_39,
  S640: SEARCH_COLS_640,
  S641: SEARCH_COLS_641,
  S41: SEARCH_COLS_41,
  S42: SEARCH_COLS_42,
  S645: SEARCH_COLS_645,
  S646: SEARCH_COLS_646,
  S647: SEARCH_COLS_647,
  S648: SEARCH_COLS_648,
};

// const SEARCH_COLS_18 = {
//   id: "Uncharted_6",
//   label: "起运仓：",
//   placeholder: "请选择起运仓",
//   type: "autocomplete",
//   category: "country",
//   searchParamName: 'search',
//   ...httpPortPublicSelect('0'),
// }
// const SEARCH_COLS_19 = {
//   id: "Uncharted_7",
//   label: "目的仓：",
//   placeholder: "请选择目的仓",
//   type: "autocomplete",
//   category: "country",
//   searchParamName: 'search',
//   ...httpPortPublicSelect('0'),
// }

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "工作单号",
  prop: "operationOrderNum",
  columnLink: true,
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_2 = {
  label: "委托人",
  prop: "customerName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COLS_3 = {
  label: "SO NO.",
  prop: "sono",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 130,
};
const TABLE_COLS_4 = {
  label: "MBL号",
  prop: "mblNo",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_5 = {
  label: "箱号",
  prop: "ontainerSno",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_6 = {
  label: "国内登记号",
  prop: "sortBoxRegisterNo",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_7 = {
  label: "国家",
  prop: "countryName",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_8 = {
  label: "运输方式",
  prop: "transportType",
  minWidth: 100,
  sortable: true,
  basicType: "transportMode",
  render: (row, name) => {
    return name || row.transportType || "--";
  },
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  label: "订舱代理",
  prop: "bookingSpaceProxyName",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_10 = {
  label: "起运港",
  prop: "startPortName",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COLS_11 = {
  label: "目的港",
  prop: "endPortName",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COLS_12 = {
  label: "起始仓",
  prop: "transactionWarehouseName",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COLS_13 = {
  label: "国内交货仓",
  prop: "transactionWarehouseName",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COLS_14 = {
  label: "目的仓",
  prop: "destinationWarehouseName",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  // render: (row) => {
  //   return `${row.totalAddressCount || '--'}个：${(row.consigneeCodes &&
  //     row.consigneeCodes.join("、")) ||
  //     "--"
  //     }`
  // }
};
const TABLE_COLS_15 = {
  label: "是否订舱",
  prop: "isBookingSpace",
  sortable: true,
  minWidth: 100,
  render: (r) => ["否", "是"][r.isBookingSpace] || "--",
};
const TABLE_COLS_16 = {
  label: "上门提货",
  prop: "isHomeDelivery",
  sortable: true,
  minWidth: 100,
  render: (r) => ["否", "是"][r.isHomeDelivery],
};
const TABLE_COLS_17 = {
  label: "装箱方式",
  prop: "freightType",
  basicType: "freightType",
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_18 = {
  label: "报关方式",
  prop: "customsDeclarationType",
  // basicType: "customsDeclarationType",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  label: "清关方式",
  prop: "clearanceType",
  // basicType: "customsClearanceType",
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_20 = {
  label: "件数",
  prop: "freightNum",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 80,
  align: "center",
  render: (row) => {
    return row.freightNum || row.packNum || "--";
  },
};
const TABLE_COLS_21 = {
  label: "毛重/KG",
  prop: "freightWeight",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
  align: "right",
  decimal: 2,
};
const TABLE_COLS_22 = {
  label: "体积/m³",
  prop: "freightVolume",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
  align: "right",
  decimal: 2,
};
const TABLE_COLS_23 = {
  label: "产品种类",
  prop: "productType",
  sortable: true,
  align: "center",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_24 = {
  label: "产品信息",
  prop: "inlandExportParam",
  sortable: true,
  showOverflowTooltip: true,
  customRow: true,
  minWidth: 100,
  basicType: "productSituation",
};
const TABLE_COLS_25 = {
  label: "箱型箱量",
  prop: "boxWeight",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
  align: "right",
};
const TABLE_COLS_26 = {
  label: "清关币别",
  prop: "reportCurrency",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_27 = {
  label: "客户单号",
  prop: "cusOrderNumber",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_28 = {
  label: "发货人",
  prop: "consignerCompany",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_29 = {
  label: "收货人",
  prop: "consigneeCompany",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_30 = {
  label: "通知人",
  prop: "notifierCompany",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_31 = {
  label: "接单时间",
  prop: "receiveTime",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_32 = {
  label: "航空/船公司",
  prop: "shipCompany",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_33 = {
  label: "海外代理",
  prop: "cabinProxyName",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_34 = {
  prop: "operatorName",
  label: "操作员",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_35 = {
  label: "业务员",
  prop: "salesmanName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_36 = {
  label: "业务助理",
  prop: "businessHandling",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_37 = {
  label: "文件员",
  prop: "fileMemberName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_38 = {
  label: "打回/作废",
  prop: "auditStatusName",
  sortable: true,
  minWidth: 120,
  align: "right",
  showOverflowTooltip: true,
};
const TABLE_COLS_39 = {
  label: "创建时间",
  prop: "createTime",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_40 = {
  label: "状态",
  prop: "operationOrderStatus",
  dotColor: true,
  sortable: true,
  basicType: "orderStatus",
  showOverflowTooltip: true,
  minWidth: 100,
  fixed: "right",
};
const TABLE_COLS_42 = {
  label: "贸易条款",
  prop: "tradeClause",
  basicType: "tradeClause",
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_43 = {
  label: "业务类型",
  prop: "orderBusinessType",
  basicType: "orderBusinessType",
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_44 = {
  label: "拖车方式",
  prop: "trailerMethodName",
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_45 = {
  label: "航名/船名",
  prop: "flightName",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_46 = {
  label: "航次/船次",
  prop: "voyageInfo",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_47 = {
  label: "ETD",
  prop: "sailOpenTime",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_48 = {
  label: "OBD",
  prop: "cabinOpenTime",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_49 = {
  label: "ETA",
  prop: "etaTime",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_50 = {
  label: "HBL No.",
  prop: "hblCode",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
// 其他
const TABLE_COLS_51 = {
  label: "备注",
  prop: "remark",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_52 = {
  prop: "customerOrderSn",
  label: "客户单号",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_53 = {
  prop: "wholeCabinetSn",
  label: "国内登记号",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_54 = {
  prop: "insured",
  label: "单独购买保险",
  sortable: true,
  align: "center",
  fontColor: true,
  showOverflowTooltip: true,
  minWidth: 130,
  // render: (r) => r.insured ? "是" : "否",
  basicType: "trueOrFalse",
};
const TABLE_COLS_55 = {
  label: "来源订单号",
  prop: "sourceNumber",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_56 = {
  label: "ATD",
  prop: "atdTime",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_57 = {
  label: "ATA",
  prop: "ataTime",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_154 = {
  label: "上门提货",
  prop: "pickUpHome",
  sortable: true,
  minWidth: 100,
  render: (r) => ["否", "是"][r.pickUpHome],
};
const TABLE_COLS_155 = {
  label: "报关方式",
  prop: "reportCustomsWay",
  basicType: "customsDeclarationType",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_156 = {
  label: "清关方式",
  prop: "customsClearanceType",
  basicType: "customsClearanceType",
  sortable: true,
  minWidth: 100,
};
const TABLE_COLS_157 = {
  label: "件数",
  prop: "realFreightNum",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 80,
  align: "center",
};
const TABLE_COLS_158 = {
  ...TABLE_COLS_21,
  prop: "realFreightWeight",
};
const TABLE_COLS_159 = {
  ...TABLE_COLS_22,
  prop: "realFreightVolume",
};
const TABLE_COLS_160 = {
  ...TABLE_COLS_25,
  prop: "boxModelSize",
};
const TABLE_COLS_161 = {
  ...TABLE_COLS_31,
  render: (r) => r.createTime,
};
const TABLE_COLS_162 = {
  ...TABLE_COLS_33,
  prop: "overseasAgencyName",
};
const TABLE_COLS_163 = {
  ...TABLE_COLS_36,
  prop: "salesAssistantName",
};
const TABLE_COLS_164 = {
  label: "运输方式",
  prop: "transportMode",
  minWidth: 100,
  sortable: true,
  basicType: "transportMode",
  showOverflowTooltip: true,
};
const TABLE_COLS_165 = {
  label: "拖车方式",
  prop: "containerTrailer",
  sortable: true,
  basicType: "containerTrailerType",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_166 = {
  ...TABLE_COLS_45,
  prop: "shipName",
};
const TABLE_COLS_167 = {
  ...TABLE_COLS_46,
  prop: "shipSecond",
};
const TABLE_COLS_168 = {
  label: "件数",
  prop: "quantity",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 80,
  align: "center",
};
const TABLE_COLS_169 = {
  ...TABLE_COLS_21,
  prop: "totalWeight",
};
const TABLE_COLS_170 = {
  ...TABLE_COLS_22,
  prop: "totalVolume",
};
const TABLE_COLS_171 = {
  ...TABLE_COLS_26,
  prop: "declareCurrencyName",
};
const TABLE_COLS_172 = {
  ...TABLE_COLS_50,
  prop: "hblNo",
};
const TABLE_COLS_173 = {
  ...TABLE_COLS_36,
  prop: "salesAssistantName",
};
const TABLE_COLS_174 = {
  label: "操作备注",
  prop: "operationRemark",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
// 电商
const TABLE_COLS_175 = {
  label: "头程运输方式",
  prop: "headTransportModeName",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_176 = {
  label: "尾程运输方式",
  prop: "outWarehouseWayName",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_177 = {
  prop: "businessOwnershipName",
  label: "所属公司",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_178 = {
  ...TABLE_COLS_10,
  prop: "startPortCode",
  render: (r) => r.startPortCode || r.startPortName || "--",
};
const TABLE_COLS_179 = {
  ...TABLE_COLS_11,
  prop: "endPortCode",
  render: (r) => r.endPortCode || r.endPortName || "--",
};
const TABLE_COLS_180 = {
  prop: "productAttributeList",
  label: "产品属性",
  minWidth: 110,
  showOverflowTooltip: true,
  basicType: "orderProductAttribute",
};
const TABLE_COLS_991 = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true,
  minWidth: 132,
};
// const TABLE_COLS_21 = {
//   label: "单证",
//   prop: "Uncharted_5",
//   sortable: true,
//   showOverflowTooltip: true,
//   minWidth: 80
// }
// const TABLE_COLS_28 = {
//   label: "计重重量 (KG)",
//   prop: "realFreightWeight",
//   sortable: true,
//   showOverflowTooltip: true,
//   minWidth: 140,
//   align: 'right'
// }
// const TABLE_COLS_29 = {
//   label: "计费体积 (CBM)",
//   prop: "realFreightVolume",
//   sortable: true,
//   showOverflowTooltip: true,
//   minWidth: 150,
//   align: 'right'
// }

// 列表
const TABLE_COLS = {
  1: TABLE_COLS_1,
  2: TABLE_COLS_2,
  3: TABLE_COLS_3,
  4: TABLE_COLS_4,
  5: TABLE_COLS_5,
  6: TABLE_COLS_6,
  7: TABLE_COLS_7,
  8: TABLE_COLS_8,
  9: TABLE_COLS_9,
  10: TABLE_COLS_10,
  11: TABLE_COLS_11,
  12: TABLE_COLS_12,
  13: TABLE_COLS_13,
  14: TABLE_COLS_14,
  15: TABLE_COLS_15,
  16: TABLE_COLS_16,
  17: TABLE_COLS_17,
  18: TABLE_COLS_18,
  // 19: TABLE_COLS_19,
  // 20: TABLE_COLS_20,
  // 21: TABLE_COLS_21,
  // 22: TABLE_COLS_22,
  // 23: TABLE_COLS_23,
  // 24: TABLE_COLS_24,
  // 25: TABLE_COLS_25,
  // 26: TABLE_COLS_26,
  27: TABLE_COLS_27,
  28: TABLE_COLS_28,
  29: TABLE_COLS_29,
  30: TABLE_COLS_30,
  31: TABLE_COLS_31,
  32: TABLE_COLS_32,
  33: TABLE_COLS_33,
  34: TABLE_COLS_34,
  35: TABLE_COLS_35,
  36: TABLE_COLS_36,
  37: TABLE_COLS_37,
  38: TABLE_COLS_38,
  39: TABLE_COLS_39,
  40: TABLE_COLS_40,
  42: TABLE_COLS_42,
  43: TABLE_COLS_43,
  44: TABLE_COLS_44,
  45: TABLE_COLS_45,
  46: TABLE_COLS_46,
  T47: TABLE_COLS_47,
  48: TABLE_COLS_48,
  49: TABLE_COLS_49,
  50: TABLE_COLS_50,
  51: TABLE_COLS_51,
  52: TABLE_COLS_52,
  53: TABLE_COLS_53,
  54: TABLE_COLS_54,
  55: TABLE_COLS_55,
  56: TABLE_COLS_56,
  57: TABLE_COLS_57,
  154: TABLE_COLS_154,
  155: TABLE_COLS_155,
  156: TABLE_COLS_156,
  157: TABLE_COLS_157,
  158: TABLE_COLS_158,
  159: TABLE_COLS_159,
  160: TABLE_COLS_160,
  161: TABLE_COLS_161,
  162: TABLE_COLS_162,
  163: TABLE_COLS_163,
  164: TABLE_COLS_164,
  165: TABLE_COLS_165,
  166: TABLE_COLS_166,
  167: TABLE_COLS_167,
  168: TABLE_COLS_168,
  169: TABLE_COLS_169,
  170: TABLE_COLS_170,
  171: TABLE_COLS_171,
  172: TABLE_COLS_172,
  173: TABLE_COLS_173,
  T174: TABLE_COLS_174,
  T177: TABLE_COLS_177,
  T178: TABLE_COLS_178,
  T179: TABLE_COLS_179,
  T180: TABLE_COLS_180,

  T991: TABLE_COLS_991,
  175: TABLE_COLS_175,
  176: TABLE_COLS_176,
};

//海运电商
export const seaEcommerceModel = (vPage) => {
  return {
    search: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  ...[
                    "S39",
                    "S640",
                    "S3",
                    "S1",
                    "S4",
                    "S5",
                    "S5_1",
                    ...(vPage === "ecFlow" ? ["S648"] : []),
                    "S8",
                    "S9",
                    "S10",
                    "S11",
                    "S13",
                    "S14",
                    "S15",
                    "S641",
                    "S19",
                    "S20",
                    "S21",
                    "S23",
                    "S41",
                    "S645",
                    "S646",
                    "S647",
                    "S42",
                  ].map((i) => {
                    if (i === "S8") {
                      return {
                        ...SEARCH_COL_OBJ[i],
                        expandValFilter: ["2", "4", "6"],
                      };
                    }
                    // switch (i) {
                    //   case "S15":
                    //     return {
                    //       ...SEARCH_COL_OBJ[i],
                    //       ...httpWarehousePublicSelect({
                    //         itemId: "parentId",
                    //         flagAvailable: "y",
                    // 				dataStatusIn: "1,2"
                    //       }),
                    //     };
                    //   default:
                    return SEARCH_COL_OBJ[i];
                    // }
                  }),
                ],
              },
            ],
          },
        ],
      },
    ],
    lists: [
      TABLE_COLS_INDEX,
      TABLE_COL_SELECTION,
      ...[
        1,
        2,
        3,
        "T180",
        53,
        4,
        5,
        7,
        175,
        176,
        54,
        9,
        10,
        11,
        13,
        14,
        15,
        154,
        17,
        155,
        156,
        56,
        57,
        157,
        158,
        159,
        160,
        27,
        // 28,
        // 29,
        // 30,
        161,
        32,
        162,
        34,
        35,
        163,
        37,
        55,
        39,
        "T177",
        40,
        "T991",
      ].map((i) => TABLE_COLS[i]),
    ],
  };
};
//海运传统
export const seaTraditionModel = (vPage) => {
  return {
    search: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  ...[
                    "S640",
                    "S3",
                    "S1",
                    "S4",
                    "S31",
                    "S9",
                    "S10",
                    ...(vPage === "traditionFlow" ? ["S648"] : []),
                    "S8",
                    "S13",
                    "S14",
                    "S21",
                    "S11",
                    "S23",
                    "S20",
                    "S28",
                    "S646",
                    "S19",
                    "S647",
                  ].map((i) => {
                    if (i == "S8") {
                      return {
                        ...SEARCH_COL_OBJ[i],
                        expandValFilter: ["4", "6"],
                      };
                    }
                    return SEARCH_COL_OBJ[i];
                  }),
                ],
              },
            ],
          },
        ],
      },
    ],
    lists: [
      TABLE_COLS_INDEX,
      TABLE_COL_SELECTION,
      ...[
        1,
        2,
        3,
        "T174",
        53,
        4,
        52,
        5,
        42,
        164,
        43,
        7,
        10,
        11,
        160,
        9,
        15,
        17,
        16,
        165,
        18,
        162,
        32,
        166,
        167,
        "T47",
        48,
        49,
        168,
        169,
        170,
        171,
        172,
        28,
        29,
        30,
        35,
        173,
        34,
        37,
        161,
        55,
        39,
        "T177",
        40,
        "T991",
      ].map((i) => TABLE_COLS[i]),
    ],
  };
};
//空运电商
const airEcommerce = {
  search: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...[
                  "S1",
                  "S640",
                  "S3",
                  "S39",
                  "S4",
                  "S8",
                  "S9",
                  "S11",
                  "S13",
                  "S14",
                  "S15",
                  "S641",
                  "S20",
                  "S21",
                  "S23",
                  "S41",
                ].map((i) => {
                  switch (i) {
                    case "S15":
                      return {
                        ...SEARCH_COL_OBJ[i],
                        ...httpWarehousePublicSelect({
                          itemId: "parentId",
                          flagAvailable: "y",
                        }),
                      };
                    default:
                      return SEARCH_COL_OBJ[i];
                  }
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
  lists: [
    TABLE_COLS_INDEX,
    TABLE_COL_SELECTION,
    ...[
      1,
      2,
      3,
      53,
      4,
      7,
      175,
      176,
      54,
      9,
      10,
      11,
      13,
      14,
      15,
      154,
      155,
      156,
      157,
      158,
      159,
      160,
      27,
      28,
      29,
      30,
      161,
      32,
      162,
      34,
      35,
      163,
      37,
      55,
      39,
      40,
      "T991",
    ].map((i) => TABLE_COLS[i]),
  ],
};
//空运传统
const airTradition = {
  search: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...[
                  "S640",
                  "S3",
                  "S1",
                  "S4",
                  "S8",
                  "S9",
                  "S10",
                  "S11",
                  "S13",
                  "S14",
                  "S21",
                  "S23",
                  "S31",
                  "S28",
                  "S20",
                  "S646",
                  "S647",
                ].map((i) => {
                  if (i == "S8") {
                    return {
                      ...SEARCH_COL_OBJ[i],
                      expandValFilter: ["4", "6"],
                    };
                  }
                  return SEARCH_COL_OBJ[i];
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
  lists: [
    TABLE_COLS_INDEX,
    TABLE_COL_SELECTION,
    ...[
      1,
      2,
      3,
      "T174",
      53,
      4,
      52,
      5,
      42,
      164,
      43,
      7,
      "T178",
      "T179",
      160,
      9,
      15,
      17,
      16,
      165,
      18,
      162,
      32,
      166,
      167,
      "T47",
      48,
      49,
      168,
      169,
      170,
      171,
      172,
      28,
      29,
      30,
      35,
      173,
      34,
      37,
      161,
      55,
      39,
      "T177",
      40,
      "T991",
    ].map((i) => TABLE_COLS[i]),
  ],
};

//其他操作单
export const otherOperateModel = {
  search: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...[
                  "S1",
                  "S640",
                  "S3",
                  "S4",
                  "S9",
                  "S10",
                  "S20",
                  "S36",
                  "S13",
                  "S14",
                  "S8",
                  "S31",
                  "S23",
                  "S646",
                ].map((i) => SEARCH_COL_OBJ[i]),
              ],
            },
          ],
        },
      ],
    },
  ],
  lists: [
    TABLE_COLS_INDEX,
    TABLE_COL_SELECTION,
    ...[
      1,
      2,
      3,
      "T174",
      43,
      53,
      52,
      5,
      10,
      11,
      7,
      161,
      16,
      168,
      169,
      170,
      28,
      29,
      30,
      35,
      163,
      34,
      37,
      39,
      "T177",
      40,
      "T991",
    ].map((i) => TABLE_COLS[i]),
  ],
};

export { airEcommerce, airTradition };
