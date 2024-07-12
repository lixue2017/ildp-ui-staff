import { POSITIVE_PHONE } from "@/utils/mixin";

const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};

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
                  id: "code",
                  label: "联系人代码：",
                  placeholder: "--",
                  type: "txt",
                },
                {
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
                  disable: true,
                },
                {
                  span: 12,
                  id: "company",
                  label: "公司名字：",
                  placeholder: "此处填写公司名字",
                  type: "text",
                  colUppercase: true,
                  maxlength: 100,
                },
                {
                  span: 12,
                  id: "country",
                  label: "国家：",
                  placeholder: "请选择国家",
                  type: "autocomplete",
                  category: "country",
                  isBackAll: true,
                  defaultProp: {
                    value: "id",
                    label: "twoCode,nameCn",
                  },
                },
                {
                  span: 24,
                  id: "detailsAddr",
                  label: "详细地址：",
                  placeholder: "此处填写详细地址",
                  type: "textarea",
                  colUppercase: true,
                  maxlength: 255,
                },
                {
                  span: 12,
                  id: "postCode",
                  label: "邮编：",
                  placeholder: "此处填写邮编",
                  type: "text",
                  colUppercase: true,
                  maxlength: 50,
                },
                {
                  span: 12,
                  id: "contacts",
                  label: "联系人姓名：",
                  placeholder: "此处填写联系人姓名",
                  type: "text",
                  colUppercase: true,
                  maxlength: 50,
                },
                {
                  span: 12,
                  id: "phone",
                  label: "联系电话：",
                  placeholder: "此处填写联系电话",
                  maxlength: 200,
                  showOverflowTooltip: true,
                  type: "text",
                  colUppercase: true,
                  // inputType: "number"
                },
                {
                  span: 12,
                  id: "email",
                  label: "联系邮箱：",
                  placeholder: "此处填写联系邮箱",
                  type: "text",
                  colUppercase: true,
                  maxlength: 50,
                },
                // {
                //   span: 12,
                //   id: "taxId",
                //   label: "税号：",
                //   placeholder: "税号",
                //   type: "slot",
                //   basicType: 'taxIdType',
                //   basicTypeVal: 'taxIdType'
                // },
                {
                  span: 12,
                  id: "province",
                  label: "省(州)：",
                  placeholder: "此处填写省(州)",
                  type: "text",
                  colUppercase: true,
                  maxlength: 30,
                },
                {
                  span: 12,
                  id: "city",
                  label: "城市：",
                  placeholder: "此处填写城市",
                  type: "text",
                  maxlength: 50,
                },
                {
                  span: 12,
                  id: "area",
                  label: "区(县)：",
                  placeholder: "此处填写区(县)",
                  type: "text",
                  colUppercase: true,
                  maxlength: 50,
                },
                {
                  span: 12,
                  id: "street",
                  label: "街道：",
                  placeholder: "此处填写街道",
                  type: "text",
                  colUppercase: true,
                  maxlength: 50,
                },
                {
                  span: 12,
                  id: "isDefault",
                  text: "设为默认",
                  type: "singleCheckbox",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    // contacts: [
    //   { required: true, message: "请输入联系人", trigger: "blur" },
    //   txtRules
    // ],
    // phone: [
    //   { required: true, message: "请输入联系电话", trigger: "blur" },
    //   txtRules
    // ],
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
