import { httpSttleBillSelect } from "@/comModel/httpSelect";
import { formatMoney } from "@/utils/index";
import { accumulationFn } from "@/utils/instructions";

const CONFIRM_FORM_COL_1 = {
  span: 8,
  id: "serialCode",
  label: "流水号：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_2 = {
  span: 8,
  id: "dealDate",
  label: "交易时间：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_3 = {
  span: 8,
  id: "checkByName",
  label: "水单认领人：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_4 = {
  //BS账号信息
  span: 12,
  id: "bsAccountInfo",
  labelWidth: "0px",
  type: "slot",
};
const CONFIRM_FORM_COL_5 = {
  //对方账号信息
  span: 12,
  id: "counterpartInfo",
  labelWidth: "0px",
  type: "slot",
};
const CONFIRM_FORM_COL_6 = {
  span: 15,
  id: "createTaskBy",
  label: "对账单信息：",
  isBackAll: true,
  multiple: true,
  isAutoInitRequest: true,
  placeholder: "请选择对账单信息",
};
const CONFIRM_FORM_COL_7 = {
  span: 5,
  id: "money",
  label: "水单金额：",
  type: "txt",
  fontTxtColor: "#63a103",
  render: (row) => `${formatMoney(row.money)} ${row.bankReceiptCurrencyCode}`,
};
const CONFIRM_FORM_COL_8 = {
  span: 5,
  id: "moneyRemain",
  label: "剩余：",
  labelWidth: "50px",
  type: "txt",
  fontTxtColor: "#ff0000",
  render: (row) =>
    `${formatMoney(row.moneyRemain || 0)} ${row.bankReceiptCurrencyCode}`,
  // render: row => `${row.moneyRemain || row.moneyRemain === 0 ? row.moneyRemain : row.money || '0'} ${row.bankReceiptCurrencyCode}`
};
const CONFIRM_FORM_COL_9 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};
const CONFIRM_FORM_COL_10 = {
  span: 6,
  id: "serviceCharge",
  label: "手续费：",
  type: "inputNumber",
  numDecimal: 4,
  min: -Infinity,
  unitKey: "bankReceiptCurrencyCode",
};
const CONFIRM_FORM_COL_11 = {
  span: 6,
  id: "exchangeLoss",
  label: "汇兑损益：",
  type: "inputNumber",
  numDecimal: 4,
  min: -Infinity,
  unitKey: "bankReceiptCurrencyCode",
};
const CONFIRM_FORM_COL_12 = {
  //水单金额全部认领
  span: 9,
  id: "isClaimAll",
  labelWidth: "0px",
  text: "水单金额全部认领",
  type: "singleCheckbox",
};
const CONFIRM_FORM_COL_13 = {
  span: 24,
  id: "remark",
  labelWidth: "0px",
  // label: "业务备注：",
  type: "textarea",
};
const CONFIRM_FORM_COL_14 = {
  span: 1,
  id: "slotQuestion",
  labelWidth: "0",
  type: "slot",
};

const CONFIRM_FORM_COL_15 = {
  span: 24,
  labelWidth: "57px",
  label: "业务备注",
  type: "txt",
  className: "custom-remark",
};

const CONFIRM_FORM_COL_16 = {
  span: 24,
  id: "dialogAdd",
  labelWidth: "0px",
  type: "slot",
};
const CONFIRM_FORM_COL_17 = {
  span: 8,
  id: "invoiceNo",
  label: "发票流水号：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_18 = {
  span: 8,
  id: "invoiceMoney",
  label: "发票金额：",
  placeholder: "--",
  type: "txt",
  render: (row) =>
    `${row.invoiceMoney || "--"} ${row.invoiceCurrencyCode || ""}`,
};
const CONFIRM_FORM_COL_19 = {
  span: 8,
  id: "drawerName",
  label: "开票人：",
  placeholder: "--",
  type: "txt",
};
const CONFIRM_FORM_COL_20 = {
  span: 24,
  id: "uploadFile",
  labelWidth: "0px",
  type: "slot",
};

export const claimFormLists = (obj = {}) => {
  // const { handle, httpObj = {}, isCreateTask = true } = obj;
  let CLAIM_COLS = [
    CONFIRM_FORM_COL_1,
    CONFIRM_FORM_COL_2,
    CONFIRM_FORM_COL_3,
    CONFIRM_FORM_COL_17,
    CONFIRM_FORM_COL_18,
    CONFIRM_FORM_COL_19,
    CONFIRM_FORM_COL_4,
    CONFIRM_FORM_COL_5,
    CONFIRM_FORM_COL_15,
    CONFIRM_FORM_COL_13,
  ];
  // let ACCOUNT_COSL = [];
  // if (isCreateTask) {
  //   ACCOUNT_COSL.push({
  //     ...CONFIRM_FORM_COL_6,
  //     ...httpSttleBillSelect(httpObj),
  //     selectTxtWidth: 390,
  //     handle,
  //   });
  // }
  return [
    //水单认领
    {
      className: "water-cols-top",
      scaleWidth: 1,
      fieldList: [
        {
          rows: [
            {
              cols: [...CLAIM_COLS],
            },
          ],
        },
      ],
    },
    {
      className: "water-cols-content",
      scaleWidth: 1,
      fieldList: [
        {
          rowClassName: "water-cols-left",
          rows: [
            {
              cols: [
                CONFIRM_FORM_COL_7, //水单金额
                CONFIRM_FORM_COL_10, //手续费
                CONFIRM_FORM_COL_11, //汇兑损益
                CONFIRM_FORM_COL_8, //剩余金额
                CONFIRM_FORM_COL_14, //计算提示ICON
              ],
            },
          ],
        },
        {
          rowClassName: "water-cols-right",
          rows: [
            {
              cols: [
                // CONFIRM_FORM_COL_12, //水单金额全部认领
                CONFIRM_FORM_COL_16,
                // ...ACCOUNT_COSL,
              ],
            },
          ],
        },
      ],
    },
    {
      scaleWidth: 1,
      fieldList: [
        {
          rows: [
            {
              cols: [
                CONFIRM_FORM_COL_9, //table
              ],
            },
          ],
        },
      ],
    },
    {
      scaleWidth: 1,
      fieldList: [
        {
          rows: [
            {
              cols: [CONFIRM_FORM_COL_20],
            },
          ],
        },
      ],
    },
  ];
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
  label: "本次核销(原币种)",
  prop: "verificationMoney",
  width: 130,
  align: "right",
  colFormat: "thousandthMark",
  decimal: 2,
  // showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  label: "本次核销(水单币种)",
  prop: "bankReceiptVerificationMoney",
  width: 136,
  align: "right",
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
const TABLE_COL_18 = {
  label: "收付款类型",
  prop: "type",
  showOverflowTooltip: true,
  minWidth: 100,
  align: "center",
  basicType: "billType",
  fontColor: true,
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  minWidth: 100,
  columnOperation: true,
  fixed: "right",
};
const TABLE_COL_COM = [
  TABLE_COL_INDEX,
  TABLE_COL_1, //财务单号
  TABLE_COL_18, //收付款类型
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
];

export const tableConfig = {
  editTable: [
    ...TABLE_COL_COM,
    {
      ...TABLE_COL_10,
      customRow: true,
    },
    TABLE_COL_11,
    TABLE_COL_OPERATION,
  ],
  viewTable: [
    ...TABLE_COL_COM,
    {
      ...TABLE_COL_10,
      showOverflowTooltip: true,
    },
    {
      ...TABLE_COL_11,
      fixed: "right",
    },
  ],
};
