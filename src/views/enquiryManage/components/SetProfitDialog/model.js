import { httpCabinetTypeSelect } from "@/comModel/httpSelect";
const FORM_COLS_1 = {
  span: 8,
  id: "payableType",
  label: "设置：",
  labelWidth: "55px",
  type: "radio",
  options: [
    {
      label: "按数量设置",
      value: 1,
    },
    {
      label: "按百分比设置",
      value: 2,
    },
  ],
};
const FORM_COLS_2 = {
  span: 5,
  id: "payableProfit",
  label: "批量改价：",
  type: "text",
  inputType: "number",
  decimal: 2,
};

const formColumns = [
  {
    rows: [
      {
        cols: [FORM_COLS_1, FORM_COLS_2],
      },
    ],
  },
];
export const formConfig = {
  labelWidth: "70px",
  lists: [
    {
      fieldList: formColumns,
    },
  ], // 表单渲染列表
  formRules: {
    payableType: [
      { required: true, message: "请选择设置方式", trigger: "blur" },
    ],
  },
};

const TABLE_COLS_SPACE = {
  width: 42,
  render: () => "",
};
const TABLE_COLS_1 = {
  label: "费用名称",
  prop: "costName",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  label: "价格",
  prop: "unitPrice",
  minWidth: 190,
  customRow: true,
  align: "right",
};
const TABLE_COLS_3 = {
  label: "数量",
  prop: "num",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
};
const TABLE_COLS_4 = {
  label: "金额",
  prop: "amount",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const TABLE_COLS_5 = {
  label: "币别",
  prop: "currencyName",
  minWidth: 80,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  label: "备注",
  prop: "remark",
  minWidth: 140,
  showOverflowTooltip: true,
};
export const profitColumns = [
  TABLE_COLS_SPACE,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
];
