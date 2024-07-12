import { httpLogisticsCustomerSelect } from '@/comModel/httpSelect'

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
  label: "卡车信息编号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_3 = {
  id: "tname",
  label: "派送渠道：",
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
  dicsStr: 'truck_status',
  customDicsArr: [5, 6],
}
const SEARCH_COL_6 = {
  id: "amazonId",
  label: "AmazonID：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_7 = {
  id: "orderNumber",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_8 = {
	id: "affiliatedCompany",
  label: "所属公司：",
  placeholder: "请选择",
	...httpLogisticsCustomerSelect()
}

const SEARCH_TAB_1 = [
  SEARCH_COL_1,
  SEARCH_COL_2,
	SEARCH_COL_7,
  SEARCH_COL_3,
  SEARCH_COL_4,
	SEARCH_COL_6,
  SEARCH_COL_5,
	SEARCH_COL_8
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
  label: "卡车信息编号",
  customRow: true,
  minWidth: 150,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "tname",
  label: "派送渠道",
  minWidth: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_3 = {
  prop: "amazonId",
  label: "AmazonID",
  minWidth: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_4 = {
  prop: "totalWeight",
  label: "总重量(KG)",
  minWidth: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
	decimal: 2,
}
const TABLE_COL_5 = {
  prop: "totalVolume",
  label: "总体积(KG)",
  minWidth: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
	decimal: 2,
}
const TABLE_COL_6 = {
  prop: "nation",
  label: "国家",
  minWidth: 120,
  // fixed: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_7 = {
  prop: "scheduledTime",
  label: "预计发车时间",
  width: 136,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_8 = {
  prop: "actualTime",
  label: "实际发车时间",
  width: 136,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_9 = {
  prop: "xxx_9",
  label: "目的地类型",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: row => row.markStatus === 0 ? "FBA仓" : "地址"
}
const TABLE_COL_10 = {
  prop: "warehouseCode",
  label: "仓库编码",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_11 = {
  prop: "receivingDes",
  label: "收件信息",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_12 = {
  prop: "address",
  label: "收件地址",
  minWidth: 150,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_13 = {
  prop: "orderCount",
  label: "关联订单数",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_14 = {
  prop: "boxCount",
  label: "总箱数",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_15 = {
  prop: "totalPlt",
  label: "总PLT数",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_16 = {
  prop: "baosenRef",
  label: "Baosen REf",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_17 = {
  prop: "createTime",
  label: "创建时间",
  width: 136,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_18 = {
  prop: "updateTime",
  label: "最后更新时间",
  width: 136,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_19 = {
  prop: "createBy",
  label: "创建人",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_20 = {
  prop: "status",
  label: "状态",
  dotColor: true,
  minWidth: 120,
  dicsStr: 'truck_status',
  customDicsArr: [5, 6],
  fixed: 'right',
  sortable: true
}
const TABLE_COL_21 = {
  prop: "orderNumber",
  label: "工作单号",
  minWidth: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COL_22 = {
  prop: "affiliatedCompanyName",
  label: "所属公司",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COL_99 = {
  label: "操作",
  prop: "operation",
  // customRow: true,
  columnOperation: true,
  fixed: 'right',
  width: '160px'
}
const TABLE_TAB_1 = [
  TABLE_COL_0,
  TABLE_COL_1,
	TABLE_COL_21,
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
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_18,
  TABLE_COL_19,
	TABLE_COL_22,
  TABLE_COL_20,
  TABLE_COL_99
]
export const tableColumns = () => TABLE_TAB_1


const SEE_DLG_COL_1 = {
  span: 24,
  id: "markStatus",
  label: "派车单号：",
  type: "slot",
  dicsStr: 'vehicle_order_type',
  customDicsArr: [10, 20],
  customDicsVal: "type"
}
const SEE_DLG_COL_2 = {
  span: 24,
  id: "orderSn",
  label: "关联工作单号：",
  type: "txt",
}
const SEE_DLG_COL_3 = {
  span: 24,
  id: "attachId",
  labelWidth: '10px',
  type: "customUploadFile",
	pasteUpload: true
}
const SEE_DLG_FORM_COLS = {
  columns: [
    SEE_DLG_COL_1,
    SEE_DLG_COL_2,
    SEE_DLG_COL_3
  ],
  formRules: {
    attachId: [
      { required: true, message: "请上传附件", trigger: "change" },
    ]
  },
}

export const editDlgFormCols = () => SEE_DLG_FORM_COLS


// 表单模板
export const formOutboundCols = () => {
  return {
    title: '出库完成',
    width: '500px',
    labelWidth: '105px',
		simpleCustomCols: [{
			span: 24,
			id: "actualFinishTime",
			label: "实际发车时间：",
			placeholder: "日期",
			type: "datetime",
			valueFormat: "yyyy/MM/dd HH:mm:ss"
		}],
    formRules: {
			actualFinishTime: [
				{ required: true, message: `请选择时间`, trigger: "change" }
			]
		}
  }
}
