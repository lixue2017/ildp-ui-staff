import { httpRoleDeptUserSelect } from "@/comModel/httpSelect.js";
const FORM_COLS_1 = {
  span: 24,
  id: "deptName",
  label: "配置部门：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 24,
  id: "appointUserName",
  label: "配置成员：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 22,
  id: "deptMainName",
  label: "所属公司：",
  type: "txt",
};
const FORM_COLS_3_SLOT = {
  span: 2,
  id: "deptMainNameSlot",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_4 = {
  span: 12,
  id: "levelId30",
  label: "一级审核人：",
  placeholder: "请选择一级审核人",
  // ...httpRoleDeptUserSelect({ getRoles: ["CW", "YW"] }),
  ...httpRoleDeptUserSelect({ isAllRoleRequest: true }),
  type: "slot",
};

const FORM_COLS_4_2 = {
  span: 12,
  id: "amount30",
  placeholder: "审核最小金额",
  labelWidth: "0px",
  type: "inputNumber",
  numDecimal: 2,
  selectKey: "currencyId30",
  selectPlaceholder: "币别",
};
const FORM_COLS_5 = {
  span: 12,
  id: "levelId20",
  label: "二级审核人：",
  placeholder: "请选择二级审核人",
  ...httpRoleDeptUserSelect({ isAllRoleRequest: true }),
  type: "slot",
};
const FORM_COLS_5_2 = {
  span: 12,
  id: "amount20",
  placeholder: "审核最小金额",
  labelWidth: "0px",
  type: "inputNumber",
  numDecimal: 2,
  selectKey: "currencyId20",
  selectPlaceholder: "币别",
};
const FORM_COLS_6 = {
  span: 12,
  id: "levelId10",
  label: "三级审核人：",
  placeholder: "请选择三级审核人",
  ...httpRoleDeptUserSelect({ isAllRoleRequest: true }),
  type: "slot",
};
const FORM_COLS_6_2 = {
  span: 12,
  id: "amount10",
  placeholder: "审核最小金额",
  labelWidth: "0px",
  type: "inputNumber",
  numDecimal: 2,
  selectKey: "currencyId10",
  selectPlaceholder: "币别",
};
const FORM_COLS_7 = {
  span: 12,
  id: "levelId1",
  label: "总经理：",
  placeholder: "请选择总经理",
  ...httpRoleDeptUserSelect({ getRoles: ["ZJL"], isAllRoleRequest: true }),
};
const FORM_COLS_7_2 = {
  span: 12,
  id: "amount1",
  placeholder: "审核最小金额",
  labelWidth: "0px",
  type: "inputNumber",
  numDecimal: 2,
  selectKey: "currencyId1",
  selectPlaceholder: "币别",
};
const FORM_COLS_8 = {
  span: 24,
  id: "levelId110",
  label: "出纳经理：",
  placeholder: "请选择出纳经理",
  ...httpRoleDeptUserSelect({ getRoles: ["CNJL", "CW"] }),
};

const FORM_COLS_9 = {
  span: 24,
  id: "levelId100",
  label: "财务经理：",
  placeholder: "请选择财务经理",
  ...httpRoleDeptUserSelect({ getRoles: ["CNJL", "CW"] }),
};

const FORM_COLS_50 = {
  span: 24,
  id: "identityName",
  label: "往来单位类型：",
  labelWidth: "125px",
  type: "txt",
};
const FORM_COLS_51 = {
  span: 24,
  id: "typeName",
  label: "类型：",
  labelWidth: "125px",
  type: "txt",
};
const FORM_COLS_52 = {
  span: 24,
  id: "customerName",
  label: "对象：",
  labelWidth: "125px",
  type: "txt",
};

// const FORM_COLS_53 = (row = {}) => {
//   const { isAppoint } = row;
//   return {
//     span: 24,
//     id: "reviewerDefault",
//     label: "默认审核人：",
//     placeholder: "请选择默认审核人",
//     ...httpRoleDeptUserSelect(),
//     multiple: true,
//     multipleNum:isAppoint == 1 ? 999 : 1,
//     labelWidth: "125px",
//   };
// };
const FORM_COLS_53 = {
  span: 22,
  id: "reviewerDefault",
  label: "默认审核人：",
  placeholder: "请选择默认审核人",
  ...httpRoleDeptUserSelect(),
  labelWidth: "125px",
};
const FORM_COLS_53_SLOT = {
  span: 2,
  id: "defaultSlot",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_54 = {
  span: 12,
  id: "reviewerTwoLv",
  label: "二级审核人：",
  selectLabelKey: "reviewerTwoLvName",
  placeholder: "请选择二级审核人",
  ...httpRoleDeptUserSelect(),
  labelWidth: "125px",
};
const FORM_COLS_54_2 = {
  span: 12,
  id: "reviewerTwoLvMoney",
  placeholder: "审核最小金额",
  labelWidth: "0px",
  type: "inputNumber",
  numDecimal: 2,
  selectKey: "reviewerTwoLvCurrent",
  selectDisabled: true,
  selectPlaceholder: "币别",
};
const FORM_COLS_55 = {
  span: 12,
  id: "reviewerThreeLv",
  label: "三级审核人：",
  selectLabelKey: "reviewerThreeLvName",
  placeholder: "请选择三级审核人",
  ...httpRoleDeptUserSelect(),
  labelWidth: "125px",
};
const FORM_COLS_55_2 = {
  span: 12,
  id: "reviewerThreeLvMoney",
  placeholder: "审核最小金额",
  labelWidth: "0px",
  type: "inputNumber",
  numDecimal: 2,
  selectKey: "reviewerThreeLvCurrent",
  selectDisabled: true,
  selectPlaceholder: "币别",
};
const FORM_COLS_56 = {
  span: 12,
  id: "reviewerFourLv",
  label: "四级审核人：",
  selectLabelKey: "reviewerFourLvName",
  placeholder: "请选择四级审核人",
  ...httpRoleDeptUserSelect(),
  labelWidth: "125px",
};
const FORM_COLS_56_2 = {
  span: 12,
  id: "reviewerFourLvMoney",
  placeholder: "审核最小金额",
  labelWidth: "0px",
  type: "inputNumber",
  numDecimal: 2,
  selectKey: "reviewerFourLvCurrent",
  selectDisabled: true,
  selectPlaceholder: "币别",
};
const FORM_COLS_57 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  placeholder: "此处填写备注信息",
  labelWidth: "125px",
  type: "textarea",
  rows: 3,
};
// const FORM_COLS_58 = {
//   span: 24,
//   id: "appointUserName",
//   label: "配置成员：",
//   labelWidth: "125px",
//   ...httpRoleDeptUserSelect(),
//   multiple: true,
//   multipleNum:isAppoint == 1 ? 999 : 1,
// };

const FORM_COLS_58 = {
  span: 24,
  id: "appointUserId",
  label: "配置成员：",
  labelWidth: "125px",
  ...httpRoleDeptUserSelect(),
  multiple: true,
};

// 更换成员
export const changePersonnel = (row = {}) => {
  const { type } = row;
  return {
    title: "账单编辑",
    width: "600px",
    labelWidth: "120px",
    // className: 'content-padding-20',
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  FORM_COLS_1,
                  FORM_COLS_2,
                  FORM_COLS_3,
                  FORM_COLS_3_SLOT,
                  FORM_COLS_4,
                  FORM_COLS_4_2,
                  FORM_COLS_5,
                  FORM_COLS_5_2,
                  FORM_COLS_6,
                  FORM_COLS_6_2,
                  FORM_COLS_7,
                  FORM_COLS_7_2,
                  FORM_COLS_8,
                  FORM_COLS_9,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      ...(type == 10
        ? {}
        : {
            levelId1: [
              { required: true, message: "请选择总经理", trigger: "change" },
            ],
            levelId110: [
              { required: true, message: "请选择出纳经理", trigger: "change" },
            ],
            levelId100: [
              { required: true, message: "请选择财务经理", trigger: "change" },
            ],
          }),
    },
  };
};

export const changeProcess = (row = {}) => {
  const { isAppoint = 0 } = row;
  return {
    title: "更换成员",
    width: "700px",
    labelWidth: "140px",
    // className: 'content-padding-20',
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  FORM_COLS_50,
                  FORM_COLS_51,
                  FORM_COLS_52,
                  ...(isAppoint == 1 ? [FORM_COLS_58] : []),
                  FORM_COLS_53,
                  FORM_COLS_53_SLOT,
                  FORM_COLS_54,
                  FORM_COLS_54_2,
                  FORM_COLS_55,
                  FORM_COLS_55_2,
                  FORM_COLS_56,
                  FORM_COLS_56_2,
                  FORM_COLS_57,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      reviewerDefault: [
        { required: true, message: "请选择默认审核人", trigger: "change" },
      ],
      remark: [{ required: true, message: "请输入备注", trigger: "change" }],
    },
  };
};

export const dialogConfig = (row = {}) => {
  const { tagType, type, isAppoint } = row;
  return {
    reimburseRules: changePersonnel({ type }),
    processRules: changeProcess({ isAppoint }),
  }[tagType];
};
