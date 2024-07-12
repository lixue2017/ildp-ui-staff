import {
  httpWarehousePublicSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import { httpUserSelect, httpGetCostBindCustomer } from "@/comModel/httpSelect";
import { logisticsProductList } from "@/api/warehouse/basic";

const SEARCH_COLS_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "codeLike",
  label: "费用编码：",
  placeholder: "费用编码",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "warehouseId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
};
const SEARCH_COLS_4 = {
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
};
const SEARCH_COLS_5 = {
  id: "customerId",
  label: "关联客户：",
  placeholder: "关联客户",
  ...httpGetCostBindCustomer(),
};
const SEARCH_COLS_6 = {
  id: "createUserId",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
};
const SEARCH_COLS_7 = {
  id: "stateIn",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "costPartitionSchemeState",
  // hideList:[2]
  multiple: true,
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "code",
  label: "费用编码",
  minWidth: 120,
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "warehouseName",
  label: "计费仓",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "costPartitionSchemeName",
  label: "分区方案",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "logisticsProductCode",
  label: "物流产品",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "customerCode",
  label: "客户代码",
  minWidth: 140,
  showOverflowTooltip: true,
  render: (row) => {
    const { customerIds, customerCode } = row;
    return customerCode ? `${customerIds.length}个：${customerCode}` : "ALL";
  },
};
const TABLE_COLS_6 = {
  prop: "startTime",
  label: "有效开始时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "endTime",
  label: "有效结束时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "createUserName",
  label: "创建人",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "updateTime",
  label: "最后修改时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "state",
  label: "状态",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "costSpecialChargesPriceState",
  dotColor: true,
  fixed: "right",
};
const TABLE_COLS_12 = {
  prop: "bindAllCustomer",
  label: "通用规则",
  minWidth: 160,
  showOverflowTooltip: true,
  yesOrNo: true,
};
const TABLE_COLS_13 = {
  prop: "enablingTime",
  label: "价格生效时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 150,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};

const searchColumns = [
  SEARCH_COLS_1,
  SEARCH_COLS_2,
  SEARCH_COLS_3,
  SEARCH_COLS_4,
  SEARCH_COLS_5,
  SEARCH_COLS_6,
  SEARCH_COLS_7,
];
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_4,
  TABLE_COLS_12,
  TABLE_COLS_5,
  TABLE_COLS_8,
  TABLE_COLS_13,
  TABLE_COLS_10,
  TABLE_COLS_9,
  TABLE_COLS_11,
  TABLE_COLS_OPERATION,
];

export { searchColumns, tableColumns };



const DIALOG_FORM_1={
  span: 24,
  id: "enablingTime",
  label: "生效时间：",
  placeholder: "请输入",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
}
export const diyCustomDialogCols = (row={}) => {
  const {title}=row
  return {
    title,
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_FORM_1,
    ],
    formRules: {
      enablingTime: [
        { required: true, message: `请选择生效时间`, trigger: "change" },
      ],
    }
  }
}
