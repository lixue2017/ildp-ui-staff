import { settleCostTypeList } from "@/api/settlementManage/feeSet";
import { httpCustomerSelect } from "@/comModel/httpSelect";

const searchColumns = (vType) => {
  const SEARCH_CLOS_1 = [
    {
      span: 6,
      id: "customerId",
      label: "关联客户：",
      ...httpCustomerSelect(),
    },
    {
      span: 6,
      id: "joinOrderNum",
      label: "相关单号：",
      placeholder: "请输入",
      type: "text",
    },

    {
      span: 12,
      id: "orderNum",
      label: "工作单号：",
      placeholder: "请输入（空格隔开查询多个）",
      type: "text",
      maxlength: 2000,
    },
    {
      span: 6,
      id: "createTime",
      label: "记账时间：",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      type: "daterange",
      valueFormat: "yyyy-MM-dd",
    },

    {
      span: 6,
      id: "costId",
      label: "费用名称：",
      type: "autocomplete",
      httpRequest: settleCostTypeList,
      searchParamName: "cnName",
      defaultProp: {
        value: "id",
        label: "costCode,cnName",
      },
    },
    {
      span: 6,
      id: "sono",
      label: "SO No./MBL No.：",
      placeholder: "请输入",
      type: "text",
      labelWidth: "122px",
    },
  ];
  if (![35, 40, "35", "40"].includes(vType)) {
    SEARCH_CLOS_1.push({
      span: 6,
      id: "businessTypeList",
      label: "业务类型：",
      placeholder: "请选择（多选）",
      type: "select",
      multiple: true,
      basicType: "settlementBusinessType",
      hideList: vType || vType === 0 ? [35, 40] : [],
    });
  }
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_CLOS_1,
            },
          ],
        },
      ],
    },
  ];
};

const tableColumns = [
  {
    type: "selection",
    width: 50,
    align: "center",
  },
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  // {
  //   label: "应收应付",
  //   prop: "type",
  //   showOverflowTooltip: true,
  //   sortable: true,
  //   customRow: true,
  //   basicType: "billType",
  //   align: "center",
  //   width: 100,
  // },
  {
    label: "费用名称",
    prop: "costName",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
  },
  {
    label: "工作单号",
    prop: "orderNum",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
  },
  {
    label: "相关单号",
    prop: "joinOrderNum",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
  },
  {
    label: "SO No./MBL No.",
    prop: "sono",
    showOverflowTooltip: true,
    sortable: true,
    width: 150,
  },
  {
    label: "金额",
    prop: "totalMoney",
    align: "right",
    showOverflowTooltip: true,
    sortable: true,
    decimal: 2,
    colFormat: "thousandthMark",
    width: 80,
  },
  {
    label: "币别",
    prop: "currencyCode",
    showOverflowTooltip: true,
    sortable: true,
    width: 80,
  },
  {
    label: "关联客户",
    prop: "customerName",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
  },
  {
    label: "业务员",
    prop: "businessUser",
    showOverflowTooltip: true,
    sortable: true,
    width: 120,
  },
  {
    label: "记账时间",
    prop: "accountingTime",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
  {
    label: "备注",
    prop: "remark",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
  },
];

export { searchColumns, tableColumns };
