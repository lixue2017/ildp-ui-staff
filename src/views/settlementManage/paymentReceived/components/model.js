import {
  httpAllDealingCompanySelect,
  httpUserSelect,
  httpLogisticsCustomerSelect,
  httpRoleDeptUserSelect,
} from "@/comModel/httpSelect";
const FORM_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};

const FORM_COLS_2 = {
  id: "applicant",
  label: "申请人：",
  selectLabelKey: "applicantName",
  ...httpRoleDeptUserSelect(),
};
const FORM_COLS_3 = {
  id: "dealingsCompany",
  label: "收款单位：",
  placeholder: "请选择领款人或收款单位",
  ...httpAllDealingCompanySelect(),
};
const FORM_COLS_4 = {
  id: "status",
  label: "核销状态：",
  type: "select",
  multiple: true,
  placeholder: "请选择",
  // dicsStr: 'verification_status',
};
const FORM_COLS_4_1 = {
  ...FORM_COLS_4,
  basicType: "expenseStatus",
  hideList: [0],
};
const FORM_COLS_4_2 = {
  ...FORM_COLS_4,
  basicType: "RVPStatus",
  hideList: [65, 100, 55],
  // dicsStr: 'verification_status',
  // customDicsArr: [2, 3, 4, 5]
};
const FORM_COLS_5 = {
  id: "businessCompany",
  label: "主体：",
  selectLabelKey: "businessCompanyName",
  placeholder: "请选择主体或付款单位",
  ...httpLogisticsCustomerSelect(),
};
const FORM_COLS_6 = {
  startId: "startMoney",
  endId: "endMoney",
  label: "金额：",
  startPlaceholder: "金额≤",
  endPlaceholder: "≤金额",
  type: "rangeSelect",
};
const FORM_COLS_7 = {
  id: "type",
  label: "类型：",
  type: "select",
  placeholder: "请选择",
  basicType: "expenseType",
  multiple: true,
};
const FORM_COLS_8 = {
  id: "billNo",
  label: "报销单号：",
  type: "text",
  placeholder: "请输入报销单号",
  maxlength: 2000,
};
const FORM_COLS_9 = {
  id: "auditBySearch",
  label: "审核人：",
  placeholder: "请选择审核人",
  selectLabelKey: "auditByName",
  ...httpUserSelect(),
};
const FORM_COLS_10 = {
  id: "taskBySearch",
  label: "任务所属人：",
  placeholder: "请选择任务所属人",
  selectLabelKey: "taskByName",
  ...httpUserSelect(),
};
const SEARCH_FORM_COL_101 = {
  id: "dealingsCompany",
  label: "领款人：",
  placeholder: "请输入领款人或收款单位",
  type: "text",
};
const SEARCH_FORM_COL_102 = {
  id: "flowType",
  label: "流程：",
  type: "select",
  placeholder: "请选择",
  basicType: "expenseFlow",
  hideList: [1, 2, 4],
};
const FORM_COLS_11 = {
  id: "dealDate",
  label: "交易时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_12 = {
  id: "createId",
  label: "创建人：",
  selectLabelKey: "createByName",
  ...httpRoleDeptUserSelect(),
};
const FORM_COLS_13 = {
  id: "bankReceiptCode",
  label: "水单号：",
  placeholder: "请输入水单号",
  type: "text",
};
const FORM_COLS_14 = {
  id: "dealingsCompanyName",
  label: "收款单位：",
  placeholder: "请输入领款人或收款单位",
  type: "text",
};
// Form
// ----------------------------------------
// table
const TABLE_COLS_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "serialCode",
  label: "流水号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 170,
  customRow: true,
  fixed: "left",
};
const TABLE_COLS_2 = {
  prop: "typeName",
  label: "类型",
  showOverflowTooltip: true,
  sortable: true,
  // basicType: 'expenseType'
};
const TABLE_COLS_3 = {
  prop: "applyDeptName",
  label: "报销部门",
  showOverflowTooltip: true,
  sortable: true,
  width: 100,
};
const TABLE_COLS_4 = {
  prop: "billNo",
  label: "报销单号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 130,
};
const TABLE_COLS_5 = {
  // prop: "UNCHARTED_TABLE_5",
  // label: "费用类型",
  // showOverflowTooltip: true,
  // sortable: true,
  // align: "center",
  // width: 100
};
const TABLE_COLS_6 = {
  prop: "costName",
  label: "费用类型",
  showOverflowTooltip: true,
  sortable: true,
  width: 100,
};
const TABLE_COLS_7 = {
  prop: "currencyCode",
  label: "币别",
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COLS_8 = {
  prop: "totalMoney",
  label: "金额",
  width: 100,
  showOverflowTooltip: true,
  sortable: true,
  decimal: 2,
  colFormat: "thousandthMark",
  align: "right",
};
const TABLE_COLS_9 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true,
  width: 180,
  // sortable: true,
};
const TABLE_COLS_10 = {
  prop: "claimByName",
  label: "领款人",
  showOverflowTooltip: true,
  // sortable: true,
  width: 100,
  render: (row) => {
    return row.claimByName || row.applicantName || "--";
  },
};
const TABLE_COLS_11 = {
  prop: "businessCompanyName",
  label: "主体",
  width: 120,
  showOverflowTooltip: true,
  sortable: true,
};
const TABLE_COLS_12 = {
  prop: "createBy",
  label: "创建人",
  showOverflowTooltip: true,
  sortable: true,
  width: 100,
};
const TABLE_COLS_13 = {
  prop: "status",
  label: "状态",
  showOverflowTooltip: true,
  sortable: true,
  dotColor: true,
  width: 110,
  basicType: "expenseStatus",
};
const TABLE_COLS_14 = {
  prop: "flowType",
  label: "流程",
  showOverflowTooltip: true,
  sortable: true,
  basicType: "expenseFlow",
  hideList: [4],
  minWidth: 100,
};
const TABLE_COLS_15 = {
  prop: "taskByName",
  label: "任务所属人",
  showOverflowTooltip: true,
  // sortable: true,
  width: 100,
};
const TABLE_COLS_16 = {
  prop: "createBy",
  label: "创建人",
  showOverflowTooltip: true,
  width: 100,
};
const TABLE_COLS_17 = {
  prop: "createTime",
  label: "创建时间",
  showOverflowTooltip: true,
  sortable: true,
  width: 142,
};
const TABLE_COLS_18 = {
  prop: "applicantName",
  label: "申请人",
  showOverflowTooltip: true,
  // sortable: true,
  width: 100,
};
const TABLE_COLS_19 = {
  prop: "auditByName",
  label: "审核人",
  showOverflowTooltip: true,
  // sortable: true,
  width: 100,
};
const TABLE_COLS_20 = {
  prop: "monthBy",
  label: "账单所属月份",
  showOverflowTooltip: true,
  // sortable: true,
  width: 100,
};
const TABLE_COLS_21 = {
  prop: "bankReceiptCode",
  label: "水单号",
  showOverflowTooltip: true,
  width: 120,
};
const TABLE_COLS_22 = {
  prop: "costName",
  label: "费用名称",
  showOverflowTooltip: true,
  width: 120,
};
const TABLE_COL_23 = {
  prop: "bxMoney",
  label: "佰信核销",
  showOverflowTooltip: true,
  minWidth: 130,
  decimal: 2,
  sortable: true,
};
const TABLE_COL_24 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true,
};
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  width: 160,
  customRow: true,
  fixed: "right",
};

const TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  width: 156,
  columnOperation: true,
  fixed: "right",
};

const publicForm = [
  // FORM_COLS_1,//创建时间
  // FORM_COLS_2,//申请人
  FORM_COLS_5, //付款单位
  FORM_COLS_6, //金额
  FORM_COLS_7, //类型
  FORM_COLS_8, //报销单号
];
const publicTable = [
  TABLE_COLS_INDEX,
  {
    ...TABLE_COLS_4,
    customRow: true,
    fixed: "left",
  }, //报销单号
  TABLE_COLS_2, //类型
  TABLE_COLS_14, //流程
  TABLE_COLS_3, //报销部门
  // TABLE_COLS_7,//币别
  // TABLE_COLS_8,//金额
  // TABLE_COLS_OPERATION//操作栏
];
const userCostForm = [
  FORM_COLS_1, //创建时间
  FORM_COLS_5, //付款单位
  {
    ...FORM_COLS_8,
    residueCol: 2,
  }, //报销单号
  FORM_COLS_11, //交易时间
  SEARCH_FORM_COL_101, //收款单位
  FORM_COLS_7, //类型
  {
    ...FORM_COLS_4,
    basicType: "expenseStatus",
  }, //状态
  FORM_COLS_6, //金额
  FORM_COLS_13,
  FORM_COLS_2, //申请人
  FORM_COLS_12, //创建人
];
const userCostExpenses = {
  //我的-财务报销
  search: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: userCostForm,
            },
          ],
        },
      ],
    },
  ],
  // 挂账单
  searchGZD: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                ...userCostForm,
                FORM_COLS_10, //任务所属人
              ],
            },
          ],
        },
      ],
    },
  ],
  columnConfigFirst: [
    TABLE_COLS_INDEX,
    {
      ...TABLE_COLS_4,
      customRow: true,
      fixed: "left",
      minWidth: 175,
    }, //报销单号
    TABLE_COLS_2, //类型
    TABLE_COLS_14, //流程
    {
      ...TABLE_COLS_6,
      label: "费用名称",
    }, //费用名称
    TABLE_COLS_3, //报销部门
    TABLE_COLS_8, //金额
    {
      ...TABLE_COLS_8,
      prop: "verificationMoney",
      label: "已核销",
      width: 105,
    }, //已核销金额
    TABLE_COLS_7, //币别
    TABLE_COLS_21,
    TABLE_COLS_10, //领款人
    TABLE_COLS_11, //主体（付款单位）
    TABLE_COLS_15, //任务所属人
    TABLE_COLS_17, //创建时间
    TABLE_COLS_18, //申请人
    TABLE_COLS_16, //创建人
    {
      ...TABLE_COLS_13,
      fixed: "right",
    }, //状态
    TABLE_COL_OPERATION, //操作栏
  ],
  columnConfigSecond: [
    TABLE_COLS_INDEX,
    {
      ...TABLE_COLS_4,
      customRow: true,
      fixed: "left",
      minWidth: 175,
    }, //报销单号
    TABLE_COLS_2, //类型
    TABLE_COLS_14, //流程
    TABLE_COLS_3, //报销部门
    TABLE_COLS_8, //金额
    {
      ...TABLE_COLS_8,
      prop: "verificationMoney",
      label: "已核销",
      width: 105,
    }, //已核销金额
    TABLE_COLS_7, //币别
    TABLE_COLS_21,
    TABLE_COLS_10, //领款人
    TABLE_COLS_11, //主体（付款单位）
    TABLE_COLS_15, //任务所属人
    TABLE_COLS_17, //创建时间
    TABLE_COLS_18, //申请人
    TABLE_COLS_16, //创建人
    {
      ...TABLE_COLS_13,
      fixed: "right",
    }, //状态
    TABLE_COL_OPERATION, //操作栏
  ],
};

const reviewCostExpenses = {
  //审核-财务报销
  OTSearch: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1, //创建时间
                FORM_COLS_12, //创建人
                {
                  ...FORM_COLS_8,
                  residueCol: 2,
                }, //报销单号
                FORM_COLS_6, //金额
                FORM_COLS_7, //类型
                FORM_COLS_3, //收款单位
                FORM_COLS_5, //付款单位
                FORM_COLS_10, //任务所属人
              ],
            },
          ],
        },
      ],
    },
  ],
  TTSearch: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1, //创建时间
                FORM_COLS_12, //创建人,
                {
                  ...FORM_COLS_8,
                  residueCol: 2,
                }, //报销单号
                FORM_COLS_5, //付款单位
                FORM_COLS_7, //类型
                FORM_COLS_3, //收款单位
                FORM_COLS_4_1, //状态
                FORM_COLS_6, //金额
                FORM_COLS_9, //审核人
              ],
            },
          ],
        },
      ],
    },
  ],
  OTcolumnConfig: [
    //oneTabs
    TABLE_COLS_SELECTION,
    {
      ...TABLE_COLS_4,
      customRow: true,
      fixed: "left",
    }, //报销单号
    TABLE_COLS_2, //类型
    TABLE_COLS_14, //流程
    TABLE_COLS_22,
    TABLE_COLS_3, //报销部门
    TABLE_COLS_8, //金额
    TABLE_COLS_7, //币别
    TABLE_COLS_10, //领款人
    TABLE_COLS_11, //主体（付款单位）
    TABLE_COLS_9, //备注
    TABLE_COLS_15, //任务所属人
    TABLE_COLS_17, //创建时间
    TABLE_COLS_16, //创建人
    {
      ...TABLE_COLS_OPERATION,
      width: 120,
    }, //操作栏
  ],
  TTcolumnConfig: [
    //twoTabs
    TABLE_COLS_INDEX,
    {
      ...TABLE_COLS_4,
      customRow: true,
      fixed: "left",
    }, //报销单号
    TABLE_COLS_2, //类型
    TABLE_COLS_14, //流程
    TABLE_COLS_22,
    TABLE_COLS_3, //报销部门
    TABLE_COLS_8, //金额
    TABLE_COLS_7, //币别
    TABLE_COLS_10, //领款人
    TABLE_COLS_11, //主体（付款单位）
    TABLE_COLS_9, //备注
    TABLE_COLS_15, //任务所属人
    TABLE_COLS_17, //创建时间
    {
      ...TABLE_COLS_16,
      fixed: "right",
    }, //创建人
    {
      ...TABLE_COLS_13,
      fixed: "right",
    }, //状态
  ],
};
const financeCostExpenses = {
  // 财务报销付款
  OTSearch: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1, //创建时间
                FORM_COLS_12, //创建人,
                {
                  ...FORM_COLS_8,
                  residueCol: 2,
                }, //报销单号
                {
                  ...FORM_COLS_5,
                  label: "付款单位：",
                  placeholder: "请选择付款单位",
                }, //付款单位
                {
                  ...FORM_COLS_7,
                  hideList: [3],
                }, //类型
                FORM_COLS_14, //收款单位
                FORM_COLS_4_2, //状态
                FORM_COLS_6, //金额
                { ...FORM_COLS_10, id: "taskBy" }, //任务所属人
              ],
            },
          ],
        },
      ],
    },
  ],
  TTSearch: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1, //创建时间
                FORM_COLS_12, //创建人,
                {
                  ...FORM_COLS_8,
                  residueCol: 2,
                }, //报销单号
                FORM_COLS_6, //金额
                {
                  ...FORM_COLS_7,
                  hideList: [3],
                }, //类型
                FORM_COLS_14, // 收款单位
                FORM_COLS_13, // 水单号
                {
                  ...FORM_COLS_5,
                  label: "付款公司：",
                  placeholder: "请选择付款公司",
                }, //付款单位
              ],
            },
          ],
        },
      ],
    },
  ],
  OTcolumnConfig: [
    TABLE_COLS_SELECTION,
    TABLE_COLS_INDEX,
    TABLE_COLS_1, //流水号
    {
      ...TABLE_COLS_2,
      prop: "costTypeName",
    }, //类型
    TABLE_COLS_14, //流程
    TABLE_COLS_4, //报销单号
    TABLE_COLS_6, //费用名称
    {
      ...TABLE_COLS_8,
      label: "金额",
      prop: "money",
    }, //金额
    { ...TABLE_COLS_7, prop: "currency" }, //币别
    TABLE_COLS_10, //领款人
    TABLE_COLS_9, //备注
    TABLE_COL_24, // 往来单位
    {
      ...TABLE_COLS_11,
      label: "付款公司",
    }, //主体（付款单位）
    TABLE_COL_23, // 佰信核销
    TABLE_COLS_3, //报销部门
    TABLE_COLS_17, //创建时间
    TABLE_COLS_16, //创建人
    TABLE_COLS_15, //任务所属人
    {
      ...TABLE_COLS_13,
      basicType: "RVPStatus",
      fixed: "right",
    }, //状态
    {
      ...TABLE_COL_OPERATION,
      width: 200,
    }, //操作栏
  ],
  TTcolumnConfig: [
    //twoTabs
    TABLE_COLS_INDEX,
    TABLE_COLS_1, //流水号
    {
      ...TABLE_COLS_2,
      prop: "costTypeName",
    }, //类型
    TABLE_COLS_14, //流程
    TABLE_COLS_4, //报销单号
    TABLE_COLS_6, //费用名称
    {
      ...TABLE_COLS_8,
      label: "金额",
      prop: "money",
    }, //金额
    { ...TABLE_COLS_7, prop: "currency" }, //币别
    TABLE_COLS_21,
    {
      ...TABLE_COLS_8,
      prop: "verificationMoney",
      label: "核销金额",
      width: 110,
    }, //已核销金额
    TABLE_COLS_10, //领款人
    TABLE_COLS_9, //备注
    TABLE_COL_24, // 往来单位
    {
      ...TABLE_COLS_11,
      label: "付款公司",
    }, //主体（付款单位）
    TABLE_COL_23, // 佰信核销
    TABLE_COLS_3, //报销部门
    TABLE_COLS_17, //创建时间
    {
      ...TABLE_COLS_16,
      fixed: "right",
    }, //创建人
    // {
    //   ...TABLE_COLS_13,
    //   basicType: "RVPStatus",
    //   fixed: "right"
    // },//状态
    {
      ...TABLE_COL_OPERATION,
      width: 160,
    }, //操作栏
  ],
};
export { userCostExpenses, reviewCostExpenses, financeCostExpenses };

const TABLE_COL_701 = {
  ...TABLE_COLS_10,
  label: "付款单位",
};
const SEARCH_COL_701 = {
  id: "status",
  label: "核销状态：",
  type: "select",
  multiple: true,
  placeholder: "请选择",
  basicType: "collectionTaskState",
  hideList: [55, 100],
};
const SEARCH_FORM_COLS_7 = [
  FORM_COLS_5, //付款单位
  FORM_COLS_6, //金额
  SEARCH_FORM_COL_102, // 流程
  FORM_COLS_8, //报销单号
];
export const collectionConfig = {
  // 财务报销(财务收款)
  OTSearch: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1, //创建时间
                FORM_COLS_12, //创建人,
                {
                  ...FORM_COLS_8,
                  residueCol: 2,
                }, //报销单号
                {
                  ...FORM_COLS_5,
                  label: "收款公司：",
                  placeholder: "请选择收款公司",
                }, //付款单位
                FORM_COLS_6, //金额
                FORM_COLS_14, // 收款单位
                SEARCH_COL_701,
                FORM_COLS_10,
              ],
            },
          ],
        },
      ],
    },
  ],
  TTSearch: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1, //创建时间
                FORM_COLS_12, //创建人,
                {
                  ...FORM_COLS_8,
                  residueCol: 2,
                }, //报销单号
                FORM_COLS_6, //金额
                FORM_COLS_9, //审核人
                FORM_COLS_14, // 收款单位
                FORM_COLS_13,
                {
                  ...FORM_COLS_5,
                  label: "收款公司：",
                  placeholder: "请选择收款公司",
                }, //付款单位
              ],
            },
          ],
        },
      ],
    },
  ],

  OTcolumnConfig: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1, //单号
    TABLE_COLS_14, //流程
    TABLE_COLS_3, //报销部门
    TABLE_COLS_4, //报销单号
    {
      ...TABLE_COLS_8,
      label: "金额",
      prop: "money",
    }, //金额
    { ...TABLE_COLS_7, prop: "currency" }, //币别
    TABLE_COLS_9, //备注
    TABLE_COL_24, // 往来单位
    TABLE_COLS_10, //领款人
    TABLE_COLS_15, //任务所属人
    {
      ...TABLE_COLS_11,
      label: "收款公司",
    }, //主体（付款单位）
    TABLE_COL_23, // 佰信核销
    TABLE_COLS_17, //创建时间
    {
      ...TABLE_COLS_16,
      fixed: "right",
    }, //创建人
    {
      ...TABLE_COLS_13,
      basicType: "collectionTaskState",
      fixed: "right",
    }, //状态
    {
      ...TABLE_COL_OPERATION,
      width: 120,
    }, //操作栏
  ],
  TTcolumnConfig: [
    //twoTabs
    TABLE_COLS_INDEX,
    TABLE_COLS_1, //单号
    TABLE_COLS_14, //流程
    TABLE_COLS_4, //报销单号
    {
      ...TABLE_COLS_8,
      label: "金额",
      prop: "money",
    }, //金额
    { ...TABLE_COLS_7, prop: "currency" }, //币别
    {
      ...TABLE_COLS_8,
      prop: "verificationMoney",
      label: "核销金额",
      width: 110,
    }, //已核销金额
    { ...TABLE_COLS_21, prop: "bankReceiptSerialCode" },
    TABLE_COLS_10, //领款人
    TABLE_COLS_9, //备注
    TABLE_COL_24, // 往来单位
    {
      ...TABLE_COLS_11,
      label: "收款公司",
    }, //主体（付款单位
    TABLE_COL_23, // 佰信核销
    TABLE_COLS_3, //报销部门
    TABLE_COLS_17, //创建时间
    {
      ...TABLE_COLS_16,
      fixed: "right",
    }, //创建人
  ],
};
