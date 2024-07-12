const TABLE_COLS_index = {
  prop: "isDefault",
  label: "是否默认",
  customRow: true,
  width: 80
}
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
}
const TABLE_COLS_1 = {
  prop: "bankAccount",
  label: "银行账号",
  minWidth: 120,
  align: "left",
  placeholder: "--",
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  prop: "accountName",
  label: "账号名称",
  placeholder: "--",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "openingBank",
  label: "开户行",
  placeholder: "--",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_4 = {
  prop: "openAddress",
  label: "公司地址",
  minWidth: 120,
  align: "left",
  placeholder: "--",
  showOverflowTooltip: true
}
const TABLE_COLS_5 = {
  prop: "invoiceTitle",
  label: "Swift code",
  placeholder: "--",
  width: 140,
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "taxNumber",
  label: "纳税号",
  minWidth: 100,
  align: "left",
  placeholder: "--",
  showOverflowTooltip: true
}
const TABLE_COLS_7 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 100,
  align: "center",
  placeholder: "--",
  showOverflowTooltip: true
}
const TABLE_COLS_8 = {
  prop: "phone",
  label: "电话",
  minWidth: 100,
  align: "left",
  placeholder: "--",
  showOverflowTooltip: true
}
const TABLE_COLS_9 = {
  prop: "remark",
  placeholder: "--",
  label: "备注",
  showOverflowTooltip: true
}
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  fixed: 'right',
  customRow: true
}

const TABLE_COLS_10 = {
  span: 8,
  id: "contractStart",
  label: "合同有效期：",
  placeholder: "--",
  type: "txt",
  render: (rows) => {
    return rows.contractStart ? `${rows.contractStart}——${rows.contractEnd}` : '--'
  }
}
const TABLE_COLS_11 = {
  span: 8,
  id: "countDown",
  label: "合同到期提醒：",
  placeholder: "--",
  type: "txt",
  render: (rows) => {
    return `${rows.countDown || '--'}天(提前截止日期)`
  }
}
const TABLE_COLS_12 = {
  span: 8,
  id: "paymentMode",
  label: "欠费扣款模式：",
  placeholder: "--",
  basicType: 'paymentMode',
  type: "txt",
  // render: (rows, dics) => {
  //   return rows.paymentMode && dics.paymentMode && dics.paymentMode[rows.paymentMode].nameCn || '--'
  // }
}
const TABLE_COLS_13 = {
  span: 8,
  id: "addressCn",
  label: "中文地址：",
  placeholder: "--",
  type: "txt",
}
const TABLE_COLS_14 = {
  span: 8,
  id: "settleCycle",
  label: "结算周期：",
  placeholder: "--",
  basicType: 'accountCycle',
  type: "txt",
  // render: (rows, dics) => {
  //   return rows.settleCycle && dics.accountCycle && dics.accountCycle[rows.settleCycle].nameCn || '--'
  // }
}
const TABLE_COLS_15 = {
  span: 8,
  id: "addressEn",
  label: "英文地址：",
  placeholder: "--",
  type: "txt"
}
const TABLE_COLS_16 = {
  span: 16,
  id: "websiteAddress",
  label: "网址：",
  placeholder: "--",
  type: "txt"
}
const TABLE_COLS_17 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "--",
  type: "txt",
}

const TABLE_COLS_18 = {
  span: 8,
  id: "isLocus",
  label: "轨迹是否公开查询：",
  placeholder: "--",
  type: "txt",
  render: (rows) => {
    return rows.isLocus == '1' ? '是' : rows.isLocus == '0' ? '否' : '--'
  }
}
const TABLE_COLS_19 = {
  span: 8,
  id: "isChannel",
  label: "按客户渠道出账单：",
  placeholder: "--",
  type: "txt",
  render: (rows) => {
    return rows.isChannel == '1' ? '是' : rows.isLocus == '0' ? '否' : '--'
  }
}
const TABLE_COLS_20 = {
  span: 8,
  id: "isEmail",
  label: "邮件订阅：",
  placeholder: "--",
  type: "txt",
  render: (rows) => {
    return rows.isEmail == '1' ? '是' : rows.isLocus == '0' ? '否' : '--'
  }
}
const TABLE_COLS_21 = {
  span: 8,
  id: "detailedListTmp",
  label: "到货交接清单模板：",
  placeholder: "--",
  type: "txt",
}
const TABLE_COLS_22 = {
  span: 8,
  id: "balanceWarning",
  label: "客户余额预警：",
  placeholder: "--",
  type: "txt",
  render: (rows) => {
    return `${rows.balanceWarning || '--'}RMB`
  }
}
const TABLE_COLS_23 = {
  span: 8,
  id: "noticeWarning",
  label: "预警通知方式：",
  placeholder: "--",
  type: "txt",
}

const TABLE_COLS_24 = {
  span: 24,
  id: "contentTmp",
  label: "预警内容模板：",
  placeholder: "--",
  type: "text",
  disable: true
}


const TABLE_COLS_25 = {
  span: 8,
  id: "shipperReq",
  label: "寄货要求：",
  placeholder: "--",
  type: "txt",
}
const TABLE_COLS_26 = {
  span: 8,
  id: "extractReq",
  label: "提货要求：",
  type: "txt",
}
const TABLE_COLS_27 = {
  span: 8,
  id: "ascription",
  label: "归属：",
  basicType: 'businessOwnership',
  type: "txt",
}
const TABLE_COLS_28 = {
  span: 24,
  id: "title",
  type: "slot",
}
const TABLE_COLS_29 = {
  span: 12,
  id: "nameCn",
  label: "公司名称(CN)：",
  labelWidth: '95px',
  type: "txt",
}
const TABLE_COLS_30 = {
  span: 12,
  id: "category",
  label: "客户类别：",
  basicType: 'clientCategory',
  labelWidth: '95px',
  placeholder: "--",
  type: "txt",

}
const TABLE_COLS_31 = {
  span: 12,
  id: "nameEn",
  label: "公司名称(EN)：",
  labelWidth: '95px',
  placeholder: "--",
  type: "txt",
}
const TABLE_COLS_32 = {
  span: 12,
  id: "shortName",
  label: "员工昵称：",
  labelWidth: '95px',
  placeholder: "--",
  type: "txt",
}
const TABLE_COLS_33 = {
  span: 12,
  id: "nameCn",
  label: "员工姓名：",
  labelWidth: '95px',
  placeholder: "--",
  type: "txt",
}
const TABLE_COLS_34 = {
  span: 12,
  id: "businessOwnershipName",
  label: "部门：",
  labelWidth: '95px',
  placeholder: "--",
  type: "txt",
}
const TABLE_COLS_35 = {
  prop: "code",
  label: "提单联系人代码",
  // customRow: true,
  width: 150,
}
const TABLE_COLS_36 = {
  prop: "cusContacts.contacts",
  label: "提单联系人",
  showOverflowTooltip: true,
  width: 120
}
const TABLE_COLS_37 = {
  prop: "cusContacts.company",
  label: "公司名",
  showOverflowTooltip: true
}
const TABLE_COLS_38 = {
  prop: "cusContacts.phone",
  label: "联系电话",
  showOverflowTooltip: true,
}
const TABLE_COLS_39 = {
  prop: "cusContacts.email",
  label: "联系邮箱",
  showOverflowTooltip: true
}
const TABLE_COLS_40 = {
  prop: "cusContacts.countryName",
  label: "发件国家",
  showOverflowTooltip: true
}
const TABLE_COLS_41 = {
  prop: "cusContacts.address",
  label: "详细地址",
  showOverflowTooltip: true,
}
const TABLE_COLS_42 = {
  prop: "cusContacts.postCode",
  label: "邮编",
  showOverflowTooltip: true,
}
const TABLE_COLS_43 = {
  prop: "dataStatus",
  label: "状态",
  basicType: 'status',
}
const TABLE_COLS_44 = {
  prop: "createTime",
  label: "创建时间",
  width: 180
}
const TABLE_COLS_45 = {
  prop: "contactsType",
  label: "类型",
  basicType: "mainContacts",
  width: '180px'
}
const TABLE_COLS_46 = {
  prop: "isApplyInvoice",
  label: "是否开票",
  basicType: "trueOrFalse",
  fontColor: true,
  showOverflowTooltip: true
}


const customer = {
  baseInfo: [
    {
      fieldList: [
        {
          title: "基本信息",
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                TABLE_COLS_10,
                TABLE_COLS_11,
                TABLE_COLS_12,
                TABLE_COLS_13,
                TABLE_COLS_14,
                TABLE_COLS_15,
                TABLE_COLS_16,
                // TABLE_COLS_17,
              ],
            },
          ],
        },
        // {
        //   title: "客户定制",
        //   className: 'border-bottom-solid',
        //   rows: [
        //     {
        //       cols: [
        //         TABLE_COLS_18,
        //         TABLE_COLS_19,
        //         TABLE_COLS_20,
        //         TABLE_COLS_21,
        //         TABLE_COLS_22,
        //         TABLE_COLS_23,
        //         TABLE_COLS_24,
        //       ],
        //     },
        //   ],
        // },
        {
          title: "特殊要求",
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                TABLE_COLS_25,
                TABLE_COLS_26
              ],
            },
          ],
        },
      ],
    },
  ],
  titleInfo: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                TABLE_COLS_28,
                TABLE_COLS_29,
                TABLE_COLS_30,
                TABLE_COLS_31
              ],
            },
          ],
        },
      ],
    },
  ],
}


const supplier = {
  baseInfo: [
    {
      fieldList: [
        {
          title: "基本信息",
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                TABLE_COLS_10,
                TABLE_COLS_11,
                TABLE_COLS_14,
                {
                  ...TABLE_COLS_16,
                  span: 8,
                },
                TABLE_COLS_13,
                TABLE_COLS_15,
                // TABLE_COLS_27,
                // TABLE_COLS_17,
              ],
            },
          ],
        },
      ],
    },
  ],
  titleInfo: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                TABLE_COLS_28,
                TABLE_COLS_29,
                TABLE_COLS_30,
                TABLE_COLS_31
              ],
            },
          ],
        },
      ],
    },
  ],
}

const subsidiary = {
  baseInfo: [
    {
      fieldList: [
        {
          title: "基本信息",
          className: 'border-bottom-solid',
          rows: [
            {
              cols: [
                TABLE_COLS_14,
                TABLE_COLS_13,
                TABLE_COLS_15,
                TABLE_COLS_16,
                // TABLE_COLS_17,
              ],
            },
          ],
        },
      ],
    },
  ],
  titleInfo: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                TABLE_COLS_28,
                {
                  ...TABLE_COLS_29,
                  span: 24
                },
                {
                  ...TABLE_COLS_31,
                  span: 24
                }
              ],
            },
          ],
        },
      ],
    },
  ],
}

const staff = {
  baseInfo: [
    {
      fieldList: [
        {
          title: "基本信息",
          rows: [
            {
              cols: [
              ],
            },
          ],
        },
      ],
    },
  ],
  titleInfo: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                TABLE_COLS_32,
                TABLE_COLS_33,
                TABLE_COLS_34
              ],
            },
          ],
        },
      ],
    },
  ],
}

const basicInfoConfig = (row = {}) => {
  const { type } = row
  const lists = {
    2: customer.baseInfo,
    3: supplier.baseInfo,
    0: subsidiary.baseInfo,
    9: staff.baseInfo
  }
  return {
    formModel: {
    },
    size: "small",
    labelWidth: "150px",
    formRules: {},
    lists: lists[type]
  }
}




const titleInfoConfig = (row = {}) => {
  const { type } = row
  const lists = {
    2: customer.titleInfo,
    3: supplier.titleInfo,
    0: subsidiary.titleInfo,
    9: staff.titleInfo
  }
  return {
    formModel: {
    },
    size: "small",
    labelWidth: "0px",
    formRules: {},
    lists: lists[type]
  }

}








// let custOrderConfig = {
//   formModel: {},
//   size: "small",
//   labelWidth: "146px",
//   formRules: {},
//   lists: [
//     {
//       fieldList: [
//         {
//           rows: [
//             {
//               cols: [
//                 {
//                   span: 8,
//                   id: "noticeWarning",
//                   label: "预警通知方式：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 24,
//                   id: "contentTmp",
//                   label: "预警内容模板：",
//                   placeholder: "--",
//                   type: "text",
//                   disable: true
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }

// let bankInvoiceConfig = {
//   formModel: {},
//   size: "small",
//   labelWidth: "126px",
//   formRules: {},
//   lists: [
//     {
//       fieldList: [
//         {
//           rows: [
//             {
//               cols: [
//                 {
//                   span: 8,
//                   id: "legalPersonName",
//                   label: "法人姓名：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 8,
//                   id: "businessLicense",
//                   label: "营业执照号码：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 8,
//                   id: "taxName",
//                   label: "纳税人名称：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 8,
//                   id: "legalPersonIdcard",
//                   label: "法人身份证：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 8,
//                   id: "isPrintInvoice",
//                   label: "打印发票：",
//                   placeholder: "--",
//                   type: "txt",
//                   render: (rows) => {
//                     return rows.isPrintInvoice == '1' ? '是' : rows.isLocus == '0' ? '否' : '--'
//                   }
//                 },
//                 {
//                   span: 8,
//                   id: "salesLink",
//                   label: "销售链接：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 8,
//                   id: "picName",
//                   label: "企业负责人姓名：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 8,
//                   id: "invoiceType",
//                   label: "发票类型：",
//                   placeholder: "--",
//                   type: "txt",
//                   render: (rows, dics) => {
//                     return rows.invoiceType && dics.invoiceType && dics.invoiceType[rows.invoiceType].nameCn || '--'
//                   }
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }

// let specialConfig = {
//   formModel: {},
//   size: "small",
//   labelWidth: "90px",
//   formRules: {},
//   lists: [
//     {
//       fieldList: [
//         {
//           rows: [
//             {
//               cols: [
//                 {
//                   span: 8,
//                   id: "shipperReq",
//                   label: "寄货要求：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//                 {
//                   span: 8,
//                   id: "extractReq",
//                   label: "提货要求：",
//                   placeholder: "--",
//                   type: "txt",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }



const bankTableConfig = [
  //客户列表详情银行开票信息tablelists
  TABLE_COLS_INDEX,
  TABLE_COLS_index,
  TABLE_COLS_2,//账号名称
  TABLE_COLS_1,//银行账号
  TABLE_COLS_46,//是否开票
  TABLE_COLS_3,//开户行
  TABLE_COLS_4,//公司地址
  TABLE_COLS_5,//Swift code
  TABLE_COLS_6,//纳税号
  TABLE_COLS_7,//币别
  TABLE_COLS_8,//电话
  TABLE_COLS_9,//备注
  TABLE_COLS_OPERATION
]

const contactsTableConfig = [
  {
    prop: "isDefault",
    label: "",
    customRow: true,
    width: 80
  },
  {
    prop: "name",
    label: "姓名",
    minWidth: 80,
    showOverflowTooltip: true
  },
  {
    prop: "department",
    label: "部门",
    minWidth: 80,
    showOverflowTooltip: true
  },
  {
    prop: "job",
    label: "职务",
    minWidth: 80,
    showOverflowTooltip: true
  },
  {
    prop: "gender",
    label: "性别",
    width: 80,
    customRow: true
  },
  {
    prop: "contactPhone",
    label: "电话",
    width: 140,
  },
  {
    prop: "email",
    label: "邮箱",
    width: 200,
    showOverflowTooltip: true
  },
  {
    prop: "remark",
    label: "备注",
    showOverflowTooltip: true
  },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    fixed: 'right',
    customRow: true
  }
]

const addressTableConfig = [
  {
    prop: "isDefault",
    label: "",
    customRow: true,
    width: 80
  },
  {
    prop: "addressType",
    label: "地址类型",
    width: 100,
    // customRow: true,
    basicType: "addressType",
    basicTypeVal: "addressType",
  },
  {
    prop: "detailsAddr",
    label: "详细地址（省/市/区/街道）",
    minWidth: 200,
    showOverflowTooltip: true,
    render: (row) => {
      const { province, city, area, street, detailsAddr } = row
      return `${province ? province : ''}${city ? city : ''}${area ? area : ''}${street ? street : ''}${detailsAddr ? detailsAddr : ''}`
    }
  },
  {
    prop: "phone",
    label: "电话",
    width: 140
  },
  // {
  //     prop: "mobile",
  //     label: "手机",
  // },
  {
    prop: "contacts",
    label: "联系人",
  },
  {
    prop: "postalCode",
    label: "邮编",
    width: 120
  },
  {
    prop: "updateBy",
    label: "修改人",
  },
  {
    prop: "updateTime",
    label: "修改时间",
    width: 200
  },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    fixed: 'right',
    customRow: true
  }
]

const attachTableConfig = [
  {
    prop: "content",
    label: "附件资料",
    customRow: true,
    customHeader: true,
  },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    fixed: "right",
    customRow: true,
  },
]

export const mainContactsTableConfig = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  TABLE_COLS_index,
  {
    type: "expand",
    prop: "expand",
    customRow: true,
    width: 1,
  },
  TABLE_COLS_35,
  TABLE_COLS_36,
  TABLE_COLS_37,
  TABLE_COLS_38,
  TABLE_COLS_39,
  TABLE_COLS_40,
  TABLE_COLS_41,
  TABLE_COLS_42,
  TABLE_COLS_45,
  TABLE_COLS_43,
  TABLE_COLS_44,
  {
    ...TABLE_COLS_OPERATION,
    width: 180
  }

]


export { basicInfoConfig, titleInfoConfig, bankTableConfig, contactsTableConfig, addressTableConfig, attachTableConfig };


// 提单联系人-新增清关资料
export const customsClearanceMeansCols = {
  title: '上传资料',
  width: '470px',
  labelWidth: "78px",
  dictionaryWords: ['customsClearanceMode'],
  isAttachFileId: true,
  simpleCustomCols: [
    {
      span: 24,
      id: "customsClearanceType",
      label: "类型：",
      type: "radio",
      basicType: 'customsClearanceMode'
    },
    {
      span: 24,
      id: "code",
      label: "清关编号：",
      placeholder: "请输入",
      type: "text",
			maxlength: 50
    },
    {
      span: 24,
      id: "remark",
      label: "说明：",
      placeholder: "请补充说明",
      type: "textarea",
			maxlength: 1000
    },
    {
      span: 24,
      id: "attachId",
      fileLabel: "清关文件",
      labelWidth: "10px",
      type: "customUploadFile",
      uploadData: {
        attachType: "customsClearance"
      }
    },
  ],
  formRules: {
    customsClearanceType: [
      { required: true, message: "请选择类型", trigger: "change" },
    ],
    code: [
      { required: true, message: "请输入清关编号", trigger: "blur" },
    ],
    attachId: [
      { required: true, message: "请上传清关文件", trigger: "change" },
    ],
  }
}



const TABLE_COLS_47 = {
  prop: "wmsName",
  label: "计费仓",
  minWidth:140,
  showOverflowTooltip: true
}

const TABLE_COLS_48 = {
  prop: "logisticsProductName",
  label: "物流产品",
  minWidth:140,
  showOverflowTooltip: true
}
const TABLE_COLS_49= {
  prop: "priceLevel",
  label: "客户等级",
  minWidth:100,
  showOverflowTooltip: true,
  basicType:"priceGrade",
  fontColor:true,
  align:'center'
}
const TABLE_COLS_50 = {
  prop: "costSaleLogisticsPriceCode",
  label: "物流销售方案",
  minWidth:120,
  showOverflowTooltip: true,
  cPageNoKey: "/oneConsignmentPlan/saleCost/saleLogisticsDetail",
  cOrderIdKey: "costSaleLogisticsPriceId",
  columnLink: true,
}
const TABLE_COLS_51 = {
  prop: "costSaleLogisticsPriceState",
  label: "销售方案状态",
  minWidth:120,
  showOverflowTooltip: true,
  dotColor:true,
  basicType:"costSaleLogisticsPriceState",
  align:"center"
}
const TABLE_COLS_52 = {
  prop: "costSaleLogisticsPriceTime",
  label: "销售方案关联时间",
  minWidth:160,
  showOverflowTooltip: true
}
const TABLE_COLS_53 = {
  prop: "costSaleOptPriceCode",
  label: "操作费方案",
  minWidth:120,
  showOverflowTooltip: true,
  cPageNoKey: "/oneConsignmentPlan/saleCost/saleOperatingDetail",
  cOrderIdKey: "costSaleOptPriceId",
  columnLink: true,
}
const TABLE_COLS_54 = {
  prop: "costSaleOptPriceState",
  label: "操作方案状态",
  minWidth:120,
  showOverflowTooltip: true,
  dotColor:true,
  basicType:"costSaleOptPriceState",
  align:"center"
}
const TABLE_COLS_55 = {
  prop: "costSaleOptPriceTime",
  label: "操作方案关联时间",
  minWidth:160,
  showOverflowTooltip: true
}
const TABLE_COLS_56 = {
  prop: "costSaleTsfPriceCode",
  label: "特殊费方案",
  minWidth:120,
  showOverflowTooltip: true,
  cPageNoKey: "/oneConsignmentPlan/saleSpecialCost/saleSpecialDetail",
  cOrderIdKey: "costSaleTsfPriceId",
  columnLink: true,
}
const TABLE_COLS_57 = {
  prop: "costSaleTsfPriceState",
  label: "特殊费方案状态",
  minWidth:120,
  showOverflowTooltip: true,
  dotColor:true,
  basicType:"costSpecialChargesPriceState",
  align:"center"
}
const TABLE_COLS_58 = {
  prop: "costSaleTsfPriceTime",
  label: "特殊费方案关联时间",
  minWidth:160,
  showOverflowTooltip: true
}
export const basicInfoTableConfig = [
  TABLE_COLS_INDEX,
  TABLE_COLS_47,
  TABLE_COLS_48,
  TABLE_COLS_49,
  TABLE_COLS_50,
  TABLE_COLS_51,
  TABLE_COLS_52,
  TABLE_COLS_53,
  TABLE_COLS_54,
  TABLE_COLS_55,
  TABLE_COLS_56,
  TABLE_COLS_57,
  TABLE_COLS_58
]
