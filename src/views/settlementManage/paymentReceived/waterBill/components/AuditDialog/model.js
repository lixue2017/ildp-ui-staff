
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
                  id: "status",
                  label: "审核结果",
                  type: "radio",
                  options: [
                    {
                      label: '通过',
                      value: 0,
                    }, {
                      label: '打回',
                      value: 1,
                    }
                  ]
                },
                {
                  span: 24,
                  id: "remark",
                  label: "备注说明：",
                  type: "textarea",
                  maxlength: 200,
                  rows: 3,
                },
              ],
            },
          ],
        }
      ],
    },
  ],
  formRules: {
    airFlightInfo: [
      { required: true, message: "请选择航线信息", trigger: "change" },
    ]
  }
}
