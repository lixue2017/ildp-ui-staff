import { toFixedNum } from '@/utils/instructions'
export const goodsTable = (isCabinet) => ({
  title: '核实货物信息',
  // btnRight: [{
  //   text: "维护货物信息",
  //   key: 1
  // }],
  grossTotal: [{
    label: '箱数：',
    prop: isCabinet ? 'quantity' : 'warehousingQuantity',
    decimal: 0
  }, {
    label: '产品数小计：',
    prop: 'totalProductCount',
    decimal: 0
  }, {
    label: '体积：',
    prop: isCabinet ? 'totalVolume' : 'warehousingTotalVolume',
    decimal: 2
  }, {
    label: '毛重：',
    prop: isCabinet ? 'totalWeight' : 'warehousingTotalWeight',
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
    propBtm: 'calcWarehousingBoxNum',
    decimal: 0
  }, {
    label: '体积：',
    propTop: 'calcVolume',
    propBtm: 'calcWarehousingTotalVolume',
    decimal: 2
  }, {
    label: '毛重：',
    propTop: 'calcWeight',
    propBtm: 'calcWarehousingTotalWeight',
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

