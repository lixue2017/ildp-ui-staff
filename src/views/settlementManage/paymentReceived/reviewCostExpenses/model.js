
import { httpUserSelect } from '@/comModel/httpSelect'

const EXAMINE_FORM_COL_1 = {
  span: 24,
  id: "status",
  label: "审核结果：",
  type: "radio",
  options: [
    {
      label: "通过",
      value: 5,
    }, {
      label: "驳回",
      value: 9,
    }
  ]
}
const EXAMINE_FORM_COL_2 = {
  span: 24,
  id: "xx_examine_2",
  selectLabelKey: "taskOwnerName",
  label: "任务所属人：",
  placeholder: "请选择",
  ...httpUserSelect(),
}
const EXAMINE_FORM_COL_3 = {
  span: 24,
  id: "remark",
  label: "审核意见：",
  placeholder: "请输入",
  type: "textarea",
}
const EXAMINE_LISTS = [{
  fieldList: [{
    rows: [{
      cols: [EXAMINE_FORM_COL_3]
    }]
  }]
}]
const EXAMINE_RULES = {
  status: [
    { required: true, message: "请选择审核结果", trigger: "change" },
  ],
}
// 费用报销审核
export const examineConfirmForm = () => {
  return {
    title: "审核",
    width: '450px',
    labelWidth: '100px',
    lists: EXAMINE_LISTS,
    formRules: EXAMINE_RULES,
    rejectLists: EXAMINE_LISTS,
    rejectFormRules: {
      ...EXAMINE_RULES,
      remark: [
        { required: true, message: "请输入审核意见", trigger: "blur" },
      ],
    }
  }

}
