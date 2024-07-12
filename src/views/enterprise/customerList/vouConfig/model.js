import { httpUserSelect, httpRoleDeptUserSelect } from "@/comModel/httpSelect";
const TABLE_COL_INDEX = {
  type: "index",
  align: "center",
  width: 50,
};
const TABLE_COL_1 = {
  prop: "customerName",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_2 = {
  prop: "approvalUserName",
  label: "核准",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_3 = {
  prop: "checkUserName",
  label: "复核",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "accountUserName",
  label: "记账",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "cashierUserName",
  label: "出纳",
  minWidth: 120,
  showOverflowTooltip: true,
};

const TABLE_COL_6 = {
  prop: "billCollectUserName",
  label: "业务单-应收",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_7 = {
  prop: "billPayUserName",
  label: "业务单-应付",
  minWidth: 120,
  showOverflowTooltip: true,
};

const TABLE_COL_8 = {
  prop: "ebillCollectUserName",
  label: "财务单-应收",
  minWidth: 120,
  showOverflowTooltip: true,
};

const TABLE_COL_9 = {
  prop: "ebillPayUserName",
  label: "财务单-应付",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_10 = {
  prop: "drawerUserName",
  label: "发票-开票人",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_11 = {
  prop: "reviewerUserName",
  label: "发票-复核人",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_12 = {
  prop: "staffApplicantName",
  label: "工资条申请人",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  minWidth: 40,
  fixed: "right",
};

export const tableLists = (row = {}) => {
  return {
    title: ["收款凭证配置", "收付款初始化人员"],
    tableColumns: [
      [
        TABLE_COL_1,
        TABLE_COL_2,
        TABLE_COL_3,
        TABLE_COL_4,
        TABLE_COL_5,
        TABLE_COL_OPERATION,
      ],
      [
        TABLE_COL_1,
        TABLE_COL_6,
        TABLE_COL_12,
        TABLE_COL_7,
        TABLE_COL_8,
        TABLE_COL_9,
				TABLE_COL_10,
				TABLE_COL_11,
        TABLE_COL_OPERATION,
      ],
    ],
  };
};

const SEARCH_FORM_1 = {
  span: 24,
  id: "customerName",
  label: "堡森公司：",
  placeholder: "请输入",
  type: "txt",
};
const SEARCH_FORM_2 = {
  span: 24,
  id: "approvalUser",
  label: "核准：",
  ...httpUserSelect(),
  selectLabelKey:"approvalUserName",
};
const SEARCH_FORM_3 = {
  span: 24,
  id: "checkUser",
  label: "复核：",
  ...httpUserSelect(),
  selectLabelKey:"checkUserName",
};
const SEARCH_FORM_4 = {
  span: 24,
  id: "accountUser",
  label: "记账：",
  ...httpUserSelect(),
  selectLabelKey:"accountUserName",
};
const SEARCH_FORM_5 = {
  span: 24,
  id: "cashierUser",
  label: "出纳：",
  ...httpUserSelect(),
  selectLabelKey:"cashierUserName",
};
const SEARCH_FORM_6 = {
  span: 24,
  id: "billCollectUserName",
  label: "业务单-收款：",
  type: "txt",
};
const SEARCH_FORM_7 = {
  span: 24,
  id: "billPayUserId",
  label: "业务单-付款：",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] }), // 只能选“财务部”角色的人
  selectLabelKey:"billPayUserName",
};
const SEARCH_FORM_8 = {
  span: 24,
  id: "ebillCollectUserId",
  label: "财务单-应收：",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] }),
  selectLabelKey:"ebillCollectUserName",
};
const SEARCH_FORM_9 = {
  span: 24,
  id: "ebillPayUserId",
  label: "财务单-应付：",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] }),
  selectLabelKey:"ebillPayUserName",
};
const SEARCH_FORM_10 = {
  span: 24,
  id: "drawerUserId",
  label: "开票人：",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] }),
  selectLabelKey:"drawerUserName",
};
const SEARCH_FORM_11 = {
  span: 24,
  id: "reviewerUserId",
  label: "复核人：",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] }),
  selectLabelKey:"reviewerUserName",
};
const SEARCH_FORM_12 = {
  span: 24,
  id: "staffApplicantId",
  label: "工资条申请人：",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] }),
  selectLabelKey:"staffApplicantName",
};
export const customDialogCols = (row={}) => {
  const {tName}=row
  return {
    title: "修改凭证配置",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      [
        SEARCH_FORM_1,
        SEARCH_FORM_2,
        SEARCH_FORM_3,
        SEARCH_FORM_4,
        SEARCH_FORM_5,
      ],
      [
        SEARCH_FORM_1,
        SEARCH_FORM_12,
        SEARCH_FORM_6,
        SEARCH_FORM_7,
        SEARCH_FORM_8,
        SEARCH_FORM_9,
				SEARCH_FORM_10,
				SEARCH_FORM_11
      ],
    ][tName],
    formRules: {
      // xx_502: [
      //   { required: true, message: `请输入库存`, trigger: "blur" }
      // ]
    },
  };
};
