
const SEARCH_COLS_1 = {
  id: "flagReadList",
  label: "读取状态：",
  placeholder: "读取状态(默认全部)",
  type: "multiCheckbox",
  dicsStr: 'read_status',
  customDicsArr: [0, 1],
  className: "width-330",
  leastOne: true
}

const SEARCH_COLS_2 = {
  id: "msgTypeList",
  label: "消息类型：",
  placeholder: "消息类型(默认全部)",
  type: "multiCheckbox",
  dicsStr: 'message_type',
  customDicsArr: [1, 2],
  className: "width-330",
  leastOne: true
}

const SEARCH_COLS_3 = {
  id: "todoHandledList",
  label: "处理结果：",
  placeholder: "处理结果(默认全部)",
  type: "multiCheckbox",
  dicsStr: 'handled_results',
  customDicsArr: [0, 1],
  className: "width-330",
  leastOne: true
}

const SEARCH_COLS_4 = {
  id: "allRead",
  type: "slot",
  className: "flex-1",
  labelWidth: "0"
}
const searchColumns = (isTodo) => ([
  SEARCH_COLS_1, SEARCH_COLS_2, ...isTodo ? [SEARCH_COLS_3] : [], SEARCH_COLS_4
])

const searchConfig = (isTodo) => ({
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns(isTodo),
            },
          ],
        },
      ],
    },
  ],
})

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}

const TABLE_COLS_1 = {
  label: "消息标题",
  prop: "msgTitle",
  minWidth: 120,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_2 = {
  label: "消息内容",
  prop: "msgContent",
  minWidth: 300,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_3 = {
  prop: "msgType",
  label: "消息类型：",
  minWidth: 120,
  sortable: true,
  customRow: true,
  dicsStr: 'message_type',
  customDicsArr: [1, 2]
}

const TABLE_COLS_4 = {
  label: "已读状态",
  prop: "flagRead",
  minWidth: 120,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: 'read_status',
  customDicsArr: [0, 1]
}

const TABLE_COLS_5 = {
  label: "推送时间",
  prop: "pushTime",
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
]

export { searchConfig, tableColumns }