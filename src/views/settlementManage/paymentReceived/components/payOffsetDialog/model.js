const FORM_COLS_1 = {
  span: 8,
  id: "type",
  label: "类型：",
  type: "radio",
  basicType: "expenseType",
  disable: true,
  hideList: [0, 1, 3],
};
const FORM_COLS_2 = {
  span: 8,
  id: "flowType",
  label: "流程：",
  type: "radio",
  basicType: "expenseFlow",
  disable: true,
  hideList: [0, 1, 2, 3],
};
const FORM_COLS_3 = {
  span: 8,
  id: "applicantName",
  label: "申请人：",
  type: "txt",
};
const FORM_COLS_4 = {
  span: 8,
  id: "businessCompanyName",
  label: "主体：",
  type: "txt",
};
const FORM_COLS_5 = {
  span: 8,
  id: "currencyCode",
  label: "币别：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 8,
  id: "accountName",
  label: "收款账号：",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 8,
  id: "latestPaymentDate",
  label: "预计还款日期：",
  type: "txt",
};
const FORM_COLS_8 = {
  span: 8,
  id: "totalMoney",
  label: "借款金额：",
  decimal: 2,
  type: "txt",
};
const FORM_COLS_9 = {
  span: 8,
  id: "amountWords",
  label: "金额(大写)：",
  type: "txt",
};
const FORM_COLS_10 = {
  span: 8,
  id: "UNCHARTED_FORM_10",
  label: "银行账号：",
  type: "text",
};
const FORM_COLS_11 = {
  span: 8,
  id: "repaymentMoney",
  label: "应退余额：",
  placeholder: "应退余额",
  decimal: 2,
  type: "slot",
};
const FORM_COLS_12 = {
  span: 8,
  id: "isSquare",
  labelWidth: "0",
  text: "是否结清",
  type: "slot",
};
const FORM_COLS_13 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
};
const FORM_COLS_14 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};
const FORM_COLS_15 = {
  span: 24,
  id: "attIds",
  attachIdKeyName: "attIds", // 默认为"attachId"时不传
  labelWidth: "0px",
  type: "customUploadFile",
  pasteUpload: true,
  fileParamsType: -1,
  imageCardUrl: "url",
  tipsTop: true,
};
export const formConfig = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_6,
                FORM_COLS_7,
                FORM_COLS_8,
                FORM_COLS_9,
                // FORM_COLS_10,
                FORM_COLS_11,
                // FORM_COLS_12,
                FORM_COLS_13,
                FORM_COLS_14,
                FORM_COLS_15,
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const formRules = {
  repaymentMoney: [
    { required: true, message: "请输入应退余额", trigger: "change" },
  ],
  remark: [{ required: true, message: "请输入备注", trigger: "change" }],
  attIds: [{ required: true, message: "请上传附件", trigger: "change" }],
};
