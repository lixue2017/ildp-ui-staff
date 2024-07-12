import {
  httpCostTypeSelect,
  httpAllDealingCompanySelect,
  httpUserSelect,
  httpLogisticsCustomerSelect,
} from "@/comModel/httpSelect";
import {
  SEARCH_SETTLEMENT_COL_1,
  SEARCH_SETTLEMENT_COL_2,
} from "@/views/settlementManage/components/comModel.js";

const SEARCH_COL_1 = {
  id: "billingMain",
  label: "记账主体：",
  selectLabelKey: "billingMainName",
  ...httpLogisticsCustomerSelect(),
};
const SEARCH_COL_2 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_3 = {
  id: "customer",
  label: "客户：",
  ...httpAllDealingCompanySelect(),
};

const SEARCH_COL_4 = {
  id: "time",
  label: "记账时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const SEARCH_COL_5 = {
  id: "dealingsCompany",
  label: "往来单位：",
  ...httpAllDealingCompanySelect({ clientIdentity: "0,1,2,3,4,9" }),
};
const SEARCH_COL_6 = {
  id: "salesman",
  label: "业务员：",
  ...httpUserSelect(),
};
const SEARCH_COL_7 = {
  id: "orderNum",
  label: "工作单号：",
  placeholder: "工作单号",
  type: "text",
  maxlength: 2000,
  residueCol: 2,
};
const SEARCH_COL_8 = {
  id: "businessType",
  label: "关联业务：",
  placeholder: "关联业务",
  type: "select",
  basicType: "settlementBusinessType",
  // hideList: [4]
};
const SEARCH_COL_9 = {
  id: "createBy",
  label: "创建人：",
  ...httpUserSelect(),
  defaultProp: {
    //需要传入中文字符串搜索
    value: "userName",
    label: "userName,nickName",
  },
};
const SEARCH_COL_10 = {
  id: "costId",
  label: "费用名称：",
  ...httpCostTypeSelect(),
};
const SEARCH_COL_11 = {
  ...SEARCH_SETTLEMENT_COL_1,
  id: "currencyId",
};
const SEARCH_COL_12 = {
  id: "operateId",
  label: "操作员：",
  ...httpUserSelect(),
};
const SEARCH_COL_13 = {
  id: "fileId",
  label: "文件员：",
  ...httpUserSelect(),
};

const searchColumns = [
  SEARCH_COL_4,
  SEARCH_COL_5,
  SEARCH_COL_6,
  SEARCH_COL_7,
  SEARCH_COL_2,
  SEARCH_COL_8,
  SEARCH_COL_9,
  SEARCH_COL_10,
  SEARCH_COL_11,
  SEARCH_SETTLEMENT_COL_2,
  SEARCH_COL_1,
  SEARCH_COL_3,
];

export const searchBillColumns = (tName) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_COL_4,//记账时间
                SEARCH_COL_5,//往来单位
                SEARCH_COL_7,//工作单号
                SEARCH_COL_2,//创建时间
                ...(tName === "1"
                  ? [
                      {
                        ...SEARCH_COL_8,//关联业务
                        hideList: [4],
                      },
                    ]
                  : []),
                SEARCH_COL_3,//客户
                SEARCH_COL_10,//费用名称
                SEARCH_COL_11,//币别
                SEARCH_SETTLEMENT_COL_2,//金额
                SEARCH_COL_9,//创建人
                SEARCH_COL_6,//业务员
                ...(tName === "1" ? [SEARCH_COL_12, SEARCH_COL_13] : []),//操作员，文件员
                SEARCH_COL_1,//记账主体
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COL_9 = {
  label: "关联业务",
  prop: "businessType",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  basicType: "settlementBusinessType",
};
const TABLE_COL_10 = {
  label: "工作单号",
  prop: "orderNum",
  align: "left",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COL_11 = {
  label: "记账日期",
  prop: "accountingTime",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
};
const TABLE_COL_12 = {
  label: "创建日期",
  prop: "createTime",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 140,
};
const TABLE_COL_13 = {
  label: "客户",
  prop: "customerName",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 110,
};
const tableColumns = [
  {
    type: "selection",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    label: "类型",
    prop: "type",
    basicType: "billType",
    fontColor: true,
    showOverflowTooltip: true,
    sortable: true,
    align: "center",
    fixed: "left",
  },
  {
    label: "费用名称",
    prop: "costName",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
    align: "left",
    fixed: "left",
  },
  {
    label: "往来单位",
    prop: "dealingsCompanyName",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
    align: "left",
    fixed: "left",
  },
  {
    label: "币种",
    prop: "currencyCode",
    showOverflowTooltip: true,
    sortable: true,
    align: "center",
    minWidth: 100,
  },
  {
    prop: "unitPrice",
    label: "单价",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 2,
    colFormat: "thousandthMark",
    align: "right",
    minWidth: 100,
  },
  {
    prop: "num",
    label: "数量",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    align: "right",
  },
  {
    label: "金额",
    prop: "totalMoney",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 2,
    colFormat: "thousandthMark",
    minWidth: 120,
    align: "right",
  },
  {
    prop: "currentMoonBaseRate",
    label: "本位币汇率",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 110,
    align: "right",
  },
  {
    prop: "currentMoonHelpRate",
    label: "辅助币汇率",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 110,
    align: "right",
  },
  TABLE_COL_13,
  TABLE_COL_10,
  TABLE_COL_9,
  {
    ...TABLE_COL_10,
    label: "相关单号",
    align: "left",
    prop: "joinOrderNum",
  },
  {
    ...TABLE_COL_9,
    label: "相关业务",
    align: "left",
    prop: "joinBusinessType",
  },
  {
    prop: "operateUser",
    label: "操作员",
    showOverflowTooltip: true,
    sortable: true,
    width: 100,
    align: "left",
  },
  {
    prop: "fileUser",
    label: "文件",
    sortable: true,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    prop: "salesmanNick",
    label: "业务员",
    sortable: true,
    minWidth: 100,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    prop: "createBy",
    label: "创建人",
    minWidth: 100,
    sortable: true,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    prop: "dept",
    label: "所属部门",
    sortable: true,
    minWidth: 100,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    prop: "remark",
    label: "备注",
    sortable: true,
    minWidth: 200,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    label: "是否锁单",
    prop: "lockOrder",
    width: 100,
    fontColor: true,
    sortable: true,
    showOverflowTooltip: true,
    align: "center",
    basicType: "trueOrFalse",
    // render: (row) => {
    //   return row.lockOrder ? "是" : "否"
    // }
  },
  TABLE_COL_11,
  TABLE_COL_12,
  {
    prop: "billingMainName",
    label: "记账主体",
    width: 120,
    fixed: "right",
    sortable: true,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    label: "操作",
    prop: "operation",
    customRow: true,
    width: 80,
    fixed: "right",
  },
];

export { searchColumns, tableColumns };
