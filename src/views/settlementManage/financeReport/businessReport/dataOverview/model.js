import {
  httpLogisticsCustomerSelect,
  httpSalesmanSelect,
  httpLogisticsCompanySelect,
} from "@/comModel/httpSelect.js";

const SEARCH_COLS_1 = {
  span: 6,
  id: "deptId",
  label: "所属公司：",
  placeholder: "所属公司",
  ...httpLogisticsCustomerSelect(),
  selectLabelKey: "deptName",
  noClearable: true,
};
const SEARCH_COLS_2 = {
  span: 6,
  id: "placeOrderDate",
  label: "下单日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
  pickerOptions: {
    disabledDate(time) {
      return (
        time.getTime() > Date.now() ||
        time.getTime() < new Date("2023-01-01 00:00:00").getTime()
      );
    },
  },
};
const SEARCH_COLS_3 = {
  span: 12,
  id: "salesmanIdList",
  label: "业务员：",
  placeholder: "业务员(多选)",
  ...httpSalesmanSelect(),
  multiple: true,
  collapseTags: true,
  type: "slot",
};
const SEARCH_COLS_4 = {
  span: 12,
  id: "orderTypes",
  label: "业务类型：",
  placeholder: "业务全部(多选)",
  type: "select",
  basicType: "ywbbddlx",
  multiple: true,
  collapseTags: true,
};
const SEARCH_COLS_5 = {
  span: 12,
  id: "customerIds",
  label: "委托人：",
  placeholder: "委托人(多选)",
  ...httpLogisticsCompanySelect(),
  multiple: true,
  collapseTags: true,
  type: "slot",
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center",
};
const TABLE_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  defaultExpandShow: false,
  width: 30,
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "所属月份",
  prop: "belongMonth",
  minWidth: 100,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  groupType: 1,
  label: "下单日期",
  prop: "createDate",
  minWidth: 100,
  request: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  groupType: 2,
  label: "业务员",
  prop: "salesManName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  groupType: 3,
  label: "委托人",
  prop: "customerName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  label: "客户结算方式",
  prop: "settleTypeName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  groupType: 4,
  label: "业务类型",
  prop: "orderTypeName",
  minWidth: 100,
  showOverflowTooltip: true,
  // basicType: "ywbbddlx",
};
const TABLE_COLS_7 = {
  label: "票数",
  prop: "orderCount",
  minWidth: 80,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  label: "件数",
  prop: "num",
  minWidth: 80,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  label: "体积/T",
  prop: "volume",
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  label: "重量/KG",
  prop: "weight",
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  label: "所属公司",
  prop: "belongCompanyName",
  minWidth: 120,
  showOverflowTooltip: true,
  request: true,
};
const TABLE_COLS_12 = {
  label: "工作单号",
  prop: "orderNum",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  label: "海外仓",
  prop: "overseasWarehouseName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  label: "目的国",
  prop: "countryName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  label: "柜型柜量",
  prop: "boxInfo",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  label: "订单状态",
  prop: "orderStatus",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "orderStatus",
  dotColor: true,
};

const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
];
const formRules = {
  placeOrderDate: [
    { required: true, message: "请选择下单日期", trigger: "change" },
  ],
  deptId: [{ required: true, message: "请选择公司", trigger: "change" }],
}; // 表单校验规则

const tableColumns = [
  TABLE_COLS_EXPAND,
  TABLE_COLS_INDEX,
  TABLE_COLS_1, // 所属月份
  TABLE_COLS_2, // 下单日期
  TABLE_COLS_3, // 业务员
  { ...TABLE_COLS_4, minWidth: 240 }, // 委托人
  TABLE_COLS_5, // 客户结算方式
  TABLE_COLS_6, // 业务类型
  TABLE_COLS_7, // 票数
  TABLE_COLS_8, // 件数
  TABLE_COLS_9, // 体积
  TABLE_COLS_10, // 重量
  TABLE_COLS_11, // 所属公司
];
const expandColumns = [
  {
    prop: "space",
    customRow: true,
    width: 80,
    fixed: "left",
  },
  TABLE_COLS_2, // 下单日期
  TABLE_COLS_12, // 工作单号
  TABLE_COLS_4, // 委托人
  TABLE_COLS_3, // 业务员
  TABLE_COLS_6, // 业务类型
  TABLE_COLS_13, // 海外仓
  TABLE_COLS_14, // 目的国
  TABLE_COLS_15, // 柜型柜量
  TABLE_COLS_8, // 件数
  TABLE_COLS_9, // 体积
  TABLE_COLS_10, // 重量
  TABLE_COLS_16, // 订单状态
];
const chartColumns = (type = 0, dimensionList) => [
  ...(type == 4 ? [] : [{ ...TABLE_COLS_INDEX, width: 50 }]),
  {
    ...[
      TABLE_COLS_2,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_4,
      { ...TABLE_COLS_1, prop: "createDate" },
    ][type],
    width: 121,
    sortable: true,
  },
  ...dimensionList.map((item) => ({
    prop: item.tableProp,
    label: item.nameCn,
    sortable: true,
    minWidth: type == 4 ? 110 : 72,
    showOverflowTooltip: true,
  })),
  ...(type == 4
    ? [
        {
          prop: "totalNum",
          label: "总计",
          sortable: true,
          width: 72,
          showOverflowTooltip: true,
        },
      ]
    : []),
];
const totalConfig = [
  {
    prop: "totalOrderCount",
    width: 82,
  },
  {
    prop: "totalNum",
    width: 82,
  },
  {
    prop: "totalVolume",
    width: 82,
    decimal: 2,
    align: "right",
  },
  {
    prop: "totalWeight",
    width: 82,
    decimal: 2,
    align: "right",
  },
];

export {
  searchColumns,
  formRules,
  tableColumns,
  expandColumns,
  chartColumns,
  totalConfig,
};
