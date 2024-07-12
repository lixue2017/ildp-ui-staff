export const config = {
  lists: [{
    fieldList: [{
      rows: [{
        cols: [{
          span: 24,
          id: "type",
          label: "类型：",
          type: "radio",
          options: []
        }, {
          span: 24,
          id: "loginPW",
          label: "编号：",
          placeholder: "请输入清关编号",
          type: "text",
        }, {
          span: 24,
          id: "loginPW",
          label: "说明：",
          placeholder: "请补充说明",
          type: "text",
        }, {
          span: 24,
          id: "loginPW",
          label: "清关文件：",
          explain: "清关文件推荐使用pdf文件，也支持.rar/.zip/.jpg/.png格式，文件大小不超过10M，最多上传20个附件",
          type: "slot",
        }]
      }]
    }]
  }],
  formRules: {
    loginPW: [
      { required: true, message: "请设置登录账号密码", trigger: "blur" },
    ],
  }
}