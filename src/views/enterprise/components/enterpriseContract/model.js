const EDIT_DLG_COL_1 = {
  span: 24,
  id: "contractNumber",
  label: "合同号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_DLG_COL_2 = {
  span: 24,
  id: "startCreateTime",
  label: "合同时间：",
  startPlaceholder: "起始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_DLG_COL_4 = {
  span: 24,
  id: "extensionYear",
  label: "是否自动续期一年：",
  type: "radio",
  basicType: "trueOrFalse",
};
const EDIT_DLG_COL_5 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
	maxlength: 500
};
const EDIT_DLG_COL_6 = {
  span: 24,
  id: "attachId",
  labelWidth: "10px",
  type: "customUploadFile",
  pasteUpload: true,
  fileParamsType: 200, // 企业合同
};

export const customDialogCols = () => {
  return {
    title: "新增合同",
    width: "600px",
    labelWidth: "120px",
    isAttachFileId: true,
    simpleCustomCols: [
      EDIT_DLG_COL_1,
      EDIT_DLG_COL_2,
      EDIT_DLG_COL_4,
      EDIT_DLG_COL_5,
      EDIT_DLG_COL_6,
    ],
    formRules: {
      contractNumber: [
        { required: true, message: "请输入合同号", trigger: "blur" },
      ],
      startCreateTime: [
        { required: true, message: "请选择合同时间", trigger: "change" },
      ],
      attachId: [{ required: true, message: "请上传附件", trigger: "change" }],
    },
  };
};

const TABLE_COL_1 = {
  prop: "contractNumber",
  label: "合同号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "contractStartTime",
  label: "合同起始时间",
  width: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "contractEndTime",
  label: "合同结束时间",
  width: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "extensionYear",
  label: "是否自动续期",
  width: 100,
  showOverflowTooltip: true,
  basicType: "trueOrFalse",
};
const TABLE_COL_5 = {
  prop: "remark",
  label: "备注",
  minWidth: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "createTime",
  label: "创建时间",
  width: 130,
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  // fixed: "right",
  columnOperation: true,
  width: 110,
};
export const contractTableConfig = [
  {
    type: "index",
    width: 50,
    align: "center",
  },
  {
    type: "expand",
    prop: "expand",
    customRow: true,
    width: 1,
  },
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_OPERATION,
];
