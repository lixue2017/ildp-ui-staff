import { httpWarehousePublicSelect } from "@/comModel/warehouse";
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  defaultExpandShow: true,
  width: 1,
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "Shipment ID",
  prop: "shipmentId",
  isEdit: true,
  minWidth: 110,
  fieldItem: {
    placeholder: "Shipment ID",
    type: "text",
  },
};
const TABLE_COLS_2 = {
  label: "Reference ID",
  prop: "referenceId",
  isEdit: true,
  minWidth: 110,
  fieldItem: {
    placeholder: "Reference ID",
    type: "text",
  },
};
const TABLE_COLS_3 = {
  label: "唛头",
  prop: "shippingMark",
  isEdit: true,
  minWidth: 80,
  fieldItem: {
    placeholder: "唛头",
    type: "text",
  },
};
const TABLE_COLS_4 = {
  label: "箱数",
  prop: "boxCount",
  minWidth: 92,
  isEdit: true,
  request: true,
  align: "center",
  fieldItem: {
    placeholder: "箱数",
    type: "inputNumber",
    decimal: 0,
    max: 999999999,
  },
};
const TABLE_COLS_5 = {
  label: "箱长(CM)",
  prop: "boxLength",
  minWidth: 92,
  isEdit: true,
  request: true,
  align: "right",
  fieldItem: {
    placeholder: "箱长",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_6 = {
  label: "箱宽(CM)",
  prop: "boxWidth",
  minWidth: 92,
  isEdit: true,
  request: true,
  align: "right",
  fieldItem: {
    placeholder: "箱宽",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_7 = {
  label: "箱高(CM)",
  prop: "boxHeight",
  isEdit: true,
  request: true,
  minWidth: 92,
  align: "right",
  fieldItem: {
    placeholder: "箱高",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_8 = {
  label: "单箱体积(CBM)",
  prop: "boxVolume",
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  label: "单箱毛重(KG)",
  prop: "boxWeight",
  isEdit: true,
  request: true,
  minWidth: 110,
  align: "right",
  fieldItem: {
    placeholder: "单箱毛重",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_10 = {
  label: "收货地",
  prop: "consigneeWarehouseId",
  minWidth: 120,
  request: true,
  customRow: true,
  fieldItem: {
    id: "consigneeWarehouseId",
    ...httpWarehousePublicSelect({ itemId: "id" }),
    placeholder: "仓库代码/名称",
    noClearable: true,
    currData: true,
    showCreate: true,
    selectLabelKey: "consigneeWarehouseCode",
  },
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 90,
  customRow: true,
};
export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_EXPAND,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_OPERATION,
];
export const grossConfig = [
  {
    label: "合计箱数：",
    valClass: "val-bold",
    decimal: 0,
    prop: "totalBoxCount",
  },
  {
    label: "合计体积：",
    prop: "totalVolume",
    decimal: 2,
    unit: "CBM",
    valClass: "val-bold",
  },
  {
    label: "合计重量：",
    prop: "totalWeight",
    decimal: 2,
    unit: "KG",
    valClass: "val-bold",
  },
];
const formRule = {
  boxCount: "请输入箱数",
  boxLength: "请输入箱长",
  boxWidth: "请输入箱宽",
  boxHeight: "请输入箱高",
  boxWeight: "请输入单箱毛重",
  consigneeWarehouseId: "请选择收货地",
};
const ProFormRule = {
  productId: "请选择产品",
  productCount: "请输入产品数量",
};
function handleProRule(params) {
  for (let key in ProFormRule) {
    if (!params[key]) {
      //  && params[key] !== 0
      return ProFormRule[key];
    }
  }
  return false;
}
export function handleRule(params) {
  for (let key in formRule) {
    if (!params[key]) {
      //  && params[key] !== 0
      return formRule[key];
    }
  }
  const productList = params.productList;
  for (let index = 0; index < productList.length; index++) {
    const row = productList[index];
    const msg = handleProRule(row);
    if (msg) {
      return `,产品${index + 1}${msg}`;
    }
  }
  return false;
}
