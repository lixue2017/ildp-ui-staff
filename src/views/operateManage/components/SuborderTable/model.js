const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_1 = {
  label: "工作单号",
  prop: "torderNo",
  columnLink: true,
  showOverflowTooltip: true,
  minWidth: 140,
  fixed: "left",
};
const TABLE_COLS_2 = {
  label: "委托人",
  prop: "userShortName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "left",
};
const TABLE_COLS_3 = {
  label: "尾程运输方式",
  prop: "outWarehouseWayName",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  label: "目的仓",
  prop: "endWarehouse",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TABLE_COLS_5 = {
  label: "客户下单资料",
  prop: "meansNum",
  customRow: true,
  minWidth: 140,
  basicType: "information",
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  label: "客户报关资料",
  prop: "declareNum",
  customRow: true,
  minWidth: 140,
  basicType: "information",
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  label: "产品属性",
  prop: "productAttribute",
  minWidth: 120,
  showOverflowTooltip: true,
  render: (row) => ["普货", "敏感货"][row.productAttribute] || "--",
};
const TABLE_COLS_8 = {
  label: "装柜顺序",
  prop: "rowCabinetSort",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "customsDeclarationType",
  label: "报关方式",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "customsDeclarationType",
};
const TABLE_COLS_10 = {
  prop: "inWarehouseStatus",
  label: "入仓状态",
  width: 100,
  fontColor: true,
  basicType: "inOutWarehouseStatus",
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "expectSumBoxNum",
  label: "(预计)总箱数/件数",
  align: "center",
  width: 155,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "expectSumWeight",
  label: "(预计)总重量(KG)",
  width: 155,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const TABLE_COLS_13 = {
  prop: "expectCbm",
  label: "(预计)立方(CBM)",
  width: 155,
  align: "right",
  showOverflowTooltip: true,
  minWidth: 120,
  decimal: 2,
};
const TABLE_COLS_14 = {
  label: "业务员",
  prop: "followBy",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  label: "排柜备注",
  prop: "rowCabinetRemark",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  label: "业务备注",
  prop: "remark",
  minWidth: 160,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "vatNo",
  label: "VAT No.",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  prop: "eoriNo",
  label: "EORI No.",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "mergeOpNums",
  label: "运单号",
  minWidth: 130,
  showOverflowTooltip: true,
};

const TABLE_COLS_OPERATION = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true,
  columnMoreOperation: true,
  minWidth: 150,
};

export const tableColumns = (canSplitOrder) => [
  TABLE_COLS_INDEX,
  TABLE_COLS_SELECTION,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  TABLE_COLS_12,
  TABLE_COLS_13,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_OPERATION,
];
