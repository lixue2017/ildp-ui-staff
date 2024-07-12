import { getUserList, bookingAgent } from "@/api/common";
import { getContactsPublicList } from "@/api/publicInterface/index.js";
import {
  httpCustomerSelect,
  httpUserSelect,
  httpPortPublicSelect,
  httpRoleDeptUserSelect,
} from "@/comModel/httpSelect";
import { getportList2 } from "@/api/operationalData/index";
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
  id: "customerName",
  label: "委托人：",
  type: "autocomplete",
  searchParamName: "companyNameCn",
  httpRequest: getUserList,
  defaultProp: {
    value: "Id",
    label: "companyNameCn",
  },
};
const SEARCH_COL_3 = {
  id: "orderNum",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
  maxlength: 1850,
  type: "text",
  // minRows: 1,
  // maxRows: 1,
  // zkRows: 3,
  // sqRows: 1,
  // showWordLimit: false,
  // residueCol: 2,
};
const SEARCH_COL_4 = {
  id: "salesmanName",
  label: "业务员：",
  ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
  selectLabelKey: "salesman",
};
const SEARCH_COL_5 = {
  id: "tradeClauseSearch",
  label: "贸易条款：",
  placeholder: "贸易条款（多选）",
  type: "select",
  multiple: true,
  basicType: "tradeClause",
};
const SEARCH_COL_6 = {
  id: "countryId",
  label: "目的国：",
  type: "autocomplete",
  category: "country",
  defaultProp: {
    value: "id",
    label: "twoCode,nameCn",
  },
};
const SEARCH_COL_7 = {
  id: "freightType",
  label: "装箱方式：",
  placeholder: "装箱方式",
  type: "select",
  basicType: "freightType",
};

const SEARCH_COL_8 = {
  id: "statusSearch",
  label: "状态：",
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "orderStatus",
};

const SEARCH_COL_9 = {
  id: "transportModeSearch",
  label: "运输方式：",
  placeholder: "运输方式(多选)",
  type: "select",
  multiple: true,
  basicType: "TOTransportMode",
};

const SEARCH_COL_10 = {
  id: "orderBusinessTypeSearch",
  label: "业务类型：",
  placeholder: "请选择",
  type: "select",
  // multiple: true,
  basicType: "orderBusinessType",
  hideList: [2, 3, 4, 5],
};

const SEARCH_COL_11 = {
  id: "portOfLoadingId",
  label: "起运港：",
  type: "autocomplete",
  searchParamName: "search",
  // httpRequest: (params) => getportList2({ ...params, portTypes: "0,1,2,3" }),
  httpRequest: (params) => getportList2({ ...params, portTypes: "3" }),
  defaultProp: {
    value: "id",
    label: "code,nameCn",
  },
};

const SEARCH_COL_12 = {
  id: "destinationPortId",
  label: "目的港：",
  placeholder: "请选择目的港",
  type: "autocomplete",
  searchParamName: "search",
  // httpRequest: (params) => getportList2({ ...params, portTypes: "0,1,2,3" }),
  httpRequest: (params) => getportList2({ ...params, portTypes: "3" }),
  defaultProp: {
    value: "id",
    label: "code,nameCn",
  },
};
const SEARCH_COL_13 = {
  id: "shipperId",
  label: "发货人：",
  type: "autocomplete",
  searchParamName: "orderSearch",
  httpRequest: (params) => getContactsPublicList({ ...params, typeList: 1 }),
  getCustomData: (item) => {
    return {
      key: item.id,
      label: `${item.company}`,
      value: item.id,
      title: `${item.company}`,
      subtitle: `${item.address}`,
    };
  },
};
const SEARCH_COL_14 = {
  id: "consigneeId",
  label: "收货人：",
  type: "autocomplete",
  searchParamName: "orderSearch",
  httpRequest: (params) => getContactsPublicList({ ...params, typeList: 0 }),
  getCustomData: (item) => {
    return {
      key: item.id,
      label: `${item.company}`,
      value: item.id,
      title: `${item.company}`,
      subtitle: `${item.address}`,
    };
  },
};
const SEARCH_COL_15 = {
  id: "notifierId",
  label: "通知人：",
  type: "autocomplete",
  searchParamName: "orderSearch",
  httpRequest: (params) =>
    getContactsPublicList({ ...params, typeList: "0,1" }),
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
const SEARCH_COL_16 = {
  id: "trailerMode",
  label: "拖车方式：",
  placeholder: "拖车方式",
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
const SEARCH_COL_17 = {
  id: "reportCustomsWays",
  label: "报关方式：",
  placeholder: "报关方式",
  type: "select",
  // multiple: true,
  basicType: "customsDeclarationType",
};
const SEARCH_COL_18 = {
  id: "xx_search_18",
  label: "SONO号：",
  placeholder: "SONO号",
  type: "text",
};
const SEARCH_COL_19 = {
  id: "xx_search_19",
  label: "箱号：",
  placeholder: "箱号",
  type: "text",
};
const SEARCH_COL_20 = {
  id: "xx_search_20",
  label: "MBL号：",
  placeholder: "MBL号",
  type: "text",
};
const SEARCH_COL_21 = {
  id: "reportCurrencyId",
  label: "清关币别：",
  placeholder: "清关币别",
  type: "autocomplete",
  category: "currency",
};
const SEARCH_COL_22 = {
  id: "xx_search_22",
  label: "订舱代理：",
  placeholder: "订舱代理",
  type: "autocomplete",
  defaultKey: "id",
  httpRequest: bookingAgent,
  defaultProp: {
    value: "shortName",
    label: "shortName",
  },
};
const SEARCH_COL_23 = {
  id: "xx_search_23",
  label: "船公司：",
  placeholder: "船公司",
  ...httpCustomerSelect(),
};
const SEARCH_COL_24 = {
  id: "xx_search_24",
  label: "海外代理：",
  placeholder: "海外代理",
  ...httpCustomerSelect({ clientIdentity: 0 }),
};
const SEARCH_COL_25 = {
  id: "salesmanZl",
  label: "业务助理：",
  placeholder: "业务助理",
  ...httpUserSelect(),
};
const SEARCH_COL_26 = {
  id: "operator",
  label: "操作员：",
  placeholder: "操作员",
  ...httpUserSelect(),
};
const SEARCH_COL_27 = {
  id: "fileMember",
  label: "文件员：",
  placeholder: "文件员",
  ...httpUserSelect(),
};
// 电商头程
const SEARCH_COL_28 = {
  id: "inlandExportParam",
  label: "产品情况：",
  placeholder: "产品情况",
  type: "select",
  basicType: "productSituation",
};
const SEARCH_COL_29 = {
  id: "xx_search_29",
  label: "国内交货仓：",
  placeholder: "国内交货仓",
  ...httpWarehousePublicSelect({ itemId: "parentId" }),
};
const SEARCH_COL_30 = {
  id: "xx_search_30",
  label: "目的仓编码：",
  placeholder: "目的仓编码",
  type: "text",
};
const SEARCH_COL_31 = {
  id: "xx_search_31",
  label: "客户单号：",
  placeholder: "客户单号",
  type: "text",
};
const SEARCH_COL_32 = {
  id: "xx_search_32",
  label: "清关方式：",
  placeholder: "清关方式",
  type: "select",
  basicType: "customsClearanceType",
};
const SEARCH_COL_33 = {
  id: "xx_search_33",
  label: "拼柜登记号：",
  placeholder: "拼柜登记号",
  type: "text",
};
// 空运
const SEARCH_COL_34 = {
  ...TABLE_COL_13,
  label: "航空公司：",
  placeholder: "航空公司",
};
const SEARCH_COL_35 = {
  ...SEARCH_COL_9,
  hideList: [0, 1, 2],
};
// 其他
const SEARCH_COL_36 = {
  ...SEARCH_COL_10,
  hideList: [0, 1],
};
//海空其
const SEARCH_COL_37 = {
  id: "customerOrderSn",
  label: "客户单号：",
  placeholder: "客户单号",
  type: "text",
};
//海空
const SEARCH_COL_38 = {
  id: "orderType",
  label: "订单类型：",
  placeholder: "订单类型",
  type: "select",
  options: [
    {
      value: 3,
      label: "海运",
    },
    {
      value: 4,
      label: "空运",
    },
  ],
};
const SEARCH_COL_39 = {
  ...SEARCH_COL_2,
  id: "customerId",
};

export const SEARCH_COL = {
  //电商订单有引用此数组(发货人与收货人)
  1: SEARCH_COL_1,
  2: SEARCH_COL_2,
  3: SEARCH_COL_3,
  4: SEARCH_COL_4,
  5: SEARCH_COL_5,
  6: SEARCH_COL_6,
  7: SEARCH_COL_7,
  8: SEARCH_COL_8,
  9: SEARCH_COL_9,
  10: SEARCH_COL_10,
  11: SEARCH_COL_11,
  12: SEARCH_COL_12,
  13: SEARCH_COL_13,
  14: SEARCH_COL_14,
  15: SEARCH_COL_15,
  16: SEARCH_COL_16,
  17: SEARCH_COL_17,
  18: SEARCH_COL_18,
  19: SEARCH_COL_19,
  20: SEARCH_COL_20,
  21: SEARCH_COL_21,
  22: SEARCH_COL_22,
  23: SEARCH_COL_23,
  24: SEARCH_COL_24,
  25: SEARCH_COL_25,
  26: SEARCH_COL_26,
  27: SEARCH_COL_27,
  28: SEARCH_COL_28,
  29: SEARCH_COL_29,
  30: SEARCH_COL_30,
  31: SEARCH_COL_31,
  32: SEARCH_COL_32,
  33: SEARCH_COL_33,
  34: SEARCH_COL_34,
  35: SEARCH_COL_35,
  36: SEARCH_COL_36,
  37: SEARCH_COL_37,
  38: SEARCH_COL_38,
  S39: SEARCH_COL_39,
};

const TABLE_COL_1 = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_2 = {
  label: "工作单号",
  prop: "orderNum",
  customRow: true,
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_3 = {
  label: "委托人",
  prop: "customerShortName",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_4 = {
  label: "订舱代理",
  prop: "xx_table_4",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  label: "贸易条款",
  prop: "tradeClause",
  basicType: "tradeClause",
  sortable: true,
  minWidth: 100,
};
const TABLE_COL_6 = {
  label: "目的国",
  prop: "countryName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  label: "起运港",
  prop: "portOfLoading",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  label: "目的港",
  prop: "destinationPort",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  label: "运输方式",
  prop: "transportMode",
  sortable: true,
  fontColor:true,
  basicType: "TOTransportMode",
  minWidth: 98,
};
const TABLE_COL_10 = {
  label: "业务类型",
  prop: "orderBusinessType",
  basicType: "orderBusinessType",
  sortable: true,
  fontColor:true,
  minWidth: 98,
};
const TABLE_COL_11 = {
  label: "箱型箱量",
  prop: "xx_table_11",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  label: "装箱方式",
  prop: "freightType",
  basicType: "freightType",
  sortable: true,
  minWidth: 98,
};
const TABLE_COL_13 = {
  label: "船公司",
  prop: "xx_table_13",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  label: "拖车方式",
  prop: "xx_table_14",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  label: "报关方式",
  prop: "xx_table_15",
  basicType: "customsDeclarationType",
  sortable: true,
  minWidth: 100,
};
const TABLE_COL_16 = {
  label: "海外代理",
  prop: "xx_table_16",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  label: "ETD",
  prop: "xx_table_17",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_18 = {
  label: "ETA",
  prop: "xx_table_18",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_19 = {
  label: "接单时间",
  sortable: true,
  prop: "xx_table_19",
  minWidth: 135,
};
const TABLE_COL_20 = {
  label: "上门提货",
  prop: "isHomeDelivery",
  customRow: true,
  fontColor:true,
  sortable: true,
  minWidth: 100,
};
const TABLE_COL_21 = {
  label: "SO NO号",
  sortable: true,
  prop: "xx_table_21",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_22 = {
  label: "MBL号",
  sortable: true,
  prop: "xx_table_22",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_23 = {
  label: "箱号",
  sortable: true,
  prop: "xx_table_23",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_24 = {
  label: "件数",
  sortable: true,
  prop: "xx_table_24",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_25 = {
  label: "毛重",
  sortable: true,
  prop: "totalWeight",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_26 = {
  label: "立方",
  sortable: true,
  prop: "totalVolume",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_27 = {
  label: "清关币别",
  sortable: true,
  prop: "xx_table_27",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_28 = {
  label: "发货人",
  prop: "consignerCompany",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_29 = {
  label: "收货人",
  prop: "consigneeCompany",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_30 = {
  label: "通知人",
  prop: "notifierCompany",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_31 = {
  label: "业务员",
  sortable: true,
  prop: "salesmanName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_32 = {
  label: "业务助理",
  sortable: true,
  prop: "xx_table_32",
  minWidth: 100,
};
const TABLE_COL_33 = {
  label: "操作员",
  sortable: true,
  prop: "xx_table_33",
  minWidth: 100,
};
const TABLE_COL_34 = {
  label: "文件员",
  sortable: true,
  prop: "xx_table_34",
  minWidth: 100,
};
const TABLE_COL_35 = {
  label: "创建时间",
  sortable: true,
  prop: "createTime",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COL_36 = {
  label: "打回/作废",
  prop: "backNum",
  sortable: true,
  minWidth: 120,
  align: "right",
  render: (row) => {
    Array.isArray(row.audit) ? row.audit[0]?.auditNum : row.audit.auditNum;
    return Array.isArray(row.audit)
      ? row.audit[0]?.auditNum
      : row.audit.auditNum;
  },
};
const TABLE_COL_37 = {
  label: "状态",
  prop: "orderStatus",
  sortable: true,
  customRow: true,
  minWidth: 86,
  basicType: "orderStatus",
  showOverflowTooltip: true,
  fixed: "right",
};
const TABLE_COL_38 = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true,
  columnMoreOperation: true,
  minWidth: 160,
};
// 其他订单
const TABLE_COL_39 = {
  label: "备注",
  prop: "remark",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
};
// 电商
const TABLE_COL_40 = {
  label: "国内交货仓",
  prop: "xx_table_40",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_41 = {
  label: "目的仓",
  prop: "receivingAddress",
  showOverflowTooltip: true,
  minWidth: 200,
  sortable: true,
  render: (row) => {
    return `${row.totalAddressCount || "--"}个：${
      (row.consigneeCodes && row.consigneeCodes.join("、")) || "--"
    }`;
  },
};
const TABLE_COL_42 = {
  label: "清关方式",
  prop: "customsClearanceType",
  showOverflowTooltip: true,
  sortable: true,
  labelWidth: "120px",
  basicType: "customsClearanceType",
};
const TABLE_COL_43 = {
  label: "拼柜登记号",
  prop: "xx_table_43",
  minWidth: 180,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_44 = {
  label: "产品种类",
  prop: "productCount",
  showOverflowTooltip: true,
  render: (row) => {
    return `${row.productCount || "--"}个`;
  },
};
const TABLE_COL_45 = {
  label: "产品信息",
  prop: "inlandExportParam",
  customRow: true,
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "productSituation",
  basicTypeVal: "inlandExportParam",
};
const TABLE_COL_46 = {
  label: "客户单号",
  prop: "customerOrderSn",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_47 = {
  label: "航空/船公司",
  prop: "xx_table_47",
  showOverflowTooltip: true,
};
const TABLE_COL_48 = {
  ...TABLE_COL_13,
  label: "航空公司",
};
const TABLE_COL_49 = {
  label: "件数",
  sortable: true,
  prop: "jian",
  minWidth: 80,
  decimal: 0,
  align: "right",
};
const TABLE_COL_50 = {
  label: "重量",
  sortable: true,
  prop: "zhong",
  minWidth: 80,
  decimal: 2,
  align: "right",
};
const TABLE_COL_51 = {
  label: "体积",
  sortable: true,
  prop: "ti",
  minWidth: 80,
  decimal: 2,
  align: "right",
};
const TABLE_COL_52 = {
  label: "柜型柜量",
  sortable: true,
  prop: "gui",
  minWidth: 98,
  showOverflowTooltip: true,
};
// 空运
const TABLE_COL_53 = {
  label: "起运国",
  prop: "startCountryName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_54 = {
  ...TABLE_COL_7, // 显示区分空运、海运
  render: (r) => [r.portOfLoading, r.startPortCode][r.orderType - 3] || "--",
};
const TABLE_COL_55 = {
  ...TABLE_COL_8, // 显示区分空运、海运
  render: (r) => [r.destinationPort, r.endPortCode][r.orderType - 3] || "--",
};

const TABLE_COL = {
  1: TABLE_COL_1,
  2: TABLE_COL_2,
  3: TABLE_COL_3,
  4: TABLE_COL_4,
  5: TABLE_COL_5,
  6: TABLE_COL_6,
  7: TABLE_COL_7,
  8: TABLE_COL_8,
  9: TABLE_COL_9,
  10: TABLE_COL_10,
  11: TABLE_COL_11,
  12: TABLE_COL_12,
  13: TABLE_COL_13,
  14: TABLE_COL_14,
  15: TABLE_COL_15,
  16: TABLE_COL_16,
  17: TABLE_COL_17,
  18: TABLE_COL_18,
  19: TABLE_COL_19,
  20: TABLE_COL_20,
  21: TABLE_COL_21,
  22: TABLE_COL_22,
  23: TABLE_COL_23,
  24: TABLE_COL_24,
  25: TABLE_COL_25,
  26: TABLE_COL_26,
  27: TABLE_COL_27,
  28: TABLE_COL_28,
  29: TABLE_COL_29,
  30: TABLE_COL_30,
  31: TABLE_COL_31,
  32: TABLE_COL_32,
  33: TABLE_COL_33,
  34: TABLE_COL_34,
  35: TABLE_COL_35,
  36: TABLE_COL_36,
  37: TABLE_COL_37,
  38: TABLE_COL_38,
  39: TABLE_COL_39,
  40: TABLE_COL_40,
  41: TABLE_COL_41,
  42: TABLE_COL_42,
  43: TABLE_COL_43,
  44: TABLE_COL_44,
  45: TABLE_COL_45,
  46: TABLE_COL_46,
  47: TABLE_COL_47,
  48: TABLE_COL_48,
  T49: TABLE_COL_49,
  T50: TABLE_COL_50,
  T51: TABLE_COL_51,
  T52: TABLE_COL_52,
  T53: TABLE_COL_53,
  T54: TABLE_COL_54,
  T55: TABLE_COL_55,
};

const allSearch = [1, 2, 3, 10, 4, 6, 7, 5, 8, 11, 12, 9, 13, 14, 37];
const allConfig = {
  search: {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  ...allSearch.map((i) => {
                    switch (i) {
                      case 8:
                        return {
                          ...SEARCH_COL[i],
                          expandValFilter: ["4", "6"],
                        };
                        case 10:
                          return {
                            ...SEARCH_COL[i],
                            hideList:[]
                          };
                      case 11:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("0,3"), //0-海运 1-陆运 2-铁路 3-空运 4-快递
                        };
                      case 12:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("0,3"),
                        };
                      default:
                        return SEARCH_COL[i];
                    }
                  }),
                  // ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map(i => (SEARCH_COL[i]))
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  lists: [
    ...[
      1,
      2,//工作单号
      3,//委托人
      5,//贸易条款
      "T53",//起运国
      6,//目的国
      46,//客户单号
      "T54",//起运港
      "T55",//目的港
      9,//运输方式
      10,//业务类型
      12,//装箱方式
      20,//上门提货
      28,//发货人
      29,//收货人
      30,//通知人
      31,//业务员
      35,//创建时间
      37,//状态
      38,
    ].map((i) => TABLE_COL[i]),
    // ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map(i => (TABLE_COL[i]))
  ],
};



const seaTransportSearch = [1, 2, 3, 10, 4, 6, 7, 5, 8, 11, 12, 9, 13, 14];
const seaTransport = {
  search: {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  ...seaTransportSearch.map((i) => {
                    switch (i) {
                      case 8:
                        return {
                          ...SEARCH_COL[i],
                          expandValFilter: ["4", "6"],
                        };

                      case 11:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("0"), //0-海运 1-陆运 2-铁路 3-空运 4-快递
                        };
                      case 12:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("0"),
                        };
                      default:
                        return SEARCH_COL[i];
                    }
                  }),
                  // ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map(i => (SEARCH_COL[i]))
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  lists: [
    ...[
      1,
      2,//工作单号
      3,//委托人
      5,//贸易条款
      "T53",//起运国
      6,//目的国
      46,//客户单号
      "T54",//起运港
      "T55",//目的港
      9,//运输方式
      10,//业务类型
      12,//装箱方式
      20,//上门提货
      28,//发货人
      29,//收货人
      30,//通知人
      31,//业务员
      35,//创建时间
      37,//状态
      38,
    ].map((i) => TABLE_COL[i]),
    // ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map(i => (TABLE_COL[i]))
  ],
};



const airTransportSearch = [1, 2, 3, 10, 4, 6, 7, 5, 8, 11, 12, 9, 13, 14];
const airTransport = {
  search: {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  ...airTransportSearch.map((i) => {
                    switch (i) {
                      case 8:
                        return {
                          ...SEARCH_COL[i],
                          expandValFilter: ["4", "6"],
                        };

                      case 11:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("3"), //0-海运 1-陆运 2-铁路 3-空运 4-快递
                        };
                      case 12:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("3"),
                        };
                      default:
                        return SEARCH_COL[i];
                    }
                  }),
                  // ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map(i => (SEARCH_COL[i]))
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  lists: [
    ...[
      1,
      2,//工作单号
      3,//委托人
      5,//贸易条款
      "T53",//起运国
      6,//目的国
      46,//客户单号
      "T54",//起运港
      "T55",//目的港
      9,//运输方式
      10,//业务类型
      12,//装箱方式
      20,//上门提货
      28,//发货人
      29,//收货人
      30,//通知人
      31,//业务员
      35,//创建时间
      37,//状态
      38,
    ].map((i) => TABLE_COL[i]),
    // ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map(i => (TABLE_COL[i]))
  ],
};

// const airTransportSearch = [1, 2, 3, 4, 5, 6, 8, 35, 10, 11, 12, 13, 14, 37];
// const airTransport = {
//   search: {
//     lists: [
//       {
//         className: "search-form-width",
//         fieldList: [
//           {
//             rows: [
//               {
//                 cols: [
//                   ...airTransportSearch.map((i) => {
//                     switch (i) {
//                       case 11:
//                         return {
//                           ...SEARCH_COL[i],
//                           ...httpPortPublicSelect("3"), //0-海运 1-陆运 2-铁路 3-空运 4-快递
//                         };
//                       case 12:
//                         return {
//                           ...SEARCH_COL[i],
//                           ...httpPortPublicSelect("3"),
//                         };
//                       default:
//                         return SEARCH_COL[i];
//                     }
//                   }),
//                   // ...[1, 2, 3, 4, 5, 6, 8, 35, 10, 11, 12, 34, 14, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27].map(i => (SEARCH_COL[i]))
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   lists: [
//     ...[
//       1,
//       2,
//       3,
//       5,
//       "T53",
//       6,
//       46,
//       7,
//       8,
//       9,
//       10,
//       20,
//       28,
//       29,
//       30,
//       31,
//       35,
//       36,
//       37,
//       38,
//     ].map((i) => TABLE_COL[i]),
//     // ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 48, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map(i => (TABLE_COL[i]))
//   ],
// };

const otherOrderSearch = [1, "S39", 3, 36, 4, 6, 7, 8, 11, 12, 13, 14];
const otherOrder = {
  search: {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  // ...[1, 2, 3, 4, 6, 11, 12, 8, 36, 13, 14, 25, 26, 27].map(i => {
                  ...otherOrderSearch.map((i) => {
                    switch (i) {
                      case 8:
                        return {
                          ...SEARCH_COL[i],
                          expandValFilter: ["6"],
                        };
                        case 10:
                          return {
                            ...SEARCH_COL[i],
                            hideList:[0,1]
                          };
                      case 11:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("0,3"), //其他订单取海运与空运
                        };
                      case 12:
                        return {
                          ...SEARCH_COL[i],
                          ...httpPortPublicSelect("0,3"),
                        };
                      default:
                        return SEARCH_COL[i];
                    }
                  }),
                  // ...[1, 2, 3, 4, 6, 11, 12, 8, 36, 13, 14, 25, 26, 27].map(i => (SEARCH_COL[i]))
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  lists: [
    ...[1, 2, 3, 10, 39, 46, 7, 8, 6,12, 20, 28, 29, 30, 31, 35, 37, 38,].map(
      (i) => {
        switch (i) {
          case 3:
            return {
              ...TABLE_COL[i],
              prop: "customerName",
            };
          default:
            return TABLE_COL[i];
        }
      }
    ),
    // ...[1, 2, 10, 39, 7, 8, 6, 19, 20, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map(i => (TABLE_COL[i]))
  ],
};

const eCommerceSearch = [
  1, 2, 3, 4, 9, 6, 28, 8, 12, 29, 30, 31, 17, 32, 25, 26, 18, 19, 20, 33, 22,
  23, 24,
];
const eCommerce = {
  search: {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: [...eCommerceSearch.map((i) => SEARCH_COL[i])],
              },
            ],
          },
        ],
      },
    ],
  },
  lists: [
    ...[
      1, 2, 3, 6, 9, 7, 40, 41, 15, 42, 12, 20, 21, 22, 23, 43, 24, 25, 26, 44,
      45, 11, 27, 46, 28, 29, 30, 4, 47, 16, 31, 32, 33, 34, 19, 35, 36, 37, 38,
    ].map((i) => TABLE_COL[i]),
  ],
};

const FORM_ROW_201 = (obj) => {
  const { isSee = false } = obj || {};
  return {
    rows: [
      {
        cols: [
          {
            span: 24,
            labelWidth: "58px",
            label: "订单备注",
            type: "slot",
            className: "custom-remark",
          },
          {
            span: 24,
            id: "remark",
            labelWidth: "0px",
            placeholder: isSee ? "--" : "请输入备注信息",
            type: "textarea",
            disable: isSee,
            maxlength: 2000,
          },
        ],
      },
    ],
  };
};

export { allConfig,seaTransport, airTransport, otherOrder, eCommerce, FORM_ROW_201 };
