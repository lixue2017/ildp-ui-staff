
export const chargeInfo = {
  title: '计费信息',
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      label: "类型",
      prop: "LX",
      basicType: "billType",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "费用名称",
      prop: "FYMC",
      showOverflowTooltip: true,
    },
    {
      label: "往来单位",
      prop: "WLDW",
      showOverflowTooltip: true,
    },
    {
      label: "币种",
      prop: "BZ",
      showOverflowTooltip: true,
    },
    {
      label: "金额",
      prop: "JE",
      showOverflowTooltip: true,
    },
    {
      label: "单价",
      prop: "DJ",
      showOverflowTooltip: true,
    },
    {
      label: "数量",
      prop: "SL",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "备注",
      prop: "BZD",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "创建人",
      prop: "CJR",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "状态",
      prop: "ZT",
      basicType: "soaStatus",
      showOverflowTooltip: true,
    },
    {
      label: "创建时间",
      prop: "CJSJ",
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



