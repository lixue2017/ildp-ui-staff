import { httpLogisticsChannelListSelect } from "@/comModel/warehouse";
import { logisticsProductList } from "@/api/warehouse/basic";
import {
  httpUserSelect,
  httpCustomerSelect,
  httpProductSkuSelect,
} from "@/comModel/httpSelect";
const SEARCH_COL_1 = {
  id: "orderNumber",
  label: "工作单号：",
  placeholder: "请输入工作单号（空格隔开查询多个）",
  type: "text",
  maxlength: 1850,
  residueCol: 2,
};
const SEARCH_COL_2 = {
  id: "orderType",
  label: "订单类型：",
  type: "select",
  placeholder: "请选择订单类型",
  basicType: "labelingBusinessType",
};
const SEARCH_COL_3 = {
  id: "pickingType",
  label: "拣货类型：",
  type: "select",
  placeholder: "请选择拣货类型",
  basicType: "pickingType",
};
const SEARCH_COL_4 = {
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "请选择物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power: true,
  }),
  focusLoad: true,
  type: "slot",
};
const SEARCH_COL_5 = {
  id: "outStorageStatus",
  label: "订单状态：",
  placeholder: "请选择订单状态(多选)",
  type: "select",
  multiple: true,
  basicType: "outStorageStatus",
  hideList: [0, 4, 7, 9, 11],
  // maxlength: 1850,
  // residueCol: 2,
};
const SEARCH_COL_6 = {
  id: "pickingNumber",
  label: "拣货单号：",
  type: "text",
  placeholder: "请输入拣货单号",
};
const SEARCH_COL_7 = {
  id: "pickingStatus",
  label: "拣货状态：",
  type: "select",
  placeholder: "请选择拣货状态(多选)",
  basicType: "pickingStatus",
  multiple: true,
  // hideList:[1,2,3,4]
};
const SEARCH_COL_8 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_9 = {
  id: "createUserId",
  label: "创建人：",
  focusLoad: true,
  placeholder: "请选择创建人",
  ...httpUserSelect(),
};
const SEARCH_COL_10 = {
  id: "customerId",
  label: "客户信息：",
  focusLoad: true,
  placeholder: "请选择客户信息",
  ...httpCustomerSelect(),
  type: "slot",
};
const SEARCH_COL_11 = {
  id: "productId",
  label: "sku：",
  focusLoad: true,
  placeholder: "请选择sku",
  ...httpProductSkuSelect(),
  type: "slot",
};
const SEARCH_COL_12 = {
  id: "outType",
  label: "订单拣货数量：",
  type: "select",
  placeholder: "请选择",
  basicType: "pickingType",
};
export const searchForm = (row = {}) => {
  const { countType } = row;
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_1, //工作单号
                  SEARCH_COL_2, //订单类型
                  SEARCH_COL_4, //物流产品
                  SEARCH_COL_5, //订单状态
                  SEARCH_COL_6, //拣货单号
                  SEARCH_COL_7, //拣货单状态
                  SEARCH_COL_8, //创建时间
                  ...(countType == 520 ? [] : [SEARCH_COL_9]), //创建人
                  ...(countType == 520 ? [SEARCH_COL_10] : []), //客户信息
                  ...(countType == 520 ? [SEARCH_COL_11] : []), //SKU
                  // SEARCH_COL_3, //拣货单类型
                  SEARCH_COL_12,
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};

const TABLE_COLS_SELECT = {
  type: "selection",
  width: 50,
  align: "center",
};
const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "orderNumber",
  label: "工作单号",
  fixed: "left",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "customerName",
  label: "客户名称",
  fixed: "left",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "orderType",
  label: "业务类型",
  fixed: "left",
  showOverflowTooltip: true,
  basicType: "labelingBusinessType",
};
const TABLE_COL_4 = {
  prop: "pickingNumber",
  label: "拣货单号",
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "pickingStatus",
  label: "拣货单状态",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "pickingStatus",
};
const TABLE_COL_6 = {
  prop: "boxNumber",
  label: "箱号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "sku",
  label: "产品SKU",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  prop: "productTypeNum",
  label: "产品类数",
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "outStorageNum",
  label: "数量",
  showOverflowTooltip: true,
};

const TABLE_COL_10 = {
  prop: "traceNumber",
  label: "跟踪号",
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "logisticsProductName",
  label: "物流产品",
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "outType",
  label: "订单拣货数量", // "拣货单类型"
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "pickingType",
};
const TABLE_COL_13 = {
  prop: "destinationWarehouse",
  label: "目的仓",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "receivingAddress",
  label: "收货地址",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_15 = {
  prop: "createOrderTime",
  label: "下单时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "salesmanName",
  label: "业务员",
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  prop: "belongCusotmerName",
  label: "所属公司",
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
};

export const tableColumns = (row = {}) => {
  const { active } = row;
  return [
    TABLE_COLS_SELECT,
    // ...(active == 520 ? [TABLE_COLS_SELECT] : []),
    TABLE_COL_INDEX,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_7,
    TABLE_COL_8,
    TABLE_COL_9,
    TABLE_COL_10,
    TABLE_COL_11,
    TABLE_COL_12,
    TABLE_COL_13,
    TABLE_COL_14,
    TABLE_COL_15,
    TABLE_COL_16,
    TABLE_COL_17,
  ];
};
