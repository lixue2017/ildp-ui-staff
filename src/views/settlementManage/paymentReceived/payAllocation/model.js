import { taskColumns } from "@/views/settlementManage/paymentReceived/taskList/model.js"
import { httpAllDealingCompanySelect, httpUserSelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect'
import { SEARCH_SETTLEMENT_COL_1, SEARCH_SETTLEMENT_COL_2 } from '@/views/settlementManage/components/comModel.js'
export { taskColumns }

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "statementsCode",
  label: "财务单号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_3 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_4 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  ...httpAllDealingCompanySelect()
}
const SEARCH_COL_5 = {
  id: "bankReceiptNo",
  label: "关联水单号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_6 = {
  ...SEARCH_SETTLEMENT_COL_1,
  id: "currencyCode"
}
const SEARCH_COL_7 = {
  id: "methodOfPayment",
  label: "收付款方式：",
  placeholder: "请选择",
  type: 'select',
  basicType: "RVPType"
}
const SEARCH_COL_8 = {
  id: "methodOfSettle",
  label: "结算方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "accountCycle"
}
const SEARCH_COL_10 = {
  id: "openingBank",
  label: "银行名称：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_11 = {
  id: "accountName",
  label: "对方户名：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_12 = {
  id: "bankAccount",
  label: "对方账号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_13 = {
  id: "taskBy",
  selectLabelKey: "taskUserName",
  label: "任务所属人：",
  placeholder: "请选择",
  ...httpUserSelect()
}
const SEARCH_COL_14 = {
  id: "deptBy",
  label: "付款公司：",
  selectLabelKey: "deptByName",
  placeholder: "请选择",
  ...httpLogisticsCustomerSelect()
}
const SEARCH_COL_15 = {
  id: "generalCashier",
  label: "总出纳：",
  placeholder: "总出纳",
  ...httpUserSelect()
}
const SEARCH_COL_16 = {
  id: "bankReceiptCheckBy",
  label: "水单登记人：",
  placeholder: "水单登记人",
  ...httpUserSelect()
}
const SEARCH_COL_17 = {
  id: "verificationBy",
  label: "核销人：",
  placeholder: "请选择",
  ...httpUserSelect()
}
const SEARCH_COL_18 = {
  id: "cashierBy",
  label: "付款出纳：",
  placeholder: "请选择",
  ...httpUserSelect()
}
const SEARCH_COL_19 = {
  id: "checkNo",
  label: "关联发票号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_COM = [
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_4,
  // SEARCH_COL_5,
  SEARCH_COL_6,
  SEARCH_SETTLEMENT_COL_2,
  SEARCH_COL_7,
  SEARCH_COL_8,
  // SEARCH_COL_18,
  SEARCH_COL_19
]

export const searchColumns = (tName = '1') => {
  //后续要区别
  let SEARCH_CONS = [
    SEARCH_COL_1,
    SEARCH_COL_13,
    // SEARCH_COL_9,
    ...SEARCH_COL_COM,
    SEARCH_COL_10,
    SEARCH_COL_11,
    SEARCH_COL_12,
    SEARCH_COL_14,
    // SEARCH_COL_15,
    // SEARCH_COL_16
  ]
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_CONS,
            },
          ],
        },
      ],
    },
  ]
}
