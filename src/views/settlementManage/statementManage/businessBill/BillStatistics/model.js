const columnData = [
  {
    id: 1,
    name: "应收",
    RMB: 3000,
    USD: 0,
    GBP: 2000,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 2,
    name: "应付",
    RMB: 2000,
    USD: 0,
    GBP: 3000,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 3,
    name: "小计",
    RMB: 0,
    USD: 0,
    GBP: 0,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 4,
    name: "(已对帐)应收",
    RMB: 33,
    USD: 12,
    GBP: 0,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 5,
    name: "(已对帐)应付",
    RMB: 555,
    USD: 111,
    GBP: 0,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 6,
    name: "(已对帐)小计",
    RMB: 0,
    USD: 0,
    GBP: 0,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 7,
    name: "(已销帐)应收",
    RMB: 0,
    USD: 0,
    GBP: 0,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 8,
    name: "(已销帐)应付",
    RMB: 0,
    USD: 0,
    GBP: 0,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
  {
    id: 9,
    name: "(已销帐)小计",
    RMB: 0,
    USD: 0,
    GBP: 0,
    HKD: 0,
    EUR: 0,
    AUD: 0,
    bwb: 0,
    fzb: 0,
  },
]



export { columnData };

const TABLE_COL_0 = {
  label: "",
  prop: "currencyName",
  minWidth: 120,
  className: "border-right",
}
const TABLE_COL_1 = {
  prop: "wdz",
  label: "未对账",
  multiHeader: true,
  className: "border-right",
  list: [{
    label: '应收',
    prop: 'notReconciliationReceivable',
		decimal: 2,
		colFormat: "thousandthMark",
    minWidth: 80
  }, {
    label: '应付',
    prop: 'notReconciliationPayable',
		decimal: 2,
		colFormat: "thousandthMark",
    minWidth: 80
  }, {
    label: '小计',
    prop: 'moneySubtotal',
    minWidth: 80,
    customRow: true,
    className: "border-right",
  }]
}
const TABLE_COL_2 = {
  prop: "ydz",
  label: "已对账",
  multiHeader: true,
  className: "border-right",
  list: [{
    label: '应收',
    prop: 'reconciliationReceivable',
		decimal: 2,
		colFormat: "thousandthMark",
    minWidth: 80
  }, {
    label: '应付',
    prop: 'reconciliationPayable',
		decimal: 2,
		colFormat: "thousandthMark",
    minWidth: 80
  }, {
    label: '小计',
    prop: 'recMoneySubtotal',
    minWidth: 80,
    customRow: true,
    className: "border-right",
  }]
}
const TABLE_COL_3 = {
  prop: "yhx",
  label: "已核销",
  multiHeader: true,
  className: "border-right",
  list: [{
    label: '应收',
    prop: 'writeOffReceivable',
		decimal: 2,
		colFormat: "thousandthMark",
    minWidth: 80
  }, {
    label: '应付',
    prop: 'writeOffPayable',
		decimal: 2,
		colFormat: "thousandthMark",
    minWidth: 80
  }, {
    label: '小计',
    prop: 'writeSubtotal',
    customRow: true,
    minWidth: 80
  }]
}

export const tableColumns = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3
]
