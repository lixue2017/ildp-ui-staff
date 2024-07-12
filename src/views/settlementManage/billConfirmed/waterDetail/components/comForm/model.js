const FORM_COLS_1 = {
  span: 8,
  id: "dealDate",
  label: "交易时间：",
  type: "txt",
  txtTagArr: [
    {
      tagColor: "green",
      basicType: "billType",
      basicTypeVal: "payType",
    },
  ],
};
const FORM_COLS_2 = {
  span: 16,
  id: "checkByName",
  label: "水单认领人：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 12,
  id: "bsAccountInfo",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_4 = {
  span: 12,
  id: "counterpartInfo",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_5 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 8,
  id: "invoiceNo",
  label: "发票流水号：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 8,
  id: "form_xx_7",
  label: "发票金额：",
  placeholder: "--",
  type: "txt",
  render: (row) =>
    `${row.invoiceMoney || "--"} ${row.invoiceCurrencyCode || ""}`,
};
const FORM_COLS_8 = {
  span: 8,
  id: "drawerName",
  label: "开票人：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_NBSP = (num) => {
  //占位符
  return {
    span: num,
    type: "slot",
  };
};

const formConfig = (type) => {
  return {
    0: [
      FORM_COLS_1, //交易时间
      FORM_COLS_NBSP(16),
      FORM_COLS_6, //发票流水号
      FORM_COLS_7, //发票金额
      FORM_COLS_8, //开票人
      FORM_COLS_3, //BS账户信息
      FORM_COLS_4, //对方账户信息
      FORM_COLS_5, //备注
    ],
    1: [
      FORM_COLS_1, //交易时间
      FORM_COLS_2, //水单认领人
      FORM_COLS_6, //发票流水号
      FORM_COLS_7, //发票金额
      FORM_COLS_8, //开票人
      FORM_COLS_3, //BS账户信息
      FORM_COLS_4, //对方账户信息
      FORM_COLS_5, //备注
    ],
  }[type];
};

export const comFormConfig = (row = {}) => {
  const { WEBType, payType } = row;
  const COLS = formConfig(payType);
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: COLS,
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      // warehouseId: [
      //   { required: true, message: "请选择计费仓", trigger: "change" },
      // ],
    },
  };
};
