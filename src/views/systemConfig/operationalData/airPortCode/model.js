import { DATA_STATUS, DATA_ROUTETYPE,DATA_PUBLICTYPE } from "@/utils/mixin"
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
    align: "center"
  },
  {
    prop: "code",
    label: "港口代码",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameCn",
    label: "港口名称(CN)",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameEn",
    label: "港口名称(EN)",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "countryName",
    label: "国家",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "areaName",
    label: "区域",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "isSpecial",
    label: "特殊港口",
    sortable:true,
    showOverflowTooltip: true,
    customRow: true
  },
  {
    prop: "status",
    label: "状态",
    width: '80px',
    customRow: true,
    sortable:true,
    showOverflowTooltip: true
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
    portCode:"AAE",
    nameofPortCN:"安纳巴",
    nameofPortEN:"ANNABA",
    state:"阿尔及利亚",
    area:"非洲",
    specialPort:"1",
    status:"0",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 2,
    portCode:"AAR",
    nameofPortCN:"奥胡斯",
    nameofPortEN:"AARHUS",
    state:"丹麦",
    area:"欧洲",
    specialPort:"0",
    status:"0",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 3,
    portCode:"ABD",
    nameofPortCN:"阿巴达",
    nameofPortEN:"ABADAN",
    state:"暂无",
    area:"暂无",
    specialPort:"1",
    status:"0",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  }
]

export { searchColumns, tableColumns, columnData, DATA_STATUS, DATA_ROUTETYPE,DATA_PUBLICTYPE };
