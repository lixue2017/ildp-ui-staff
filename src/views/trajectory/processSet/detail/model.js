const searchLists = [
  {
    span: 6,
    id: "GLLCTJ",
    label: "关联流程条件：",
    labelWidth: "120px",
    placeholder: "请输入关联流程条件",
    type: "text",
  },
  {
    span: 6,
    id: "BM",
    label: "编码：",
    labelWidth: "120px",
    placeholder: "请输入编码",
    type: "text",
  },
  {
    span: 24,
    id: "LCJD",
    label: "流程节点：",
    labelWidth: "120px",
    placeholder: "请选择流程节点",
    type: "multiCheckbox",
    // basicType: "serviceType",
    options: [
      { label: "客户下单", value: 0, disabled: true },
      { label: "订舱", value: 1 },
      { label: "交仓", value: 2 },
      { label: "装柜", value: 3 },
      { label: "拖车1", value: 4 },
      { label: "报关", value: 5 },
      { label: "到港", value: 6 },
      { label: "离港", value: 7 },
      { label: "提单", value: 8 },
      { label: "清关", value: 9 },
      { label: "拖车2", value: 10 },
      { label: "入仓", value: 11 },
      { label: "出仓", value: 12 },
      { label: "尾程派送", value: 13 },
    ]
  }
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
    fixed: "left",
    align: "center",
  },
  {
    label: "流程节点",
    prop: "LCJD",
    showOverflowTooltip: true
  },

  {
    label: "前置条件",
    prop: "QZTJ",
    showOverflowTooltip: true
  },
  {
    label: "客户端",
    prop: "KHD",
  },
  {
    label: "员工端",
    prop: "YGD",
  },
  {
    label: "类型",
    prop: "LX",
  },
  {
    fixed: "right",
    label: "操作",
    prop: "operation",
    customRow: true,
    width: 250,
  }
]

export { searchColumns, tableColumns, searchLists };
