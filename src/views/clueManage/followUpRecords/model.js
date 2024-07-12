import {
  httpRoleDeptUserSelect,
  httpGetSalesLeadsSelectPage,
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
  id: "followTime",
  label: "实际跟进时间：",
  labelWidth: "92px",
  startPlaceholder: "跟进开始日期",
  endPlaceholder: "跟进结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_3 = {
  id: "followUserId",
  label: "跟进人员：",
  placeholder: "跟进人员",
  ...httpRoleDeptUserSelect({ isCrm: 1 }),
};
const SEARCH_COLS_4 = {
  id: "businessId",
  label: "跟进客户：",
  placeholder: "跟进客户",
  ...httpGetSalesLeadsSelectPage(),
};
const SEARCH_COLS_5 = {
  id: "type",
  label: "跟进类型：",
  placeholder: "跟进类型",
  type: "select",
  basicType: "crmFollowType",
};
const SEARCH_COLS_6 = {
  id: "searchValue",
  label: "关键词：",
  placeholder: "线索编号/客户名称",
  type: "text",
};
const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_6,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
];

const TABLE_COLS_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 60,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "salesLeadsCode",
  label: "线索编号",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
  columnLink: true,
};
const TABLE_COLS_2 = {
  prop: "businessTypeName",
  label: "跟进业务",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_3 = {
  prop: "actualFollowTime",
  label: "跟进时间",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_4 = {
  prop: "typeName",
  label: "跟进类型",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_5 = {
  prop: "customerName",
  label: "客户名称",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
};
const TABLE_COLS_6 = {
  prop: "remark",
  label: "内容",
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_7 = {
  prop: "salesLeadsState",
  label: "线索状态",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  basicType: "crmSalesLeadsState",
};
const TABLE_COLS_8 = {
  prop: "remindUserName",
  label: "提醒谁看",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_9 = {
  prop: "nextFollowTime",
  label: "下次跟进",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_10 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_11 = {
  prop: "createUserName",
  label: "创建人",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 90,
  columnOperation: true,
  fixed: "right",
};
const tableColumns = [
  // TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1, // 线索编号
  TABLE_COLS_2, // 跟进业务
  TABLE_COLS_3, // 跟进时间
  TABLE_COLS_4, // 跟进类型
  TABLE_COLS_5, // 客户名称
  TABLE_COLS_6, // 内容
  TABLE_COLS_7, // 线索状态
  TABLE_COLS_8, // 提醒谁看
  TABLE_COLS_9, // 下次跟进
  TABLE_COLS_10, // 创建时间
  TABLE_COLS_11, // 创建人
  TABLE_COLS_OPERATION, // 操作
];

export { searchColumns, tableColumns };
