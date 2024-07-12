const SEARCH_COLS_1 = {
  id: "state",
  label: "任务状态：",
  placeholder: "选择任务状态",
  type: "select",
  basicType: "crmTaskState",
};
const SEARCH_COLS_2 = {
  id: "createTime",
  label: "开始时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_3 = {
  id: "searchValue",
  label: "关键词：",
  labelWidth: "55px",
  placeholder: "输入关键词",
  type: "text",
};
export const searchColumns = [SEARCH_COLS_1, SEARCH_COLS_2, SEARCH_COLS_3];
const TABLE_COLS_1 = {
  prop: "startTime",
  label: "开始时间：",
  minWidth: 120,
};
const TABLE_COLS_2 = {
  prop: "title",
  label: "任务标题：",
  minWidth: 120,
};
const TABLE_COLS_3 = {
  prop: "chargeUserName",
  label: "负责人员：",
  minWidth: 120,
};
const TABLE_COLS_4 = {
  prop: "state",
  label: "任务状态：",
  minWidth: 120,
  basicType: "crmTaskState",
  dotColor: true,
};
const TABLE_COLS_5 = {
  prop: "urgent",
  label: "紧要程度：",
  minWidth: 120,
  basicType: "crmTaskUrgent",
  fontColor: true,
};
export const tableColumns = [
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
];
