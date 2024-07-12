import { httpUserSelect } from "@/comModel/httpSelect";
import {
  COM_FORM_START_PORT,
  COM_FORM_END_PORT,
  COM_FORM_DOMESTIC,
  COM_FORM_FOREIGN,
} from "@/views/enquiryManage/components/comModel";

const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "numberLike",
  label: "询价编码：",
  placeholder: "询价编码",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "inquirerUserIdEq",
  label: "询价人：",
  placeholder: "询价人",
  ...httpUserSelect(),
};
const SEARCH_COLS_4 = {
  id: "stateList",
  label: "状态：",
  placeholder: "状态",
  multiple: true,
  type: "select",
  basicType: "inquirySheetState",
};
const SEARCH_COLS_5 = {
  id: "tradeTypeEq",
  label: "业务性质：",
  placeholder: "业务性质",
  type: "select",
  basicType: "tradeType",
};
const SEARCH_COLS_6 = {
  ...COM_FORM_START_PORT,
  id: "startPortIdEq",
};
const SEARCH_COLS_7 = {
  ...COM_FORM_END_PORT,
  id: "endPortIdEq",
};
const SEARCH_COLS_8 = {
  ...COM_FORM_DOMESTIC,
  id: "domesticQuotedPriceUserIdEq",
};
const SEARCH_COLS_9 = {
  ...COM_FORM_FOREIGN,
  id: "foreignQuotedPriceUserIdEq",
};
const SEARCH_COLS_10 = {
  id: "quotedPriceStateList",
  label: "报价状态：",
  placeholder: "报价状态",
  multiple: true,
  type: "select",
  basicType: "quotationSheetState",
};
const SEARCH_COLS_11 = {
  id: "deliveryAddressLike",
  label: "送货地址：",
  placeholder: "送货地址",
  type: "text",
};

const mySearchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
  SEARCH_COLS_8,
  SEARCH_COLS_9,
];
const bookingSearchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_10,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
  SEARCH_COLS_8,
];
const seaSearchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_10,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
  SEARCH_COLS_9,
  SEARCH_COLS_11,
];

const searchConfig = (searchColumns) => ({
  searchNum: searchColumns.length,
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns,
            },
          ],
        },
      ],
    },
  ], // 表单渲染列表
  formRules: {}, // 表单校验规则
});
const mySearchConfig = searchConfig(mySearchColumns);
const bookingSearchConfig = searchConfig(bookingSearchColumns);
const seaSearchConfig = searchConfig(seaSearchColumns);

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "询价编码",
  prop: "number",
  sortable: true,
  minWidth: 120,
  columnLink: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COLS_2 = {
  label: "起运港",
  prop: "startPortName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  label: "目的港",
  prop: "endPortName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  label: "业务性质",
  prop: "tradeType",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "tradeType",
};
const TABLE_COLS_5 = {
  label: "交货时间",
  prop: "deliveryTime",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  label: "装箱方式",
  prop: "packingMode",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "freightType",
};
const TABLE_COLS_7 = {
  label: "货物信息",
  prop: "table_xx_7",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => {
    const {
      packingMode,
      cabinetName,
      freightQuantity,
      freightTotalVolume,
      freightTotalWeight,
    } = row;
    const qvw = [];
    freightQuantity && qvw.push(freightQuantity);
    freightTotalVolume && qvw.push(freightTotalVolume);
    freightTotalWeight && qvw.push(freightTotalWeight);
    return packingMode == 0
      ? `${cabinetName || ""} ${
          freightQuantity || "--"
        }件 ${freightTotalWeight}KG ${freightTotalVolume}m³`
      : `${
          freightQuantity || "--"
        }件 ${freightTotalWeight}KG ${freightTotalVolume}m³`;
  },
};
const TABLE_COLS_8 = {
  label: "产品信息",
  prop: "productInfo",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  label: "国内报价人",
  prop: "domesticQuotedPriceUserName",
  sortable: true,
  minWidth: 110,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  label: "国内报价",
  prop: "domesticQuotationSheetState",
  sortable: true,
  minWidth: 110,
  fontColor: true,
  colBgColor: true,
  basicType: "quotationSheetState",
};
const TABLE_COLS_11 = {
  label: "国内方案",
  prop: "domesticQuotationSchemeNum",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  label: "海外报价人",
  prop: "foreignQuotedPriceUserName",
  sortable: true,
  minWidth: 110,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  label: "海外报价",
  prop: "foreignQuotationSheetState",
  sortable: true,
  minWidth: 110,
  fontColor: true,
  colBgColor: true,
  basicType: "quotationSheetState",
};
const TABLE_COLS_14 = {
  label: "海外方案",
  prop: "foreignQuotationSchemeNum",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  render: (row) =>
    row.foreignQuotedPriceUserName ? row.foreignQuotationSchemeNum : "--",
};
const TABLE_COLS_15 = {
  label: "创建时间",
  prop: "createTime",
  sortable: true,
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  label: "询价人",
  prop: "createUserName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  label: "状态",
  prop: "state",
  sortable: true,
  minWidth: 80,
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "inquirySheetState",
  fixed: "right",
};
const TABLE_COLS_18 = {
  label: "运输方式",
  prop: "shippingMode",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "shippingMode",
};
const TABLE_COLS_19 = {
  label: "预计到港时间",
  prop: "table_xx_19",
  sortable: true,
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  label: "货物信息",
  prop: "cabinetName",
  sortable: true,
  minWidth: 130,
  showOverflowTooltip: true,
  render: (row) => {
    const {
      packingMode,
      cabinetName,
      freightQuantity,
      freightTotalVolume,
      freightTotalWeight,
    } = row;
    return packingMode === 0
      ? cabinetName
      : `${
          freightQuantity || "--"
        }件 ${freightTotalWeight}KG ${freightTotalVolume}CBM`;
  },
};
const TABLE_COLS_21 = {
  label: "体积(CBM)",
  prop: "freightTotalVolume",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  label: "重量(KG)",
  prop: "freightTotalWeight",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  label: "委托客户",
  prop: "customerName",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_24 = {
  // 国内
  label: "报价编码",
  prop: "domesticQuotationSheetNumber",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_24_1 = {
  // 国外
  label: "报价编码",
  prop: "foreignQuotationSheetNumber",
  sortable: true,
  minWidth: 120,
  showOverflowTooltip: true,
};

const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  sortable: true,
  minWidth: 140,
  columnOperation: true,
  fixed: "right",
};

//我的海运询价
export const mySeaTableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_23,
  TABLE_COLS_20,
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
  TABLE_COLS_OPERATION,
];

//我的空运询价
export const myAirTableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_23,
  TABLE_COLS_20,
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
  TABLE_COLS_OPERATION,
];
// // tab 1:我的海运询价 2:我的空运询价
// const myTableColumns = (tab) => [
//   TABLE_COLS_INDEX,
//   TABLE_COLS_1,
//   TABLE_COLS_2,
//   TABLE_COLS_3,
//   TABLE_COLS_4,
//   TABLE_COLS_5,
//   ...(tab === "1" ? [TABLE_COLS_6] : []),
//   // TABLE_COLS_7,
//   TABLE_COLS_23,
//   TABLE_COLS_20,
//   // TABLE_COLS_21,
//   // TABLE_COLS_22,
//   TABLE_COLS_8,
//   TABLE_COLS_9,
//   TABLE_COLS_10,
//   TABLE_COLS_11,
//   TABLE_COLS_12,
//   TABLE_COLS_13,
//   TABLE_COLS_14,
//   TABLE_COLS_15,
//   TABLE_COLS_16,
//   TABLE_COLS_17,
//   TABLE_COLS_OPERATION,
// ];

// tab 1:海运订舱询价 2:空运订舱询价
const bookingTableColumns = (tab) => [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_24,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  ...(tab === "1" ? [TABLE_COLS_6] : []),
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_15,
  TABLE_COLS_11,
  { ...TABLE_COLS_16, label: "询价人" },
  TABLE_COLS_10,
  TABLE_COLS_9,
  { ...TABLE_COLS_OPERATION, minWidth: 100 },
];

// tab 海外到门报价
const seaTableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_24_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_18,
  TABLE_COLS_4,
  // TABLE_COLS_19,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_15,
  TABLE_COLS_14,
  { ...TABLE_COLS_16, label: "询价人" },
  TABLE_COLS_13,
  TABLE_COLS_12,
  { ...TABLE_COLS_OPERATION, minWidth: 100 },
];

export {
  mySearchConfig,
  bookingSearchConfig,
  seaSearchConfig,
  // myTableColumns,
  bookingTableColumns,
  seaTableColumns,
};
