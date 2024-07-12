const searchLists = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "code",
    label: "Code：",
    placeholder: "请输入code",
    type: "text",
  },
  {
    id: "name",
    label: "轨迹名称：",
    placeholder: "请输入轨迹名称",
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
  label: "影响状态",
  prop: "impactStatus",
  sortable: true,
  showOverflowTooltip: true,
  basicType: "orderStatus"
}
const TABLE_COLS_2 = {
  width: 86,
  label: "页面可配置",
  prop: "configureState",
  basicType: "trueOrFalse",
  fontColor: true, // 字体是否有颜色
  align: "center"
}
const TABLE_COLS_3 = {
  label: "备注",
  prop: "remark",
  sortable: true,
  showOverflowTooltip: true,
}
const tableColumns = [
  {
    type: "index",
    width: 50,
    fixed: "left",
    align: "center",
  },
  {
    label: "Code",
    prop: "code",
    sortable: true,
    showOverflowTooltip: true,
    className: "table-class"
  },

  {
    label: "轨迹名称",
    prop: "name",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    label: "类型",
    prop: "type",
    basicType: "nodeType",
    sortable: true,
  },
  {
    label: "后置节点",
    prop: "previousConditionMsg",
    sortable: true,
    showOverflowTooltip: true,
    className: "table-class"
  },
  TABLE_COLS_1,
  TABLE_COLS_2,
  {
    label: "客户端展示",
    prop: "cusView",
    minWidth: 100,
    sortable: true,
    showOverflowTooltip: true,
    className: "table-class"
  },
  {
    label: "员工端展示",
    prop: "staffView",
    minWidth: 100,
    sortable: true,
    showOverflowTooltip: true,
    className: "table-class"
  },
  {
    label: "在员工端展示",
    prop: "isStaffView",
    minWidth: 80,
    align:"center",
    fontColor: true,
    basicType: "trueOrFalse"
  },
  {
    label: "在客户端展示",
    prop: "isCusView",
    minWidth: 80,
    align:"center",
    fontColor: true,
    basicType: "trueOrFalse"
  },
  // {
  //   label: "所属流程",
  //   prop: "flowName",
  //   sortable: true,
  //   minWidth: 100,
  //   showOverflowTooltip: true
  // },
  TABLE_COLS_3,
  {
    label: "关联时间",
    sortable: true,
    minWidth: 140,
    prop: "createTime",
  },
  // {
  //   label: "修改人员",
  //   sortable: true,
  //   prop: "updateBy",
  // },
]

export { searchColumns, tableColumns, searchLists };
