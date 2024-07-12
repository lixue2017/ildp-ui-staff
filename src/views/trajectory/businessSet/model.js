import { httpUserSelect, httpDeptSelect } from '@/comModel/httpSelect'
const searchColumns = [
  {
    span: 8,
    id: "salesId",
    label: "业务员：",
    placeholder: "业务员",
    ...httpUserSelect()
  },
  {
    span: 8,
    id: "deptId",
    label: "所属部门：",
    placeholder: "所属部门",
    ...httpDeptSelect(),
  },
  {
    span: 8,
    id: "kaName",
    label: "KA：",
    placeholder: "KA",
    type: "text",
  },
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "salesName",
    label: "业务员名称",
    showOverflowTooltip: true
  },
  {
    prop: "salesNickName",
    label: "业务员昵称",
    showOverflowTooltip: true
  },
  {
    prop: "deptName",
    label: "所属部门",
    showOverflowTooltip: true
  },
  {
    prop: "kaName",
    label: "KA",
    showOverflowTooltip: true,
    render: (row) => {
      return `${row.kaName}/${row.kaNickName}`
    }
  },
]


export { searchColumns, tableColumns };
