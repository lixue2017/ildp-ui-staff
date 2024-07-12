import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
const BTN_COL_1 = {
  id: "addTask",
  span: 12,
  text: "新建任务",
  btnType: "dropdown",
  hasPermission: ["clueManage:salesClue:addTask"],
  dropdownArr: [
    {
      name: "跟进任务",
      value: "followUpTask",
    },
    {
      name: "普通任务",
      value: "ordinaryTask",
    },
  ],
};
const BTN_COL_2 = {
  id: "convertCustomer",
  span: 12,
  text: "转为客户",
  hasPermission: ["clueManage:salesClue:convertCustomer"],
};
const BTN_COL_3 = {
  id: "addFollow",
  span: 12,
  text: "写新跟进",
  hasPermission: ["clueManage:salesClue:followUp"],
};
const BTN_COL_4 = {
  id: "updateClue",
  span: 12,
  text: "编辑线索",
  hasPermission: ["clueManage:salesClue:edit"],
};
const BTN_COL_5 = {
  id: "receiveClue",
  span: 24,
  text: "领取线索",
  hasPermission: ["clueManage:publicClue:receiveClue"],
};

export const btnList = (data) => {
  const { state, isCustomer, communal } = data;
  let list = [];
  if (state === 2 || communal) {
    list = [BTN_COL_5];
  } else {
    list = [
      BTN_COL_1,
      ...(isCustomer ? [] : [BTN_COL_2]),
      BTN_COL_3,
      BTN_COL_4,
    ];
  }
  list = list.filter(
    (item) => !item.hasPermission || hasBtnPermits(item.hasPermission)
  );
  const len = list.length;
  if (!len) return [];
  if (len % 2) {
    list[len - 1].span = 24;
  } else {
    list[len - 1].span = 12;
  }
  return list;
};
