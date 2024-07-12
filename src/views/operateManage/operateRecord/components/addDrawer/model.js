
const FORM_COLS_1 = {
  span: 24,
  id: "remark",
  labelWidth: '0px',
  placeholder: "请输入备注说明",
  type: "textarea"
}

export const customsClearanceTable = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1
              ]
            }
          ]
        }
      ]
    }
  ],
}

export const formRules = {
  remark: [
    { required: true, message: "请输入备注", trigger: "blur" },
  ],
}
