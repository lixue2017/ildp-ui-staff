const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "logisticsProductName",
  label: "物流产品",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "costPartitionSchemeName",
  label: "分区方案",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "costName",
  label: "费用名称",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "cost",
  label: "费用",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "currencyName",
  label: "币别",
  minWidth: 80,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "minFreightEfficiency",
  label: "参考递送时间(工作日)",
  showOverflowTooltip: true,
  render: (row) => {
    const { minFreightEfficiency, optimalFreightEfficiency } = row;
    return minFreightEfficiency && optimalFreightEfficiency
      ? `${minFreightEfficiency}-${optimalFreightEfficiency}`
      : "--";
  },
};
const TABLE_COLS_7 = {
  prop: "traceable",
  label: "可追踪",
  minWidth: 120,
  showOverflowTooltip: true,
  yesOrNo: true,
};

export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
];
