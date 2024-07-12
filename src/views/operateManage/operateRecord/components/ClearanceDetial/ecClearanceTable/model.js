const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 40,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "operationOrderNum",
  label: "工作单号",
  minWidth: 128,
  // sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "freightType",
  label: "装箱方式",
  minWidth: 96,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "freightType",
};
const TABLE_COLS_3 = {
  prop: "bailorPeople",
  label: "委托人",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "customsClearanceName",
  label: "清关方式",
  minWidth: 96,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "realFreightCount",
  label: "件数",
  minWidth: 72,
  sortable: true,
  align: "center",
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "realFreightWeight",
  label: "重量(KG)",
  minWidth: 96,
  sortable: true,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "realFreightVolume",
  label: "体积(CBM)",
  minWidth: 112,
  sortable: true,
  align: "right",
  decimal: 3,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "desWarehouseName",
  label: "目的仓",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "createTime",
  label: "接单时间",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "operatorName",
  label: "业务操作员",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "UNCHARTED_TABLE_12",
  label: "箱单发票",
  minWidth: 110,
  customRow: true,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "UNCHARTED_TABLE_13",
  label: "HBL资料",
  minWidth: 110,
  customRow: true,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "vatNo",
  label: "VAT No.",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "eoriNo",
  label: "EORI No.",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "isEditCheckGoods",
  label: "是否维护",
  minWidth: 96,
  sortable: true,
  showOverflowTooltip: true,
  fixed: "right",
  yesOrNo: true,
};
const TABLE_COLS_17 = {
  prop: "mergeColumns",
  label: "合并清关",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  prop: "rowDccRemark", // 核实
  label: "备注",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "warehouseAddress",
  label: "详情地址",
  minWidth: 120,
  // sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true,
  columnMoreOperation: true,
  fixed: "right",
  minWidth: 220,
};

// type: 3=预报列表；4=核实列表； customsClearanceStatus：0,1=只显示预报或者显示预报与核实；
export const tableColumns = ({
  source,
  type,
  customsClearanceStatus,
  canOperation,
}) => {
  const isShowOperation =
    !source &&
    ((type === 3 && [0].includes(customsClearanceStatus)) ||
      (type === 4 && ![0].includes(customsClearanceStatus) && canOperation));
  return [
    ...(isShowOperation ? [TABLE_COLS_SELECTION] : []),
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_17,
    ...(type === 4
      ? [TABLE_COLS_18]
      : [
          {
            ...TABLE_COLS_18,
            prop: "rowYbDccRemark", // 预报
          },
        ]),
    TABLE_COLS_2,
    TABLE_COLS_14,
    TABLE_COLS_15,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_19,
    TABLE_COLS_9,
    TABLE_COLS_10,
    TABLE_COLS_11,
    TABLE_COLS_12,
    TABLE_COLS_13,
    ...(type === 4 ? [TABLE_COLS_16] : []),
    ...(isShowOperation ? [TABLE_COLS_OPERATION] : []),
  ];
};
