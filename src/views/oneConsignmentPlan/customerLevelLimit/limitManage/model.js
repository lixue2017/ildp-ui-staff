import {
  httpGetCostBindCustomer,
  httpPOSTCusList,
} from "@/comModel/httpSelect";
const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_2 = {
  id: "customerId",
  label: "关联客户：",
  placeholder: "请选择关联客户",
  ...httpGetCostBindCustomer(),
};
const SEARCH_COL_3 = {
  startId: "minMoney",
  endId: "maxMoney",
  label: "申请额度：",
  startPlaceholder: "申请额度≤",
  endPlaceholder: "≤申请额度",
  type: "rangeSelect",
};
const SEARCH_COL_4 = {
  id: "stateList",
  label: "状态：",
  type: "select",
  placeholder: "请选择状态",
  basicType: "limitManageStatus",
  multiple: true,
};
export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [SEARCH_COL_1, SEARCH_COL_2, SEARCH_COL_3, SEARCH_COL_4],
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
  prop: "customerName",
  label: "企业名称",
  showOverflowTooltip: true,
  minWidth:120,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "shortName",
  label: "企业简称",
  minWidth:120,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COL_3 = {
  prop: "customerCode",
  label: "企业代码",
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "beforeOptAmount",
  label: "当前额度",
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "applicationAmount",
  label: "申请额度",
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "applicationCurrencyType",
  label: "申请币别",
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "remark",
  label: "申请备注",
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COL_8 = {
  prop: "createBy",
  label: "申请人",
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "reviewedUser",
  label: "审核人",
  showOverflowTooltip: true,
};

const TABLE_COL_10 = {
  prop: "updateTime",
  label: "审核时间",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "auditRecords",
  label: "审核记录",
  minWidth: 80,
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_12 = {
  prop: "state",
  label: "状态",
  showOverflowTooltip: true,
  dotColor: true,
  fixed: "right",
  basicType: "limitManageStatus",
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  minWidth: "120px",
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
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_OPERATION,
];

const DIALOG_ADD_COL_1 = {
  span: 24,
  id: "UNCHARTED_DIALOG_1",
  label: "客户CODE：",
  type: "txt",
  placeholder: "--",
};
const DIALOG_ADD_COL_2 = {
  span: 24,
  id: "UNCHARTED_DIALOG_2",
  label: "客户名称：",
  type: "txt",
  placeholder: "--",
};
const DIALOG_ADD_COL_3 = {
  span: 24,
  id: "creditLimit",
  label: "当前额度：",
  type: "txt",
  placeholder: "--",
  fontTxtColor: "#63A103",
  decimal: 3,
  render: (item) => {
    const { creditLimit } = item;
    return creditLimit || 0;
  },
};

const DIALOG_ADD_COL_4 = {
  span: 24,
  id: "applicationAmount",
  label: "申请额度：",
  decimal: 2,
  max: 9999999999.99,
  type: "slot",
};
const DIALOG_ADD_COL_5 = {
  span: 24,
  id: "remark",
  labelWidth: "0",
  type: "slot",
};
const DIALOG_ADD_COL_6 = {
  span: 24,
  id: "customerId",
  label: "客户名称：",
  ...httpPOSTCusList(),
  type: "slot",
};

export const customDialogCols = () => {
  return {
    title: "申请额度",
    width: "500px",
    simpleCustomCols: [
      DIALOG_ADD_COL_6,
      DIALOG_ADD_COL_3,
      DIALOG_ADD_COL_4,
      DIALOG_ADD_COL_5,
    ],
    formRules: {
      customerId: [
        { required: true, message: `请选择客户名称`, trigger: "change" },
      ],
      applicationAmount: [
        { required: true, message: `请输入申请额度`, trigger: "change" },
      ],
    },
  };
};
