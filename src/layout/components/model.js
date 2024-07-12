const FORM_COL_1 = {
  span: 24,
  id: "oldPassword",
  label: "旧密码：",
  placeholder: "请输入",
  type: "text",
}
const FORM_COL_2 = {
  span: 24,
  id: "newPassword",
  label: "新密码：",
  placeholder: "请输入",
  type: "password",
}
const FORM_COL_3 = {
  span: 24,
  id: "confirmPassword",
  label: "确认密码：",
  placeholder: "请输入",
  type: "password",
}

const txtRules = {
  message: '密码格式6-12位字符，包含数字、字符、字母大小写至少两种类型',
  pattern: new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)(?![!@#$%^&*?\(\)]+$)[0-9A-Za-z!@#$%^&*?\(\)]{6,12}$/),
  trigger: "blur"
}

let nTempPassword = undefined;
const validatePass = (rule, value, callback, obj) => {
  if (obj.newPassword) {
    nTempPassword = obj.newPassword
  }
  if (value != nTempPassword) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};
export const changePasswordCols = () => {
  return {
    title: '修改账号密码',
    width: '520px',
    labelWidth: '90px',
    lists: [{
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COL_1,
                FORM_COL_2,
                FORM_COL_3
              ],
            },
          ],
        }
      ],
    }],
    formRules: {
      oldPassword: [
        { required: true, message: "请输入旧密码", trigger: "blur" }
      ],
      newPassword: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        txtRules
      ],
      confirmPassword: [
        { required: true, message: "请输入确认密码", trigger: "blur" },
        txtRules,
        { validator: validatePass, trigger: 'blur' }
      ],
    }
  }
}

export const screenList = [{
  id: "msgType",
  title: "消息类型",
  dicsStr: 'message_type',
  customDicsArr: [1, 2]
}, {
  id: "pushTimeType",
  title: "消息时间",
  options: [{
    label: "今日",
    value: 1
  }, {
    label: "本周",
    value: 2
  }, {
    label: "本月",
    value: 3
  }]
}, {
  id: "flagRead",
  title: "消息状态",
  dicsStr: 'read_status',
  customDicsArr: [0, 1]
}]