import { httpUserSelect } from '@/comModel/httpSelect'

const SEARCH_COLS_1 = {
  id: "pushTimeStart",
  label: "推送时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COLS_2 = {
  id: "readTimeStart",
  label: "读取时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COLS_3 = {
  id: "msgTitleLike",
  label: "消息标题：",
  placeholder: "搜索消息标题",
  type: "text"
}
const SEARCH_COLS_4 = {
  id: "receiveNameLike",
  label: "接收人姓名：",
  placeholder: "接收人姓名",
  type: "text"
}
const SEARCH_COLS_5 = {
  id: "flagRead",
  label: "读取状态：",
  placeholder: "读取状态(默认全部)",
  type: "select",
  dicsStr: 'read_status',
  customDicsArr: [0, 1]
}

const SEARCH_COLS_6 = {
  id: "msgType",
  label: "消息类型：",
  placeholder: "消息类型(默认全部)",
  type: "select",
  dicsStr: 'message_type',
  customDicsArr: [1, 2]
}

const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6
]

const searchConfig = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns,
            },
          ],
        },
      ],
    },
  ],
  searchNum: searchColumns.length
}

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}

const TABLE_COLS_1 = {
  label: "发送编码",
  prop: "msgCode",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_2 = {
  label: "接收人",
  prop: "receiveName",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_3 = {
  label: "消息标题",
  prop: "msgTitle",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_4 = {
  label: "消息内容",
  prop: "msgContent",
  minWidth: 200,
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
  fixed: "left",
}

const TABLE_COLS_5 = {
  label: "关联模板",
  prop: "msgTypeCode",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_6 = {
  label: "语言",
  prop: "msgLang",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_7 = {
  label: "消息类型",
  prop: "msgType",
  minWidth: 100,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: 'message_type',
  customDicsArr: [1, 2]
}

const TABLE_COLS_8 = {
  label: "已读状态",
  prop: "flagRead",
  minWidth: 100,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  dicsStr: 'read_status',
  customDicsArr: [0, 1]
}

const TABLE_COLS_9 = {
  label: "推送时间",
  prop: "pushTime",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_10 = {
  label: "读取时间",
  prop: "readTime",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COLS_11 = {
  label: "所属模块",
  prop: "moduleName",
  minWidth: 120,
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
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
]

export { searchConfig, tableColumns }