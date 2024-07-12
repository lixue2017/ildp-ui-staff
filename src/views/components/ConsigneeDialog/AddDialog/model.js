import { POSITIVE_PHONE } from "@/utils/mixin"

const EDIT_FORM_COL_1 = {
  span: 12,
  id: "addresName",
  label: "公司名称：",
  placeholder: "此处填写公司名称",
  type: "text",
  maxlength: 255
}
const EDIT_FORM_COL_2 = {
  span: 12,
  id: "code",
  label: "地址代码：",
  placeholder: "--",
  type: "txt"
}
const EDIT_FORM_COL_3 = {
  span: 12,
  id: "contacts",
  label: "联系人：",
  placeholder: "此处填写联系人姓名",
  type: "text",
  maxlength: 20
}
const EDIT_FORM_COL_4 = {
  span: 12,
  id: "phone",
  label: "联系电话：",
  placeholder: "此处填写联系电话",
  type: "text",
  maxlength: 200
}
const EDIT_FORM_COL_5 = {
  span: 24,
  id: "detailsAddr",
  label: "详细地址：",
  placeholder: "此处填写详细地址",
  type: "textarea",
  maxlength: 255
}
const EDIT_FORM_COL_6 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "此处填写备注",
  type: "textarea",
  maxlength: 500
}
const EDIT_FORM_COL_7 = {
  span: 12,
  id: "isDefault",
  text: "设为默认",
  type: "singleCheckbox"
}

const DETAIL_COLS = [
  EDIT_FORM_COL_2,
  EDIT_FORM_COL_1,
  {
    id: "slotStatus",
    type: "slot",
    basicType: "status",
    basicTypeVal: "status"
  },
  EDIT_FORM_COL_3,
  EDIT_FORM_COL_4,
  EDIT_FORM_COL_7,
  EDIT_FORM_COL_5,
  EDIT_FORM_COL_6,
]
/** 详情弹窗模板 */
export const DETAIL_FORM_COLS = DETAIL_COLS.map(ele => {
  return {
    ...ele,
    span: ele.span === 24 ? 24 : 8,
    type: ["slot", "singleCheckbox"].includes(ele.type) ? ele.type : "txt",
    disabled: true,
    placeholder: "--"
  }
})
export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                EDIT_FORM_COL_1,
                EDIT_FORM_COL_2,
                EDIT_FORM_COL_3,
                EDIT_FORM_COL_4,
                EDIT_FORM_COL_5,
                EDIT_FORM_COL_6,
                EDIT_FORM_COL_7
                // {
                //   span: 12,
                //   id: "country",
                //   label: "国家：",
                //   placeholder: "请选择国家",
                //   type: "autocomplete",
                //   category: "country",
                //   isBackAll: true,
                //   defaultProp: {
                //     value: 'id',
                //     label: 'twoCode,nameCn'
                //   }
                // },
                // {
                //   span: 12,
                //   id: "province",
                //   label: "省(州)：",
                //   placeholder: "此处填写省(州)",
                //   type: "text"
                // },
                // {
                //   span: 12,
                //   id: "city",
                //   label: "城市：",
                //   placeholder: "此处填写城市",
                //   type: "text"
                // },
                // {
                //   span: 12,
                //   id: "area",
                //   label: "区(县)：",
                //   placeholder: "此处填写区",
                //   type: "text"
                // },
                // {
                //   span: 12,
                //   id: "street",
                //   label: "街道：",
                //   placeholder: "此处填写街道",
                //   type: "text"
                // },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    addresName: [
      { required: true, message: "请输入公司名称", trigger: "blur" },
    ],
    contacts: [
      { required: true, message: "请输入联系人", trigger: "blur" },
    ],
    phone: [
      { required: true, message: "请输入联系电话", trigger: "blur" },
      // {
      //   message: '请输入正确的手机号',
      //   pattern: POSITIVE_PHONE,
      // }
    ],
    // country: [
    //   { required: true, message: "请选择国家", trigger: "blur" },
    // ],
    // province: [
    //   { required: true, message: "请输入省(州)", trigger: "blur" },
    // ],
    // city: [{ required: true, message: "请输入城市", trigger: "blur" }],
    // area: [{ required: true, message: "请输入区", trigger: "blur" }],
    detailsAddr: [
      { required: true, message: "请输入详细地址", trigger: "blur" },
    ],
  }
}
