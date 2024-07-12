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
                  label: "查验结果：",
                  type: "radio",
                  options: [
                    { label: "DRAFT确认", value: 0 },
                    { label: "DRAFT打回", value: 1 },
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
    state: [
      { required: true, message: "请选择查验结果", trigger: "blur" },
    ],
  }
}
