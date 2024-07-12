import {
  httpRoleDeptUserSelect,
  httpGetSalesLeadsSelectPage,
} from "@/comModel/httpSelect";
import { POSITIVE_PHONE } from "@/utils/mixin";
const FORM_COLS_1 = {
  span: 12,
  id: "contactName",
  label: "联系人姓名：",
  placeholder: "请输入联系人姓名",
  type: "text",
};
const FORM_COLS_2 = {
  span: 12,
  id: "crmSalesLeadsId",
  label: "关联线索：",
  placeholder: "请选择关联线索",
  ...httpGetSalesLeadsSelectPage({
    businessType: 1,
  }),
};
const FORM_COLS_3 = {
  span: 12,
  id: "honorific",
  label: "尊称：",
  placeholder: "请选择尊称",
  type: "radio",
  basicType: "crmHonorific",
};
const FORM_COLS_4 = {
  span: 12,
  id: "role",
  label: "角色：",
  placeholder: "请选择角色",
  type: "select",
  basicType: "crmRole",
};
const FORM_COLS_5 = {
  span: 12,
  id: "birthday",
  label: "生日：",
  placeholder: "请选择生日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_6 = {
  span: 12,
  id: "deptPosition",
  label: "部门职务：",
  placeholder: "请输入部门职务",
  type: "text",
};
const FORM_COLS_7 = {
  span: 12,
  id: "phone",
  label: "手机号码：",
  placeholder: "请输入手机号码",
  type: "text",
};
const FORM_COLS_8 = {
  span: 12,
  id: "telephone",
  label: "固定电话：",
  placeholder: "请输入固定电话",
  type: "text",
};
const FORM_COLS_9 = {
  span: 12,
  id: "email",
  label: "电子邮箱：",
  placeholder: "请输入电子邮箱",
  type: "text",
};
const FORM_COLS_10 = {
  span: 12,
  id: "weChat",
  label: "微信账号：",
  placeholder: "请输入微信账号",
  type: "text",
};
const FORM_COLS_11 = {
  span: 12,
  id: "qqNumber",
  label: "QQ号码：",
  placeholder: "请输入QQ号码",
  type: "text",
};
const FORM_COLS_12 = {
  span: 12,
  id: "province",
  label: "省份：",
  placeholder: "请输入省份",
  type: "text",
};
const FORM_COLS_12_1 = {
  span: 12,
  id: "city",
  label: "城市：",
  placeholder: "请输入城市",
  type: "text",
};
const FORM_COLS_12_2 = {
  span: 12,
  id: "area",
  label: "区域：",
  placeholder: "请输入区域",
  type: "text",
};
const FORM_COLS_13 = {
  span: 24,
  id: "address",
  label: "详细地址：",
  placeholder: "请输入详细地址",
  type: "text",
};
const FORM_COLS_14 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "请输入备注信息",
  type: "textarea",
  rows: 3,
  maxlength: 300,
};
const FORM_COLS_15 = {
  span: 12,
  id: "followTask",
  text: "创建跟进任务",
  type: "singleCheckbox",
};
const FORM_COLS_16 = {
  span: 12,
  id: "followTime",
  label: "下次跟进：",
  placeholder: "请选择下次跟进",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_17 = {
  span: 12,
  id: "followContext",
  label: "跟进内容：",
  placeholder: "请输入跟进内容",
  type: "text",
};
const FORM_COLS_18 = {
  span: 12,
  id: "followUserId",
  label: "跟进人员：",
  placeholder: "请选择跟进人员",
  disabled: true,
  selectLabelKey: "followUserName",
  ...httpRoleDeptUserSelect(),
};
const FORM_COLS_19 = {
  span: 12,
  id: "reminder",
  label: "任务提醒：",
  placeholder: "请输入任务提醒",
  type: "select",
  basicType: "crmRemind",
};
const FORM_COLS_20 = {
  span: 12,
  id: "remindWays",
  label: "提醒方式：",
  type: "multiCheckbox",
  basicType: "crmRemindWay",
  hideList: [2, 3],
};

const formColumns = (isEdit, isSalesLeads) => [
  FORM_COLS_1,
  { ...FORM_COLS_2, disabled: !!isSalesLeads },
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7,
  FORM_COLS_8,
  FORM_COLS_9,
  FORM_COLS_10,
  FORM_COLS_11,
  FORM_COLS_12,
  FORM_COLS_12_1,
  FORM_COLS_12_2,
  FORM_COLS_13,
  FORM_COLS_14,
  ...(isEdit ? [] : [FORM_COLS_15]),
];
export const config = (followTask, isEdit, isSalesLeads) => {
  return {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: followTask
                  ? formColumns(isEdit, isSalesLeads).concat([
                      FORM_COLS_16,
                      FORM_COLS_17,
                      FORM_COLS_18,
                      FORM_COLS_19,
                      FORM_COLS_20,
                    ])
                  : formColumns(isEdit, isSalesLeads),
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      contactName: [
        { required: true, message: "请输入联系人姓名", trigger: "change" },
      ],
      crmSalesLeadsId: [
        { required: true, message: "请选择关联线索", trigger: "change" },
      ],
      phone: [{ required: true, message: "请输入手机号码", trigger: "change" }],
      followTime: [
        { required: true, message: "请选择下次跟进时间", trigger: "change" },
      ],
      phone: [
        {
          message: "请输入正确的手机号",
          pattern: POSITIVE_PHONE,
        },
      ],
    }, // 表单校验规则
  };
};
