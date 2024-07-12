import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "state",
  label: "任务状态：",
  placeholder: "任务状态",
  type: "select",
  basicType: "crmTaskState",
};
const SEARCH_COLS_3 = {
  id: "userId",
  label: "发起人员：",
  placeholder: "发起人员",
  ...httpRoleDeptUserSelect({ isCrm: 1 }),
};
const SEARCH_COLS_4 = {
  id: "chargeUserId",
  label: "负责人员：",
  placeholder: "负责人员",
  ...httpRoleDeptUserSelect({ isCrm: 1 }),
};
const SEARCH_COLS_5 = {
  id: "startTime",
  label: "开始时间：",
  placeholder: "开始时间",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_6 = {
  id: "endTime",
  label: "结束时间：",
  placeholder: "结束时间",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_7 = {
  id: "leadsCode",
  label: "关键词：",
  placeholder: "线索编号/客户名称",
  type: "text",
};
const searchColumns = [
  SEARCH_COLS_7,
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
];

const TABLE_COLS_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 60,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "code",
  label: "任务编号",
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "title",
  label: "任务标题",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
  fixed: "left",
};
const TABLE_COLS_3 = {
  prop: "type",
  label: "任务类型",
  basicType: "crmTaskType",
  fontColor: true,
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_4 = {
  prop: "urgent",
  label: "紧急程度",
  basicType: "crmTaskUrgent",
  fontColor: true,
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_5 = {
  prop: "businessName",
  label: "关联线索",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_6 = {
  prop: "startTime",
  label: "开始时间",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_7 = {
  prop: "endTime",
  label: "结束时间",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_8 = {
  prop: "chargeUserName",
  label: "负责人",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_9 = {
  prop: "participantUserName",
  label: "参与人",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_10 = {
  prop: "address",
  label: "签到地址",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
};
const TABLE_COLS_11 = {
  prop: "state",
  label: "任务状态",
  basicType: "crmTaskState",
  dotColor: true,
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_12 = {
  prop: "createUserName",
  label: "创建人",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_13 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 150,
  columnOperation: true,
  fixed: "right",
};
const tableColumns = [
  // TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1, // 任务编号
  TABLE_COLS_2, // 任务标题
  TABLE_COLS_3, // 任务类型
  TABLE_COLS_4, // 紧急程度
  TABLE_COLS_5, // 关联线索
  TABLE_COLS_6, // 开始时间
  TABLE_COLS_7, // 结束时间
  TABLE_COLS_8, // 负责人
  TABLE_COLS_9, // 参与人
  TABLE_COLS_10, // 签到地址
  TABLE_COLS_11, // 任务状态
  TABLE_COLS_12, // 创建人
  TABLE_COLS_13, // 创建时间
  TABLE_COLS_OPERATION, // 操作
];

export { searchColumns, tableColumns };
