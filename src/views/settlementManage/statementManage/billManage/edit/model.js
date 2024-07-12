import { getChargeStaff } from "@/api/common"

const FORM_COL_EDIT_1 = {

}
const FORM_COL_EDIT_2 = {
  span: 12,
  id: "settleType",
  label: "结算方式：",
  type: "txt",
  basicType: "accountCycle"
}
const FORM_COL_EDIT_3 = {
  span: 12,
  id: "lastPayTime",
  label: "最迟收款日：",
  type: "date",
  placeholder: "年/月/日",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COL_EDIT_4 = {
  span: 12,
  id: "currencyId",
  label: "币别：",
  placeholder: "请选择币别",
  type: "autocomplete",
  category: "currency",
}
const FORM_COL_EDIT_5 = {
  span: 8,
  id: "billNo",
  label: "对帐单号：",
  type: "txt",
  placeholder: "--"
}
const FORM_COL_EDIT_6 = {
  span: 12,
  id: "checkNo",
  label: "发票号：",
  type: "text",
  placeholder: "请输入发票号",
  maxlength:1000
}
const FORM_COL_EDIT_7 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  type: "textarea",
  placeholder: "备注说明",
}
const FORM_COL_EDIT_9 = {
  span: 12,
  id: "payType",
  label: "收付款方式：",
  type: "select",
  placeholder: "请选择收付款方式",
  basicType: "RVPType"
}
const FORM_COL_EDIT_10 = {
  span: 24,
  id: "accountInfo",
  label: "账号信息：",
  placeholder: "请选择账号信息",
  showCreate: true,
  type: "slot",
}
const FORM_COL_EDIT_11 = {
  span: 12,
  id: "type",
  label: "对账单类型：",
  type: "slot",
  placeholder: "请选择对账单类型",
  basicType: 'billType',
}
const FORM_COL_EDIT_12 = {
  span: 12,
  id: "invoiceMoney",
  label: "发票金额：",
  placeholder: "请输入发票金额",
  type: "inputNumber",
  numDecimal: 2,
}



const FORM_COL_DETAIL_1 = {
  span: 12,
  id: "dealingsCompanyName",
  label: "往来单位：",
  type: "txt",
  fontTxtColor: "#5094ff",
  txtStyleObj: {
    fontWeight: 600
  },
  txtTagArr: [{
    fontTagColor: true,
    bgTagColor: true,
    basicType: 'billType',
    basicTypeVal: "type",
  }]
}
const FORM_COL_DETAIL_3 = {
  span: 12,
  id: "lastPayTime",
  label: "最迟收款日：",
  type: "txt",
}
const FORM_COL_DETAIL_4 = {
  span: 12,
  id: "currencyName",
  label: "币别：",
  type: "txt",
}
const FORM_COL_DETAIL_5 = {
  span: 12,
  id: "checkNo",
  label: "发票号：",
  type: "txt",
}
const FORM_COL_DETAIL_6 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
	type: "txt",
	textLineClamp: 2
}
const FORM_COL_DETAIL_7 = {
  span: 12,
  id: "businessCompanyName",
  label: "业务单位：",
  type: "txt",
  txtStyleObj: {
    fontWeight: 600
  },
  fontTxtColor: "#5094ff",
}
const FORM_COL_DETAIL_8 = {
  span: 12,
  id: "payType",
  label: "收付款方式：",
  type: "txt",
  basicType: "RVPType"
}
const FORM_COL_DETAIL_9 = {
  span: 24,
  id: "accountInfo",
  placeholder: "--",
  type: "slot",
  disable: true
}
const FORM_COL_DETAIL_10 = {
  span: 12,
  id: "verificationMoney",
  label: "已核销金额：",
	type: "txt",
	colFormat: "thousandthMark",
	decimal: 2
}
const FORM_COL_DETAIL_11 = {
  span: 12,
  id: "serialCode",
  label: "流水号：",
  type: "txt",
}
const FORM_COL_DETAIL_12 = {
  span: 12,
  id: "joinBillNo",
  label: "关联对账单号：",
  type: "slot",
}

const FORM_COL_DETAIL_14 = {
  span: 12,
  id: "invoiceMoneyInfo",
  label: "发票金额：",
  type: "txt",
  decimal:2,
}
export const payFormConfig = {
  editlists: [{
    fieldList: [
      {
        className: "bill-left",
        rows: [
          {
            cols: [
              {
                ...FORM_COL_DETAIL_1,//往来单位
                txtTagArr:[]
              },
              FORM_COL_EDIT_2,//结算方式
              {
                ...FORM_COL_EDIT_3,//最迟付款日
                label: "最迟付款日：",
              },
              FORM_COL_EDIT_4,//币别
              FORM_COL_EDIT_6,//发票号
              FORM_COL_EDIT_12,//发票金额
              FORM_COL_EDIT_7,//备注信息
              FORM_COL_EDIT_11,//对账单类型
            ]
          }
        ]
      }
    ]
  }, {
    fieldList: [
      {
        className: "bill-right",
        rows: [
          {
            cols: [
              FORM_COL_DETAIL_7,
              FORM_COL_EDIT_9,
              FORM_COL_EDIT_10
            ]
          }
        ]
      }
    ]
  }],
  formRules: {
    // lastPayTime: [
    //   { required: true, message: "请选择最迟付款日", trigger: "change" },
    // ],
    currencyId: [
      { required: true, message: "请选择币种", trigger: "change" },
    ],
    checkNo: [
      { required: true, message: "请输入发票号", trigger: "blur" },
    ],
    accountInfo: [
      { required: true, message: "请选择账号信息", trigger: "change" },
    ],
    type: [
      { required: true, message: "请选择对账单类型", trigger: "change" },
    ],
  }
}


export const collectionFormConfig = {
  editlists: [{
    fieldList: [
      {
        className: "bill-left",
        rows: [
          {
            cols: [
              {
                ...FORM_COL_DETAIL_1,
                txtTagArr:[]
              },
              FORM_COL_EDIT_2,
              FORM_COL_EDIT_3,
              FORM_COL_EDIT_4,
              FORM_COL_EDIT_11,
              FORM_COL_EDIT_7,
            ]
          }
        ]
      }
    ]
  }, {
    fieldList: [
      {
        className: "bill-right",
        rows: [
          {
            cols: [
              FORM_COL_DETAIL_7,
              FORM_COL_EDIT_9,
              FORM_COL_EDIT_10
            ]
          }
        ]
      }
    ]
  }],
  // detailLists: [{
  //   fieldList: [
  //     {
  //       className: "bill-left",
  //       rows: [
  //         {
  //           cols: [
  //             FORM_COL_DETAIL_1,
  //             FORM_COL_EDIT_2,
  //             FORM_COL_DETAIL_3,
  //             FORM_COL_DETAIL_4,
  // 						FORM_COL_DETAIL_10,
  //             FORM_COL_DETAIL_6,
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }, {
  //   fieldList: [
  //     {
  //       className: "bill-right",
  //       rows: [
  //         {
  //           cols: [
  //             FORM_COL_DETAIL_7,
  //             FORM_COL_DETAIL_8,
  // 						FORM_COL_DETAIL_11,
  // 						FORM_COL_DETAIL_12,
  // 						FORM_COL_DETAIL_9,
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }],
  formRules: {
    // lastPayTime: [
    //   { required: true, message: "请选择最迟付款日", trigger: "change" },
    // ],
    currencyId: [
      { required: true, message: "请选择币种", trigger: "change" },
    ],
    accountInfo: [
      { required: true, message: "请选择账号信息", trigger: "change" },
    ],
    type: [
      { required: true, message: "请选择对账单类型", trigger: "change" },
    ],
  }
}

export const detailsCols = (sfType) => {
  return [{
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COL_DETAIL_1,
              FORM_COL_DETAIL_7,
							FORM_COL_EDIT_2,
							FORM_COL_DETAIL_8,
							{
								...FORM_COL_DETAIL_3,
								label: `最迟${['付', '收'][sfType]}款日：`,
							},
							FORM_COL_DETAIL_4,
							// FORM_COL_DETAIL_11,
							// FORM_COL_DETAIL_10,
							...(sfType === 0 ? [FORM_COL_DETAIL_5] : []),
              ...(sfType==0?[FORM_COL_DETAIL_14]:[]),
							FORM_COL_DETAIL_6,
            ]
          }
        ]
      }
    ]
  }]
}


const PUBLIC_TYPE_COLS_1={
		rLabel: "对账单提交",
		rName: "提交人：",
		rKey: "submitterName",
}
const PUBLIC_TYPE_COLS_2={
  rLabel: "对账单确认",
  rName: "确认人：",
  rKey: "billCheckByName",
}
const PUBLIC_TYPE_COLS_3={
  rLabel: "付款分配",
  rName: "总出纳：",
  rKey: "generalCashierName",
  rStatus:[60, 70, 80, 100],
  isHedging:[0]
}
const PUBLIC_TYPE_COLS_4={
  rLabel: "付款登记",
  rName: "付款登记：",
  rKey: "cashierByName",
  rStatus:[70, 80, 100],
  isHedging:[0]
}
const PUBLIC_TYPE_COLS_5={
  rLabel: "水单上传",
  rName: "水单登记：",
  rKey: "bankReceiptCheckByName",
  rStatus:[80, 100],
  isHedging:[0]
}
const PUBLIC_TYPE_COLS_6={
  rLabel: "付款核销",
  rName: "付款核销：",
  rKey: "verificationByName",
  rStatus:[100],
  isHedging:[0]
}
const PUBLIC_TYPE_COLS_7={
  rLabel: "水单认领",
  rName: "认领人：",
  rKey: "generalCashierName",
  rStatus:[65, 80, 100],
  isHedging:[0],
  settleModel:[1]
}
const PUBLIC_TYPE_COLS_8={
  rLabel: "收款确认",
  rName: "确认人：",
  rKey: "cashierByName",
  rStatus:[80, 100],
  isHedging:[0],
  settleModel:[1]
}
const PUBLIC_TYPE_COLS_9={
  rLabel: "收款核销",
  rName: "核销人：",
  rKey: "verificationByName",
  rStatus:[100],
  isHedging:[0]
}

const PAY_ACCOUNT = (row={}) => {
  const {isHedging}=row
  return [
    PUBLIC_TYPE_COLS_1,
    PUBLIC_TYPE_COLS_2,
    ...(isHedging==1?[]:[PUBLIC_TYPE_COLS_3]),
    ...(isHedging==1?[]:[PUBLIC_TYPE_COLS_4]),
    ...(isHedging==1?[]:[PUBLIC_TYPE_COLS_5]),
    ...(isHedging==1?[]:[PUBLIC_TYPE_COLS_6]),
  ];
};

const PUT_ACCOUNT = (row={}) => {
  //isHedging 如果为1 隐藏对账单确认之后的流程节点
  // settleModel 1:赊账模式/2余额模式   如果为2 隐藏水单认领及收款确认
  const {isHedging,settleModel}=row
  return [
    PUBLIC_TYPE_COLS_1,
    PUBLIC_TYPE_COLS_2,
    ...(isHedging==1||settleModel==2?[]:[PUBLIC_TYPE_COLS_7]),
    ...(isHedging==1||settleModel==2?[]:[PUBLIC_TYPE_COLS_8]),
    ...(isHedging==1?[]:[PUBLIC_TYPE_COLS_9]),
  ];
};
export const processRecordCols = (row={}) => {
  const { type} = row;
  return {
    0:PAY_ACCOUNT(row),//应付
    1:PUT_ACCOUNT(row)//应收
  }[type]
}

export const accountTopConfig = {
  columnConfig: [
    // 标题右侧label，数据取值formModel
    {
      label: "创建人",
      color: "#5094ff",
      prop: "createBy",
    },
    {
      label: "审核人",
      color: "#5094ff",
      prop: "salesmanName",
    },
    {
      label: "创建时间",
      prop: "createTime",
    },
  ],
}
