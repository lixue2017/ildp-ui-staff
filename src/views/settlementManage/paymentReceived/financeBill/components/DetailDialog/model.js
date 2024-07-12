export const config = {
  lists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "billingMainName",
                  label: "计费主体：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "type",
                  label: "应收应付：",
                  type: "radio",
                  basicType: 'billType',
                  disable: true
                },
                {
                  span: 12,
                  id: "dealingsCompany",
                  label: "往来单位：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "costName",
                  label: "费用名称：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "prepaidCollect",
                  label: "到付预付：",
                  type: "radio",
                  basicType: 'paymentType',
                  disable: true
                },
              ],
            },
          ],
        },
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "currencyName",
                  label: "币别：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "isIncludeTax",
                  text: "含税",
                  placeholder: "--",
                  type: "singleCheckbox",
                },
                {
                  span: 12,
                  id: "totalMoney",
                  label: "金额：",
                  type: "txt",
                  placeholder: "--",
                  disable: true
                },
                {
                  span: 12,
                  id: "taxRate",
                  label: "税率：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "bwbje",
                  label: "本位币金额：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "taxMoney",
                  label: "税额：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "fzjje",
                  label: "辅助币金额：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "inTaxMoney",
                  label: "不含税金额：",
                  type: "txt",
                  placeholder: "--",
                },
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "jzr",
                  label: "记账人：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "accountingTime",
                  label: "记账时间：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  type: "txt",
                  placeholder: "--",
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
