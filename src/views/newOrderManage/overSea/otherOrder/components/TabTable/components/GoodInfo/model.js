import { httpProductSkuSelect } from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 130,
  customRow: true,
};
// 货物信息
const GOOD_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  width: 1,
  fixed: "left",
};
const GOOD_COLS_1 = {
  prop: "shipmentId",
  label: "箱序号",
  minWidth: 120,
  showOverflowTooltip: true,
  // request: true,
  // customRow: true,
  // fieldItem: {
  //   type: "text",
  //   placeholder: "箱序号",
  //   maxlength: 50,
  // },
};
const GOOD_COLS_2 = {
  prop: "referenceId",
  label: "Reference ID",
  minWidth: 110,
  showOverflowTooltip: true,
  // customRow: true,
  // fieldItem: {
  //   type: "text",
  //   maxlength: 50,
  // },
};
const GOOD_COLS_3 = {
  prop: "predictionNum",
  label: "箱数",
  minWidth: 100,
  align: "right",
  showOverflowTooltip: true,
  // request: true,
  // customRow: true,
  // fieldItem: {
  //   type: "inputNumber",
  //   decimal: 0,
  // },
};
const GOOD_COLS_4 = {
  prop: "boxLong",
  label: "箱长(CM)",
  minWidth: 100,
  align: "right",
  showOverflowTooltip: true,
  // request: true,
  // customRow: true,
  // fieldItem: {
  //   placeholder: "箱长",
  //   type: "inputNumber",
  //   decimal: 1,
  //   max: 99999999.9,
  // },
};
const GOOD_COLS_5 = {
  prop: "boxWide",
  label: "箱宽(CM)",
  minWidth: 100,
  align: "right",
  showOverflowTooltip: true,
  // request: true,
  // customRow: true,
  // fieldItem: {
  //   placeholder: "箱宽",
  //   type: "inputNumber",
  //   decimal: 1,
  //   max: 99999999.9,
  // },
};
const GOOD_COLS_6 = {
  prop: "boxHigh",
  label: "箱高(CM)",
  minWidth: 100,
  align: "right",
  showOverflowTooltip: true,
  // request: true,
  // customRow: true,
  // fieldItem: {
  //   placeholder: "箱高",
  //   type: "inputNumber",
  //   decimal: 1,
  //   max: 99999999.9,
  // },
};
const GOOD_COLS_7 = {
  prop: "boxVolume",
  label: "单箱体积(CBM)",
  minWidth: 120,
  align: "right",
  showOverflowTooltip: true,
  render: (row) =>
    (
      (Number(row.boxLong || 0) *
        Number(row.boxWide || 0) *
        Number(row.boxHigh || 0)) /
      1000000
    ).toFixed(2),
};
const GOOD_COLS_8 = {
  prop: "boxWeight",
  label: "单箱毛重(KG)",
  minWidth: 120,
  align: "right",
  showOverflowTooltip: true,
  // request: true,
  // customRow: true,
  // fieldItem: {
  //   placeholder: "单箱毛重",
  //   type: "inputNumber",
  //   decimal: 2,
  //   max: 99999999.99,
  // },
};
const GOOD_COLS_9 = {
  prop: "storageType",
  label: "入库用途",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "storageType",
  // customRow: true,
  // fieldItem: {
  //   type: "select",
  //   basicType: "storageType",
  // },
};
const GOOD_COLS_10 = {
  prop: "consigneeWarehouseId",
  label: "目的地",
  minWidth: 180,
  // request: true,
  // customRow: true,
  // // fixed: "right",
  // fieldItem: {
  //   id: "consigneeWarehouseId",
  //   size: "mini",
  //   selectLabelKey: "consigneeWarehouseCode",
  //   ...httpWarehousePublicSelect({
  //     // itemId: 'id'
  //   }),
  // },
  showOverflowTooltip: true,
  render: (row) => row.consigneeWarehouseAddress || "--",
};
const GOOD_COLS_11 = {
  label: "柜型",
  prop: "boxSizeCode",
  minWidth: 80,
  showOverflowTooltip: true,
};
const GOOD_COLS_12 = {
  label: "柜量",
  prop: "boxNum",
  minWidth: 100,
  align: "right",
  showOverflowTooltip: true,
  // request: true,
  // customRow: true,
  // fieldItem: {
  //   placeholder: "柜量",
  //   type: "inputNumber",
  //   decimal: 1,
  //   max: 99999999.9,
  // },
};
const PRODUCT_COLS_1 = {
  span: 7,
  id: "product",
  label: "产品",
  labelWidth: "58px",
  placeholder: "产品",
  size: "mini",
  selectLabelKey: "sku",
  ...httpProductSkuSelect(),
  type: "slot",
  isBackAll: true,
};
const PRODUCT_COLS_2 = {
  span: 5,
  id: "skuNum",
  label: "数量：",
  placeholder: "产品数",
  type: "inputNumber",
  decimal: 0,
};
const PRODUCT_COLS_3 = {
  span: 10,
  id: "skuName",
  label: "产品名称：",
  type: "txt",
};

const PRODUCT_COLS_4 = {
  span: 2,
  labelWidth: "0",
  id: "productSlotBtn",
  type: "slot",
  className: "product-icon-btn",
};

const productConfig = ({ isEdit, cusIndex }) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                { ...PRODUCT_COLS_1, label: `产品${cusIndex + 1}：` },
                { ...PRODUCT_COLS_2, ...(!isEdit ? { type: "txt" } : {}) },
                PRODUCT_COLS_3,
                ...(isEdit ? [PRODUCT_COLS_4] : []),
              ],
            },
          ],
        },
      ],
    },
  ];
};

// type:1=直清；2=派送
const goodTableColumns = ({ type, onlyDirect, freightType }, disable) => [
  TABLE_COLS_INDEX,
  ...(type === 2 && onlyDirect ? [] : [GOOD_COLS_EXPAND]),
  GOOD_COLS_1,
  GOOD_COLS_2,
  ...(freightType == 0 ? [GOOD_COLS_11, GOOD_COLS_12] : []),
  GOOD_COLS_3,
  GOOD_COLS_4,
  GOOD_COLS_5,
  GOOD_COLS_6,
  GOOD_COLS_7,
  GOOD_COLS_8,
  ...((type === 1 && !onlyDirect) || (type === 2 && !onlyDirect)
    ? [GOOD_COLS_9]
    : []),
  ...(type === 2 || !onlyDirect ? [GOOD_COLS_10] : []),
  ...(disable ? [] : [TABLE_COLS_OPERATION]),
];

const goodGrossTotal = [
  {
    label: "合计箱数：",
    prop: "totalNum",
    decimal: 0,
  },
  {
    label: "合计体积：",
    prop: "totalVolume",
    decimal: 2,
    unit: "CBM",
  },
  {
    label: "合计重量：",
    prop: "totalWeight",
    decimal: 2,
    unit: "KG",
  },
];

function handleRule(params, formRule) {
  for (let key in formRule) {
    // && params[key] !== 0
    if (!params[key]) {
      return formRule[key];
    }
  }
  return false;
}

export { productConfig, goodTableColumns, goodGrossTotal, handleRule };
