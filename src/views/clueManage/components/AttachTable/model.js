const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 60,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_INDEX = {
  type: "index",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "createTime",
  label: "上传时间",
  showOverflowTooltip: true,
  width: 160,
};
const TABLE_COLS_2 = {
  prop: "name",
  label: "附件名称",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_3 = {
  prop: "fileType",
  label: "附件格式",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_4 = {
  prop: "fileSize",
  label: "文件大小",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_5 = {
  prop: "createBy",
  label: "上传人员",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_6 = {
  prop: "remark",
  label: "备注信息",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 130,
  columnOperation: true,
  fixed: "right",
};
export const tableColumns = [
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_OPERATION,
];

export const salesLeadsTableColumns = (isCommunal) => [
  ...(isCommunal ? [TABLE_COLS_INDEX] : [TABLE_COLS_SELECTION]),
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_OPERATION,
];
