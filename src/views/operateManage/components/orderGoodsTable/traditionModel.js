const TABLE_GOODS_COL_INDEX = {
  prop: "indexSlot",
  width: 60,
  align: "center",
  customRow: true,
};
const TABLE_GOODS_COL_1 = {
  label: "箱序号",
  prop: "freightCode",
  width: 120,
  showOverflowTooltip: true,
};
const TABLE_GOODS_COL_2 = {
  label: "包装",
  prop: "packType",
  width: 110,
  showOverflowTooltip: true,
  basicType: "packagingCode",
};
const TABLE_GOODS_COL_3 = {
  label: "品名",
  prop: "productNameCn",
  width: 110,
  showOverflowTooltip: true,
};
const TABLE_GOODS_COL_4 = {
  label: "唛头",
  prop: "sku",
  width: 110,
  showOverflowTooltip: true,
};
const TABLE_GOODS_COL_5 = {
  label: "H S CODE",
  prop: "customsCode",
  minWidth: 110,
  showOverflowTooltip: true,
};
const TABLE_GOODS_COL_6 = {
  label: "产品属性",
  prop: "productAttribute",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "productType",
};
const TABLE_GOODS_COL_7 = {
  label: "报关方式",
  prop: "customsDeclarationType",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "customsDeclarationType",
};

const TABLE_GOODS_COL_61 = {
  label: "单件体积(CBM)",
  showOverflowTooltip: true,
  width: 115,
  align: "right",
  decimal: 2,
};
const TABLE_GOODS_COL_62 = {
  label: "单件毛重(KG)",
  showOverflowTooltip: true,
  width: 110,
  align: "right",
  decimal: 2,
};

// 散货核实
export const orderLCLVerifyGoodsCols = () => ({
  title: "核实信息",
  totalCol: [
    {
      label: "总件数：",
      prop: "warehousingQuantity",
      decimal: 0,
    },
    {
      label: "总体积：",
      prop: "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
    {
      label: "总毛重：",
      prop: "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
  ],
  columns: [
    TABLE_GOODS_COL_INDEX,
    TABLE_GOODS_COL_1,
    TABLE_GOODS_COL_2,
    {
      label: "件数",
      prop: "warehousingQuantity",
      width: 90,
      showOverflowTooltip: true,
      align: "right",
      decimal: 0,
    },
    // {
    //   ...TABLE_GOODS_COL_62, // 单件毛重
    //   prop: "warehousingWeight",
    // },
    // {
    //   ...TABLE_GOODS_COL_61, // 单件体积
    //   prop: "warehousingVolume",
    // },
    {
      label: "毛重小计(KG)",
      prop: "warehousingTotalWeight",
      showOverflowTooltip: true,
      width: 120,
      align: "right",
      decimal: 2,
    },
    {
      label: "体积小计(CBM)",
      prop: "warehousingTotalVolume",
      showOverflowTooltip: true,
      width: 120,
      align: "right",
      decimal: 2,
    },
    {
      ...TABLE_GOODS_COL_3,
      prop: "productName",
    },
    {
      ...TABLE_GOODS_COL_4,
      prop: "maitou",
    },
    TABLE_GOODS_COL_5,
    TABLE_GOODS_COL_6,
    TABLE_GOODS_COL_7,
  ],
});

// 散货预报
export const orderLCLGoodsCols = {
  title: "预报信息",
  totalCol: [
    {
      label: "总件数：",
      prop: "packNum",
      vProp: "warehousingQuantity",
      decimal: 0,
    },
    {
      label: "总体积：",
      prop: "totalboxVolume",
      vProp: "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
    {
      label: "总毛重：",
      prop: "totalBoxWeight",
      vProp: "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
  ],
  columns: [
    TABLE_GOODS_COL_INDEX,
    TABLE_GOODS_COL_1,
    TABLE_GOODS_COL_2,
    {
      label: "件数",
      prop: "packNum",
      customRow: true,
      width: 120,
      showOverflowTooltip: true,
      align: "right",
      decimal: 0,
    },
    // {
    //   ...TABLE_GOODS_COL_62, // 单件毛重
    //   prop: "weight",
    // },
    // {
    //   ...TABLE_GOODS_COL_61, // 单件体积
    //   prop: "volume",
    // },
    {
      label: "毛重小计(KG)",
      prop: "totalBoxWeight",
      showOverflowTooltip: true,
      customRow: true,
      minWidth: 130,
      align: "right",
      decimal: 2,
    },
    {
      label: "体积小计(CBM)",
      prop: "totalboxVolume",
      showOverflowTooltip: true,
      customRow: true,
      minWidth: 130,
      align: "right",
      decimal: 2,
    },
    TABLE_GOODS_COL_3,
    TABLE_GOODS_COL_4,
    TABLE_GOODS_COL_5,
    TABLE_GOODS_COL_6,
    TABLE_GOODS_COL_7,
  ],
};

// 整柜核实
export const orderFCLVerifyGoodsCols = () => ({
  title: "核实信息(FCL整柜)",
  totalCol: [
    {
      label: "总柜量：",
      prop: "warehousingQuantity",
      decimal: 0,
    },
    {
      label: "总重量：",
      prop: "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
    {
      label: "总体积：",
      prop: "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
  ],
  columns: [
    TABLE_GOODS_COL_INDEX,
    TABLE_GOODS_COL_1,
    {
      label: "柜型",
      prop: "boxSizeCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "柜量",
      prop: "warehousingQuantity",
      showOverflowTooltip: true,
      align: "center",
    },
    // {
    //   ...TABLE_GOODS_COL_62,
    //   label: "单柜重量(KG)",
    //   prop: "weight",
    // },
    // {
    //   ...TABLE_GOODS_COL_61,
    //   label: "单柜体积(CBM)",
    //   prop: "volume",
    // },
    {
      label: "重量小计(KG)",
      prop: "warehousingTotalWeight",
      showOverflowTooltip: true,
      width: 120,
      align: "right",
      decimal: 2,
    },
    {
      label: "体积小计(CBM)",
      prop: "warehousingTotalVolume",
      showOverflowTooltip: true,
      width: 120,
      align: "right",
      decimal: 2,
    },
    {
      ...TABLE_GOODS_COL_3,
      prop: "productName",
    },
    {
      ...TABLE_GOODS_COL_4,
      prop: "maitou",
    },
    TABLE_GOODS_COL_5,
    TABLE_GOODS_COL_6,
    TABLE_GOODS_COL_7,
  ],
});

// 整柜预报
export const orderFCLGoodsCols = {
  title: "预报信息(FCL整柜)",
  totalCol: [
    {
      label: "总柜量：",
      prop: "boxNum",
      vProp: "warehousingQuantity",
      decimal: 0,
    },
    {
      label: "总重量：",
      prop: "totalBoxWeight",
      vProp: "warehousingTotalWeight",
      decimal: 2,
      util: "KG",
    },
    {
      label: "总体积：",
      prop: "totalboxVolume",
      vProp: "warehousingTotalVolume",
      decimal: 2,
      util: "CBM",
    },
  ],
  columns: [
    TABLE_GOODS_COL_INDEX,
    TABLE_GOODS_COL_1, // 箱序号
    {
      label: "柜型",
      prop: "boxCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "柜量",
      prop: "boxNum",
      showOverflowTooltip: true,
      align: "center",
    },
    // {
    //   ...TABLE_GOODS_COL_62,
    //   label: "单柜重量(KG)",
    //   prop: "weight",
    // },
    // {
    //   ...TABLE_GOODS_COL_61,
    //   label: "单柜体积(CBM)",
    //   prop: "volume",
    // },
    {
      label: "重量小计(KG)",
      prop: "totalBoxWeight",
      showOverflowTooltip: true,
      width: 120,
      align: "right",
      decimal: 2,
    },
    {
      label: "体积小计(CBM)",
      prop: "totalboxVolume",
      showOverflowTooltip: true,
      width: 120,
      align: "right",
      decimal: 2,
    },
    TABLE_GOODS_COL_3,
    TABLE_GOODS_COL_4,
    TABLE_GOODS_COL_5,
    TABLE_GOODS_COL_6,
    TABLE_GOODS_COL_7,
  ],
};
