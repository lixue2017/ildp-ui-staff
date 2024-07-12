import { getChargeStaff } from "@/api/common"
import { toFixedNum } from '@/utils/instructions'

const DES_FORM_COL_1 = {
  span: 12,
  id: "businessCompanyName",
  label: "付款公司：",
  type: "txt"
}
const DES_FORM_COL_2 = {
  span: 12,
  id: "dealingsCompanyName",
  label: "往来单位：",
  type: "txt"
}
const DES_FORM_COL_3 = {
  span: 12,
  id: 'latestPaymentDate',
  label: '最迟付款日：',
  type: 'txt'
}
const DES_FORM_COL_4 = {
  span: 12,
  id: "methodOfSettle",
  label: "结算方式：",
  basicType: "accountCycle",
  type: "txt"
}
const DES_FORM_COL_5 = {
  span: 12,
  id: "methodOfPayment",
  label: "收付款方式：",
  basicType: "RVPType",
  type: "txt"
}
const DES_FORM_COL_6 = {
  span: 12,
  id: "checkNo",
  label: "发票号：",
  type: "txt"
}
const DES_FORM_COL_7 = {
  span: 12,
  id: "statementsCode",
  label: "来源对账单：",
  type: "txt",
  txtTagArr: [
    {
      fontTagColor: true,
      bgTagColor: true,
      basicType: 'billType',
      basicTypeVal: "type",
    }
  ]
}
const DES_FORM_COL_8 = {
  span: 12,
  id: "slotRelevance",
  label: "关联收款单号：",
  type: "slot"
}

export const taskDetailsCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                DES_FORM_COL_1,
                DES_FORM_COL_2,
                DES_FORM_COL_3,
                DES_FORM_COL_4,
                DES_FORM_COL_5,
                DES_FORM_COL_6,
                DES_FORM_COL_7,
                DES_FORM_COL_8
              ],
            },
          ],
        },
      ],
    }
  ]
}



const FORM_COL_29 = {
  span: 12,
  id: "cashierByName",
  label: "付款出纳：",
  type: "txt"
}
const FORM_COL_30 = {
  span: 12,
  id: "bankReceiptCheckByName",
  label: "水单登记人：",
  type: "txt"
}
const FORM_COL_31 = {
  span: 24,
  id: "financialRemark",
  label: "财务备注：",
  type: "txt",
}

export const basicInfoCols = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "serialCode",
                  label: "业务单位：",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "latestPaymentDate",
                  label: "最迟付款日：",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "serialCode",
                  label: "相关单位：",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "cashierByName",
                  label: "付款出纳：",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "cashierBy",
                  label: "水单登记人：",
                  placeholder: "请选择水单登记人",
                  type: "autocomplete",
                  httpRequest: getChargeStaff,
                  defaultProp: {
                    value: 'id',
                    label: 'nickName'
                  }
                },
                // {
                //   span: 12,
                //   id: "payCashier",
                //   label: "付款出纳：",
                //   type: "autocomplete",
                //   placeholder: "付款出纳",
                //   httpRequest: getChargeStaff,
                //   defaultProp: {
                //     value: 'id',
                //     label: 'nickName'
                //   }
                // },
                // {
                //     span: 12,
                //     id: "generalCashier",
                //     label: " 费总出纳：",
                //     type: "autocomplete",
                //     placeholder: "费总出纳",
                //     httpRequest: getChargeStaff,
                //     defaultProp: {
                //         value: 'id',
                //         label: 'nickName'
                //     }
                // },
                // {
                //   span: 12,
                //   id: "generalCashierName",
                //   label: "费总出纳：",
                //   type: "txt"
                // },
                // {
                //   span: 12,
                //   id: "cashierBy",
                //   label: "销账人：",
                //   placeholder: "销账人",
                //   type: "autocomplete",
                //   placeholder: "付款出纳",
                //   httpRequest: getChargeStaff,
                //   defaultProp: {
                //     value: 'id',
                //     label: 'nickName'
                //   }
                // },
                {
                  span: 12,
                  id: "checkNo",
                  label: "发票号：",
                  placeholder: "发票号",
                  type: "text"
                },
                {
                  span: 24,
                  id: "remark",
                  label: "财务备注：",
                  placeholder: "请输入备注信息",
                  type: "textarea",
                  className: "remark-info"
                },
              ],
            },
          ],
        },
      ],
    }
  ],
  detailsList: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                // {
                //   span: 12,
                //   id: "serialCode",
                //   label: "付款任务单：",
                //   type: "txt"
                // },
              ],
            },
          ],
        },
      ],
    }
  ],
  brieflyList: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 6,
                  id: "applicantName",
                  label: "申请人：",
                  type: "txt"
                },
                {
                  span: 6,
                  id: "money",
                  label: "对账单总额：",
                  type: "txt",
                  render: row => toFixedNum(row.money) || '--'
                },
                {
                  span: 6,
                  id: "verificationMoney",
                  label: "累计核销：",
                  type: "txt",
                  render: row => toFixedNum(row.verificationMoney) || '--'
                }
              ],
            },
          ],
        },
      ],
    }
  ],
}



const RECORD_FORM_COL_IMG = {
  span: 24,
  id: "slotImgList",
  label: "水单资料：",
  type: "slot"
}
/** 对账单详情有引用  */
export const waterBillCols = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [RECORD_FORM_COL_IMG],
          },
        ],
      },
    ],
  }
]

export const processRecords = [
  {
    rLabel: "对账单",
    rName: "确认人：",
    rKey: "billCheckByName",
    rStatus:[50,60,70,80,100]
  },
  {
    rLabel: "付款分配",
    rName: "总出纳：",
    rKey: "generalCashierName",
    rStatus:[60,70,80,100]
  },
  {
    rLabel: "付款登记",
    rName: "付款登记：",
    rKey: "cashierByName",
    rStatus:[70,80,100]
  },
  {
    rLabel: "水单上传",
    rName: "水单登记：",
    rKey: "bankReceiptCheckByName",
    rStatus:[80,100]
  },
  {
    rLabel: "付款核销",
    rName: "付款核销：",
    rKey: "verificationByName",
    rStatus:[100]
  },
]
