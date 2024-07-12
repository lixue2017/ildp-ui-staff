import {
  httpRoleDeptUserSelect,
  httpGetCashierList,
} from "@/comModel/httpSelect";
const SEARCH_COL_1 = {
  span: 8,
  id: "cashierBy",
  label: "指定付款人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};
const SEARCH_COL_2 = {
  span: 8,
  id: "bankReceiptCheckBy",
  label: "水单上传人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};
const SEARCH_COL_3 = {
  span: 8,
  id: "verificationBy",
  label: "财务核销人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CW"] }),
};
const SEARCH_COL_4 = {
  span: 8,
  id: "latestPaymentDate",
  label: "最迟付款日：",
  placeholder: "请选择",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_5 = {
  span: 16,
  id: "remark",
  label: "分配备注：",
  placeholder: "请输入",
  type: "textarea",
  rows: 1,
};
const SEARCH_COL_6 = {
  span: 24,
  id: "ids",
  label: "选择报销单：",
  placeholder: "请选择报销单",
  isAutoInitRequest: true,
  multiple: true,
  isBackAll: true,
  defaultKey: "id",
  ...httpGetCashierList(),
  type: "slot",
};
const SEARCH_COL_7 = {
  span: 24,
  id: "cwIds",
  label: "选择财务单：",
  placeholder: "请选择财务单",
  isAutoInitRequest: true,
  multiple: true,
  isBackAll: true,
  defaultKey: "id",
  ...httpGetCashierList(),
  type: "slot",
};
const SEARCH_COL_8 = {
  span: 8,
  id: "isBxVerification",
  text: "佰信核销",
  type: "singleCheckbox",
};
const SEARCH_COL_9 = {
  span: 8,
  id: "bxType",
  label: "佰信类型：",
  placeholder: "类型",
  type: "select",
  basicType: "billType",
  clearable: false,
};
const SEARCH_COL_10 = {
  span: 8,
  id: "bxMoney",
  label: "佰信金额：",
  placeholder: "佰信金额",
  type: "inputNumber",
  numDecimal: 2,
  maxNumber: 99999999.99,
};
const SEARCH_COL_TABLE = {
  span: 24,
  id: "table",
  labelWidth: "0",
  type: "slot",
  className: "table-class",
};
export const outMergeFormConfig = ({
  drawerType = 1,
  isBxVerification = false,
  isCollection = false,
}) => {
  console.log("===========", isCollection);
  //外部付款-合并分配
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...SEARCH_COL_1,
                    label: isCollection ? "指定收款人：" : "指定付款人：",
                  },
                  ...(isCollection ? [] : [SEARCH_COL_2]),
                  SEARCH_COL_3,
                  ...(isCollection ? [] : [SEARCH_COL_4]),
                  { ...SEARCH_COL_5, span: isCollection ? 24 : 16 },
                  SEARCH_COL_6,
                  ...(drawerType === 2 ? [SEARCH_COL_7, SEARCH_COL_8] : []),
                  ...(isBxVerification ? [SEARCH_COL_9, SEARCH_COL_10] : []),
                  SEARCH_COL_TABLE,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      cashierBy: [
        { required: true, message: "请选择指定付款人", trigger: "change" },
      ],
      bankReceiptCheckBy: [
        { required: true, message: "请选择水单上传人", trigger: "change" },
      ],
      verificationBy: [
        { required: true, message: "请选择财务核销人", trigger: "change" },
      ],
      latestPaymentDate: [
        { required: true, message: "请选择最迟付款日", trigger: "change" },
      ],
      bxType: [
        { required: true, message: "请选择佰信类型", trigger: "change" },
      ],
      bxMoney: [
        { required: true, message: "请输入佰信金额", trigger: "change" },
      ],
    },
  };
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  minWidth: 80,
  showOverflowTooltip: true,
  fontColor: true,
  basicType: "billType",
};
const TABLE_COLS_2 = {
  prop: "statementsCode",
  label: "报销单号",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "money",
  label: "待收/付金额",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 80,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "businessCompanyName",
  label: "业务单位",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "right",
};

export const outMergeTableConfig = [
  TABLE_COL_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  // TABLE_COLS_4,
  TABLE_COLS_5,
  // TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_OPERATION,
];
