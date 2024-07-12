const TABLE_COLS_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "step",
  label: "业务节点",
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "auditRemark",
  label: "备注",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "auditBy",
  label: "操作人员",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_4 = {
  prop: "auditTime",
  label: "操作时间",
  showOverflowTooltip: true,
  minWidth: 120,
};

export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
];
