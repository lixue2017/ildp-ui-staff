import { httpProductSkuSelect, httpClearanceSend } from "@/comModel/httpSelect";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";

const tabsColumns = {
  6:{
    label: "基本信息",
    key: 6,
  },
  1: {
    label: "货物信息",
    key: 1,
  },
  2: {
    label: "应收应付",
    key: 2,
  },
  3: {
    label: "附件信息",
    key: 3,
  },
  4: {
    label: "物流轨迹",
    key: 4,
  },
  5: {
    label: "操作记录",
    key: 5,
  },
};
export const tabsConfig = (arr = []) => ({
  columns: arr.map((key) => tabsColumns[key]),
  active: arr[0],
});

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
  fixed: "right",
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
  label: "Shipment ID(箱序号)",
  minWidth: 165,
  request: true,
  customRow: true,
  fieldItem: {
    type: "text",
    placeholder: "箱序号",
    maxlength: 50,
  },
};
const GOOD_COLS_2 = {
  prop: "referenceId",
  label: "Reference ID",
  minWidth: 110,
  customRow: true,
  fieldItem: {
    type: "text",
    maxlength: 50,
  },
};
const GOOD_COLS_3 = {
  prop: "predictionNum",
  label: "箱数",
  minWidth: 100,
  align: "right",
  request: true,
  customRow: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 0,
  },
};
const GOOD_COLS_4 = {
  prop: "boxLong",
  label: "箱长(CM)",
  minWidth: 100,
  align: "right",
  request: true,
  customRow: true,
  fieldItem: {
    placeholder: "箱长",
    type: "inputNumber",
    decimal: 1,
    max: 99999999.9,
  },
};
const GOOD_COLS_5 = {
  prop: "boxWide",
  label: "箱宽(CM)",
  minWidth: 100,
  align: "right",
  request: true,
  customRow: true,
  fieldItem: {
    placeholder: "箱宽",
    type: "inputNumber",
    decimal: 1,
    max: 99999999.9,
  },
};
const GOOD_COLS_6 = {
  prop: "boxHigh",
  label: "箱高(CM)",
  minWidth: 100,
  align: "right",
  request: true,
  customRow: true,
  fieldItem: {
    placeholder: "箱高",
    type: "inputNumber",
    decimal: 1,
    max: 99999999.9,
  },
};
const GOOD_COLS_7 = {
  prop: "boxVolume",
  label: "单箱体积(CBM)",
  minWidth: 120,
  align: "right",
  decimal: 2,
  // render: (row) => (Number(row.boxLong || 0) * Number(row.boxWide || 0) * Number(row.boxHigh || 0) / 1000000).toFixed(2)
};
const GOOD_COLS_8 = {
  prop: "boxWeight",
  label: "单箱毛重(KG)",
  minWidth: 120,
  align: "right",
  request: true,
  customRow: true,
  fieldItem: {
    placeholder: "单箱毛重",
    type: "inputNumber",
    decimal: 2,
    max: 99999999.99,
  },
};
const GOOD_COLS_9 = {
  prop: "storageType",
  label: "入库用途",
  minWidth: 100,
  customRow: true,
  fieldItem: {
    type: "select",
    basicType: "storageType",
  },
};
const GOOD_COLS_10 = {
  prop: "consigneeWarehouseId",
  label: "目的地",
  minWidth: 120,
  request: true,
  customRow: true,
  // fixed: "right",
  fieldItem: {
    id: "consigneeWarehouseId",
    size: "mini",
    selectLabelKey: "consigneeWarehouseCode",
    ...httpWarehousePublicSelect({
      // itemId: 'id'
    }),
  },
  render: (row) => row.consigneeWarehouseCode || "--",
};
const PRODUCT_COLS_1 = {
  span: 7,
  id: "sku",
  label: "产品",
  labelWidth: "58px",
  placeholder: "产品",
  size: "mini",
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

const goodTableColumns = ({ onlyDirect, onlyDelivery }) => [
  TABLE_COLS_INDEX,
  ...(onlyDelivery ? [] : [GOOD_COLS_EXPAND]),
  GOOD_COLS_1,
  GOOD_COLS_2,
  GOOD_COLS_3,
  GOOD_COLS_4,
  GOOD_COLS_5,
  GOOD_COLS_6,
  GOOD_COLS_7,
  GOOD_COLS_8,
  ...(onlyDirect ? [] : [GOOD_COLS_9, GOOD_COLS_10]),
  {
    ...TABLE_COLS_OPERATION,
    fixed: undefined,
  },
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

// 查验信息
const INSPECTION_COLS_1 = (operationId) => ({
  prop: "examine",
  label: "查验单号",
  minWidth: 140,
  fixed: "left",
  request: true,
  customRow: true,
  fieldItem: {
    size: "mini",
    selectLabelKey: "examineNo",
    ...httpClearanceSend({ operationId }),
    isBackAll: true,
  },
  render: (row) => row.examineNo || "--",
});
const INSPECTION_COLS_2 = {
  prop: "customerName",
  label: "客户名称",
  minWidth: 120,
  fixed: "left",
};
const INSPECTION_COLS_3 = {
  prop: "shipmentId",
  label: "查验shipmen ID",
  minWidth: 140,
  fixed: "left",
  customRow: true,
  fieldItem: {
    type: "text",
    maxlength: 50,
  },
};
const INSPECTION_COLS_4 = {
  prop: "registerTime",
  label: "查验登记时间",
  minWidth: 200,
  request: true,
  customRow: true,
  fieldItem: {
    type: "datetime",
    valueFormat: "yyyy-MM-dd HH:mm",
  },
};
const INSPECTION_COLS_5 = {
  prop: "endCheckTime",
  label: "查验结束时间",
  minWidth: 200,
  customRow: true,
  fieldItem: {
    type: "datetime",
    valueFormat: "yyyy-MM-dd HH:mm",
  },
};
const INSPECTION_COLS_6 = {
  prop: "remark",
  label: "备注信息",
  minWidth: 160,
  customRow: true,
  fieldItem: {
    type: "text",
    placeholder: "备注",
    maxlength: 2000,
  },
};
const INSPECTION_COLS_7 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
};
const INSPECTION_COLS_8 = {
  prop: "createBy",
  label: "创建人",
  minWidth: 120,
};
const inspectionTableColumns = (operationId) => [
  TABLE_COLS_INDEX,
  ...(operationId ? [INSPECTION_COLS_1(operationId), INSPECTION_COLS_2] : []),
  INSPECTION_COLS_3,
  INSPECTION_COLS_4,
  INSPECTION_COLS_5,
  INSPECTION_COLS_6,
  INSPECTION_COLS_7,
  INSPECTION_COLS_8,
  TABLE_COLS_OPERATION,
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
export {
  productConfig,
  goodTableColumns,
  goodGrossTotal,
  inspectionTableColumns,
  handleRule,
};
