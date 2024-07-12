import overseaLangObj from "@/language/overseasLang.js";

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  label: overseaLangObj.yw_node || "业务节点",
  prop: "operationCode",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  label: overseaLangObj.bz_remark() || "备注",
  prop: "auditRemark",
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  label: overseaLangObj.czr_operator || "操作人",
  prop: "createBy",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  label: overseaLangObj.operator_time || "操作时间",
  prop: "createTime",
  minWidth: 160,
  showOverflowTooltip: true,
};
export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  // TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
];
