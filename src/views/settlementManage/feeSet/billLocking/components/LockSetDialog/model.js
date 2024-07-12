export const config = {
  lists: [{
    span: 18,
    id: "lockMonth",
    label: "锁定月份：",
    placeholder: "----年--月",
    type: "month",
    valueFormat: "yyyy-MM"
  }, {
    span: 18,
    id: "serviceLockTime",
    label: "业务锁单时间：",
    placeholder: "年/月/日",
    type: "date",
    valueFormat: "yyyy-MM-dd"
  }, {
    span: 6,
    id: "time",
    labelWidth: "0px",
    placeholder: "00:00:00",
    type: "txt",
  }, {
    span: 18,
    id: "financeLockTime",
    label: "财务锁单时间：",
    placeholder: "年/月/日",
    type: "date",
    valueFormat: "yyyy-MM-dd"
  }, {
    span: 6,
    id: "time",
    labelWidth: "0px",
    placeholder: "00:00:00",
    type: "txt",
  }],
  formRules: {
    lockMonth: [{ required: true, message: "请选择锁定月份", trigger: "blur" }],
    serviceLockTime: [{ required: true, message: "请选择业务锁定时间", trigger: "blur" }],
    financeLockTime: [{ required: true, message: "请选择财务锁定时间", trigger: "blur" }]
  }
}