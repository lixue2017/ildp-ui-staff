import overseaLangObj from "@/language/overseasLang.js";

const TABLE_FILE_COL_SELECT = {
  type: "selection",
  width: 50,
  align: "right",
  // fixed: "left"
};
const TABLE_FILE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_FILE_COL_1 = {
  label: "类型",
  prop: "serviceName",
  minWidth: 100,
  showOverflowTooltip: true,
  dicsStr: "vehicle_order_type",
  customDicsArr: [10, 20],
  customDicsVal: "podType",
  fontColor: true,
};
const TABLE_FILE_COL_2 = {
  label: "派车单号",
  prop: "dispatchSlot",
  minWidth: 100,
  customRow: true,
  customSlot: true,
  showOverflowTooltip: true,
};
const TABLE_FILE_COL_3 = {
  label: "关联订单号",
  prop: "orderSn",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_FILE_COL_4 = {
  label: "附件信息",
  prop: "name",
  minWidth: 150,
  showOverflowTooltip: true,
};
const TABLE_FILE_COL_5 = {
  label: "上传时间",
  prop: "createTime",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_FILE_COL_6 = {
  label: "上传人",
  prop: "createBy",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_FILE_COL_7 = {
  label: "操作",
  prop: "operation",
  // fixed: "right",
  customRow: true,
  width: 130,
};
const TABLE_FILE_COL_99 = {
  label: "操作",
  prop: "operation",
  // fixed: "right",
  columnOperation: true,
  width: 130,
};
export const fileTableCols = () => {
  return [
    TABLE_FILE_COL_0,
    TABLE_FILE_COL_0,
    TABLE_FILE_COL_1,
    TABLE_FILE_COL_2,
    TABLE_FILE_COL_3,
    TABLE_FILE_COL_4,
    TABLE_FILE_COL_5,
    TABLE_FILE_COL_6,
    TABLE_FILE_COL_99,
  ];
};

export const attachTableCols = (showOperation, obj) => {
  const { isColumnOperation } = obj || {};
  return [
    ...(!showOperation ? [TABLE_FILE_COL_SELECT] : []),
    {
      prop: "attachSlotName",
      label: overseaLangObj.fj_zl || "附件资料",
      customRow: true,
      width: 450,
    },
    {
      prop: "attachSlotType",
      label: "类型",
      customRow: true,
    },
    ...(showOperation
      ? [isColumnOperation ? TABLE_FILE_COL_99 : TABLE_FILE_COL_7]
      : []),
  ];
};

/** 上传资料 */
const FILE_FORM_COL_1 = {
  span: 24,
  labelWidth: "52px",
  id: "operationOrderNum",
  label: "业务单：",
  placeholder: "--",
  type: "txt",
};
const FILE_FORM_COL_2 = {
  span: 24,
  id: "attachType",
  label: "类型：",
  type: "radio",
  options: [
    {
      label: "客户下单资料",
      value: 30,
    },
    {
      label: "客户报关资料",
      value: 100,
    },
  ],
};
const FILE_FORM_COL_3 = {
  span: 24,
  id: "attachId_3",
  attachIdKeyName: "attachId_3",
  attachListKeyName: "attachId_3_list",
  delAttachIdsName: "attachId_3_del",
  fileLabel: "客户下单资料",
  labelWidth: "0",
  type: "customUploadFile",
  pasteUpload: true,
};
const FILE_FORM_COL_4 = {
  span: 24,
  id: "attachId_4",
  attachIdKeyName: "attachId_4",
  attachListKeyName: "attachId_4_list",
  delAttachIdsName: "attachId_4_del",
  fileLabel: "客户报关资料",
  labelWidth: "0",
  type: "customUploadFile",
  pasteUpload: true,
};
const FILE_FORM_COL_5 = {
  span: 24,
  id: "slotUpload",
  labelWidth: "0",
  type: "slot",
};
const FILE_DLG_LISTS = (FILE_FORM_COL) => {
  return [
    {
      // change_model_key: FILE_FORM_COL.id,
      fieldList: [
        {
          rows: [
            {
              // cols: [FILE_FORM_COL_1, FILE_FORM_COL_2, FILE_FORM_COL]
              cols: [FILE_FORM_COL_1, FILE_FORM_COL_5],
            },
          ],
        },
      ],
    },
  ];
};
const FILE_DLG_RULES = (attachId) => {
  return {
    // [attachId]: [
    // 	{ required: true, message: "请上传资料", trigger: "change" },
    // ],
    // attachId_3: [
    // 	{ required: true, message: "请上传客户下单资料", trigger: "change" },
    // ],
    // attachId_4: [
    // 	{ required: true, message: "请上传客户报关资料", trigger: "change" },
    // ],
  };
};
// 操作单详情上传资料
export const fileConfirmForm = (obj) => {
  const { before_model_cols = [FILE_FORM_COL_1], after_model_cols = [] } =
    obj || {};
  return {
    title: "上传资料",
    width: "900px",
    labelWidth: "70px",
    isAttachFileId: true,
    simpleCustomCols: [
      ...before_model_cols,
      FILE_FORM_COL_5,
      ...after_model_cols,
    ],
    formRules: {},
    // rejectLists: FILE_DLG_LISTS(FILE_FORM_COL_4),
    // rejectFormRules: FILE_DLG_RULES("attachId_4")
  };
};

// 单个附件上传
export const singleFileCols = (obj) => {
  const {
    fileParamsType,
    fileLabel = "资料",
    fileKey = "attachId",
  } = obj || {};
  const FILE_FORM_COL_88 = {
    span: 24,
    id: "attachId",
    fileLabel,
    fileParamsType,
    labelWidth: "0",
    type: "customUploadFile",
    pasteUpload: true,
  };

  return {
    title: "附件上传",
    width: "470px",
    labelWidth: "72px",
    isAttachFileId: true,
    simpleCustomCols: [FILE_FORM_COL_88],
    formRules: {
      [fileKey]: [
        // 默认必填
        { required: true, message: `请上传附件`, trigger: "change" },
      ],
    },
  };
};
