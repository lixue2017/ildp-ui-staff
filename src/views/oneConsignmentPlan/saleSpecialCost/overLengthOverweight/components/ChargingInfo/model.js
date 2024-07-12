import { httpCostTypeSelect } from "@/comModel/httpSelect";
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "freightType",
  label: "货物类型",
  minWidth: 120,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "select",
    basicType: "goodsPackType",
  },
};
const TABLE_COLS_2 = {
  prop: "formula",
  label: "公式",
  minWidth: 160,
  request: true,
  isEdit: true,
  fieldItem: {
    type: "text",
    placeholder: "eg：L<15 or M<11 or S<1",
  },
};
const TABLE_COLS_3 = {
  prop: "countryRule",
  label: "国家规则",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "select",
    basicType: "countryRule",
  },
};
const TABLE_COLS_4 = {
  prop: "countryIds",
  detailProp: "countryCode",
  label: "国家编码",
  minWidth: 120,
  isEdit: true,
  fieldItem: {
    type: "autocomplete",
    category: "country",
    multiple: true,
    defaultProp: {
      value: "id",
      label: "twoCode",
    },
  },
};
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  isEdit: true,
  fieldItem: {
    type: "text",
  },
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
  // TABLE_COLS_3,
  // TABLE_COLS_4,
  TABLE_COLS_5,
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
    column = tableColumns;
  } else {
    tableColumns.forEach((item) => {
      const { isEdit, fieldItem, request, detailProp, prop, ...data } = item;
      column.push({
        ...data,
        prop: detailProp || prop,
        showOverflowTooltip: true,
        basicType: fieldItem?.basicType,
      });
    });
  }
  return column;
}
