import {
  httpCabinetTypeSelect,
  httpAirFlightSelect,
} from "@/comModel/httpSelect";
const DIALOG_COLS_1 = {
  span: 24,
  id: "routeNoManageId",
  placeholder: "请选择关联航次",
  label: "关联航次：",
  isBackAll: true,
  showCreate: true,
  // focusLoad: true,
  defaultKey: "id",
  // searchParamName:'routeNoMangeName',
  // isAutoInitRequest: true,
  ...httpAirFlightSelect,
  type: "slot",
};
const DIALOG_COLS_2 = {
  span: 12,
  id: "sono",
  label: "So No.：",
  placeholder: "请输入So No.",
  type: "text",
};
const DIALOG_COLS_2_1 = {
  span: 24,
  id: "sono",
  label: "So No.：",
  placeholder: "请输入So No.",
  type: "textarea",
  tip: "soNoTip",
  maxlength: 5000,
};
const DIALOG_COLS_3 = {
  span: 12,
  id: "boxModelId",
  label: "柜型：",
  placeholder: "请选择柜型",
  ...httpCabinetTypeSelect,
  defaultProp: {
    value: "id",
    label: "code",
  },
};
const DIALOG_COLS_4 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  placeholder: "请输入备注说明",
  type: "textarea",
};
const DIALOG_COLS_5 = {
  span: 24,
  id: "isCabinRelease",
  label: "是否放舱：",
  placeholder: "请选择是否放舱",
  type: "radio",
  dicsStr: "web_whether",
  customDicsArr: [1, 0],
};
const DIALOG_COLS_6 = {
  span: 24,
  id: "attachId",
  fileLabel: "放舱资料：",
  labelWidth: "12px",
  type: "customUploadFile",
};

export const formRulesLists = {
  routeNoManageId: [
    { required: true, message: "请选择关联航次", trigger: "change" },
  ],
  sono: [{ required: true, message: "请填写So No", trigger: "blur" }],
  boxModelId: [{ required: true, message: "请选择柜型", trigger: "change" }],
  isCabinRelease: [
    { required: true, message: "请选择放舱", trigger: "change" },
  ],
  attachId: [{ required: true, message: "请上传附件", trigger: "change" }],
};

export const FORMRULES_CONFIG = (rows) => {
  //校验集合
  let returnRules = {};
  rows.map((item) => {
    if (Object.keys(formRulesLists).includes(item)) {
      returnRules[item] = formRulesLists[item];
    }
  });
  return returnRules;
};

const dialogColumns = (type, isRoute) => [
  { ...DIALOG_COLS_1, ...(isRoute ? { disabled: true } : {}) },
  ...(type === "add" ? [DIALOG_COLS_2_1] : [DIALOG_COLS_2]),
  DIALOG_COLS_3,
  DIALOG_COLS_4,
  DIALOG_COLS_5,
  DIALOG_COLS_6,
];

const dialogColumnsBooking = [
  { ...DIALOG_COLS_1, disabled: true },
  DIALOG_COLS_2_1,
  { ...DIALOG_COLS_3, disabled: true },
  DIALOG_COLS_4,
  DIALOG_COLS_5,
  DIALOG_COLS_6,
];

export const getFormConfig = (row) => {
  const { type, isCabinRelease, isRoute } = row;
  return {
    title: ["add", "addBooking"].includes(type) ? "新增舱位" : "编辑舱位",
    width: "480px",
    labelWidth: "103px",
    // labelPosition: "top",
    isAttachFileId: true,
    className: "content-padding-20",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: ["addBooking"].includes(type)
                  ? dialogColumnsBooking
                  : dialogColumns(type, isRoute),
              },
            ],
          },
        ],
      },
    ],
    formRules:
      isCabinRelease == 0
        ? FORMRULES_CONFIG([
            "routeNoManageId",
            "sono",
            "boxModelId",
            "isCabinRelease",
          ])
        : FORMRULES_CONFIG([
            "routeNoManageId",
            "sono",
            "boxModelId",
            "isCabinRelease",
            "attachId",
          ]),
  };
};
