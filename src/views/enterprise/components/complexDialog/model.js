const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};

const FORM_COL_1 = {
  span: 12,
  id: "code",
  label: "联系人代码：",
  type: "txt",
};
const FORM_COL_2 = {
  span: 12,
  id: "contactsType",
  label: "类型：",
  type: "radio",
  options: [
    {
      label: "收件人",
      value: 0,
    },
    {
      label: "发件人",
      value: 1,
    },
  ],
};

const FORM_COL_3 = {
  span: 12,
  id: "company",
  label: "公司名字：",
  placeholder: "此处填写公司名字",
  type: "text",
  maxlength: 100,
  colUppercase: true,
};
const FORM_COL_4 = {
  span: 12,
  id: "country",
  label: "国家：",
  placeholder: "请选择国家",
  type: "autocomplete",
  category: "country",
  isAutoInitRequest: true,
  defaultKey: "id",
  isBackAll: true,
  defaultProp: {
    value: "id",
    label: "twoCode,nameCn",
  },
};
const FORM_COL_5 = {
  span: 24,
  id: "detailsAddr",
  label: "详细地址：",
  placeholder: "此处填写详细地址",
  type: "textarea",
  maxlength: 255,
  colUppercase: true,
};
const FORM_COL_6 = {
  span: 12,
  id: "postCode",
  label: "邮编：",
  placeholder: "此处填写邮编",
  type: "text",
  colUppercase: true,
};
const FORM_COL_7 = {
  span: 12,
  id: "contacts",
  label: "联系人姓名：",
  placeholder: "此处填写联系人姓名",
  type: "text",
  colUppercase: true,
};
const FORM_COL_8 = {
  span: 12,
  id: "phone",
  label: "联系电话：",
  placeholder: "此处填写联系电话",
  maxlength: 200,
  showOverflowTooltip: true,
  type: "text",
  colUppercase: true,
};
const FORM_COL_9 = {
  span: 12,
  id: "email",
  label: "联系邮箱：",
  placeholder: "此处填写联系邮箱",
  type: "text",
  colUppercase: true,
};
const FORM_COL_10 = {
  span: 12,
  id: "province",
  label: "省(州)：",
  placeholder: "此处填写省(州)",
  type: "text",
  maxlength: 30,
  colUppercase: true,
};
const FORM_COL_11 = {
  span: 12,
  id: "city",
  label: "城市：",
  placeholder: "此处填写城市",
  type: "text",
  colUppercase: true,
};
const FORM_COL_12 = {
  span: 12,
  id: "area",
  label: "区(县)：",
  placeholder: "此处填写区(县)",
  type: "text",
  colUppercase: true,
};
const FORM_COL_13 = {
  span: 12,
  id: "street",
  label: "街道：",
  placeholder: "此处填写街道",
  type: "text",
  colUppercase: true,
};
const FORM_COL_14 = {
  span: 12,
  id: "isDefault",
  text: "设为默认",
  type: "singleCheckbox",
};
const FORM_COL_15 = {
  span: 24,
  id: "titleTips",
  labelWidth: "25px",
  type: "slot",
};

export const mainContactsForm = {
  title: "提单联系人信息",
  width: "750px",
  labelWidth: "100px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COL_15,
                FORM_COL_1,
                FORM_COL_2,
                FORM_COL_3,
                FORM_COL_4,
                FORM_COL_5,
                FORM_COL_6,
                FORM_COL_7,
                FORM_COL_8,
                FORM_COL_9,
                FORM_COL_10,
                FORM_COL_11,
                FORM_COL_12,
                FORM_COL_13,
                FORM_COL_14,
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    contactsType: [
      { required: true, message: "请选择类型", trigger: "change" },
      txtRules,
    ],
    company: [
      { required: true, message: "请输入公司名称", trigger: "blur" },
      txtRules,
    ],
    country: [{ required: true, message: "请选择国家", trigger: "change" }],
    contacts: [txtRules],
    phone: [txtRules],
    email: [txtRules],
    taxId: [txtRules],
    street: [txtRules],
    province: [txtRules],
    city: [txtRules],
    area: [txtRules],
    detailsAddr: [
      { required: true, message: "请输入详细地址", trigger: "blur" },
      txtRules,
    ],
  },
};
