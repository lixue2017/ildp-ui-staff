import { toFixedNum, interceptNum } from "@/utils/instructions";
const TABLE_COLS_INDEX_SLOT = {
  prop: "indexSlot",
  width: 60,
  align: "center",
  customRow: true,
  fixed: "left",
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "Shipment ID",
  prop: "shipmentId",
  showOverflowTooltip: true,
  minWidth: 100,
  fixed: "left",
};
const TABLE_COLS_2 = {
  label: "Reference ID",
  prop: "referenceId",
  showOverflowTooltip: true,
  minWidth: 110,
};
const TABLE_COLS_3 = {
  label: "唛头",
  prop: "shippingMark",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_4 = {
  label: "箱号",
  prop: "boxNumber",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_5 = {
  label: "长*宽*高/CM",
  prop: "boxSize",
  showOverflowTooltip: true,
  minWidth: 120,
  render: (row) => {
    return `${toFixedNum(row.boxLength, 1) || 0}*${
      toFixedNum(row.boxWidth, 1) || 0
    }*${toFixedNum(row.boxHeight, 1) || 0}`;
  },
};
const VERIFY_TABLE_COLS_5 = (isCabinet) => ({
  ...TABLE_COLS_5,
  render: (row) => {
    let txt = `${toFixedNum(row.warehousingLength, 1) || 0}*${
      toFixedNum(row.warehousingWidth, 1) || 0
    }*${toFixedNum(row.warehousingHeight, 1) || 0}`;
    if (isCabinet) {
      txt = `${toFixedNum(row.length, 1) || 0}*${
        toFixedNum(row.width, 1) || 0
      }*${toFixedNum(row.height, 1) || 0}`;
    }
    return txt;
  },
});
const TABLE_COLS_6 = {
  label: "箱数",
  prop: "boxCount",
  align: "center",
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 0,
  isDiffMark: true,
  currentValProp: "boxCount",
  verifyValProp: "warehousingBoxNum",
};
const VERIFY_TABLE_COLS_6 = (isCabinet) => ({
  label: "箱数",
  prop: "quantity",
  align: "center",
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 0,
  render: (row) => {
    return isCabinet ? row.quantity : row.warehousingQuantity;
  },
});
const TABLE_COLS_7 = {
  label: "体积小计(m³)",
  prop: "totalboxVolume",
  decimal: 3,
  align: "right",
  showOverflowTooltip: true,
  minWidth: 130,
  isDiffMark: true,
  currentValProp: "totalboxVolume",
  verifyValProp: "warehousingTotalVolume",
  isNumIntercept: true,
};
const VERIFY_TABLE_COLS_7 = (isCabinet) => ({
  label: "体积小计(m³)",
  prop: "totalVolume",
  align: "right",
  showOverflowTooltip: true,
  minWidth: 130,
  render: (row) => {
    return isCabinet
      ? interceptNum(row.totalVolume)
      : interceptNum(row.warehousingTotalVolume);
  },
});
const TABLE_COLS_8 = {
  label: "毛重小计(KG)",
  prop: "totalBoxWeight",
  decimal: 2,
  align: "right",
  showOverflowTooltip: true,
  minWidth: 130,
  isDiffMark: true,
  currentValProp: "totalBoxWeight",
  verifyValProp: "warehousingTotalWeight",
};
const VERIFY_TABLE_COLS_8 = (isCabinet) => ({
  label: "毛重小计(KG)",
  prop: "totalWeight",
  decimal: 2,
  align: "right",
  showOverflowTooltip: true,
  minWidth: 130,
  render: (row) => {
    return toFixedNum(isCabinet ? row.totalWeight : row.warehousingTotalWeight);
  },
});
const TABLE_COLS_9 = {
  label: "收货地",
  prop: "warehouseCode",
  showOverflowTooltip: true,
  minWidth: 120,
  render: (row) => {
    return `${row.consigneeWarehouseCode || "--"}${
      row.warehouseName ? "/" + row.warehouseName : ""
    }`;
  },
};
const VERIFY_TABLE_COLS_9 = {
  ...TABLE_COLS_9,
  render: (row) => {
    return `${row.warehouseCode || "--"}/${row.warehouseName || "--"}`;
  },
};
// 快速下单
const TABLE_COLS_10 = {
  label: "箱长(CM)",
  prop: "boxLength",
  minWidth: 120,
  align: "right",
};
const TABLE_COLS_11 = {
  label: "箱宽(CM)",
  prop: "boxWidth",
  minWidth: 120,
  align: "right",
};
const TABLE_COLS_12 = {
  label: "箱高(CM)",
  prop: "boxHeight",
  minWidth: 120,
  align: "right",
};
const TABLE_COLS_13 = {
  label: "单箱体积(CBM)",
  prop: "boxVolume",
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  label: "单箱毛重(KG)",
  prop: "boxWeight",
  minWidth: 120,
  align: "right",
};
const TABLE_COLS_15 = {
  label: "SKU",
  prop: "freightSku",
  minWidth: 160,
};
const TABLE_COLS_16 = {
  label: "详细地址",
  prop: "warehouseAddress",
  minWidth: 160,
  showOverflowTooltip: true,
};
// 产品
const TABLE_COLS_PRO_1 = {
  prop: "img",
  width: 70,
  align: "center",
  customRow: true,
};
const TABLE_COLS_PRO_2 = {
  label: "SKU",
  prop: "sku",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_PRO_3 = {
  label: "名称",
  prop: "productNameCn",
  showOverflowTooltip: true,
  minWidth: 130,
  // render: (row) =>
  //   `${row.declaredNameCn || "--"}${
  //     row.declaredNameEn ? `(${row.declaredNameEn})` : ""
  //   }`,
};
const TABLE_COLS_PRO_4 = {
  label: "HS CODE",
  prop: "customsCode",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_5 = {
  label: "ASIN",
  prop: "asin",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_6 = {
  label: "产品重量(KG)",
  prop: "productWeight",
  showOverflowTooltip: true,
  minWidth: 130,
};
const TABLE_COLS_PRO_7 = {
  label: "产品净重(KG)",
  prop: "productNetWeight",
  showOverflowTooltip: true,
  minWidth: 130,
};
const TABLE_COLS_PRO_8 = {
  label: "申报价格",
  prop: "declaredValue",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_9 = {
  label: "数量",
  prop: "singleBoxNum",
  showOverflowTooltip: true,
  minWidth: 80,
};
const TABLE_COLS_PRO_10 = {
  label: "型号",
  prop: "productModel",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_11 = {
  label: "品牌",
  prop: "brand",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_12 = {
  label: "产品成分",
  prop: "materialCn",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_13 = {
  label: "产品用途",
  prop: "businessUseCn",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_14 = {
  label: "中文品名",
  prop: "declaredNameCn",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_15 = {
  label: "英文品名",
  prop: "declaredNameEn",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_16 = {
  label: "海关编码",
  prop: "customsCode",
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COLS_PRO_17 = {
  label: "产品数小计",
  prop: "totalProductCount",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_PRO_18 = {
  label: "产品材质(中文)",
  prop: "materialCn",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_PRO_19 = {
  label: "产品材质(英文)",
  prop: "materialEn",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_PRO_20 = {
  label: "功能",
  prop: "businessUseEn",
  showOverflowTooltip: true,
  minWidth: 100,
};
// 客户箱单
const tableColumns_invoice = [
  TABLE_COLS_INDEX,
  TABLE_COLS_PRO_14, // 中文品名
  TABLE_COLS_PRO_15, // 英文品名
  TABLE_COLS_PRO_16, // 海关编码
  { ...TABLE_COLS_6, isDiffMark: false }, // 箱数-预报
  // TABLE_COLS_PRO_17, // 产品数小计
  TABLE_COLS_5, // 长*宽*高-预报
  { ...TABLE_COLS_7, prop: "boxVolume", isDiffMark: false }, // 体积小计-预报
  { ...TABLE_COLS_8, prop: "boxWeight", isDiffMark: false }, // 毛重小计-预报
  TABLE_COLS_9, // 收货地-预报
  TABLE_COLS_16, // 详情地址
  { ...TABLE_COLS_PRO_10, prop: "boxNumber" }, // 型号
  TABLE_COLS_PRO_11, // 品牌
  TABLE_COLS_PRO_18, // 产品材质(中文)
  TABLE_COLS_PRO_19, // 产品材质(英文)
  TABLE_COLS_PRO_20, // 功能
];
// 产品
const tableColumns_product = [
  TABLE_COLS_PRO_1, // 产品图片
  TABLE_COLS_PRO_2, // SKU
  TABLE_COLS_PRO_3, // 名称
  TABLE_COLS_PRO_4, // HS CODE
  TABLE_COLS_PRO_5, // ASIN
  TABLE_COLS_PRO_6, // 产品重量
  TABLE_COLS_PRO_7, // 产品净重
  TABLE_COLS_PRO_8, // 申报价格
  TABLE_COLS_PRO_9, // 数量
  TABLE_COLS_PRO_10, // 型号
  TABLE_COLS_PRO_11, // 品牌
  TABLE_COLS_PRO_12, // 产品成分
  TABLE_COLS_PRO_13, // 产品用途
];
const tableColumns_com = [
  TABLE_COLS_2, // Reference ID
  TABLE_COLS_3, // 唛头
  TABLE_COLS_4, // 箱号
];
// 核实货物
const tableColumns_verify = (isCabinet) => [
  TABLE_COLS_INDEX_SLOT,
  TABLE_COLS_1, // Shipment ID
  ...tableColumns_com,
  VERIFY_TABLE_COLS_5(isCabinet), // 长*宽*高
  VERIFY_TABLE_COLS_6(isCabinet), // 箱数
  VERIFY_TABLE_COLS_7(isCabinet), // 体积小计
  VERIFY_TABLE_COLS_8(isCabinet), // 毛重小计
  VERIFY_TABLE_COLS_9, // 收货地
  ...tableColumns_product,
];
// 预报货物
const tableColumns_prediction = [
  TABLE_COLS_INDEX_SLOT,
  TABLE_COLS_1, // Shipment ID
  ...tableColumns_com,
  TABLE_COLS_5, // 长*宽*高
  TABLE_COLS_6, // 箱数
  TABLE_COLS_7, // 体积小计
  TABLE_COLS_8, // 毛重小计
  TABLE_COLS_9, // 收货地
  ...tableColumns_product,
];
// 预报货物-快速下单
const tableColumns_quick = [
  TABLE_COLS_INDEX,
  TABLE_COLS_6, // 箱数
  { ...TABLE_COLS_9, label: "目的仓" }, // 收货地
  TABLE_COLS_10, // 箱长
  TABLE_COLS_11, // 箱宽
  TABLE_COLS_12, // 箱高
  TABLE_COLS_13, // 单箱体积
  TABLE_COLS_14, // 单箱毛重
  TABLE_COLS_15, // SKU
];
//
const mergeColumnProps = [
  ...tableColumns_product,
  { prop: "boxNumber" },
  TABLE_COLS_PRO_14,
  TABLE_COLS_PRO_15,
  TABLE_COLS_PRO_19,
  TABLE_COLS_PRO_20,
].map((item) => item.prop);
export {
  mergeColumnProps, // 分列行
  tableColumns_invoice, // 客户箱单
  tableColumns_verify, // 核实货物
  tableColumns_prediction, // 预报货物
  tableColumns_quick, // 预报货物-快速下单
};
