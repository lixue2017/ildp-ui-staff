export const config = {
  formLists: [{
    span: 6,
    id: "code",
    label: "航线代码：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "nameCn",
    label: "航线名称(CN)：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "nameEn",
    label: "航线名称(EN)：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "isPublic",
    label: "是否公共：",
    placeholder: "--",
    type: "slot",
  },
  {
    span: 6,
    id: "lineType",
    label: "航线类型：",
    placeholder: "--",
    type: "slot",
    basicType: "transportMode",
    basicTypeVal: "lineType",
  },
  {
    span: 6,
    id: "remark",
    label: "备注：",
    placeholder: "--",
    type: "txt",
  }],
  leftTableColumns: {
    tag: {
      prop: "routeProxy",
      basicType: "clientIdentity",
      basicTypeVal: "routeProxy",
    },
    top: [{
      prop: "code",
      width: 50
    },
    {
      prop: "name",
      width: 70,
      render: (row) => {
        return `${row.nameCn || '--'}/${row.nameEn || '--'}`
      }
    },
    {
      prop: "status",
      basicType: "status",
      basicTypeVal: "status",
      type: 'slot',
    }],
    bottom: [{
      render: (row) => {
        const arr = []
        if (row.startPort) {
          arr.push(row.startPort)
        }
        if (row.transfer) {
          arr.push(row.transfer)
        }
        if (row.endPort) {
          arr.push(row.endPort)
        }
        return arr.join(' -> ')
      }
    }]
  },
  tableColumns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "类型",
      prop: "lineType",
      showOverflowTooltip: true,
      basicType: "transportMode",
      basicTypeVal: "lineType",
    },
    {
      label: "订舱代理",
      prop: "cabinProxy",
      showOverflowTooltip: true,
    },
    {
      label: "船名",
      prop: "flightName",
      showOverflowTooltip: true,
    },
    {
      label: "航次",
      prop: "name",
      showOverflowTooltip: true,
    },
    {
      label: "开航期",
      prop: "sailOpenTime",
      showOverflowTooltip: true,
    },
    {
      label: "开舱日期",
      prop: "cabinOpenTime",
      showOverflowTooltip: true,
    },
    {
      label: "截关日期",
      prop: "cutGateTime",
      showOverflowTooltip: true,
    },
    {
      label: "状态",
      prop: "status",
      showOverflowTooltip: true,
      customRow: true,
      basicType: "navigationStatus",
      basicTypeVal: "status",
      fixed: 'right',
    }]
}