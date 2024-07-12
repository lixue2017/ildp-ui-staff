import { toFixedNum } from '@/utils/instructions'
import { httpUserSelect, httpTraditionListSelect } from '@/comModel/httpSelect'

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "searchLy",
  label: "移库编号：",
  placeholder: "移库编号",
  type: "text"
}
const SEARCH_COL_3 = {
  id: "searchYwdh",
  label: "工作单号：",
  placeholder: "工作单号",
  type: "text"
}
const SEARCH_COL_4 = {
  id: "searchGzh",
  label: "历史库位：",
  placeholder: "历史库位",
  type: "text"
}
const SEARCH_COL_5 = {
  id: "searchYwlx",
  label: "库位类型：",
  placeholder: "库位类型（多选）",
  type: "select",
  multiple: true,
  basicType: "status",
}

const SEARCH_TAB_1 = [
  SEARCH_COL_1,
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_4,
  SEARCH_COL_5
]
export const searchColumns = (idx) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: SEARCH_TAB_1,
            },
          ],
        },
      ],
    },
  ]
}

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  fixed: "left",
  align: "center"
}
const TABLE_COL_1 = {
  prop: "code",
  label: "移库编号",
  customRow: true,
  fixed: "left",
  minWidth: 130,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "nameCn",
  label: "托盘号",
  fixed: "left",
  minWidth: 120,
  basicType: "status",
}
const TABLE_COL_3 = {
  prop: "psqd",
  label: "新库位",
  minWidth: 150,
  showOverflowTooltip: true
}
const TABLE_COL_4 = {
  prop: "type",
  label: "历史库位",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_5 = {
  prop: "warehouseId",
  label: "SKU",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_6 = {
  prop: "skuzs",
  label: "SKU数",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_7 = {
  prop: "weight",
  label: "移库类型",
  minWidth: 130,
  showOverflowTooltip: true
}
const TABLE_COL_8 = {
  prop: "zlkg",
  label: "备注",
  minWidth: 130,
  showOverflowTooltip: true
}
const TABLE_COL_9 = {
  prop: "mddz",
  label: "工作单号",
  minWidth: 130,
  showOverflowTooltip: true
}
const TABLE_COL_10 = {
  prop: "num",
  label: "业务类型",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_11 = {
  prop: "status",
  label: "操作时间",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COL_12 = {
  prop: "bz",
  label: "操作人",
  minWidth: 150,
  showOverflowTooltip: true
}
const TABLE_COL_13 = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: '160px'
}

const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13
]
export const tableColumns = () => TABLE_TAB_1


const EDIT_DLG_COL_1 = {
  span: 24,
  id: "gldd",
  label: "托盘号：",
  placeholder: "此处选择托盘号",
  ...httpTraditionListSelect()
};
const EDIT_DLG_COL_2 = {
  span: 24,
  id: "glddlx",
  label: "移库类型：",
  type: "radio",
  value: "0", // 默认值
  // basicType: 'issuingMethod',
  options: [{
    label: '拣货出库',
    value: "0",
  }]
}
const EDIT_DLG_COL_3 = {
  span: 24,
  id: "slotYwdh",
  label: "关联工作单号：",
  type: "slot",
}
const EDIT_DLG_COL_4 = {
  span: 24,
  id: "khxx",
  label: "客户信息：",
  placeholder: "--",
  type: "txt",
}
const EDIT_DLG_COL_5 = {
  span: 24,
  id: "lscw",
  label: "历史仓位：",
  placeholder: "--",
  type: "txt",
}
const EDIT_DLG_COL_6 = {
  span: 24,
  id: "xkw",
  label: "新库位：",
  placeholder: "此处选择新库位",
  ...httpTraditionListSelect()
};
const EDIT_DLG_COL_7 = {
  span: 24,
  id: "bzxx",
  label: "备注信息：",
  type: "textarea",
}
const EDIT_DLG_FORM_COLS = {
  columns: [
    EDIT_DLG_COL_1,
    EDIT_DLG_COL_2,
    EDIT_DLG_COL_3,
    EDIT_DLG_COL_4,
    EDIT_DLG_COL_5,
    EDIT_DLG_COL_6,
    EDIT_DLG_COL_7
  ],
  formRules: {
    xkw: [
      { required: true, message: "请选择新库位", trigger: "change" },
    ],
  },
}

const SEE_DLG_COL = (id, label, span = 7) => {
  return {
    span,
    id,
    label: `${label}：`,
    placeholder: "--",
    type: 'txt'
  }
}
const SEE_DLG_FORM_COLS = {
  columns: [
    SEE_DLG_COL('tph', '托盘号', 10),
    SEE_DLG_COL('yklx', '移库类型'),
    SEE_DLG_COL('czsj', '操作时间'),
    {
      ...SEE_DLG_COL('slotYwdh', '关联工作单号', 10),
      type: 'slot',
      labelWidth: '105px'
    },
    SEE_DLG_COL('khxx', '客户信息'),
    SEE_DLG_COL('yklx6', '历史仓位'),
    SEE_DLG_COL('yklx7', 'SKU', 10),
    SEE_DLG_COL('yklx8', 'SKU数量'),
    SEE_DLG_COL('yklx9', '新库位'),
    SEE_DLG_COL('yklx10', '操作人', 10),
    {
      span: 14,
      id: "bzxx",
      label: "备注信息：",
      placeholder: "--",
      type: 'txt',
    }
  ],
  formRules: {},
}

export const editDlgFormCols = (mode_type = 0) => {
  return [EDIT_DLG_FORM_COLS, SEE_DLG_FORM_COLS][mode_type]
}