const FORM_COLS_1 = {
  span: 24,
  id: "name",
  label: "分组名称：",
  placeholder: "输入分组名称，最长10个字符",
  type: "text",
  maxlength: 10,
};
const FORM_COLS_2 = {
  span: 24,
  id: "type",
  label: "分组类型：",
  type: "radio",
  disable: true,
  options: [
    {
      label: "多选",
      value: 1,
    },
    {
      label: "单选",
      value: 2,
    },
  ],
};
const FORM_COLS_3 = {
  span: 24,
  id: "color",
  label: "分组颜色：",
  type: "colorPicker",
};
const formColumns = [FORM_COLS_1, FORM_COLS_2, FORM_COLS_3];
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
  formRules: {
    name: [
      {
        required: true,
        message: "请输入分组名称",
        trigger: "change",
      },
    ],
    type: [
      {
        required: true,
        message: "请选择分组类型",
        trigger: "change",
      },
    ],
    color: [
      {
        required: true,
        message: "请选择分组颜色",
        trigger: "change",
      },
    ],
  }, // 表单校验规则
};
// 添加标签
export const tagsForm = () => {
  return {
    title: "添加标签",
    width: "480px",
    labelWidth: "75px",
    className: "content-padding-20",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    span: 24,
                    id: "name",
                    label: "标签名称：",
                    placeholder: "输入标签名称，最长30个字符",
                    type: "text",
                    maxlength: 30,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      name: [{ required: true, message: "请输入标签名称", trigger: "change" }],
    },
  };
};
