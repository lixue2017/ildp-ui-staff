import { httpCostTypeSelect } from "@/comModel/httpSelect";
const TABLE_COLS_INDEX = {
  type: "index",
  width: 80,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  isEdit: true,
  request: true,
  message: "请选择类型",
  fieldItem: {
    type: "select",
    placeholder: "类型",
    basicType: "billType",
  },
};
const TABLE_COLS_2 = {
  prop: "costId",
  label: "费用名称",
  isEdit: true,
  request: true,
  message: "请选择费用名称",
  fieldItem: {
    id: "costId",
    size: "mini",
    selectLabelKey: "costName",
    placeholder: "费用名称",
    ...httpCostTypeSelect({ type: 1 }),
  },
};
const TABLE_COLS_3 = {
  prop: "currencyCode",
  label: "币种",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "money",
  label: "金额",
  isEdit: true,
  request: true,
  fieldItem: {
    type: "inputNumber",
    placeholder: "金额",
    decimal: 2,
  },
};
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  isEdit: true,
  fieldItem: {
    type: "text",
    placeholder: "备注",
    maxlength: 250,
  },
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true, //MODEL中的配置
  fixed: "right",
};
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_OPERATION,
];
const formRule = {};
tableColumns.forEach((item) => {
  if (item.request) {
    formRule[item.prop] = item.message || `请输入${item.label}！`;
  }
});
function handleRule(params) {
  for (let key in formRule) {
    console.log(key);
    if (!params[key] && params[key] !== 0) {
      return formRule[key];
    }
  }
  return false;
}

export { tableColumns, handleRule };
