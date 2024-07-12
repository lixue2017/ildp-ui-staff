const addBill = {
  label: "新增账单",
  type: 'addBill'
}
const changeMembers = {
  label: "更换成员",
  type: 'changeMembers'
}
const lookLogistics = {
  label: "查看物流",
  type: 'lookLogistics'
}
const lookLogs = {
  label: "查看日志",
  type: 'lookLogs'
}
export const config = {
  4: [addBill, changeMembers, lookLogistics],
  5: [addBill, changeMembers, lookLogistics],
  6: [lookLogistics]
}

export const statusList = {
  4: {
    text: "头程运输结束",
    icon: "",
    status: 5,
  },
  5: {
    text: "国际运输结束",
    icon: "",
    status: 6,
  },
  6: {
    text: "放货登记",
    icon: "",
    status: 7,
  },
}
