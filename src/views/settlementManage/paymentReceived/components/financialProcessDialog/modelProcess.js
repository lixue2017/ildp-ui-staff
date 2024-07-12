import {
  httpUserSelect,
  httpAccountSelect,
  httpRoleDeptUserSelect,
} from "@/comModel/httpSelect";

const DLG_FORM_COL_1 = {
  span: 12,
  id: "businessCompanyName",
  label: "主体：",
  placeholder: "--",
  type: "txt",
};
const DLG_FORM_COL_2 = {
  span: 12,
  id: "applicantName",
  label: "申请人：",
  placeholder: "--",
  type: "txt",
};
const DLG_FORM_COL_3 = {
  span: 12,
  id: "accountName", // claimByName
  label: "收款人：",
  type: "txt",
};
const DLG_FORM_COL_4 = {
  span: 12,
  id: "currencyCode",
  label: "币别：",
  placeholder: "--",
  type: "txt",
};
const DLG_FORM_COL_5 = {
  span: 12,
  id: "latestPaymentDate",
  label: "最迟付款日：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const DLG_FORM_COL_6 = {
  span: 12,
  id: "cashier",
  label: "指定付款人：",
  placeholder: "请选择",
  // ...httpUserSelect()
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};
const DLG_FORM_COL_7 = {
  span: 12,
  id: "uploadBy",
  label: "水单上传人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
  // ...httpUserSelect()
};
const DLG_FORM_COL_8 = {
  span: 12,
  id: "verificationBy",
  label: "财务核销人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
  // ...httpUserSelect()
};
const DLG_FORM_COL_9 = {
  span: 24,
  id: "remark",
  label: "分配备注：",
  placeholder: "备注说明",
  type: "textarea",
};

// 分配任务
const DISTRIBUTION_FORM_COLS = [
  DLG_FORM_COL_1,
  DLG_FORM_COL_2,
  DLG_FORM_COL_3,
  DLG_FORM_COL_4,
  DLG_FORM_COL_5,
  DLG_FORM_COL_6,
  DLG_FORM_COL_7,
  DLG_FORM_COL_8,
  DLG_FORM_COL_9,
];
export const distributionFormConfig = (obj) => {
  return {
    columns: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: DISTRIBUTION_FORM_COLS,
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      cashier: [
        { required: true, message: "请选择指定付款人", trigger: "change" },
      ],
      uploadBy: [
        { required: true, message: "请选择水单上传人", trigger: "change" },
      ],
      verificationBy: [
        { required: true, message: "请选择财务核销人", trigger: "change" },
      ],
    },
  };
};

/** 付款登记 */
const DLG_FORM_COL_201 = {
  span: 24,
  id: "cashierRemark",
  label: "分配任务备注：",
  placeholder: "--",
  type: "txt",
};
const REGISTER_FORM_COLS = [
  DLG_FORM_COL_1,
  DLG_FORM_COL_2,
  DLG_FORM_COL_3,
  DLG_FORM_COL_4,
  DLG_FORM_COL_201,
  {
    ...DLG_FORM_COL_7,
    id: "bankReceiptCheckBy",
    selectLabelKey: "uploadByName",
    label: "水单登记人：",
  },
  {
    ...DLG_FORM_COL_9,
    label: "登记备注：",
  },
];
export const registerFormConfig = (obj) => {
  return {
    columns: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: REGISTER_FORM_COLS,
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      bankReceiptCheckBy: [
        { required: true, message: "请选择水单登记人", trigger: "change" },
      ],
    },
  };
};

/**上传水单 */
const DLG_FORM_COL_301 = {
  span: 24,
  id: "checkRemark",
  label: "付款登记备注：",
  placeholder: "--",
  type: "txt",
};
const FORM_COL_DLG_309 = {
  span: 24,
  id: "attachId",
  // attachIdKeyName: "picUrl",
  labelWidth: "0px",
  fileLabel: "上传图片",
  type: "customUploadFile",
  fileParamsType: 127,
  tipsTop: true,
};
const WATER_BILL_FORM_COLS = [
  DLG_FORM_COL_1,
  DLG_FORM_COL_2,
  DLG_FORM_COL_3,
  DLG_FORM_COL_4,
  DLG_FORM_COL_201,
  DLG_FORM_COL_301,
  {
    ...DLG_FORM_COL_8,
    selectLabelKey: "verificationByName",
    label: "财务核销人：",
  },
  {
    ...DLG_FORM_COL_9,
    label: "备注信息：",
  },
  FORM_COL_DLG_309,
];
export const waterBillFormConfig = (obj) => {
  return {
    columns: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: WATER_BILL_FORM_COLS,
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      verificationBy: [
        { required: true, message: "请选择财务核销人", trigger: "change" },
      ],
      attachId: [{ required: true, message: "请上传图片", trigger: "change" }],
    },
  };
};

/** 财务核销-1: 流程核销 */
const DLG_FORM_COL_404 = {
  span: 12,
  id: "dealDate",
  label: "水单时间：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const DLG_FORM_COL_405 = {
  span: 12,
  id: "verificationMoney",
  label: "核销金额：",
  placeholder: "核销金额",
  decimal: 4,
  type: "slot",
};
const DLG_FORM_COL_406 = {
  span: 12,
  id: "exchangeRate",
  label: "购汇汇率：",
  decimal: 10,
  type: "slot",
};
const DLG_FORM_COL_407 = {
  span: 12,
  id: "serviceCharge",
  label: "手续费：",
  placeholder: "手续费",
  decimal: 4,
  type: "slot",
};
const DLG_FORM_COL_408 = {
  span: 12,
  id: "receiptPaymentAccount",
  label: "付款账号：",
  placeholder: "请选择付款账号",
  ...httpAccountSelect({ type: "0" }),
  type: "slot",
};
const DLG_FORM_COL_411 = {
  span: 24,
  id: "uploadRemark",
  label: "上传水单备注：",
  placeholder: "--",
  type: "txt",
};
const DLG_FORM_COL_413 = {
  span: 24,
  id: "slotImgList",
  label: "水单资料：",
  type: "slot",
};
const WRITE_OFF_FORM_COLS = [
  DLG_FORM_COL_1,
  DLG_FORM_COL_2,
  DLG_FORM_COL_3,
  DLG_FORM_COL_404,
  DLG_FORM_COL_405,
  DLG_FORM_COL_406,
  DLG_FORM_COL_407,
  DLG_FORM_COL_408,
  DLG_FORM_COL_201,
  DLG_FORM_COL_301,
  DLG_FORM_COL_411,
  {
    ...DLG_FORM_COL_9,
    label: "核销备注：",
  },
  DLG_FORM_COL_413,
];
export const writeOffFormConfig = (obj) => {
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: WRITE_OFF_FORM_COLS,
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      verificationMoney: [
        { required: true, message: "请输入核销金额", trigger: "blur" },
      ],
      dealDate: [
        { required: true, message: "请选择水单时间", trigger: "change" },
      ],
      receiptPaymentAccount: [
        { required: true, message: "请选择付款账号", trigger: "change" },
      ],
    },
  };
};

/** 财务核销-2: 直接核销 财务内部单，点击财务核销，直接弹窗，输入首付款信息和水单日期 */
const DLG_FORM_COL_501 = {
  span: 12,
  id: "businessCompanyObj",
  // selectLabelKey: "showSelectName_1",
  defaultKey: "id",
  label: "付款单位：",
  placeholder: "请选择",
  ...httpAccountSelect({
    type: "0",
  }),
  isAutoInitRequest: true,
  isBackAll: true,
  type: "slot",
};
const DLG_FORM_COL_502 = {
  span: 12,
  id: "accountName",
  label: "收款单位：",
  placeholder: "请输入",
  type: "text",
};
const DLG_FORM_COL_503 = {
  span: 12,
  id: "receiptPaymentAccountOpeningBank",
  label: "开户行：",
  placeholder: "--",
  type: "txt",
};
const DLG_FORM_COL_504 = {
  span: 12,
  id: "openingBank",
  label: "开户行：",
  placeholder: "请输入",
  type: "text",
};
const DLG_FORM_COL_505 = {
  span: 12,
  id: "receiptPaymentBankAccount",
  label: "付款账号：",
  placeholder: "--",
  type: "txt",
};
const DLG_FORM_COL_506 = {
  span: 12,
  id: "bankAccount",
  label: "收款账号：",
  placeholder: "请输入",
  type: "text",
};
const DLG_FORM_COL_507 = {
  span: 12,
  id: "dealDate",
  label: "水单时间：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const DLG_FORM_COL_508 = {
  span: 12,
  id: "isJoinBs",
  text: "内部收款账号",
  type: "singleCheckbox",
};
const DLG_FORM_COL_509 = {
  span: 12,
  id: "accountId",
  label: "收款单位：",
  placeholder: "请选择收款单位",
  ...httpAccountSelect({
    type: "0",
  }),
  selectLabelKey: "accountName",
  currData: true,
  type: "slot",
};
const DLG_FORM_COL_5010 = {
  span: 12,
  id: "openingBank",
  label: "收款开户行：",
  type: "txt",
};
const DLG_FORM_COL_5011 = {
  span: 12,
  id: "bankAccount",
  label: "收款账号：",
  type: "txt",
};
const DLG_FORM_COL_5012 = {
  span: 12,
  id: "collMoney",
  label: "收款金额：",
  placeholder: "收款金额",
  type: "slot",
};
const DLG_FORM_COL_5013 = {
  span: 12,
  id: "money",
  label: "付款金额：",
  placeholder: "--",
  type: "txt",
  render: (row) => {
    return `${row.money} ${row.currencyCode}`;
  },
};
// const DIRECT_WRITE_OFF_FORM_COLS =
export const directWriteOffFormConfig = (obj) => {
  const { isJoinBs } = obj || {};
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  DLG_FORM_COL_507,
                  DLG_FORM_COL_508,
                  DLG_FORM_COL_501,
                  ...(isJoinBs ? [DLG_FORM_COL_509] : [DLG_FORM_COL_502]),
                  DLG_FORM_COL_503,
                  ...(isJoinBs ? [DLG_FORM_COL_5010] : [DLG_FORM_COL_504]),
                  DLG_FORM_COL_505,
                  ...(isJoinBs ? [DLG_FORM_COL_5011] : [DLG_FORM_COL_506]),
                  DLG_FORM_COL_5013,
                  ...(isJoinBs ? [DLG_FORM_COL_5012] : []),
                  {
                    ...DLG_FORM_COL_9,
                    id: "verificationRemark",
                    label: "核销备注：",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      businessCompanyObj: [
        { required: true, message: "请选择付款单位", trigger: "change" },
      ],
      receiptPaymentAccountOpeningBank: [
        { required: true, message: "请补充开户行", trigger: "blur" },
      ],
      receiptPaymentBankAccount: [
        { required: true, message: "请补充付款账号", trigger: "blur" },
      ],
      dealDate: [
        { required: true, message: "请选择水单时间", trigger: "change" },
      ],
      accountId: [
        { required: true, message: "请选择收款单位", trigger: "change" },
      ],
      accountName: [
        { required: true, message: "请输入收款单位", trigger: "change" },
      ],
      collMoney: [
        { required: true, message: "请输入收款金额", trigger: "change" },
      ],
    },
  };
};
