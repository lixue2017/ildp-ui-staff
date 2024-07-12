
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}

const TABLE_COLS_1 = {
  label: "参数编码",
  prop: "paramCode",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_2 = {
  label: "消息名称",
  prop: "paramName",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_3 = {
  label: "说明",
  prop: "msgRemake",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_4 = {
  label: "消息(触点)编码",
  prop: "msgTrigger",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true,
  config: {
    identName: ["msgTrigger"]
  },
  className: "border-left"
}

const TABLE_COLS_5 = {
  label: "消息标题",
  prop: "triggerName",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
  config: {
    identName: ["msgTrigger"]
  },
  className: "border-left"
}

const TABLE_COLS_6 = {
  label: "状态",
  prop: "msgStatus",
  minWidth: 120,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
  dicsStr: "message_status",
  customDicsArr: [0, 1, 2],
  className: "border-left"
}

const TABLE_COLS_7 = {
  label: "创建时间",
  prop: "createTime",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
}


const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7
]

const mergeColumn = []
let mergeColumnName = []
const mergeColumnMatch = {}
function handleColumns() {
  tableColumns.forEach((item, index) => {
    if (item.config) {
      if (item.config.identName) {
        mergeColumn.push(index)
        mergeColumnName.push(item.config.identName)
        mergeColumnMatch[index] = item.config.identName
      }
    }
  })
}
handleColumns()

export { tableColumns, mergeColumn, mergeColumnName, mergeColumnMatch }