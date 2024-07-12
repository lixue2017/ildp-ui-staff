import { httpGetVisitAndSignInPage } from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "签到时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "deptId",
  label: "选择部门：",
  placeholder: "选择部门",
  ...httpGetVisitAndSignInPage({ selectType: 1 }),
};
const SEARCH_COLS_3 = {
  id: "userIdList",
  label: "选择人员：",
  placeholder: "选择人员",
  multiple: true,
  ...httpGetVisitAndSignInPage({ selectType: 2 }),
};
const SEARCH_COLS_4 = {
  id: "leadsCode",
  label: "线索编号：",
  placeholder: "线索编号",
  type: "text",
};
const SEARCH_COLS_5 = {
  id: "leadsId",
  label: "客户：",
  placeholder: "客户",
  ...httpGetVisitAndSignInPage({ selectType: 3 }),
};
const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
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
  prop: "signInTime",
  label: "签到时间",
  showOverflowTooltip: true,
  minWidth: 160,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "userName",
  label: "姓名",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "left",
};
const TABLE_COLS_3 = {
  prop: "belongDeptName",
  label: "所属部门",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_4 = {
  prop: "signInAddress",
  label: "签到地址",
  sortable: true,
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 180,
};
const TABLE_COLS_5 = {
  prop: "leadsCode",
  label: "线索编号",
  sortable: true,
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_6 = {
  prop: "visitCustomer",
  label: "拜访客户",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 150,
};
const TABLE_COLS_7 = {
  prop: "visitReasons",
  label: "拜访事由",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_OPERATION = {
  label: "关联任务",
  prop: "operation",
  width: 100,
  columnOperation: true,
  fixed: "right",
};
const tableColumns = [
  // TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1, // 签到时间
  TABLE_COLS_2, // 姓名
  TABLE_COLS_3, // 所属部门
  TABLE_COLS_4, // 签到地址
  TABLE_COLS_5, // 线索编号
  TABLE_COLS_6, // 拜访客户
  TABLE_COLS_7, // 拜访事由
  TABLE_COLS_OPERATION, // 关联任务
];

export { searchColumns, tableColumns };
