import { httpCostTypeSelect } from "@/comModel/httpSelect";
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "costTypeId",
  label: "费用类型",
  minWidth: 120,
  basicType: "costFreeType",
};
const TABLE_COLS_2 = {
  prop: "chargeUnit",
  label: "计费单位",
  minWidth: 120,
  basicType: "saleOptPriceConfigChargeUnit",
};
const TABLE_COLS_3 = {
  prop: "beginValue",
  label: "开始值",
  minWidth: 120,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
    disabled: true,
  },
};
const TABLE_COLS_4 = {
  prop: "endValue",
  label: "结束值",
  minWidth: 120,
  request: true,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
};
const TABLE_COLS_5 = {
  prop: "minPrice",
  label: "最低收费",
  minWidth: 120,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
};
const TABLE_COLS_6 = {
  prop: "maxPrice",
  label: "最高收费",
  minWidth: 120,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
};
const TABLE_COLS_7 = {
  prop: "unitNum",
  label: "单位数量",
  minWidth: 120,
  request: true,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
};
const TABLE_COLS_8 = {
  prop: "basePlus",
  label: "基数(加收)",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
};
const TABLE_COLS_9 = {
  prop: "singlePrice",
  label: "单价",
  minWidth: 120,
  request: true,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
};
const TABLE_COLS_10 = {
  prop: "priceCurrencyId",
  label: "币别",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "autocomplete",
    category: "currency",
    isAutoInitRequest: true,
    selectLabelKey: "priceCurrencyName",
  },
  render: (row) => row.priceCurrencyName,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 100,
  customRow: true,
  showOverflowTooltip: true,
  fixed: "right",
};
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_9,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  // TABLE_COLS_8,
  // TABLE_COLS_10,
];

const formRule = {};
tableColumns.forEach((item) => {
  if (item.request) {
    formRule[item.prop] = item.message || `${item.label}不能为空！`;
  }
});

export function handleRule(params) {
  for (let key in formRule) {
    // && params[key] !== 0
    if (!params[key]) {
      return formRule[key];
    }
  }
  return false;
}

export function handleColumns(isDetail) {
  let column = [];
  if (!isDetail) {
    column = [...tableColumns, TABLE_COLS_OPERATION];
  } else {
    tableColumns.forEach((item) => {
      const { isEdit, fieldItem, request, customRow, ...data } = item;
      column.push({
        ...data,
        showOverflowTooltip: true,
      });
    });
  }
  return column;
}
