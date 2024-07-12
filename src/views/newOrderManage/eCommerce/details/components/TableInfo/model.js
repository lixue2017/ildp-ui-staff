export const chargeInfo = {
  title: "计费信息",
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "类型",
      prop: "LX",
      showOverflowTooltip: true,
    },
    {
      label: "费用名称",
      prop: "FYMC",
      showOverflowTooltip: true,
    },
    {
      label: "往来单位",
      prop: "WLDW",
      showOverflowTooltip: true,
    },
    {
      label: "币种",
      prop: "BZ",
      showOverflowTooltip: true,
    },
    {
      label: "金额",
      prop: "JE",
      showOverflowTooltip: true,
      align: "right",
    },
    {
      label: "单价",
      prop: "DJ",
      showOverflowTooltip: true,
      align: "right",
    },
    {
      label: "数量",
      prop: "SL",
      minWidth: 100,
      showOverflowTooltip: true,
      align: "right",
    },
    {
      label: "备注",
      prop: "BZ",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "创建人",
      prop: "CJR",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "状态",
      prop: "ZT",
      showOverflowTooltip: true,
    },
    {
      label: "创建时间",
      prop: "CJSJ",
      showOverflowTooltip: true,
    },
    {
      label: "操作",
      prop: "CJ",
      showOverflowTooltip: true,
    },
  ],
};
export const goodsTable = {
  title: "货物信息",
  grossTotal: [
    {
      label: "目的地：",
      prop: "consigneeCount",
      util: "个",
    },
    {
      label: "总箱数：",
      prop: "totalBoxCount",
    },
    {
      label: "总毛重：",
      prop: "totalWeight",
      decimal: 2,
      util: "KG",
    },
    {
      label: "总体积：",
      prop: "totalVolume",
      decimal: 2,
      util: "CBM",
    },
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "Shipment ID",
      prop: "shipmentId",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "Reference ID",
      prop: "referenceId",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    // {
    //   label: "箱号",
    //   prop: "boxNumber",
    //   showOverflowTooltip: true,
    // },
    {
      label: "箱数",
      prop: "boxCount",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: " 箱长(CM)",
      prop: "boxLength",
      align: "right",
      decimal: 1,
      showOverflowTooltip: true,
    },
    {
      label: "箱宽(CM)",
      prop: "boxWidth",
      align: "right",
      decimal: 1,
      showOverflowTooltip: true,
    },
    {
      label: "箱高(CM)",
      prop: "boxHeight",
      align: "right",
      decimal: 1,
      showOverflowTooltip: true,
    },
    {
      label: "毛重小计(KG)",
      prop: "totalBoxWeight",
      minWidth: 100,
      align: "right",
      decimal: 2,
      showOverflowTooltip: true,
    },
    {
      label: "体积小计(CBM)",
      prop: "totalboxVolume",
      minWidth: 100,
      align: "right",
      decimal: 2,
      showOverflowTooltip: true,
    },
    // {
    //   label: "类型",
    //   prop: "platformType",
    //   showOverflowTooltip: true,
    //   basicType: "warehouseType",
    //   basicTypeVal: "platformType",
    // },
    {
      label: "目的地",
      prop: "consigneeWarehouseCode",
      showOverflowTooltip: true,
    },
  ],
};

export const cabinetTable = {
  title: "整柜信息",
  grossTotal: [
    {
      label: "柜型：",
      prop: "boxTypeCount",
      util: "个",
    },
    {
      label: "重量总计：",
      prop: "totalWeight",
      decimal: 2,
    },
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "柜型",
      prop: "code",
      showOverflowTooltip: true,
    },
    {
      label: "柜量",
      prop: "boxCount",
      showOverflowTooltip: true,
      align: "right",
    },
    {
      label: "单柜重量(KG)",
      prop: "unitWeight",
      showOverflowTooltip: true,
      decimal: 2,
      align: "right",
    },
    {
      label: "重量小计(KG)",
      prop: "subtotalWeight",
      showOverflowTooltip: true,
      decimal: 2,
      align: "right",
    },
  ],
};

export const pickTable = {
  title: "提货信息",
  grossTotal: [
    {
      label: "总箱数：",
      prop: "takeBoxCount",
      // util: '个'
    },
    //   {
    //     label: '总毛重：',
    //     prop: 'totalWeight'
    //   },
    //   {
    //     label: '总体积：',
    //     prop: 'totalVolume'
    //   }
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "提货信息",
      prop: "takeInfos",
      showOverflowTooltip: true,
    },
    {
      label: "提货地址",
      prop: "address",
      showOverflowTooltip: true,
    },
    {
      label: "Shipment ID",
      prop: "shipmentId",
      width: 120,
      showOverflowTooltip: true,
    },
    // {
    //   label: "FBA箱号",
    //   prop: "boxNumber",
    //   showOverflowTooltip: true,
    // },
    {
      label: "提货箱数",
      prop: "takeBoxCount",
      align: "center",
      width: 120,
      showOverflowTooltip: true,
    },
    {
      label: "到场时间",
      prop: "presentTime",
      minWidth: 150,
      showOverflowTooltip: true,
    },
  ],
};

export const productTable = {
  title: "产品信息",
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "volume",
      width: 70,
      align: "center",
      customRow: true,
    },
    {
      labelTop: "唛头",
      labelBottom: "名称",
      prop: "sku",
      customRow: true,
      customHeader: true,
    },
    {
      labelTop: "HS CODE",
      labelBottom: "ASIN",
      width: 120,
      prop: "code",
      customRow: true,
      customHeader: true,
    },
    {
      labelTop: "产品毛量(KG)",
      labelBottom: "产品净重(KG)",
      prop: "weight",
      align: "right",
      width: 120,
      customRow: true,
      customHeader: true,
      config: {
        decimal: 2,
      },
    },
    {
      labelTop: "申报价格",
      labelBottom: "数量",
      prop: "declaredValue",
      align: "right",
      width: 120,
      customRow: true,
      customHeader: true,
      config: {
        decimal: 2,
      },
    },
    {
      labelTop: "型号",
      labelBottom: "品牌",
      prop: "productModel",
      customRow: true,
      customHeader: true,
    },
    {
      labelTop: "产品成分",
      labelBottom: "产品用途",
      prop: "businessUse",
      customRow: true,
      customHeader: true,
    },
    {
      labelTop: "Shipment ID",
      labelBottom: "Reference ID",
      prop: "shipmentId",
      customRow: true,
      customHeader: true,
    },
  ],
};
