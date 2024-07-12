import { MAX_LCL_NUM } from "@/utils/instructions";
import { httpTakeInfo } from "@/comModel/httpSelect";

export const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    label: "提货信息",
    prop: "takeInfo",
    showOverflowTooltip: true,
    request: true,
    customRow: true,
    width: 180,
    message: "请选择提货信息!",
    fieldItem: {
      id: "takeInfo",
      size: "mini",
      placeholder: "请选择提货地址",
      isBackAll: true,
      showCreate: true,
      focusLoad: true,
      ...httpTakeInfo(),
    },
  },
  {
    label: "提货地址",
    prop: "address",
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    label: "货物编码",
    prop: "freightCode",
    showOverflowTooltip: true,
    // request: true,
    customRow: true,
    width: 160,
    message: "请选择货物编码!",
  },
  // {
  //   label: "FBA箱号",
  //   prop: "boxNumber",
  //   showOverflowTooltip: true,
  // },
  {
    label1: "提货件数",
    label0: "提货柜量",
    prop: "takeFreightNum",
    align: "center",
    showOverflowTooltip: true,
    // request: true,
    customRow: true,
    customHeader: true,
    width: 120,
    message: "请输入提货件数(柜量)!",
    colMax: MAX_LCL_NUM,
  },
  {
    label: "到场时间",
    prop: "presentTime",
    showOverflowTooltip: true,
    align: "center",
    customRow: true,
    minWidth: 120,
  },
  {
    label: "总毛重(KG)",
    prop: "totalWeight",
    minWidth: 100,
    align: "right",
    decimal: 2,
    showOverflowTooltip: true,
  },
  {
    label: "总体积(CBM)",
    prop: "totalVolume",
    minWidth: 100,
    align: "right",
    decimal: 2,
    showOverflowTooltip: true,
  },
  {
    label: "操作",
    prop: "operation",
    customRow: true,
    width: 200,
    fixed: "right",
  },
];

const formRule = {};
tableColumns.forEach((item) => {
  if (item.request) {
    formRule[item.prop] = item.message || `请输入${item.label}！`;
  }
});

export function handleRule(params) {
  for (let key in formRule) {
    console.log(key);
    if (!params[key] && params[key] !== 0) {
      return formRule[key];
    }
  }
  return false;
}

export const grossTotal = [
  {
    label: "总箱数：",
    valClass: "val-bold",
    prop: "takeFreightNum",
  },
  {
    label: "总毛重：",
    prop: "totalWeight",
    decimal: 2,
    unit: "KG",
    valClass: "val-bold",
  },
  {
    label: "总体积：",
    prop: "totalVolume",
    decimal: 2,
    unit: "CBM",
    valClass: "val-bold",
  },
];
