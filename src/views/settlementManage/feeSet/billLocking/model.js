const searchColumns = [
  {
    id: "lockMonth",
    label: "锁定月份：",
    placeholder: "----年--月",
    type: "month",
    valueFormat: "yyyy-MM"
  }
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "lockMonth",
    label: "锁定月份",
    showOverflowTooltip: true,
    sortable: true,
    align: "left",
    minWidth: 110,
  },
  {
    prop: "serviceLockTime",
    label: "业务锁单时间",
    showOverflowTooltip: true,
    minWidth: 120,
    align: "left",
    sortable: true
  },
  {
    prop: "financeLockTime",
    label: "财务锁单时间",
    showOverflowTooltip: true,
    minWidth: 120,
    align: "left",
    sortable: true
  },
  {
    prop: "dataStatus",
    label: "状态",
    showOverflowTooltip: true,
    customRow: true,
    basicType: 'lockStatus',
    align: "left",
    sortable: true,
  },
  {
    prop: "createBy",
    label: "创建人",
    width: 120,
    align: "left",
    fixed: 'right',
    sortable: true,
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 200,
    align: "left",
    fixed: 'right',
    sortable: true,
  },
  {
    label: "操作",
    prop: "operation",
    customRow: true,
    fixed: 'right',
    width: 100,
    sortable: true
  },
]



export { searchColumns, tableColumns };
