import { httpUserSelect, httpGetCostBindCustomer } from "@/comModel/httpSelect";
import { httpCurrentWarehouseSelect,httpLogisticsChannelListSelect } from "@/comModel/warehouse";
import { logisticsProductList } from "@/api/warehouse/basic";
const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
};

const SEARCH_COL_2 = {
  id: "levelCode",
  label: "等级编号：",
  type: "text",
  placeholder: "请输入等级编号",
};

const SEARCH_COL_3 = {
  id: "customerId",
  label: "关联客户：",
  placeholder: "请选择关联客户",
  ...httpGetCostBindCustomer(),
};

const SEARCH_COL_4 = {
  id: "warehouseId",
  label: "关联仓库：",
  placeholder: "请输入关联仓库",
  ...httpCurrentWarehouseSelect(),
};

const SEARCH_COL_5 = {
  id: "priceLevel",
  label: "价格等级：",
  type: "select",
  placeholder: "请选择价格等级",
  basicType: "priceGrade",
};

const SEARCH_COL_6 = {
  id: "miscellaneousLevel",
  label: "杂费等级：",
  type: "select",
  placeholder: "请选择杂费等级",
  basicType: "extrasGrade",
};

const SEARCH_COL_7 = {
  id: "createUserId",
  label: "创建人：",
  placeholder: "请选择创建人",
  ...httpUserSelect(),
};

const SEARCH_COL_8 = {
  id: "stateIn",
  label: "状态：",
  type: "select",
  placeholder: "请选择状态",
  basicType: "customerLvStatus",
  multiple: true,
};
const SEARCH_COL_9 = {
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "请选择",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
};
export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,//创建时间
              SEARCH_COL_4,//关联仓库
              SEARCH_COL_9,//物流产品
              SEARCH_COL_3,//关联客户
              SEARCH_COL_2,//等级编号
              SEARCH_COL_5,//价格登记
              SEARCH_COL_7,//创建人
              SEARCH_COL_8,//状态
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "levelCode",
  label: "等级编号",
  showOverflowTooltip: true,
  cPageNoKey: "/oneConsignmentPlan/customerLevelLimit/lvManageDetail", //路由匹配字段
  cOrderIdKey: "id", //跳转详情查询字段ID
  columnLink: true,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "customerName",
  label: "企业名称",
  minWidth:140,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "shortName",
  label: "企业简称",
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "customerCode",
  label: "企业代码",
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "warehouseCode",
  label: "计费仓",
  minWidth:120,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "productCode",
  label: "物流产品",
  showOverflowTooltip: true,
  minWidth:120,
};
const TABLE_COL_7 = {
  prop: "priceLevel",
  label: "价格等级",
  showOverflowTooltip: true,
  basicType: "priceGrade",
};
const TABLE_COL_8 = {
  prop: "miscellaneousLevel",
  label: "杂费等级",
  showOverflowTooltip: true,
  basicType: "extrasGrade",
};
const TABLE_COL_9 = {
  prop: "effectiveStartTime",
  label: "有效开始时间",
  showOverflowTooltip: true,
};

const TABLE_COL_10 = {
  prop: "effectiveEndTime",
  label: "有效结束时间",
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "createBy",
  label: "创建人",
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "lastOperationTime",
  label: "最后操作时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  prop: "state",
  label: "状态",
  dotColor: true,
  showOverflowTooltip: true,
  fixed: "right",
  basicType: "customerLvStatus",
};
const TABLE_COL_14 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  minWidth: 100,
  fixed: "right",
};
export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  // TABLE_COL_9,
  // TABLE_COL_10,
  TABLE_COL_14,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_OPERATION,
];
