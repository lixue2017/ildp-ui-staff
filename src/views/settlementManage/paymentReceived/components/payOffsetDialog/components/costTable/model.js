const TABLE_COLS_INDEX = {
  type: "index",
  width: 80,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  showOverflowTooltip: true,
  basicType: 'billType',
  fontColor: true,
};
const TABLE_COLS_2 = {
  prop: "costName",
  label: "费用名称",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "currencyCode",
  label: "币种",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "money",
  label: "金额",
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,  //MODEL中的配置
  fixed: 'right',
}
export const tableColumns = () => {
  return [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_OPERATION,
  ];
};
