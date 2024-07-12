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
                  label: "确认结果：",
                  type: "radio",
                  options: [
                    { label: "放货", value: 0 },
                    { label: "退回", value: 1 },
                  ]
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注：",
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
    QRJG: [
      { required: true, message: "请选择确认结果", trigger: "blur" },
    ],
  }
}
