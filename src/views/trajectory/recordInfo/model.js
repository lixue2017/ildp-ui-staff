const searchLists = [
  {
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "operationOrderNo",
    label: "操作单号：",
    placeholder: "请输入",
    type: "text",
  },
  {
    id: "code",
    label: "CODE：",
    placeholder: "请输入",
    type: "text",
  },
  {
    id: "name",
    label: "轨迹名称：",
    placeholder: "请输入",
    type: "text",
  },



]
const searchColumns = {
  searchNum: searchLists.length,
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchLists,
            },
          ],
        },
      ],
    },
  ],
};

const TABLE_COLS_1 = {
  label: "所属状态",
  prop: "UNCHARTED_COLS_1",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  label: "状态",
  prop: "state",
  sortable: true,
  showOverflowTooltip: true,
  fontColor: true,
  basicType: "trackRecordStatus",
	width: 72,
}
const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    label: "操作单号",
    prop: "operationOrderNo",
    // sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "CODE",
    prop: "code",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "轨迹名称",
    prop: "name",
    sortable: true,
  },
  // TABLE_COLS_1,
  TABLE_COLS_2,
  {
    label: "轨迹时间",
    prop: "trajectoryTime",
		width: 132,
    // sortable: true,
  },
  {
    label: "内容",
    prop: "msg",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "创建时间",
    prop: "createTime",
    // sortable: true,
		width: 132,
    showOverflowTooltip: true
  },
  {
    label: "创建人员",
    // sortable: true,
    prop: "createBy",
  },
	{
    label: "在员工端展示",
    prop: "isStaffView",
		width: 62,
		fontColor: true,
		basicType: "trueOrFalse"
  },
	{
    label: "在客户端展示",
    prop: "isCusView",
		width: 62,
		fontColor: true,
		basicType: "trueOrFalse"
  },
]

export { searchColumns, tableColumns, searchLists };
