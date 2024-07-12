export const customDialogSearchCols = () => {
  return {
    title: "自定义查询条件",
    width: "500px",
    labelWidth: "72px",
    simpleCustomCols: [
      {
        span: 24,
        id: "nameCn",
        label: "标题：",
        placeholder: "请输入",
        type: "text",
      },
      {
        span: 24,
        id: "tip_txt",
        label: "",
        type: "txt",
        txtStyleObj: {
          color: "#a5a5a5",
        },
        render: () => "* 自定义条件为点击搜索后的查询值",
      },
    ],
    formRules: {
      nameCn: [{ required: true, message: `请输入标题`, trigger: "blur" }],
    },
  };
};
