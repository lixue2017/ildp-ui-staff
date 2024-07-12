/**
 * 结算公用模板
 * import { SEARCH_SETTLEMENT_COL_1 } from '@/views/settlementManage/components/comModel.js'
 */
import { httpCurrencySelect } from '@/comModel/httpSelect'

export const SEARCH_SETTLEMENT_COL_1 = {
  id: "currencyId",
  label: "币别：",
  placeholder: "请选择币别",
  ...httpCurrencySelect
}
export const SEARCH_SETTLEMENT_COL_2 = {
  startId: "startMoney",
  endId: "endMoney",
  label: "金额：",
  startPlaceholder: "金额≤",
  endPlaceholder: "≤金额",
  type: "rangeSelect",
}
