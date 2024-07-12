import { MAX_FCL_NUM, MAX_LCL_NUM } from "@/utils/instructions";

export const grossTotalLists = {
  0: [
    {
      label: "柜量：",
      valClass: "val-bold",
      prop: "boxNum",
    },
    {
      label: "总重量：",
      prop: "totalWeight",
      decimal: 2,
      unit: "KG",
      valClass: "val-bold",
      compute: false,
      factor: [{ prop: "boxNum" }, { prop: "weight" }],
    },
    {
      label: "总体积：",
      prop: "totalVolume",
      decimal: 2,
      unit: "CBM",
      valClass: "val-bold",
      compute: false,
      factor: [{ prop: "boxNum" }, { prop: "volume" }],
    },
  ],
  1: [
    {
      label: "件数：",
      valClass: "val-bold",
      prop: "packNum",
    },
    {
      label: "总毛重：",
      prop: "totalWeight",
      decimal: 2,
      unit: "KG",
      valClass: "val-bold",
      compute: false,
      factor: [{ prop: "packNum" }, { prop: "weight" }],
    },
    {
      label: "总体积：",
      prop: "totalVolume",
      decimal: 2,
      unit: "CBM",
      valClass: "val-bold",
      compute: false,
      factor: [{ prop: "packNum" }, { prop: "volume" }],
    },
  ],
};
// 编号
const table_column_1 = {
  type: "index",
  minWidth: 50,
  align: "center",
  fixed: "left",
};

// 货物编码
const table_column_2 = {
  label: "箱序号",
  prop: "freightCode",
  minWidth: 80,
  showOverflowTooltip: true,
};

// 柜型
const table_column_3 = {
  label: "柜型",
  prop: "boxCode",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  minWidth: 100,
  message: "请选择柜型！",
};

// 柜量
const table_column_4 = {
  label: "柜量",
  placeholder: "柜量",
  prop: "boxNum",
  align: "right",
  minWidth: 60,
  showOverflowTooltip: true,
  request: true,
  align: "center",
  customRow: true,
  config: {
    decimal: 0,
    max: MAX_FCL_NUM,
  },
};

// 单柜重量(KG)
const table_column_5 = {
  label: "单柜重量(KG)",
  placeholder: "单柜重量(KG)",
  minWidth: 110,
  prop: "weight",
  align: "right",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  config: {
    decimal: 2,
    max: 99999.99,
  },
};

// 唛头
const table_column_6 = {
  label: "唛头",
  placeholder: "唛头",
  prop: "sku",
  minWidth: 180,
  showOverflowTooltip: true,
  customRow: true,
};

// 品名
const table_column_7 = {
  label: "品名",
  placeholder: "品名",
  prop: "productNameCn",
  minWidth: 180,
  showOverflowTooltip: true,
  request: true,
  customRow: true,
};

// H S CODE(海关编码)
const table_column_8 = {
  label: "H S CODE",
  placeholder: "H S CODE",
  prop: "customsCode",
  minWidth: 180,
  showOverflowTooltip: true,
  customRow: true,
};

// 单柜体积(CBM)
const table_column_9 = {
  label: "单柜体积(CBM)",
  placeholder: "单柜体积(CBM)",
  prop: "volume",
  minWidth: 115,
  align: "right",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  config: {
    decimal: 2,
    max: 99999.99,
  },
};

// 报关方式
const table_column_10 = {
  label: "报关方式",
  prop: "customsDeclarationType",
  showOverflowTooltip: true,
  basicType: "customsDeclarationType",
  request: true,
  customRow: true,
  minWidth: 140,
  message: "请选择报关方式！",
};

// 产品属性
const table_column_11 = {
  label: "产品属性",
  prop: "productAttribute",
  showOverflowTooltip: true,
  basicType: "productType",
  customRow: true,
  minWidth: 100,
  message: "请选择产品属性！",
};

// 包装
const table_column_12 = {
  label: "包装",
  prop: "packType",
  showOverflowTooltip: true,
  basicType: "packagingCode",
  request: true,
  customRow: true,
  minWidth: 100,
  message: "请选择包装！",
};

// 件数
const table_column_13 = {
  label: "件数",
  prop: "packNum",
  minWidth: 60,
  align: "center",
  placeholder: "件数",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  config: {
    decimal: 0,
    max: MAX_LCL_NUM,
  },
};

// 单件毛重(KG)
const table_column_14 = {
  ...table_column_5,
  placeholder: "单件毛重(KG)",
  label: "单件毛重(KG)",
};

// 长(CM)
const table_column_15 = {
  label: "长(CM)",
  prop: "length",
  align: "right",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  config: {
    decimal: 1,
    max: 9999.9,
  },
};

// 宽(CM)
const table_column_16 = {
  label: "宽(CM)",
  prop: "width",
  align: "right",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  config: {
    decimal: 1,
    max: 9999.9,
  },
};

// 高(CM)
const table_column_17 = {
  label: "高(CM)",
  prop: "height",
  align: "right",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  config: {
    decimal: 1,
    max: 9999.9,
  },
};

// 单件体积(CBM)
const table_column_18 = {
  label: "单件体积(CBM)",
  placeholder: "单件体积(CBM)",
  prop: "volume",
  minWidth: 115,
  align: "right",
  showOverflowTooltip: true,
  request: true,
  customRow: true,
  config: {
    decimal: 2,
    // max: 99999999.99
  },
};

const table_column_19 = {
  label: "毛重小计(KG)",
  placeholder: "毛重小计(KG)",
  prop: "totalWeight",
  align: "right",
  minWidth: 110,
  config: {
    decimal: 2,
    // max: 99999999.99
  },
  request: true,
  customRow: true,
  showOverflowTooltip: true,
};

const table_column_20 = {
  label: "体积小计(CBM)",
  placeholder: "体积小计(CBM)",
  prop: "totalVolume",
  align: "right",
  minWidth: 115,
  config: {
    decimal: 2,
    // max: 99999999.99
  },
  request: true,
  customRow: true,
  showOverflowTooltip: true,
};

const operation = {
  label: "操作",
  prop: "operation",
  customRow: true,
  minWidth: 140,
  fixed: "right",
};

// orderType: 3海运，4空运，5其他；freightType：0整柜，1散货
export const tableColumns = (freightType, orderType) => {
  let columns = [];
  if (freightType == 0) {
    columns = [
      table_column_1,
      table_column_2, //箱柜号
      table_column_3, //柜型
      table_column_4, //柜量
      // table_column_5,//单柜重量
      // table_column_9,//单柜体积
      table_column_19, //毛重小计
      table_column_20, //体积小计
      table_column_6, //唛头
      table_column_7, //品名
      table_column_8, //HSCODE
      { ...table_column_10, ...(orderType == 5 ? { request: false } : {}) }, //报关方式
      table_column_11, //产品属性
      operation,
    ];
  } else {
    columns = [
      table_column_1,
      table_column_2, //货物编码
      table_column_12, //包装
      table_column_13, //件数
      // table_column_15,
      // table_column_16,
      // table_column_17,
      // table_column_14,//单件毛重
      // table_column_18,//单件体积
      table_column_19, //毛重小计
      table_column_20, //体积小计
      table_column_6, //唛头
      table_column_7, //品名
      table_column_8, //HSCODE
      { ...table_column_10, ...(orderType == 5 ? { request: false } : {}) }, //报关方式
      table_column_11, //产品属性
      operation,
    ];
  }
  return columns;
};
export function handleRule(params, columns) {
  const formRule = {};
  columns.forEach((item) => {
    if (item.request) {
      formRule[item.prop] = item.message || `请输入${item.label}！`;
    }
  });
  for (let key in formRule) {
    console.log(key);
    if (!params[key] && params[key] !== 0) {
      return formRule[key];
    }
  }
  return false;
}
