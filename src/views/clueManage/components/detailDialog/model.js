const FOLLOW_COLS_1 = {
  span: 12,
  id: "type",
  label: "跟进类型：",
  type: "txt",
  basicType: "crmFollowType",
};
const FOLLOW_COLS_2 = {
  span: 12,
  id: "type",
  label: "跟进方式：",
  type: "txt",
  basicType: "crmFollowType",
};
const FOLLOW_COLS_3 = {
  span: 12,
  id: "followTime",
  label: "跟进时间：",
  type: "txt",
};
const FOLLOW_COLS_4 = {
  span: 12,
  id: "remark",
  label: "跟进描述：",
  type: "slot",
};
const FOLLOW_COLS_5 = {
  span: 12,
  id: "customerName",
  label: "客户名称：",
  type: "txt",
};
const FOLLOW_COLS_6 = {
  span: 12,
  id: "salesLeadsState",
  label: "线索状态：",
  type: "txt",
  basicType: "crmSalesLeadsState",
};
const FOLLOW_COLS_7 = {
  span: 12,
  id: "attachInfoName",
  label: "相关附件：",
  type: "txt",
};
const FOLLOW_COLS_8 = {
  span: 12,
  id: "commentCount",
  label: "评论数量：",
  type: "txt",
  render: (row) => `${row.commentCount}条`,
};
const FOLLOW_COLS_9 = {
  span: 12,
  id: "followUserName",
  label: "跟进人员：",
  type: "txt",
  render: (row) => row.followUserName || row.chargeUserName || "--",
};
const FOLLOW_COLS_10 = {
  span: 12,
  id: "remindUserName",
  label: "提醒谁看：",
  type: "txt",
};
const FOLLOW_COLS_11 = {
  span: 12,
  id: "createTime",
  label: "创建时间：",
  type: "txt",
};
export const followFormColumns = [
  FOLLOW_COLS_1,
  FOLLOW_COLS_2,
  FOLLOW_COLS_3,
  FOLLOW_COLS_4,
  FOLLOW_COLS_5,
  FOLLOW_COLS_6,
  FOLLOW_COLS_7,
  FOLLOW_COLS_8,
  FOLLOW_COLS_9,
  FOLLOW_COLS_10,
  FOLLOW_COLS_11,
];
const TASK_COLS_1 = {
  span: 12,
  id: "type",
  label: "任务类型：",
  type: "txt",
  basicType: "crmTaskType",
};
const TASK_COLS_2 = {
  span: 12,
  id: "title",
  label: "跟进内容：",
  type: "txt",
};
const TASK_COLS_3 = {
  span: 12,
  id: "startTime",
  label: "跟进时间：",
  type: "txt",
};
const TASK_COLS_4 = {
  span: 12,
  id: "urgent",
  label: "紧要程度：",
  type: "txt",
  basicType: "crmTaskUrgent",
};
const TASK_COLS_5 = {
  span: 12,
  id: "businessName",
  label: "关联业务：",
  type: "txt",
};
const TASK_COLS_6 = {
  span: 12,
  id: "address",
  label: "签到地址：",
  type: "txt",
  isSkip: true,
};
const TASK_COLS_7 = {
  span: 12,
  id: "reminder",
  label: "任务提醒：",
  type: "txt",
  basicType: "crmRemind",
};
const TASK_COLS_8 = {
  span: 12,
  id: "remindWays",
  label: "提醒方式：",
  type: "txt",
  basicType: "crmRemindWay",
};
const TASK_COLS_9 = {
  span: 12,
  id: "createTime",
  label: "创建时间：",
  type: "txt",
};
const TASK_COLS_10 = {
  span: 12,
  id: "state",
  label: "任务状态：",
  type: "txt",
  basicType: "crmTaskState",
};
const TASK_COLS_11 = {
  span: 12,
  id: "updateUserName",
  label: "处理人员：",
  type: "txt",
};
const TASK_COLS_12 = {
  span: 12,
  id: "updateTime",
  label: "处理时间：",
  type: "txt",
};
const TASK_COLS_13 = {
  span: 12,
  id: "followRecord",
  label: "跟进记录：",
  type: "slot",
};
const TASK_COLS_14 = {
  span: 12,
  id: "remark",
  label: "备注信息：",
  type: "txt",
};
export const taskFormColumns = [
  TASK_COLS_1,
  TASK_COLS_2,
  TASK_COLS_3,
  TASK_COLS_4,
  TASK_COLS_5,
  FOLLOW_COLS_9,
  TASK_COLS_6,
  TASK_COLS_7,
  TASK_COLS_8,
  TASK_COLS_9,
];
export const taskStateInfo = (crmFollowId) => [
  TASK_COLS_10,
  TASK_COLS_11,
  TASK_COLS_12,
  ...(crmFollowId ? [TASK_COLS_13] : [TASK_COLS_14]),
];
export const taskFormConfig = (crmFollowId) => {
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: taskFormColumns,
              },
            ],
          },
          {
            title: "状态信息",
            rows: [
              {
                cols: taskStateInfo(crmFollowId),
              },
            ],
          },
        ],
      },
    ],
    formRules: {},
  };
};
