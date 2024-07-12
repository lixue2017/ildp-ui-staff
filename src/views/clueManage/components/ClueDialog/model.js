import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
import { POSITIVE_PHONE } from "@/utils/mixin";
const FORM_COLS_1 = {
  span: 24,
  id: "name",
  label: "客户名称：",
  placeholder: "请输入客户名称",
  type: "text",
};
const FORM_COLS_2 = {
  span: 24,
  id: "contactName",
  label: "联系人姓名：",
  placeholder: "请输入联系人姓名",
  type: "text",
};
const FORM_COLS_3 = {
  span: 24,
  id: "honorific",
  label: "尊称：",
  placeholder: "请选择尊称",
  type: "radio",
  basicType: "crmHonorific",
};
const FORM_COLS_4 = {
  span: 24,
  id: "role",
  label: "角色：",
  placeholder: "请选择角色",
  type: "select",
  basicType: "crmRole",
};
const FORM_COLS_5 = {
  span: 24,
  id: "deptPosition",
  label: "部门职务：",
  placeholder: "请输入部门职务",
  type: "text",
};
const FORM_COLS_6 = {
  span: 24,
  id: "phone",
  label: "手机号码：",
  placeholder: "请输入手机号码",
  type: "text",
};
const FORM_COLS_7 = {
  span: 24,
  id: "telephone",
  label: "固定电话：",
  placeholder: "请输入固定电话",
  type: "text",
};
const FORM_COLS_8 = {
  span: 24,
  id: "email",
  label: "电子邮箱：",
  placeholder: "请输入电子邮箱",
  type: "text",
};
const FORM_COLS_9 = {
  span: 24,
  id: "weChat",
  label: "微信账号：",
  placeholder: "请输入微信账号",
  type: "text",
};
const FORM_COLS_10 = {
  span: 24,
  id: "qqNumber",
  label: "QQ号码：",
  placeholder: "请输入QQ号码",
  type: "text",
};
const FORM_COLS_11 = {
  span: 24,
  id: "leadSource",
  label: "线索来源：",
  placeholder: "请输入线索来源",
  type: "select",
  basicType: "crmLeadSource",
};
const FORM_COLS_12 = (isCustomer) => ({
  span: 24,
  id: "state",
  label: "线索状态：",
  placeholder: "请选择线索状态",
  type: "select",
  basicType: "crmSalesLeadsState",
  hideList: isCustomer ? [2] : [2, 9],
});
const FORM_COLS_13 = {
  span: 24,
  id: "ownershipUserId",
  label: "归属人员：",
  placeholder: "请选择归属人员",
  ...httpRoleDeptUserSelect(),
  selectLabelKey: "ownershipUserName",
  disabled: true,
};
const FORM_COLS_14 = {
  span: 24,
  id: "followTask",
  text: "创建跟进任务",
  type: "singleCheckbox",
};
const FORM_COLS_15 = {
  span: 24,
  id: "followTime",
  label: "下次跟进：",
  placeholder: "请选择下次跟进",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_16 = {
  span: 24,
  id: "followContext",
  label: "跟进内容：",
  placeholder: "请输入跟进内容",
  type: "text",
};
const FORM_COLS_17 = {
  span: 24,
  id: "followUserId",
  label: "跟进人员：",
  placeholder: "请选择跟进人员",
  ...httpRoleDeptUserSelect(),
};
const FORM_COLS_18 = {
  span: 24,
  id: "reminder",
  label: "任务提醒：",
  placeholder: "请选择任务提醒",
  type: "select",
  basicType: "crmRemind",
};
const FORM_COLS_19 = {
  span: 24,
  id: "remindWays",
  label: "提醒方式：",
  type: "multiCheckbox",
  basicType: "crmRemindWay",
  hideList: [2, 3],
  disable: true,
};

const formColumns_L = (isEdit) => [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7,
  ...(!isEdit ? [FORM_COLS_8, FORM_COLS_9, FORM_COLS_10] : []),
];
const formColumns_R = (isEdit, isCustomer) => [
  ...(isEdit ? [FORM_COLS_8, FORM_COLS_9, FORM_COLS_10] : []),
  FORM_COLS_11,
  FORM_COLS_12(isCustomer),
  FORM_COLS_13,
  ...(isEdit ? [] : [FORM_COLS_14]),
];
export const config = (followTask, isEdit, isCustomer) => {
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: formColumns_L(isEdit),
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
                cols: followTask
                  ? formColumns_R(isEdit, isCustomer).concat([
                      FORM_COLS_15,
                      FORM_COLS_16,
                      FORM_COLS_17,
                      FORM_COLS_18,
                      FORM_COLS_19,
                    ])
                  : formColumns_R(isEdit, isCustomer),
              },
            ],
          },
        ],
      },
    ],
    formRules: followTask
      ? {
          followTime: [
            {
              required: true,
              message: "请选择下次跟进",
              trigger: "change",
            },
          ],
          followUserId: [
            {
              required: true,
              message: "请选择跟进人员",
              trigger: "change",
            },
          ],
          phone: [
            {
              message: "请输入正确的手机号",
              pattern: POSITIVE_PHONE,
            },
          ],
        }
      : {
          phone: [
            {
              message: "请输入正确的手机号",
              pattern: POSITIVE_PHONE,
            },
          ],
        }, // 表单校验规则
  };
};
