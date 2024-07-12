const cardConfig = [
  // {
  //     bgColor: '#ECF3FF',
  //     icon: 'icon-yunshu',
  //     type: 'slot',
  //     // prop: 'addr',
  //     labelColor: '#5094FF',
  //     valueColor: '#5094FF'
  // },
  {
    bgColor: '#FFF3EC',
    valueColor: '#FF985C',
    labelArr: ['工作单号：', '关联业务：'],
    valueArr: ['orderNum', 'businessType']
  },
  {
    bgColor: '#ECF3FF',
    valueColor: '#5094FF',
    labelArr: ['记账主体：', '所属公司：'],
    valueArr: ['billingMainName', 'dept']
  },
  {
    bgColor: '#ECF3FF',
    valueColor: '#5094FF',
    labelArr: ['已对账应收：', '已对账应付：'],
    valueArr: ['accountAR', 'accountAP'],
    valueNumArr: ['accountARNum', 'accountAPNum']
  },
  {
    bgColor: '#FFF3EC',
    valueColor: '#FF985C',
    labelArr: ['未对账应收：', '未对账应付：'],
    valueArr: ['unAccountAR', 'unAccountAP'],
    valueNumArr: ['unAccountARNum', 'unAccountAPNum']
  }
]

const basicInfoConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "consignor",
                  label: "委托人：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "salesman",
                  label: "销售员：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "company",
                  label: "所属公司：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "operator",
                  label: "操作员：",
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

export { cardConfig, basicInfoConfig };
