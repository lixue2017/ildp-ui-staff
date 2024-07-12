const FORM_COLS_1 = {
  span: 6,
  id: "type",
  label: "任务类型：",
  type: "txt",
  basicType: "crmTaskType",
};
const FORM_COLS_2 = {
  span: 6,
  id: "title",
  label: "任务标题：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 6,
  id: "startTime",
  label: "开始时间：",
  type: "txt",
};
const FORM_COLS_4 = {
  span: 6,
  id: "endTime",
  label: "结束时间：",
  type: "txt",
};
const FORM_COLS_5 = {
  span: 6,
  id: "urgent",
  label: "紧要程度：",
  type: "txt",
  basicType: "crmTaskUrgent",
};
const FORM_COLS_6 = {
  span: 6,
  id: "businessName",
  label: "关联业务：",
  type: "txt",
  isSkip: true,
};
const FORM_COLS_7 = {
  span: 6,
  id: "description",
  label: "任务描述：",
  type: "txt",
};
const FORM_COLS_8 = {
  span: 6,
  id: "chargeUserName",
  label: "负责人员：",
  type: "txt",
};
const FORM_COLS_9 = {
  span: 6,
  id: "participantUserName",
  label: "参与人员：",
  type: "txt",
};
const FORM_COLS_10 = {
  span: 6,
  id: "reminder",
  label: "任务提醒：",
  type: "txt",
  basicType: "crmRemind",
};
const FORM_COLS_11 = {
  span: 6,
  id: "remindWays",
  label: "提醒方式：",
  type: "txt",
  basicType: "crmRemindWay",
};
const FORM_COLS_12 = {
  span: 6,
  id: "createTime",
  label: "创建时间：",
  type: "txt",
};

const basicFormColumns = [
  FORM_COLS_1,
  FORM_COLS_2,
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
];

export const formConfig = {
  lists: [
    {
      fieldList: [
        {
          title: "基本信息",
          rowClassName: "form-rows-box",
          rows: [
            {
              cols: basicFormColumns,
            },
          ],
        },
        {
          title: "相关附件",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "attachTable",
                  type: "slot",
                  labelWidth: "0",
                },
              ],
            },
          ],
        },
        {
          title: "任务动态",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "taskTable",
                  type: "slot",
                  labelWidth: "0",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
