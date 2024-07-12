import {
  httpRoleDeptUserSelect,
  httpGetSalesLeadsSelectPage,
} from "@/comModel/httpSelect";
import { CRM_ATTACH_URL } from "_comp/ComUpload/model";
const FORM_COLS_1 = {
  span: 12,
  id: "type",
  label: "跟进方式：",
  placeholder: "请选择跟进方式",
  type: "select",
  basicType: "crmFollowType",
};
const FORM_COLS_2 = {
  span: 12,
  id: "actualFollowTime",
  label: "实际跟进时间：",
  placeholder: "请选择跟进时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_3 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "勤跟进，多签单",
  type: "slot",
};
const FORM_COLS_4 = {
  span: 12,
  id: "businessId",
  label: "客户名称：",
  placeholder: "请选择客户名称",
  ...httpGetSalesLeadsSelectPage(),
  selectLabelKey: "businessName",
  currData: true,
  type: "slot",
};
const FORM_COLS_5 = {
  span: 12,
  id: "salesLeadsState",
  label: "跟进状态：",
  placeholder: "请选择跟进状态",
  type: "select",
  basicType: "crmSalesLeadsState",
  hideList: [2],
};
const FORM_COLS_6 = {
  span: 12,
  id: "remindUserIds",
  label: "提醒谁看：",
  placeholder: "请选择提醒谁看",
  multiple: true,
  ...httpRoleDeptUserSelect(),
  searchIdKey: "userId",
  type: "slot",
};
const FORM_COLS_7 = {
  span: 12,
  id: "followTask",
  text: "创建下次跟进任务",
  type: "singleCheckbox",
};
const FORM_COLS_8 = {
  span: 12,
  id: "taskFollowTime",
  label: "跟进时间：",
  placeholder: "请选择跟进时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_9 = {
  span: 12,
  id: "taskFollowContext",
  label: "跟进内容：",
  placeholder: "请输入跟进内容",
  type: "text",
};
const FORM_COLS_10 = {
  span: 12,
  id: "taskFollowUserId",
  label: "跟进人员：",
  placeholder: "请选择跟进人员",
  ...httpRoleDeptUserSelect(),
};
const FORM_COLS_11 = {
  span: 12,
  id: "address",
  label: "签到：",
  placeholder: "请选择签到",
  type: "slot",
};

const FORM_COLS_12 = {
  span: 12,
  id: "taskReminder",
  label: "跟进提醒：",
  placeholder: "请选择跟进提醒",
  type: "select",
  basicType: "crmRemind",
};
const FORM_COLS_13 = {
  span: 12,
  id: "taskRemindWays",
  label: "提醒方式：",
  type: "multiCheckbox",
  basicType: "crmRemindWay",
  hideList: [2, 3],
  disable: true,
};

const formColumns = (isEdit, isAttendanceTask) => [
  { ...FORM_COLS_1, disabled: !!isAttendanceTask },
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  // ...(type ? [FORM_COLS_11] : []), // pc不要签到
  ...(isEdit ? [] : [FORM_COLS_7]),
];
export const config = ({ followTask, type, isEdit, isAttendanceTask }) => ({
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: followTask
                ? formColumns(isEdit, isAttendanceTask).concat([
                    FORM_COLS_8,
                    FORM_COLS_9,
                    FORM_COLS_10,
                    FORM_COLS_12,
                    FORM_COLS_13,
                  ])
                : formColumns(isEdit, isAttendanceTask),
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    businessId: [
      {
        required: true,
        message: "请选择客户名称",
        trigger: "change",
      },
    ],
    salesLeadsState: [
      {
        required: true,
        message: "请选择跟进状态",
        trigger: "change",
      },
    ],
    // address: [
    //   {
    //     required: true,
    //     message: "请选择地址",
    //     trigger: "change",
    //   },
    // ],
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
  }, // 表单校验规则
});
const FORM_COLS_23 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "请输入备注信息",
  type: "textarea",
  rows: 3,
  maxlength: 300,
};
const FORM_COLS_24 = (uploadData) => ({
  span: 24,
  id: "attachId",
  hideTitle: true,
  label: "上传图片：",
  type: "customUploadFile",
  pasteUpload: true,
  uploadConfig: {
    type: "picture",
    accept: ".jpg,.png,.gif",
    size: 20,
    limit: 10,
    url: CRM_ATTACH_URL,
    uploadData,
    name: "attachFile",
  },
});
export const ordinaryFollowUp = (uploadData) => {
  return {
    title: "跟进任务",
    width: "480px",
    labelWidth: "75px",
    isAttachFileId: true,
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [FORM_COLS_23, FORM_COLS_24(uploadData)],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      // remark: [
      //   { required: true, message: "请输入备注信息", trigger: "change" },
      // ],
    },
  };
};
