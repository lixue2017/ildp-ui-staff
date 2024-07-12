```
// 启用
this.$refs.confirmDialog.enable().then(() => {
  this.$message.success("启用成功");
});

// 禁用
this.$refs.confirmDialog.disable().then(() => {
  this.$message.success("禁用成功");
});

// 删除
this.$refs.confirmDialog.delete().then(() => {
  this.$message.success("删除成功");
});

// 待审核自动提交
this.$refs.confirmDialog.audit().then(() => {
  this.$message.success("提交成功");
});

/* 
  ** contacts - 联系人信息,
  ** contactAddress - 联系地址,
  ** bankAccount - 银行账号信息,
  ** openAccount - 开通登录账号,
  ** resetPW - 重置登录密码,
  ** verify - 审核,
*/
// 例如开通账号
this.$refs.confirmDialog.handleFormDialog(openAccount, {
  httpRequest, //调用接口
  successMessage: "开通成功", // 成功提示
  successFunction, // 接口成功回调
  formModel: { // 默认数据
    id: rows.id,
  },
});

```