const BTN_COL_1 = {
  id: "maintainGoods",
  span: 24,
  text: "维护货物",
};
const BTN_COL_2 = {
  id: "sofaTownChange",
  span: 12,
  text: "收发通更换",
};
const BTN_COL_3 = {
  id: "contentChange",
  span: 12,
  text: "内容更换",
};
const BTN_COL_4 = {
  id: "dispatchVehicles",
  span: 12,
  text: "约车",
};
const BTN_COL_5 = {
  id: "printMarks",
  span: 12,
  text: "打印唛头",
};
const BTN_COL_6 = {
  id: "printWarehouseList",
  span: 12,
  text: "打印入库单",
  slot: true,
};
const BTN_COL_7 = {
  id: "quickOrdering",
  span: 24,
  text: "完善信息",
};

export const btnList = (row = {}) => {
  const { orderType, status, isInvoice, quickOrder, isMainBill } = row; //2电商  3海运  4空运   5,6其他订单
  // const showVehicles = isInvoice === 0 && status != 1; // 接单后未入仓
  // const isReservation = !row.reserveStatus && row.encasementWay == 1; // LCL且未约车
  return {
    2: [
      ...([1, 10].includes(status) && [1, 2].includes(quickOrder)
        ? [BTN_COL_7]
        : [
            ...(isMainBill === 1 ? [] : [{ ...BTN_COL_1, span: 24 }]),
            ...(status == 10 ? [BTN_COL_2, BTN_COL_3] : []),
          ]),
      // { ...BTN_COL_1, span: isReservation ? 12 : 24 },
      // ...(isReservation ? [BTN_COL_4] : []),
      BTN_COL_5,
      BTN_COL_6,
    ],
    3: [...(status == 10 ? [BTN_COL_2, BTN_COL_3] : [])],
    4: [...(status == 10 ? [BTN_COL_2, BTN_COL_3] : [])],
    5: [...(status == 10 ? [BTN_COL_2, BTN_COL_3] : [])],
    6: [...(status == 10 ? [BTN_COL_2, BTN_COL_3] : [])],
  }[orderType];
};
