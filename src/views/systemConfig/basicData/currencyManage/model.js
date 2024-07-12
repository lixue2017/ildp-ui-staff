import { DATA_STATUS } from "@/utils/mixin"
const searchColumns = [
  {
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  }
];

const TABLE_COLS_INDEX={
  type: "index",
  width: 50,
  align: "center"
}

const TABLE_COLS_1={
  prop: "code",
  label: "货币Code",
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_2={
  prop: "nameEn",
  label: "货币名称(EN)",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_3={
  prop: "nameCn",
  label: "货币名称(CN)",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_4={
  prop: "countryCode",
  sortable: true,
  label: "国家编码"
}
const TABLE_COLS_5={
  prop: "leftLabeling",
  sortable: true,
  label: "标示符左"
}
const TABLE_COLS_6={
  prop: "isTabShow",
  label: "显示该币种",
  width: '110px',
  sortable: true,
  render:(row)=>{
    const {isTabShow}=row
    return isTabShow==1?'是':'否'
  }
}
const TABLE_COLS_7={
  prop: "status",
  label: "状态",
  width: '80px',
  sortable: true,
  customRow: true
}
const TABLE_COLS_8={
  prop: "createTime",
  label: "创建时间",
  width: '200px',
  sortable: true,
  fixed: 'right',
}
const TABLE_COLS_9={
  prop: "createBy",
  label: "创建人",
  minWidth: 120,
  sortable: true,
  fixed: 'right',
}


const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,  //MODEL中的配置
  fixed: 'right',
  width: '200px'
}

const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_OPERATION
]



export { searchColumns, tableColumns, DATA_STATUS };
