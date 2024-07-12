

const basicInfoConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                // {
                //   span: 12,
                //   id: "serialCode",
                //   label: "付款任务单：",
                //   type: "txt"
                // },
                {
                  span: 12,
                  id: "businessCompanyName",
                  label: "收款公司：",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "dealingsCompanyName",
                  label: "往来单位：",
                  type: "txt"
                },
                {
                  span: 12,
                  id: 'latestPaymentDate',
                  label: '交易时间：',
                  type: 'txt'
                },
                {
                  span: 12,
                  id: "methodOfSettle",
                  label: "结算方式：",
                  basicType: "accountCycle",
                  type: "txt"
                },
                {
                  span: 24,
                  id: "methodOfPayment",
                  label: "收付款方式：",
                  basicType: "RVPType",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "statementsCode",
                  label: "来源对账单：",
                  type: "txt",
                  txtTagArr: [{
                    fontTagColor: true,
                    bgTagColor: true,
                    basicType: 'billType',
                    basicTypeVal: "type",
                  }]
                },
                {
                  span: 12,
                  id: "slotRelevance",
                  label: "关联付款单号：",
                  type: "slot"
                },
              ],
            },
          ],
        },
      ],
    }
  ],
}


const processRecords = [
  {
    rLabel: "对账单",
    rName: "业务员：",
    rKey: "billCheckByName",
    rStatus:[55,65,80,100]
  },
  {
    rLabel: "水单认领",
    rName: "认领人：",
    rKey: "generalCashierName",
    rStatus:[65,80,100]
  },
  {
    rLabel: "收款确认",
    rName: "确认人：",
    rKey: "cashierByName",
    rStatus:[80,100]
  },
  {
    rLabel: "收款核销",
    rName: "核销人：",
    rKey: "verificationByName",
    rStatus:[100]
  },
]


export { basicInfoConfig, processRecords };
