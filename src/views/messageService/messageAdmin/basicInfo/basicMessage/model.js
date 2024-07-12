
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}

const TABLE_COLS_1 = {
  label: "模块",
  prop: "moduleName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  config: {
    identName: ["msgModu", "msgBusiness"]
  },
  className: "border-left",
}

const TABLE_COLS_2 = {
  label: "所属业务",
  prop: "msgBusiness",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  config: {
    identName: ["msgModu", "msgBusiness"]
  },
  className: "border-left",
  dicsStr: "application",
  customDicsArr: [1, 2]
}

const TABLE_COLS_3 = {
  label: "消息(触点)",
  prop: "triggerName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  config: {
    identName: ["msgModu", "msgBusiness", "msgTrigger"]
  },
  className: "border-left",
}

const TABLE_COLS_4 = {
  label: "消息标题",
  prop: "msgTitle",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  config: {
    identName: ["msgModu", "msgBusiness", "msgTrigger"]
  },
  className: "border-left"
}

const TABLE_COLS_5 = {
  label: "推送人",
  prop: "pushName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
  config: {
    identName: ["msgModu", "msgBusiness", "msgTrigger"]
  },
  className: "border-left"
}

const TABLE_COLS_6 = {
  label: "消息编码",
  prop: "msgTypeCode",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  className: "border-left"
}

const TABLE_COLS_7 = {
  label: "消息类型",
  prop: "msgType",
  minWidth: 120,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: 'message_type',
  customDicsArr: [1, 2]
}
const TABLE_COLS_8 = {
  label: "后续动作",
  prop: "upAction",
  minWidth: 200,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_9 = {
  label: "是否推送",
  prop: "flagPush",
  minWidth: 120,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
  dicsStr: "push_status",
  customDicsArr: [0, 1]
}

const TABLE_COLS_operation = {
  label: "操作",
  prop: "operation",
  customRow: true,
  minWidth: 120,
  fixed: "right"
}

const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_operation
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