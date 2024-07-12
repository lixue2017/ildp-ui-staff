import {
  httpRoleDeptUserSelect,
  httpAccountSubjectSelect,
  httpGetClueSelectPage,
} from "@/comModel/httpSelect";
import { listDept } from "@/api/system/dept";

const txtRules = {
  message: "请填写英文、数字或英文格式的括号、横杠、下划线",
  pattern: new RegExp(/^[a-zA-Z0-9()-_]+$/),
  trigger: "blur",
};

const TABLE_COL_1 = {
  span: 24,
  id: "customerInfo_code",
  label: "公司编码：",
  placeholder: "此处填写公司编码",
  type: "text",
  colUppercase: true,
};
const TABLE_COL_2 = {
  span: 24,
  id: "customerInfo_logoUrl",
  label: "公司logo：",
  type: "slot",
  className: "update-img",
};
const TABLE_COL_3 = {
  span: 12,
  id: "customerInfo_shortName",
  label: "公司简称：",
  placeholder: "此处填写公司简称",
  type: "text",
};
const TABLE_COL_4 = {
  span: 24,
  id: "customerInfo_nameCn",
  label: "公司名称(CN)：",
  placeholder: "此处填写公司中文名称",
  type: "text",
};
const TABLE_COL_5 = {
  span: 24,
  id: "customerInfo_nameEn",
  label: "公司名称(EN)：",
  placeholder: "此处填写公司英文名称",
  type: "text",
};
const TABLE_COL_6 = {
  span: 12,
  id: "customerInfo_businessOwnership",
  label: "客户归属：",
  placeholder: "此处选择客户归属",
  ...httpAccountSubjectSelect(),
};
const TABLE_COL_7 = {
  span: 12,
  id: "customerInfo_level",
  label: "客户等级：",
  type: "radio",
  basicType: "level",
};
const TABLE_COL_8 = {
  span: 12,
  id: "customerInfo_followUserId",
  label: "负责员工：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
  type: "slot",
};
const TABLE_COL_9 = {
  span: 12,
  id: "customerInfo_clientIdentity",
  label: "身份：",
  placeholder: "请选择(可多选)",
  type: "select",
  multiple: true,
  collapseTags: true,
  basicType: "clientIdentity",
};
const TABLE_COL_10 = {
  span: 12,
  id: "customerInfo_category",
  label: "客户类别：",
  placeholder: "请选择(可多选)",
  type: "select",
  multiple: true,
  collapseTags: true,
  basicType: "clientCategory",
};
const TABLE_COL_11 = {
  span: 12,
  id: "customerInfo_source",
  label: "客户来源：",
  type: "radio",
  basicType: "clientSource",
};
const TABLE_COL_12 = {
  span: 12,
  id: "customerInfo_websiteAddress",
  label: "公司网址：",
  placeholder: "此处填写公司网址",
  type: "text",
};
const TABLE_COL_13 = {
  span: 12,
  id: "customerInfo_paymentMode",
  label: "欠费扣货模式：",
  type: "radio",
  basicType: "paymentMode",
};
const TABLE_COL_14 = {
  span: 12,
  id: "customerInfo_settleCycle",
  label: "结算周期：",
  placeholder: "请选择",
  type: "select",
  basicType: "accountCycle",
};
const TABLE_COL_15 = {
  span: 12,
  id: "customerInfo_countDown",
  label: "合同到期提醒：",
  placeholder: "此处填写合同到期天数",
  type: "text",
  inputType: "number",
};

const TABLE_COL_16 = {
  span: 12,
  id: "customerInfo_contractTime",
  label: "合同有效期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const TABLE_COL_17 = {
  span: 24,
  id: "customerInfo_addressCn",
  label: "中文地址：",
  placeholder: "此处填写公司地址",
  type: "textarea",
};
const TABLE_COL_18 = {
  span: 24,
  id: "customerInfo_addressEn",
  label: "英文地址：",
  placeholder: "此处填写英文地址",
  type: "textarea",
};
const TABLE_COL_19 = {
  span: 24,
  id: "customerInfo_remark",
  label: "备注：",
  placeholder: "此处填写备注",
  type: "textarea",
  rows: 3,
  maxlength: 2000,
};

const TABLE_COL_20 = {
  span: 12,
  id: "customerContacts_name",
  label: "姓名：",
  placeholder: "此处填写联系人姓名",
  type: "text",
};
const TABLE_COL_21 = {
  span: 6,
  id: "customerContacts_gender",
  label: "性别：",
  type: "radio",
  basicType: "gender",
};
const TABLE_COL_22 = {
  span: 6,
  id: "customerContacts_isDefault",
  labelWidth: "118px",
  text: "设为默认",
  type: "singleCheckbox",
};
const TABLE_COL_23 = {
  span: 12,
  id: "customerContacts_contactPhone",
  label: "联系电话：",
  placeholder: "此处填写联系电话",
  type: "text",
  // inputType: "number"
};
const TABLE_COL_24 = {
  span: 12,
  id: "customerContacts_email",
  label: "联系邮箱：",
  placeholder: "此处填写联系邮箱",
  type: "text",
};
const TABLE_COL_25 = {
  span: 12,
  id: "customerContacts_department",
  label: "部门：",
  placeholder: "此处填写联系人所在部门",
  type: "text",
};
const TABLE_COL_26 = {
  span: 12,
  id: "customerContacts_job",
  label: "职务：",
  placeholder: "此处填写联系人职务",
  type: "text",
};
const TABLE_COL_27 = {
  span: 24,
  id: "customerContacts_remark",
  label: "备注：",
  placeholder: "此处填写备注",
  type: "textarea",
  rows: 3,
  maxlength: 2000,
};
const TABLE_COL_28 = {
  span: 12,
  id: "customerInfo_loginName",
  label: "登录名称：",
  placeholder: "此处填写客户登录名称",
  type: "text",
};
const TABLE_COL_29 = {
  span: 12,
  id: "customerInfo_password",
  label: "登录密码：",
  placeholder: "此处填写客户登录密码",
  type: "password",
};
const TABLE_COL_30 = {
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
const TABLE_COL_31 = {
  span: 24,
  id: "code",
  label: "员工编码：",
  placeholder: "此处填写员工编码",
  type: "text",
};
const TABLE_COL_32 = {
  span: 24,
  id: "nameCn",
  label: "员工姓名(CN)：",
  placeholder: "此处填写员工姓名(CN)",
  type: "text",
};
const TABLE_COL_33 = {
  span: 24,
  id: "nameEn",
  label: "员工姓名(EN)：",
  placeholder: "此处填写员工姓名(EN)",
  type: "text",
};
const TABLE_COL_34 = {
  span: 24,
  id: "businessOwnership",
  label: "所属部门：",
  placeholder: "此处选择所属部门",
  httpRequest: listDept,
  type: "slot",
};
const TABLE_COL_35 = {
  span: 24,
  id: "customerInfo_ascription",
  label: "归属：",
  placeholder: "此处选择归属",
  type: "select",
  basicType: "businessOwnership",
};

const TABLE_COL_36 = {
  span: 24,
  id: "salesLeadsId",
  label: "关联线索：",
  placeholder: "线索编号/客户名称",
  ...httpGetClueSelectPage({ addCustomerFlag: true, countType: 563 }),
  currData: true,
};

export const customer = (row = {}) => {
  const { handleBusinessOwnership } = row;
  return {
    title: "新增客户",
    lists: [
      {
        className: "leftContent",
        fieldList: [
          {
            rows: [
              {
                cols: [
                  TABLE_COL_36,
                  TABLE_COL_1,
                  { ...TABLE_COL_4, disable: true },
                  TABLE_COL_5,
                  // {
                  //   ...TABLE_COL_3,
                  //   span: 24,
                  // },
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
                cols: [TABLE_COL_2],
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
                  { ...TABLE_COL_3, disable: true },
                  {
                    ...TABLE_COL_6,
                    handle: handleBusinessOwnership,
                    selectLabelKey: "customerInfo_businessOwnershipName",
                    disabled: true,
                  },
                  { ...TABLE_COL_7, disable: true },
                  {
                    ...TABLE_COL_8,
                    selectLabelKey: "customerInfo_followUserName",
                    disabled: true,
                  },
                  // TABLE_COL_9,
                  { ...TABLE_COL_10, disabled: true },
                  // TABLE_COL_11,
                  TABLE_COL_12,
                  TABLE_COL_13,
                  TABLE_COL_14,
                  TABLE_COL_15,
                  TABLE_COL_16,
                  { ...TABLE_COL_17, disable: true },
                  TABLE_COL_18,
                  TABLE_COL_19,
                ],
              },
            ],
          },
          {
            title: "联系人信息",
            rows: [
              {
                cols: [
                  { ...TABLE_COL_20, disable: true },
                  TABLE_COL_21,
                  TABLE_COL_22,
                  { ...TABLE_COL_23, disable: true },
                  TABLE_COL_24,
                  TABLE_COL_25,
                  { ...TABLE_COL_26, disable: true },
                  TABLE_COL_27,
                ],
              },
            ],
          },
          // {
          //   title: '客户登录账号',
          //   rows: [
          //     {
          //       cols: [
          //         TABLE_COL_28,
          //         TABLE_COL_29
          //       ],
          //     },
          //   ],
          // },
        ],
      },
    ],
    formRules: {
      salesLeadsId: [
        { required: true, message: "请选择关联线索", trigger: "change" },
      ],
      customerInfo_code: [
        { required: true, message: "请填写公司编码", trigger: "blur" },
        txtRules,
      ],
      customerInfo_nameCn: [
        { required: true, message: "请填写公司名称", trigger: "blur" },
      ],
      customerInfo_shortName: [
        { required: true, message: "请填写公司简称", trigger: "blur" },
      ],
      customerInfo_level: [
        { required: true, message: "请选择客户等级", trigger: "change" },
      ],
      customerInfo_category: [
        { required: true, message: "请选择客户类别", trigger: "change" },
      ],
      customerInfo_paymentMode: [
        { required: true, message: "请选择欠费扣货模式", trigger: "change" },
      ],
      customerInfo_settleCycle: [
        { required: true, message: "请选择结算周期", trigger: "change" },
      ],
      customerInfo_addressCn: [
        { required: true, message: "请填写中文地址", trigger: "blur" },
      ],
      customerInfo_followUserId: [
        { required: true, message: "请选择负责员工", trigger: "change" },
      ],
      customerInfo_password: [
        {
          pattern: /^\S{6,}$/,
          message: "密码不能少于6位数",
          trigger: "blur",
        },
      ],
      customerContacts_name: [
        { required: true, message: "请填写姓名", trigger: "blur" },
      ],
      // customerContacts_contactPhone: [
      //   { required: true, message: "请填写联系电话", trigger: "blur" },
      // ],
      // customerContacts_email: [
      //   { required: true, message: "请填写联系邮箱", trigger: "blur" },
      // ],
      customerInfo_businessOwnership: [
        { required: true, message: "请选择客户归属", trigger: "change" },
      ],
    }, // 表单校验规则
  };
};

export const supplier = {
  title: "新增服务商",
  lists: [
    {
      className: "leftContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                TABLE_COL_1,
                TABLE_COL_4,
                TABLE_COL_5,
                {
                  ...TABLE_COL_3,
                  span: 24,
                },
                // {
                //   ...TABLE_COL_30,
                //   span: 24
                // },
                // TABLE_COL_35
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
              cols: [TABLE_COL_2],
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
                {
                  ...TABLE_COL_30,
                  span: 12,
                },
                // {
                //   ...TABLE_COL_35,
                //   span:12
                // },
                TABLE_COL_14,
                TABLE_COL_12,
                TABLE_COL_15,
                TABLE_COL_16,
                TABLE_COL_17,
                TABLE_COL_18,
                TABLE_COL_19,
              ],
            },
          ],
        },
        {
          title: "联系人信息",
          rows: [
            {
              cols: [
                TABLE_COL_20,
                TABLE_COL_21,
                TABLE_COL_22,
                TABLE_COL_23,
                TABLE_COL_24,
                TABLE_COL_25,
                TABLE_COL_26,
                TABLE_COL_27,
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customerInfo_code: [
      { required: true, message: "请填写公司编码", trigger: "blur" },
      txtRules,
    ],
    customerInfo_nameCn: [
      { required: true, message: "请填写公司名称", trigger: "blur" },
    ],
    customerInfo_shortName: [
      { required: true, message: "请填写公司简称", trigger: "blur" },
    ],
    customerInfo_category: [
      { required: true, message: "请选择供应类别", trigger: "blur" },
    ],
    customerInfo_settleCycle: [
      { required: true, message: "请选择结算周期", trigger: "blur" },
    ],
    customerInfo_addressCn: [
      { required: true, message: "请填写中文地址", trigger: "blur" },
    ],
    // 'customerInfo_ascription': [
    //   { required: true, message: "请选择归属", trigger: "blur" },
    // ],
  }, // 表单校验规则
};

export const subsidiary = {
  title: "新增堡森",
  lists: [
    {
      className: "leftContent",
      fieldList: [
        {
          rows: [
            {
              cols: [
                TABLE_COL_1,
                TABLE_COL_4,
                TABLE_COL_5,
                {
                  ...TABLE_COL_3,
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
              cols: [TABLE_COL_2],
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
                TABLE_COL_12,
                TABLE_COL_14,
                TABLE_COL_17,
                TABLE_COL_18,
                TABLE_COL_19,
              ],
            },
          ],
        },
        {
          title: "联系人信息",
          rows: [
            {
              cols: [
                TABLE_COL_20,
                TABLE_COL_21,
                TABLE_COL_22,
                TABLE_COL_23,
                TABLE_COL_24,
                TABLE_COL_25,
                TABLE_COL_26,
                TABLE_COL_27,
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customerInfo_code: [
      { required: true, message: "请填写公司编码", trigger: "blur" },
    ],
    customerInfo_nameCn: [
      { required: true, message: "请填写公司名称", trigger: "blur" },
    ],
    customerInfo_shortName: [
      { required: true, message: "请填写公司简称", trigger: "blur" },
    ],
    customerInfo_addressCn: [
      { required: true, message: "请填写中文地址", trigger: "blur" },
    ],
  }, // 表单校验规则
};

export const staff = {
  //员工列表新增
  title: "新增员工",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [TABLE_COL_31, TABLE_COL_32, TABLE_COL_33, TABLE_COL_34],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    code: [{ required: true, message: "请填写员工编码", trigger: "blur" }],
    nameCn: [
      { required: true, message: "请填写员工中文名称", trigger: "blur" },
    ],
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
                TABLE_COL_1,
                TABLE_COL_2,
                TABLE_COL_3,
                TABLE_COL_4,
                TABLE_COL_5,
                TABLE_COL_6,
                TABLE_COL_7,
                TABLE_COL_8,
                // TABLE_COL_9,
                TABLE_COL_10,
                // TABLE_COL_11,
                TABLE_COL_12,
                TABLE_COL_13,
                TABLE_COL_14,
                TABLE_COL_15,
                TABLE_COL_16,
                TABLE_COL_17,
                TABLE_COL_18,
                TABLE_COL_19,
              ],
            },
          ],
        },
        {
          title: "联系人信息",
          rows: [
            {
              cols: [
                TABLE_COL_20,
                TABLE_COL_21,
                TABLE_COL_22,
                TABLE_COL_23,
                TABLE_COL_24,
                TABLE_COL_25,
                TABLE_COL_26,
                TABLE_COL_27,
              ],
            },
          ],
        },
        {
          title: "客户登录账号",
          rows: [
            {
              cols: [TABLE_COL_28, TABLE_COL_29],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    customerInfo_code: [
      { required: true, message: "请填写公司编码", trigger: "blur" },
    ],
    customerInfo_nameCn: [
      { required: true, message: "请填写公司名称", trigger: "blur" },
    ],
    customerInfo_shortName: [
      { required: true, message: "请填写公司简称", trigger: "blur" },
    ],
    customerInfo_level: [
      { required: true, message: "请选择客户等级", trigger: "blur" },
    ],
    // "customerInfo_clientIdentity": [
    //   { required: true, message: "请选择客户身份", trigger: "blur" },
    // ],
    customerInfo_category: [
      { required: true, message: "请选择客户类别", trigger: "blur" },
    ],
    // "customerInfo_source": [
    //   { required: true, message: "请选择客户来源", trigger: "blur" },
    // ],
    customerInfo_paymentMode: [
      { required: true, message: "请选择欠费扣货模式", trigger: "blur" },
    ],
    customerInfo_settleCycle: [
      { required: true, message: "请选择结算周期", trigger: "blur" },
    ],
    customerInfo_addressCn: [
      { required: true, message: "请填写中文地址", trigger: "blur" },
    ],
    // "customerContacts_name": [
    //   { required: true, message: "请填写姓名", trigger: "blur" },
    // ],
    // "customerContacts_gender": [
    //   { required: true, message: "请选择性别", trigger: "blur" },
    // ],
    // "customerContacts_contactPhone": [
    //   { required: true, message: "请输入联系电话", trigger: "blur" },
    // ],
    customerInfo_followUserId: [
      { required: true, message: "请选择负责员工", trigger: "blur" },
    ],
    customerInfo_password: [
      {
        pattern: /^\S{6,}$/,
        message: "密码不能少于6位数",
        trigger: "blur",
      },
    ],
  }, // 表单校验规则
};
