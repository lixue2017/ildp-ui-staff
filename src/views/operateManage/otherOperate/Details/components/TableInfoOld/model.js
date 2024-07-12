export const fclGoodsInfo = {
  title: '货物信息',
  grossTotal: [{
    label: '柜量：',
    prop: 'boxNum',
  }, {
    label: '重量小计：',
    prop: 'totalWeight',
    decimal: 2,
    compute: true,
    factor: [
      { prop: "boxNum" },
      { prop: "weight" },
    ]
  }],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    }, {
      label: "货物编码",
      prop: "freightCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "柜型",
      prop: "boxCode",
      minWidth: 100,
      // basicType: "box",
      showOverflowTooltip: true,
    },
    {
      label: "柜量",
      prop: "boxNum",
      showOverflowTooltip: true,
    },
    {
      label: "单柜重量(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: " 唛头",
      prop: "sku",
      showOverflowTooltip: true,
    },
    {
      label: "品名(CN)",
      prop: "productNameCn",
      showOverflowTooltip: true,
    },
    {
      label: "品名(EN)",
      prop: "productNameEn",
      showOverflowTooltip: true,
    },
    {
      label: "H S CODE(海关编码)",
      prop: "customsCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "重量小计(KG)",
      prop: "totalWeight",
      minWidth: 100,
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      basicType: "customsDeclarationType",
      showOverflowTooltip: true,
    },
  ]
}


export const fclPickGoodsInfo = {
  title: '提货信息',
  grossTotal: [{
    label: '提货柜量:',
    prop: 'takeFreightNum',
  }, {
    label: '总重量(KG):',
    prop: 'totalWeight',
    decimal: 2,
    compute: true,
    factor: [
      { prop: "takeFreightNum" },
      { prop: "weight" },
    ]
  }],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "提货信息",
      prop: "pickAddressInfo",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "提货地址",
      prop: "pickAddress",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "货物编码",
      prop: "freightCode",
      showOverflowTooltip: true,
    },
    {
      label: "提货柜量",
      prop: "takeFreightNum",
      showOverflowTooltip: true,
    },
    {
      label: "单柜重量(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: "总重量(KG)",
      prop: "totalWeight",
      customRow: true,
      showOverflowTooltip: true,
    },
  ]
}


export const lclGoodsInfo = {
  title: '货物信息',
  grossTotal: [{
    label: '件数：',
    prop: 'packNum',
  }, {
    label: '毛重：',
    prop: 'weight',
    decimal: 2,
  },
  {
    label: '体积：',
    prop: 'volume',
    decimal: 2,
  }],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    }, {
      label: "货物编码",
      prop: "freightCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "包装",
      prop: "packType",
      minWidth: 100,
      showOverflowTooltip: true,
      basicType: "packagingCode"
    },
    {
      label: "件数",
      prop: "packNum",
      showOverflowTooltip: true,
    },
    {
      label: "毛重(KG)",
      prop: "totalWeight",
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: "长度(CM)",
      prop: "length",
      showOverflowTooltip: true,
      decimal: 1
    },
    {
      label: "宽度(CM)",
      prop: "width",
      showOverflowTooltip: true,
      decimal: 1
    },
    {
      label: "高度(CM)",
      prop: "height",
      showOverflowTooltip: true,
      decimal: 1
    },
    {
      label: "体积(m³)",
      prop: "volume",
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: "唛头",
      prop: "sku",
      showOverflowTooltip: true,
    },
    {
      label: "品名(CN)",
      prop: "productNameCn",
      showOverflowTooltip: true,
    },
    {
      label: "品名(EN)",
      prop: "productNameEn",
      showOverflowTooltip: true,
    },
    {
      label: "H S CODE(海关编码)",
      prop: "customsCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      showOverflowTooltip: true,
      basicType: "customsDeclarationType"
    },
  ]
}


export const lclPickGoodsInfo = {
  title: '提货信息',
  grossTotal: [{
    label: '提货柜量：',
    prop: 'takeFreightNum',
  }, {
    label: '总毛重(KG)：',
    prop: 'totalWeight',
    decimal: 2,
    compute: true,
    factor: [
      { prop: "takeFreightNum" },
      { prop: "weight" },
    ]
  }],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "提货信息",
      prop: "pickAddressInfo",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "提货地址",
      prop: "pickAddress",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "货物编码",
      prop: "freightCode",
      showOverflowTooltip: true,
    },
    {
      label: "提货件数",
      prop: "takeFreightNum",
      showOverflowTooltip: true,
    },
    {
      label: "单件毛重(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: "总毛量(KG)",
      prop: "totalWeight",
      customRow: true,
      showOverflowTooltip: true,
    },
  ]
}
