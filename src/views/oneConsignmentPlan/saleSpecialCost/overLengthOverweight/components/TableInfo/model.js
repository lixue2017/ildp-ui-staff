
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
const TABLE_COLS_1 = {
  prop: "table_xx_1",
  label: "费用类型",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "select",
    basicType: "costType"
  }
}
const TABLE_COLS_2 = {
  prop: "table_xx_2",
  label: "计费单位",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "select",
    basicType: "costType"
  }
}
const TABLE_COLS_3 = {
  prop: "table_xx_3",
  label: "开始值",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  }
}
const TABLE_COLS_4 = {
  prop: "table_xx_4",
  label: "结束值",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  }
}
const TABLE_COLS_5 = {
  prop: "table_xx_5",
  label: "最低收费",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  }
}
const TABLE_COLS_6 = {
  prop: "table_xx_6",
  label: "最高收费",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  }
}
const TABLE_COLS_7 = {
  prop: "table_xx_7",
  label: "单位数量",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  }
}
const TABLE_COLS_8 = {
  prop: "table_xx_8",
  label: "基数(加收)",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  }
}
const TABLE_COLS_9 = {
  prop: "table_xx_9",
  label: "单价",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3
  }
}
const TABLE_COLS_10 = {
  prop: "table_xx_10",
  label: "币别",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "autocomplete",
    category: "currency",
    isAutoInitRequest: true
  }
}
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 150,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
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
  TABLE_COLS_10,
]

export function handleColumns(isDetail) {
  let column = []
  if (!isDetail) {
    column = [
      ...tableColumns,
      TABLE_COLS_OPERATION
    ]
  } else {
    tableColumns.forEach(item => {
      const { isEdit, fieldItem, request, ...data } = item
      column.push({
        ...data,
        showOverflowTooltip: true,
      })
    })
  }
  return column
}