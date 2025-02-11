// export const tableColumns = [
//   {
//     type: "index",
//     width: 50,
//     align: "center"
//   },
//   {
//     prop: "operationOrderNum",
//     label: "工作单号",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "freightType",
//     label: "装箱方式",
//     basicType: "freightType",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "exportType",
//     label: "类型",
//     basicType: "importExportType",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "proxyType",
//     label: "运输代理",
//     basicType: "navigationAgent",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "shipCompany",
//     label: "航空/船公司",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "nameCn",
//     label: "目的国",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "startPort",
//     label: "装货港",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "endPort",
//     label: "卸货港",
//     showOverflowTooltip: true,
//   },
//   {
//     prop: "reachTime",
//     label: "到港时间",
//     showOverflowTooltip: true,
//   }]



export const tableColumns = {
  0: [
    //   {
    //   type: "index",
    //   width: 50,
    //   align: "center"
    // },
    {
      type: "slot",
      width: 50,
      align: "center",
      customRow: true,
      prop: "rowChoice"
    },
    {
      prop: "operationOrderNum",
      label: "工作单号",
      width: 120,
      showOverflowTooltip: true,
    },
    {
      prop: "freightType",
      label: "装箱方式",
      basicType: "freightType",
      showOverflowTooltip: true,
    },
    {
      prop: "exportType",
      label: "类型",
      basicType: "importExportType",
      showOverflowTooltip: true,
    },
    {
      prop: "proxyType",
      label: "运输代理",
      basicType: "navigationAgent",
      showOverflowTooltip: true,
    },
    {
      prop: "shipCompany",
      label: "航空/船公司",
      width: 130,
      showOverflowTooltip: true,
    },
    {
      prop: "nameCn",
      label: "目的国",
      width: 150,
      showOverflowTooltip: true,
    },
    {
      prop: "startPort",
      label: "装货港",
      showOverflowTooltip: true,
    },
    {
      prop: "endPort",
      label: "卸货港",
      showOverflowTooltip: true,
    },
    {
      prop: "reachTime",
      label: "到港时间",
      showOverflowTooltip: true,
    }],
  1: [{
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "operationOrderNum",
    label: "工作单号",
    showOverflowTooltip: true,
  },
  {
    prop: "sortBoxCode",
    label: "整柜批次号",
    showOverflowTooltip: true,
  },
  {
    prop: "freightType",
    label: "装箱方式",
    basicType: "freightType",
    showOverflowTooltip: true,
  },
  {
    prop: "exportType",
    label: "类型",
    basicType: "importExportType",
    showOverflowTooltip: true,
  },
  {
    prop: "proxyType",
    label: "运输代理",
    basicType: "navigationAgent",
    showOverflowTooltip: true,
  },
  {
    prop: "shipCompany",
    label: "航空/船公司",
    showOverflowTooltip: true,
  },
  {
    prop: "nameCn",
    label: "目的国",
    showOverflowTooltip: true,
  },
  {
    prop: "startPort",
    label: "装货港",
    showOverflowTooltip: true,
  },
  {
    prop: "endPort",
    label: "卸货港",
    showOverflowTooltip: true,
  },
  {
    prop: "reachTime",
    label: "到港时间",
    // fixed: "right",
    showOverflowTooltip: true,
  }]
}
// }
  // export const modelData = [
  //   //接口未出，测试滚动刷新专用数据
  //   {
  //     id: 1,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 2,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 3,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },     {
  //     id: 4,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 5,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 6,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },     {
  //     id: 7,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 8,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 9,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },     {
  //     id: 10,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 11,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  //   {
  //     id: 12,
  //     CZDH: "111",
  //     ZXFS: "111",
  //     LX: "123",
  //     YSDL: "123",
  //     CGS: "123",
  //     MDG: "123",
  //     ZHG: "123",
  //     XHG: "123",
  //     DGSJ: "123",
  //   },
  // ]
