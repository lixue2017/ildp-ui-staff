import { httpCustomerSelect } from "@/comModel/httpSelect";
const SEARCH_COL_1 = {
  id: "orderNum",
  label: "工作单号：",
  placeholder: "请输入工作单号",
  type: "text",
};

const SEARCH_COL_2 = {
  id: "customerId",
  label: "委托人：",
  placeholder: "请选择委托人",
  ...httpCustomerSelect(),
};
const SEARCH_COL_3 = {
  id: "sku",
  label: "SKU：",
  placeholder: "请选择SKU",
  type: "text",
};

const SEARCH_COL_4 = {
  id: "statusList",
  label: "状态：",
  placeholder: "请选择状态",
  type: "select",
  basicType: "returnGoodsStatus",
};

const SEARCH_COL_5 = {
  id: "orderType",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  basicType: "labelingBusinessType",
  type: "select",
};

const SEARCH_COL_6 = {
  id: "cancelTime",
  label: "取消时间：",
  startPlaceholder: "开始取消日期",
  endPlaceholder: "结束取消日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COL_7 = {
  id: "returnTime",
  label: "还货时间：",
  startPlaceholder: "开始还货日期",
  endPlaceholder: "结束还货日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              SEARCH_COL_2,
              SEARCH_COL_3,
              SEARCH_COL_4,
              SEARCH_COL_5,
              SEARCH_COL_6,
              SEARCH_COL_7,
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "orderNum",
  label: "工作单号",
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "customerName",
  label: "委托人",
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "orderType",
  label: "业务类型",
  basicType: "labelingBusinessType",
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "sku",
  label: "产品SKU",
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "odlLocationCode",
  label: "下架库位",
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "oldTraySn",
  label: "托盘",
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "cancelTime",
  label: "取消时间",
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "overTime",
  label: "还货时间",
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "status",
  label: "状态",
  basicType: "returnGoodsStatus",
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "pickingNum",
  label: "拣货单",
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "pickUserName",
  label: "拣货员",
  showOverflowTooltip: true,
};

const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
};

export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_OPERATION,
];
