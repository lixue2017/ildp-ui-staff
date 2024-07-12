import { httpUserSelect } from '@/comModel/httpSelect'
const FORM_COLS_1 = {
  span: 12,
  id: "bankReceiptCheckBy",
  label: "水单登记人：",
  placeholder: "请选择水单登记人",
  ...httpUserSelect()
}
const FORM_COLS_2 = {
  span: 12,
  id: "poll",
  label: " 票数：",
  placeholder: "--",
  type: "txt"
}
const FORM_COLS_3 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入备注说明",
  type: "textarea",
  rows: 3
}
const FORM_COLS_TABLE = {
  span: 24,
  id: "tableData",
  labelWidth: '0px',
  type: "slot",
}

const TABLE_COLS_INDEX = {
  type: "index",
  width: 80,
  align: "center",
  fixed: "left"
}
const TABLE_COLS_1 = {
  prop: "serialCode",
  label: "流水号",
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  prop: "businessCompanyName",
  label: "业务单位",
  showOverflowTooltip: true,
}
const TABLE_COLS_3 = {
  prop: "salesmanNick",
  label: "业务员",
  showOverflowTooltip: true,
}
const TABLE_COLS_4 = {
  prop: "dealingsCompanyName",
  label: "相关单位",
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  prop: "currencyCode",
  label: "付款币别",
  showOverflowTooltip: true,
}
const TABLE_COLS_6 = {
  prop: "money",
  label: "待付款金额",
  showOverflowTooltip: true,
}
const TABLE_COLS_7 = {
  prop: "totalMoney",
  label: "对账单金额",
  showOverflowTooltip: true,
}
const TABLE_COLS_8 = {
  prop: "cashierRemark",
  label: "出纳备注",
  showOverflowTooltip: true,
}

export const formConfig = {
  batchPayLists: {
    //付款任务单-批量付款登记
    title: "批量付款登记 ",
    lists: [{
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_TABLE
              ]
            }
          ]
        }
      ]
    }],
    formRules: {
      bankReceiptCheckBy: [
        { required: true, message: "请选择水单登记人", trigger: "change" },
      ],
      // currencyId: [
      //   { required: true, message: "请选择付款币别", trigger: "change" },
      // ],
    }
  },
}
export const tableConfig = {
  lists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_8,
  ]
}
