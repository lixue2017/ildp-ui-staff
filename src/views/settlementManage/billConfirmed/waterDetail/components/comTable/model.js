const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_1 = {
  prop: "billNo",
  label: "财务单号",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  label: "相关单位",
  prop: "dealingsCompanyName",
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  label: "业务单号",
  prop: "orderNo",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  label: "业务类型",
  prop: "businessType",
  showOverflowTooltip: true,
  basicType: "settlementBusinessType",
};
const TABLE_COL_5 = {
  label: "业务员",
  prop: "salesmanName",
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  label: "币别",
  prop: "currencyCode",
  align: "center",
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  label: "账单金额",
  minWidth: 80,
  prop: "totalMoney",
  showOverflowTooltip: true,
  colFormat: "thousandthMark",
  align: "right",
  decimal: 2,
};
const TABLE_COL_8 = {
  label: "全部开票",
  prop: "invoiceStatus",
  showOverflowTooltip: true,
  fontColor: true,
  align: "center",
  basicType: "trueOrFalse",
};
const TABLE_COL_9 = {
  label: "已开票金额",
  prop: "invoiceMoney",
  minWidth: 120,
  showOverflowTooltip: true,
  colFormat: "thousandthMark",
  align: "right",
  decimal: 2,
};
const TABLE_COL_10 = {
  label: "开票中金额",
  prop: "underwayInvoiceMoney",
  showOverflowTooltip: true,
  minWidth: 120,
  colFormat: "thousandthMark",
  align: "right",
  decimal: 2,
};

const TABLE_COL_11 = {
  labelTop: "已核销金额",
  labelBottom: "(包含核销中)",
  headerTopBottom: true,
  prop: "writeOffMoney",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
  // colFormat: "thousandthMark",
  // decimal: 2,
  // render: r => formatMoney(accumulationFn([r.writeOffMoney, r.underwayMoney]))
};
const TABLE_COL_12 = {
  labelTop: "本次核销",
  labelBottom: "(原币种)",
  prop: "verificationMoney",
  headerTopBottom: true,
  align: "right",
  colFormat: "thousandthMark",
  align: "right",
  decimal: 2,
  // showOverflowTooltip: true,
};
const TABLE_COL_13 = {
  labelTop: "本次核销",
  labelBottom: "(水单币别)",
  prop: "bankReceiptVerificationMoney",
  headerTopBottom: true,
  align: "right",
  colFormat: "thousandthMark",
  align: "right",
  decimal: 2,
  // customRow: true,
  // showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  label: "收付款类型",
  prop: "type",
  showOverflowTooltip: true,
  minWidth: 100,
  align: "center",
  basicType: "billType",
  fontColor: true,
};
export const comTableConfig = (row = {}) => {
  const { WEBType } = row;
  return {
    columnConfig: [
      TABLE_COL_INDEX,
      TABLE_COL_1,
      TABLE_COL_14,
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
    ],
  };
};
