import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { httpUserSelect, httpCurrencySelect } from "@/comModel/httpSelect";

const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COLS_2 = {
  id: "code",
  label: "规则编码：",
  placeholder: "价格编码",
  type: "text",
};
const SEARCH_COLS_3 = {
  id: "wmsId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
};
const SEARCH_COLS_4 = {
  id: "priceCurrencyId",
  label: "币别：",
  placeholder: "币别",
  ...httpCurrencySelect,
};
const SEARCH_COLS_5 = {
  id: "stateList",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "costSaleOptPriceState",
  // hideList:[2,4],
  multiple: true,
};
const SEARCH_COLS_6 = {
  id: "createUserId",
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect(),
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "code",
  label: "规则编码",
  minWidth: 120,
  fixed: "left",
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "wmsCode",
  label: "计费仓",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "priceCurrencyCode",
  label: "币别",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "cusCode",
  label: "客户代码",
  minWidth: 140,
  showOverflowTooltip: true,
  render: (row) => {
    const { cusBindNum, cusCode } = row;
    return cusBindNum ? `${cusBindNum}个：${cusCode}` : "ALL";
  },
};
const TABLE_COLS_5 = {
  prop: "remark",
  label: "备注",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "createUserName",
  label: "创建人",
  minWidth: 140,
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
  basicType: "costSaleOptPriceState",
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
];
const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_12,
  TABLE_COLS_3,
  TABLE_COLS_4,
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
