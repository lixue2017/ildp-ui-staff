
const FROM_COLS_1 = {
  span: 12,
  id: "startPortName",
  label: "起运港",
  type: "txt",
}
const FROM_COLS_2 = {
  span: 12,
  id: "endPortName",
  label: "目的港",
  type: "txt",
}
const FROM_COLS_3 = {
  span: 12,
  id: "airShipCompanyName",
  label: "船/航空公司",
  type: "txt",
}
const FROM_COLS_3_1 = {
  ...FROM_COLS_3,
  label: "车行/快递公司",
}
const FROM_COLS_4 = {
  span: 12,
  id: "sailingSchedule",
  label: "航程",
  type: "txt",
}
const FROM_COLS_4_1 = {
  ...FROM_COLS_4,
  label: "时效",
}
const FROM_COLS_5 = {
  span: 24,
  id: "pricePeriodValidity",
  label: "有效期",
  type: "txt",
}

const formColumns = (type = 1) => [
  FROM_COLS_1,
  FROM_COLS_2,
  [FROM_COLS_3, FROM_COLS_3_1][type - 1],
  [FROM_COLS_4, FROM_COLS_4_1][type - 1],
  FROM_COLS_5,
]


const TABLE_COLS_INDEX = {
  prop: "index",
  label: "序号",
  mixWidth: 200,
  fixed: "left",
  className: "serial-num",
  render: (row, column, cellValue, index) => {
    return index + 1
  }
}
const TABLE_COLS_1 = {
  label: "费用名称",
  prop: "costName",
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  label: "价格",
  prop: "unitPrice",
  showOverflowTooltip: true,
}
const TABLE_COLS_3 = {
  label: "数量",
  prop: "num",
  showOverflowTooltip: true,
}
const TABLE_COLS_4 = {
  label: "金额",
  prop: "amount",
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  label: "币别",
  prop: "currencyName",
  showOverflowTooltip: true,
}

const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5
]

export { formColumns, tableColumns }