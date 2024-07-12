const SEARCH_COLS_1 = {
  id: "searchValue",
  label: "关键词：",
  placeholder: "联系人/客户名称/手机号",
  type: "text",
};
const SEARCH_COLS_2 = {
  id: "birthday",
  label: "联系人生日：",
  placeholder: "联系人生日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_3 = {
  id: "role",
  label: "角色：",
  placeholder: "角色",
  type: "select",
  basicType: "crmRole",
};
const SEARCH_COLS_4 = {
  id: "lastContactTime",
  label: "最后联系：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_5 = {
  id: "lastFollowTime",
  label: "最后跟进：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const searchColumns = [
  SEARCH_COLS_1,
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
  label: "联系人编码",
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "contactName",
  label: "联系人姓名",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_3 = {
  prop: "customerName",
  label: "关联客户",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 140,
};
const TABLE_COLS_4 = {
  prop: "phone",
  label: "手机号码",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_5 = {
  prop: "birthday",
  label: "生日",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_6 = {
  prop: "role",
  label: "角色",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  basicType: "crmRole",
};
const TABLE_COLS_7 = {
  prop: "deptPosition",
  label: "部门职务",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_8 = {
  prop: "lastContactTime",
  label: "最后联系",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 150,
  columnOperation: true,
  fixed: "right",
};
const tableColumns = [
  // TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1, // 联系人编码
  TABLE_COLS_2, // 联系人姓名
  TABLE_COLS_3, // 关联客户
  TABLE_COLS_4, // 手机号码
  TABLE_COLS_5, // 生日
  TABLE_COLS_6, // 角色
  TABLE_COLS_7, // 部门职务
  TABLE_COLS_8, // 最后联系
  TABLE_COLS_OPERATION, // 操作
];

export { searchColumns, tableColumns };
