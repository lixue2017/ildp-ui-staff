import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
import { CRM_ATTACH_URL } from "_comp/ComUpload/model";
const FORM_COLS_1 = {
  span: 12,
  id: "title",
  label: "任务标题：",
  placeholder: "请输入任务标题",
  type: "text",
};
const FORM_COLS_2 = {
  span: 12,
  id: "createTime",
  label: "任务时间：",
  startPlaceholder: "开始时间",
  endPlaceholder: "结束时间",
  type: "datetimerange",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_4 = {
  span: 12,
  id: "urgent",
  label: "紧要程度：",
  placeholder: "请选择紧要程度",
  type: "radio",
  basicType: "crmTaskUrgent",
};
const FORM_COLS_5 = {
  span: 12,
  id: "businessType",
  label: "关联业务：",
  placeholder: "请选择业务类型",
  type: "slot",
  basicType: "crmBusinessType",
  hideList: [2, 3],
};
const FORM_COLS_6 = {
  span: 24,
  id: "description",
  label: "任务描述：",
  placeholder: "请输入任务描述",
  type: "textarea",
  rows: 3,
  maxlength: 300,
};
const FORM_COLS_7 = (uploadData) => ({
  span: 24,
  id: "attachId",
  hideTitle: true,
  label: "上传附件：",
  placeholder: "请上传附件",
  type: "customUploadFile",
  uploadConfig: {
    accept: ".rar,.zip,.doc,.docx,.pdf",
    size: 20,
    limit: 20,
    url: CRM_ATTACH_URL,
    name: "attachFile",
    uploadData,
  },
});
const FORM_COLS_8 = {
  span: 12,
  id: "chargeUserId",
  label: "负责人员：",
  placeholder: "请选择负责人员",
  disabled: true,
  ...httpRoleDeptUserSelect(),
  selectLabelKey: "chargeUserName",
};
const FORM_COLS_9 = {
  span: 12,
  id: "participantUserIds",
  label: "参与人员：",
  placeholder: "请选择参与人员",
  multiple: true,
  ...httpRoleDeptUserSelect(),
  searchIdKey: "userId",
  type: "slot",
};
const FORM_COLS_10 = {
  span: 12,
  id: "reminder",
  label: "任务提醒：",
  placeholder: "请选择任务提醒",
  type: "select",
  basicType: "crmRemind",
};
const FORM_COLS_11 = {
  span: 12,
  id: "remindWays",
  label: "提醒方式：",
  type: "multiCheckbox",
  basicType: "crmRemindWay",
  hideList: [2, 3],
  disable: true,
};
const FORM_COLS_12 = {
  span: 12,
  id: "startTime",
  label: "跟进时间：",
  placeholder: "请选择跟进时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_13 = {
  span: 12,
  id: "title",
  label: "跟进内容：",
  placeholder: "请输入跟进内容",
  type: "text",
};
const FORM_COLS_14 = {
  ...FORM_COLS_8,
  label: "跟进人员：",
  placeholder: "请选择跟进人员",
};
const FORM_COLS_15 = {
  span: 12,
  id: "attendance",
  label: "移动考勤：",
  text: "执行人须到指定地点签到",
  type: "singleCheckbox",
};
const FORM_COLS_16 = {
  span: 24,
  id: "address",
  label: "签到地址：",
  placeholder: "请选择地址",
  type: "slot",
};
const FORM_COLS_17 = {
  ...FORM_COLS_9,
  label: "抄送人员：",
  placeholder: "请选择抄送人员",
};
const FORM_COLS_18 = {
  ...FORM_COLS_10,
  label: "跟进提醒：",
};

const formColumns = (uploadData) => [
  FORM_COLS_1,
  FORM_COLS_2,
  // FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7(uploadData),
  FORM_COLS_8,
  FORM_COLS_9,
  FORM_COLS_10,
  FORM_COLS_11,
];
const formColumns_task = [
  FORM_COLS_12,
  FORM_COLS_13,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_14,
  FORM_COLS_15,
  FORM_COLS_16,
  FORM_COLS_17,
  FORM_COLS_18,
  FORM_COLS_11,
];
// 普通任务
export const config = (uploadData) => ({
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: formColumns(uploadData),
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    title: [
      {
        required: true,
        message: "请输入任务标题",
        trigger: "change",
      },
    ],
    createTime: [
      {
        required: true,
        message: "请选择任务时间",
        trigger: "change",
      },
    ],
    chargeUserId: [
      {
        required: true,
        message: "请选择负责人员",
        trigger: "change",
      },
    ],
    participantUserIds: [
      {
        required: true,
        message: "请选择参与人员",
        trigger: "change",
      },
    ],
  }, // 表单校验规则
});
// 跟进任务
export const followUpTaskConfig = (attendance) => ({
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: formColumns_task,
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    title: [
      {
        required: true,
        message: "请输入跟进内容",
        trigger: "change",
      },
    ],
    startTime: [
      {
        required: true,
        message: "请选择跟进时间",
        trigger: "change",
      },
    ],
    chargeUserId: [
      {
        required: true,
        message: "请选择跟进人员",
        trigger: "change",
      },
    ],
    participantUserIds: [
      {
        required: true,
        message: "请选择抄送人员",
        trigger: "change",
      },
    ],
    ...(attendance
      ? {
          address: [
            {
              required: true,
              message: "请选择签到地址",
              trigger: "change",
            },
          ],
        }
      : {}),
  }, // 表单校验规则
});
