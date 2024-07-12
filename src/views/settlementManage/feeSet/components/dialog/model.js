export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "state",
                  label: "接单结果：",
                  type: "radio",
                  options: [
                    { label: "同意", value: 0 },
                    { label: "拒绝退回", value: 1 },
                  ]
                },
                {
                  span: 24,
                  id: "remark",
                  label: "拒绝说明：",
                  type: "textarea",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    state: [
      { required: true, message: "请选择接单结果", trigger: "blur" },
    ],
  }
}

//校验修改集合
export const formRulesLists = {
  customerId: [
    { required: true, message: "请选择公司名称", trigger: "change" },
  ],
  bankAccount: [
    { required: true, message: "请选择银行账号", trigger: "change" },
  ],
  openingBank: [
    { required: true, message: "请选择开户行", trigger: "change" },
  ],
  openAddress: [
    { required: true, message: "请选择公司地址", trigger: "change" },
  ],
  invoiceTitle: [
    { required: true, message: "请输入swift code", trigger: "change" },
  ],
}

