import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
import { toFixedNum } from "@/utils/instructions";

const CONFIRM_FORM_COL_1 = {
  span: 8,
  id: "serialCode",
  label: "流水号：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_2 = {
  span: 8,
  id: "receiptPaymentBankAccount",
  label: "记账账号：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_3 = {
  span: 8,
  id: "checkTime",
  label: "登记时间：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_4 = {
  span: 8,
  id: "accountName",
  label: "对方户名：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_5 = {
  span: 8,
  id: "receiptPaymentAccountName",
  label: "记账账号名：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_6 = {
  span: 8,
  id: "checkByName",
  label: "登记人：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_7 = {
  span: 8,
  id: "bankAccount",
  label: "对方账号：",
  type: "txt",
};
const CONFIRM_FORM_COL_8 = {
  span: 8,
  id: "money",
  label: "水单金额：",
  type: "txt",
};
const CONFIRM_FORM_COL_9 = {
  span: 8,
  id: "openingBank",
  label: "银行名称：",
  type: "txt",
};
const CONFIRM_FORM_COL_10 = {
  span: 8,
  id: "openingAddress",
  label: "对方开户行：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_11 = {
  span: 8,
  id: "dealDate",
  label: "交易时间：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_12 = {
  span: 8,
  id: "payType",
  label: "收付款类型：",
  placeholder: "--",
  type: "txt",
  basicType: "billType",
};
const CONFIRM_FORM_COL_13 = {
  span: 24,
  id: "SOAInfo",
  label: "对账单信息",
  type: "slot",
};
const CONFIRM_FORM_COL_14 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};
const CONFIRM_FORM_COL_15 = {
  span: 8,
  id: "verificationBy",
  label: "财务核销人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};

const CONFIRM_FORM_COL_16 = {
  span: 24,
  id: "nRemark",
  label: "备注说明：",
  placeholder: "备注说明",
  type: "textarea",
};
const CONFIRM_FORM_COL_17 = {
  span: 8,
  id: "slotImgList",
  label: "水单资料：",
  type: "slot",
};
const CONFIRM_FORM_COL_18 = {
  span: 8,
  id: "serviceCharge",
  label: "手续费：",
  type: "inputNumber",
  numDecimal: 4,
  min: -Infinity,
  unitKey: "bankReceiptCurrencyCode",
};
const CONFIRM_FORM_COL_19 = {
  span: 8,
  id: "exchangeLoss",
  label: "汇兑损益：",
  type: "inputNumber",
  numDecimal: 4,
  min: -Infinity,
  unitKey: "bankReceiptCurrencyCode",
  // type: "txt",
  // render: (row) => {
  //   return `${row.exchangeLoss ? toFixedNum(row.exchangeLoss, 4) : '--'} ${row.bankReceiptCurrencyCode ? row.bankReceiptCurrencyCode : ''}`
  // }
};
const CONFIRM_FORM_COL_20 = {
  //BS账号信息
  span: 12,
  id: "bsAccountInfo",
  labelWidth: "0px",
  type: "slot",
};
const CONFIRM_FORM_COL_21 = {
  //对方账号信息
  span: 12,
  id: "counterpartInfo",
  labelWidth: "0px",
  type: "slot",
};
const CONFIRM_FORM_COL_22 = {
  span: 3,
  id: "waterInfo",
  labelWidth: "0px",
  type: "slot",
};
const CONFIRM_FORM_COL_23 = {
  span: 5,
  id: "claimTime",
  label: "认领时间：",
  type: "txt",
  labelWidth: "72px",
};
const CONFIRM_FORM_COL_24 = {
  span: 4,
  id: "claimByName",
  label: "认领人：",
  type: "txt",
  labelWidth: "65px",
};
const CONFIRM_FORM_COL_25 = {
  span: 5,
  id: "money",
  label: "水单金额：",
  type: "txt",
  fontTxtColor: "#63a103",
  render: (row) => {
    return `${toFixedNum(row?.money)} ${row.bankReceiptCurrencyCode}`;
  },
  labelWidth: "72px",
};
const CONFIRM_FORM_COL_26 = {
  span: 5,
  id: "moneyRemain",
  label: "剩余：",
  labelWidth: "50px",
  type: "txt",
  fontTxtColor: "#ff0000",
  render: (row) =>
    `${toFixedNum(row.moneyRemain || 0)} ${row.bankReceiptCurrencyCode}`,
};
const CONFIRM_FORM_COL_27 = {
  //水单金额全部认领
  span: 8,
  id: "isClaimAll",
  labelWidth: "0px",
  // disabled: true,
  text: "水单金额全部认领",
  type: "singleCheckbox",
};
const CONFIRM_FORM_COL_28 = {
  span: 24,
  id: "financialRemark",
  label: "业务备注：",
  type: "txt",
};
const CONFIRM_FORM_COL_29 = {
  span: 24,
  id: "checkRemark",
  label: "收款确认备注：",
  type: "txt",
};
const CONFIRM_FORM_COL_30 = {
  span: 12,
  id: "invoiceNo",
  label: "发票号：",
  type: "txt",
};
const CONFIRM_FORM_COL_31 = {
  span: 12,
  id: "invoiceMoney",
  label: "发票金额：",
  type: "txt",
  render: (row) =>
    `${toFixedNum(row.invoiceMoney) || "--"} ${row.invoiceCurrencyCode || ""}`,
};
const CONFIRM_FORM_COL_32 = {
  span: 2,
  id: "slotQuestion",
  labelWidth: "0",
  type: "slot",
};

const CONFIRM_FORM_COL_33 = {
  span: 24,
  id: "uploadWater",
  labelWidth: "0",
  type: "slot",
};
// const CONFIRM_FORM_COL_COM = [
//   CONFIRM_FORM_COL_1,
//   CONFIRM_FORM_COL_2,
//   CONFIRM_FORM_COL_3,
//   CONFIRM_FORM_COL_4,
//   CONFIRM_FORM_COL_5,
//   CONFIRM_FORM_COL_6,
//   CONFIRM_FORM_COL_7,
//   CONFIRM_FORM_COL_8,
//   CONFIRM_FORM_COL_9,
//   CONFIRM_FORM_COL_10,
//   CONFIRM_FORM_COL_11,
//   CONFIRM_FORM_COL_12,
//   CONFIRM_FORM_COL_13,
//   CONFIRM_FORM_COL_14,
// ]
// const CONFIRM_VERIFICATION_FORM_COL_COM = [
//   CONFIRM_FORM_COL_1,
//   CONFIRM_FORM_COL_2,
//   CONFIRM_FORM_COL_3,
//   CONFIRM_FORM_COL_4,
//   CONFIRM_FORM_COL_5,
//   CONFIRM_FORM_COL_6,
//   CONFIRM_FORM_COL_7,
//   CONFIRM_FORM_COL_8,
//   CONFIRM_FORM_COL_9,
//   CONFIRM_FORM_COL_10,
//   CONFIRM_FORM_COL_11,
//   CONFIRM_FORM_COL_12,
//   CONFIRM_FORM_COL_18,
//   CONFIRM_FORM_COL_19,
//   CONFIRM_FORM_COL_13,
//   CONFIRM_FORM_COL_14,
// ]

export const config = {
  collectionList: [
    //收款任务单-收款确认
    {
      title: "收款确认",
      fieldList: [
        {
          rows: [
            {
              cols: [
                CONFIRM_FORM_COL_1,
                CONFIRM_FORM_COL_11,
                CONFIRM_FORM_COL_6,
                CONFIRM_FORM_COL_20,
                CONFIRM_FORM_COL_21,
                CONFIRM_FORM_COL_22,
                CONFIRM_FORM_COL_23,
                CONFIRM_FORM_COL_24,
                CONFIRM_FORM_COL_25,
                CONFIRM_FORM_COL_26,
                CONFIRM_FORM_COL_32,
                CONFIRM_FORM_COL_14,
                CONFIRM_FORM_COL_18,
                CONFIRM_FORM_COL_19,
                CONFIRM_FORM_COL_27,
                CONFIRM_FORM_COL_28,
                CONFIRM_FORM_COL_30,
                CONFIRM_FORM_COL_31,
                CONFIRM_FORM_COL_15,
                CONFIRM_FORM_COL_16,
                CONFIRM_FORM_COL_33,
              ],
            },
          ],
        },
      ],
    },
  ],
  VerificationList: [
    //收款任务单-财务核销
    {
      title: "财务核销",
      fieldList: [
        {
          rows: [
            {
              cols: [
                CONFIRM_FORM_COL_1,
                CONFIRM_FORM_COL_11,
                CONFIRM_FORM_COL_6,
                CONFIRM_FORM_COL_20,
                CONFIRM_FORM_COL_21,
                CONFIRM_FORM_COL_22,
                CONFIRM_FORM_COL_23,
                CONFIRM_FORM_COL_24,
                CONFIRM_FORM_COL_25,
                CONFIRM_FORM_COL_26,
                CONFIRM_FORM_COL_32,
                CONFIRM_FORM_COL_14,
                CONFIRM_FORM_COL_18,
                CONFIRM_FORM_COL_19,
                CONFIRM_FORM_COL_27,
                CONFIRM_FORM_COL_28,
                CONFIRM_FORM_COL_30,
                CONFIRM_FORM_COL_31,
                CONFIRM_FORM_COL_29,
                CONFIRM_FORM_COL_16,
                CONFIRM_FORM_COL_33,
              ],
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
  },
};
// export const config = {
//   collectionList: [
//     //收款任务单-收款确认
//     {
//       title: "收款确认",
//       fieldList: [
//         {
//           rows: [
//             {
//               cols: [
//                 ...CONFIRM_FORM_COL_COM,
//                 CONFIRM_FORM_COL_15,
//                 CONFIRM_FORM_COL_18,
//                 CONFIRM_FORM_COL_19,
//                 CONFIRM_FORM_COL_16,
//                 CONFIRM_FORM_COL_17
//               ],
//             },
//           ],
//         }
//       ],
//     },
//   ],
//   VerificationList: [
//     //收款任务单-财务核销
//     {
//       title: "财务核销",
//       fieldList: [
//         {
//           rows: [
//             {
//               cols: [
//                 ...CONFIRM_VERIFICATION_FORM_COL_COM,
//                 CONFIRM_FORM_COL_16,
//                 CONFIRM_FORM_COL_17
//               ],
//             },
//           ],
//         }
//       ],
//     },
//   ],
//   formRules: {},
// }
export const tableConfig = {
  paymentList: [
    {
      type: "index",
      width: 45,
      align: "center",
    },
    {
      prop: "billNo",
      label: "财务单号",
      customRow: true,
      width: 120,
      showOverflowTooltip: true,
    },
    {
      label: "相关单位",
      prop: "dealingsCompanyName",
      width: 90,
      showOverflowTooltip: true,
    },
    // {
    //   label: "收付款流水号",
    //   prop: "serialCode",
    //   width: 140,
    //   showOverflowTooltip: true,
    // },
    {
      label: "工作单号",
      prop: "orderNo",
      width: 120,
      showOverflowTooltip: true,
    },
    {
      label: "本次开票信息",
      prop: "invoiceInfo",
      width: 120,
      showOverflowTooltip: true,
    },
    {
      label: "币别",
      width: 50,
      prop: "currencyCode",
      showOverflowTooltip: true,
    },
    {
      label: "账单金额",
      prop: "totalMoney",
      showOverflowTooltip: true,
      // customRow:true,
      width: 80,
      align: "right",
      decimal: 2,
    },
    {
      label: "已核销金额",
      prop: "writeOffMoney",
      width: 95,
      showOverflowTooltip: true,
      align: "right",
      decimal: 2,
    },
    {
      label: "本次核销(原币种)",
      prop: "verificationMoney",
      // customRow:true,
      width: 130,
      showOverflowTooltip: true,
      align: "right",
      decimal: 2,
    },
    {
      label: "本次核销(水单币种)",
      prop: "bankReceiptVerificationMoney",
      // customRow:true,
      width: 136,
      showOverflowTooltip: true,
      align: "right",
      decimal: 4,
      className: "font-bold",
    },
    {
      label: "剩余金额",
      prop: "surplusMoney",
      showOverflowTooltip: true,
      align: "right",
      decimal: 2,
    },
  ],
};
// export const tableConfig = {
//   paymentList: [
//     {
//       type: "index",
//       width: 50,
//       align: "center",
//     },
//     {
//       prop: "billNo",
//       label: "对账单号",
//       showOverflowTooltip: true
//     },
//     {
//       label: "相关单位",
//       prop: "dealingsCompanyName",
//       showOverflowTooltip: true,
//     },
//     {
//       label: "收付款流水号",
//       prop: "serialCode",
//       showOverflowTooltip: true,
//     },
//     {
//       label: "账单金额/RMB",
//       prop: "totalMoney",
//       showOverflowTooltip: true,
//     },
//     {
//       label: "已核销金额/RMB",
//       prop: "writeOffMoney",
//       showOverflowTooltip: true,
//     },
//     {
//       label: "核销中金额/RMB",
//       prop: "underwayMoney",
//       showOverflowTooltip: true,
//     },
//     {
//       label: "本次核销/RMB",
//       prop: "verificationMoney",
//       showOverflowTooltip: true,
//     },
//     {
//       label: "剩余金额/RMB",
//       prop: "surplusMoney",
//       showOverflowTooltip: true
//     },
//   ]
// }
