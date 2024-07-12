import { toFixedNum } from '@/utils/instructions'
import { httpFBAWarehouseSelect, httpPackingSelect } from '@/comModel/warehouse'

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "warehouseId",
  label: "对应仓库：",
  placeholder: "对应仓库",
  ...httpFBAWarehouseSelect('2'),
}
const SEARCH_COL_3 = {
  id: "packingMaterialsId",
  label: "包材编码：",
  placeholder: "包材编码",
  ...httpPackingSelect(),
}
const SEARCH_COL_4 = {
  id: "nameCn",
  label: "单号：",
  placeholder: "单号/入库单号",
  type: "text"
}

export const searchColumns = [
  {
    className: "search-form-width",
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              SEARCH_COL_2,
              SEARCH_COL_3,
              SEARCH_COL_4
            ],
          },
        ],
      },
    ],
  },
]

const TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center"
}
const TABLE_COL_1 = {
  prop: "warehouseName",
  label: "对应仓库",
  minWidth: 150,
  // customRow: true,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_2 = {
  prop: "packingMaterialsName",
  label: "包材编码",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_3 = {
  prop: "enterWarehouseNum",
  label: "单号/入库单号",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_4 = {
  prop: "packingTrackingNum",
  label: "包裹跟踪单号",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_5 = {
  prop: "customerInfo",
  label: "客户信息",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_6 = {
  prop: "type", // 0-消耗 1-补货
  label: "类型",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true,
  basicType: "packagingConsumeType"
}
const TABLE_COL_7 = {
  prop: "num",
  label: "数量",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_8 = {
  prop: "remark",
  label: "备注",
  minWidth: 150,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_9 = {
  prop: "updateTime",
  label: "最后操作时间",
  minWidth: 136,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_10 = {
  prop: "status", // 0-草稿 1-已生效
  label: "状态",
  minWidth: 120,
  customRow: true,
  sortable:true,
  basicType: "packagingStatus"
}
const TABLE_COL_11 = {
  prop: "updateBy",
  label: "最后修改人",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_12 = {
  label: "操作",
  prop: "operation",
  // customRow: true,
  columnOperation: true,
  fixed: 'right',
  width: '150px'
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
  TABLE_COL_12
]
export const tableColumns = (tab = 0) => {
  return [TABLE_TAB_1][tab]
}

const EDIT_COL_1 = {
  span: 24,
  id: "warehouseId",
  label: "所属仓库：",
  placeholder: "此处选择所属仓库",
  ...httpFBAWarehouseSelect('2'),
}
const EDIT_COL_2 = {
  span: 24,
  id: "packingMaterialsId",
  label: "包材类型：",
  placeholder: "此处选择包材类型",
  ...httpPackingSelect(),
}
const EDIT_COL_3 = {
  span: 24,
  id: "type",
  label: "类型：",
  placeholder: "--",
  type: "txt",
  basicType: "packagingConsumeType"
}
const EDIT_COL_4 = {
  span: 24,
  id: "num",
  label: "补充数量：",
  placeholder: "此处填写补充数量",
  type: "text"
}
const EDIT_COL_5 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "此处填写备注",
  type: "textarea"
}

export const editFormCols = () => {
  const editCols = [
    EDIT_COL_1,
    EDIT_COL_2,
    EDIT_COL_3,
    EDIT_COL_4,
    EDIT_COL_5
  ]
  return {
    columns: editCols,
    formRules: {
      warehouseId: [
        { required: true, message: "请选择所属仓库", trigger: "change" },
      ],
      packingMaterialsId: [
        { required: true, message: "请选择包材类型", trigger: "change" },
      ],
    }, // 表单校验规则
  }
}
