import { httpWarehousePublicSelect } from '@/comModel/warehouse'
import { getRelationWarehouse } from "@/api/costScheme/index.js"
const FORM_COLS_1 = {
  span: 24,
  id: "minBill",
  label: "最小计费值：",
  placeholder: "最小计费值",
  decimal: 2,
  type: "slot",
}
const FORM_COLS_2 = {
  span: 24,
  id: "table",
  labelWidth: "0px",
  type: "slot",
}
const FORM_COLS_3 = {
  span: 24,
  id: "relationWarehouse",
  labelWidth: "0px",
  placeholder: "请选择关联仓库",
  // ...httpWarehousePublicSelect({ typeList: "0,1", itemId: "parentId" }),
  httpRequest: getRelationWarehouse,
  defaultProp: {
    value: "id",
    label: "code,name",
  },
  type: "slot",
}
const FORM_COLS_4 = {
  span: 24,
  id: "remark",
  labelWidth: "0px",
  type: "slot",
}


const TABLE_COLS_1 = {
  prop: "startValue",
  label: "开始值",
  align: "center",
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  prop: "endValue",
  label: "结束值",
  align: "center",
  customRow: true,
  showOverflowTooltip: true,
  decimal: 2,
}
const TABLE_COLS_3 = {
  prop: "costPrice",
  label: "单价",
  align: "center",
  customRow: true,
  showOverflowTooltip: true,
  decimal: 2,
}
const TABLE_COLS_OPERARTION = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: '120px'
}

export const setRules = {
  //规则设置
  title: '规则设置',
  width: '600px',
  labelWidth: "90px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    minBill: [
      { required: true, message: `请输入最小设计费值`, trigger: "change" }
    ],
  },
  columnConfig: [
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_OPERARTION
  ]
}
