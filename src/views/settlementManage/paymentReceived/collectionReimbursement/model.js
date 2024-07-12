import { httpUserSelect, httpCrmListSelect } from "@/comModel/httpSelect";
import { toFixedNum } from "@/utils/instructions";

const DLG_FORM_COL_1 = {
  span: 8,
  id: "businessCompanyName",
  label: "主体：",
  type: "txt",
};
const DLG_FORM_COL_2 = {
  span: 8,
  id: "accountObj",
  selectLabelKey: "bankAccount",
  label: "收款账号：",
  placeholder: "请选择",
  ...httpCrmListSelect({
    labelKey: "bankAccount",
  }),
  isBackAll: true,
  type: "slot",
};
const DLG_FORM_COL_3 = {
  span: 8,
  id: "openingBank",
  label: "开户行：",
  type: "txt",
};
const DLG_FORM_COL_4 = {
  span: 8,
  id: "bankReceiptCurrencyCode",
  label: "币别：",
  type: "txt",
};
const DLG_FORM_COL_5 = {
  span: 8,
  id: "totalMoney",
  label: "核销金额：",
  type: "txt",
  render: (row) => `${toFixedNum(row.totalMoney)} ${row.currencyCode || "--"}`,
};
const DLG_FORM_COL_6 = {
  span: 8,
  id: "dealDate",
  label: "水单时间：",
  placeholder: "年-月-日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const DLG_FORM_COL_7 = {
  span: 8,
  id: "exchangeLoss",
  label: "汇兑损益：",
  placeholder: "请输入",
  type: "inputNumber",
  value: 0,
  numDecimal: 2,
  unitKey: "bankReceiptCurrencyCode",
};
const DLG_FORM_COL_8 = {
  span: 8,
  id: "serviceCharge",
  label: "手续费：",
  placeholder: "手续费",
  selectKey: "serviceChargeCurrencyId",
  selectPlaceholder: "币别",
  numDecimal: 4,
  value: 0,
  type: "inputNumber",
};
const DLG_FORM_COL_9 = {
  span: 8,
  id: "financialRemark",
  label: "收款原因：",
  type: "txt",
};
const DLG_FORM_COL_10 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
};
const DLG_FORM_COL_11 = {
  span: 8,
  id: "verificationBy",
  selectLabelKey: "verificationByName",
  label: "收款核销人：",
  placeholder: "请选择",
  ...httpUserSelect(),
};
const DLG_FORM_COL_12 = {
  span: 24,
  id: "attachId",
  labelWidth: "12px",
  type: "customUploadFile",
  tipsTop: true,
};
const DLG_FORM_COL_13 = {
  span: 8,
  id: "bankReceiptMoney",
  label: "水单金额：",
  type: "txt",
  render: (row) =>
    `${toFixedNum(row.bankReceiptMoney)} ${
      row.bankReceiptCurrencyCode || "--"
    }`,
};
const DLG_FORM_COL_14 = {
  span: 8,
  id: "bxMoney",
  label: "佰信核销：",
  type: "txt",
  render: (row) =>
    `${toFixedNum(row.bxMoney)} ${row.bankReceiptCurrencyCode || "--"}`,
};

const DLG_FORM_COL_201 = {
  span: 24,
  id: "checkRemark",
  label: "收款确认备注：",
  type: "txt",
};
const DLG_FORM_COL_202 = {
  span: 8,
  id: "verificationByName",
  label: "收款确认人：",
  type: "txt",
};
const DLG_FORM_COL_203 = {
  ...DLG_FORM_COL_10,
  label: "核销备注：",
};
const collectionCols = [
  DLG_FORM_COL_1, //主体
  DLG_FORM_COL_3, //开花行
  DLG_FORM_COL_4, //币别
  DLG_FORM_COL_5, //核销金额
  DLG_FORM_COL_13, //水单金额
  DLG_FORM_COL_14, // 佰信核销
];

/** 收款确认 */
const collectionConfirmCols = [
  ...collectionCols,
  DLG_FORM_COL_2, //收款账号
  DLG_FORM_COL_6, //水单时间
  DLG_FORM_COL_7, //汇兑损益
  DLG_FORM_COL_8, //手续费
  DLG_FORM_COL_11, //收款核销人
  DLG_FORM_COL_9, //收款原因
  DLG_FORM_COL_10, //备注
  DLG_FORM_COL_12, //上传
];

/** 收款核销 */
const collectionWriteOffCols = [
  ...collectionCols,
  DLG_FORM_COL_202, //收款确认人
  DLG_FORM_COL_2, //收款账号
  DLG_FORM_COL_6, //水单时间
  DLG_FORM_COL_7, //汇兑损益
  DLG_FORM_COL_8, //手续费
  DLG_FORM_COL_9, //收款原因
  DLG_FORM_COL_201, //收款确认备注
  DLG_FORM_COL_203, //核销备注
  DLG_FORM_COL_12, //上传
];

export const editDlgFormCols = (obj) => {
  const { modelType = "collectionConfirm" } = obj || {};
  const colObj = {
    collectionConfirm: collectionConfirmCols,
    collectionWriteOff: collectionWriteOffCols,
  };
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: colObj[modelType],
            },
          ],
        },
      ],
    },
  ];
};

export const dlgFormRules = () => {
  return {
    accountObj: [
      { required: true, message: "请选择收款账号", trigger: "change" },
    ],
    dealDate: [
      { required: true, message: "请选择水单时间", trigger: "change" },
    ],
    verificationBy: [
      { required: true, message: "请选择收款核销人", trigger: "change" },
    ],
    attachId: [{ required: true, message: "请上传附件", trigger: "change" }],
  };
};
