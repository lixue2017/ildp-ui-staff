import { httpUserSelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect'

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "code",
  label: "快递编号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_3 = {
  id: "expressOmpany",
  label: "快递公司：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_4 = {
  id: "createBy",
  label: "创建人：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_5 = {
  id: "statusList",
  label: "状态：",
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "outStorageStatus",
  hideList: [0, 1, 2, 3, 4]
}
const SEARCH_COL_6 = {
  id: "number",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_10 = {
	id: "affiliatedCompany",
  label: "所属公司：",
  placeholder: "请选择",
	...httpLogisticsCustomerSelect()
}

const SEARCH_EXPRESS_COLS_1 = [
  SEARCH_COL_1,
  SEARCH_COL_2,
	SEARCH_COL_6,
  SEARCH_COL_3,
  SEARCH_COL_4,
	SEARCH_COL_10
]

const SEARCH_TAB_1 = [
  ...SEARCH_EXPRESS_COLS_1,
  SEARCH_COL_5
]
export const searchColumns = () => {
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
  label: "快递信息编号",
  customRow: true,
  minWidth: 130,
  fixed: "left",
  sortable:true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "expressOmpany",
  label: "快递公司",
  minWidth: 120,
  fixed: "left",
  sortable:true,
  showOverflowTooltip: true
  // basicType: "status",
}
const TABLE_COL_3 = {
  prop: "nation",
  label: "国家",
  minWidth: 120,
  fixed: "left",
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_4 = {
  prop: "expressNum",
  label: "快递单号",
  minWidth: 120,
  fixed: "left",
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_5 = {
  prop: "weight",
  label: "重量(KG)",
  minWidth: 120,
  // fixed: "left",
  sortable:true,
  showOverflowTooltip: true,
	decimal: 2,
}
const TABLE_COL_6 = {
  prop: "number",
  label: "工作单号",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_7 = {
  prop: "markStatus",
  label: "订单类型",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true,
  dicsStr: 'deliveryDic',
  customDicsArr: [0, 1, 2],
  // basicType: "labelingBusinessType",
}
const TABLE_COL_8 = {
  prop: "mailTime",
  label: "寄件日期",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_9 = {
  prop: "mddz_xx9",
  label: "目的地类型",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true,
  render: () => '地址'
}
const TABLE_COL_10 = {
  prop: "deliveryCode",
  label: "仓库编码",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_11 = {
  prop: "name",
  label: "收件信息",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true,
  render: (row) => {
    if (!row.name || !row.phone) {
      return '--'
    }
    return `${row.name}[${row.phone}]`
  }
}
const TABLE_COL_12 = {
  prop: "address",
  label: "收件地址",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_13 = {
  prop: "createNickName",
  label: "委托人",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_14 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_15 = {
  prop: "updateTime",
  label: "最后更新时间",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_16 = {
  prop: "createBy",
  label: "创建人",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_17 = {
  prop: "status",
  label: "状态",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true,
  customRow: true,
  fixed: 'right',
  basicType: "outStorageStatus"
}
const TABLE_COL_18 = {
  prop: "freightQuantity",
  label: "箱数",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_19 = {
  prop: "affiliatedCompanyName",
  label: "所属公司",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}

const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: '160px'
}
const TABLE_EXPRESS_COLS_1 = [
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
	TABLE_COL_18,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
	TABLE_COL_19,
  TABLE_COL_17
]
const TABLE_TAB_1 = [
  TABLE_COL_0,
  ...TABLE_EXPRESS_COLS_1,
  // TABLE_COL_99
]
export const tableColumns = () => TABLE_TAB_1


const SEE_DLG_COL_1 = {
  span: 8,
  id: "expressOmpany",
  label: "快递公司：",
  type: "txt",
}
const SEE_DLG_COL_2 = {
  span: 8,
  id: "expressNum",
  label: "快递单号：",
  type: "txt",
}
const SEE_DLG_COL_3 = {
  span: 8,
  id: "mailTime",
  label: "寄件日期：",
  type: "txt",
}
const SEE_DLG_COL_4 = {
  span: 8,
  id: "see_xx4",
  label: "目的地类型：",
  type: "txt",
  render: () => '地址'
}
const SEE_DLG_COL_5 = {
  span: 8,
  id: "name",
  label: "收件人信息：",
  type: "txt",
  render: (row) => {
    if (!row.name || !row.phone) {
      return '--'
    }
    return `${row.name}[${row.phone}]`
  }
}
const SEE_DLG_COL_6 = {
  span: 24,
  id: "address",
  label: "收件人地址：",
  type: "txt",
}
const SEE_DLG_COL_7 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  type: "txt",
}
const SEE_DLG_COL_8 = {
  span: 24,
  id: "attachId",
  labelWidth: '0px',
  type: "customUploadFile",
  disable: true
}

const SEE_DLG_FORM_COLS = {
  columns: [
    SEE_DLG_COL_1,
    SEE_DLG_COL_2,
    SEE_DLG_COL_3,
    SEE_DLG_COL_4,
    SEE_DLG_COL_5,
    SEE_DLG_COL_6,
    // SEE_DLG_COL_7,
    SEE_DLG_COL_8
  ],
  formRules: {},
}

export const editDlgFormCols = (mode_type = 0) => SEE_DLG_FORM_COLS
// 快递出库调用
export { SEARCH_EXPRESS_COLS_1, TABLE_EXPRESS_COLS_1 }
