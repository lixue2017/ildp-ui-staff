const BTN_COL_1 = {
  id: "uploadAttach",
  span: 12,
  text: "上传附件",
};
const BTN_COL_2 = {
  id: "cancelTask",
  span: 12,
  statusArr: [0, 1],
  text: "取消任务",
};
const BTN_COL_3 = {
  id: "editTask",
  span: 12,
  statusArr: [0],
  text: "编辑任务",
};
const BTN_COL_4 = {
  id: "followTask",
  span: 12,
  statusArr: [0],
  showAttendance: 1,
  text: "任务跟进",
};
const BTN_COL_5 = {
  id: "completeTask",
  span: 12,
  statusArr: [1],
  text: "任务完成",
};
const BTN_COL_6 = {
  id: "archiveTask",
  span: 12,
  statusArr: [3],
  text: "任务归档",
};
const BTN_COL_7 = {
  id: "repulseTask",
  span: 12,
  statusArr: [3],
  text: "任务打回",
};
const btnColumns = [
  BTN_COL_1,
  BTN_COL_2,
  BTN_COL_3,
  BTN_COL_4,
  BTN_COL_5,
  BTN_COL_6,
  BTN_COL_7,
];
export const btnList = (formData) => {
  const { state, attendance } = formData;
  const list = btnColumns.filter(
    (item) =>
      (!item.statusArr || item.statusArr.includes(state)) &&
      (!item.showAttendance || !attendance)
  );
  const len = list.length;
  if (len % 2) {
    list[len - 1].span = 24;
  } else {
    list[len - 1].span = 12;
  }
  return list;
};
