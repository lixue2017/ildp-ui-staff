
const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 50,
  align: "center",
  fixed: "left"
}
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
// const TABLE_COLS_1 = {
//   prop: "code",
//   label: "客户",
//   showOverflowTooltip: true,
//   render: (row) => `${row.code}/${row.name}`
// }
// const TABLE_COLS_2 = {
//   prop: "createUserName",
//   label: "操作人",
//   width: 120,
//   showOverflowTooltip: true
// }
// const TABLE_COLS_3 = {
//   prop: "createTime",
//   label: "添加时间",
//   width: 180,
//   showOverflowTooltip: true
// }
const TABLE_COLS_1 = {
  prop: "code",
  label: "客户代码",
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  prop: "shortName",
  label: "客户简称",
  showOverflowTooltip: true,
}
const TABLE_COLS_3 = {
  prop: "name",
  label: "客户名称",
  showOverflowTooltip: true,
}
const TABLE_COLS_4 = {
  prop: "affiliatedCompany",
  label: "所属公司",
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  prop: "salesman",
  label: "业务员",
  showOverflowTooltip: true,
}
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  width: 100,
  columnOperation: true,
  fixed: "right",
}

export const tableColumns = [
  TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_OPERATION
]
