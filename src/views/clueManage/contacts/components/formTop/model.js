const FORM_COLS_1 = {
  span: 6,
  id: "contactName",
  label: "联系人姓名：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 6,
  id: "customerName",
  label: "关联客户：",
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
  label: "微信账号：",
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
  id: "province",
  label: "所在地区：",
  type: "txt",
  render: (row) => {
    const { province, city, area } = row;
    const arr = [];
    if (province) arr.push(province);
    if (city) arr.push(city);
    if (area) arr.push(area);
    return arr.join("/") || "--";
  },
};
const FORM_COLS_11 = {
  span: 6,
  id: "qqNumber",
  label: "QQ号码：",
  type: "txt",
};
const FORM_COLS_12 = {
  span: 6,
  id: "remark",
  label: "备注信息：",
  type: "txt",
};
const FORM_COLS_13 = {
  span: 24,
  id: "address",
  label: "详细地址：",
  type: "txt",
};
const FORM_COLS_14 = {
  span: 6,
  id: "code",
  label: "系统编号：",
  type: "txt",
};
const FORM_COLS_15 = {
  span: 6,
  id: "createUserName",
  label: "创建人员：",
  type: "txt",
};
const FORM_COLS_16 = {
  span: 6,
  id: "createTime",
  label: "创建时间：",
  type: "txt",
};
const FORM_COLS_17 = {
  span: 6,
  id: "updateTime",
  label: "更新时间：",
  type: "txt",
};
const FORM_COLS_18 = {
  span: 6,
  id: "lastFollowTime",
  label: "最后跟进：",
  type: "txt",
};
const FORM_COLS_19 = {
  span: 6,
  id: "nextFollowTime",
  label: "下次跟进：",
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
];
const systemFormColumns = [
  FORM_COLS_14,
  FORM_COLS_15,
  FORM_COLS_16,
  FORM_COLS_17,
  FORM_COLS_18,
  FORM_COLS_19,
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
