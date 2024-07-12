const TABLE_COLS_1 = {
  prop: "costName",
  label: "费用类型",
  minWidth: 100,
  render: (row) => row.costName || "批量改价：",
};
const TABLE_COLS_2 = {
  prop: "shipCompanyName",
  label: "船公司",
  minWidth: 100,
  render: (row) => row.shipCompanyName || row.airShipCompanyName,
};
const TABLE_COLS_3 = {
  prop: "currencyCode",
  label: "币别",
  width: 70,
  render: (row) => row.currencyCode || row.currencyName,
};
const TABLE_COLS_4 = {
  prop: "priceTable",
  label: "单价",
  minWidth: 180,
  customRow: true,
};
const TABLE_COLS_5 = {
  prop: "quantity",
  label: "数量",
  minWidth: 100,
  customRow: true,
  request: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 0,
		maxNumber: 99,
  },
};
const TABLE_COLS_6 = {
  prop: "remark",
  label: "备注",
  minWidth: 150,
  customRow: true,
  fieldItem: {
    type: "text",
  },
};
const TABLE_COLS_7 = {
  prop: "boxModelName",
  label: "柜型",
  minWidth: 100,
  render: (row) => row.boxModelName || row.cabinetName,
};
export const tableColumns = [
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  // TABLE_COLS_7,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
];
