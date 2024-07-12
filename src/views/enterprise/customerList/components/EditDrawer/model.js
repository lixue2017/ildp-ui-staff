import { CUSTOMER_CHECKBOX } from "@/utils/mixin";
import { listDept } from "@/api/system/dept";

const FORM_COLS_1 = {
  span: 24,
  id: "customerInfo_nameCn",
  label: "公司名称(CN)：",
  placeholder: "--",
  type: "text",
  disable: true,
};
const FORM_COLS_2 = {
  span: 24,
  id: "customerInfo_code",
  label: "公司编码：",
  placeholder: "--",
  type: "text",
  disable: true,
};
const FORM_COLS_3 = {
  span: 24,
  id: "customerInfo_logoUrl",
  label: "公司logo：",
  type: "slot",
  className: "update-img",
};
const FORM_COLS_4 = {
  span: 24,
  id: "customerInfo_nameEn",
  label: "公司名称(EN)：",
  placeholder: "请输入公司英文名称",
  type: "text",
};
const FORM_COLS_5 = {
  span: 12,
  id: "customerInfo_shortName",
  label: "公司简称：",
  placeholder: "--",
  type: "text",
  disable: true,
};
const FORM_COLS_6 = {
  span: 7,
  type: "text",
  disable: true,
};
const FORM_COLS_7 = {
  span: 12,
  id: "customerInfo_level",
  label: "客户等级：",
  type: "radio",
  basicType: "level",
};
const FORM_COLS_8 = {
  span: 10,
  id: "customerInfo_source",
  label: "客户来源：",
  type: "radio",
  basicType: "clientSource",
};
const FORM_COLS_9 = {
  span: 10,
  id: "customerInfo_clientIdentity",
  label: "身份：",
  placeholder: "请选择(可多选)",
  type: "select",
  multiple: true,
  collapseTags: true,
  basicType: "clientIdentity",
};
const FORM_COLS_10 = {
  span: 12,
  id: "customerInfo_websiteAddress",
  label: "公司网址：",
  placeholder: "请输入公司网址",
  type: "text",
};
const FORM_COLS_11 = {
  span: 12,
  id: "customerInfo_category",
  label: "客户类别：",
  placeholder: "请选择客户类别",
  type: "select",
  multiple: true,
  collapseTags: true,
  basicType: "clientCategory",
};
const FORM_COLS_12 = {
  span: 12,
  id: "customerInfo_paymentMode",
  label: "欠费扣货模式：",
  type: "radio",
  basicType: "paymentMode",
};
const FORM_COLS_13 = {
  span: 12,
  id: "customerInfo_settleCycle",
  label: "结算周期：",
  placeholder: "请选择结算周期",
  type: "select",
  basicType: "accountCycle",
};
const FORM_COLS_14 = {
  span: 12,
  id: "customerInfo_countDown",
  label: "合同到期提醒：",
  placeholder: "请输入",
  type: "text",
  inputType: "number",
};
const FORM_COLS_15 = {
  span: 12,
  id: "customerInfo_contractTime",
  label: "合同有效期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_16 = {
  span: 12,
  id: "customerInfo_addressCn",
  label: "中文地址：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COLS_17 = {
  span: 24,
  id: "customerInfo_addressEn",
  label: "英文地址：",
  placeholder: "请输入",
  type: "textarea",
  maxlength: 1024,
};
const FORM_COLS_18 = {
  span: 24,
  id: "customerInfo_remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
};
const FORM_COLS_19 = {
  span: 8,
  id: "customerInfoExtend_detailedListTmp",
  label: "到货交接清单模板：",
  // labelWidth: '138px',
  placeholder: "请输入到货交接清单模板",
  type: "text",
};
const FORM_COLS_20 = {
  span: 16,
  id: "customerInfoExtend_otherSelect",
  labelWidth: "27px",
  type: "multiCheckbox",
  options: CUSTOMER_CHECKBOX,
};
const FORM_COLS_21 = {
  span: 8,
  id: "customerInfoExtend_noticeWarning",
  label: "预警通知方式：",
  // labelWidth: '138px',
  placeholder: "请输入预警通知方式",
  type: "text",
};
const FORM_COLS_22 = {
  span: 16,
  id: "customerInfoExtend_contentTmp",
  label: "预警内容模板：",
  labelWidth: "125px",
  placeholder: "预警内容模板",
  type: "textarea",
  rows: 3,
  maxlength: 2000,
  className: "item-height-36",
};
const FORM_COLS_23 = {
  span: 8,
  id: "customerInfoExtend_balanceWarning",
  label: "客户余额预警：",
  // labelWidth: '138px',
  placeholder: "请输入客户余额预警",
  type: "text",
};
const FORM_COLS_24 = {
  span: 7,
  id: "customerInfoExtend_legalPersonName",
  label: "法人姓名：",
  placeholder: "请输入法人姓名",
  type: "text",
};
const FORM_COLS_25 = {
  span: 7,
  id: "customerInfoExtend_businessLicense",
  label: "营业执照号码：",
  placeholder: "请输入营业执照号码",
  type: "text",
};

const FORM_COLS_26 = {
  span: 10,
  id: "customerInfoExtend_taxName",
  label: "纳税人名称：",
  placeholder: "请输入纳税人名称",
  type: "text",
};
const FORM_COLS_27 = {
  span: 7,
  id: "customerInfoExtend_legalPersonIdcard",
  label: "法人身份证：",
  placeholder: "请输入法人身份证",
  type: "text",
};
const FORM_COLS_28 = {
  span: 7,
  id: "customerInfoExtend_invoiceType",
  label: "发票类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "invoiceType",
};
const FORM_COLS_29 = {
  span: 10,
  id: "customerInfoExtend_isPrintInvoice",
  labelWidth: "27px",
  text: "打印发票",
  type: "singleCheckbox",
};
const FORM_COLS_30 = {
  span: 7,
  id: "customerInfoExtend_picName",
  label: "企业负责人姓名：",
  placeholder: "请输入负责人姓名",
  type: "text",
};
const FORM_COLS_31 = {
  span: 17,
  id: "customerInfoExtend_salesLink",
  label: "销售链接：",
  placeholder: "请输入销售链接",
  type: "text",
};
const FORM_COLS_32 = {
  span: 24,
  id: "customerInfoExtend_shipperReq",
  label: "寄货要求：",
  placeholder: "请输入寄货要求",
  type: "text",
};
const FORM_COLS_33 = {
  span: 24,
  id: "customerInfoExtend_extractReq",
  label: "提货要求：",
  placeholder: "请输入提货要求",
  type: "text",
};
const FORM_COLS_34 = {
  span: 12,
  id: "customerInfo_category",
  label: "供应商类别：",
  placeholder: "此处选择供应商类别",
  multiple: true,
  type: "select",
  basicType: "supplierType",
  // dicsStr: 'supplier_type',
  // customDicsArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};
const FORM_COLS_35 = {
  span: 12,
  id: "customerInfo_clientIdentity",
  label: "客户身份：",
  // placeholder: "请选择(可多选)",
  type: "select",
  multiple: true,
  disabled: true,
  // collapseTags: true,
  basicType: "clientIdentity",
};
const FORM_COLS_36 = {
  span: 24,
  id: "code",
  label: "员工编码：",
  type: "txt",
};
const FORM_COLS_37 = {
  span: 24,
  id: "nameCn",
  label: "员工姓名(CN)：",
  type: "txt",
};
const FORM_COLS_38 = {
  span: 24,
  id: "nameEn",
  label: "员工姓名(EN)：",
  placeholder: "此处填写员工姓名(EN)",
  type: "text",
};
const FORM_COLS_39 = {
  span: 24,
  id: "businessOwnership",
  label: "所属部门：",
  placeholder: "此处选择所属部门",
  httpRequest: listDept,
  type: "slot",
};
const FORM_COLS_40 = {
  span: 12,
  id: "customerInfo_ascription",
  label: "归属：",
  placeholder: "此处选择归属",
  type: "select",
  basicType: "businessOwnership",
};

export const customer = {
  title: "编辑客户",
  lists: [
    {
      className: "leftContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_2, //公司编码
                FORM_COLS_1, //公司名称(CN)
                FORM_COLS_4, //公司名称(EN)
                {
                  ...FORM_COLS_5,
                  span: 24,
                }, //公司简称
              ],
            },
          ],
        },
      ],
    },
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_3, //公司logo
              ],
            },
          ],
        },
      ],
    },
    {
      className: "wrapContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_7, //客户等级
                FORM_COLS_10, //公司网址
                FORM_COLS_35, //身份
                FORM_COLS_11, //客户类别
                FORM_COLS_12, //欠费扣货模式
                {
                  ...FORM_COLS_13, //结算周期
                  // disabled: true
                },
                FORM_COLS_16, //中文地址
                FORM_COLS_14, //合同到期提醒
                FORM_COLS_15, //合同有效期
                FORM_COLS_17, //英文地址
                FORM_COLS_18, //备注
              ],
            },
          ],
        },
        // {
        //   title: '客户定制',
        //   rows: [
        //     {
        //       cols: [
        //         FORM_COLS_19,
        //         FORM_COLS_20,
        //         FORM_COLS_21,
        //         FORM_COLS_22,
        //         FORM_COLS_23
        //       ],
        //     },
        //   ],
        // },
        {
          title: "特殊要求",
          rows: [
            {
              cols: [FORM_COLS_32, FORM_COLS_33],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customerInfo_level: [
      { required: true, message: "请选择客户等级", trigger: "blur" },
    ],
    customerInfo_category: [
      { required: true, message: "请选择客户类别", trigger: "blur" },
    ],
    customerInfo_paymentMode: [
      { required: true, message: "请选择欠费扣货模式", trigger: "blur" },
    ],
    customerInfo_settleCycle: [
      { required: true, message: "请选择结算周期", trigger: "blur" },
    ],
    customerInfo_addressCn: [
      { required: true, message: "请填写中文地址", trigger: "blur" },
    ],
  },
};

export const supplier = {
  //供应商
  title: "编辑服务商",
  lists: [
    {
      className: "leftContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_2,
                FORM_COLS_1,
                FORM_COLS_4,
                {
                  ...FORM_COLS_5,
                  span: 24,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_3, //公司logo
              ],
            },
          ],
        },
      ],
    },
    {
      className: "wrapContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_10,
                FORM_COLS_34,
                // FORM_COLS_40,
                {
                  ...FORM_COLS_13, //结算周期
                  disabled: true,
                },
                FORM_COLS_16, //中文地址
                FORM_COLS_14, //合同到期提醒
                FORM_COLS_15, //合同有效期
                FORM_COLS_17, //英文地址
                FORM_COLS_18, //备注
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customerInfo_settleCycle: [
      { required: true, message: "请选择结算周期", trigger: "blur" },
    ],
    customerInfo_addressCn: [
      { required: true, message: "请填写中文地址", trigger: "blur" },
    ],
    customerInfo_category: [
      { required: true, message: "请选择供应商类别", trigger: "blur" },
    ],
    // customerInfo_ascription: [
    //   { required: true, message: "请选择归属", trigger: "blur" },
    // ],
  },
};

export const subsidiary = {
  //堡森列表
  title: "编辑堡森",
  lists: [
    {
      className: "leftContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_2,
                FORM_COLS_1,
                FORM_COLS_4,
                {
                  ...FORM_COLS_5,
                  span: 24,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_3, //公司logo
              ],
            },
          ],
        },
      ],
    },
    {
      className: "wrapContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_10,
                FORM_COLS_13,
                {
                  ...FORM_COLS_16,
                  span: 24,
                },
                FORM_COLS_17,
                FORM_COLS_18,
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customerInfo_addressCn: [
      { required: true, message: "请填写中文地址", trigger: "blur" },
    ],
  },
};

export const staff = {
  //员工列表
  title: "编辑员工信息",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_36, FORM_COLS_37, FORM_COLS_38, FORM_COLS_39],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    businessOwnership: [
      { required: true, message: "请选择所属部门", trigger: "blur" },
    ],
  }, // 表单校验规则
};
export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_6,
                FORM_COLS_7,
                // FORM_COLS_8,
                // FORM_COLS_9,
                FORM_COLS_10,
                FORM_COLS_11,
                // FORM_COLS_12,
                FORM_COLS_13,
                FORM_COLS_14,
                FORM_COLS_15,
                FORM_COLS_16,
                FORM_COLS_17,
                FORM_COLS_18,
              ],
            },
          ],
        },
        {
          title: "客户定制111",
          rows: [
            {
              cols: [
                FORM_COLS_19,
                FORM_COLS_20,
                FORM_COLS_21,
                FORM_COLS_22,
                FORM_COLS_23,
              ],
            },
          ],
        },
        // {
        //   title: '银行开票信息',
        //   rows: [
        //     {
        //       cols: [
        //         FORM_COLS_24,
        //         FORM_COLS_25,
        //         FORM_COLS_26,
        //         FORM_COLS_27,
        //         FORM_COLS_28,
        //         FORM_COLS_29,
        //         FORM_COLS_30,
        //         FORM_COLS_31
        //       ]
        //     }
        //   ],
        // },
        {
          title: "特殊要求",
          rows: [
            {
              cols: [FORM_COLS_32, FORM_COLS_33],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customerInfo_businessOwnership: [
      { required: true, message: "请选择客户归属", trigger: "blur" },
    ],
    customerInfo_level: [
      { required: true, message: "请选择客户等级", trigger: "blur" },
    ],
    customerInfo_category: [
      { required: true, message: "请选择客户类别", trigger: "blur" },
    ],
    customerInfo_source: [
      { required: true, message: "请选择客户来源", trigger: "blur" },
    ],
    customerInfo_paymentMode: [
      { required: true, message: "请选择欠费扣货模式", trigger: "blur" },
    ],
    customerInfo_settleCycle: [
      { required: true, message: "请选择结算周期", trigger: "blur" },
    ],
    customerInfo_addressCn: [
      { required: true, message: "请填写中文地址", trigger: "blur" },
    ],
  }, // 表单校验规则
};
