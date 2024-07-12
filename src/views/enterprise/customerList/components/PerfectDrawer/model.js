import { ADDRESS_TYPE, CUSTOMER_CHECKBOX } from "@/utils/mixin"

const FORM_COLS_1 = {
  span: 8,
  id: "customerBankAddress_bankAccount",
  label: "银行账号：",
  placeholder: "请输入银行账号",
  type: "text",
}
const FORM_COLS_2 = {
  span: 8,
  id: "customerBankAddress_accountName",
  label: "账号名称：",
  placeholder: "请输入账号名称",
  type: "text",
}
const FORM_COLS_3 = {
  span: 8,
  id: "customerBankAddress_invoiceTitle",
  label: "Swift code：",
  placeholder: "请输入Swift code",
  type: "text",
}
const FORM_COLS_4 = {
  span: 8,
  id: "customerBankAddress_openingBank",
  label: "开户行：",
  placeholder: "请输入开户行",
  type: "text",
}
const FORM_COLS_5 = {
  span: 8,
  id: "customerBankAddress_openAddress",
  label: "开户地址：",
  placeholder: "请输入开户地址",
  type: "text",
}
const FORM_COLS_6 = {
  span: 8,
  id: "customerBankAddress_taxNumber",
  label: "纳税号：",
  placeholder: "请输入纳税号",
  type: "text",
}
const FORM_COLS_7 = {
  span: 8,
  id: "customerBankAddress_currency",
  label: "币别：",
  placeholder: "请选择",
  type: "autocomplete",
  category: "currency"
}
const FORM_COLS_8 = {
  span: 8,
  id: "customerBankAddress_phone",
  label: "电话：",
  placeholder: "请输入电话",
  type: "text",
  inputType: "number"
}
const FORM_COLS_9 = {
  span: 16,
  id: "customerBankAddress_remark",
  label: "备注：",
  placeholder: "请输入备注",
  type: "textarea"
}
const FORM_COLS_10 = {
  span: 8,
  id: "customerBankAddress_isDefault",
  labelWidth: '27px',
  text: "设为默认",
  type: "singleCheckbox"
}
const FORM_COLS_11 = {
  span: 7,
  id: "customerInfoExtend_legalPersonName",
  label: "法人姓名：",
  placeholder: "请输入法人姓名",
  type: "text",
}
const FORM_COLS_12 = {
  span: 7,
  id: "customerInfoExtend_businessLicense",
  label: "营业执照号码：",
  placeholder: "请输入营业执照号码",
  type: "text",
}
const FORM_COLS_13 = {
  span: 10,
  id: "customerInfoExtend_taxName",
  label: "纳税人名称：",
  placeholder: "请输入纳税人名称",
  type: "text",
}
const FORM_COLS_14 = {
  span: 7,
  id: "customerInfoExtend_legalPersonIdcard",
  label: "法人身份证：",
  placeholder: "请输入法人身份证",
  type: "text",
}
const FORM_COLS_15 = {
  span: 7,
  id: "customerInfoExtend_invoiceType",
  label: "发票类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "invoiceType",
}
const FORM_COLS_16 = {
  span: 10,
  id: "customerInfoExtend_isPrintInvoice",
  labelWidth: '27px',
  text: "打印发票",
  type: "singleCheckbox"
}
const FORM_COLS_17 = {
  span: 7,
  id: "customerInfoExtend_picName",
  label: "企业负责人姓名：",
  placeholder: "请输入负责人姓名",
  type: "text",
}
const FORM_COLS_18 = {
  span: 17,
  id: "customerInfoExtend_salesLink",
  label: "销售链接：",
  placeholder: "请输入销售链接",
  type: "text",
}
const FORM_COLS_19 = {
  span: 8,
  id: "cusConsignee_contacts",
  label: "联系人：",
  placeholder: "请输入联系人姓名",
  type: "text",
}
const FORM_COLS_20 = {
  span: 8,
  id: "cusConsignee_phone",
  label: "联系电话：",
  placeholder: "请输入联系电话",
  type: "text",
  inputType: "number"
}
const FORM_COLS_21 = {
  span: 8,
  id: "cusConsignee_email",
  label: "联系邮箱：",
  placeholder: "请输入联系邮箱",
  type: "text",
}
const FORM_COLS_22 = {
  span: 8,
  id: "cusConsignee_province",
  label: "省(州)：",
  placeholder: "请输入省(州)",
  type: "text",
}
const FORM_COLS_23 = {
  span: 8,
  id: "cusConsignee_city",
  label: "城市：",
  placeholder: "请输入城市",
  type: "text",
}
const FORM_COLS_24 = {
  span: 8,
  id: "cusConsignee_addressType",
  label: "地址类型：",
  type: "select",
  options: ADDRESS_TYPE
}
const FORM_COLS_25 = {
  span: 8,
  id: "cusConsignee_area",
  label: "区：",
  placeholder: "请输入区",
  type: "text",
}
const FORM_COLS_26 = {
  span: 8,
  id: "cusConsignee_street",
  label: "街道：",
  placeholder: "请输入街道",
  type: "text",
}
const FORM_COLS_27 = {
  span: 8,
  id: "cusConsignee_postalCode",
  label: "邮编：",
  placeholder: "请输入邮编",
  type: "text",
}
const FORM_COLS_28 = {
  span: 16,
  id: "cusConsignee_detailsAddr",
  label: "详细地址：",
  placeholder: "请输入详细地址",
  type: "text",
}
const FORM_COLS_29 = {
  span: 8,
  id: "cusConsignee_isDefault",
  labelWidth: '27px',
  text: "设为默认",
  type: "singleCheckbox"
}
const FORM_COLS_30 = {
  span: 16,
  id: "cusConsignee_remark",
  label: "备注：",
  placeholder: "请输入备注",
  type: "textarea"
}
const FORM_COLS_31 = {
  span: 8,
  id: "customerInfoExtend_detailedListTmp",
  label: "到货交接清单模板：",
  // labelWidth: '138px',
  placeholder: "请输入到货交接清单模板",
  type: "text",
}
const FORM_COLS_32 = {
  span: 16,
  id: "customerInfoExtend_otherSelect",
  labelWidth: '27px',
  type: "multiCheckbox",
  options: CUSTOMER_CHECKBOX
}
const FORM_COLS_33 = {
  span: 8,
  id: "customerInfoExtend_noticeWarning",
  label: "预警通知方式：",
  // labelWidth: '138px',
  placeholder: "请输入预警通知方式",
  type: "text",
}
const FORM_COLS_34 = {
  span: 16,
  id: "customerInfoExtend_contentTmp",
  label: "预警内容模板：",
  // labelWidth: '125px',
  placeholder: "预警内容模板",
  type: "textarea",
  className: 'item-height-36'
}
const FORM_COLS_35 = {
  span: 8,
  id: "customerInfoExtend_balanceWarning",
  label: "客户余额预警：",
  // labelWidth: '138px',
  placeholder: "请输入",
  type: "text",
  inputType: "number"
}
const FORM_COLS_36 = {
  span: 24,
  id: "customerInfoExtend_shipperReq",
  label: "寄货要求：",
  placeholder: "请输入寄货要求",
  type: "text",
}
const FORM_COLS_37 = {
  span: 24,
  id: "customerInfoExtend_extractReq",
  label: "提货要求：",
  placeholder: "请输入提货要求",
  type: "text",
}
const FORM_COLS_38 = {
  span: 8,
  id: "Uncharted_1",
  label: "发票抬头：",
  placeholder: "此处输入发票抬头",
  type: "text",
}


const userInfo = [
  //基础填写信息
  FORM_COLS_1,//银行账号
  FORM_COLS_2,//账号名称
  FORM_COLS_3,//Swift code
  FORM_COLS_4,//开户行
  FORM_COLS_5,//开户地址
  FORM_COLS_6,//纳税号
  FORM_COLS_7,//币别
  FORM_COLS_8,//电话
]
const userAdressInfo = [
  //联系人地址信息
  FORM_COLS_19,//联系人
  FORM_COLS_20,//联系电话
  FORM_COLS_21,//联系邮箱
  FORM_COLS_22,//（省）州
  FORM_COLS_23,//城市
  FORM_COLS_24,//地址类型
  FORM_COLS_25,//区
  FORM_COLS_26,//街道
  FORM_COLS_27,//邮编
  FORM_COLS_28,//详细地址
  FORM_COLS_29,//设为默认
  FORM_COLS_30,//备注
]
const formRules = {
  //公共校验
  customerBankAddress_bankAccount: [
    { required: true, message: "请填写银行账号", trigger: "blur" },
  ],
  customerBankAddress_openingBank: [
    { required: true, message: "请填写开户行", trigger: "blur" },
  ],
  cusConsignee_contacts: [
    { required: true, message: "请填写联系人", trigger: "blur" },
  ],
  cusConsignee_phone: [
    { required: true, message: "请填写联系电话", trigger: "blur" },
  ],
  cusConsignee_province: [
    { required: true, message: "请填写省(州)", trigger: "blur" },
  ],
  cusConsignee_city: [
    { required: true, message: "请填写城市", trigger: "blur" },
  ],
  cusConsignee_addressType: [
    { required: true, message: "请填写地址类型", trigger: "blur" },
  ],
  cusConsignee_area: [
    { required: true, message: "请填写区", trigger: "blur" },
  ],
  cusConsignee_detailsAddr: [
    { required: true, message: "请填写详情地址", trigger: "blur" },
  ],
}

export const customer = {
  title: '客户信息补充',
  lists: [
    {
      fieldList: [
        {
          title: '开户银行信息',
          rows: [
            {
              cols: [
                ...userInfo,
                FORM_COLS_10,//设为默认
                FORM_COLS_9,//备注
              ],
            },
          ],
        },
        {
          title: '联系地址信息',
          rows: [
            {
              cols: [
                ...userAdressInfo
              ],
            },
          ],
        },
        // {
        //   title: '客户定制',
        //   rows: [
        //     {
        //       cols: [
        //         FORM_COLS_31,//到货交接清单模板
        //         FORM_COLS_32,
        //         FORM_COLS_33,//预警通知方式
        //         FORM_COLS_34,//预警内容模板
        //         FORM_COLS_35,//客户余额预警
        //       ],
        //     },
        //   ],
        // },
        {
          title: '特殊要求',
          rows: [
            {
              cols: [
                FORM_COLS_36,//寄货要求
                FORM_COLS_37,//提货要求
              ],
            },
          ],
        },
      ],
    }
  ],
  formRules: formRules
}




export const supplier = {
  title: '供应商信息补充',
  lists: [
    {
      fieldList: [
        {
          title:"开户银行信息",
          rows: [
            {
              cols: [
                ...userInfo,
                // FORM_COLS_38,//发票抬头
                FORM_COLS_9,
                FORM_COLS_10,
              ],
            },
          ],
        },
        {
          title: '联系地址信息',
          rows: [
            {
              cols: [
                ...userAdressInfo
              ],
            },
          ],
        },
      ],
    }
  ],
  formRules: formRules
}

