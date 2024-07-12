import { httpLogisticsChannelListSelect } from "@/comModel/warehouse";
import {
  httpUserSelect,
  httpCostTypeSelect,
  httpGetCostBindCustomer,
} from "@/comModel/httpSelect";
import { logisticsProductList } from "@/api/warehouse/basic";

const SEARCH_COLS_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "codeLike",
  label: "规则编码：",
  placeholder: "规则编码",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
};
const SEARCH_COLS_4 = {
  id: "customerId",
  label: "客户代码：",
  placeholder: "客户代码",
  ...httpGetCostBindCustomer(),
};
const SEARCH_COLS_5 = {
  id: "settleCostTypeId",
  label: "费用类型：",
  placeholder: "费用类型",
  ...httpCostTypeSelect({ type: 2, descs: "7" }),
};
const SEARCH_COLS_6 = {
  id: "createUserId",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
};
const SEARCH_COLS_7 = {
  id: "stateIn",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "costSpecialChargesRuleState",
  // hideList:[2]
  multiple: true,
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "code",
  label: "规则编码",
  minWidth: 120,
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "logisticsProductCode",
  label: "物流产品",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => {
    const { logisticsProductIds, logisticsProductCode } = row;
    if (logisticsProductIds && logisticsProductIds.length) {
      return `${logisticsProductIds.length}个：${logisticsProductCode}`;
    }
    return "ALL";
  },
};
const TABLE_COLS_3 = {
  prop: "customerCode",
  label: "客户代码",
  minWidth: 140,
  showOverflowTooltip: true,
  render: (row) => {
    const { customerIds, customerCode } = row;
    return customerCode ? `${customerIds.length}个：${customerCode}` : "ALL";
  },
};
const TABLE_COLS_4 = {
  prop: "settleCostTypeName",
  label: "费用类型",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "fastening",
  label: "扣件",
  minWidth: 80,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_6 = {
  prop: "customerNotification",
  label: "客户通知",
  minWidth: 100,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_7 = {
  prop: "channelSupport",
  label: "渠道支持",
  minWidth: 100,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_8 = {
  prop: "startTime",
  label: "有效开始时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "endTime",
  label: "有效结束时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "createUserName",
  label: "创建人",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "updateTime",
  label: "最后修改时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "state",
  label: "状态",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "costSpecialChargesRuleState",
  dotColor: true,
  fixed: "right",
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 150,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};

const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  // SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
];
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  // TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  // TABLE_COLS_8,
  // TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_12,
  TABLE_COLS_11,
  TABLE_COLS_13,
  TABLE_COLS_OPERATION,
];

export { searchColumns, tableColumns };
