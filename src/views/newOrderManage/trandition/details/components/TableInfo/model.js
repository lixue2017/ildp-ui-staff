import { multiplicationFn } from "@/utils/instructions";

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COL_601 = {
  label: "提货地址",
  prop: "cusConsigneeAddress",
  minWidth: 150,
  showOverflowTooltip: true,
  render: (r) => r.cusConsignee?.address || "--",
};
const TABLE_COL_602 = {
  label: "提货信息",
  prop: "contactsPhone",
  minWidth: 150,
  showOverflowTooltip: true,
  render: (r) =>
    `${r.cusConsignee?.contacts || "--"}(${r.cusConsignee?.phone || "--"})`,
};
const TABLE_COL_603 = {
  label: "箱序号",
  prop: "freightCode",
  width: 120,
  showOverflowTooltip: true,
};

const TABLE_COL_706 = {
  label: "总重量(KG)",
  prop: "totalWeight",
  width: 120,
  showOverflowTooltip: true,
  align: "right",
  render: (r) => {
    return multiplicationFn([r.takeFreightNum, r.weight], 2, "string");
  },
};

const TOTAL_COLS = [
  {
    label: "总提货柜量：",
    prop: "takeFreightNum",
    decimal: 0,
  },
  {
    label: "总重量：",
    prop: "totalWeight",
    decimal: 2,
    util: "KG",
  },
];

export const fclPickGoodsInfo = {
  title: "提货信息",
  grossTotal: TOTAL_COLS,
  columns: [
    TABLE_COL_INDEX,
    TABLE_COL_602, // 提货信息
    TABLE_COL_601, // 提货地址
    TABLE_COL_603, // 箱序号
    {
      label: "提货柜量",
      prop: "takeFreightNum",
      width: 120,
      showOverflowTooltip: true,
      align: "center",
    },
    {
      label: "到场时间",
      prop: "presentTime",
      minWidth: 150,
      showOverflowTooltip: true,
    },
    {
      label: "单柜重量(KG)",
      prop: "weight",
      width: 120,
      showOverflowTooltip: true,
      align: "right",
      decimal: 2,
    },
    TABLE_COL_706,
  ],
};

export const lclPickGoodsInfo = {
  title: "提货信息",
  grossTotal: TOTAL_COLS,
  columns: [
    TABLE_COL_INDEX,
    TABLE_COL_602, // 提货信息
    TABLE_COL_601, // 提货地址
    TABLE_COL_603, // 箱序号
    {
      label: "提货件数",
      prop: "takeFreightNum",
      width: 120,
      showOverflowTooltip: true,
      align: "center",
    },
    {
      label: "到场时间",
      prop: "presentTime",
      minWidth: 150,
      showOverflowTooltip: true,
    },
    {
      label: "单件毛重(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      align: "right",
      width: 120,
      decimal: 2,
    },
    {
      ...TABLE_COL_706,
      label: "总毛量(KG)",
    },
  ],
};
