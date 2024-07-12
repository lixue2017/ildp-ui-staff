// const cardConfig = [
//     {
//         bgColor: '#ECF3FF',
//         type: 'slot',
//         prop: 'orderNo',
//         valueColor: '#5094FF'
//     }
// ]
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
    bgColor: "#FFF3EC",
    valueColor: "#FF985C",
    labelArr: ["往来单位："],
    valueArr: ["dealingsCompanyName", "settleCycle"],
  },
  {
    bgColor: "#ECF3FF",
    valueColor: "#5094FF",
    labelArr: ["记账主体：", "所属公司："],
    valueArr: ["billingMainName", "dept"],
  },
  {
    bgColor: "#ECF3FF",
    valueColor: "#5094FF",
    labelArr: ["已对账应收：", "已对账应付："],
    valueArr: ["accountAR", "accountAP"],
    valueNumArr: ["accountARNum", "accountAPNum"],
  },
  {
    bgColor: "#FFF3EC",
    valueColor: "#FF985C",
    labelArr: ["未对账应收：", "未对账应付："],
    valueArr: ["unAccountAR", "unAccountAP"],
    valueNumArr: ["unAccountARNum", "unAccountAPNum"],
  },
];

const basicInfoConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 8,
                  id: "currency",
                  label: "币别：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "bhl",
                  label: "本位币汇率：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "pporcc",
                  label: "PPORCC：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "sl",
                  label: "税率(%)：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "fzhl",
                  label: "辅助币汇率：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "settleWay",
                  label: "结算方式：",
                  placeholder: "--",
                  type: "txt",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const leftTableColumns = [
  {
    type: "selection",
    align: "center",
    width: 50,
    // type: "index",
    // width: 30,
    // align: "center"
  },
  {
    prop: "orderNum",
    label: "单号",
    showOverflowTooltip: true,
    width: 130,
  },
  {
    prop: "businessTypeName",
    label: "类型",
    showOverflowTooltip: true,
    width: 80,
  },
  {
    prop: "dealingsCompanyName",
    label: "客户信息",
    showOverflowTooltip: true,
    width: 100,
  },
];

export { cardConfig, basicInfoConfig };
