import {
  httpEnterprisetSelect,
  httpRoleDeptUserSelect,
} from "@/comModel/httpSelect.js";

const FORM_COLS_1 = {
  span: 24,
  id: "operationType",
  label: "操作类型：",
  type: "radio",
  labelWidth: "120px",
  basicType: "businessSubmitOperationType",
};
const FORM_COLS_2 = {
  span: 24,
  id: "operationAgent",
  label: "操作代理：",
  labelWidth: "120px",
  placeholder: "请选择操作代理",
  ...httpEnterprisetSelect({ typeList: "0", isQueryFirstDept: 1 }),
  type:"slot"
};
const FORM_COLS_3 = {
  span: 24,
  id: "proxyType",
  label: "订舱类型：",
  type: "radio",
  labelWidth: "120px",
};
const FORM_COLS_4 = {
  span: 24,
  id: "proxy",
  label: "订舱代理：",
  labelWidth: "120px",
  placeholder: "请选择订舱代理",
  ...httpEnterprisetSelect(),
  type: "slot",
};
const FORM_COLS_5 = {
  span: 24,
  id: "operator",
  label: "操作员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const FORM_COLS_6 = {
  span: 24,
  id: "fileMember",
  label: "文件员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const FORM_COLS_7 = {
  span: 24,
  id: "businessRemark",
  label: "备注：",
  labelWidth: "120px",
  placeholder: "备注说明",
  type: "textarea",
  maxlength: 2000,
};

const formColumns = ({
  operationType,
  operationAgent = "",
  proxyTypeDicts = [],
}) => [
  FORM_COLS_1,
  ...(operationType == 1
    ? [
        FORM_COLS_2,
        ...(operationAgent
          ? [{ ...FORM_COLS_3, options: proxyTypeDicts }, FORM_COLS_4]
          : []),
        FORM_COLS_5,
        FORM_COLS_6,
      ]
    : []),
  FORM_COLS_7,
];

export const formConfig = (params) => ({
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: formColumns(params),
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    operationAgent: [
      {
        required: true,
        message: "请选择操作代理",
        trigger: "change",
      },
    ],
    proxyType: [
      {
        required: true,
        message: "请选择订舱类型",
        trigger: "change",
      },
    ],
    proxy: [
      {
        required: true,
        message: "请选择订舱代理",
        trigger: "change",
      },
    ],
    operator: [
      {
        required: true,
        message: "请选择操作员",
        trigger: "change",
      },
    ],
    fileMember: [
      {
        required: true,
        message: "请选择文件员",
        trigger: "change",
      },
    ],
  },
});
