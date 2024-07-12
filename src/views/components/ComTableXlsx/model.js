import { httpProductSkuSelect } from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
// 仅英文(放宽字符：( ) , + - / \ %)
const POSITIVE_ONLY_EN =
  /[\u4e00-\u9fa5~`@#$^_=?><|！￥……（）——“：‘；、？。，》《·【】\{\}\[\]]/g;
// 仅数字
const POSITIVE_ONLY_NUM = /[^\d]/g;
// 百分比percentage
const POSITIVE_PERCENTAGE = /[^\d.%]/g;
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  width: 158,
  labelTop: "SKU",
  labelBtm: "SKU",
  prop: "sku",
  // fixed: "left",
  // request: true,
  fieldItem: {
    id: "sku",
    selectLabelKey: "sku",
    ...httpProductSkuSelect(),
    getCustomData: (item, dics) => {
      const { sku, productNameCn, productNameEn } = item;
      const label = `${sku} | ${productNameCn}(${productNameEn})`;
      return {
        label,
        value: item.cusProductId,
        key: item.cusProductId,
      };
    },
    size: "mini",
    currData: true,
    allowCreate: true,
    placeholder: "sku",
    message: "请选择SKU！",
  },
};
const TABLE_COLS_2 = {
  width: 132,
  labelTop: "Marks",
  labelBtm: "唛头",
  prop: "shippingMark",
  // fixed: "left",
  fieldItem: {
    merge: true,
    type: "text",
    placeholder: "唛头",
  },
};
const TABLE_COLS_3 = {
  width: 158,
  labelTop: "DESCRIPTION(CN)",
  labelBtm: "货物中文名称",
  prop: "declaredNameCn",
  // fixed: "left",
  request: true,
  fieldItem: {
    type: "text",
    placeholder: "货物中文名称",
  },
};
const TABLE_COLS_4 = {
  width: 156,
  labelTop: "DESCRIPTION(EN)",
  labelBtm: "货物英文名称",
  prop: "declaredNameEn",
  // fixed: "left",
  request: true,
  fieldItem: {
    type: "text",
    placeholder: "货物英文名称",
    inputLimit: POSITIVE_ONLY_EN,
  },
};
const TABLE_COLS_5 = {
  width: 194,
  labelTop: "HS CODE(For Clearance)",
  labelBtm: "海关编码（清关使用编码）",
  prop: "customsCode",
  // fixed: "left",
  request: true,
  fieldItem: {
    type: "text",
    placeholder: "海关编码",
    inputLimit: POSITIVE_ONLY_NUM,
  },
};
const TABLE_COLS_6 = {
  width: 164,
  labelTop: "Quantity(PCS/SETS)",
  labelBtm: "计价数量",
  prop: "quantityNum",
  // fixed: "left",
  request: true,
  fieldItem: {
    placeholder: "计价数量",
    type: "inputNumber",
    decimal: 0,
    max: 999999999,
  },
};
const TABLE_COLS_7 = {
  width: 135,
  labelTop: "Unit price",
  labelBtm: "申报单价",
  prop: "declaredValue",
  // fixed: "left",
  request: true,
  fieldItem: {
    placeholder: "申报单价",
    type: "inputNumber",
    decimal: 2,
    max: 999999999,
  },
};
const TABLE_COLS_8 = {
  width: 135,
  labelTop: "Total Value",
  labelBtm: "申报总价",
  prop: "totalDeclaredValue",
  // request: true,
  align: "right",
  fieldItem: {
    type: "txt",
    decimal: 2,
  },
};
const TABLE_COLS_9 = {
  width: 135,
  labelTop: "Length(CM)",
  labelBtm: "外箱长",
  prop: "boxLength",
  request: true,
  align: "right",
  fieldItem: {
    merge: true,
    placeholder: "外箱长",
    type: "inputNumber",
    decimal: 1,
    max: 99999999.9,
  },
};
const TABLE_COLS_10 = {
  width: 135,
  labelTop: "Width(CM)",
  labelBtm: "外箱宽",
  prop: "boxWidth",
  request: true,
  align: "right",
  fieldItem: {
    merge: true,
    placeholder: "外箱宽",
    type: "inputNumber",
    decimal: 1,
    max: 99999999.9,
  },
};
const TABLE_COLS_11 = {
  width: 135,
  labelTop: "Height(CM)",
  labelBtm: "外箱高",
  prop: "boxHeight",
  request: true,
  align: "right",
  fieldItem: {
    merge: true,
    placeholder: "外箱高",
    type: "inputNumber",
    decimal: 1,
    max: 99999999.9,
  },
};
const TABLE_COLS_12 = {
  width: 198,
  labelTop: "The Number Of Cartons",
  labelBtm: "包装箱数",
  prop: "boxCount",
  request: true,
  fieldItem: {
    merge: true,
    placeholder: "包装箱数",
    type: "inputNumber",
    decimal: 0,
    max: 999999999,
  },
};
const TABLE_COLS_13 = {
  width: 158,
  labelTop: "G.W(KGS/CTN)",
  labelBtm: "每箱毛重",
  prop: "boxWeight",
  // request: true,
  align: "right",
  fieldItem: {
    merge: true,
    placeholder: "每箱毛重",
    type: "txt",
    decimal: 2,
    max: 99999999.9999,
  },
};
const TABLE_COLS_14 = {
  width: 158,
  labelTop: "N.W(KGS/CTN)",
  labelBtm: "每箱净重",
  prop: "productNetWeight",
  request: true,
  align: "right",
  fieldItem: {
    merge: true,
    placeholder: "每箱净重",
    type: "inputNumber",
    decimal: 4,
    max: 99999999.9999,
  },
};
const TABLE_COLS_15 = {
  width: 158,
  labelTop: "Total G.W(KGS)",
  labelBtm: "总毛重",
  prop: "boxTotalWeight",
  request: true,
  align: "right",
  fieldItem: {
    merge: true,
    placeholder: "总毛重",
    type: "inputNumber",
    decimal: 2,
    max: 99999999899900000,
  },
};
const TABLE_COLS_16 = {
  width: 158,
  labelTop: "Total N.W(KGS)",
  labelBtm: "总净重",
  prop: "totalProductNetWeight",
  // request: true,
  align: "right",
  fieldItem: {
    merge: true,
    type: "txt",
    decimal: 4,
  },
};
const TABLE_COLS_17 = {
  width: 158,
  labelTop: "Measurement(M3)",
  labelBtm: "体积",
  prop: "boxVolume",
  // request: true,
  align: "right",
  fieldItem: {
    merge: true,
    type: "txt",
    decimal: 3,
  },
};
const TABLE_COLS_18 = {
  width: 118,
  labelTop: "Model",
  labelBtm: "型号",
  prop: "boxNumber",
  request: true,
  fieldItem: {
    placeholder: "型号",
    type: "text",
  },
};
const TABLE_COLS_19 = {
  width: 138,
  labelTop: "Material(CN)",
  labelBtm: "产品材质(中文)",
  prop: "materialCn",
  request: true,
  fieldItem: {
    placeholder: "产品材质",
    type: "text",
  },
};
const TABLE_COLS_20 = {
  width: 138,
  labelTop: "Material(EN)",
  labelBtm: "产品材质(英文)",
  prop: "materialEn",
  request: true,
  fieldItem: {
    placeholder: "产品材质",
    type: "text",
  },
};
const TABLE_COLS_21 = {
  width: 158,
  labelTop: "Product Use For",
  labelBtm: "用途(中文/英文)",
  prop: "businessUseEn",
  request: true,
  fieldItem: {
    placeholder: "用途",
    type: "text",
  },
};
const TABLE_COLS_22 = {
  width: 158,
  labelTop: "Product Pictures",
  labelBtm: "产品图片",
  prop: "img",
  request: true,
  fieldItem: {
    placeholder: "产品图片",
    type: "text",
  },
};
const TABLE_COLS_23 = {
  width: 118,
  labelTop: "Brand",
  labelBtm: "品牌",
  prop: "brand",
  request: true,
  fieldItem: {
    placeholder: "品牌",
    type: "text",
  },
};
const TABLE_COLS_24 = {
  width: 138,
  labelTop: "SHIPMENT ID",
  labelBtm: "货件号",
  prop: "shipmentId",
  request: true,
  fieldItem: {
    merge: true,
    placeholder: "货件号",
    type: "text",
  },
};
const TABLE_COLS_25 = {
  width: 138,
  labelTop: "Reference ID",
  labelBtm: "内部参考号",
  prop: "referenceId",
  request: true,
  fieldItem: {
    merge: true,
    placeholder: "内部参考号",
    type: "text",
  },
};
const TABLE_COLS_26 = {
  width: 208,
  labelTop: "FBA FC/Overseas Warehouse",
  labelBtm: "FBA仓库地址海外仓地址",
  prop: "consigneeWarehouseId",
  request: true,
  fieldItem: {
    merge: true,
    ...httpWarehousePublicSelect({
      typeList: "0,1,2,3,4",
      includTypeList: "0,1,2,3",
      keyId: "id",
    }),
    id: "consigneeWarehouseId",
    selectLabelKey: "consigneeWarehouseCode",
    size: "mini",
    focusLoad: true,
    showCreate: true,
    isBackAll: true,
    noClearable: false,
    placeholder: "海外仓地址",
    message: "请选择海外仓地址！",
  },
};
const TABLE_COLS_27 = {
  width: 138,
  labelTop: "SALES PRICE",
  labelBtm: "销售价",
  prop: "productUnitPrice",
  request: true,
  fieldItem: {
    placeholder: "销售价",
    type: "inputNumber",
    decimal: 2,
    max: 9999999999.99,
  },
};
const TABLE_COLS_28 = {
  width: 198,
  labelTop: "Percent",
  labelBtm: "申报单价/网页售价*100%",
  prop: "declaredValues",
  request: true,
  fieldItem: {
    placeholder: "申报单价/网页售价*100%",
    type: "text",
    inputLimit: POSITIVE_PERCENTAGE,
  },
};
const TABLE_COLS_29 = {
  width: 118,
  labelTop: "ASIN",
  labelBtm: "ASIN",
  prop: "asin",
  // request: true,
  fieldItem: {
    placeholder: "ASIN",
    type: "text",
  },
};
const TABLE_COLS_30 = {
  width: 198,
  labelTop: "AMAZON LINK",
  labelBtm: "对应清关店铺的平台销售链接",
  prop: "productLink",
  request: true,
  fieldItem: {
    placeholder: "平台销售链接",
    type: "text",
  },
};
const TABLE_COLS_31 = {
  width: 198,
  labelTop: "Amazon Pricing Screenshot",
  labelBtm: "后台定价截图",
  prop: "priceImg",
  fieldItem: {
    placeholder: "后台定价截图",
    type: "text",
  },
};
const TABLE_COLS_32 = {
  width: 198,
  labelTop: "Customs Clearance Remark",
  labelBtm: "报关备注",
  prop: "clearanceRemark",
  request: true,
  fieldItem: {
    placeholder: "报关备注",
    type: "text",
  },
};

const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  // TABLE_COLS_3,
  // TABLE_COLS_4,
  // TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_13,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_17,
  TABLE_COLS_18,
  // TABLE_COLS_19,
  // TABLE_COLS_20,
  // TABLE_COLS_21,
  // TABLE_COLS_22,
  // TABLE_COLS_23,
  // TABLE_COLS_24,
  // TABLE_COLS_25,
  // TABLE_COLS_26,
  // TABLE_COLS_27,
  // TABLE_COLS_28,
  // TABLE_COLS_29,
  // TABLE_COLS_30,
  // TABLE_COLS_31,
];

const formRule = {};
const slotInputProp = [];
const customHeaderColor = [];
const mergeCols = [];
const mergeColumnName = [];
function handleColumns() {
  tableColumns.forEach((item, index) => {
    if (item.fieldItem) {
      if (item.fieldItem.merge) {
        mergeCols.push(index);
        mergeColumnName.push(item.prop);
      }
      if (Object.keys(item.fieldItem).length) {
        slotInputProp.push(item.prop);
      }
      if (item.request) {
        formRule[item.prop] =
          item.fieldItem.message || `请输入${item.fieldItem.placeholder}！`;
      }
    }
  });
}
handleColumns();

export function handleRule(
  params,
  encasementWay,
  clearanceType,
  reportCustomsWayId,
  isOperationOrder,
  index
) {
  const errArr = [];
  let len = 0;
  if (isOperationOrder && ![0, 1, "0", "1"].includes(reportCustomsWayId)) {
    formRule.clearanceRemark = "请输入报关备注！";
  } else {
    formRule.clearanceRemark && delete formRule.clearanceRemark;
  }
  if (clearanceType == 0) {
    formRule.productLink && delete formRule.productLink;
  } else {
    formRule.productLink = "请输入平台销售链接！";
  }
  for (let key in formRule) {
    len += 1;
    if (
      !params[key] &&
      (!["productUnitPrice", "declaredValues"].includes(key) ||
        params[key] !== 0)
    ) {
      //  && params[key] !== 0
      errArr.push(formRule[key]);
    } else if (
      errArr.length &&
      key === "consigneeWarehouseId" &&
      encasementWay == 1 &&
      index != 0
    ) {
      errArr.push("consigneeWarehouseId");
    }
  }
  if (len === errArr.length) {
    return { deleteLine: true };
  }
  console.log(errArr.length);
  console.log(len);
  if (errArr.length && len !== errArr.length) {
    return { msg: errArr[0] };
  }
  return false;
}

const totalConfig = [
  {
    prop: "quantityNum",
    label: "总数量：",
  },
  {
    prop: "totalDeclaredValue",
    label: "总货值：",
    decimal: 2,
  },
  {
    prop: "boxCount",
    label: "总箱数：",
  },
  {
    prop: "boxTotalWeight",
    label: "总毛重：",
    decimal: 2,
  },
  {
    prop: "totalProductNetWeight",
    label: "总净重：",
    decimal: 4,
  },
  {
    prop: "boxVolume",
    label: "总体积：",
    decimal: 3,
  },
];
const clearanceRemark = TABLE_COLS_32;
export {
  tableColumns,
  slotInputProp,
  customHeaderColor,
  mergeCols,
  mergeColumnName,
  totalConfig,
  clearanceRemark,
};
