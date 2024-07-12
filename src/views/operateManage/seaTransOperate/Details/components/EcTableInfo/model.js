
export const goodsTable = (isCabinet) => ({
  title: '核实货物信息',
  btnRight: [
    {
      text: "维护货物信息",
      key: 1
    }
  ],
  grossTotal: [
    {
      label: '箱数：',
      prop: isCabinet ? 'quantity' : 'warehousingQuantity',
      decimal: 0
    },
    {
      label: '产品数小计：',
      prop: 'totalProductCount',
      decimal: 0
    },
    {
      label: '体积：',
      prop: isCabinet ? 'totalVolume' : 'warehousingTotalVolume',
      decimal: 2,
      util: "CBM"
    },
    {
      label: '毛重：',
      prop: isCabinet ? 'totalWeight' : 'warehousingTotalWeight',
      decimal: 2,
      util: "KG"
    }
  ],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    }, {
      label: "Shipment ID",
      prop: "shipmentId",
      showOverflowTooltip: true,
      minWidth: 100,
      customRow: true,
    },
    {
      label: "Reference ID",
      prop: "referenceId",
      showOverflowTooltip: true,
      minWidth: 100,
    },
    {
      label: "箱号",
      prop: "boxNumber",
      showOverflowTooltip: true,
      // customRow: true,
      minWidth: 120
    },
    {
      label: "箱数",
      prop: "warehousingQuantity",
      align: 'right',
      // customRow: true,
      showOverflowTooltip: true,
      minWidth: 120,
      decimal: 0,
      render: (row) => {
        return isCabinet ? row.quantity : row.warehousingQuantity
      }
    },
    {
      label: "产品数小计",
      prop: "totalProductCount",
      showOverflowTooltip: true,
      // customRow: true,
      minWidth: 120
    },
    {
      label: "长*宽*高/CM",
      prop: "boxSize",
      showOverflowTooltip: true,
      // customRow: true,
      minWidth: 120,
      render: (row) => {
        let txt = `${row.warehousingLength || 0}*${row.warehousingWidth || 0}*${row.warehousingHeight || 0}`
        if (isCabinet) {
          txt = `${row.length || 0}*${row.width || 0}*${row.height || 0}`
        }
        return txt
      }
    },
    {
      label: "体积小计(m³)",
      prop: "warehousingTotalVolume",
      align: 'right',
      showOverflowTooltip: true,
      minWidth: 130,
      render: (row) => {
        return isCabinet ? row.totalVolume : row.warehousingTotalVolume
      }
    },
    {
      label: "毛重小计(KG)",
      prop: "warehousingTotalWeight",
      align: 'right',
      showOverflowTooltip: true,
      minWidth: 130,
      render: (row) => {
        return isCabinet ? row.totalWeight : row.warehousingTotalWeight
      }
    },
    {
      label: "目的地",
      prop: "warehouseCode",
      showOverflowTooltip: true,
      minWidth: 120,
      render: (row) => {
        return `${row.warehouseCode || '--'}/${row.warehouseName || '--'}`
      }
      // basicType: "platformType",
      // basicTypeVal: "platformType",
      // render: (row, name) => {
      //   return `${row.warehouseCode || '--'}/${name || '--'}`
      // }
    },
  ]
})

export const predictionGoodsTable = {
  title: '预报货物信息',
  grossTotal: [{
    label: '箱数：',
    propTop: 'calcBoxCount',
    propBtm: 'warehousingQuantity',
    decimal: 0
  }, {
    label: '体积：',
    propTop: 'calcVolume',
    propBtm: 'warehousingTotalVolume',
    decimal: 2
  }, {
    label: '毛重：',
    propTop: 'calcWeight',
    propBtm: 'warehousingTotalWeight',
    decimal: 2
  }],
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    }, {
      label: "Shipment ID",
      prop: "shipmentId",
      showOverflowTooltip: true,
      minWidth: 100,
      customRow: true,
    },
    {
      label: "Reference ID",
      prop: "referenceId",
      showOverflowTooltip: true,
      minWidth: 100,
    },
    {
      label: "箱号",
      prop: "boxNumber",
      showOverflowTooltip: true,
      minWidth: 120
    },
    {
      label: "箱数",
      prop: "boxCount",
      align: 'right',
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 120,
      decimal: 0
    },
    {
      label: "长*宽*高/CM",
      prop: "boxSize",
      showOverflowTooltip: true,
      // customRow: true,
      minWidth: 120,
      render: (row) => {
        return `${row.boxLength || 0}*${row.boxWidth || 0}*${row.boxHeight || 0}`
      }
    },
    {
      label: "体积小计(m³)",
      prop: "totalVolume",
      align: 'right',
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 130
    },
    {
      label: "毛重小计(KG)",
      prop: "totalWeight",
      align: 'right',
      customRow: true,
      showOverflowTooltip: true,
      minWidth: 130
    },
    {
      label: "目的地",
      prop: "warehouseCode",
      showOverflowTooltip: true,
      minWidth: 120,
      // basicType: "platformType",
      // basicTypeVal: "platformType",
      render: (row, name) => {
        return `${row.consigneeWarehouseCode || '--'}/${row.warehouseName || '--'}`
      }
    },
  ]
}

// export const predictionGoodsTable = {
//   title: '预报货物信息',
//   grossTotal: [{
//     label: '箱数：',
//     propTop: 'quantity',
//     propBtm: 'warehousingQuantity',
//     decimal: 0
//   }, {
//     label: '体积：',
//     propTop: 'totalVolume',
//     propBtm: 'warehousingTotalVolume',
//     decimal: 2
//   }, {
//     label: '毛重：',
//     propTop: 'totalWeight',
//     propBtm: 'warehousingTotalWeight',
//     decimal: 2
//   }],
//   columns: [
//     {
//       type: "index",
//       width: 50,
//       align: "center",
//     }, {
//       label: "ShipmentId",
//       prop: "shipmentId",
//       showOverflowTooltip: true,
//       minWidth: 100,
//       customRow: true,
//     },
//     {
//       label: "ReferenceId",
//       prop: "referenceId",
//       showOverflowTooltip: true,
//       minWidth: 100,
//     },
//     {
//       label: "箱号",
//       prop: "boxNumber",
//       showOverflowTooltip: true,
//       minWidth: 120
//     },
//     {
//       label: "箱数",
//       prop: "quantity",
//       align: 'right',
//       customRow: true,
//       showOverflowTooltip: true,
//       minWidth: 120,
//       decimal: 0
//     },
//     {
//       label: "长*宽*高/CM",
//       prop: "boxSize",
//       showOverflowTooltip: true,
//       // customRow: true,
//       minWidth: 120,
//       render: (row) => {
//         return `${row.length || 0}*${row.width || 0}*${row.height || 0}`
//       }
//     },
//     {
//       label: "体积小计(m³)",
//       prop: "totalVolume",
//       align: 'right',
//       customRow: true,
//       showOverflowTooltip: true,
//       minWidth: 130
//     },
//     {
//       label: "毛重小计(KG)",
//       prop: "totalWeight",
//       align: 'right',
//       customRow: true,
//       showOverflowTooltip: true,
//       minWidth: 130
//     },
//     {
//       label: "目的地",
//       prop: "warehouseCode",
//       showOverflowTooltip: true,
//       minWidth: 120,
//       // basicType: "platformType",
//       // basicTypeVal: "platformType",
//       // render: (row, name) => {
//       //   return `${row.warehouseCode || '--'}/${name || '--'}`
//       // }
//     },
//   ]
// }

export const cabinetTable = {
  title: '整柜信息',
  btnRight: [{
    text: "登记整柜集装箱",
    key: 0
  }],
  grossTotal: [
    {
      label: '重量(KG)：',
      prop: 'weight',
      decimal: 2
    },
    {
      label: '体积(CBM)：',
      prop: 'volume',
      decimal: 2
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
      prop: "boxSizeCode",
      showOverflowTooltip: true,
      customRow: true,
      width: 100
    },
    // {
    //   label: "柜量",
    //   prop: "boxCount",
    //   showOverflowTooltip: true,
    //   customRow: true,
    //   decimal: 0,
    //   align: 'right',
    //   minWidth: 100
    // },
    {
      label: "重量(KG)",
      prop: "weight",
      showOverflowTooltip: true,
      decimal: 2,
      minWidth: 120,
      // customRow: true,
      align: 'right'
    },
    {
      label: "体积(CBM)",
      prop: "volume",
      showOverflowTooltip: true,
      decimal: 2,
      minWidth: 120,
      align: 'right'
    },
    // {
    //   label: "重量小计(KG)",
    //   prop: "subtotalWeight",
    //   showOverflowTooltip: true,
    //   decimal: 2,
    //   minWidth: 120,
    //   customRow: true,
    //   align: 'right'
    // },
    {
      label: "集装箱编号",
      prop: "ontainerSno",
      minWidth: 120,
      showOverflowTooltip: true,
    },
    {
      label: "密封条编号",
      prop: "sealingStripSno",
      minWidth: 120,
      showOverflowTooltip: true,
    },
    // {
    //   label: "品名",
    //   prop: "warehousingProductName",
    //   showOverflowTooltip: true
    // },
    // {
    //   label: "海关编码",
    //   prop: "customsCode",
    //   minWidth: 100,
    //   showOverflowTooltip: true
    // },
    {
      label: "SO No.",
      prop: "sono",
      minWidth: 120,
      showOverflowTooltip: true,
    }
  ]
}

export const pickTable = {
  title: '提货信息',
  grossTotal: [
    {
      label: '合计箱数：',
      prop: 'takeBoxCount'
    },
    {
      label: '总重量：',
      prop: 'totalWeight'
    },
    {
      label: '总体积：',
      prop: 'totalVolume'
    }
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
      showOverflowTooltip: true,
    },
    {
      label: "FBA箱号",
      prop: "boxNumber",
      showOverflowTooltip: true,
    },
    {
      label: " 提货箱数",
      prop: "takeBoxCount",
      showOverflowTooltip: true,
    },
    {
      label: "总毛重(KG)",
      prop: "totalWeight",
      showOverflowTooltip: true,
    },
    {
      label: "总体积m³",
      prop: "totalVolume",
      showOverflowTooltip: true,
    },
  ]
}

export const productTable = {
  title: '产品信息',
  grossTotal: [
    //   {
    //   label: '产品总类：',
    //   prop: 'singleBoxNum'
    // },
    {
      label: '产品总数：',
      prop: 'singleBoxNum',
      decimal: 0
    }],
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
      showOverflowTooltip: true,
    },
    {
      labelTop: '唛头',
      labelBottom: '名称',
      prop: "sku",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
      minWidth: 80
    },
    {
      labelTop: 'HS CODE',
      labelBottom: 'ASIN',
      prop: "code",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    },
    {
      labelTop: '产品毛量(KG)',
      labelBottom: '产品净重(KG)',
      prop: "weight",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    },
    {
      labelTop: '申报价格',
      labelBottom: '数量',
      prop: "declaredValue",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    },
    {
      labelTop: '型号',
      labelBottom: '品牌',
      prop: "productModel",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    },
    {
      labelTop: '产品成分',
      labelBottom: '产品用途',
      prop: "businessUse",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
      width: 90
    },
    {
      labelTop: 'Shipment ID',
      labelBottom: 'Reference ID',
      prop: "shipmentId",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
    }
  ]
}
