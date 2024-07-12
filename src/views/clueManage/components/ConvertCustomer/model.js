import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
import { POSITIVE_PHONE } from "@/utils/mixin";
const FORM_COLS_1 = {
  span: 12,
  id: "name",
  label: "客户名称：",
  placeholder: "请输入客户名称",
  type: "text",
};
const FORM_COLS_2 = {
  span: 12,
  id: "address",
  label: "地址：",
  placeholder: "请输入地址",
  type: "text",
  maxlength: 100,
};
const FORM_COLS_3 = {
  span: 12,
  id: "businessType",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type: "select",
  basicType: "crmLeadBusinessType",
};
const FORM_COLS_4 = {
  span: 12,
  id: "category",
  label: "客户类别：",
  placeholder: "客户类别(多选)",
  multiple: true,
  type: "select",
  basicType: "clientCategory",
};
const FORM_COLS_5 = {
  span: 12,
  id: "state",
  label: "跟进状态：",
  placeholder: "请选择跟进状态",
  type: "select",
  basicType: "crmSalesLeadsState",
  hideList: [2, 9],
};
const FORM_COLS_6 = {
  span: 12,
  id: "ownershipUserId",
  label: "归属人员：",
  placeholder: "请选择归属人员",
  selectLabelKey: "ownershipUserName",
  ...httpRoleDeptUserSelect(),
};
const FORM_COLS_7 = {
  span: 24,
  id: "level",
  label: "客户级别：",
  placeholder: "请选择客户级别",
  type: "radio",
  basicType: "crmCustomerLevel",
};
const FORM_COLS_8 = {
  span: 12,
  id: "source",
  label: "客户来源：",
  placeholder: "请选择客户来源",
  type: "select",
  basicType: "crmSource",
};
const FORM_COLS_9 = {
  span: 12,
  id: "shortName",
  label: "客户简称：",
  placeholder: "请输入客户简称",
  type: "text",
};
const FORM_COLS_10 = {
  span: 12,
  id: "customerCode",
  label: "客户代码：",
  placeholder: "请输入客户代码",
  type: "text",
};
const FORM_COLS_11 = {
  span: 12,
  id: "tags",
  label: "标签：",
  placeholder: "请输入标签",
  type: "slot",
};
const FORM_COLS_12 = {
  span: 12,
  id: "contactName",
  label: "联系人：",
  placeholder: "请输入联系人",
  type: "text",
  maxlength: 100,
};
const FORM_COLS_13 = {
  span: 12,
  id: "phone",
  label: "手机号码：",
  placeholder: "请输入手机号码",
  type: "text",
};

const formColumns = [
  FORM_COLS_1,
  FORM_COLS_8,
  FORM_COLS_2,
  FORM_COLS_9,
  FORM_COLS_3,
  FORM_COLS_10,
  FORM_COLS_4,
  FORM_COLS_11,
  FORM_COLS_5,
  FORM_COLS_12,
  FORM_COLS_6,
  FORM_COLS_13,
  FORM_COLS_7,
];
export const config = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: formColumns,
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    name: [
      {
        required: true,
        message: "请输入客户名称",
        trigger: "change",
      },
    ],
    shortName: [
      {
        required: true,
        message: "请输入客户简称",
        trigger: "change",
      },
    ],
    source: [
      {
        required: true,
        message: "请选择客户来源",
        trigger: "change",
      },
    ],
    address: [
      {
        required: true,
        message: "请输入地址",
        trigger: "change",
      },
    ],
    businessType: [
      {
        required: true,
        message: "请选择业务类型",
        trigger: "change",
      },
    ],
    category: [
      {
        required: true,
        message: "请选择客户类别",
        trigger: "change",
      },
    ],
    tags: [
      {
        required: true,
        message: "请选择标签",
        trigger: "change",
      },
    ],
    state: [
      {
        required: true,
        message: "请选择跟进状态",
        trigger: "change",
      },
    ],
    contactName: [
      {
        required: true,
        message: "请输入联系人",
        trigger: "change",
      },
    ],
    ownershipUserId: [
      {
        required: true,
        message: "请选择归属人员",
        trigger: "change",
      },
    ],
    phone: [
      {
        required: true,
        message: "请输入手机号码",
        trigger: "change",
      },
      {
        message: "请输入正确的手机号",
        pattern: POSITIVE_PHONE,
      },
    ],
    level: [
      {
        required: true,
        message: "请选择客户级别",
        trigger: "change",
      },
    ],
  }, // 表单校验规则
};
