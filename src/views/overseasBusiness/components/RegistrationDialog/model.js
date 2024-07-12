
import { httpUserSelect, httpCustomerSelect, httpEnterprisetSelect } from '@/comModel/httpSelect'
const FORM_COLS_1 = {
  span: 12,
  id: "agentType",
  label: "海外代理类型：",
  type: 'radio',
  basicType: "overseasAgencyType",
}
const FORM_COLS_2 = {
  span: 12,
  id: "bailorPeopleName",
  label: "委托人：",
  type: "txt",
}
const FORM_COLS_3 = {
  span: 12,
  id: "agent",
  label: "海外代理：",
  ...httpEnterprisetSelect(),
  type: "slot",
  selectLabelKey: "agentName",
}
const FORM_COLS_4 = {
  span: 12,
  id: "businessUnitName",
  label: "业务单位：",
  type: 'txt',
}
const FORM_COLS_5 = {
  span: 12,
  id: "nlCode",
  label: "清关单号：",
  placeholder: "请输入",
  type: "text",
}
const FORM_COLS_6 = {
  span: 12,
  id: "overseasOperator",
  selectLabelKey: "overseasOperatorName",
  label: "操作员：",
  placeholder: "操作员",
  ...httpUserSelect()
}
const FORM_COLS_7 = {
  span: 12,
  id: "mblNum",
  label: "MBL号：",
  placeholder: "请输入MBL号",
  type: "text",
}
const FORM_COLS_8 = {
  id: "pdo",
  span: 12,
  label: "DO：",
  placeholder: "DO",
  type: "select",
  basicType: "do",
}
const FORM_COLS_9 = {
  span: 12,
  id: "registerNo",
  label: "箱号：",
  placeholder: "请输入",
  type: "text",
}
const FORM_COLS_10 = {
  id: "pod",
  span: 12,
  label: "POD：",
  placeholder: "POD",
  type: "select",
  basicType: "pod",
}
const FORM_COLS_11 = {
  id: "customsBroker",
  selectLabelKey: "customsBrokerName",
  span: 12,
  label: "清关行：",
  placeholder: "清关行",
  ...httpCustomerSelect({ clientIdentity: 3 }),
}
const FORM_COLS_12 = {
  span: 12,
  id: `reachTime`,
  label: "ETA：",
  placeholder: "此处选择ETA",
  type: "date",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COLS_13 = {
  span: 12,
  id: `declareTime`,
  label: "申报日期：",
  placeholder: "此处选择申报日期",
  type: "date",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COLS_14 = {
  span: 12,
  id: `departureTime`,
  label: "ETD：",
  placeholder: "此处选择ETD",
  type: "date",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COLS_15 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "备注说明",
  type: "textarea",
  maxlength: 2000
}
const formColumns = (costCount) => [
  {
    ...FORM_COLS_1,
    ...costCount ? { disable: true } : {}
  },
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_7,
  FORM_COLS_8,
  FORM_COLS_9,
  FORM_COLS_10,
  FORM_COLS_11,
  FORM_COLS_12,
  FORM_COLS_13,
  FORM_COLS_14,
  FORM_COLS_15
]
export const formConfig = (costCount) => ({
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: formColumns(costCount),
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    agent: [
      { required: true, message: "请选择海外代理", trigger: "change" },
    ],
    nlCode: [
      { required: true, message: "请输入清关单号", trigger: "change" },
    ],
    customsBroker: [
      { required: true, message: "请选择清关行", trigger: "change" },
    ],
  }
})