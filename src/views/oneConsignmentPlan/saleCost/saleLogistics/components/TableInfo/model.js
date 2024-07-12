
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
const TABLE_COLS_1 = {
  prop: "table_xx_1",
  label: "收费分区",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  prop: "table_xx_2",
  label: "计费种类",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "table_xx_3",
  label: "开始重量(KG)",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 3
}
const TABLE_COLS_4 = {
  prop: "table_xx_4",
  label: "截止重量(KG)",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 3
}
const TABLE_COLS_5 = {
  prop: "table_xx_5",
  label: "计费单重",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 3
}
const TABLE_COLS_6 = {
  prop: "table_xx_6",
  label: "最低收费",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  },
  decimal: 3
}
const TABLE_COLS_7 = {
  prop: "table_xx_7",
  label: "最高收费",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  },
  decimal: 3
}
const TABLE_COLS_8 = {
  prop: "table_xx_8",
  label: "价格值",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  },
  decimal: 3
}
const tableList = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8
]
export const tableColumns = (isDetail) => {
  if (isDetail) {
    return tableList.map(item => {
      const { fieldItem, isEdit, ...data } = item
      return {
        ...data,
        showOverflowTooltip: true,
      }
    })
  }
  return tableList
}