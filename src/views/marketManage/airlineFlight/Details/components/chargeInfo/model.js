
export const chargeInfo = {
  columns: [
    {
      type: "index",
      width: 50,
      align: "center",
    },
    {
      prop: "orderNum",
      label: "关联SONO",
      width: 150,
      showOverflowTooltip: true
    },
    {
      label: "费用名称",
      prop: "costName",
      showOverflowTooltip: true,
    },
    {
      label: "类型",
      prop: "type",
      basicType: "billType",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "往来单位",
      prop: "dealingsCompanyName",
      showOverflowTooltip: true,
    },
    {
      label: "币种",
      prop: "currency",
      showOverflowTooltip: true,
    },
    {
      label: "折合金额",
      prop: "totalMoney",
      showOverflowTooltip: true,
    },
    {
      label: "状态",
      prop: "isGenerateStatement",
      basicType: "soaStatus",
      showOverflowTooltip: true,
    },
    {
      label: "锁单",
      prop: "lockOrder",
      customRow: true,
      showOverflowTooltip: true,
    },
    {
      label: "创建人",
      prop: "createBy",
      minWidth: 100,
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




