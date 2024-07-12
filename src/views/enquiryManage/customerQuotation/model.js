import {
  httpUserSelect,
  httpPortPublicSelect,
  httpPendingRelated,
  httpAllDealingCompanySelect,
} from "@/comModel/httpSelect";
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "报价时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "quotationUserIdEq",
  label: "报价人：",
  placeholder: "报价人",
  ...httpUserSelect(),
};
const SEARCH_COLS_3 = {
  id: "customerIdEq",
  label: "客户：",
  placeholder: "客户",
  ...httpAllDealingCompanySelect(),
};
const SEARCH_COLS_4 = {
  id: "shippingModeEq",
  label: "运输方式：",
  placeholder: "运输方式",
  type: "select",
  basicType: "shippingMode",
};
const SEARCH_COLS_5 = {
  id: "tradeTypeEq",
  label: "业务性质：",
  placeholder: "业务性质",
  type: "select",
  basicType: "tradeType",
};
const SEARCH_COLS_6 = {
  id: "startPortIdEq",
  label: "起运港：",
  placeholder: "起运港",
  ...httpPortPublicSelect(),
  selectLabelKey: "startPortName",
};
const SEARCH_COLS_7 = {
  id: "endPortIdEq",
  label: "目的港：",
  placeholder: "目的港",
  ...httpPortPublicSelect(),
  selectLabelKey: "endPortName",
};
const SEARCH_COLS_8 = {
  id: "form_xx_8",
  label: "海外报价人：",
  placeholder: "海外报价人",
  ...httpUserSelect(),
};
const SEARCH_COLS_9 = {
  id: "quotedPriceStateEq",
  label: "报价状态：",
  placeholder: "报价状态",
  type: "select",
  basicType: "quotationSheetState",
  hideList: [0, 1, 2, 3, 4],
};
const SEARCH_COLS_10 = {
  id: "packingModeEq",
  label: "装箱方式：",
  placeholder: "装箱方式",
  type: "select",
  basicType: "freightType",
};
const SEARCH_COLS_11 = {
  id: "numberLike",
  label: "报价编码：",
  placeholder: "报价编码",
  type: "text",
};
const SEARCH_COLS_12 = {
  id: "freightVoyageCodeLike",
  label: "运价/航次编码：",
  placeholder: "运价/航次编码",
  type: "text",
};
const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  // SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
  // SEARCH_COLS_8,
  SEARCH_COLS_9,
  SEARCH_COLS_10,
  SEARCH_COLS_11,
  SEARCH_COLS_12,
];

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "报价编码",
  prop: "number",
  minWidth: 120,
  columnLink: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COLS_2 = {
  label: "客户",
  prop: "customerName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  label: "报价人",
  prop: "quotedPriceUserName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  label: "报价时间",
  prop: "createTime",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  label: "运价/航次编码",
  prop: "freightVoyageCode",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  label: "起运港/目的港",
  prop: "startPortCode",
  sortable: true,
  minWidth: 140,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COLS_7 = {
  label: "航线代码",
  prop: "routeCode",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  label: "装箱方式",
  prop: "packingMode",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "freightType",
};
const TABLE_COLS_9 = {
  label: "运输方式",
  prop: "shippingMode",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "shippingMode",
};
const TABLE_COLS_10 = {
  label: "船司",
  prop: "shipCompanyName",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  label: "价格",
  prop: "priceMap",
  sortable: true,
  minWidth: 260,
  customRow: true,
};
const TABLE_COLS_12 = {
  label: "报价状态",
  prop: "state",
  minWidth: 100,
  showOverflowTooltip: true,
  dotColor: true,
  fixed: "right",
  basicType: "quotationSheetState",
};
const TABLE_COLS_13 = {
  label: "报价段",
  prop: "inquirySheetType",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "inquirySheetType",
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  minWidth: 200,
  columnOperation: true,
  fixed: "right",
};

const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_13,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_OPERATION,
];
export { searchColumns, tableColumns };

const FORM_COLS_1 = (obj) => ({
  span: 24,
  id: "relatedOrder",
  label: "关联订单：",
  placeholder: "请选择订单",
  ...httpPendingRelated(obj),
  searchParamName: "operationOrderNum",
  isBackAll: true,
});
export const relatedOrdersConfig = (obj) => ({
  title: "关联订单",
  width: "450px",
  labelWidth: "90px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_1(obj)],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    relatedOrder: [
      { required: true, message: "请选择关联订单", trigger: "blur" },
    ],
  },
});
