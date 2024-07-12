const FORM_COLS_1 = {
  span: 24,
  id: "receiveMailNoList",
  label: "收件人：",
  placeholder: "收件人(多选)",
  multiple: true,
  type: "select"
}
const FORM_COLS_2 = {
  span: 24,
  id: "ccMailNoList",
  label: "抄送人：",
  placeholder: "抄送人(多选)",
  multiple: true,
  type: "select"
}

const FORM_COLS_3 = {
  span: 12,
  id: "viewType",
  label: "选择模板：",
  type: "radio",
  dicsStr: "bill_type",
  customDicsArr: [0, 1, 2]
}

export { FORM_COLS_1, FORM_COLS_2, FORM_COLS_3 }