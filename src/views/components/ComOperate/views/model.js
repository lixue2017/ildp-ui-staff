import overseaLangObj from "@/language/overseasLang.js";

const BTN_COLS_1 = {
  id: "customsRegistration",
  span: 24,
  text: overseaLangObj.qg_registration || "清关登记",
};
const BTN_COLS_2 = {
  id: "release",
  span: 12,
  text: "清关放行",
};
const BTN_COLS_3 = {
  id: "devanning",
  span: 12,
  text: "预计提拆柜",
  packingMethod: 0,
};
const BTN_COLS_4 = {
  id: "warehousing",
  span: 12,
  text: "预约入仓",
  packingMethod: 1,
};
// const BTN_COLS_5 = {
// 	id: 'estimatedDeparture',
// 	span: 12,
// 	text: '预计离港',
// }
// const BTN_COLS_6 = {
// 	id: 'expectedArrival',
// 	span: 12,
// 	text: '预计到港',
// }
const BTN_COLS_7 = {
  id: "customsEstimate",
  span: 12,
  text: overseaLangObj.yy_ps || "预约派送",
  btnType: "estimate",
};
const BTN_COLS_8 = {
  id: "customsActual",
  span: 12,
  text: overseaLangObj.js_ps || "实际派送",
  btnType: "actual",
};
const BTN_COLS_9 = {
  id: "customsExamineInfo",
  span: 12,
  text: overseaLangObj.qg_cy || "清关查验",
};

const BTN_COLS_10 = {
  id: "clearanceConfig",
  span: 12,
  text: overseaLangObj.yw_pz || "业务配置",
};
// const BTN_COLS_11 = {
// 	id: 'clearanceInspection',
// 	span: 12,
// 	text: '清关查验',
// }

const BTN_COLS_12 = {
  id: "expectedArrival",
  span: 12,
  text: overseaLangObj.yj_dg || "预计到港",
  nodeId: 23,
};
const BTN_COLS_17 = {
  id: "copyCustoms",
  span: 24,
  text: "复制清关信息",
};

// status 1=清关中 0=待清关； warehouseStatus 0=待预约； orderType 2=电商；freightType 0=整柜 1=散货
export const customsButtons = ({
  status,
  warehouseStatus,
  orderType,
  freightType,
  isMainBill, //1主单
}) => {
  const showRelease = status === 1;
  // const showDevanning = status !== 0 && warehouseStatus === 0 && orderType === 2 && freightType === 0
  const showWarehousing =
    status !== 0 &&
    warehouseStatus === 0 &&
    orderType === 2 &&
    freightType === 1;
  return [
    BTN_COLS_17,
    // BTN_COLS_1,//清关登记
    // ...showRelease ? [{ ...BTN_COLS_2, span: showDevanning || showWarehousing ? 12 : 24 }] : [],//清关放行
    // ...showDevanning ? [{ ...BTN_COLS_3, span: showRelease ? 12 : 24 }] : [],//预计提拆柜
    ...(showWarehousing
      ? [{ ...BTN_COLS_4, span: showRelease ? 12 : 24 }]
      : []), //预约入仓
    // ...showEstimatedDeparture ? [{ ...BTN_COLS_5, span: showExpectedArrival ? 12 : 24 }] : [],//预计离港
    ...(isMainBill == 1 ? [] : [BTN_COLS_7, BTN_COLS_8]), //预约派送,实际派送
    BTN_COLS_12,
    // BTN_COLS_9,//清关查验
  ];
};

export const clearanceButtons = ({
  status,
  warehouseStatus,
  orderType,
  freightType,
}) => {
  const showDevanning =
    status !== 0 &&
    warehouseStatus === 0 &&
    orderType === 2 &&
    freightType === 0;
  return [
    BTN_COLS_1, //清关登记
    ...([1, 3].includes(status) ? [{ ...BTN_COLS_2 }] : []), //清关放行
    ...(showDevanning ? [{ ...BTN_COLS_3 }] : []), //预计提拆柜
    BTN_COLS_10, //业务配置
    ...([1, 3].includes(status) ? [BTN_COLS_9] : []), // 清关查验
  ];
};
// export const clearanceButtons=[
//   BTN_COLS_1,
//   BTN_COLS_2,
//   BTN_COLS_3,
//   BTN_COLS_10,
//   {
//     ...BTN_COLS_9,
//     span:12
//   }
// ]

const BTN_COLS_13 = {
  id: "printMarks",
  span: 12,
  text: "打印唛头",
};
const BTN_COLS_14 = {
  id: "printWarehouseList",
  span: 12,
  text: "打印按SKU入库单",
};
const BTN_COLS_15 = {
  id: "printSku",
  span: 24,
  text: "打印SKU",
};
const BTN_COLS_16 = {
  id: "printBoxWarehouseList",
  span: 12,
  text: "打印按箱入库单",
};
export const thirdPartyBtn = (obj) => {
  const { storageType } = obj || {};
  if (storageType == 1) {
    // 整箱出库
    return [BTN_COLS_13, BTN_COLS_16, BTN_COLS_15];
  }
  return [BTN_COLS_13, BTN_COLS_14, BTN_COLS_15];
};

export const customPrintDialogCols = () => {
  return {
    title: "打印",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        span: 24,
        id: "isShowSku",
        label: "是否显示SKU：",
        type: "radio",
        dicsStr: "is_whether",
        customDicsArr: [1, 2],
      },
      {
        span: 24,
        id: "isSign",
        label: "是否显示标记：",
        type: "radio",
        dicsStr: "print_sign",
        customDicsArr: [1, 2, 3],
      },
    ],
    formRules: {},
  };
};
export const customPrintSkuDialogCols = () => {
  return {
    title: "打印",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        span: 24,
        id: "isShowSku",
        label: "打印维度：",
        type: "radio",
        dicsStr: "print_sku",
        customDicsArr: [1, 2],
      },
    ],
    formRules: {},
  };
};

const FILE_FORM_COL_6 = {
  span: 24,
  id: "totalPrintSkuNum",
  label: "SKU数量：",
  type: "txt",
};
export const printSkuDialogCols = () => {
  return {
    title: "打印SKU",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        span: 24,
        id: "isSign",
        label: "是否显示标记：",
        type: "radio",
        dicsStr: "print_sign",
        customDicsArr: [1, 2, 3],
      },
      FILE_FORM_COL_6,
    ],
    formRules: {},
  };
};
