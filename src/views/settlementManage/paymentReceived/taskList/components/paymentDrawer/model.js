const RECORD_FORM_COL_TXT = {
  span: 12,
  placeholder: "--",
  type: "txt",
}
const RECORD_FORM_COL_15 = {
  span: 12,
  id: "cashierByName",
  label: "付款出纳：",
  placeholder: "--",
  type: "txt",
}
const RECORD_FORM_COL_21 = {
  span: 12,
  id: "status",
  label: "付款流水号：",
  type: "slot",
  basicType: "RVPStatus"
}
const RECORD_FORM_COL_2_3 = {
  span: 12,
  id: "bankReceiptCheckByName",
  label: "水单登记人：",
  placeholder: "--",
  type: "txt",
}
const RECORD_FORM_COL_2_5 = {
  span: 12,
  id: "verificationByName",
  label: "核销人：",
  placeholder: "--",
  type: "txt",
}
const RECORD_FORM_COL_2_8 = {
  span: 12,
  id: "businessCompanyName",
  label: "核销主体：",
  placeholder: "--",
  type: "txt",
}
const RECORD_FORM_COL_2_10 = {
  span: 12,
  id: "receiptPaymentAccountName",
  label: "核销账号：",
  placeholder: "--",
  type: "txt",
}

const FK_FORM_COLS_1 = [
  RECORD_FORM_COL_21,
  {
    span: 12,
    id: "generalCashierName",
    label: "总出纳：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_15,
  {
    span: 12,
    id: "taskCreateTime",
    label: "付款生成时间：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "checkNo",
    label: "发票号：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "checkTime",
    label: "付款登记时间：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "paymentRemark",
    label: "付款备注：",
    placeholder: "--",
    type: "txt",
  },
]
const FK_FORM_COLS_2 = [
  {
    span: 12,
    id: "bankReceiptSerialCode",
    label: "水单编号：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "bankReceiptCheckTime",
    label: "水单登记时间：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_2_3,
  {
    span: 12,
    id: "dealDate",
    label: "交易日期：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_2_5,
  {
    span: 12,
    id: "verificationTime",
    label: "核销登记时间：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "money",
    label: "水单金额：",
    placeholder: "--",
    type: "slot",
  },
  RECORD_FORM_COL_2_8,
  {
    span: 12,
    id: "accountName",
    label: "对方户名：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_2_10,
  {
    span: 12,
    id: "bankReceiptRemark",
    label: "备注说明：",
    placeholder: "--",
    type: "txt",
  }
]

const SK_FORM_COLS_1 = [
  {
    ...RECORD_FORM_COL_21,
    label: "收款核销号："
  },
  {
    span: 12,
    id: "claimTime",
    label: "认领时间：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "claimByName",
    label: "认领人：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "money",
    label: "本次核销：",
    placeholder: "--",
    type: "txt",
  },
  // RECORD_FORM_COL_15,
  {
    span: 12,
    id: "checkTime",
    label: "收款确认时间：",
    placeholder: "--",
    type: "txt",
  }
]
const SK_FORM_COLS_2 = [
  {
    span: 12,
    id: "bankReceiptSerialCode",
    label: "水单编号：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "bankReceiptCheckTime",
    label: "水单登记时间：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_2_3,
  {
    span: 12,
    id: "dealDate",
    label: "交易日期：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "bankReceiptVerificationMoney",
    label: "水单金额：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 12,
    id: "accountName",
    label: "银行名称：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_2_5,
  {
    span: 12,
    id: "verificationTime",
    label: "核销登记时间：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_2_8,
  {
    span: 12,
    id: "accountName",
    label: "对方户名：",
    placeholder: "--",
    type: "txt",
  },
  RECORD_FORM_COL_2_10
]

/** 财务核销付款记录 */
const WRITE_OFF_PAYMENT_COLS_1 = [
	RECORD_FORM_COL_21,
	{
		...RECORD_FORM_COL_TXT,
		id: "financeName",
  	label: "财务主管：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "checkByName",
  	label: "水单登记人：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "checkTime",
  	label: "水单登记时间：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "dealDate",
  	label: "水单交易时间：",
	}
]
const WRITE_OFF_PAYMENT_COLS_2 = [
	{
		...RECORD_FORM_COL_TXT,
		id: "verificationByName",
  	label: "核销人：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "verificationTime",
  	label: "核销登记时间：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "totalMoney",
  	label: "总金额：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "stayVerificationMoney",
  	label: "待核销金额：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "verificationMoney",
  	label: "本次核销金额：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "surplusMoney",
  	label: "核销后剩余金额：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "claimByName",
  	label: "收款人/收款单位：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "openingBank",
  	label: "开户行：",
	},
	{
		...RECORD_FORM_COL_TXT,
		span: 24,
		id: "accountName",
  	label: "收款账号：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "businessCompanyName",
  	label: "付款单位：",
	},
	{
		...RECORD_FORM_COL_TXT,
		id: "receiptPaymentOpeningBank",
  	label: "开户行：",
	},
	{
		...RECORD_FORM_COL_TXT,
		span: 24,
		id: "receiptPaymentBankAccount",
  	label: "付款账号：",
	},
	{
		...RECORD_FORM_COL_TXT,
		span: 24,
		id: "cashierRemark",
  	label: "财务核销备注：",
	}
]

export const config = (type = 0) => {
  return {
    lists: [
      {
        fieldList: [
          {
            className: 'border-bottom-solid margin-top-14',
            rows: [
              {
                cols: [FK_FORM_COLS_1, SK_FORM_COLS_1, WRITE_OFF_PAYMENT_COLS_1][type]
              },
            ],
          },
          {
            className: ' select-contacts-item',
            rows: [
              {
                cols: [FK_FORM_COLS_2, SK_FORM_COLS_2, WRITE_OFF_PAYMENT_COLS_2][type]
              },
            ],
          },
        ],
      }
    ],
  }
}
