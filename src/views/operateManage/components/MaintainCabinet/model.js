export const config = {
  formLists: [{
    span: 8,
    id: "operationOrderNum",
    label: "业务号：",
    placeholder: "--",
    type: "txt"
  }],
  tableColumn: [//20220907修改，VGM核实简化,只需要展示与修改集装箱编号与密封条编号
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "柜型Size",
      prop: "boxSizeCode",
      customRow: true,
      showOverflowTooltip: true,
      width: 120
    },
    {
      label: "重量(KG)",
      prop: "weight",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: "体积(m³)",
      prop: "volume",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
      decimal: 2
    },
    {
      label: "箱号",
      prop: "ontainerSno",
      minWidth: 120,
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "封号",
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
    label: '重量(KG)：',
    prop: 'totalWeight',
    decimal: 2,
  }, {
    label: '体积(m³)：',
    prop: 'totalVolume',
    decimal: 2,
  }],
}

