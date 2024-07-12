import { formatMoney } from "@/utils/index";
import { accumulationFn } from "@/utils/instructions";

const FORM_COLS_1 = {
  //BS账号信息
  span: 12,
  id: "bsAccountInfo",
  labelWidth: "0px",
  type: "slot",
};

const FORM_COLS_2 = {
  //对方账号信息
  span: 12,
  id: "counterpartInfo",
  labelWidth: "0px",
  type: "slot",
};

const FORM_COLS_3 = {
  span: 12,
  id: "serialCode",
  label: "流水号：",
  placeholder: "--",
  type: "txt",
  txtTagArr: [
    {
      tagColor: "green",
      basicType: "billType",
      basicTypeVal: "payType",
    },
  ],
};

const FORM_COLS_4 = {
  span: 12,
  id: "originalMoney",
  label: "水单总金额：",
  type: "txt",
  render: (row) => {
    return `${row.originalMoney ? formatMoney(row.originalMoney) : 0} ${
      row?.bankReceiptCurrencyCode || "--"
    } `;
  },
};

const FORM_COLS_5 = {
  span: 12,
  id: "dealDate",
  label: "交易时间：",
  placeholder: "--",
  type: "txt",
};

const FORM_COLS_6 = {
  span: 12,
  id: "UNCHARTED_FORM_6",
  label: "创建信息：",
  placeholder: "--",
  type: "txt",
};

const FORM_COLS_7 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  placeholder: "--",
  type: "txt",
};

const FORM_COLS_8 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};

const FORM_COLS_9 = {
  span: 24,
  id: "slotImgList",
  label: "水单资料：",
  type: "slot",
};

// const FORM_COL_TXT_11 = {
//   span: 6,
//   id: "payType",
//   label: "收付款类型：",
//   placeholder: "--",
//   type: "txt", // 收付款类型(0:应收/1:应付)
//   render: (row) => ["应付", "应收"][row.payType] || "--",
// };
// const CONFIRM_FORM_COL_3 = {
//   span: 8,
//   id: "checkByName",
//   label: "水单认领人：",
//   placeholder: "--",
//   type: "txt",
// };

// const FORM_COL_TXT_14 = {
//   span: 6,
//   id: "verificationMoney",
//   label: "已认领水单：",
//   type: "txt",
//   render: (row) => {
//     return `${row?.bankReceiptCurrencyCode || "--"} ${
//       row.verificationMoney ? formatMoney(row.verificationMoney) : 0
//     }`;
//   },
// };
// const FORM_COL_TXT_15 = {
//   span: 6,
//   id: "money",
//   label: "本次领金额：",
//   type: "txt",
//   render: (row) => {
//     return `${row?.bankReceiptCurrencyCode || "--"} ${
//       row.money ? formatMoney(row.money) : 0
//     }`;
//   },
// };
// const FORM_COL_TXT_16 = {
//   span: 6,
//   id: "surplusMoney",
//   label: "未认领金额：",
//   type: "txt",
//   render: (row) => {
//     return `${row?.bankReceiptCurrencyCode || "--"} ${
//       row.surplusMoney ? formatMoney(row.surplusMoney) : 0
//     }`;
//   },
// };
// const CONFIRM_FORM_COL_17 = {
//   span: 6,
//   id: "checkTime",
//   label: "登记时间：",
//   placeholder: "--",
//   type: "txt",
// };
// const CONFIRM_FORM_18 = {
//   span: 6,
//   id: "openingBank",
//   label: "对方开户行：",
//   placeholder: "--",
//   type: "txt",
// };
// const FORM_COL_TXT_NBSP = {
//   span: 6,
//   id: "UNCHARTED_FORM_NBSP",
//   type: "slot",
// };

export const config = {
  viewLists: [
    //水单查看详情
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1, //BS账号信息
                FORM_COLS_2, //对方账号信息
                FORM_COLS_3, //流水号
                FORM_COLS_4, //水单总金额
                FORM_COLS_5, //交易时间
                FORM_COLS_6, //创建信息
                FORM_COLS_7, //备注说明
                FORM_COLS_8, //TABLE
                FORM_COLS_9, //图片
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    // createTaskBy:[
    //   { required: true, message: "请选择销毁对账信息", trigger: "blur" },
    // ]
  },
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_1 = {
  prop: "billNo",
  label: "财务单号",
  width: 120,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  label: "相关单位",
  width: 100,
  prop: "dealingsCompanyName",
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  label: "币别",
  prop: "currencyCode",
  width: 50,
  align: "center",
  showOverflowTooltip: true,
};
const TABLE_COL_8 = {
  label: "账单金额",
  minWidth: 80,
  prop: "totalMoney",
  showOverflowTooltip: true,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 2,
};
const TABLE_COL_9 = {
  labelTop: "已核销金额",
  labelBottom: "(包含核销中)",
  headerTopBottom: true,
  width: 100,
  prop: "writeOffMoney",
  showOverflowTooltip: true,
  align: "right",
  // colFormat: "thousandthMark",
  // decimal: 2,
  render: (r) =>
    formatMoney(accumulationFn([r.writeOffMoney, r.underwayMoney])),
};
const TABLE_COL_10 = {
  labelTop: "本次核销",
  labelBottom: "(原币种)",
  headerTopBottom: true,
  prop: "verificationMoney",
  width: 130,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  labelTop: "本次核销",
  labelBottom: "(水单币种)",
  headerTopBottom: true,
  prop: "bankReceiptVerificationMoney",
  width: 136,
  align: "right",
  fixed: "right",
  colFormat: "thousandthMark",
  decimal: 4,
  className: "font-bold",
  // customRow: true,
  // showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  label: "工作单号",
  minWidth: 100,
  prop: "orderNo",
  showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  label: "业务员",
  prop: "salesmanName",
  showOverflowTooltip: true,
  align: "left",
};
const TABLE_COL_14 = {
  label: "全部开票",
  prop: "invoiceStatus",
  showOverflowTooltip: true,
  align: "center",
  fontColor: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_15 = {
  label: "已开票金额",
  prop: "invoiceMoney",
  minWidth: 120,
  showOverflowTooltip: true,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 2,
};
const TABLE_COL_16 = {
  label: "开票中金额",
  prop: "underwayInvoiceMoney",
  showOverflowTooltip: true,
  minWidth: 120,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 2,
};
const TABLE_COL_17 = {
  label: "业务类型",
  prop: "businessType",
  showOverflowTooltip: true,
  minWidth: 100,
  align: "center",
  basicType: "settlementBusinessType",
};

export const tableConfig = [
  TABLE_COL_INDEX,
  TABLE_COL_1, //财务单号
  TABLE_COL_2, //相关单位
  TABLE_COL_12, //业务单位
  TABLE_COL_17,
  TABLE_COL_13, //业务员
  TABLE_COL_7, //币别
  TABLE_COL_8, //账单金额
  TABLE_COL_14, //全部开票
  TABLE_COL_15, //已开票金额
  TABLE_COL_16, //开票中金额
  TABLE_COL_9, //已核销金额
  TABLE_COL_10,
  TABLE_COL_11,
];
