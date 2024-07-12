import {
  httpCustomerSelect,
  httpLogisticsCustomerSelect,
  httpAccountSelect,
} from "@/comModel/httpSelect.js";

const FORM_COL_1 = {
  id: "dealDate",
  label: "日期：",
  labelWidth: "60px",
  placeholder: "年/月/日",
  type: "daterange",
  valueFormat: "yyyy/MM/dd",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
    },
  },
};
const FORM_COL_2 = {
  id: "customerObj",
  label: "所属公司：",
  selectLabelKey: "customerName",
  ...httpLogisticsCustomerSelect(),
  // ...httpCustomerSelect({ clientIdentity: 0 })
};
const FORM_COL_3 = {
  span: 6,
  id: "customerName",
  label: "公司名称：",
  placeholder: "--",
  type: "txt",
};
const FORM_COL_4 = {
  span: 6,
  id: "dealDate",
  label: "日期：",
  placeholder: "--",
  type: "txt",
};
const FORM_COL_5 = {
  span: 6,
  id: "slotUserName",
  label: "制单人：",
  placeholder: "--",
  type: "slot",
};
const FORM_COL_6 = {
  span: 6,
  id: "sameDay",
  label: "制表日期：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_7 = {
  id: "accountId",
  label: "银行账号：",
  isBackAll: true,
  ...httpAccountSelect({ type: 0 }),
  multiple: true, // 多选
  type: "slot",
};

const FORM_COLS_1 = [FORM_COL_1, FORM_COL_2, FORM_COLS_7];
const FORM_COLS_2 = [FORM_COL_3, FORM_COL_4, FORM_COL_5, FORM_COL_6];

export const formModelConfig = (idx = 0) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_1, FORM_COLS_2][idx],
            },
          ],
        },
      ],
    },
  ];
};

export const formRules = {
  dealDate: [{ required: true, message: "请选择日期", trigger: "change" }],
  customerObj: [
    { required: true, message: "请选择所属公司", trigger: "change" },
  ],
}; // 表单校验规则

const TABLE_COL_0 = {
  type: "index",
  align: "center",
  width: 50,
};
const TABLE_COL_1 = {
  prop: "openingBank",
  label: "所在银行",
  sortable: true,
  showOverflowTooltip: true,
  align: "left",
};
const TABLE_COL_2 = {
  prop: "bankAccount",
  label: "账号",
  sortable: true,
  showOverflowTooltip: true,
  align: "left",
  columnLink: true,
};
const TABLE_COL_3 = {
  prop: "currencyCode",
  label: "币别",
  sortable: true,
  showOverflowTooltip: true,
  align: "center",
};
const TABLE_COL_4 = {
  prop: "collect",
  label: "收款金额",
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 4,
};
const TABLE_COL_5 = {
  prop: "pay",
  label: "付款金额",
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
  colFormat: "thousandthMark",
  decimal: 4,
};
const TABLE_COL_6 = {
  prop: "subtotal",
  label: "当日小计",
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
  colFormat: "thousandthMark",
  decimal: 2,
};
const TABLE_COL_7 = {
  prop: "surplus",
  label: "账户结余",
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
  colFormat: "thousandthMark",
  decimal: 2,
};
// const TABLE_COL_8 = {
//   prop: "collectBx",
//   label: "佰信核销金额",
//   sortable: true,
//   align: "right",
//   showOverflowTooltip: true,
//   colFormat: "thousandthMark",
//   decimal: 2,
// };


const TABLE_COL_9 = {
  prop: "dealDate",
  label: "交易日期",
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
};

const TABLE_COL_10 = {
  prop: "collectBx",
  label: "佰信收款金额",
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
  decimal: 2,
};

const TABLE_COL_11 = {
  prop: "payBx",
  label: "佰信付款金额",
  sortable: true,
  align: "right",
  showOverflowTooltip: true,
  decimal: 2,
};
export const summaryTableCols = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_9,
  TABLE_COL_3,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
];

// 文字列--左对齐

// 所有数据长度小于等于2且字符长度相同的列--居中对齐，（例如，是与否）

// 数字列--右标题对齐
