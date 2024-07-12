import { httpMarketProfitCompanySelect } from "@/comModel/httpSelect"
const SELECT_COLS_1 = {
  id: "oDate",
  label: "日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy/MM/dd",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  }
}

const SELECT_COLS_2 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "往来单位",
  ...httpMarketProfitCompanySelect()
}

const SELECT_COLS_3 = {
  id: "sono",
  label: "SONO：",
  placeholder: "SO No.",
  type: "text"
}

const SELECT_COLS_4 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "工作单号",
  type: "text"
}

const SELECT_COLS_5 = {
  id: "billNo",
  label: "财务单号：",
  placeholder: "财务单号",
  type: "text"
}

const searchColumns = [
  SELECT_COLS_1,
  SELECT_COLS_2,
  SELECT_COLS_3,
  SELECT_COLS_4,
  SELECT_COLS_5,
]

const searchConfig = {
  //用户-财务报销
  searchNum: searchColumns.length,
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: searchColumns,
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    oDate: [
      { required: true, message: "请选择日期", trigger: "change" },
    ],
  }
}

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
}

const TABLE_COLS_1 = {
  label: "日期",
  prop: "date",
  width: 120,
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_2 = {
  label: "SO No.",
  prop: "sono",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_3 = {
  label: "工作单号",
  prop: "orderNo",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_4 = {
  label: "财务单号",
  prop: "billNo",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_5 = {
  label: "往来单位",
  prop: "dealingsCompanyName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_6 = {
  label: "费用名称",
  prop: "costName",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_7 = {
  label: "币别",
  prop: "currencyCode",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}

const TABLE_COLS_8 = {
  label: "应付金额",
  prop: "totalMoney",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  align: "right",
	colFormat: "thousandthMark",
  decimal: 2
}

const tableColumns = [
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

export { searchConfig, tableColumns }
