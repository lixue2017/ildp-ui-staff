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
                  id: "orderNum",
                  label: "业务单：",
                  placeholder: "--",
                  type: "slot",
                  basicType: "settlementBusinessType",
                  basicTypeVal: "businessType"
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
                  id: "billingMainName",
                  label: "记账主体：",
                  type: "txt",
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "costName",
                  label: "费用名称：",
                  type: "text",
                  disable: true,
                  placeholder: "--",
                },
                {
                  span: 12,
                  id: "dealingsCompanyName",
                  label: "往来单位：",
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
                  id: "currency",
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
                  decimal: 2,
									colFormat: "thousandthMark",
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
                  id: "baseMoney",
                  label: "本位币金额：",
                  type: "txt",
                  decimal: 4,
									colFormat: "thousandthMark",
                },
                {
                  span: 12,
                  id: "taxMoney",
                  label: "税额：",
                  type: "txt",
                  decimal: 2,
									colFormat: "thousandthMark",
                },
                {
                  span: 12,
                  id: "helpMoney",
                  label: "辅助币金额：",
                  type: "txt",
                  decimal: 4,
									colFormat: "thousandthMark",
                },
                {
                  span: 12,
                  id: "inTaxMoney",
                  label: "不含税金额：",
                  type: "txt",
                  decimal: 2,
									colFormat: "thousandthMark",
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
                  id: "billingMainName",
                  label: "记账人：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "businessUser",
                  label: "业务员：",
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
                  span: 12,
                  id: "operateUser",
                  label: "操作员：",
                  placeholder: "--",
                  type: "txt",
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
  ],
  formRules: {}
}
