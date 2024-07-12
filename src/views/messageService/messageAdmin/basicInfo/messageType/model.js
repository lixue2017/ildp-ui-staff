
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}

const TABLE_COLS_1 = {
  label: "消息编码",
  prop: "msgTypeCode",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_2 = {
  label: "消息类型",
  prop: "msgType",
  minWidth: 100,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: 'message_type',
  customDicsArr: [1, 2]
}

// const TABLE_COLS_3 = {
//   label: "消息分类",
//   prop: "table_xx_3",
//   minWidth: 120,
//   sortable: true,
//   showOverflowTooltip: true,
// }

const TABLE_COLS_4 = {
  label: "备注",
  prop: "msgTypeRemake",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_5 = {
  label: "创建时间",
  prop: "createTime",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_6 = {
  label: "创建人",
  prop: "createBy",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}


const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  // TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6
]

export { tableColumns }