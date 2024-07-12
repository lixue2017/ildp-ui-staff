import { httpUserSelect, httpAccountSelect, httpgetAccountInfoFromSD } from '@/comModel/httpSelect';
import { getPaymentOrderNoInfo } from "@/api/settlementManage/paymentReceived.js";

const ACCOUNT_LABEL = {
	getCustomData: (item) => {
		const label = `${item.code || "--"}/${item.bankAccount || "--"}`;
    const title = `${item.shortName || item.customerName || "--"}/${
      item.accountName || "--"
    }`;
		return {
			label,
			title,
			value: item.id,
			subtitleMultiline: [
				item.bankAccount,
				`${item.openingBank} ${item.code}`,
			],
		};
	},
}

const CONFIRM_FORM_COL_17 = {
  span: 24,
  id: "slotImgList",
  label: "水单资料：",
  type: "slot"
}
const DLG_FORM_COL_4 = {
  span: 12,
  id: "currency",
  label: "付款币别：",
  type: "txt",
}
const DLG_FORM_COL_7 = {
  span: 12,
  id: "bankReceiptCheckBy",
  label: "水单上传人：",
  placeholder: "请选择",
  ...httpUserSelect()
}
const DLG_FORM_COL_8 = {
  span: 12,
  id: "verificationBy",
  // selectLabelKey: "salesmanName",
  label: "财务核销人：",
  placeholder: "请选择",
  ...httpUserSelect()
}

const DLG_FORM_COL_13 = {
  span: 24,
  id: "attachId",
  labelWidth: "0",
  fileLabel: "上传图片",
  type: "customUploadFile",
  imageCardUrl: 'url',
  pasteUpload: true,
}
const DLG_FORM_COL_14 = {
  span: 24,
  id: "uploadWater",
  labelWidth: '0',
  type: "slot"
}
export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "title",
                  label: "水单抬头：",
                  placeholder: "抬头",
                  type: "text"
                },
                {
                  span: 12,
                  id: "accountNum",
                  label: "收款账号：",
                  placeholder: "请选择",
                  ...httpAccountSelect({ type: '0' })
                },
                {
                  span: 12,
                  id: "amount",
                  label: "金额：",
                  type: "text",
                  inputType: "number",
                  decimal: 2
                },
                {
                  span: 12,
                  id: "sdTime",
                  label: "水单时间：",
                  placeholder: "年-月-日",
                  type: "date",
                  valueFormat: "yyyy-MM-dd"
                },
                {
                  span: 24,
                  id: "imgList",
                  label: "",
                  labelWidth: "0",
                  type: "slot"
                },
                {
                  span: 24,
                  labelWidth: "70px",
                  label: "备注说明",
                  type: "txt",
                  className: "custom-remark"
                },
                {
                  span: 24,
                  id: "remark",
                  labelWidth: "0px",
                  placeholder: "备注说明",
                  type: "textarea",
                }
              ],
            },
          ],
        }
      ],
    },
  ],


  addLists: [
    //水单修改
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "receiptPaymentAccount",
                  labelWidth: "130px",
                  label: "记账账号：",
                  placeholder: "请选择记账账号",
                  ...httpAccountSelect({ type: '0' })
                },
                {
                  span: 12,
                  id: "currencyName",
                  labelWidth: "130px",
                  label: "币别：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "accountName",
                  labelWidth: "130px",
                  label: "对方户名：",
                  placeholder: "请输入对方户名",
                  type: "text"
                },
                {
                  span: 12,
                  id: "payType",
                  labelWidth: "130px",
                  label: "收付款类型：",
                  placeholder: "--",
                  basicType: "billType",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "bankAccount",
                  labelWidth: "130px",
                  label: "对方账号：",
                  placeholder: "请输入对方账号",
                  type: "text"
                },
                {
                  span: 12,
                  id: "dealDate",
                  labelWidth: "130px",
                  label: "交易时间：",
                  placeholder: "年-月-日",
                  type: "date",
                  valueFormat: "yyyy-MM-dd"
                },
                {
                  span: 12,
                  id: "openingBank",
                  labelWidth: "130px",
                  label: "对方开户行：",
                  placeholder: "请输入对方开户行",
                  type: "text"
                },
                {
                  span: 12,
                  id: "money",
                  labelWidth: "130px",
                  label: "金额：",
                  placeholder: "请输入金额",
                  type: "text"
                },
                {
                  span: 24,
                  id: "imgList",
                  label: "",
                  labelWidth: "130px",
                  type: "slot"
                },
                {
                  span: 24,
                  labelWidth: "130px",
                  label: "备注说明",
                  type: "txt",
                  className: "custom-remark"
                },
                {
                  span: 24,
                  id: "financialRemark",
                  labelWidth: "130px",
                  placeholder: "备注说明",
                  type: "textarea"
                }
              ],
            },
          ],
        }
      ],
    },
  ],







  waterUploadFormRules: {
    receiptPaymentAccount: [
      { required: true, message: "请选择记账账号", trigger: "change" },
    ],
    accountName: [
      { required: true, message: "请输入对方户名", trigger: "change" },
    ],
    bankAccount: [{ required: true, message: "请输入对方账号", trigger: "change" },],
    dealDate: [{ required: true, message: "请选择交易时间", trigger: "change" },],
    openingBank: [{ required: true, message: "请输入对方开户行", trigger: "change" },],
    money: [{ required: true, message: "请输入金额", trigger: "change" },],
  },

  // mergeDistribution: {
  //   //付款任务单-合并分配
  //   title: "分配付款人",
  //   lists: [{
  //     width: 550,
  //     fieldList: [
  //       {
  //         className: "bill-left",
  //         rows: [
  //           {
  //             cols: [
  //               {
  //                 span: 12,
  //                 id: "businessCompanyName",
  //                 label: "业务单位：",
  //                 type: "txt",
  //               },
  //               {
  //                 span: 12,
  //                 id: "salesmanName",
  //                 label: "业务员：",
  //                 type: "txt",
  //               },
  //               {
  //                 span: 12,
  //                 id: "dealingsCompanyName",
  //                 label: "相关单位：",
  //                 type: "txt",
  //               },
  //               {
  //                 span: 12,
  //                 id: "billCurrencyCode",
  //                 label: "付款币别：",
  //                 type: "txt"
  //               },
  //               {
  //                 span: 12,
  //                 id: "latestPaymentDate",
  //                 label: "最迟付款日：",
  //                 placeholder: "年-月-日",
  //                 type: "date",
  //                 valueFormat: "yyyy-MM-dd"
  //               },
  //               {
  //                 span: 12,
  //                 id: "accountId",
  //                 label: "指定付款人：",
  //                 placeholder: "请选择",
  //                 ...httpUserSelect()
  //               },
  //               DLG_FORM_COL_7,
  //               DLG_FORM_COL_8,
  //               {
  //                 span: 24,
  //                 id: "remark",
  //                 label: "分配备注：",
  //                 placeholder: "分配备注",
  //                 type: "textarea"
  //               },
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }, {
  //     width: 250,
  //     fieldList: [
  //       {
  //         className: "bill-right",
  //         rows: [
  //           {
  //             cols: [
  //               {
  //                 span: 24,
  //                 id: "poll",
  //                 labelWidth: "0px",
  //                 type: "slot",
  //               },
  //               {
  //                 span: 24,
  //                 id: "verification",
  //                 labelWidth: "0px",
  //                 type: "slot",
  //               },
  //               {
  //                 span: 24,
  //                 id: "Subtotal",
  //                 labelWidth: "0px",
  //                 type: "slot",
  //               },
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }],
  //   formRules: {
  //     // currencyId: [
  //     //   { required: true, message: "请选择付款币别", trigger: "change" },
  //     // ],
  //     latestPaymentDate: [
  //       { required: true, message: "请选择最迟付款日", trigger: "change" },
  //     ],
  //     accountId: [
  //       { required: true, message: "请选择指定付款人", trigger: "change" },
  //     ],
  //     bankReceiptCheckBy: [
  //       { required: true, message: "请选择水单上传人", trigger: "change" },
  //     ],
  //     verificationBy: [
  //       { required: true, message: "请选择财务核销人", trigger: "change" },
  //     ],
  //   }
  // },

  // paymentLists: {
  //   //付款任务单-付款登记
  //   title: "付款登记",
  //   lists: [
  //     {
  //       width: 550,
  //       fieldList: [
  //         {
  //           className: "bill-left",
  //           rows: [
  //             {
  //               cols: [
  //                 {
  //                   span: 12,
  //                   id: "businessCompanyName",
  //                   label: "业务单位：",
  //                   type: "txt"
  //                 },
  //                 {
  //                   span: 12,
  //                   id: "salesmanName",
  //                   label: "业务员：",
  //                   type: "txt"
  //                 },
  //                 {
  //                   span: 12,
  //                   id: "dealingsCompanyName",
  //                   label: "相关单位：",
  //                   type: "txt"
  //                 },
  //                 DLG_FORM_COL_4,
  //                 {
  //                   span: 24,
  //                   id: "financialRemark",
  //                   label: "分配备注：",
  //                   type: "txt"
  //                 },
  //                 {
  //                   span: 12,
  //                   id: "bankReceiptCheckBy",
  //                   label: "水单登记人：",
  //                   placeholder: "请选择水单登记人",
  //                   ...httpUserSelect()
  //                 },
  //                 {
  //                   span: 24,
  //                   id: "remark",
  //                   label: "备注信息：",
  //                   placeholder: "请输入备注信息",
  //                   type: "textarea",
  //                   className: "remark-info"
  //                 },
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       width: 250,
  //       fieldList: [
  //         {
  //           className: "bill-right",
  //           rows: [
  //             {
  //               cols: [
  //                 {
  //                   span: 24,
  //                   id: "poll",
  //                   labelWidth: "0px",
  //                   type: "slot",
  //                 },
  //                 {
  //                   span: 24,
  //                   id: "verification",
  //                   labelWidth: "0px",
  //                   type: "slot",
  //                 },
  //                 {
  //                   span: 24,
  //                   id: "Subtotal",
  //                   labelWidth: "0px",
  //                   type: "slot",
  //                 },
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ],
  //   formRules: {
  //     bankReceiptCheckBy: [
  //       { required: true, message: "请选择水单登记人", trigger: "change" },
  //     ],
  //   }
  // },


  // RapUploadWaterBillList: {
  //   //付款任务单-上传水单
  //   title: "上传水单",
  //   lists: [
  //     {
  //       width: 550,
  //       fieldList: [
  //         {
  //           className: "bill-left",
  //           rows: [
  //             {
  //               cols: [
  //                 {
  //                   span: 12,
  //                   id: "businessCompanyName",
  //                   label: "业务单位：",
  //                   type: "txt",
  //                 },
  //                 {
  //                   span: 12,
  //                   id: "salesmanName",
  //                   label: "业务员：",
  //                   type: "txt",
  //                 },
  //                 {
  //                   span: 12,
  //                   id: "dealingsCompanyName",
  //                   label: "相关单位：",
  //                   type: "txt",
  //                 },
  //                 DLG_FORM_COL_4,
  //                 {
  //                   span: 24,
  //                   id: "financialRemark",
  //                   label: "分配备注：",
  //                   type: "txt"
  //                 },
  //                 {
  //                   span: 24,
  //                   id: "checkRemark",
  //                   label: "付款备注：",
  //                   type: "txt"
  //                 },
  //                 DLG_FORM_COL_8,
  //                 {
  //                   span: 24,
  //                   id: "remark",
  //                   label: "备注信息：",
  //                   placeholder: "备注说明",
  //                   type: "textarea",
  //                 },
  //                 {
  //                   ...DLG_FORM_COL_13,
  //                   fileParamsType: 127,
  //                 },
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       width: 250,
  //       fieldList: [
  //         {
  //           className: "bill-right",
  //           rows: [
  //             {
  //               cols: [
  //                 {
  //                   span: 24,
  //                   id: "poll",
  //                   labelWidth: "0px",
  //                   placeholder: "--",
  //                   type: "slot",
  //                 },
  //                 {
  //                   span: 24,
  //                   id: "verification",
  //                   labelWidth: "0px",
  //                   type: "slot",
  //                 },
  //                 {
  //                   span: 24,
  //                   id: "Subtotal",
  //                   labelWidth: "0px",
  //                   type: "slot",
  //                 },
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ],
  //   formRules: {
  //     verificationBy: [
  //       { required: true, message: "请选择财务核销人", trigger: "change" },
  //     ],
  //     attachId: [
  //       { required: true, message: "请上传附件", trigger: "change" },
  //     ],
  //   }
  // },
}


const WRITE_OFF_COL_1 = {
  span: 12,
  id: "businessCompanyName",
  label: "业务单位：",
  type: "txt",
}
const WRITE_OFF_COL_2 = {
  span: 12,
  id: "salesmanName",
  label: "业务员：",
  type: "txt",
}
const WRITE_OFF_COL_3 = {
  span: 12,
  id: "dealingsCompanyName",
  label: "相关单位：",
  type: "txt",
}
const WRITE_OFF_COL_4 = {
  span: 12,
  id: 'dealDate',
  label: '水单时间：',
  placeholder: '年-月-日',
  type: "date",
  valueFormat: "yyyy-MM-dd"
}
const WRITE_OFF_COL_5 = {
  span: 12,
  id: "verificationMoney",
  label: "核销金额：",
  type: "slot",
}
const WRITE_OFF_COL_6 = {
  span: 12,
  id: "exchangeRate",
  label: "购汇汇率：",
  placeholder: "购汇汇率",
  type: "slot"
  // type: "inputNumber",
  // numDecimal: 10,
}
const WRITE_OFF_COL_7 = {
  span: 12,
  id: "serviceCharge",
  label: "手续费：",
  type: "slot",
}
const WRITE_OFF_COL_8 = {
  span: 12,
  id: "receiptPaymentAccount",
  label: "付款账号：",
  placeholder: "请选择付款账号",
}
const WRITE_OFF_COL_9 = {
  span: 24,
  id: "checkRemark",
  label: "付款备注：",
  type: "txt",
}
const WRITE_OFF_COL_10 = {
  span: 24,
  id: "financialRemark",
  label: "分配备注：",
  type: "txt"
}
const WRITE_OFF_COL_11 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  placeholder: "备注说明",
  type: "textarea"
}
const WRITE_OFF_COL_12 = {
  span: 24,
  id: "uploadRemark",
  label: "水单备注：",
  type: "txt"
}

export const financiaVerifyLists = (obj = {}) => {
  const { handle, customerId, isJoinBs, isHide = true, pId } = obj
  let WRITE_OFF_COLS = [
    // WRITE_OFF_COL_1,
    // WRITE_OFF_COL_2,
    // WRITE_OFF_COL_3,
    WRITE_OFF_COL_4,//水单时间
    WRITE_OFF_COL_5,//核销金额
    WRITE_OFF_COL_6,//购汇汇率
    {
			...WRITE_OFF_COL_8,
      ...httpAccountSelect({ type: '0' }),
			...ACCOUNT_LABEL,
			type: "slot",
      handle
		},//付款账号
    WRITE_OFF_COL_7,//手续费
		{
			span: 12,
			id: "orderId",
			label: "工作单号：",
			placeholder: "请选择",
			colItemHide: isHide,
			type: "autocomplete",
			selectLabelKey: "orderNum",
			searchParamName: "name",
			httpRequest: (params) => {
				return getPaymentOrderNoInfo({
					...params,
					id: pId
				})
			},
			defaultProp: {
				value: 'orderId',
				label: 'orderNum',
			},
		},
		{
			span: 12,
			id: "serviceChargeAccountId",
			label: "手续费付款账号：",
			placeholder: "请选择",
			colItemHide: isHide,
      ...httpAccountSelect({ type: '0' }),
			...ACCOUNT_LABEL,
			type: "slot",
		},
  ]
	if (isJoinBs === 1) {
		WRITE_OFF_COLS.push({
			span: 12,
			id: "payeeAccountId",
			label: "收款账号：",
      ...httpAccountSelect({ type: '0', customerId }),
			...ACCOUNT_LABEL,
		})
	}

  return {
    //付款任务单-财务核销
    title: "财务核销",
    lists: [{
      width: 700,
      fieldList: [
        {
          className: "bill-left",
          rows: [
            {
              cols: [
                ...WRITE_OFF_COLS,
                WRITE_OFF_COL_10,
                WRITE_OFF_COL_9,
                WRITE_OFF_COL_12,
                WRITE_OFF_COL_11,
                // CONFIRM_FORM_COL_17,
                // DLG_FORM_COL_13
                DLG_FORM_COL_14
              ]
            }
          ]
        }
      ]
    }, {
      width: 260,
      fieldList: [
        {
          className: "bill-right",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "poll",
                  labelWidth: "0px",
                  type: "slot",
                },
                {
                  span: 24,
                  id: "payCurrency",
                  labelWidth: "0px",
                  type: "slot",
                },
                {
                  span: 24,
                  id: "verification",
                  labelWidth: "0px",
                  type: "slot",
                },
                {
                  span: 24,
                  id: "Subtotal",
                  labelWidth: "0px",
                  type: "slot",
                },
              ]
            }
          ]
        }
      ]
    }],
    formRules: {
      receiptPaymentAccount: [
        { required: true, message: "请选择付款账号", trigger: "change" },
      ],
			serviceChargeAccountId: [
        { required: true, message: "请选择手续费付款账号", trigger: "change" },
      ],
			orderId: [
        { required: true, message: "请选择工作单号", trigger: "change" },
      ],
      dealDate: [
        { required: true, message: "请选择水单时间", trigger: "change" },
      ],
      verificationMoney: [
        { required: true, message: "请输入核销金额", trigger: "blur" },
      ],
			payeeAccountId: [
        { required: true, message: "请选择收款账号", trigger: "change" },
      ],
    },
  }
}

/* 水单管理(收款) -> 新增/修改水单 */
export const waterUploadLists = (obj = {}) => {
  const { handle } = obj
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "receiptPaymentAccount",
                  label: "记账账号：",
                  placeholder: "请选择记账账号",
                  isBackAll: true,
                  ...httpgetAccountInfoFromSD({ type: 0 }),
                  handle
                },
                {
                  span: 12,
                  id: "currencyName",
                  label: "币别：",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "accountName",
                  label: "对方户名：",
                  placeholder: "请填写对方户名",
                  type: "text",
                },
                {
                  span: 12,
                  id: "payType",
                  label: "收付款类型：",
                  basicType: "billType",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "bankAccount",
                  label: "对方账号：",
                  placeholder: "请填写对方账号",
                  type: "text",
                },
                {
                  span: 12,
                  id: "dealDate",
                  label: "交易时间：",
                  placeholder: "年/月/日",
                  type: "date",
                  valueFormat: "yyyy/MM/dd"
                },
                {
                  span: 12,
                  id: "openingBank",
                  label: "对方开户行：",
                  placeholder: "请填写对方开户行",
                  type: "text",
                },
                {
                  span: 12,
                  id: "money",
                  label: "金额：",
                  placeholder: "请填写金额",
                  type: "inputNumber",
                  numDecimal: 4,
                },
                {
                  span: 24,
                  id: "openingAddress",
                  label: "开户行地址：",
                  placeholder: "请填写开户行地址",
                  type: "text",
                },
                {
                  ...DLG_FORM_COL_13,
                  labelWidth: "15px",
                  fileParamsType: 126,
                },
                {
                  span: 24,
                  label: "备注说明：",
                  id: "financialRemark",
                  placeholder: "请输入",
                  type: "textarea"
                }
              ],
            },
          ],
        }
      ],
    },
  ]
}


export const dlgExchangeMemoCols = (obj) => {
  const { handle } = obj || {};
  return {
    title: "水单信息(编辑)",
    width: "800px",
    labelWidth: "92px",
    isAttachFileId: true,
    simpleCustomCols: [
      {
        span: 12,
        id: "receiptPaymentObj",
        label: "记账账号：",
        ...httpgetAccountInfoFromSD({ type: 0 }),
        isBackAll: true,
        handle,
      },
      {
        span: 12,
        id: "currencyName",
        label: "币别：",
        type: "txt",
      },
      {
        span: 12,
        id: "accountName",
        label: "对方户名：",
        placeholder: "请输入",
        type: "text",
      },
      {
        span: 12,
        id: "payType",
        label: "收付款类型：",
        basicType: "billType",
        type: "txt",
      },
      {
        span: 12,
        id: "bankAccount",
        label: "对方账号：",
        placeholder: "请输入",
        type: "text",
      },
      {
        span: 12,
        id: "dealDate",
        label: "交易时间：",
        placeholder: "年/月/日",
        type: "date",
        valueFormat: "yyyy/MM/dd",
      },
      {
        span: 12,
        id: "openingBank",
        label: "对方开户行：",
        placeholder: "请输入",
        type: "text",
      },
      {
        span: 12,
        id: "verificationMoney",
        label: "金额：",
        placeholder: "请输入",
        type: "inputNumber",
        numDecimal: 2,
        min: -Infinity,
      },
      {
        span: 24,
        id: "openingAddress",
        label: "开户行地址：",
        placeholder: "请输入",
        type: "text",
      },
      {
        ...DLG_FORM_COL_13,
        labelWidth: "15px",
        fileParamsType: 127,
      },
      {
        span: 24,
        label: "备注说明：",
        id: "remark",
        placeholder: "请输入",
        type: "textarea",
      },
    ],
    formRules: {
      receiptPaymentObj: [
        { required: true, message: "请选择记账账号", trigger: "change" },
      ],
      accountName: [
        { required: true, message: "请输入对方户名", trigger: "blur" },
      ],
      bankAccount: [
        { required: true, message: "请输入对方账号", trigger: "blur" },
      ],
      dealDate: [
        { required: true, message: "请选择交易时间", trigger: "change" },
      ],
      openingBank: [
        { required: true, message: "请输入对方开户行", trigger: "blur" },
      ],
      verificationMoney: [
        { required: true, message: "请输入金额", trigger: "blur" },
      ],
    },
  };
};


// 导入水单成功后LIST
export const waterUploadSuccessCols = {
  title: '上传结果',
  width: '470px',
  labelWidth: "120px",
  simpleCustomCols: [
    {
      span: 24,
      id: "total",
      label: "识别总数：",
      type: "txt",
    },
    {
      span: 24,
      id: "success",
      label: "成功识别：",
      type: "txt",
      fontTxtColor: "#5094ff",
    },
    {
      span: 24,
      id: "error",
      label: "未识别：",
      type: "txt",
      fontTxtColor: "#FA5535",
    },
    {
      span: 24,
      id: "successRow",
      label: "成功所在行：",
      type: "txt",
      render: row => row.successRow ? row.successRow.join(",") : '--'
    },
    {
      span: 24,
      id: "repeatTips",
      labelWidth:'0px',
      type: "slot",
    },
  ],
  formRules: {}
}
