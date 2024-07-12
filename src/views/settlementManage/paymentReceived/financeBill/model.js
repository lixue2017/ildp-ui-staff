import { httpAllDealingCompanySelect, httpDeptSelect, httpCostTypeSelect, httpUserSelect } from '@/comModel/httpSelect'
import { SEARCH_SETTLEMENT_COL_1, SEARCH_SETTLEMENT_COL_2 } from '@/views/settlementManage/components/comModel.js'
const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "type",
    label: "应收应付：",
    placeholder: "应收应付",
    type: "select",
    basicType: "billType"
  },
  {
    id: "costId",
    label: "费用名称：",
    placeholder: "费用名称",
    ...httpCostTypeSelect({ type: 1 })
  },
  {
    id: "deptId",
    label: "所属公司：",
    placeholder: "所属公司",
    ...httpDeptSelect(),
  },
  {
    id: "dealingsCompany",
    label: "往来单位：",
    placeholder: "往来单位",
    ...httpAllDealingCompanySelect(),
  },
  {
    ...SEARCH_SETTLEMENT_COL_1,
    id: "currencyId"
  },
  SEARCH_SETTLEMENT_COL_2,
  {
    id: "createBy",
    label: "创建人：",
    placeholder: "创建人",
    ...httpUserSelect(),
    defaultProp: {//需要传入中文字符串搜索
      value: 'userName',
      label: 'userName,nickName'
    }
  },
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    prop: "type",
    label: "类型",
    width: 100,
    customRow: true,
    sortable: true,
    basicType: 'billType',
    align: "center",
    fixed: "left"
  },
  {
    prop: "costName",
    label: "费用名称",
    width: 120,
    sortable: true,
    showOverflowTooltip: true,
    align: "left",
    fixed: "left"
  },
  {
    prop: "dealingsCompanyName",
    label: "往来单位",
    sortable: true,
    width: 150,
    showOverflowTooltip: true,
    align: "left",
    fixed: "left"
  },
  {
    prop: "totalMoney",
    label: "金额",
    sortable: true,
    showOverflowTooltip: true,
    align: "right",
    decimal: 3,
    minWidth: 100
  },
  {
    prop: "currencyCode",
    label: "币别",
    sortable: true,
    width: 80,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    prop: "prepaidCollect",
    label: "到付预付",
    width: 120,
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'paymentType',
    align: "center",
  },
  {
    prop: "isIncludeTax",
    label: "是否含税",
    width: 120,
    sortable: true,
    showOverflowTooltip: true,
    render: (row) => {
      return row.isIncludeTax ? '是' : '否'
    },
    align: "center",
  },
  {
    prop: "taxRate",
    label: "税率%",
    sortable: true,
    width: 100,
    showOverflowTooltip: true,
    align: "right"
  },
  {
    prop: "taxMoney",
    label: "税额",
    sortable: true,
    width: 100,
    decimal: 3,
    showOverflowTooltip: true,
    align: "right"
  },
  {
    prop: "inTaxMoney",
    label: "不含税金额",
    sortable: true,
    decimal: 3,
    showOverflowTooltip: true,
    width: 120,
    align: "right"
  },
  {
    prop: "remark",
    label: "备注说明",
    width: 120,
    sortable: true,
    showOverflowTooltip: true,
    align: "left",
  },
  {
    prop: "status",
    label: "状态",
    width: 100,
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    basicType: "examineStatus",
    align: "left",
  },
  {
    prop: "monthBy",
    label: "记账日期",
    sortable: true,
    width: 120,
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
    prop: "billingMainName",
    label: "记账主体",
    sortable: true,
    width: 150,
    align: "left",
    fixed: 'right',
    showOverflowTooltip: true
  },
  {
    prop: "audit",
    label: "审核次数",
    width: 100,
    // customRow: true,
    sortable: true,
    fixed: 'right',
    // showOverflowTooltip: true,
    align: "right",
    render: (row) => {
      return row.status > 0 ? row.audit && row.audit.auditTypeNum : "--"
    }
  },
  {
    label: "操作",
    prop: "operation",
    customRow: true,
    width: 170,
    fixed: "right"
  }
]

export { searchColumns, tableColumns };
