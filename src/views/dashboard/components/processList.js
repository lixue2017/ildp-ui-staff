
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
}

const TABLE_COLS_1 = {
  label: "业务",
  prop: "name",
  minWidth: 120,
  showOverflowTooltip: true
}

const TABLE_COLS_2 = {
  label: "待办",
  prop: "db",
  width: 88,
  customRow: true,
  className: "red",
}

const TABLE_COLS_3 = {
  label: "进行中",
  prop: "jxz",
  width: 88,
  customRow: true,
}

const TABLE_COLS_4 = {
  label: "已完结",
  prop: "ywj",
  width: 88,
  customRow: true,
}

const TABLE_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  defaultExpandShow: true,
  width: 1,
  config: {
    expandConfig: {
      defaultExpandShow: true
    },
    extraConfig: {
      showHeader: false,
      stripe: false,
    },
    column: [{ ...TABLE_COLS_1, customRow: true, }, TABLE_COLS_2, TABLE_COLS_3, TABLE_COLS_4]
  }
}

export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_EXPAND,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4
]