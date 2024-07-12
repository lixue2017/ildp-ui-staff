const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "costPartitionInfoName",
  label: "收费分区",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => `${row.costPartitionInfoCode}[${row.costPartitionInfoName}]`,
};
const TABLE_COLS_2 = {
  prop: "chargingType",
  label: "计费种类",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "chargingType",
  fontColor: true,
};
const TABLE_COLS_3 = {
  prop: "beginWeight",
  label: "开始重量(KG)",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 3,
};
const TABLE_COLS_4 = {
  prop: "endWeight",
  label: "截止重量(KG)",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 3,
};
const TABLE_COLS_5 = {
  prop: "chargingSingleWeight",
  label: "计费单重",
  minWidth: 120,
  showOverflowTooltip: true,
  decimal: 3,
};
const TABLE_COLS_6 = {
  prop: "minPrice",
  label: "最低收费",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
  decimal: 3,
  customRow: true,
};
const TABLE_COLS_7 = {
  prop: "maxPrice",
  label: "最高收费",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
  decimal: 3,
  customRow: true,
};
const TABLE_COLS_8 = {
  prop: "price",
  label: "价格值",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
  decimal: 3,
};
const tableList = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
];
export const tableColumns = (isDetail) => {
  if (isDetail) {
    return tableList.map((item) => {
      const { fieldItem, isEdit, ...data } = item;
      return {
        ...data,
        showOverflowTooltip: true,
        customRow: false,
      };
    });
  }
  return tableList;
};
