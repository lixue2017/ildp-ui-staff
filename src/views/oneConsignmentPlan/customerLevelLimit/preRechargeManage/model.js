import {
  httpUserSelect,
  httpGetCostBindCustomer,
  httpgetCustlist,
  httpCompanySelect,
  httpPOSTCusList,
  httpPOSTBaAccount,
  httpPOSTcrmAddress,
  httpAccountSelect,
} from "@/comModel/httpSelect";

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COL_2 = {
  id: "customerId",
  label: "关联客户：",
  type: "text",
  placeholder: "请选择关联客户",
  ...httpGetCostBindCustomer(),
};

const SEARCH_COL_3 = {
  startId: "minMoney",
  endId: "maxMoney",
  label: "充值金额：",
  startPlaceholder: "充值金额≤",
  endPlaceholder: "≤充值金额",
  type: "rangeSelect",
};

const SEARCH_COL_4 = {
  id: "state",
  label: "状态：",
  type: "select",
  placeholder: "请选择状态",
  basicType: "preRechargeStatus",
};

const SEARCH_COL_5 = {
  id: "waterTime",
  label: "水单时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const SEARCH_COL_6 = {
  id: "customerAccountId",
  label: "客户账号：",
  placeholder: "请选择客户账号",
  // ...httpgetCustlist(),
  ...httpAccountSelect({type:"1"}),
};

const SEARCH_COL_7 = {
  id: "bsCollectionAccountId",
  label: "堡森账号：",
  placeholder: "请选择堡森账号",
  ...httpAccountSelect({type:'0'}),
};

const SEARCH_COL_8 = {
  id: "createUserId",
  label: "创建人：",
  type: "text",
  placeholder: "请选择创建人",
  ...httpUserSelect(),
};

export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              SEARCH_COL_2,
              SEARCH_COL_3,
              SEARCH_COL_4,
              SEARCH_COL_5,
              SEARCH_COL_6,
              SEARCH_COL_7,
              SEARCH_COL_8,
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COL_INDEX = {
  type: "index",
  width: 55,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "customerName",
  label: "企业名称",
  showOverflowTooltip: true,
  minWidth:120,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "shortName",
  label: "企业简称",
  minWidth:120,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "customerCode",
  label: "企业代码",
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "applicationAmount",
  label: "充值",
  decimal: 3,
  colFormat: "thousandthMark",
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "applicationCurrencyType",
  label: "申请币别",
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "customerAccount",
  label: "客户账号",
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "bsCollectionAccount",
  label: "堡森收款账号",
  showOverflowTooltip: true,
  minWidth: 160,
};
const TABLE_COL_8 = {
  prop: "waterOrderTime",
  label: "水单时间",
  minWidth:140,
  showOverflowTooltip: true,
};
const TABLE_COL_9 = {
  prop: "createTime",
  label: "创建时间",
  minWidth:140,
  showOverflowTooltip: true,
};

const TABLE_COL_10 = {
  prop: "createBy",
  label: "创建人",
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "auditRecords",
  label: "审核记录",
  showOverflowTooltip: true,
  customRow: true,
};
const TABLE_COL_12 = {
  prop: "state",
  label: "状态",
  dotColor: true,
  showOverflowTooltip: true,
  fixed: "right",
  basicType: "preRechargeStatus",
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  minWidth: "120px",
  fixed: "right",
};
export const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_OPERATION,
];

const DIALOG_ADD_COL_1 = {
  span: 12,
  id: "customerId",
  label: "充值客户：",
  placeholder: "请选择",
  ...httpPOSTCusList(),
  type: "slot",
};
const DIALOG_ADD_COL_2 = {
  span: 12,
  id: "customerAccountId",
  label: "客户账号：",
  placeholder: "请选择",
  // ...httpPOSTcrmAddress(),
  ...httpAccountSelect(),
  showCreate: true,
  type: "slot",
};
const DIALOG_ADD_COL_3 = {
  span: 12,
  id: "bsCollectionAccountId",
  label: "BS账号：",
  placeholder: "请选择",
  ...httpPOSTBaAccount(),
  type: "slot",
};
const DIALOG_ADD_COL_4 = {
  span: 12,
  id: "applicationAmount",
  label: "充值金额：",
  decimal: 2,
  type: "slot",
};
const DIALOG_ADD_COL_5 = {
  span: 12,
  id: "waterOrderTime",
  label: "水单时间：",
  placeholder: "请选择水单时间",
  type: "date",
  valueFormat: "yyyy-MM-dd HH:mm:ss"
};
const DIALOG_ADD_COL_6 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  type: "textarea",
  maxlength:400,
};

const DIALOG_ADD_COL_7 = {
  span: 24,
  id: "attachId",
  labelWidth: "0",
  fileLabel: "上传图片",
  type: "customUploadFile",
  imageCardUrl: "url",
  pasteUpload: true,
};
const DIALOG_ADD_COL_SLOT = {
  span: 12,
  type: "slot",
};
export const customDialogCols = () => {
  return {
    title: "预充值",
    width: "700px",
    // labelWidth: '105px',
    isAttachFileId: true,
    simpleCustomCols: [
      DIALOG_ADD_COL_1,
      DIALOG_ADD_COL_SLOT,
      DIALOG_ADD_COL_2,
      DIALOG_ADD_COL_3,
      DIALOG_ADD_COL_4,
      DIALOG_ADD_COL_5,
      DIALOG_ADD_COL_6,
      DIALOG_ADD_COL_7,
    ],
    formRules: {
      attachId: [{ required: true, message: `请上传图片`, trigger: "change" }],
      customerId: [
        { required: true, message: `请选择充值客户`, trigger: "change" },
      ],
      bsCollectionAccountId: [
        { required: true, message: `请选择BS账号`, trigger: "change" },
      ],
      applicationAmount: [
        { required: true, message: `请选择充值金额`, trigger: "change" },
      ],
      waterOrderTime: [
        { required: true, message: `请选择水单时间`, trigger: "change" },
      ],
      customerAccountId: [
        { required: true, message: `请选择客户账号`, trigger: "change" },
      ],
    },
  };
};
