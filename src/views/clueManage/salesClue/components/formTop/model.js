const FORM_COLS_1 = {
  span: 6,
  id: "name",
  label: "客户名称：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 6,
  id: "contactName",
  label: "联系人姓名：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 6,
  id: "honorific",
  label: "尊称：",
  type: "txt",
  basicType: "crmHonorific",
};
const FORM_COLS_4 = {
  span: 6,
  id: "role",
  label: "角色：",
  type: "txt",
  basicType: "crmRole",
};
const FORM_COLS_5 = {
  span: 6,
  id: "deptPosition",
  label: "部门职务：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 6,
  id: "phone",
  label: "手机号码：",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 6,
  id: "telephone",
  label: "固定电话：",
  type: "txt",
};
const FORM_COLS_8 = {
  span: 6,
  id: "weChat",
  label: "传真号码：",
  type: "txt",
};
const FORM_COLS_9 = {
  span: 6,
  id: "email",
  label: "电子邮箱：",
  type: "txt",
};
const FORM_COLS_10 = {
  span: 6,
  id: "weChat",
  label: "微信账号：",
  type: "txt",
};
const FORM_COLS_11 = {
  span: 6,
  id: "qqNumber",
  label: "QQ号码：",
  type: "txt",
};
const FORM_COLS_12 = {
  span: 6,
  id: "leadSource",
  label: "线索来源：",
  type: "txt",
  basicType: "crmLeadSource",
};
const FORM_COLS_13 = {
  span: 6,
  id: "state",
  label: "线索状态：",
  type: "txt",
  basicType: "crmSalesLeadsState",
};
const FORM_COLS_14 = {
  span: 6,
  id: "ownershipUserName",
  label: "线索归属：",
  type: "txt",
};
const FORM_COLS_15 = {
  span: 12,
  id: "remark",
  label: "备注信息：",
  type: "txt",
};
const FORM_COLS_16 = {
  span: 6,
  id: "code",
  label: "线索编码：",
  type: "txt",
};
const FORM_COLS_17 = {
  span: 6,
  id: "ownershipDeptName",
  label: "所属部门：",
  type: "txt",
};
const FORM_COLS_18 = {
  span: 6,
  id: "createUserName",
  label: "创建人员：",
  type: "txt",
};
const FORM_COLS_19 = {
  span: 6,
  id: "formerOwnershipUserName",
  label: "前归属人：",
  type: "txt",
};
const FORM_COLS_20 = {
  span: 6,
  id: "updateTime",
  label: "更新时间：",
  type: "txt",
};
const FORM_COLS_21 = {
  span: 6,
  id: "createTime",
  label: "创建时间：",
  type: "txt",
};
const FORM_COLS_22 = {
  span: 6,
  id: "nextFollowTime",
  label: "下次跟进：",
  type: "txt",
};
const FORM_COLS_23 = {
  span: 6,
  id: "lastFollowTime",
  label: "最后跟进：",
  type: "txt",
};
const basicFormColumns = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7,
  FORM_COLS_8,
  FORM_COLS_9,
  FORM_COLS_10,
  FORM_COLS_11,
  FORM_COLS_12,
  FORM_COLS_13,
  FORM_COLS_14,
  FORM_COLS_15,
];
const systemFormColumns = [
  FORM_COLS_16,
  FORM_COLS_17,
  FORM_COLS_18,
  FORM_COLS_19,
  FORM_COLS_20,
  FORM_COLS_21,
  FORM_COLS_22,
  FORM_COLS_23,
];

export const formConfig = {
  lists: [
    {
      fieldList: [
        {
          title: "基本信息",
          rowClassName: "form-rows-box",
          rows: [
            {
              cols: basicFormColumns,
            },
          ],
        },
        {
          title: "系统信息",
          rowClassName: "form-rows-box",
          rows: [
            {
              cols: systemFormColumns,
            },
          ],
        },
      ],
    },
  ],
};
