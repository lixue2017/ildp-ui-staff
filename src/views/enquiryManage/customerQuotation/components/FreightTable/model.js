const TABLE_COLS_1 = {
  prop: "title",
  label: "",
  minWidth: 160,
  customRow: true,
};
const TABLE_COLS_2 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 100,
  render: (row) => row.priceTable?.currencyCode || row.priceTable?.currencyName,
};
const TABLE_COLS_3 = {
  prop: "priceTable",
  label: "单价（原币种）",
  minWidth: 150,
  customRow: true,
};
const TABLE_COLS_4 = {
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
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  minWidth: 150,
  customRow: true,
  fieldItem: {
    type: "text",
  },
};

export const tableColumns = (
  packingMode = 0, // 0-FCL；1-LCL
  boxModelList = ["40'GP", "20'GP"]
) => {
  const tableColumns = [TABLE_COLS_1];
  if (packingMode === 0) {
    boxModelList.forEach((key) => {
      tableColumns.push({
        prop: key,
        label: key,
        minWidth: 200,
        customRow: true,
        customHeader: true,
      });
    });
    tableColumns.push(TABLE_COLS_5);
  } else {
    tableColumns.push(
      ...[TABLE_COLS_3, TABLE_COLS_4, TABLE_COLS_5]
    );
  }
  return tableColumns;
};
