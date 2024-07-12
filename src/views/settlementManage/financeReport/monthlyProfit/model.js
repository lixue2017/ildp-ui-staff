export const searchColumns = [
  {
    span: 8,
    id: "beginTime",
    label: "统计月份：",
    placeholder: "年/月",
    type: "month",
    valueFormat: "yyyy-MM"
  }
];

export const tableColumns = [
  {
    prop: "gzh",
    label: "工作号",
    width: 120,
    showOverflowTooltip: true,
    sortable: true
  },
  {
    prop: "dsddh",
    label: "电商订单号",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120
  },
  {
    prop: "ywy",
    label: "业务员",
    showOverflowTooltip: true,
    width: 100,
    sortable: true,
    minWidth: 100
  },
  {
    prop: "khmc",
    label: "客户名称",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100
  },
  {
    prop: "khrq",
    label: "开航日期",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    className: "border-right"
  },
  {
    prop: "ys",
    label: "应收",
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
        sortable: true
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
        sortable: true
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
        sortable: true
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
        sortable: true
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
        sortable: true,
        className: "border-right"
      }
    ]
  },
  {
    prop: "yf",
    label: "应付",
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
        sortable: true
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
        sortable: true
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
        sortable: true
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
        sortable: true
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
        sortable: true,
        className: "border-right"
      }
    ]
  },
  {
    prop: "lr",
    label: "利润",
    multiHeader: true,
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
        sortable: true
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
        sortable: true
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
        sortable: true
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
        sortable: true
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
        sortable: true
      },
      {
        label: '折RMB',
        prop: 'zRmb',
        width: 80,
        sortable: true
      },
      {
        label: '折USD',
        prop: 'zUsd',
        width: 80,
        sortable: true
      },
    ]
  }
]

export const subtotalTableColumns = [
  {
    prop: "operationOrderNum",
    label: "工作号",
    width: 120,
    customRow: true,
    showOverflowTooltip: true,
  },
  {
    prop: "dsddh",
    label: "电商订单号",
    showOverflowTooltip: true,
    customRow: true,
    minWidth: 120
  },
  {
    prop: "ywy",
    label: "业务员",
    showOverflowTooltip: true,
    customRow: true,
    minWidth: 100
  },
  {
    prop: "khmc",
    label: "客户名称",
    showOverflowTooltip: true,
    customRow: true,
    minWidth: 100
  },
  {
    prop: "khrq",
    label: "开航日期",
    showOverflowTooltip: true,
    customRow: true,
    minWidth: 100,
    className: "border-right",
  },
  {
    prop: "ys",
    label: "应收",
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
        className: "border-right",
      }
    ]
  },
  {
    prop: "yf",
    label: "应付",
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
        className: "border-right",
      }
    ]
  },
  {
    prop: "lr",
    label: "利润",
    multiHeader: true,
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
      },
      {
        label: '折RMB',
        prop: 'zRmb',
        width: 80,
      },
      {
        label: '折USD',
        prop: 'zUsd',
        width: 80,
      },
    ]
  }
]

export const businessMonthFee = [
  {
    prop: "lrxj",
    label: "利润小计",
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
        showOverflowTooltip: true,
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
        className: "border-right",
      }
    ]
  },
  {
    prop: "lr",
    label: "换算成人民币小计",
    multiHeader: true,
    className: "border-right",
    list: [
      {
        label: 'RMB',
        prop: 'rmb',
        width: 80,
        showOverflowTooltip: true,
      },
      {
        label: 'USD',
        prop: 'usd',
        width: 80,
      },
      {
        label: 'HKD',
        prop: 'hkd',
        width: 80,
      },
      {
        label: 'EUR',
        prop: 'eur',
        width: 80,
      },
      {
        label: 'GBP',
        prop: 'gbp',
        width: 80,
        className: "border-right",
      },
    ]
  },
  {
    label: '汇差',
    prop: 'hc',
  },
  {
    labelTop: '人民币',
    labelBtm: '总计',
    prop: 'total',
    customHeader: true,
  },
  {
    labelTop: '基本任务',
    labelBtm: '7000',
    prop: 'basicTask',
    customHeader: true,
  },
  {
    labelTop: '7001-2W',
    labelBtm: '业务费用',
    prop: 'businessExpenses',
    customHeader: true,
  },
  {
    labelTop: '超过2W',
    labelBtm: '部分业务费用',
    prop: 'exceedBusiness',
    customHeader: true,
  },
  {
    labelTop: '总计',
    labelBtm: '业务费用',
    prop: 'totalBusiness',
    customHeader: true,
  },
]