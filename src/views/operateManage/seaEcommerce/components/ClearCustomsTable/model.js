const C_TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const C_TABLE_COL_1 = {
  prop: "operationOrderNum",
  label: "操作单号",
  minWidth: 120,
  showOverflowTooltip: true,
  fixed: "left",
  columnLink: true,
};
const C_TABLE_COL_2 = {
  prop: "customerName",
  label: "委托人",
  minWidth: 120,
  showOverflowTooltip: true,
  fixed: "left",
};
const C_TABLE_COL_3 = {
  prop: "freightType",
  label: "装箱方式",
  minWidth: 72,
  showOverflowTooltip: true,
  basicType: "freightType",
};
const C_TABLE_COL_4 = {
  prop: "reportCustomsWay",
  label: "报关方式",
  minWidth: 120,
  showOverflowTooltip: true,
  basicType: "customsDeclarationType",
};
const C_TABLE_COL_5 = {
  prop: "customsBrokerName",
  label: "清关行",
  minWidth: 120,
  showOverflowTooltip: true,
};
const C_TABLE_COL_6 = {
  prop: "volume",
  label: "总体积(CBM)",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 3,
};
const C_TABLE_COL_7 = {
  prop: "weight",
  label: "总重量(KG)",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const C_TABLE_COL_8 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 100,
  showOverflowTooltip: true,
};
const C_TABLE_COL_9 = {
  prop: "operatorName",
  label: "操作员",
  minWidth: 100,
  showOverflowTooltip: true,
};
const C_TABLE_COL_10 = {
  prop: "clearanceProfileStatus",
  label: "报关资料状态",
  minWidth: 123,
  showOverflowTooltip: true,
  colorProp: "clearanceProfileStatusColor",
};
const C_TABLE_COL_11 = {
  prop: "cusProfileStatus",
  label: "清关资料状态",
  minWidth: 123,
  showOverflowTooltip: true,
  colorProp: "cusProfileStatusColor",
};
const C_TABLE_COL_12 = {
  prop: "xx_c_bg",
  label: "客户报关资料",
  minWidth: 100,
  customRow: true,
};
const C_TABLE_COL_13 = {
  prop: "xx_c_qg",
  label: "清关资料",
  minWidth: 100,
  customRow: true,
};
const C_TABLE_COL_14 = {
  prop: "xx_c_fx",
  label: "报关放行资料",
  minWidth: 100,
  customRow: true,
};
const C_TABLE_COL_OPERATION = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  minWidth: 90,
};

export const tableDeclarationCols = () => {
  return [
    C_TABLE_COL_0,
    C_TABLE_COL_1,
    C_TABLE_COL_2,
    C_TABLE_COL_3,
    C_TABLE_COL_4,
    C_TABLE_COL_5,
    C_TABLE_COL_6,
    C_TABLE_COL_7,
    C_TABLE_COL_8,
    C_TABLE_COL_9,
    C_TABLE_COL_10,
    C_TABLE_COL_11,
    C_TABLE_COL_12,
    C_TABLE_COL_13,
    C_TABLE_COL_14,
    C_TABLE_COL_OPERATION,
  ];
};

export const fileCustomDialogCols = () => {
  return {
    title: "资料上传",
    width: "900px",
    labelWidth: "72px",
    simpleCustomCols: [
      {
        span: 24,
        id: "operationOrderNum",
        label: "工作单号：",
        type: "txt",
      },
      {
        span: 24,
        id: "fileDeclarationSlot",
        labelWidth: "0px",
        type: "slot",
      },
    ],
  };
};
