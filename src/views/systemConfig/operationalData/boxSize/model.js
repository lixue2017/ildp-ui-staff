import { DATA_STATUS, DATA_ROUTETYPE, DATA_PUBLICTYPE, DATA_SIZE, DATA_BOX } from "@/utils/mixin"
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
    id: "code",
    label: "代码：",
    placeholder: "代码",
    type: "text",
  },
  {
    id: "name",
    label: "名称：",
    placeholder: "名称",
    type: "text",
  },
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    showOverflowTooltip: true
  },
  {
    prop: "code",
    label: "代码",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameCn",
    label: "名称(CN)",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameEn",
    label: "名称(EN)",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "size",
    label: "尺寸",
    customRow: true,
    sortable:true,
    showOverflowTooltip: true,
    basicType: 'size'
  },
  {
    prop: "box",
    label: "箱型",
    customRow: true,
    sortable:true,
    showOverflowTooltip: true,
    basicType: 'box'
  },
  {
    prop: "expandVal",
    label: "拓展值",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "remark",
    sortable:true,
    showOverflowTooltip: true,
    label: "备注",
  },
  {
    prop: "status",
    label: "状态",
    width: '80px',
    customRow: true,
    sortable:true,
    showOverflowTooltip: true,
    basicType: 'status'
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: '200px',
    fixed: 'right',
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 120,
    fixed: 'right',
    sortable:true,
    showOverflowTooltip: true
  }
]
const columnData = [
  {
    id: 1,
    code: "20'FL",
    nameCN: "20'FL",
    nameEN: "--",
    size: "20",
    cubeType: "FL",
    expandtheValue: "--",
    remark: "非接口数据，最长2000文字",
    status: "0",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 2,
    code: "20'FR",
    nameCN: "20尺框架柜",
    nameEN: "--",
    size: "20",
    cubeType: "FR",
    expandtheValue: "22P1",
    remark: "非接口数据，最长2000文字",
    status: "1",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 3,
    code: "20'GP",
    nameCN: "20'GP",
    nameEN: "--",
    size: "20",
    cubeType: "GP",
    expandtheValue: "22G1|22G0|2200",
    remark: "非接口数据，最长2000文字",
    status: "2",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  }
]

export { searchColumns, tableColumns, columnData, DATA_STATUS, DATA_ROUTETYPE, DATA_PUBLICTYPE, DATA_SIZE, DATA_BOX };
