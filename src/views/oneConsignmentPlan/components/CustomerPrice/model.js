const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "customerName",
  label: "客户",
  showOverflowTooltip: true,
  minWidth: 200,
  render: (row) => `${row.customerCode}/${row.customerName}`,
};
const TABLE_COLS_2 = {
  prop: "beginTime",
  label: "开始时间",
  width: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "endTime",
  label: "结束时间",
  width: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "updateTime",
  label: "更新时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "state",
  label: "状态",
  width: 160,
  showOverflowTooltip: true,
  basicType: "limitManageStatus",
  dotColor: true,
};

export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  // TABLE_COLS_2,
  // TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
];
