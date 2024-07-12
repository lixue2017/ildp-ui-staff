const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  {
    id: "code",
    label: "航线组代码：",
    placeholder: "航线组代码",
    type: "text",
  },
  {
    id: "name",
    label: "航线组名称：",
    placeholder: "航线组名称",
    type: "text",
  },
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    prop: "code",
    label: "航线组代码",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120,
    customRow: true,
  },
  {
    prop: "nameCn",
    label: "航线组名称(CN)",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140,
  },
  {
    prop: "nameEn",
    label: "航线组名称(EN)",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140,
  },
  {
    prop: "lineType",
    label: "航线类型",
    sortable: true,
    showOverflowTooltip: true,
    width: 100,
    basicType: "transportMode",
  },
  {
    prop: "remark",
    sortable: true,
    showOverflowTooltip: true,
    label: "备注",
    minWidth: 100,
  },
  {
    prop: "routeCode",
    label: "航线路径编码",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140,
  },
  {
    prop: "isPublic",
    label: "公共",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    width: 80,
  },
  {
    prop: "status",
    label: "状态",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    basicType: "status",
    width: 100,
  },
  {
    prop: "createTime",
    label: "创建时间",
    sortable: true,
    showOverflowTooltip: true,
    width: 200,
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 120,
    // fixed: 'right',
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    fixed: "right",
    label: "操作",
    prop: "operation",
    // customRow: true,
    columnOperation: true, //MODEL中的配置
    width: 140,
  },
];

export { searchColumns, tableColumns };
