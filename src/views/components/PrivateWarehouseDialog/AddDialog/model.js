export const config = {
  lists: [
    {
      span: 12,
      id: "warehouseCode",
      label: "仓库代码：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 12,
      id: "warehouseName",
      label: "仓库名称：",
      placeholder: "此处填写仓库名称/所属公司",
      type: "text",
    },
    {
      span: 12,
      id: "contacts",
      label: "联系人：",
      placeholder: "此处填写联系人姓名",
      type: "text",
    },
    {
      span: 12,
      id: "phone",
      label: "联系电话：",
      placeholder: "此处填写联系电话",
      type: "text",
      // inputType: "number"
    },
    {
      span: 12,
      id: "email",
      label: "联系邮箱：",
      placeholder: "此处填写联系邮箱",
      type: "text",
    },
    {
      span: 12,
      id: "postCode",
      label: "邮编：",
      placeholder: "此处填写邮编",
      type: "text",
    },
    {
      span: 12,
      id: "nationId",
      label: "国家：",
      placeholder: "请选择国家",
      type: "slot",
      category: "country",
      defaultProp: {
        value: "id",
        label: "twoCode,nameCn",
      },
    },
    {
      span: 12,
      id: "province",
      label: "省(州)：",
      placeholder: "此处填写省(州)",
      type: "text",
    },
    {
      span: 12,
      id: "city",
      label: "城市：",
      placeholder: "此处填写城市",
      type: "text",
    },
    {
      span: 12,
      id: "area",
      label: "区(县)：",
      placeholder: "此处填写区/县",
      type: "text",
    },
    {
      span: 12,
      id: "street",
      label: "街道：",
      placeholder: "此处填写街道",
      type: "text",
    },
    {
      span: 12,
      id: "detailAddress",
      label: "详细地址：",
      placeholder: "此处填写详细地址",
      type: "text",
      maxlength: 200,
    },
    {
      span: 24,
      id: "remark",
      label: "备注：",
      placeholder: "此处填写备注",
      type: "textarea",
      maxlength: 2000,
    },
  ],
  formRules: {
    contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
    phone: [
      { required: true, message: "请输入联系电话", trigger: "blur" },
      // {
      //   message: '请输入正确的手机号',
      //   // pattern: POSITIVE_PHONE,
      // }
    ],
    postCode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
    nationId: [{ required: true, message: "请选择国家", trigger: "blur" }],
    province: [{ required: true, message: "请输入省/州", trigger: "blur" }],
    city: [{ required: true, message: "请输入城市", trigger: "blur" }],
    area: [{ required: true, message: "请输入区/县", trigger: "blur" }],
    detailAddress: [
      { required: true, message: "请输入详细地址", trigger: "blur" },
    ],
  }, // 表单校验规则
};
