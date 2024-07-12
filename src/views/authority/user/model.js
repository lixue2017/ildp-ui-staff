const FORM_COLS_1 = {
  span: 24,
  id: "userName",
  label: "选择员工：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_2 = {
  span: 24,
  id: "nameCn",
  label: "用户姓名：",
  placeholder: "请输入",
  type: "text",
}
const FORM_COLS_3 = {
  span: 24,
  id: "deptName",
  label: "所在部门：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_4 = {
  span: 24,
  id: "businessOwnershipName",
  label: "所属公司：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_5 = {
  span: 24,
  id: "phonenumber",
  label: "手机号码：",
  placeholder: "请输入",
  type: "text",
}
const FORM_COLS_6 = {
  span: 24,
  label: "备注：",
  id: "remark",
  placeholder: "备注说明（最多2000字）",
  type: "textarea",
  maxlength: 2000,
  rows: 3
}
export const customDialogCols = () => {
  return {
    title: '移交新员工',
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      FORM_COLS_1,
      FORM_COLS_2,
      FORM_COLS_3,
      FORM_COLS_4,
      FORM_COLS_5,
      FORM_COLS_6
    ],
    formRules: {
      phonenumber: [
        { required: true, message: `请输入手机号码`, trigger: "change" }
      ],
      nameCn: [
        { required: true, message: `请输入用户姓名`, trigger: "change" }
      ],
    }
  }
}
