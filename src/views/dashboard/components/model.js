import {
  httpLogisticsCustomerSelect,
  httpByYeWuSelect,
  httpAccountSelect,
  httpCurrencySelect,
} from "@/comModel/httpSelect.js";

const headConfig = [
  {
    className: "customer-class",
    span: 6,
    list: [
      {
        title: "客户数",
        numOf30Title: "近30天客户：",
        totalProp: "customerNum",
        weekGrowthProp: "customerWeekGrowth",
        monthGrowthProp: "customerMonthGrowth",
        numOf30Prop: "customerNumOf30",
      },
    ],
  },
  {
    className: "card-panel-order",
    span: 12,
    list: [
      {
        title: "电商订单",
        numOf30Title: "近30天：",
        totalProp: "dsOrderNum",
        weekGrowthProp: "dsOrderWeekGrowth",
        monthGrowthProp: "dsOrderMonthGrowth",
        numOf30Prop: "dsOrderNumOf30",
      },
      {
        title: "传统订单",
        numOf30Title: "近30天：",
        totalProp: "ctOrderNum",
        weekGrowthProp: "ctOrderWeekGrowth",
        monthGrowthProp: "ctOrderMonthGrowth",
        numOf30Prop: "ctOrderNumOf30",
      },
      {
        title: "其他订单",
        numOf30Title: "近30天：",
        totalProp: "qtOrderNum",
        weekGrowthProp: "qtOrderWeekGrowth",
        monthGrowthProp: "qtOrderMonthGrowth",
        numOf30Prop: "qtOrderNumOf30",
      },
    ],
  },
  {
    className: "hw-class",
    span: 6,
    list: [
      {
        title: "海外订单",
        numOf30Title: "近30天订单：",
        totalProp: "hwOrderNum",
        weekGrowthProp: "hwOrderWeekGrowth",
        monthGrowthProp: "hwOrderMonthGrowth",
        numOf30Prop: "hwOrderNumOf30",
      },
    ],
  },
];

// 操作员头部
const operateHeadConfig = [
  {
    title: "国内操作单近7天新增",
    className: "gn-class",
    span: 9,
    list: [
      {
        title: "电商订单",
        orderType: 2,
      },
      {
        title: "传统海运",
        orderType: 3,
      },
      {
        title: "传统空运",
        orderType: 4,
      },
      {
        title: "其他订单",
        orderType: 6,
      },
    ],
  },
  {
    title: "海外操作单近7天新增",
    className: "hw-class",
    span: 15,
    list: [
      {
        title: "第三方入库",
        orderType: 20,
      },
      {
        title: "WMS退仓入库",
        orderType: 25,
      },
      {
        title: "一件代发出库",
        orderType: 35,
      },
      {
        title: "整箱出库",
        orderType: 30,
      },
      {
        title: "海外清关",
        orderType: 50,
      },
      {
        title: "海外提派",
        orderType: 45,
      },
      {
        title: "仓租订单",
        orderType: 60,
      },
    ],
  },
];

const goodsType = [
  {
    value: "num",
    propTotal: "totalNum",
    prop: "value",
    label: "票数",
    unit: "件",
  },
  {
    value: "volume",
    propTotal: "totalVolume",
    prop: "value",
    label: "方数",
    unit: "CBM",
    decimals: 2,
  },
  {
    value: "weight",
    propTotal: "totalWeight",
    prop: "value",
    label: "重量",
    unit: "KG",
    decimals: 2,
  },
];

const processType = [
  {
    value: 1,
    label: "电商",
  },
  {
    value: 2,
    label: "传统",
  },
  {
    value: 3,
    label: "其他",
  },
];

const orderTypeTotal = [
  {
    value: 1,
    showProp: "traditionCard",
    prop: "traditionSubTotal",
    label: "传统订单合计：",
  },
  {
    value: 2,
    showProp: "ecCard",
    prop: "ecSubTotal",
    label: "电商订单合计：",
  },
];

// 日常业务（我的）
const dayBusinessMe = (createId) => [
  {
    title: "我的报销",
    prop: "wdbxZs",
    route: "UserCostExpenses",
    items: [
      {
        prop: "grbxCg",
        label: "个人报销(草稿)",
        params: {
          status: ["0"],
        },
      },
      {
        prop: "grbxYws",
        label: "个人报销(业务审)",
        params: {
          status: ["1"],
        },
      },
      {
        prop: "grbxCws",
        label: "个人报销(财务审)",
        params: {
          status: ["2", "3", "4", "5"],
        },
      },
    ],
  },
  {
    title: "我的应收对账单",
    prop: "wdysdzdZs",
    route: "CollectionBillManage",
    params: {
      createId,
    },
    items: [
      {
        prop: "ysdzdCg",
        label: "应收对账单(草稿)",
        params: {
          statusList: ["0"],
          createId,
        },
      },
      {
        prop: "ysdzdYws",
        label: "应收对账单(业务审)",
        params: {
          statusList: ["1"],
          createId,
        },
      },
      {
        prop: "ysdzdCws",
        label: "应收对账单(财务审)",
        params: {
          statusList: ["20"],
          createId,
        },
      },
    ],
  },
  {
    title: "我的应付对账单",
    prop: "wdyfdzdZs",
    route: "PayMentBillManage",
    params: {
      createId,
    },
    items: [
      {
        prop: "yfdzdCg",
        label: "应付对账单(草稿)",
        params: {
          statusList: ["0"],
          createId,
        },
      },
      {
        prop: "yfdzdYws",
        label: "应付对账单(业务审)",
        params: {
          statusList: ["1"],
          createId,
        },
      },
      {
        prop: "yfdzdCws",
        label: "应付对账单(财务审)",
        params: {
          statusList: ["20"],
          createId,
        },
      },
    ],
  },
];
// 日常业务（待我审）
const dayBusinessWaitMe = (taskBy) => [
  {
    title: "个人报销",
    route: "ReviewCostExpenses",
    items: [
      {
        prop: "grbxYws",
        label: "个人报销(业务审)",
      },
    ],
  },
  {
    title: "应收对账单",
    route: "CustomerBill",
    items: [
      {
        prop: "ysdzdYwqr",
        label: "应收对账单(业务确认)",
      },
    ],
  },
  {
    title: "应付对账单",
    route: "ConfirmedBill",
    items: [
      {
        prop: "yfdzdYws",
        label: "应付对账单(业务审)",
        params: {
          taskBy,
        },
      },
      // {
      //   prop: "yfdzdCwfh",
      //   label: "应付对账单(财务复核)",
      //   params: {
      //     taskBy
      //   }
      // }
    ],
  },
];
// 订单待办
const orderQuantity = [
  {
    title: "第三方订单",
    route: "ThirdPartyForecast",
    items: [
      {
        prop: "dsfNum",
        label: "总票数",
      },
    ],
  },
  {
    title: "FBA出库",
    route: "FbaOrder",
    items: [
      {
        prop: "fbaNum",
        label: "总票数",
      },
    ],
  },
  {
    title: "一件代发",
    items: [
      {
        prop: "yjdfNum",
        label: "总票数",
      },
    ],
  },
  {
    title: "WMS退仓",
    items: [
      {
        prop: "wmsNum",
        label: "总票数",
      },
    ],
  },
];

const gatherCardConfig = (checkId) => ({
  orderQuantity,
  dayBusinessMe: {
    columns: dayBusinessMe(checkId),
    title: "日常业务(我的)",
    showTitleValue: true,
  },
  dayBusinessWaitMe: {
    columns: dayBusinessWaitMe(checkId),
    title: "日常业务(待我审)",
  },
});

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COLS_1 = {
  prop: "msgTitle",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "msgContent",
  minWidth: 240,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "pushTime",
  width: 150,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "operation",
  width: 80,
  showOverflowTooltip: true,
  columnOperation: true,
  fixed: "right",
};
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
];

const TABLE_COLS_5 = {
  prop: "name",
  minWidth: 100,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COLS_6 = {
  prop: "dyejd",
  label: "待业务接单",
  minWidth: 86,
  customRow: true,
  config: {
    paramProp: "DYWJD",
    status: 1,
  },
};

const orderPending = (type) =>
  [
    {
      width: "52%",
      lists: [
        {
          ...TABLE_COLS_5,
          label: "头程订单",
        },
        TABLE_COLS_6,
        {
          prop: "dyetj",
          label: "待业务提交",
          minWidth: 86,
          customRow: true,
          config: {
            paramProp: "DYWTJ",
          },
        },
        {
          prop: "dczjd",
          label: "待操作接单",
          minWidth: 86,
          customRow: true,
          config: {
            paramProp: "DCZJD",
          },
        },
      ],
    },
    {
      width: "48%",
      lists: [
        {
          ...TABLE_COLS_5,
          label: "海外订单",
        },
        TABLE_COLS_6,
        {
          prop: "orderTotal",
          label: "订单总数",
          minWidth: 86,
          customRow: true,
        },
      ],
    },
  ][type];

const financialProcess = (type) => ({
  lists: [
    {
      prop: "name",
      label: ["收款", "付款"][type],
      minWidth: 100,
      showOverflowTooltip: true,
      fixed: "left",
    },
    {
      prop: "ywsq",
      label: "业务申请",
      minWidth: 86,
      customRow: true,
      config: {
        routeProp: "ywsqRoute",
        paramProp: "ywsqParams",
      },
    },
    {
      prop: "fybx",
      label: "费用报销",
      minWidth: 86,
      customRow: true,
      config: {
        routeProp: "fybxRoute",
        paramProp: "fybxParams",
      },
    },
  ],
});

const dualTableConfig = {
  orderPending: {
    title: "订单待办",
    columnConfig: orderPending,
  },
  financialProcess: {
    title: "财务流程",
    columnConfig: financialProcess,
  },
};

const SEARCH_COLS_1 = {
  id: "customerIdFromBs",
  placeholder: "BS公司",
  ...httpLogisticsCustomerSelect(),
  selectLabelKey: "customerName",
  size: "mini",
  className: "customer-width",
};
const SEARCH_COLS_2 = {
  id: "dealingsCompanyId",
  placeholder: "客户",
  ...httpByYeWuSelect(),
  size: "mini",
  className: "dealings-width",
};
const SEARCH_COLS_3 = {
  id: "currencyId",
  placeholder: "币别",
  ...httpCurrencySelect,
  noPaging: true,
  isAutoInitRequest: true,
  defaultProp: {
    value: "id",
    label: "code",
  },
  size: "mini",
  className: "currency-width",
};
const SEARCH_COLS_4 = {
  id: "selectDate",
  type: "daterange",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  },
  className: "date-width",
};
const SEARCH_COLS_5 = {
  id: "field",
  type: "radio",
  options: goodsType,
  className: "radio-width",
};
const SEARCH_COL_6 = {
  id: "accountId",
  placeholder: "堡森账号",
  size: "mini",
  ...httpAccountSelect({ type: "0" }),
  type: "slot",
  className: "customer-width",
};

const SEARCH_COLS_7 = {
  id: "type",
  type: "radio",
  options: processType,
  className: "radio-width",
};

const goodsInfo = [SEARCH_COLS_2, SEARCH_COLS_4, SEARCH_COLS_5];

const searchColumns = {
  goodsInfo,
  dualTable: [SEARCH_COLS_1],
  goodsTrend: [SEARCH_COLS_2, SEARCH_COLS_5],
  receiptPayment: [SEARCH_COLS_3, SEARCH_COLS_1, SEARCH_COL_6],
  uncollectedBill: [SEARCH_COLS_1, SEARCH_COLS_2],
  processList: [SEARCH_COLS_7],
};

const searchConfig = (type) => ({
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns[type],
            },
          ],
        },
      ],
    },
  ],
});

// 操作待办结算
const operatePendingConfig = {
  1: {
    title: "双向账单",
    settlementType: 1,
    list: [
      {
        prop: "dgl",
        label: "待关联",
        className: "settlement-item-red",
        route: "/settlementManagement/statementManage/associated",
      },
      {
        prop: "dqr",
        label: "待确认",
        className: "settlement-item-red",
        route: "/settlementManagement/statementManage/confirmed",
      },
      {
        prop: "ydh",
        label: "已打回",
        className: "settlement-item-red",
        route: "/settlementManagement/statementManage/associated",
      },
      {
        prop: "ddd",
        label: "待对账",
        className: "settlement-item-info",
      },
      {
        prop: "dtj",
        label: "待提交",
        className: "settlement-item-info",
      },
      {
        prop: "dqrdzd",
        label: "待确认(对账单)",
        className: "settlement-item-info",
      },
      {
        prop: "dhx",
        label: "待核销",
        className: "settlement-item-info",
      },
    ],
  },
  2: {
    title: "付款对账单",
    settlementType: 2,
    list: [
      {
        prop: "ddd",
        label: "待对账",
        className: "settlement-item-red",
        route: "/settlementManagement/statementManage/paymentBillDetailed",
      },
      {
        prop: "dtj",
        label: "待提交",
        className: "settlement-item-blue",
        route: "/settlementManagement/statementManage/payMentBillManage",
        params: {
          statusList: ["0"],
        },
      },
      {
        prop: "dqr",
        label: "待确认",
        className: "settlement-item-info",
      },
      {
        prop: "dfh",
        label: "待复核(双向)",
        className: "settlement-item-info",
      },
      {
        prop: "dhx",
        label: "待核销",
        className: "settlement-item-info",
      },
      {
        prop: "dsdrl",
        label: "水单认领",
        className: "settlement-item-info",
      },
    ],
  },
  3: {
    title: "收款对账单",
    settlementType: 3,
    list: [
      {
        prop: "ddd",
        label: "待对账",
        className: "settlement-item-red",
        route: "/settlementManagement/statementManage/collectionBillDetailed",
      },
      {
        prop: "dtj",
        label: "待提交",
        className: "settlement-item-blue",
        route: "/settlementManagement/statementManage/collectionBillManage",
        params: {
          statusList: ["0"],
        },
      },
      {
        prop: "dqrdzd",
        label: "待确认",
        className: "settlement-item-info",
      },
      {
        prop: "dfh",
        label: "待复核(双向)",
        className: "settlement-item-info",
      },
      {
        prop: "dsdrl",
        label: "水单认领",
        className: "settlement-item-info",
      },
      {
        prop: "dkp",
        label: "待开票",
        className: "settlement-item-info",
      },
      {
        prop: "dhx",
        label: "待核销",
        className: "settlement-item-info",
      },
    ],
  },
  4: {
    title: "发票申请",
    settlementType: 4,
    list: [
      {
        prop: "dtj",
        label: "待提交",
        className: "settlement-item-blue",
        route: "/settlementManagement/invoice/invoicePrivate",
        params: {
          statusArr: ["0"],
        },
      },
      {
        prop: "dkp",
        label: "待开票",
        className: "settlement-item-blue",
        route: "/settlementManagement/invoice/invoicePrivate",
        params: {
          statusArr: ["1"],
        },
      },
      {
        prop: "ydh",
        label: "已打回",
        className: "settlement-item-blue",
        route: "/settlementManagement/invoice/invoicePrivate",
        params: {
          statusArr: ["3"],
        },
      },
    ],
  },
};
// 海外操作未完结
const overseasUnfinishedConfig = [
  {
    title: "海外入库",
    list: [
      {
        label: "第三方入库",
        route: "ThirdPartyForecast",
        prop: "dsfNum",
        color: "#7EB9FD",
        icon: "iconfont rukuguanli1",
        route: "/operateManage/overSeaWarehouse/thirdPartyForecast",
        params: {
          statusSearch: ["4", "3", "2", "11"],
        },
      },
      {
        label: "WMS退仓入库",
        prop: "wmsNum",
        color: "#D099FB",
        icon: "iconfont rukuguanli1",
        route: "/operateManage/overSeaWarehouse/wmsWithdrawalOperate",
        params: {
          stateList: ["3", "2"],
        },
      },
    ],
  },
  {
    title: "海外出库",
    list: [
      {
        label: "一件代发",
        prop: "yjdfNum",
        color: "#7EB9FD",
        icon: "iconfont yijiandaifa",
        route: "/operateManage/overSeaIssue/wholesaleOperationList",
        params: {
          state: ["0", "1", "2", "3", "4", "5", "7", "9", "11"],
        },
      },
      {
        label: "整箱出库",
        prop: "fbaNum",
        color: "#D099FB",
        icon: "iconfont chukuguanli1",
        route: "/operateManage/overSeaIssue/fbaOrder",
        params: {
          state: ["1", "2", "3", "4", "5", "9", "11"],
        },
      },
    ],
  },
  {
    title: "海外其他",
    list: [
      {
        label: "海外直清",
        prop: "hwzqNum",
        color: "#7EB9FD",
        icon: "iconfont haiwaizhiqing",
        route: "/operateManage/otherOverSeaOrder/clearOrder",
        params: {
          overallStatusIn: ["1", "2", "3", "11", "20", "21", "22"],
        },
      },
      {
        label: "海外直派",
        prop: "hwzpNum",
        color: "#D099FB",
        icon: "iconfont haiwaizhipai",
        route: "/operateManage/otherOverSeaOrder/dispatchOrder",
        params: {
          overallStatusIn: ["1", "2", "3", "11", "21", "22"],
        },
      },
    ],
  },
];

// 电商、传统进行中操作单
const TABLE_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  // customRow: true,
  width: 50,
};
const TABLE_COLS_LOAD_1 = {
  prop: "name",
  label: "业务",
  showOverflowTooltip: true,
  minWidth: 160,
  render: (row) => row.name || "",
};
const TABLE_COLS_LOAD_2 = {
  prop: "businessName",
  label: "业务类型",
  showOverflowTooltip: true,
  minWidth: 120,
  render: (row) => (row.businessName ? `|- ${row.businessName}` : ""),
};
const TABLE_COLS_LOAD_3 = {
  prop: "common",
  label: "普通",
  customRow: true,
  color: "#35D06F",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_LOAD_4 = {
  prop: "urgent",
  label: "紧急",
  customRow: true,
  color: "#FDB530",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_LOAD_5 = {
  prop: "overtime",
  label: "超时",
  customRow: true,
  color: "#FF6767",
  showOverflowTooltip: true,
  minWidth: 80,
};
const operateLoadingConfig = [
  // TABLE_COLS_EXPAND,
  TABLE_COLS_LOAD_1,
  TABLE_COLS_LOAD_2,
  TABLE_COLS_LOAD_3,
  TABLE_COLS_LOAD_4,
  TABLE_COLS_LOAD_5,
];

export {
  headConfig,
  operateHeadConfig,
  goodsType,
  orderTypeTotal,
  gatherCardConfig,
  tableColumns,
  dualTableConfig,
  searchConfig,
  operatePendingConfig,
  overseasUnfinishedConfig,
  operateLoadingConfig,
};
