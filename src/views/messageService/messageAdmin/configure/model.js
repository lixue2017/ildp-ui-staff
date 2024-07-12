
const FORM_COLS_1 = {
  span: 12,
  id: "msgTitle",
  label: "消息标题：",
  placeholder: "消息标题",
  type: "text"
}

const FORM_COLS_2 = {
  span: 12,
  id: "formxx",
  type: "slot"
}

const FORM_COLS_3 = {
  span: 24,
  id: "msgContent",
  label: "消息模板：",
  type: "slot",
  dicsStr: "message_type",
  customDicsArr: [1, 2],
  customDicsVal: "msgType"
}

const formConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_1, FORM_COLS_2, FORM_COLS_3],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    msgTitle: [{ required: true, message: "请输入消息标题", trigger: "change" },],
    msgContent: [{ required: true, message: "请输入消息模板", trigger: "change" },]
  }
}
export { formConfig }