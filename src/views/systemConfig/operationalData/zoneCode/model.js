import { DATA_STATUS,  DATA_PUBLICTYPE } from "@/utils/mixin"
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
    label: "区域代码：",
    placeholder: "区域代码",
    type: "text",
  },
  {
    id: "name",
    label: "区域名称：",
    placeholder: "区域名称",
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
    label: "区域代码",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameCn",
    label: "区域名称(CN)",
    width: 150,
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "nameEn",
    label: "区域名称(EN)",
    sortable:true,
    showOverflowTooltip: true
  },
  {
    prop: "isChina",
    label: "国内区域",
    customRow: true,
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
    zoneCode: "EEURO",
    areaNameCN: "东欧",
    areaNameEN: "EASTERN EUROPE",
    domesticArea: "0",
    remarks: "非接口数据,最长2000字",
    status: "0",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 1,
    zoneCode: "MAFCA",
    areaNameCN: "非洲地中海岸",
    areaNameEN: "MEDITERRANEAN AFRICA",
    domesticArea: "1",
    remarks: "非接口数据,最长2000字",
    status: "1",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  },
  {
    id: 1,
    zoneCode: "YRD",
    areaNameCN: "中国长三角区",
    areaNameEN: "Yangtze River Delta Region",
    domesticArea: "0",
    remarks: "非接口数据,最长2000字",
    status: "2",
    createTime: "2022-05-10 11:07:09",
    updateBy: "admin"
  }
]

export { searchColumns, tableColumns, columnData, DATA_STATUS, DATA_PUBLICTYPE };
