const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 50,
  align: "center",
}
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
}
const TABLE_COLS_1 = {
  prop: "customerCode",
  label: "企业代码",
  minWidth: 120,
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  prop: "shortName",
  label: "企业简称",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "customerName",
  label: "企业名称",
  showOverflowTooltip: true
}

export const tableColumns = [
  TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
]
