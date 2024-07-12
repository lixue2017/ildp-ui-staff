import {
  httpRoleDeptUserSelect,
  httpEnterprisetSelect,
} from "@/comModel/httpSelect";
const FORM_COL_1 = {
  span: 12,
  id: "operationOrderNum1",
  label: "工作单号：",
  type: "txt",
  // txtTagArr: [
  //   {
  //     basicType: "freightType",
  //     basicTypeVal: "freightType",
  //   },
  // ],
};
const FORM_COL_2 = {
  span: 12,
  id: "freightType",
  type: "slot",
  labelWidth: "32px",
  basicType: "freightType",
};
const FORM_COL_3 = {
  span: 12,
  id: "bailorPeople",
  label: "客户名称：",
  type: "txt",
};
const FORM_COL_4 = {
  span: 12,
  id: "operateShortName",
  label: "所属公司：",
  type: "txt",
};
const FORM_COL_5 = {
  span: 12,
  id: "overseasAgencyType",
  label: "海外代理类型：",
  type: "radio",
  dicsStr: "overseasAgent_type",
};
const FORM_COL_6 = {
  span: 12,
  id: "overseasAgency",
  label: "海外代理：",
  selectLabelKey: "overseasAgencyName",
  ...httpEnterprisetSelect(),
  type: "slot",
};
const FORM_COL_7 = {
  span: 12,
  id: "overseasOperator",
  selectLabelKey: "overseasOperatorName",
  label: "海外操作员：",
  ...httpRoleDeptUserSelect(),
};
const FORM_COL_8 = {
  span: 12,
  id: "csOperator",
  label: "长沙操作员：",
  selectLabelKey: "csOperatorName",
  ...httpRoleDeptUserSelect(),
};
const FORM_COL_9 = {
  span: 12,
  id: "nlCode",
  label: "清关单号：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COL_10 = {
  span: 12,
  id: "mblNum",
  label: "MBL号：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COL_11 = {
  span: 12,
  id: "expectWarehouseType",
  label: "预计入库仓：",
  placeholder: "请选择",
  basicType: "clearanceReservationWarehouse",
  type: "select",
};
const FORM_COL_12 = {
  span: 12,
  id: "ontainerSno",
  label: "箱号：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COL_13 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
  rows: 9,
};
const FORM_COL_14 = {
  span: 12,
  id: "is_send_mail",
  type: "singleCheckbox",
  text: "发送预报邮件",
};
const FORM_COL_15 = {
  span: 12,
  id: "mailSlot",
  type: "slot",
  labelWidth: "0",
};
const FORM_COL_16 = {
  span: 12,
  id: "registerNo",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COL_17 = {
  span: 12,
  id: "flightName",
  label: "船/航名：",
  type: "txt",
};
const FORM_COL_18 = {
  span: 12,
  id: "voyageNumber",
  label: "船/航次：",
  type: "txt",
};
const OVERSEA_FORM_COL_9 = {
  span: 12,
  id: "reachTime",
  label: "ETA：",
  placeholder: "请选择",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};

export const formRulesLists = {
  overseasAgencyType: [
    { required: true, message: "请选择海外代理类型", trigger: "change" },
  ],
  overseasAgency: [
    { required: true, message: "请选择海外代理", trigger: "change" },
  ],
  overseasOperator: [
    { required: true, message: "请选择海外操作员", trigger: "change" },
  ],
  csOperator: [
    { required: true, message: "请选择长沙操作员", trigger: "change" },
  ],
  remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
  nlCode: [{ required: true, message: "请输入清关单号", trigger: "blur" }],
  expectWarehouseType: [
    { required: true, message: "请输入预计入库仓", trigger: "change" },
  ],
  reachTime: [{ required: true, message: `请选择ETA`, trigger: "change" }],
  registerNo: [
    { required: true, message: `请输入国内登记号`, trigger: "blur" },
  ],
};

export const FORMRULES_CONFIG = (rows) => {
  //校验集合
  return rows.reduce((obj, key) => {
    if (formRulesLists[key]) {
      obj[key] = formRulesLists[key];
    }
    return obj;
  }, {});
};

export const getFormConfig = (obj) => {
  const { operationOrderType, proxyTypeId, orderType, customsClearanceStatus } =
    obj || {};
  let rulesList = [];
  let customDicsArr = [0, 1];
  if (orderType === 2) {
    rulesList = ["csOperator", "expectWarehouseType", "registerNo"];
    if (obj.overseasAgencyType !== "2") {
      rulesList.push("overseasAgency");
    }
    if (operationOrderType != "0" && proxyTypeId != "0") {
      customDicsArr = [0, 1, 2]; // 电商空运的时候可以选头程同行
    }
  } else {
    rulesList = ["overseasAgency"];
  }

  return {
    // 电商/传统清关交接
    title: "清关交接",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  FORM_COL_1,
                  FORM_COL_2,
                  FORM_COL_3,
                  FORM_COL_4,
                  ...(orderType === 2 ? [FORM_COL_17, FORM_COL_18] : []),
                  {
                    ...FORM_COL_5,
                    customDicsArr,
                  },
                  FORM_COL_6,
                  FORM_COL_9,
                  FORM_COL_7,
                  FORM_COL_10,
                  ...(orderType === 2
                    ? [
                        OVERSEA_FORM_COL_9,
                        FORM_COL_8,
                        FORM_COL_16,
                        FORM_COL_12,
                        FORM_COL_11,
                      ]
                    : [OVERSEA_FORM_COL_9, FORM_COL_11, FORM_COL_12]),
                  FORM_COL_13,
                  ...(orderType === 2 && customsClearanceStatus === 1
                    ? []
                    : [FORM_COL_14]), // 电商二审不发送邮件
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: FORMRULES_CONFIG([
      "overseasAgencyType",
      "overseasOperator",
      "nlCode",
      "reachTime",
      ...rulesList,
    ]),
  };
};

const SEE_FORM_COL_612 = {
  span: 12,
  id: "reachTime",
  label: "ETA：",
  type: "txt",
};
const SEE_FORM_COL_613 = {
  span: 12,
  id: "csOperatorName",
  label: "长沙操作员：",
  type: "txt",
};
const SEE_FORM_COL_614 = {
  span: 12,
  id: "registerNo",
  label: "国内登记号：",
  type: "txt",
};
const SEE_FORM_COL_615 = {
  span: 12,
  id: "expectWarehouseType",
  label: "预计入库仓：",
  basicType: "clearanceReservationWarehouse",
  type: "txt",
};
const SEE_FORM_COL_616 = {
  span: 12,
  id: "ontainerSno",
  label: "箱号：",
  type: "txt",
};
const SEE_FORM_COL_617 = {
  span: 12,
  id: "nlCode",
  label: "清关单号：",
  type: "txt",
};
const SEE_FORM_COL_618 = {
  span: 12,
  id: "overseasOperatorName",
  label: "海外操作员：",
  type: "txt",
};
const SEE_FORM_COL_619 = {
  span: 12,
  id: "mblNum",
  label: "MBL号：",
  type: "txt",
};
const SEE_FORM_COL_620 = {
  span: 24,
  id: "remark",
  label: "备注：",
  type: "txt",
  textLineClamp: 9,
};
// 查看
export const getSeeFormConfig = (obj) => {
  const { operationOrderType, proxyTypeId, orderType } = obj || {};
  let customDicsArr = [0, 1];
  if (orderType === 2) {
    if (operationOrderType != "0" && proxyTypeId != "0") {
      customDicsArr = [0, 1, 2]; // 电商空运的时候可以选头程同行
    }
  }

  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  FORM_COL_1,
                  FORM_COL_2,
                  FORM_COL_3,
                  FORM_COL_4,
                  ...(orderType === 2 ? [FORM_COL_17, FORM_COL_18] : []),
                  {
                    ...FORM_COL_5,
                    customDicsArr,
                    disable: true,
                  },
                  {
                    span: 12,
                    id: "overseasAgencyName",
                    label: "海外代理：",
                    type: "txt",
                  },
                  SEE_FORM_COL_617,
                  SEE_FORM_COL_618,
                  SEE_FORM_COL_619,
                  ...(orderType === 2
                    ? [
                        SEE_FORM_COL_612,
                        SEE_FORM_COL_613,
                        SEE_FORM_COL_614,
                        SEE_FORM_COL_616,
                        SEE_FORM_COL_615,
                      ]
                    : [SEE_FORM_COL_612, SEE_FORM_COL_615, SEE_FORM_COL_616]),
                  SEE_FORM_COL_620,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {},
  };
};

const OVERSEA_FORM_COL_1 = {
  span: 15,
  id: "orderSn",
  label: "工作单号：",
  type: "txt",
  txtClassName: "base-flex-between",
  txtTagArr: [
    {
      basicType: "freightType",
      basicTypeVal: "freightType",
    },
  ],
};
const OVERSEA_FORM_COL_3 = {
  span: 12,
  id: "customerShortName",
  label: "客户名称：",
  type: "txt",
};
const OVERSEA_FORM_COL_4 = {
  span: 12,
  id: "operationMainName",
  label: "所属公司：",
  type: "txt",
};
const OVERSEA_FORM_COL_5 = {
  span: 12,
  id: "agentType",
  label: "海外代理类型：",
  type: "radio",
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1],
};
const OVERSEA_FORM_COL_6 = {
  span: 12,
  id: "agent",
  selectLabelKey: "agentName",
  label: "海外代理：",
  ...httpEnterprisetSelect(),
  type: "slot",
};
const OVERSEA_FORM_COL_10 = {
  span: 12,
  id: "registerNo",
  label: "箱号：",
  placeholder: "请输入",
  type: "text",
};
const OVERSEA_FORM_COL_11 = {
  span: 12,
  id: "ontainerSno",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};
export const customOverseasDialogCols = (obj) => {
  const { overallStatus, isWebHandoverSee } = obj || {};
  let OVERSEA_COLS_1 = [
    OVERSEA_FORM_COL_6,
    FORM_COL_9, // 清关单号
    FORM_COL_7,
    FORM_COL_10, // MBL
    OVERSEA_FORM_COL_9,
    OVERSEA_FORM_COL_10,
    OVERSEA_FORM_COL_11,
    FORM_COL_8, // 长沙操作
    FORM_COL_11, // 预计入库仓
    FORM_COL_13,
  ];
  if (isWebHandoverSee) {
    OVERSEA_COLS_1 = [
      {
        span: 12,
        id: "agentName",
        label: "海外代理：",
        type: "txt",
      },
      SEE_FORM_COL_617,
      SEE_FORM_COL_618,
      SEE_FORM_COL_619,
      SEE_FORM_COL_612,
      {
        ...SEE_FORM_COL_614,
        label: "箱号：",
      },
      {
        ...SEE_FORM_COL_616,
        label: "国内登记号：",
      },
      SEE_FORM_COL_613,
      SEE_FORM_COL_615,
      SEE_FORM_COL_620,
    ];
  }
  return {
    // 海外清关交接
    title: "清关交接",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  OVERSEA_FORM_COL_1,
                  OVERSEA_FORM_COL_3,
                  OVERSEA_FORM_COL_4,
                  {
                    ...OVERSEA_FORM_COL_5,
                    disable: isWebHandoverSee,
                  },
                  ...OVERSEA_COLS_1,
                  ...(overallStatus === 14 ? [FORM_COL_14] : []), // 海外二审不发送邮件
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: isWebHandoverSee
      ? {}
      : {
          agentType: [
            {
              required: true,
              message: `请选择海外代理类型`,
              trigger: "change",
            },
          ],
          agent: [
            { required: true, message: `请选择海外代理`, trigger: "change" },
          ],
          nlCode: [
            { required: true, message: `请输入清关单号`, trigger: "blur" },
          ],
          overseasOperator: [
            { required: true, message: `请选择海外操作员`, trigger: "change" },
          ],
          csOperator: [
            { required: true, message: `请选择长沙操作员`, trigger: "change" },
          ],
          expectWarehouseType: [
            { required: true, message: `请选择预报入库仓`, trigger: "change" },
          ],
          registerNo: [
            { required: true, message: `请输入箱号`, trigger: "blur" },
          ],
          reachTime: [
            { required: true, message: `请选择ETA`, trigger: "change" },
          ],
          ontainerSno: [
            { required: true, message: `请输入国内登记号`, trigger: "blur" },
          ],
        },
  };
};
