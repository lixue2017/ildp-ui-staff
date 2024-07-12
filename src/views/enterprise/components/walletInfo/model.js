const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "currIdList",
  label: "币别：",
  placeholder: "请选择",
  type: "autocomplete",
  category: "currency",
  multiple: true,
}
const SEARCH_COL_3 = {
  id: "businessTypeList",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type:"select",
  multiple: true,
  basicType:"walletOptBusinessType"
}
const SEARCH_COL_4 = {
  startId: "optPriceGe",
  endId: "optPriceLe",
  label: "操作金额：",
  startPlaceholder: "金额≤",
  endPlaceholder: "≤金额",
  type: "rangeSelect",
};
export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              SEARCH_COL_2,
              SEARCH_COL_3,
              SEARCH_COL_4,
            ],
          },
        ],
      },
    ],
  },
]




const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left"
}
const TABLE_COL_1 = {
  prop: "businessType",
  label: "业务类型",
  showOverflowTooltip: true,
  basicType:"walletOptBusinessType"
}
const TABLE_COL_2 = {
  prop: "currCode",
  label: "币别",
  align:"center",
  showOverflowTooltip: true,
}
const TABLE_COL_3 = {
  prop: "effectType",
  label: "影响类型",
  showOverflowTooltip: true,
  fontColor:true,
  basicType:"walletOptEffectType"
}
const TABLE_COL_4 = {
  prop: "oldPrice",
  label: "原始金额",
  showOverflowTooltip: true,
  decimal:2
}
const TABLE_COL_5 = {
  prop: "optPrice",
  label: "操作金额",
  showOverflowTooltip: true,
  decimal:2
}
const TABLE_COL_6 = {
  prop: "newPrice",
  label: "操作后金额",
  showOverflowTooltip: true,
  decimal:2
}
const TABLE_COL_7 = {
  prop: "remark",
  label: "备注",
  minWidth:160,
  showOverflowTooltip: true,
}
const TABLE_COL_8 = {
  prop: "createTime",
  label: "操作时间",
  minWidth:140,
  showOverflowTooltip: true,
}
const TABLE_COL_9 = {
  prop: "createUserName",
  label: "操作人",
  showOverflowTooltip: true,
}
export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
]



