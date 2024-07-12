const FORM_COLS_1 = {
  span: 12,
  id: "recipient",
  label: "收件人邮件：",
  type: "txt",
};

const FORM_COLS_2 = {
  span: 24,
  id: "subject",
  label: "邮件主题：",
  type: "txt",
  textLineClamp: 5,
};

const FORM_COLS_3 = {
  span: 12,
  id: "ccRecipient",
  label: "抄送人邮件：",
  type: "txt",
};

// const FORM_COLS_4 = {
//   span: 12,
//   id: "versionNo",
//   label: "模板版本：",
//   placeholder: "--",
//   type: "txt"
// }
const FORM_COLS_5 = {
  span: 24,
  id: "mailContent",
  label: "模板内容(中文)：",
  type: "slot",
};

export const formConfig = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_3,
                FORM_COLS_2,
                // FORM_COLS_4,
                FORM_COLS_5,
              ],
            },
          ],
        },
      ],
    },
  ];
};
