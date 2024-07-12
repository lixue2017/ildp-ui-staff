export const orderReceivingConfirmForm = {
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
                  label: "说明：",
                  type: "textarea",
									placeholder: "请输入",
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
      { required: true, message: "请选择接单结果", trigger: "change" },
    ],
  }
}
