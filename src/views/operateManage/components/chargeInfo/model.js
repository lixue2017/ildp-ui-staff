

export const formConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 4,
                  id: "platform",
                  label: "应付：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 4,
                  id: "custNo",
                  label: " 实付：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 4,
                  id: "skl",
                  label: "付款率：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 4,
                  id: "ys",
                  label: "应收：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 4,
                  id: "ss",
                  label: "实收：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 4,
                  id: "skl",
                  label: "收款率：",
                  placeholder: "--",
                  type: "txt"
                },
              ],
            },
          ],
        }
      ],
    }
  ]
}
export const chargeInfo = {
  title: '计费信息',
  columns: [
    // {
    //   type: "index",
    //   width: 50,
    //   align: "center",
    //   // fixed: "left",
    // },
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
      width: 60,
      customRow: true,
      showOverflowTooltip: true,
      fixed: "left",
    },
    {
      label: "往来单位",
      prop: "dealingsCompanyName",
      width: 150,
      showOverflowTooltip: true,
      fixed: 'left'
    },
    {
      label: "费用名称",
      prop: "costName",
      width: 150,
      showOverflowTooltip: true,
      fixed: 'left'
    },
    {
      label: "币种",
      prop: "currency",
      width: 80,
      showOverflowTooltip: true,
    },
    {
      label: "单价",
      prop: "unitPrice",
      showOverflowTooltip: true,
    },
    {
      label: "数量",
      prop: "num",
      minWidth: 100,
      showOverflowTooltip: true,
    },
    {
      label: "金额",
      prop: "totalMoney",
      width: 80,
      showOverflowTooltip: true,
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
      minWidth: 120
    },
    {
      label: "操作",
      prop: "operation",
      width: 150,
      customRow: true,
      showOverflowTooltip: true,
      fixed: "right",
    }
  ]
}



