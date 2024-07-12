
export const chargeInfo = {
  title: '计费信息',
  columns: [
    {
      type: 'selection',
      width: 60,
      align: "center",
      fixed: 'left'
    },
    {
      label: "类型",
      prop: "type",
      basicType: "billType",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "费用名称",
      prop: "costName",
      showOverflowTooltip: true,
    },
    {
      label: "往来单位",
      prop: "dealingsCompanyName",
      width:120,
      showOverflowTooltip: true,
    },
    {
      label: "币种",
      prop: "currency",
      showOverflowTooltip: true,
    },
    {
      label: "金额",
      prop: "totalMoney",
      showOverflowTooltip: true,
      align: "right"
    },
    {
      label: "单价",
      prop: "unitPrice",
      showOverflowTooltip: true,
      align: "right"
    },
    {
      label: "数量",
      prop: "num",
      showOverflowTooltip: true,
      align: "right"
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "创建人",
      prop: "createBy",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "状态",
      prop: "isGenerateStatement",
      basicType: "soaStatus",
      showOverflowTooltip: true,
    },
    {
      label: "创建时间",
      prop: "createTime",
      showOverflowTooltip: true,
    },
    {
      label: "操作",
      prop: "operation",
      width: 150,
      customRow: true,
      showOverflowTooltip: true,
    }
  ]
}



