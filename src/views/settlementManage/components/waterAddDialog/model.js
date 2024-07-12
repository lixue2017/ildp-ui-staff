import { httpLogisticsCompanySelect,httpLogisticsCustomerSelect } from '@/comModel/httpSelect.js';
const SEARCH_DRAWER_COL_1 = {
  span:16,
  id: "billNo",
  label: "账单号码：",
  placeholder: "请输入账单号码",
  type: "text",
  maxlength:2000
}

const SEARCH_DRAWER_COL_2 = {
  span:16,
  id: "orderNo",
  label: "业务单号：",
  placeholder: "输入业务单号",
  type: "text",
  maxlength:2000
}

const SEARCH_DRAWER_COL_3 = {
  span:8,
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请输入往来单位",
  ...httpLogisticsCompanySelect()
}

const SEARCH_DRAWER_COL_4 = {
  span:8,
  id: "businessCompany",
  label: "记账主体：",
  placeholder: "请输入记账主体",
  ...httpLogisticsCustomerSelect(),
}

export const searchDrawerFormCols = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                SEARCH_DRAWER_COL_1,
                SEARCH_DRAWER_COL_3,
                SEARCH_DRAWER_COL_2,
                SEARCH_DRAWER_COL_4
              ]
            },
          ],
        },
      ],
    },
  ]
}


const TABLE_COL_SELECT = {
  type: "selection",
  align: "center",
  width: 50,
}

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};

const TABLE_COL_1 = {
  prop: "billNo",
  label: "账单号码",
  showOverflowTooltip: true,
  minWidth: 80,
}

const TABLE_COL_2 = {
  prop: "currencyCode",
  label: "币别",
  showOverflowTooltip: true,
  minWidth: 50,
}

const TABLE_COL_3 = {
  prop: "samount",
  label: "待认领金额",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 100,
}

const TABLE_COL_4 = {
  prop: "tamount",
  label: "总金额",
  showOverflowTooltip: true,
  decimal:2,
  minWidth: 100,
}

const TABLE_COL_5 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  showOverflowTooltip: true,
  minWidth: 90,
}

const TABLE_COL_6 = {
  prop: "businessCompanyName",
  label: "记账主体",
  showOverflowTooltip: true,
  minWidth: 90,
}

const TABLE_COL_7 = {
  prop: "orderNum",
  label: "业务单号",
  showOverflowTooltip: true,
  minWidth: 80,
}

export const tableDrawerCols = () => [
  TABLE_COL_SELECT,
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_7,
  TABLE_COL_5,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_6,
]
