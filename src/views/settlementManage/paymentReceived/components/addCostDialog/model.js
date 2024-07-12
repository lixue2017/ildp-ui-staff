import {
  httpUserSelect, httpDealingCompanySelect, httpCostTypeSelect,
  httpCurrencySelect,httpAccountSelect,
  httpRoleDeptUserSelect,
  httpAddressAccountInfoByName,
  httpAddressAccountInfoByCus
} from '@/comModel/httpSelect'
import { typeConversion } from "@/utils/index.js";
const FORM_COLS_1 = {
  span: 8,
  id: "type",
  label: "类型：",
  type: "radio",
  basicType: 'expenseType',
}
const FORM_COLS_2 = {
  span: 8,
  id: "flowType",
  label: "流程：",
  type: "radio",
  basicType: 'expenseFlow',
}
const FORM_COLS_3 = {
  span: 8,
  id: "businessCompany",
  label: "记账主体：",//付款单位
  placeholder: "请选择记账主体",
  selectLabelKey: 'businessCompanyName',
  ...httpDealingCompanySelect({ serviceList: 0 }),
  currData:true,
  type:'slot'
}
const FORM_COLS_4 = {
  span: 8,
  id: "applicantName",
  label: "申请人：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_5 = {
  span: 8,
  id: "applyDeptName",
  label: "报销部门：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_6 = {
  span: 8,
  id: "claimBy",
  label: "领款人：",
  placeholder: "请选择领款人",
  selectLabelKey: 'claimByName',
  ...httpRoleDeptUserSelect(),
	noClearable: true,
	type: "slot"
}
const FORM_COLS_7 = {
  span: 8,
  id: "borrowMoney",
  label: "原借款：",
  placeholder: "请输入原借款",
  type: "inputNumber",
  numDecimal: 2,
  unit: "RMB",
}
// const FORM_COLS_8 = {
//   span: 12,
//   id: "spareMoney",
//   label: "应退余款：",
//   placeholder: "--",
//   disable: true,
//   type: "text",
//   unit: "RMB"
// }
const FORM_COLS_8 = {
  span: 8,
  id: "spareMoney",
  label: "应退余款：",
  placeholder: "--",
  disable: true,
  type: "inputNumber",
  numDecimal: 2,
  min: -Infinity,
  unit: "RMB",
  className: 'text-disable'
}
const FORM_COLS_9 = {
  span: 8,
  id: "currencyId",
  selectLabelKey: 'currencyCode',
  label: "报销单币别：",
  placeholder: "请选择报销单币别",
  ...httpCurrencySelect,
	noClearable: true,
	type: "slot"
}
const FORM_COLS_10 = {
  span: 12,
  id: "UNCHARTED_FORM_10",
  label: "部门主管：",
  placeholder: "请选择部门主管",
  ...httpUserSelect()
}
const FORM_COLS_11 = {
  span: 12,
  id: "UNCHARTED_FORM_11",
  label: "财务主管：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_12 = {
  span: 12,
  id: "UNCHARTED_FORM_12",
  label: "总经理：",
  placeholder: "--",
  type: "txt",
}
// const FORM_COLS_13 = {
//   span: 8,
//   id: "dealingsCompanyName",
//   label: "收款单位：",
//   placeholder: "请输入",
//   type: "text",
// }
const FORM_COLS_13 = {
  span: 8,
  id: "dealingsCompanyName",
  label: "收款单位：",
  type:"slot",
  config: {
    id: "dealingsCompanyName",
    selectLabelKey: "dealingsCompanyShortName",
    ...httpAddressAccountInfoByCus(),
    placeholder: "请输入",
    allowCreate: true,
    isBackAll: true,
  },
}
const FORM_COLS_14 = {
  span: 8,
  id: "bankAccount",
  label: "收款账号：",//付款单位
  type:"slot",
  config: {
    id: "bankAccount",
    selectLabelKey: "bankAccount",
    ...httpAddressAccountInfoByName(),
    placeholder: "请输入",
    allowCreate: true,
    isBackAll: true,
    defaultProp: {
      value: "bankAccount",
      label: "bankAccount",
    },
  },
}
const FORM_COLS_15 = {
  span: 8,
  id: "openingBank",
  label: "开户行：",
  placeholder: "请输入",
  type: "text",
}
const FORM_COLS_16 = {
  span: 8,
  id: "latestPaymentDate",
  label: "最迟付款日：",
  placeholder: "请选择日期",
  type: "date",
  valueFormat: "yyyy/MM/dd"
}
const FORM_COLS_17 = {
  span: 8,
  id: "totalMoney",
  label: "付款金额：",
  placeholder: "请输入",
  type: "inputNumber",
  numDecimal: 2,
}
const FORM_COLS_18 = {
  span: 8,
  id: "currencyId",
  label: "币别：",
  placeholder: "请选择币别",
  selectLabelKey: "currencyCode",
  ...httpCurrencySelect,
}
const FORM_COLS_19 = {
  span: 8,
  id: "invoiceNumber",
  label: "发票号码：",
  placeholder: "请输入发票号码",
  type: "text",
}
const FORM_COLS_20 = {
  span: 8,
  id: "invoiceMoney",
  label: "发票金额：",
  placeholder: "请输入发票金额",
  type: "inputNumber",
  numDecimal: 2,
}
const FORM_COLS_21 = {
  span: 8,
  id: "invoiceDate",
  label: "发票日期：",
  placeholder: "请选择发票日期",
  type: "date",
  valueFormat: "yyyy/MM/dd"
}
const FORM_COLS_22 = {
  span: 24,
  id: "remark",
  label: "付款原因：",
  placeholder: "请输入",
  type: "textarea"
}
const FORM_COLS_23 = {
  span: 24,
  id: "attIds",
  attachIdKeyName: "attIds", // 默认为"attachId"时不传
  labelWidth: "0px",
  type: "customUploadFile",
  pasteUpload: true,
  fileParamsType: -1,
  imageCardUrl: 'url',
  tipsTop: true
}
const FORM_COLS_24 = {
  span: 8,
  id: "applyDeptName",
  label: "借款部门：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_25 = {
  span: 8,
  id: "totalMoney",
  label: "借款金额：",
  placeholder: "请输入借款金额",
  type: "inputNumber",
  // numDecimal: 2,
  decimal:2,
  type:"slot"
}
const FORM_COLS_26 = {
  span: 8,
  id: "amountWords",
  label: "金额(大写)：",
  placeholder: "--",
  type: "txt"
}
const FORM_COLS_27 = {
  span: 8,
  id: "latestPaymentDate",
  label: "预计还款报销日期：",
  placeholder: "请选择预计还款报销日期",
  type: "date",
  valueFormat: "yyyy/MM/dd"
}
const FORM_COLS_28 = {
  span: 24,
  id: "remark",
  label: "借款事由：",
  placeholder: "请输入借款理由",
  type: "textarea"
}
const FORM_COLS_29 = {
  span: 8,
  id: "monthBy",
  label: "账单所属月份：",
  placeholder: "请选择账单所属月份",
  type: "date",
  valueFormat: "yyyy/MM/dd"
}
const FORM_COLS_TABLE = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
  className: "table-data"
}
const FORM_COLS_30 = {
  span: 8,
  id: "accountId",
  label: "收款账号：",
  placeholder: "请选择收款账号",
	...httpAccountSelect(),
	// selectLabelKey: 'accountName',
  isAutoInitRequest: true,
	type: "slot"
}
const FORM_COLS_TABLE_21 = {
  span: 24,
  id: "tableDataLoan",
  labelWidth: "0",
  type: "slot",
  className: "table-data"
}
const individualVerification = [
  //个人报销
  FORM_COLS_4,//申请人
  FORM_COLS_3,//主体
  FORM_COLS_6,//领款人
  FORM_COLS_5,//报销部门
  FORM_COLS_9,//报销单币别
  FORM_COLS_7,//原借款
  FORM_COLS_8,//应退余款
  FORM_COLS_30,
  // FORM_COLS_10,
  // FORM_COLS_11,
  // FORM_COLS_12,
  FORM_COLS_TABLE,//表格
  FORM_COLS_23,//上传
]
const creditSlip = [
  //个人报销挂账单
  FORM_COLS_4,//申请人
  FORM_COLS_3,//主体
  FORM_COLS_6,//领款人
  FORM_COLS_5,//报销部门
  FORM_COLS_9,//报销单币别
  FORM_COLS_7,//原借款
  FORM_COLS_8,//应退余款
  FORM_COLS_29,//账单所属月份
  FORM_COLS_30,
  // FORM_COLS_10,
  // FORM_COLS_11,
  // FORM_COLS_12,
  FORM_COLS_TABLE,//表格
  FORM_COLS_23,//上传
]



const payApply=(row={})=>{
  const {WEB_MENETYPE}=row
return [
  FORM_COLS_4,//申请人
  {
    ...FORM_COLS_3,
    // disabled:WEB_MENETYPE=='monthWage'?true:false    monthWage月工资
  },//主体
  FORM_COLS_16,//最迟付款日
  FORM_COLS_13,//收款单位
  FORM_COLS_21,//发票日期
  FORM_COLS_18,//币别
  FORM_COLS_14,//收款账号
  FORM_COLS_19,//发票号码
  FORM_COLS_20,//发票金额
  {
    ...FORM_COLS_15,
    label: "收款开户行："
  },//开户行
  FORM_COLS_22,//付款原因
  FORM_COLS_TABLE,//表格
  FORM_COLS_23,//上传
]
}
// const payApply = [
//   //付款申请
//   FORM_COLS_4,//申请人
//   FORM_COLS_3,//主体
//   FORM_COLS_16,//最迟付款日
//   FORM_COLS_13,//收款单位
//   FORM_COLS_21,//发票日期
//   FORM_COLS_18,//币别
//   FORM_COLS_14,//收款账号
//   FORM_COLS_19,//发票号码
//   FORM_COLS_20,//发票金额
//   {
//     ...FORM_COLS_15,
//     label: "收款开户行："
//   },//开户行
//   // FORM_COLS_17,//付款金额
//   // FORM_COLS_10,
//   // FORM_COLS_11,
//   // FORM_COLS_12,
//   FORM_COLS_22,//付款原因
//   FORM_COLS_TABLE,//表格
//   FORM_COLS_23,//上传
// ]
const borrowMoney = [
  //借款
  FORM_COLS_4,//申请人
  FORM_COLS_3,//主体
	{
		...FORM_COLS_18,
		noClearable: true,
		type: "slot"
	},//币别
  FORM_COLS_24,//借款部门
  FORM_COLS_27,//预计还款报销日期
  FORM_COLS_25,//借款金额
  FORM_COLS_26,//金额（大写）
  FORM_COLS_30,
  // FORM_COLS_10,
  // FORM_COLS_11,
  // FORM_COLS_12,
  FORM_COLS_28,//借款事由
  FORM_COLS_TABLE_21,
  // FORM_COLS_TABLE,//表格
]
const collection = [
  // 收款
  {
    ...FORM_COLS_13,
    // id:"accountName",
    label: "付款单位：",
  },
  FORM_COLS_3,//主体
  FORM_COLS_4,//申请人
  {
    ...FORM_COLS_14,
    label: "付款账号："
  },
  FORM_COLS_18,//币别
  {
    ...FORM_COLS_16,
    label: "收款日期："
  },
  {
    ...FORM_COLS_15,
    label: "付款开户行："
  },
  // {
  //   ...FORM_COLS_17,
  //   label: "金额："
  // },
  {
    ...FORM_COLS_22,
    label: "收款原因："
  },
  FORM_COLS_TABLE,//表格
  FORM_COLS_23,
]

const formConfigs=(row={})=>{
  const {formType,WEB_MENETYPE}=row
  return {
    '00': [...individualVerification],//个人报销-财务内部单
    '01': [...individualVerification],//个人报销-付款
    '02': [...creditSlip],//个人报销-挂账单
    '10': [...payApply({WEB_MENETYPE})],//付款申请-财务内部单
    '11': [...payApply({WEB_MENETYPE})],//付款申请-付款
    '20': [...borrowMoney],//借款-财务内部单
    '21': [...borrowMoney],//借款-付款
    '30': [...collection], // 收款-财务内部单
    '33': [...collection], // 收款-收款
  }[formType]
}
// const formConfigs = {
//   '00': [...individualVerification],//个人报销-财务内部单
//   '01': [...individualVerification],//个人报销-付款
//   '02': [...creditSlip],//个人报销-挂账单
//   '10': [...payApply],//付款申请-财务内部单
//   '11': [...payApply],//付款申请-付款
//   '20': [...borrowMoney],//借款-财务内部单
//   '21': [...borrowMoney],//借款-付款
//   '30': [...collection], // 收款-财务内部单
//   '33': [...collection], // 收款-收款
// }

const GETFORM_COLS_2 = (fType, rType, cwRole,WEB_MENETYPE,ascription) => {
  let hideList = [4];//4为借款抵消，只有待抵消状态的弹窗中会出现
  let disable=false
  if (!cwRole) {
    // 非财务隐藏内部单、挂账单
    hideList = [0, 2 , 4]
  }
  if (typeConversion(rType) !== '0') {
    // 非个人报销隐藏挂账单
    hideList.push(2)
  }
  if (rType != 3) {
    // 非收款类型隐藏收款流程
    hideList.push(3)
  } else {
    // 收款类型隐藏付款、挂账单
    hideList.push(1)
  }
  if(WEB_MENETYPE=='monthWage'){
    disable=true
  }
  if(ascription==2){
    hideList.push(0)
  }
  switch (fType) {
    case "10":
    case "11":
    case "12":
    case "20":
    case "21":
    case "22":
      return { ...FORM_COLS_2, hideList, disable }
    default:
      return { ...FORM_COLS_2, hideList }
  }
}

export const config = (row = {}) => {
  //WEB_MENETYPE 工资单条:monthWage  报销:undefined
  //用户-财务报销
  const { WEB_MENETYPE,cwRoleFlow,type,flowType,ascription } = row
  const formType = typeConversion(type) + typeConversion(flowType)
  // if (!formType) {
  //   const { type, flowType } = row //获取类型与流程，根据当前的流程与类型判断要展示的表单内容
  //   formType = typeConversion(type) + typeConversion(flowType)
  // }
  const formCols=formConfigs({formType,WEB_MENETYPE})
  // const formCols = formConfigs[formType];
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...FORM_COLS_1,
                  hideList: cwRoleFlow ? [] : [3], // 非财务隐藏收款类型
                  disable:WEB_MENETYPE == 'monthWage' ? true : false

                },
                GETFORM_COLS_2(formType, type, cwRoleFlow,WEB_MENETYPE,ascription),//获取流程的隐藏项
                ...formCols
              ],
            },
          ],
        },
      ],
    },
  ]
}


export const formRules = {
  type: [
    { required: true, message: "请选择类型", trigger: "change" },
  ],
  flowType: [
    { required: true, message: "请选择流程", trigger: "change" },
  ],
  businessCompany: [
    { required: true, message: "请选择主体", trigger: "change" },
  ],
  claimBy: [
    { required: true, message: "请选择领款人", trigger: "change" },
  ],
  currencyId: [
    { required: true, message: "请选择币别", trigger: "change" },
  ],
  UNCHARTED_FORM_10: [
    { required: true, message: "请选择部门主管", trigger: "change" },
  ],
  dealingsCompany: [
    { required: true, message: "请选择单位", trigger: "change" },
  ],
  bankAccount: [
    { required: true, message: "请选择账号", trigger: "change" },
  ],
  openingBank: [
    { required: true, message: "请输入开户行", trigger: "blur" },
  ],
  latestPaymentDate: [
    { required: true, message: "请选择日期", trigger: "change" },
  ],
  totalMoney: [
    { required: true, message: "请输入金额", trigger: "blur" },
  ],
  currencyId: [
    { required: true, message: "请选择币别", trigger: "change" }
  ],
  invoiceNumber: [
    { required: true, message: "请输入发票号码", trigger: "blur" }
  ],
  invoiceMoney: [
    { required: true, message: "请输入发票金额", trigger: "blur" }
  ],
  invoiceDate: [
    { required: true, message: "请输入发票日期", trigger: "blur" }
  ],
  remark: [
    { required: true, message: "请输入付款原因", trigger: "blur" }
  ],
  totalMoney: [
    { required: true, message: "请输入金额", trigger: "blur" }
  ],
  remark: [
    { required: true, message: "请输入原因", trigger: "blur" }
  ],
  attIds: [
    { required: true, message: "请上传附件", trigger: "change" }
  ],
  accountId: [
    { required: true, message: "请选择收款账号", trigger: "change" }
  ],
  dealingsCompanyName: [
    { required: true, message: "请选择收款单位", trigger: "change" }
  ],
}




const TABLE_COLS_INDEX = {
  type: "index",
  width: 80,
  align: "center",
  fixed: "left"
}
const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  showOverflowTooltip: true,
  customRow: true
}
const TABLE_COLS_2 = {
  prop: "costName",
  label: "费用名称",
  showOverflowTooltip: true,
  customRow: true,
  fieldItem: {
    id: 'costId',
    size: 'mini',
    selectLabelKey: 'costName',
    placeholder: '费用名称',
    ...httpCostTypeSelect({ type: 1 })
  }
}
const TABLE_COLS_3 = {
  prop: "currencyName",
  label: "币种",
  showOverflowTooltip: true,
  customRow: true
}
const TABLE_COLS_4 = {
  prop: "money",
  label: "金额",
  showOverflowTooltip: true,
  customRow: true
}
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true,
  customRow: true
}
const TABLE_COLS_Operation = {
  prop: "operation",
  label: "操作",
  showOverflowTooltip: true,
  customRow: true
}

export const addIndividualVerification = {
  lists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_Operation
  ]
}

export const handleParams = (row) => {
  const { type = 0, flowType = 0 } = row
  const common = ["id", "type", "flowType", "businessCompany", "applyDept", "applicant", "currencyId", "status"]
  const keys = {
    0: [...common, "dealingsCompany", "attIds", "claimBy", "borrowMoney", "spareMoney", "billList",'accountId'],
    1: [...common, "attIds",'accountName','dealingsCompany','dealingsCompanyName', "totalMoney", "latestPaymentDate", "remark", "openingBank", "bankAccount", "receiptPaymentAccount", "invoiceNumber", "invoiceMoney", "invoiceDate",'staffPayrollId','accountId'],//staffPayrollId字段只有工资条提交在使用
    2: [...common, "dealingsCompany", "totalMoney", "amountWords", "latestPaymentDate", "remark", 'accountId'],
    3: [...common, "dealingsCompany",'accountName','dealingsCompany','dealingsCompanyName', "attIds", "totalMoney", "openingBank", "latestPaymentDate", "remark", "bankAccount",'accountName','accountId']
  }
  const params = {}
  keys[type].forEach(key => {
    params[key] = row[key]
  });
  if (+flowType === 2) {
    params.monthBy = row.monthBy // 挂帐单多账单所属月份
  }
  return params
}
