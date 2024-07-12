export const config = {
  formLists: [{
    span: 8,
    id: "operationOrderNum",
    label: "工作单号：",
    placeholder: "--",
    type: "txt"
  }, {
    span: 8,
    id: "bailorPeople",
    label: "委托人：",
    placeholder: "--",
    type: "txt"
  }, {
    span: 8,
    id: "createTime",
    label: "下单时间：",
    placeholder: "--",
    type: "txt"
  }
  ],
  tableColumn: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      labelTop: "Shipment ID",
      labelBtm: "Reference ID",
      prop: "shipmentId",
      width: 100,
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true
    },
    // {
    //   label: "ShipmentId",
    //   prop: "shipmentId",
    //   showOverflowTooltip: true,
    //   width: 100
    // },
    // {
    //   label: "ReferenceId",
    //   prop: "referenceId",
    //   showOverflowTooltip: true,
    //   width: 100
    // },
    {
      label: "件数",
      prop: "boxCount",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 0
    },
    {
      label: " 长(CM)",
      prop: "boxLength",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1
    },
    {
      label: "宽(CM)",
      prop: "boxWidth",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1
    },
    {
      label: "高(CM)",
      prop: "boxHeight",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1
    },
    {
      label: "单件毛重(KG)",
      prop: "boxWeight",
      minWidth: 100,
      showOverflowTooltip: true,
      customRow: true,
      align: "right"
    },
    {
      label: "单件体积CBM",
      prop: "boxVolume",
      minWidth: 100,
      showOverflowTooltip: true,
      customRow: true,
      align: "right"
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: 'right',
      width: '120px'
    },
  ],
  CTTableColumn: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      labelTop: "包装",
      labelBtm: "唛头",
      prop: "sku",
      width: 100,
      customRow: true,
      customHeader: true,
      basicType: "packagingCode",
      basicTypeVal: "packType",
      showOverflowTooltip: true
    },
    {
      label: "件数",
      prop: "boxCount",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 0,
      width: 80
    },
    {
      label: " 长(CM)",
      prop: "boxLength",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1
    },
    {
      label: "宽(CM)",
      prop: "boxWidth",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1
    },
    {
      label: "高(CM)",
      prop: "boxHeight",
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 1
    },
    {
      label: "单件毛重(KG)",
      prop: "boxWeight",
      minWidth: 100,
      showOverflowTooltip: true,
      customRow: true,
      align: "right",
      decimal: 2
    },
    {
      label: "单件体积CBM",
      prop: "boxVolume",
      minWidth: 100,
      showOverflowTooltip: true,
      customRow: true,
      align: "right"
    },
    {
      labelTop: "品名(EN)",
      labelBtm: "HSCODE(海关编码)",
      prop: "code",
      customRow: true,
      customHeader: true,
      showOverflowTooltip: true,
      minWidth: 120
    },
    {
      label: "操作",
      prop: "operation",
      customRow: true,
      fixed: 'right',
      width: '120px'
    },
  ],
  grossTotal: [{
    label: '目的地：',
    prop: 'consigneeCount',
    util: '个',
    hideDiffMark: true
  }, {
    label: '合计箱数：',
    prop: 'totalBoxCount',
    propVery: 'warehousingTotalBoxNum',
    decimal: 0
  }, {
    label: '总毛重(KG)：',
    prop: 'totalWeight',
    propVery: 'warehousingTotalWeight',
    decimal: 1
  }, {
    label: '总体积(CBM)：',
    prop: 'totalVolume',
    propVery: 'warehousingTotalVolume',
    decimal: 3
  }],
}
