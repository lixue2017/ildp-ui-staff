const DRAWER_COL_1 = {
  span: 12,
  id: "traySn",
  label: "托盘号：",
  type: "txt",
  txtTagArr: [
    {
      basicType: "wmsStorageMode",
      basicTypeVal: "storageMode",
    },
  ],
};
const DRAWER_COL_2 = {
  span: 12,
  id: "locationSn",
  label: "库位号：",
  type: "txt",
};
export const drawerFormCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [DRAWER_COL_1, DRAWER_COL_2],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_DRAWER_COL_1 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_DRAWER_COL_2 = {
  prop: "orderSn",
  label: "批次号",
  minWidth: 130,
  showOverflowTooltip: true,
};

const TABLE_DRAWER_COL_3 = {
  prop: "receivingSource",
  label: "业务类型",
  width: 120,
  showOverflowTooltip: true,
  basicType: "warehousingSource",
};
const TABLE_DRAWER_COL_4 = {
  prop: "boxSn",
  label: "箱序号/包装号",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_DRAWER_COL_5 = {
  prop: "sku",
  label: "SKU",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_DRAWER_COL_6 = {
  prop: "totalNum",
  label: "数量",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_DRAWER_COL_7 = {
  prop: "warehousingTime",
  label: "收货时间",
  width: 148,
  showOverflowTooltip: true,
};
export const tableDrawerCols = () => [
  TABLE_DRAWER_COL_1,
  TABLE_DRAWER_COL_2,
  TABLE_DRAWER_COL_3,
  TABLE_DRAWER_COL_4,
  TABLE_DRAWER_COL_5,
  TABLE_DRAWER_COL_6,
  TABLE_DRAWER_COL_7,
];
