import { httpSubjectCompanySelect, httpUserSelect, httpCurrencySelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect'
const SEARCH_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
}
const SEARCH_COLS_2 = {
  id: 'search_xx_2',
  label: "往来单位：",
  placeholder: '往来单位',
  ...httpSubjectCompanySelect()
}
const SEARCH_COLS_3 = {
  id: 'search_xx_3',
  label: "业务员：",
  placeholder: '业务员',
  type: 'text'
}
const SEARCH_COLS_4 = {
  id: 'search_xx_4',
  label: "业务单号：",
  placeholder: '业务单号',
  type: 'text'
}
const SEARCH_COLS_5 = {
  id: 'search_xx_5',
  label: "业务单号：",
  placeholder: '业务单号',
  type: "select",
  basicType: "orderBusinessType",
}
const SEARCH_COLS_6 = {
  id: 'search_xx_6',
  label: "创建人：",
  placeholder: "创建人",
  ...httpUserSelect()
}
const SEARCH_COLS_7 = {
  id: 'search_xx_7',
  label: "费用名称：",
  placeholder: "费用名称",
  ...httpUserSelect()
}
const SEARCH_COLS_8 = {
  id: 'search_xx_8',
  label: "币别：",
  placeholder: "币别",
  ...httpCurrencySelect,
}
const SEARCH_COLS_9 = {
  startId: "search_xx_9_1",
  endId: "search_xx_9_2",
  label: "金额：",
  startPlaceholder: "金额(大于)",
  endPlaceholder: "(小于)金额",
  type: "rangeSelect",
}
const SEARCH_COLS_10 = {
  id: 'search_xx_10',
  label: "记账主体：",
  placeholder: "记账主体",
  ...httpLogisticsCustomerSelect()
}

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}