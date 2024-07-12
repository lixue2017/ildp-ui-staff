import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "leadSource",
  label: "线索来源：",
  placeholder: "线索来源",
  type: "select",
  basicType: "crmLeadSource",
};
const SEARCH_COLS_3 = {
  id: "state",
  label: "跟进状态：",
  placeholder: "跟进状态",
  type: "select",
  basicType: "crmSalesLeadsState",
};
const SEARCH_COLS_4 = {
  id: "formerOwnershipUserId",
  label: "前归属人：",
  placeholder: "前归属人",
  ...httpRoleDeptUserSelect({ isCrm: 1 }),
};
const SEARCH_COLS_5 = {
  id: "lastFollowTime",
  label: "最后跟进：",
  startPlaceholder: "跟进开始日期",
  endPlaceholder: "跟进结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
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
  prop: "code",
  label: "线索编号",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
  columnLink: true,
};
const TABLE_COLS_2 = {
  prop: "name",
  label: "客户名称",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
  fixed: "left",
};
const TABLE_COLS_3 = {
  prop: "crmTag",
  label: "标签",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
  customRow: true,
};
const TABLE_COLS_4 = {
  prop: "levelName",
  label: "客户星级",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  render: (row) => (row.levelName ? `${row.levelName}类客户` : "--"),
};
const TABLE_COLS_5 = {
  prop: "contactName",
  label: "联系人姓名",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_6 = {
  prop: "state",
  label: "跟进状态",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  basicType: "crmSalesLeadsState",
};
const TABLE_COLS_7 = {
  prop: "phone",
  label: "手机号码",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_8 = {
  prop: "leadSource",
  label: "线索来源",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  basicType: "crmLeadSource",
};
const TABLE_COLS_9 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_10 = {
  prop: "remark",
  label: "备注",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_11 = {
  prop: "formerOwnershipUserName",
  label: "上一次负责人",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_12 = {
  prop: "nextFollowTime",
  label: "下次跟进",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_13 = {
  prop: "latestFollowTime",
  label: "最新跟进记录",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_14 = {
  prop: "lastFollowTime",
  label: "最后跟进",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 150,
  columnOperation: true,
  fixed: "right",
};
const tableColumns = [
  TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1, // 线索编号
  TABLE_COLS_2, // 客户名称
  TABLE_COLS_3, // 标签
  TABLE_COLS_4, // 客户星级
  TABLE_COLS_5, // 联系人姓名
  TABLE_COLS_6, // 跟进状态
  TABLE_COLS_7, // 手机号码
  TABLE_COLS_8, // 客户来源
  TABLE_COLS_9, // 创建时间
  TABLE_COLS_10, // 备注
  TABLE_COLS_11, // 负责人
  TABLE_COLS_12, // 下次跟进
  TABLE_COLS_13, // 最新跟进记录
  TABLE_COLS_14, // 最后跟进
  TABLE_COLS_OPERATION, // 操作
];

export { searchColumns, tableColumns };
