import { toFixedNum } from '@/utils/instructions'
export const fclGoodsInfo = {
  title: '核实信息(FCL整柜)',
  btnRight: [
    {
      text: "维护货物信息",
      key: 1
    }
  ],
  grossTotal: [
    {
      label: '件数：',
      prop: 'warehousingQuantity',
      decimal: 0
    },
    {
      label: '体积小计(CBM)：',
      prop: 'warehousingTotalVolume',
      decimal: 2
    },
    {
      label: '毛重小计(KG)：',
      prop: 'warehousingTotalWeight',
      decimal: 2
    }
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      basicType: "customsDeclarationType",
      showOverflowTooltip: true,
      customRow: true,
    },
    {
      label: "件数",
      prop: "warehousingQuantity",
      showOverflowTooltip: true,
      minWidth: 120,
      align: 'center',
      decimal: 0
    },
    {
      label: "包装",
      prop: "packTypeId",
      minWidth: 100,
      showOverflowTooltip: true,
      basicType: "packagingCode",
    },
    {
      label: "箱型",
      prop: "boxSizeCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "体积小计(CBM)",
      prop: "warehousingTotalVolume",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2,
      minWidth: 130
    },
    {
      label: "毛重小计(KG)",
      prop: "warehousingTotalWeight",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2,
      minWidth: 130
    },
    {
      label: "箱号",
      prop: "ontainerSno",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "封号",
      prop: "sealingStripSno",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "SO NO.",
      prop: "sono",
      minWidth: 100,
      showOverflowTooltip: true,
    },
  ]
}

export const predictionFclGoodsInfo = {
  title: '预报信息(FCL整柜)',
  grossTotal: [
    {
      label: '件数：',
      propTop: 'calcPackNum',
      propBtm: 'warehousingQuantity',
      decimal: 0
    }, {
      label: '体积小计(CBM)：',
      propTop: 'calcVolume',
      propBtm: 'warehousingTotalVolume',
      decimal: 2
    }, {
      label: '毛重小计(KG)：',
      propTop: 'calcWeight',
      propBtm: 'warehousingTotalWeight',
      decimal: 2
    }
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      showOverflowTooltip: true,
      basicType: "customsDeclarationType",
      customRow: true,
    },
    {
      label: "件数",
      prop: "packNum",
      showOverflowTooltip: true,
      align: 'center',
      decimal: 0,
      customRow: true,
      customHeader: true,
      minWidth: 120,
    },
    {
      label: "柜型",
      prop: "boxCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "体积小计(CBM)",
      prop: "totalVolume",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2,
      minWidth: 130
    },
    {
      label: "毛重小计(KG)",
      prop: "totalWeight",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2,
      minWidth: 130
    },
    {
      label: "唛头",
      prop: "sku",
      showOverflowTooltip: true,
      minWidth: 100
    },
    {
      label: "品名",
      prop: "productNameCn",
      showOverflowTooltip: true,
    },
    {
      label: "H S CODE",
      prop: "customsCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
  ]
}

export const fclPickGoodsInfo = {
  title: '提货信息',
  grossTotal: [{
    label: '提货柜量：',
    prop: 'takeFreightNum',
  }, {
    label: '总重量(KG)：',
    prop: 'totalWeight',
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
      label: "箱序号",
      prop: "freightCode",
      showOverflowTooltip: true,
    },
    {
      label: "提货柜量",
      prop: "takeFreightNum",
      align: "center",
      showOverflowTooltip: true,
    },
    {
      label: "单柜重量(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      align: "right",
      render: (rows) => {
        return `${toFixedNum(rows.weight)}`
      }
    },
    {
      label: "总重量(KG)",
      prop: "totalWeight",
      customRow: true,
      showOverflowTooltip: true,
      align: "right",
      render: (rows) => {
        return `${toFixedNum(rows.totalWeight)}`
      }
    },
  ]
}

export const lclGoodsInfo = {
  title: '核实信息(LCL散货)',
  btnRight: [
    {
      text: "维护货物信息",
      key: 1
    }
  ],
  grossTotal: [
    {
      label: '件数：',
      prop: 'warehousingQuantity',
      decimal: 0
    },
    {
      label: '体积小计(CBM)：',
      prop: 'warehousingTotalVolume',
      decimal: 2
    }, {
      label: '毛重小计(KG)：',
      prop: 'warehousingTotalWeight',
      decimal: 2
    }
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      showOverflowTooltip: true,
      basicType: "customsDeclarationType",
      customRow: true,
    },
    // {
    //   label: "货物编码",
    //   prop: "freightCode",
    //   minWidth: 100,
    //   showOverflowTooltip: true,
    // },
    {
      label: "件数",
      prop: "warehousingQuantity",
      showOverflowTooltip: true,
      align: 'center',
      decimal: 0
    },
    {
      label: "包装",
      prop: "packTypeId",
      showOverflowTooltip: true,
      basicType: "packagingCode",
    },
    {
      label: "箱型",
      prop: "boxSizeCode",
      showOverflowTooltip: true,
    },
    {
      label: "体积小计(CBM)",
      prop: "warehousingTotalVolume",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2
    },
    {
      label: "毛重小计(KG)",
      prop: "warehousingTotalWeight",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2
    },
    {
      label: "箱号",
      prop: "ontainerSno",
      showOverflowTooltip: true,
    },
    {
      label: "封号",
      prop: "sealingStripSno",
      showOverflowTooltip: true,
    }
  ]
}
export const kyLclGoodsInfo = {
  title: '核实信息(空运订单)',
  btnRight: [
    {
      text: "维护货物信息",
      key: 1
    }
  ],
  grossTotal: [
    {
      label: '件数：',
      prop: 'warehousingQuantity',
      decimal: 0
    },
    {
      label: '体积小计(CBM)：',
      prop: 'warehousingTotalVolume',
      decimal: 2
    }, {
      label: '毛重小计(KG)：',
      prop: 'warehousingTotalWeight',
      decimal: 2
    }
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      showOverflowTooltip: true,
      basicType: "customsDeclarationType",
      customRow: true,
    },
    // {
    //   label: "货物编码",
    //   prop: "freightCode",
    //   minWidth: 100,
    //   showOverflowTooltip: true,
    // },
    {
      label: "件数",
      prop: "warehousingQuantity",
      showOverflowTooltip: true,
      minWidth: 120,
      align: "center",
      decimal: 0
    },
    {
      label: "包装",
      prop: "packTypeId",
      showOverflowTooltip: true,
      basicType: "packagingCode",
    },
    // {
    //   label: "箱型",
    //   prop: "boxSizeCode",
    //   showOverflowTooltip: true,
    // },
    // {
    //   label: "长(CM)",
    //   prop: "warehousingLength",
    //   showOverflowTooltip: true,
    //   align: 'right',
    //   decimal: 1,
    //   minWidth: 130
    // },
    // {
    //   label: "宽(CM)",
    //   prop: "warehousingWidth",
    //   showOverflowTooltip: true,
    //   align: 'right',
    //   decimal: 1,
    //   minWidth: 130
    // },
    // {
    //   label: "高(CM)",
    //   prop: "warehousingHeight",
    //   showOverflowTooltip: true,
    //   align: 'right',
    //   decimal: 1,
    //   minWidth: 130
    // },
    {
      label: "体积小计(CBM)",
      prop: "warehousingTotalVolume",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2,
      minWidth: 130
    },
    {
      label: "毛重小计(KG)",
      prop: "warehousingTotalWeight",
      showOverflowTooltip: true,
      align: 'right',
      decimal: 2,
      minWidth: 130
    }
  ]
}


export const predictionLclGoodsInfo = {
  title: '预报信息(LCL散货)',
  grossTotal: [
    {
      label: '件数：',
      propTop: 'calcPackNum',
      propBtm: 'warehousingQuantity',
      decimal: 0
    }, {
      label: '体积小计(CBM)：',
      propTop: 'calcVolume',
      propBtm: 'warehousingTotalVolume',
      decimal: 2
    }, {
      label: '毛重小计(KG)：',
      propTop: 'calcWeight',
      propBtm: 'warehousingTotalWeight',
      decimal: 2
    }
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "报关方式",
      prop: "customsDeclarationType",
      minWidth: 100,
      showOverflowTooltip: true,
      basicType: "customsDeclarationType",
      customRow: true,
    },
    // {
    //   label: "货物编码",
    //   prop: "freightCode",
    //   minWidth: 100,
    //   showOverflowTooltip: true,
    // },
    {
      label: "件数",
      prop: "packNum",
      showOverflowTooltip: true,
      align: 'center',
      customRow: true,
      customHeader: true,
      minWidth: 100,
      decimal: 0
    },
    {
      label: "包装",
      prop: "packType",
      minWidth: 100,
      showOverflowTooltip: true,
      basicType: "packagingCode",
      // customRow: true
    },
    // {
    //   label: "长(CM)",
    //   prop: "length",
    //   align: 'right',
    //   // customRow: true,
    //   // customHeader: true,
    //   minWidth: 120,
    //   decimal: 1
    // },
    // {
    //   label: "宽(CM)",
    //   prop: "width",
    //   showOverflowTooltip: true,
    //   align: 'right',
    //   // customRow: true,
    //   // customHeader: true,
    //   minWidth: 120,
    //   decimal: 1
    // },
    // {
    //   label: "高(CM)",
    //   prop: "height",
    //   showOverflowTooltip: true,
    //   align: 'right',
    //   // customRow: true,
    //   // customHeader: true,
    //   minWidth: 120,
    //   decimal: 1
    // },
    {
      label: "体积小计(CBM)",
      prop: "totalVolume",
      showOverflowTooltip: true,
      customRow: true,
      minWidth: 130,
      align: 'right',
      decimal: 2
    },
    {
      label: "毛重小计(KG)",
      prop: "goodsTotalWeight",
      showOverflowTooltip: true,
      customRow: true,
      minWidth: 130,
      align: 'right',
      decimal: 2
    },
    {
      label: "唛头",
      prop: "sku",
      showOverflowTooltip: true,
      minWidth: 100
    },
    {
      label: "品名",
      prop: "productNameCn",
      showOverflowTooltip: true,
    },
    {
      label: "H S CODE",
      prop: "customsCode",
      minWidth: 100,
      showOverflowTooltip: true,
    },
  ]
}

export const lclPickGoodsInfo = {
  title: '提货信息',
  grossTotal: [{
    label: '提货件数：',
    prop: 'takeFreightNum',
    decimal: 0
  }, {
    label: '总毛重(KG)：',
    prop: 'totalWeight',
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
      label: "箱序号",
      prop: "freightCode",
      showOverflowTooltip: true,
    },
    {
      label: "提货件数",
      prop: "takeFreightNum",
      showOverflowTooltip: true,
      align: "center",
      decimal: 0
    },
    {
      label: "单件毛重(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      align: "right",
      render: (rows) => {
        return `${toFixedNum(rows.weight)}`
      }
    },
    {
      label: "总毛量(KG)",
      prop: "totalWeight",
      customRow: true,
      showOverflowTooltip: true,
      align: "right",
      render: (rows) => {
        return `${toFixedNum(rows.totalWeight)}`
      }
    },
  ]
}

