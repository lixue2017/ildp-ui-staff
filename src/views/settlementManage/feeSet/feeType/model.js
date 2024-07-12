const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "cnName",
    label: "中文名称：",
    placeholder: "中文名称(CN)",
    type: "text",
  },
  {
    id: "enName",
    label: "英文名称：",
    placeholder: "英文名称(EN)",
    type: "text",
  },
  {
    id: "createBy",
    label: "创建人：",
    placeholder: "创建人",
    type: "text",
  },
  {
    id: "dataStatus",
    label: "状态：",
    placeholder: "状态(多选)",
    type: "select",
    multiple: true,
    basicType: "status"
  },
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "costCode",
    label: "费用代码",
    width: 150,
    showOverflowTooltip: true,
    sortable: true,
    align: "left",
  },
  {
    prop: "cnName",
    label: "费用名称(CN)",
    width: 150,
    showOverflowTooltip: true,
    sortable: true,
    align: "left",
  },
  {
    prop: "enName",
    label: "费用名称(EN)",
    width: 150,
    showOverflowTooltip: true,
    sortable: true,
    align: "left",
  },
  {
    prop: "desc",
    label: "描述",
    showOverflowTooltip: true,
    sortable: true,
    align: "left",
  },
  {
    prop: "dataStatus",
    label: "状态",
    width: 80,
    customRow: true,
    basicType: 'status',
    sortable: true,
    align: "left",
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 200,
    fixed: 'right',
    sortable: true,
    align: "left",
  },
  {
    prop: "createBy",
    label: "创建人",
    width: 120,
    fixed: 'right',
    sortable: true
  }
]



export { searchColumns, tableColumns };
