import {
  httpRoleDeptUserSelect,
  httpAccountSubjectSelect,
  httpStaffDetail,
  httpGetListDept,
  httpGetOperateMainList,
  httpCompanySelect,
  httpCustomerSelect,
} from "@/comModel/httpSelect";
import {
  httpWarehousePublicSelect,
  httpCurrentWarehouseSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import { getDictObj } from "@/utils/index";
import { logisticsProductList } from "@/api/warehouse/basic";

const FORM_COLS_1 = {
  id: "beginTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_2 = {
  id: "nameCn",
  label: "公司名称：",
  placeholder: "输入公司名称/简称/代码",
  type: "text",
};
const FORM_COLS_3 = {
  id: "status",
  label: "客户状态：",
  placeholder: "客户状态",
  type: "select",
  basicType: "customerStatus",
  hideList: [4, 5],
  multiple: true,
};
const FORM_COLS_4 = {
  id: "userStatus",
  label: "账号状态：",
  placeholder: "账号状态",
  type: "select",
  basicType: "accountStatus",
};
const FORM_COLS_5 = {
  id: "level",
  label: "客户等级：",
  placeholder: "客户等级",
  type: "select",
  multiple: true,
  basicType: "level",
};
const FORM_COLS_6 = {
  id: "salesmanId",
  label: "业务员：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
};
const FORM_COLS_7 = {
  id: "nameCn",
  label: "员工姓名/昵称：",
  placeholder: "请输入",
  type: "text",
};
const FORM_COLS_8 = {
  id: "status",
  label: "员工状态：",
  placeholder: "请选择员工状态",
  type: "select",
  dicsStr: "staff_status",
  customDicsArr: [2, 3, 6, 7, 5],
};
const FORM_COLS_9 = {
  id: "status",
  label: "子公司状态：",
  placeholder: "请选择子公司状态",
  multiple: true,
  type: "select",
  basicType: "customerStatus",
};
const FORM_COLS_10 = {
  id: "settleCycle",
  label: "结算周期：",
  placeholder: "请选择结算周期",
  type: "select",
  showOverflowTooltip: true,
  basicType: "accountCycle",
  basicTypeVal: "settleCycle",
  // 全部，半月结，月结，预付，签收结，周结
};
const FORM_COLS_11 = {
  id: "categoryLike",
  label: "供应商类型：",
  placeholder: "请选择供应商类型",
  type: "select",
  basicType: "supplierType",
  // dicsStr: 'supplier_type',
  // customDicsArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};
const FORM_COLS_12 = {
  id: "businessOwnership",
  label: "客户归属：",
  placeholder: "请选择",
  ...httpAccountSubjectSelect(),
};
const FORM_COLS_13 = {
  id: "userStatus",
  label: "用户状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "normalShutdown",
};
const FORM_COLS_14 = {
  id: "deptId",
  label: "所在部门：",
  placeholder: "请选择",
  ...httpGetListDept(),
};
const FORM_COLS_15 = {
  id: "operateMain",
  label: "所属公司：",
  placeholder: "请选择",
  ...httpCompanySelect({ status: "0,1,2,3,4,5", isQueryFirstDept: 1 }),
};
const FORM_COLS_16 = {
  id: "wmsMainId",
  label: "包含仓库：",
  placeholder: "请选择",
  ...httpWarehousePublicSelect(),
};
const FORM_COLS_17 = {
  id: "customerId",
  label: "企业信息：",
  placeholder: "请选择",
  ...httpCustomerSelect(),
};
const FORM_COLS_18 = {
  id: "apiType",
  label: "配置类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "apiType",
};
const FORM_COLS_19 = {
  id: "state",
  label: "状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "apiConfigState",
};
const FORM_COLS_20 = (options) => ({
  id: "roleIds",
  label: "客户角色：",
  placeholder: "客户角色(多选)",
  type: "select",
  multiple: true,
  options,
});
// -----------------------------------------------
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COLS_1 = {
  prop: "nameCn",
  label: "公司名称",
  align: "left",
  minWidth: 130,
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "shortName",
  label: "简称",
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "code",
  label: "代码",
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "level",
  label: "等级",
  align: "center",
  sortable: true,
  basicType: "level",
  basicTypeVal: "level",
};
const TABLE_COLS_5 = {
  prop: "clientIdentity",
  label: "身份",
  showOverflowTooltip: true,
  // sortable: true,
  basicType: "clientIdentity",
  render: (cRow, cNameCn) => {
    if (cRow.clientIdentity && cRow.clientIdentity.includes(",")) {
      return (
        getDictObj("clientIdentity", cRow.clientIdentity).join(", ") || "--"
      );
    }
    return cNameCn;
  },
};
const TABLE_COLS_6 = {
  prop: "categoryName",
  label: "客户类别",
  align: "left",
  showOverflowTooltip: true,
  // basicType: "clientCategory",
  // basicTypeVal: "category",
};
const TABLE_COLS_7 = {
  prop: "source",
  label: "客户来源",
  showOverflowTooltip: true,
  sortable: true,
  basicType: "clientSource",
  basicTypeVal: "source",
};
const TABLE_COLS_8 = {
  prop: "businessOwnershipName",
  label: "业务归属",
  align: "left",
  minWidth: 100,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COLS_9 = {
  prop: "salesman",
  label: "业务员",
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "status",
  label: "客户状态",
  align: "left",
  customRow: true,
  sortable: true,
  minWidth: 120,
  basicType: "customerStatus",
  basicTypeVal: "status",
};
const TABLE_COLS_11 = {
  prop: "userStatus",
  label: "账号状态",
  align: "left",
  customRow: true,
  sortable: true,
  minWidth: 100,
  basicType: "accountStatus",
  basicTypeVal: "userStatus",
};
const TABLE_COLS_12 = {
  prop: "createBy",
  label: "创建人",
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COLS_13 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 160,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COLS_14 = {
  prop: "UNCHARTED_TABLE_14",
  label: "状态",
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COLS_15 = {
  prop: "UNCHARTED_TABLE_15",
  label: "子公司状态",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "UNCHARTED_TABLE_16",
  label: "供应商名称",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "settleCycle",
  label: "结算周期",
  basicType: "accountCycle",
  basicTypeVal: "settleCycle",
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  prop: "categoryName",
  label: "供应商类别",
  minWidth: 112,
  sortable: true,
  // basicType: "supplierType",
  // dicsStr: 'supplier_type',
  // customDicsArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "nameEn",
  label: "员工名称",
  align: "left",
  customRow: true,
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  prop: "nameCn",
  label: "员工昵称",
  align: "left",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_21 = {
  prop: "deptName",
  label: "所在部门",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  prop: "businessOwnershipName",
  label: "所属公司",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_23 = {
  prop: "userStatus",
  label: "用户状态",
  sortable: true,
  fontColor: true,
  showOverflowTooltip: true,
  basicType: "normalShutdown",
};
const TABLE_COLS_24 = {
  prop: "remark",
  label: "备注",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_25 = {
  prop: "wmsName",
  label: "包含仓库",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_27 = {
  prop: "associatedEnterprise",
  label: "关联企业",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_28 = {
  prop: "isContract",
  label: "是否有合同",
  sortable: true,
  width: 112,
  showOverflowTooltip: true,
  basicType: "trueOrFalse",
};
const TABLE_COLS_29 = {
  prop: "entryTime",
  label: "入职时间",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_30 = {
  prop: "departTime",
  label: "离职时间",
  sortable: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_32 = {
  prop: "isJoinBs",
  label: "双向费用",
  sortable: true,
  yesOrNo: true,
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_31 = {
  prop: "phone",
  label: "手机号码",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_33 = {
  prop: "customerName",
  label: "公司名称",
  sortable: true,
  columnLink: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_34 = {
  prop: "apiType",
  label: "配置类型",
  sortable: true,
  showOverflowTooltip: true,
  basicType: "apiType",
};
const TABLE_COLS_35 = {
  prop: "timingFrequency",
  label: "定时频率",
  sortable: true,
  showOverflowTooltip: true,
  basicType: "apiTimingFrequency",
};
const TABLE_COLS_36 = {
  prop: "baseUrl",
  label: "访问地址",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_37 = {
  prop: "businessKey",
  label: "USER",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_38 = {
  prop: "salesmanName",
  label: "业务员",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_39 = {
  prop: "operateMainName",
  label: "业务归属",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_40 = {
  prop: "updateTime",
  label: "最后修改时间",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_41 = {
  prop: "state",
  label: "状态",
  sortable: true,
  showOverflowTooltip: true,
  dotColor: true,
  basicType: "apiConfigState",
};

const TABLE_COLS_42 = {
  prop: "wmsName",
  label: "仓库",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_43 = {
  prop: "deliveryChannelName",
  label: "物流产品",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_44 = {
  prop: "roleName",
  label: "客户角色",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  customRow: true,
  // columnOperation:true,
  fixed: "right",
  width: "200px",
};
const customerFormCols = (roleOption) => [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_20(roleOption),
  FORM_COLS_6,
  FORM_COLS_12,
];

export const customer = (roleOption = []) => ({
  //客户列表
  fold: true,
  searchNum: customerFormCols(roleOption).length,
  formLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: customerFormCols(roleOption),
            },
          ],
        },
      ],
    },
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_6,
    TABLE_COLS_28,
    TABLE_COLS_8,
    TABLE_COLS_9,
    TABLE_COLS_44,
    TABLE_COLS_10,
    TABLE_COLS_11,
    {
      ...TABLE_COLS_OPERATION,
      customRow: false,
      columnOperation: true,
      columnMoreOperation: true,
      width: 155,
    },
  ],
});

export const enterpriseConfig = {
  fold: true,
  searchNum: 4,
  formLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_17, FORM_COLS_18, FORM_COLS_6, FORM_COLS_19],
            },
          ],
        },
      ],
    },
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_33,
    TABLE_COLS_34,
    TABLE_COLS_42,
    TABLE_COLS_43,
    // TABLE_COLS_35,
    TABLE_COLS_36,
    TABLE_COLS_37,
    TABLE_COLS_38,
    TABLE_COLS_39,
    TABLE_COLS_40,
    {
      ...TABLE_COLS_12,
      prop: "createUserName",
    },
    TABLE_COLS_41,
    {
      ...TABLE_COLS_OPERATION,
      customRow: false,
      columnOperation: true,
      columnMoreOperation: true,
      width: 155,
    },
  ],
};

const supplierFormCols = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_10,
  {
    ...FORM_COLS_9,
    hideList: [4, 5],
    label: "供应商状态：",
    placeholder: "请选择供应商状态",
  },
  FORM_COLS_11,
];
export const supplier = {
  //服务商列表
  fold: true,
  searchNum: supplierFormCols.length,
  formLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: supplierFormCols,
            },
          ],
        },
      ],
    },
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    {
      ...TABLE_COLS_1,
      label: "供应商名称",
    },
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_17,
    TABLE_COLS_18,
    TABLE_COLS_28,
    {
      ...TABLE_COLS_10,
      label: "状态",
    },
    TABLE_COLS_12,
    TABLE_COLS_13,
    TABLE_COLS_OPERATION,
  ],
};

const subsidiaryFormCols = [
  FORM_COLS_1,
  FORM_COLS_2,
  {
    ...FORM_COLS_9,
    hideList: [4, 5],
  },
  FORM_COLS_16,
];
export const subsidiary = {
  //堡森列表
  fold: false,
  searchNum: subsidiaryFormCols.length,
  formLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: subsidiaryFormCols,
            },
          ],
        },
      ],
    },
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_5,
    TABLE_COLS_25,
    TABLE_COLS_27,
    // TABLE_COLS_12,
    TABLE_COLS_32,
    TABLE_COLS_13,
    {
      ...TABLE_COLS_10,
      label: "子公司状态",
    },
    TABLE_COLS_OPERATION,
  ],
};

const staffFormCols = [
  FORM_COLS_1,
  FORM_COLS_7,
  {
    ...FORM_COLS_9,
    label: "员工状态：",
    hideList: [1, 2, 3],
    placeholder: "请选择员工状态",
  },
  FORM_COLS_15,
  FORM_COLS_13,
  FORM_COLS_14,
];
export const staff = {
  //员工列表
  fold: true,
  searchNum: staffFormCols.length,
  formLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: staffFormCols,
            },
          ],
        },
      ],
    },
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_19,
    TABLE_COLS_20,
    TABLE_COLS_21,
    TABLE_COLS_22,
    TABLE_COLS_23,
    TABLE_COLS_24,
    TABLE_COLS_12,
    TABLE_COLS_13,
    {
      ...TABLE_COLS_10,
      label: "员工状态",
    },
    TABLE_COLS_29,
    TABLE_COLS_30,
    TABLE_COLS_31,
    TABLE_COLS_OPERATION,
  ],
};

const DIALOG_COLS_1 = {
  span: 24,
  id: "relationUserId",
  label: "选择员工：",
  placeholder: "请选择",
};
const DIALOG_COLS_2 = {
  span: 24,
  id: "deptName",
  label: "所在部门：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_3 = {
  span: 24,
  id: "businessOwnershipName",
  label: "所属公司：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_4 = {
  span: 24,
  id: "userStatus",
  label: "用户状态：",
  placeholder: "--",
  basicType: "normalShutdown",
  fontColor: true,
  type: "txt",
};
const DIALOG_COLS_5 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
};
const DIALOG_COLS_6 = {
  span: 24,
  id: "entryTime",
  label: "入职时间：",
  placeholder: "请选择",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
// const DIALOG_COLS_7 = {
//   span: 24,
//   id: "UNCHARTED_DIALOG_7",
//   label: "结算周期：",
//   placeholder: "请选择",
//   type: "select",
//   basicType: "accountCycle",
// };
const DIALOG_COLS_NBSP = {
  id: "businessOwnership",
  type: "slot",
};
export const staffDialogCols = (row, type) => {
  const { handleChange, handleGetSearchOptions, id } = row;
  return {
    title: type == "add" ? "新增员工" : "修改员工信息",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      {
        ...DIALOG_COLS_1,
        handle: handleChange,
        getSearchOptions: handleGetSearchOptions,
        ...httpStaffDetail({
          isQueryStaff: 1,
          isQueryFirstDept: 1,
          otherUserId: type == "add" ? undefined : id,
        }),
      },
      DIALOG_COLS_2,
      DIALOG_COLS_3,
      DIALOG_COLS_4,
      DIALOG_COLS_6,
      // DIALOG_COLS_7,
      DIALOG_COLS_5,
      DIALOG_COLS_NBSP,
    ],
    formRules: {
      relationUserId: [
        { required: true, message: `请选择员工`, trigger: "change" },
      ],
      // UNCHARTED_DIALOG_7: [
      //   { required: true, message: `请选择结算周期`, trigger: "change" },
      // ],
    },
  };
};

const DIALOG_COLS_7 = {
  span: 24,
  id: "departTime",
  label: "离职时间：",
  placeholder: "请选择",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};

export const departDialogCols = (row = {}) => {
  return {
    title: "禁用",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [DIALOG_COLS_7],
    formRules: {
      departTime: [
        { required: true, message: `请选择离职时间`, trigger: "change" },
      ],
    },
  };
};

const ERP_DIALOG_1 = {
  span: 24,
  id: "customerId",
  label: "企业信息：",
  placeholder: "请输入",
  selectLabelKey: "customerName",
  ...httpCustomerSelect(),
};
const ERP_DIALOG_2 = {
  span: 24,
  id: "apiType",
  label: "配置类型：",
  placeholder: "请选择",
  type: "radio",
  basicType: "apiType",
};
const ERP_DIALOG_3 = {
  span: 24,
  id: "baseUrl",
  label: "访问地址：",
  placeholder: "请输入",
  type: "text",
};
const ERP_DIALOG_4 = {
  span: 24,
  id: "apiKey",
  label: "Key：",
  placeholder: "请输入",
  type: "text",
};
const ERP_DIALOG_5 = {
  span: 24,
  id: "apiSecret",
  label: "Token：",
  placeholder: "请输入",
  type: "text",
};
const ERP_DIALOG_6 = {
  span: 24,
  id: "wmsId",
  label: "仓库：",
  placeholder: "请输入",
  ...httpCurrentWarehouseSelect(),
};
const ERP_DIALOG_7 = {
  span: 24,
  id: "businessKey",
  label: "UserName：",
  placeholder: "请输入",
  type: "text",
};
const ERP_DIALOG_8 = {
  span: 24,
  id: "businessSecret",
  label: "Passward：",
  placeholder: "请输入",
  type: "text",
};
const ERP_DIALOG_9 = {
  span: 24,
  id: "timingFrequency",
  label: "定时频率：",
  placeholder: "请输入",
  type: "select",
  basicType: "apiTimingFrequency",
};
const ERP_DIALOG_10 = {
  span: 24,
  id: "deliveryChannelId",
  label: "物流产品：",
  placeholder: "请选择物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power: true,
  }),
};

export const erpAddDialogCols = () => {
  return {
    title: "API授权",
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols: [
      ERP_DIALOG_1,
      ERP_DIALOG_2,
      ERP_DIALOG_3,
      ERP_DIALOG_5,
      ERP_DIALOG_7,
      ERP_DIALOG_8,
      ERP_DIALOG_4,
      ERP_DIALOG_6,
      ERP_DIALOG_10,
      // ERP_DIALOG_9
    ],
    formRules: {
      customerId: [
        { required: true, message: `请选择企业信息`, trigger: "change" },
      ],
      baseUrl: [
        { required: true, message: `请输入访问地址`, trigger: "change" },
      ],
    },
  };
};

const SYNC_DIALOG_1 = {
  span: 24,
  id: "customerName",
  label: "企业信息：",
  placeholder: "--",
  type: "txt",
};

// const SYNC_DIALOG_2={
//   span: 24,
//   id: "startDate",
//   label: '拉商品开始日期：',
//   placeholder: "请选择：",
//   type: "date",
//   valueFormat: "yyyy-MM-dd",
// }
// const SYNC_DIALOG_3={
//   span: 24,
//   id: "endDate",
//   label: '拉商品结束日期：',
//   placeholder: "请选择：",
//   type: "date",
//   valueFormat: "yyyy-MM-dd",
// }
const SYNC_DIALOG_4 = {
  span: 24,
  id: "dateRange",
  label: "调用区间段：",
  placeholder: "请选择：",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SYNC_DIALOG_5 = {
  span: 24,
  id: "syncTips",
  labelWidth: "30px",
  type: "slot",
};
export const syncDialogCols = () => {
  return {
    title: "同步订单",
    width: "600px",
    labelWidth: "115px",
    simpleCustomCols: [
      SYNC_DIALOG_1,
      ERP_DIALOG_2,
      // SYNC_DIALOG_2,
      // SYNC_DIALOG_3,
      SYNC_DIALOG_4,
      SYNC_DIALOG_5,
    ],
    formRules: {
      // startDate: [
      //   { required: true, message: `请选择拉商品开始日期`, trigger: "change" }
      // ],
      // endDate: [
      //   { required: true, message: `请选择拉商品结束日期`, trigger: "change" }
      // ],
      dateRange: [
        { required: true, message: `请选择调用区间段`, trigger: "change" },
      ],
    },
  };
};

const PRODUCT_DIFF_DIALOG_1 = {
  span: 24,
  id: "productTable",
  labelWidth: "0px",
  type: "slot",
};
const PRODUCT_DIFF_DIALOG_2 = {
  span: 24,
  id: "productTips",
  labelWidth: "0px",
  type: "slot",
};

export const productDiffDialogCols = () => {
  return {
    title: "商品差异",
    width: "800px",
    labelWidth: "115px",
    simpleCustomCols: [
      PRODUCT_DIFF_DIALOG_2,
      {
        ...SYNC_DIALOG_1,
        render: (row = {}) => {
          const { name = "", customerName = "" } = row;
          return `${customerName || "--"}${name ? `(${name})` : ""}`;
        },
      },
      PRODUCT_DIFF_DIALOG_1,
    ],
    formRules: {},
  };
};

const PRODUCT_DIFF_COLS_1 = {
  prop: "type",
  label: "类型",
  basicType: "apiProductDifferenceType",
  showOverflowTooltip: true,
};
const PRODUCT_DIFF_COLS_2 = {
  prop: "erpSku",
  label: "客户商品编码",
  minWidth: 120,
  showOverflowTooltip: true,
};
const PRODUCT_DIFF_COLS_3 = {
  prop: "erpInventory",
  label: "客户库存",
  showOverflowTooltip: true,
};
const PRODUCT_DIFF_COLS_4 = {
  prop: "productName",
  label: "堡森云商品SKU",
  minWidth: 120,
  showOverflowTooltip: true,
};
const PRODUCT_DIFF_COLS_5 = {
  prop: "inventory",
  label: "堡森云库存",
  minWidth: 120,
  showOverflowTooltip: true,
};
const PRODUCT_DIFF_COLS_6 = {
  prop: "wmsName",
  label: "堡森云仓",
  minWidth: 120,
  showOverflowTooltip: true,
};
export const productDiffTableColumns = [
  TABLE_COLS_INDEX,
  PRODUCT_DIFF_COLS_1,
  PRODUCT_DIFF_COLS_2,
  PRODUCT_DIFF_COLS_3,
  PRODUCT_DIFF_COLS_6,
  PRODUCT_DIFF_COLS_4,
  PRODUCT_DIFF_COLS_5,
];
