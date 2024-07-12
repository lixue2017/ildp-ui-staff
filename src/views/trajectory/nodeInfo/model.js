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
    id: "code",
    label: "Code/上级节点：",
    placeholder: "请输入",
    type: "text",
  },
  {
    id: "name",
    label: "轨迹名称：",
    placeholder: "请输入轨迹名称",
    type: "text",
  },
  {
    id: "level",
    label: "全部层级：",
    placeholder: "请选择全部层级",
    type: "select",
    options: [
      { label: "①", value: 0 },
      { label: "②", value: 1 },
      // { label: "③", value: 2 },
    ]
  },
  {
    id: "types",
    label: "类型：",
    placeholder: "类型（多选）",
    type: "select",
    basicType: "nodeType",
    hideList: [0],
    multiple: true,
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

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },

  {
    label: "CODE",
    customRow: true,
    prop: "code",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "轨迹名称",
    sortable: true,
    prop: "name",
  },
  {
    label: "类型",
    prop: "type",
    sortable: true,
    basicType: "nodeType"

  },
  {
    label: "层级",
    prop: "level",
    sortable: true,
    customRow: true

  },
  {
    label: "上级节点",
    prop: "parentCode",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "节点图标",
    prop: "nodeIcon",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "节点显示(客户端)",
    sortable: true,
    prop: "nameCus",
    width: 160
  },
  {
    label: "节点显示(员工端)",
    sortable: true,
    prop: "nameStaff",
    width: 160
  },
  {
    label: "内容",
    prop: "msg",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "创建时间",
    sortable: true,
    prop: "createTime",
  },
  {
    label: "修改人员",
    sortable: true,
    prop: "createBy",
  },
]

export { searchColumns, tableColumns, searchLists };
