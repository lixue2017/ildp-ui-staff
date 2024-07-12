const searchConfig = {
    lists: [
        {
            fieldList: [
                {
                    rows: [
                        {
                            cols: [
                                {
                                    span: 6,
                                    id: "payDate",
                                    label: "应收应付日期：",
                                    placeholder: "年/月",
                                    type: "month",
                                    valueFormat: "yyyy-MM",
                                    labelWidth: "105px"
                                },
                                {
                                    span: 4,
                                    id: "salesman",
                                    label: "业务员：",
                                    placeholder: "--",
                                    type: "txt"
                                },
                                {
                                    span: 4,
                                    id: "billTime",
                                    label: "账单日期：",
                                    placeholder: "--",
                                    type: "txt"
                                },
                                {
                                    span: 4,
                                    id: "operator",
                                    label: "制单人：",
                                    placeholder: "--",
                                    type: "txt"
                                },
                                {
                                    span: 4,
                                    id: "createTime",
                                    label: "制单日期：",
                                    placeholder: "--",
                                    type: "txt"
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    ]
}

const businessMonthTable = {
    grossTotal: [
        {
            label: '总RMB：',
            prop: 'weight',
        },
        {
            label: '总USD：',
            prop: 'usd',
        },
        {
            label: '总HKD：',
            prop: 'hkd',
        },
        {
            label: '总EUR：',
            prop: 'eur',
        },
        {
            label: '总GBP：',
            prop: 'gbp',
        }
    ],
    columns: [
        {
            prop: "wldw",
            label: "往来单位",
            customRow: true,
            minWidth: 120,
            showOverflowTooltip: true,
            sortable: true
        },
        {
            prop: "dsdh",
            label: "电商订单号",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 120
        },
        {
            prop: "ysrq",
            label: "应收应付日期",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 120
        },
        {
            prop: "gzh",
            label: "工作号",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 120
        },
        {
            prop: "weight",
            label: "RMB",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 100,
            decimal: 2,
            align: "right"
        },
        {
            prop: "usd",
            label: "USD",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 100,
            decimal: 2,
            align: "right"
        },
        {
            prop: "hkd",
            label: "HKD",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 100,
            decimal: 2,
            align: "right"
        },
        {
            prop: "eur",
            label: "EUR",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 100,
            decimal: 2,
            align: "right"
        },
        {
            prop: "gbp",
            label: "GBP",
            showOverflowTooltip: true,
            sortable: true,
            minWidth: 100,
            decimal: 2,
            align: "right"
        }
    ]
}

export { searchConfig, businessMonthTable };
