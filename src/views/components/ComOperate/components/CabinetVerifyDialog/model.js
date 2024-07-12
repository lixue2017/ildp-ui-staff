export const config = {
  formLists: [{
    span: 8,
    id: "operationOrderNum",
    label: "业务号：",
    placeholder: "--",
    type: "txt"
  }],
  // tableColumn: [
  //   {
  //     type: "index",
  //     width: 50,
  //     align: "center",
  //   },
  //   {
  //     label: "柜型Size",
  //     prop: "size",
  //     customRow: true,
  //     showOverflowTooltip: true,
  //     width: 120
  //   },
  //   {
  //     labelTop: "数量",
  //     labelBtm: "VGM数量",
  //     prop: "count",
  //     customRow: true,
  //     customHeader: true,
  //     showOverflowTooltip: true,
  //     width: 120,
  //     decimal: 0,
  //     align: 'right'
  //   },
  //   {
  //     labelTop: "重量KG",
  //     labelBtm: "VGM重量",
  //     prop: "weight",
  //     customRow: true,
  //     customHeader: true,
  //     showOverflowTooltip: true,
  //     width: 120,
  //     decimal: 2,
  //     align: 'right'
  //   },
  //   {
  //     labelTop: "集装箱编号",
  //     labelBtm: "密封条编号",
  //     prop: "number",
  //     customRow: true,
  //     customHeader: true,
  //     showOverflowTooltip: true,
  //   },
  //   {
  //     labelTop: "品名",
  //     labelBtm: "海关编码",
  //     prop: "code",
  //     customRow: true,
  //     customHeader: true,
  //     showOverflowTooltip: true,
  //   },
  //   {
  //     label: "操作",
  //     prop: "operation",
  //     customRow: true,
  //     fixed: 'right',
  //     width: '120px'
  //   },
  // ],
  tableColumn: [//20220907修改，VGM核实简化,只需要展示与修改集装箱编号与密封条编号
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "柜型Size",
      prop: "size",
      customRow: true,
      showOverflowTooltip: true,
      width: 120
    },
    // {
    //   label: "集装箱编号",
    //   prop: "warehousingContainerSno",
    //   minWidth: 120,
    //   customRow: true,
    //   showOverflowTooltip: true,
    // },
    // {
    //   label: "密封条编号",
    //   prop: "warehousingSealingStripSno",
    //   minWidth: 120,
    //   customRow: true,
    //   showOverflowTooltip: true,
    // },
    {
      label: "集装箱编号",
      prop: "ontainerSno",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "密封条编号",
      prop: "sealingStripSno",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
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
    labelTop: '数量：',
    labelBtm: '数量VGM：',
    propTop: 'totalBoxCount',
    propBtm: 'warehousingTotalBoxCount',
    decimal: 0,
  }, {
    labelTop: '总重量KG：',
    labelBtm: '总重量VGM：',
    propTop: 'totalWeight',
    propBtm: 'warehousingTotalWeight',
    decimal: 2,
  }],
}

