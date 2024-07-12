const FORM_COLS_1 = {
  span: 6,
  id: "shipCompanyName",
  label: "船公司：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 6,
  id: "voyage",
  label: "航程：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 6,
  id: "startEffectiveTime",
  label: "有效期：",
  type: "txt",
  render: (row) =>
    row.startEffectiveTime && row.endEffectiveTime
      ? `${row.startEffectiveTime}~${row.endEffectiveTime}`
      : "--",
};
const FORM_COLS_4 = {
  span: 6,
  id: "sailOpenTime",
  label: "开航期：",
  type: "txt",
};
const FORM_COLS_5 = {
  span: 6,
  id: "cutGateTime",
  label: "截关日期：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 6,
  id: "transferPortCode",
  label: "中转港：",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 6,
  id: "cabinOpenTime",
  label: "开舱日期：",
  type: "txt",
};
const FORM_COLS_8 = {
  span: 6,
  id: "from_xx_8",
  label: "预计到达时间：",
  type: "txt",
};
const FORM_COLS_9 = {
  span: 6,
  id: "routeName",
  label: "航线信息：",
  type: "txt",
};
const FORM_COLS_10 = {
  span: 6,
  id: "flightName",
  label: "船名/航班名：",
  type: "txt",
};
const FORM_COLS_11 = {
  span: 6,
  id: "voyageNumber",
  label: "船次/航次：",
  type: "txt",
};
const FORM_COLS_12 = {
  span: 6,
  id: "packingMode",
  label: "装箱方式：",
  type: "txt",
  basicType: "freightType",
};
const FORM_COLS_13 = {
  span: 6,
  id: "code",
  label: "运价编码：",
  type: "txt",
};
const FORM_COLS_14 = {
  span: 24,
  id: "remark",
  label: "备注：",
  type: "txt",
};
const FORM_COLS_15 = {
  span: 6,
  id: "cabinProxyCode",
  label: "订舱代理：",
  type: "txt",
};
const FORM_COLS_16 = {
  span: 6,
  id: "startPortCode",
  label: "起运港：",
  type: "txt",
};
const FORM_COLS_17 = {
  span: 6,
  id: "endPortCode",
  label: "目的港：",
  type: "txt",
};
const FORM_COLS_18 = {
  span: 6,
  id: "voyageNumber",
  label: "船次/航次：",
  type: "txt",
};

export const formColumns = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7,
  // FORM_COLS_8,
  FORM_COLS_9,
  FORM_COLS_10,
  FORM_COLS_11,
  FORM_COLS_12,
  FORM_COLS_13,
  FORM_COLS_14,
];

export const bookingColumns = [
  {
    ...FORM_COLS_11,
    label: "关联船名/航班名：",
  },
  FORM_COLS_9,
  // FORM_COLS_18,
  FORM_COLS_11,
  FORM_COLS_15,
  {
    ...FORM_COLS_1,
    label: "航空/船公司：",
  },
  FORM_COLS_16,
  FORM_COLS_4,
  FORM_COLS_17,
  FORM_COLS_7,
  FORM_COLS_6,
  FORM_COLS_5,
  FORM_COLS_2,
  FORM_COLS_12,
  FORM_COLS_3,
];
