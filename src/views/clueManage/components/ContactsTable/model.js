const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 60,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "contactName",
  label: "联系人姓名",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "phone",
  label: "手机号码",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_3 = {
  prop: "role",
  label: "角色",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  basicType: "crmRole",
};
const TABLE_COLS_4 = {
  prop: "deptPosition",
  label: "部门职务",
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
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 150,
  columnOperation: true,
  fixed: "right",
};
export const tableColumns = (isCommunal) => [
  ...(isCommunal ? [TABLE_COLS_INDEX] : [TABLE_COLS_SELECTION]),
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_OPERATION,
];
