import {
  httpFreightRateCostTypeSelect,
  httpCurrencySelect,
} from "@/comModel/httpSelect";
const TABLE_COLS_1 = {
  prop: "costName",
  label: "费用名称",
  minWidth: 160,
  request: true,
  customRow: true,
  showOverflowTooltip: true,
  fieldItem: {
    id: "costId",
    selectLabelKey: "costName",
    placeholder: "费用名称",
    ...httpFreightRateCostTypeSelect(),
  },
};
const TABLE_COLS_2 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 80,
  request: true,
  customRow: true,
  showOverflowTooltip: true,
  fieldItem: {
    id: "currencyId",
    selectLabelKey: "currencyCode",
    ...httpCurrencySelect,
  },
};
const TABLE_COLS_3 = {
  prop: "price",
  label: "单票价格",
  minWidth: 100,
  customRow: true,
  showOverflowTooltip: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 2,
    maxNumber: 999999999.99,
  },
};
const TABLE_COLS_4 = {
  ...TABLE_COLS_3,
  label: "价格",
  request: true,
  decimal: 2,
};
const TABLE_COLS_5 = {
  prop: "quantity",
  label: "数量",
  minWidth: 100,
  customRow: true,
  showOverflowTooltip: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 0,
    maxNumber: 999,
  },
};

const TABLE_COLS_6 = {
  prop: "costPrice",
  label: "费用",
  minWidth: 100,
  showOverflowTooltip: true,
  decimal: 2,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  minWidth: 120,
  columnOperation: true,
  fixed: "right",
};
const tableColumnsLCL = (isDetailView) => [
  TABLE_COLS_1,
  TABLE_COLS_2,
  {
    ...TABLE_COLS_4,
    label: isDetailView ? "单价" : "价格",
  },
  TABLE_COLS_5,
  ...(isDetailView ? [TABLE_COLS_6] : []),
];
const tableColumnsLeft = [TABLE_COLS_1, TABLE_COLS_2];
const tableColumnsRight = [TABLE_COLS_3];
// packingMode 0==FCL；1=LCL
export const tableColumns = (
  packingMode = 0,
  isDetail,
  boxModelList = ["40'GP", "20'GP"],
  isDetailView
) => {
  if (packingMode == 1) {
    if (isDetail) {
      return tableColumnsLCL(isDetailView).map((item) => {
        const { fieldItem, isEdit, request, ...data } = item;
        return {
          ...data,
          showOverflowTooltip: true,
          customRow: false,
        };
      });
    }
    return [...tableColumnsLCL(), TABLE_COLS_OPERATION];
  } else {
    const tableList = [...tableColumnsLeft];
    boxModelList.map((key) => {
      tableList.push({
        prop: key,
        label: key,
        minWidth: 80,
        customRow: true,
        showOverflowTooltip: true,
        fieldItem: {
          type: "inputNumber",
          decimal: 2,
          placeholder: "价格",
        },
      });
    });
    tableList.push(...tableColumnsRight);
    if (isDetail) {
      return tableList.map((item) => {
        const { fieldItem, isEdit, ...data } = item;
        return {
          ...data,
          showOverflowTooltip: true,
          customRow: false,
        };
      });
    }
    return [...tableList, TABLE_COLS_OPERATION];
  }
};
