const FORM_COLS_1 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "请输入备注信息",
  type: "textarea",
  rows: 3,
  maxlength: 300,
};
const FORM_COLS_2 = {
  span: 24,
  id: "attachId",
  label: "上传图片：",
  placeholder: "请上传图片",
  type: "customUploadFile",
};
const formColumns = [FORM_COLS_1, FORM_COLS_2];
export const config = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: formColumns,
            },
          ],
        },
      ],
    },
  ],
  formRules: {}, // 表单校验规则
};
