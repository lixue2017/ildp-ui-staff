import { toFixedNum } from '@/utils/instructions'

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "code",
  label: "包材代码：",
  placeholder: "包材代码",
  type: "text"
}
const SEARCH_COL_3 = {
  id: "type",
  label: "类型：",
  placeholder: "类型",
  type: "select",
  basicType: "packagingInfoType"
}
const SEARCH_COL_4 = {
  id: "nameCn",
  label: "名称：",
  placeholder: "名称",
  type: "text"
}

export const searchColumns = [
  {
    className: "search-form-width",
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              SEARCH_COL_2,
              SEARCH_COL_3,
              SEARCH_COL_4
            ],
          },
        ],
      },
    ],
  },
]

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center"
}
const TABLE_COL_1 = {
  prop: "code",
  label: "包材代码",
  minWidth: 150,
  // customRow: true,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_2 = {
  prop: "nameCn",
  label: "包材名称(CN)",
  minWidth: 140,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_3 = {
  prop: "nameEn",
  label: "包材名称(EN)",
  minWidth: 140,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_4 = {
  prop: "type",
  label: "类型",
  minWidth: 120,
  basicType: "packagingInfoType",
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_5 = {
  prop: "warehouseName",
  label: "关联仓库",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_6 = {
  prop: "length",
  label: "尺寸(长*宽*高)/CM",
  minWidth: 170,
  sortable:true,
  showOverflowTooltip: true,
  render: (row) => `${toFixedNum(row.length)}*${toFixedNum(row.width)}*${toFixedNum(row.height)}`
}
const TABLE_COL_7 = {
  prop: "weight",
  label: "重量/KG",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true,
  render: (row) => toFixedNum(row.weight, 4)
}
const TABLE_COL_8 = {
  prop: "defaultPackingMaterials", // 0-否 1-是
  label: "默认包材",
  minWidth: 100,
  sortable:true,
  showOverflowTooltip: true,
  render: (row) => ['否', '是'][row.defaultPackingMaterials || 0]
}
const TABLE_COL_9 = {
  prop: "isPacking", // 0-否 1-是
  label: "按单打包",
  minWidth: 100,
  sortable:true,
  showOverflowTooltip: true,
  render: (row) => ['否', '是'][row.isPacking || 0]
}
const TABLE_COL_10 = {
  prop: "num",
  label: "数量",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_11 = {
  prop: "status", // 0-未启用 1-已启用
  label: "状态",
  customRow: true,
  sortable:true,
  minWidth: 120,
  basicType: "status"
}
const TABLE_COL_12 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 136,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_13 = {
  prop: "updateTime",
  label: "更新时间",
  minWidth: 136,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13
]
export const tableColumns = (tab = 0) => {
  return [TABLE_TAB_1][tab]
}
