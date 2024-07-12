```
<ComForm ref="myForm" :formConfig="formConfig" @validate="handleValidate" @before-request="handleBeforeRequest" @success-request="handleSuccessRequest" @complete-request="handleCompleteRequest">
  <template v-slot:transshipmentPort="slotProps"></template>
  // transshipmentPort 为cols中id
  // slotProps: {
    formModel: {}, // 表单数据
    disableAll: {}, // disable集合
    selectAll: {},  // options集合
  }
</ComForm>
@validate // 表单校验
@before-request // 提交接口前
@success-request // 接口成功
@complete-request // 完成请求
formConfig: {
  formModel: {}, // 表单数据
  confirm: () => {}, // 点击提交按钮确定
  httpRequest: () => {}, // 表单提交接口
  successFunction: () => {}, // 表单提交成功回调
  successMessage: '', // 成功提示语
  lists: [{ // 横向
    fieldList: [{ 
      rows: [{ // 纵向
        cols: [{
          span: 24, // 24为一行，12为50%
          id: '',   // 提交数据字段名称
          label: '', // 表单左侧名称
          placeholder: '', // 占位符
          type: '', // 输入框为text， 多文本为textarea，选择框为select，单选框为radio， 日期为date，slot为插槽...
          options: [], // 选择框、单选框选择数据
          handle: () => {}, // 选择框值改变时触发
          disable: false // 不可编辑
        }] // 横向
      }]
    }]
  }], // 表单渲染列表
  formRules: {}, // 表单校验规则
}
<slot name="form-submit" /> 提交按钮、其他按钮插槽
```