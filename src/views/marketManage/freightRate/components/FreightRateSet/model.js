import {
  httpCabinetTypeSelect,
  httpCurrencySelect,
} from "@/comModel/httpSelect";
const TABLE_FCL_1 = {
  prop: "boxModelName",
  label: "柜型",
  minWidth: 160,
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  fieldItem: {
    id: "boxModelId",
    ...httpCabinetTypeSelect,
    selectLabelKey: "boxModelName",
    defaultProp: {
      value: "id",
      label: "code",
    },
    disabledArr: [29, 32],
  },
};
const TABLE_FCL_2 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 160,
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  fieldItem: {
    id: "currencyId",
    ...httpCurrencySelect,
    selectLabelKey: "currencyCode",
  },
};
const TABLE_FCL_3 = {
  prop: "price",
  label: "价格",
  minWidth: 160,
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 2,
    maxNumber: 999999999.99,
  },
};
const TABLE_LCL_1 = {
  prop: "startValue",
  label: "开始值",
  minWidth: 160,
  showOverflowTooltip: true,
  decimal: 2,
};
const TABLE_LCL_2 = {
  prop: "endValue",
  label: "结束值",
  minWidth: 160,
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 2,
  },
};
const TABLE_LCL_3 = {
  prop: "price",
  label: "单价",
  minWidth: 160,
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  fieldItem: {
    id: "price",
    type: "inputNumber",
    decimal: 2,
  },
  fieldItem2: {
    id: "currencyId",
    selectLabelKey: "currencyCode",
    placeholder: "币别",
    ...httpCurrencySelect,
  },
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 120,
  columnOperation: true,
  fixed: "right",
};
const FORM_COLS_1 = {
  span: 12,
  id: "pricingType",
  label: "按体积/重量：",
  type: "radio",
  basicType: "pricingType",
  className: "pricing-type",
};
const FORM_COLS_2 = {
  span: 12,
  id: "minBillingValue",
  label: "最小计费值：",
  type: "inputNumber",
  numDecimal: 2,
  tip: "valTip",
  className: "min-billing",
};
const tableColumnsFCL = [
  TABLE_FCL_1,
  TABLE_FCL_2,
  TABLE_FCL_3,
  TABLE_COLS_OPERATION,
];
const tableColumnsLCL = [
  TABLE_LCL_1,
  TABLE_LCL_2,
  TABLE_LCL_3,
  TABLE_COLS_OPERATION,
];
const formColumnsLCL = [FORM_COLS_1, FORM_COLS_2];
const formConfig = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: formColumnsLCL,
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    pricingType: [
      {
        required: true,
        message: "请选择按体积/重量",
        trigger: "change",
      },
    ],
    minBillingValue: [
      {
        required: true,
        message: "请输入最小计费值",
        trigger: "change",
      },
    ],
  },
};
export { tableColumnsFCL, tableColumnsLCL, formConfig };
