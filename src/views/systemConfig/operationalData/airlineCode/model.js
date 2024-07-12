import { DATA_STATUS, DATA_ROUTETYPE, DATA_PUBLICTYPE } from "@/utils/mixin"
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
    label: "航线代码：",
    placeholder: "航线代码",
    type: "text",
  },
  {
    id: "name",
    label: "航线名称：",
    placeholder: "航线名称",
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
    prop: "code",
    label: "航线代码",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameCn",
    label: "航线名称(CN)",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameEn",
    label: "航线名称(EN)",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "lineType",
    label: "航线类型",
    customRow: true,
    showOverflowTooltip: true,
    sortable:true,
    basicType: 'transportMode'
  },
  {
    prop: "remark",
    showOverflowTooltip: true,
    sortable:true,
    label: "备注",
  },
  {
    prop: "routeCode",
    label: "航线路径编码",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "isPublic",
    label: "公共",
    customRow: true,
    sortable:true,
    showOverflowTooltip: true
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
    airlineCode: "印巴线",
    routeNameCN: "印巴线",
    routeNameEN: "India Pakistan line",
    lineType: "0",
    remark: "非接口数据,本地写死测试用,最长2000字",
    routeCode: "1001",
    publicType: '0',
    status: "0",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 1,
    airlineCode: "南美线",
    routeNameCN: "南美线",
    routeNameEN: "South American line",
    lineType: "1",
    remark: "非接口数据,本地写死测试用,最长2000字",
    routeCode: "1001",
    publicType: '1',
    status: "1",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 1,
    airlineCode: "日韩线",
    routeNameCN: "日韩线",
    routeNameEN: "Japan South Korea Line",
    lineType: "2",
    remark: "非接口数据,本地写死测试用,最长2000字",
    routeCode: "1001",
    publicType: '1',
    status: "2",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
]

export { searchColumns, tableColumns, columnData, DATA_STATUS, DATA_ROUTETYPE, DATA_PUBLICTYPE };
