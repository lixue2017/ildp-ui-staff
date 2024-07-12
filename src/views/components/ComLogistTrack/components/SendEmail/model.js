const FORM_COL_1 = {
  span: 24,
  id: "recipient",
  label: "收件人邮箱：",
  placeholder: "请输入（多个使用‘|’隔开）",
  type: "text",
  maxlength: 200,
};
const FORM_COL_2 = {
  span: 24,
  id: "ccRecipient",
  label: "抄送人邮箱：",
  placeholder: "请输入（多个使用‘|’隔开）",
  type: "text",
  maxlength: 200,
};

const FORM_COL_3 = {
  span: 24,
  id: "subject",
  label: "邮件主题：",
  placeholder: "请输入",
  type: "textarea",
  maxlength: 500,
};

const FORM_COL_4 = {
  span: 24,
  id: "content",
  label: "邮件内容(中文)：",
  type: "slot",
};

const FORM_COL_5 = {
  span: 24,
  id: "attachId",
  fileLabel: "上传邮件附件",
  labelWidth: "10px",
  type: "customUploadFile",
  uploadData: {
    resultType: 1,
  },
};

const FORM_COL_201 = {
  span: 12,
  id: "viewType",
  label: "发送账单模板：",
  type: "radio",
  dicsStr: "bill_type",
  customDicsArr: [0, 1, 2],
};

export const emailNoCols = (obj) => {
  const { mTag } = obj || {};
  let emailCols = [FORM_COL_1, FORM_COL_2, FORM_COL_3];
  if (mTag === "bill_zd") {
    emailCols.push(FORM_COL_201);
  }
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [...emailCols, FORM_COL_4, FORM_COL_5],
            },
          ],
        },
      ],
    },
  ];
};

export const emailRules = () => {
  return {
    recipient: [
      { required: true, message: "请输入收件人邮箱", trigger: "blur" },
    ],
    subject: [{ required: true, message: "请输入邮件主题", trigger: "blur" }],
    content: [{ required: true, message: "请输入邮件内容", trigger: "blur" }],
    // viewType: [
    //   { required: true, message: "请选择发送账单模板", trigger: "change" },
    // ],
  };
};
