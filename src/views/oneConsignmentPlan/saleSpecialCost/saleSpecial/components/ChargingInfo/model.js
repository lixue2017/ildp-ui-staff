import { httpGetCostSpecialChargesRule } from "@/comModel/httpSelect";
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "costSpecialChargesRuleId",
  label: "特殊规则",
  minWidth: 170,
  request: true,
  customRow: true,
  fieldItem: {
    ...httpGetCostSpecialChargesRule(),
    isBackAll: true,
    searchParamName: "codeLike",
    selectLabelKey: "costSpecialChargesCode",
  },
  render: (row) => row.costSpecialChargesCode || "--",
};
const TABLE_COLS_2 = {
  prop: "typeName",
  label: "类型",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "channelSupport",
  label: "渠道支持",
  minWidth: 120,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_4 = {
  prop: "settleCostTypeName",
  label: "费用类型",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "costPartitionInfoName",
  label: "计费分区",
  minWidth: 120,
  showOverflowTooltip: true,
  render: () => "全部",
  // request: true,
  // isEdit: true,
  // fieldItem: {
  //   type: "inputNumber",
  //   decimal: 3
  // },
};
const TABLE_COLS_6 = {
  prop: "billUnit",
  label: "计费单位",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "select",
    basicType: "costSpecialChargesPriceBillUnit",
  },
};
const TABLE_COLS_7 = {
  prop: "resultMoney",
  label: "结果值",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 3,
  },
};
const TABLE_COLS_8 = {
  prop: "currencyId",
  label: "币别",
  minWidth: 120,
  isEdit: true,
  request: true,
  fieldItem: {
    type: "autocomplete",
    category: "currency",
    isAutoInitRequest: true,
    selectLabelKey: "currencyName",
  },
  render: (row) => row.currencyName,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 100,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};
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
];

const formRule = {};
tableColumns.forEach((item) => {
  if (item.request) {
    formRule[item.prop] = item.message || `${item.label}不能为空！`;
  }
});

export function handleRule(params) {
  for (let key in formRule) {
    if (!params[key] && params[key] !== 0) {
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
        basicType: fieldItem?.basicType,
      });
    });
  }
  return column;
}
