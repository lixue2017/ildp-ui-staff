import {
  httpLogisticsCustomerSelect,
  httpSalesmanSelect
} from '@/comModel/httpSelect.js';
import { toFixedNum } from '@/utils/instructions'
import { logisticsSalesmanNew } from "@/api/settlementManage/paymentReceived.js"
// const SEARCH_COL_1 = {
//   id: "createTime",
//   label: "考核日期：",
//   startPlaceholder: "开始日期",
//   endPlaceholder: "结束日期",
//   type: "daterange",
//   valueFormat: "yyyy-MM-dd",
// }
const SEARCH_COL_1 = {
  id: "checkDate",
  label: "考核日期：",
  placeholder: "请选择考核日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "businessCompany",
  selectLabelKey: "businessCompanyName",
  label: "公司：",
  ...httpLogisticsCustomerSelect(),
  type: "slot"
}
const SEARCH_COL_3 = {
  id: "salesman",
  label: "业务员：",
  // ...httpSalesmanSelect(),
  ...httpSalesmanSelect({
    httpRequest: logisticsSalesmanNew,
  }),
  multiple: true,
  type: "slot"
}
const SEARCH_COL_4 = {
  id: "orderNo",
  label: "工作单号：",
  type: 'text',
  placeholder: '请输入工作单号'
}

const SEARCH_COL_5 = {
  id: "businessType",
  label: "业务类型：",
  type: 'select',
  basicType: "settlementBusinessType",
  placeholder: '请选择业务类型 '
}

const SEARCH_COL_6 = {
  id: "settleType",
  label: "结算方式：",
  type: 'select',
  basicType: "accountCycle",
  placeholder: '请选择结算方式 '
}

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
              SEARCH_COL_6
            ],
          },
        ],
      },
    ],
  },
]

/** 未付款明细表有引用 */
export const formRules = {
  checkDate: [
    { required: true, message: "请选择记账日期", trigger: "change" },
  ],
  businessCompany: [
    { required: true, message: "请选择公司", trigger: "change" },
  ],
} // 表单校验规则



const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left"
}
const TABLE_COL_1 = {
  prop: "settleType",
  label: "客户结算方式",
  showOverflowTooltip: true,
  basicType: "accountCycle",
  minWidth: 120,
}

const TABLE_COL_2 = {
  prop: "orderNo",
  label: "工作单号",
  showOverflowTooltip: true,
  minWidth: 120,
}
const TABLE_COL_3 = {
  prop: "salesmanName",
  label: "业务员",
  showOverflowTooltip: true,
  minWidth: 100,
}
const TABLE_COL_4 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  showOverflowTooltip: true,
  minWidth: 100,
}
const TABLE_COL_5 = {
  prop: "businessType",
  label: "业务类型",
  showOverflowTooltip: true,
  basicType: "settlementBusinessType",
  minWidth: 100,
}
const TABLE_COL_6 = {
  prop: "refundDate",
  label: "回款日期",
  showOverflowTooltip: true,
  className: "border-right",
  minWidth: 120,
}

const TABLE_COL_7 = {
  prop: "UNCHARTED_TABLE_7",
  label: "应收金额",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: 'RMB',
      prop: 'crmbmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'USD',
      prop: 'cusdmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'HKD',
      prop: 'chkdmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'EUR',
      prop: 'ceurmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'GBP',
      prop: 'cgbpmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    }
  ]
}

const TABLE_COL_8 = {
  prop: "UNCHARTED_TABLE_8",
  label: "回款金额",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: 'RMB',
      prop: 'rrmbmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'USD',
      prop: 'rusdmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'HKD',
      prop: 'rhkdmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'EUR',
      prop: 'reurmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'GBP',
      prop: 'rgbpmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    }
  ]
}
const TABLE_COL_10 = {
  prop: "customerName",
  label: "客户名称",
  showOverflowTooltip: true,
  minWidth: 100,
}

const TABLE_COL_11 = {
  prop: "UNCHARTED_TABLE_11",
  label: "剩余未回金额",
  multiHeader: true,
  className: "border-right",
  list: [
    {
      label: 'RMB',
      prop: 'srmbmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'USD',
      prop: 'susdmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'HKD',
      prop: 'shkdmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'EUR',
      prop: 'seurmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    },
    {
      label: 'GBP',
      prop: 'sgbpmoney',
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    }
  ]
}

const getCurrencyConfig = (row = {}, item = {}) => {
  const { label, prop, childName } = item;
  const list = row.map((e) => {
    console.log(`${childName}${e.currencyCode.toLowerCase()}money`);
    return {
      label: e.currencyCode,
      prop: `${childName}${e.currencyCode.toLowerCase()}money`,
      minWidth: 120,
      align: "right",
      showOverflowTooltip: true,
      className: "border-right",
      decimal: 2,
    };
  });
  return {
    prop,
    label,
    multiHeader: true,
    className: "border-right",
    list,
  };
};




export const tableColumns=(row={})=>{
  const {currencyList}=row
  const TABLE_COL_GETNEW_12 = getCurrencyConfig(currencyList, {
    label: "应收金额",
    prop: "UNCHARTED_COL_12",
    childName:'c'
  });
  const TABLE_COL_GETNEW_13 = getCurrencyConfig(currencyList, {
    label: "回款金额",
    prop: "UNCHARTED_COL_13",
    childName:'r'
  });
  const TABLE_COL_GETNEW_14 = getCurrencyConfig(currencyList, {
    label: "剩余未回金额",
    prop: "UNCHARTED_COL_12",
    childName:'s'
  });
  return [
    TABLE_COL_INDEX,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_10,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_GETNEW_12,
    TABLE_COL_GETNEW_13,
    TABLE_COL_GETNEW_14
  ]

}
// export const tableColumns = [
//   TABLE_COL_INDEX,
//   TABLE_COL_1,
//   TABLE_COL_2,
//   TABLE_COL_3,
//   TABLE_COL_4,
//   TABLE_COL_10,
//   TABLE_COL_5,
//   TABLE_COL_6,
//   TABLE_COL_7,
//   TABLE_COL_8,
//   TABLE_COL_11
// ]
