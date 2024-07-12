const SEARCH_COLS_1 = {
  span: 15,
  id: "dimension",
  labelWidth: "0px",
  placeholder: "-统计维度(多选)-",
  type: "slot",
  multiple: true,
  // collapseTags: true,
};
const SEARCH_COLS_2 = {
  span: 9,
  id: "trend",
  labelWidth: "0px",
  placeholder: "-不显示趋势-",
  type: "slot",
};

export const searchColumns = [SEARCH_COLS_1, SEARCH_COLS_2];
