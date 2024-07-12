import {
  httpPortPublicSelect,
  httpHaveAirFlightSelect,
  shipCompanyList,
} from "@/comModel/httpSelect";

const FORM_COLS_1 = {
  id: "effectiveTime",
  label: "有效期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_2 = {
  id: "state",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "freightRateState",
};
const FORM_COLS_3 = {
  id: "shipCompanyId",
  label: "船司：",
  placeholder: "船司",
  ...shipCompanyList(),
};
const FORM_COLS_4 = {
  id: "endPortId",
  label: "目的港：",
  placeholder: "目的港",
  ...httpPortPublicSelect(),
};
const FORM_COLS_5 = {
  startId: "minMoney",
  endId: "maxMoney",
  label: "金额：",
  startPlaceholder: "金额(大于)",
  endPlaceholder: "(小于)金额",
  type: "rangeSelect",
};
const FORM_COLS_6 = {
  id: "transferPortId",
  label: "中转港：",
  placeholder: "中转港",
  ...httpPortPublicSelect(),
};
const FORM_COLS_7 = {
  id: "routeNoManageId",
  label: "航次：",
  placeholder: "航次",
  ...httpHaveAirFlightSelect({ statusList: "1,2,3" }),
};
const FORM_COLS_8 = {
  id: "packingMode",
  label: "装箱方式：",
  placeholder: "装箱方式",
  type: "select",
  basicType: "freightType",
  clearable: false,
};
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
  prop: "startPortCode",
  label: "起运港",
  minWidth: 100,
  align: "left",
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
  columnLink: true,
};
const TABLE_COLS_1_1 = {
  prop: "endPortCode",
  label: "目的港",
  minWidth: 100,
  align: "left",
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "shipCompanyName",
  label: "船司",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "voyageNumber",
  label: "船次/航次",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "cutGateTime",
  label: "预计截关日期",
  minWidth: 160,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "sailOpenTime",
  label: "预计开船日期",
  minWidth: 160,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "voyage",
  label: "航程",
  minWidth: 100,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
// const TABLE_COLS_7 = {
//   prop: "table_xx_7",
//   label: "大船起运港",
//   minWidth: 150,
//   align: "left",
//   sortable: true,
//   showOverflowTooltip: true,
// };
const TABLE_COLS_8 = {
  prop: "transferPortCode",
  label: "中转港",
  minWidth: 100,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "20'GP",
  label: "20GP(USD)",
  minWidth: 130,
  align: "left",
  showOverflowTooltip: true,
  customRow: true,
  color: "#FF813D",
};
const TABLE_COLS_10 = {
  prop: "40'GP",
  label: "40'GP(USD)",
  minWidth: 130,
  align: "left",
  showOverflowTooltip: true,
  customRow: true,
  color: "#FF813D",
};
const TABLE_COLS_11 = {
  prop: "40'HQ",
  label: "40'HQ(USD)",
  minWidth: 130,
  align: "left",
  showOverflowTooltip: true,
  customRow: true,
  color: "#FF813D",
};
const TABLE_COLS_12 = {
  prop: "surcharge",
  label: "附加费",
  minWidth: 120,
  align: "left",
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "remark",
  label: "备注",
  minWidth: 100,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "bookingNum",
  label: "订舱记录",
  minWidth: 120,
  align: "left",
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "endEffectiveTime",
  label: "有效期",
  minWidth: 200,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
  render: (row) =>
    row.startEffectiveTime && row.endEffectiveTime
      ? `${row.startEffectiveTime}~${row.endEffectiveTime}`
      : "--",
};
const TABLE_COLS_16 = {
  prop: "state",
  label: "状态",
  minWidth: 100,
  basicType: "freightRateState",
  dotColor: true,
  fixed: "right",
};
const TABLE_COLS_17 = {
  prop: "阶梯1",
  label: "阶梯1(USD)",
  minWidth: 130,
  align: "left",
  showOverflowTooltip: true,
  customRow: true,
  color: "#FF813D",
};
const TABLE_COLS_18 = {
  prop: "阶梯2",
  label: "阶梯2(USD)",
  minWidth: 130,
  align: "left",
  showOverflowTooltip: true,
  customRow: true,
  color: "#FF813D",
};
const TABLE_COLS_19 = {
  prop: "阶梯3",
  label: "阶梯3(USD)",
  minWidth: 130,
  align: "left",
  showOverflowTooltip: true,
  customRow: true,
  color: "#FF813D",
};
const TABLE_COLS_20 = {
  prop: "routeNoManageName",
  label: "航次编码",
  minWidth: 180,
  align: "left",
  sortable: true,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 150,
  columnOperation: true,
  columnMoreOperation: true,
  fixed: "right",
};

const searchColumnsKY = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7,
];
const searchColumnsHY = [FORM_COLS_8, ...searchColumnsKY];
const searchColumns = (tab) => {
  const obj = {
    1: searchColumnsHY,
    2: searchColumnsKY,
  };
  return {
    searchNum: obj[tab].length,
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: obj[tab],
              },
            ],
          },
        ],
      },
    ],
  };
};
const tableColumnsFCL = [
  TABLE_COLS_SELECTION,
  TABLE_COLS_1,
  TABLE_COLS_1_1,
  TABLE_COLS_2,
  TABLE_COLS_20,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  // TABLE_COLS_7,
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
const tableColumnsLCL = [
  TABLE_COLS_SELECTION,
  TABLE_COLS_1,
  TABLE_COLS_1_1,
  TABLE_COLS_2,
  TABLE_COLS_20,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  // TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_17,
  TABLE_COLS_18,
  TABLE_COLS_19,
  TABLE_COLS_12,
  TABLE_COLS_13,
  TABLE_COLS_14,
  TABLE_COLS_15,
  TABLE_COLS_16,
  TABLE_COLS_OPERATION,
];

export { searchColumns, tableColumnsFCL, tableColumnsLCL };
