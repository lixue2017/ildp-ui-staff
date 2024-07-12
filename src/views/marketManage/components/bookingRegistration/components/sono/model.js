import { GETSonoPageListsHttpRequest } from "@/comModel/httpSelect.js";
const TABLE_COL_1 = {
  prop: "boxModelName",
  label: "柜型",
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "boxNum",
  label: "柜量",
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "sono",
  label: "SO No（选择数量 ≤ 柜量）",
  showOverflowTooltip: true,
  customRow: true,
  putFieldItem: {
    //应收
    id: "sono",
    label: "sono：",
    placeholder: "请选择SO No",
    multiple: true,
    showCreate: true,
    ...GETSonoPageListsHttpRequest(),
  },
};
export const tableColumns = [TABLE_COL_1, TABLE_COL_2, TABLE_COL_3];
