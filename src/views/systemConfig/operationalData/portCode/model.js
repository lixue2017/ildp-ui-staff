import { DATA_STATUS, DATA_ROUTETYPE, DATA_PUBLICTYPE, } from "@/utils/mixin"
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
    label: "港口代码：",
    placeholder: "港口代码",
    type: "text",
  },
  {
    id: "name",
    label: "港口名称：",
    placeholder: "港口名称",
    type: "text",
  },
  {
    id: "countryName",
    label: "国家：",
    placeholder: "国家",
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
    label: "港口代码",
    width: 100,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "nameCn",
    label: "港口名称(CN)",
    width: 140,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "nameEn",
    label: "港口名称(EN)",
    sortable: true,
    showOverflowTooltip: true,
    width:140,
  },
  {
    prop: "nameHk",
    label: "港口名称(繁体)",
    sortable: true,
    showOverflowTooltip: true,
    width:140,
  },
  {
    prop: "routeName",
    label: "航线",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "countryName",
    label: "国家",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "areaName",
    label: "区域",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "portType",
    label: "港口类型",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'transportMode',
    width: 100,
  },
  {
    prop: "isBasic",
    label: "是否基本港",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    width: 160,
  },
  {
    prop: "isSpecial",
    label: "特殊港口",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    width: 100,
  },
  {
    prop: "status",
    label: "状态",
    width: '80px',
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'status'
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: '200px',
    fixed: 'right',
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 120,
    fixed: 'right',
    sortable: true,
    showOverflowTooltip: true
  }
]
const columnData = [
  {
    id: 1,
    portCode: "ADEN",
    nameofPortCN: "亚丁",
    nameofPortEN: "ADEN",
    nameofPort: "--",
    airRoute: "--",
    state: "也门",
    area: "红海-亚丁湾",
    portType: "海运",
    basicPortorNot: "1",
    specialPort: "1",
    status: "1",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 2,
    portCode: "ADEN",
    nameofPortCN: "亚丁",
    nameofPortEN: "ADEN",
    nameofPort: "--",
    airRoute: "--",
    state: "也门",
    area: "红海-亚丁湾",
    portType: "海运",
    basicPortorNot: "1",
    specialPort: "1",
    status: "1",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 3,
    portCode: "ADEN",
    nameofPortCN: "亚丁",
    nameofPortEN: "ADEN",
    nameofPort: "--",
    airRoute: "--",
    state: "也门",
    area: "红海-亚丁湾",
    portType: "海运",
    basicPortorNot: "1",
    specialPort: "1",
    status: "1",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
]

export { searchColumns, tableColumns, columnData, DATA_STATUS, DATA_ROUTETYPE, DATA_PUBLICTYPE };
