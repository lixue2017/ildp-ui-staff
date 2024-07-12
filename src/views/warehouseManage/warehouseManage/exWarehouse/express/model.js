import { httpUserSelect, httpLogisticsCustomerSelect } from '@/comModel/httpSelect'
import { httpDeliveryChannelSelect } from '@/comModel/warehouse';
// 过程记录/快递信息
import * as expressModel from "@/views/warehouseManage/warehouseManage/process/expressRecord/model.js"


const SEARCH_COL_1 = {
  id: "createTime",
  label: "预报时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "companyName",
  label: "委托人：",
  placeholder: "请输入",
  type: "text"
  // ...httpCustomerSelect()
}
const SEARCH_COL_3 = {
  id: "number",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_4 = {
  id: "traceNumber",
  label: "跟踪号：",
  placeholder: "跟踪号",
  type: "text"
}
const SEARCH_COL_5 = {
  id: "deliveryChannelid",
  label: "派送方式：",
  placeholder: "请选择",
  ...httpDeliveryChannelSelect()
}
const SEARCH_COL_6 = {
  id: "receivingWarehouseid",
  label: "收件人：",
  placeholder: "收件人",
  ...httpUserSelect()
}
const SEARCH_COL_7 = {
  id: "statusList",
  label: "状态：",
  placeholder: "状态（多选）",
  type: "select",
  multiple: true,
  basicType: "outStorageStatus",
  hideList: [0, 1, 2, 3]
}
const SEARCH_COL_8 = {
  id: "searchYwlx",
  label: "业务类型：",
  placeholder: "业务类型（多选）",
  type: "select",
  multiple: true,
  basicType: "status",
}
const SEARCH_COL_9 = {
  id: "wholeCabinetSn",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text"
}
const SEARCH_COL_10 = {
	id: "affiliatedCompany",
  label: "所属公司：",
  placeholder: "请选择",
	...httpLogisticsCustomerSelect()
}

const SEARCH_TAB_1 = [
  SEARCH_COL_1,
  SEARCH_COL_2,
  SEARCH_COL_3,
  SEARCH_COL_4,
  SEARCH_COL_5,
	SEARCH_COL_9,
	SEARCH_COL_10,
  // SEARCH_COL_6,
  // SEARCH_COL_7,
  // SEARCH_COL_8
]
const SEARCH_TAB_2 = expressModel.SEARCH_EXPRESS_COLS_1;
SEARCH_TAB_2.splice(2, 0, SEARCH_COL_3);
export const searchColumns = (idx) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_TAB_1, [...SEARCH_TAB_2, SEARCH_COL_9]][idx],
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
const TABLE_COL_SELECTION = {
  type: "selection",
  width: 50,
  fixed: "left",
  align: "center"
}
const TABLE_COL_1 = {
  prop: "number",
  label: "工作单号",
  customRow: true,
  fixed: "left",
  minWidth: 150,
  sortable:true,
  showOverflowTooltip: true,
}
const TABLE_COL_2 = {
  prop: "markStatus",
  label: "业务类型",
  fixed: "left",
  minWidth: 120,
  sortable:true,
  dicsStr: 'deliveryDic',
  customDicsArr: [0, 1, 2],
  customDicsVal: "type"
}
const TABLE_COL_3 = {
  prop: "tname",
  label: "派送渠道",
  minWidth: 150,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_4 = {
  prop: "traceNumber",
  label: "跟踪号",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_5 = {
  prop: "table_xx5",
  label: "目的地类型",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true,
  render: () => '地址'
}
const TABLE_COL_6 = {
  prop: "deliveryCode",
  label: "仓库编码",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_7 = {
  prop: "receivingCode",
  label: "收件信息",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true,
  render: (row) => {
    return `${row?.name}[${row?.phone}]`
  }
}
const TABLE_COL_8 = {
  prop: "nation",
  label: "目的国",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_9 = {
  prop: "detailsAddr",
  label: "收件地址",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_10 = {
  prop: "productType",
  label: "SKU类数",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_11 = {
  prop: "productTotal",
  label: "箱数",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_12 = {
  prop: "remark",
  label: "备注",
  minWidth: 150,
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
  prop: "predictionTime",
  label: "预报时间",
  minWidth: 130,
  sortable:true,
  showOverflowTooltip: true
}
const TABLE_COL_15 = {
  prop: "isSticker",
  label: "需贴标",
  minWidth: 120,
  sortable:true,
  showOverflowTooltip: true,
  render: (row) => {
    return row.isSticker == 1 ? `✓是` : '否'
  },
}
const TABLE_COL_16 = {
  prop: "stickerStatus",
  label: "贴标状态",
  customRow: true,
  minWidth: 120,
  basicType: "isSticker",
  fixed: 'right',
  sortable:true,
  showOverflowTooltip: true,
  hideList: [-1]
}
const TABLE_COL_17 = {
  prop: "status",
  label: "状态",
  customRow: true,
  sortable:true,
  minWidth: 120,
  customDicsArr: ['deliveryDic_state_7'],
  fixed: 'right',
  showOverflowTooltip: true
}
const TABLE_COL_18 = {
  prop: "wholeCabinetSn",
  label: "国内登记号",
  minWidth: 150,
	fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
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
  width: '240px'
}

const TABLE_TAB_1 = [
  TABLE_COL_1,
	TABLE_COL_18,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  // TABLE_COL_10,
  TABLE_COL_11,
  TABLE_COL_12,
  TABLE_COL_13,
  TABLE_COL_14,
  TABLE_COL_15,
	TABLE_COL_19,
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_99
]
const TABLE_TAB_2 = expressModel.TABLE_EXPRESS_COLS_1
TABLE_TAB_2.splice(1, 0, TABLE_COL_18);
export const tableColumns = (tab = 0) => {
  // console.log('TABLE_TAB_2', TABLE_TAB_2)
  return [
    [TABLE_COL_SELECTION, ...TABLE_TAB_1],
    [TABLE_COL_SELECTION, ...TABLE_TAB_2, { ...TABLE_COL_99, width: 80 }]
  ][tab]
}



const EDIT_DLG_COL_1 = {
  span: 24,
  id: "markStatus",
  label: "工作单号：",
  type: "slot",
  dicsStr: 'deliveryDic',
  customDicsArr: [0, 1, 2],
  // basicType: "labelingBusinessType",
}
const EDIT_DLG_COL_2 = {
  span: 24,
  id: "expressOmpany",
  label: "快递公司：",
  placeholder: "快递公司",
  type: "text",
}
const EDIT_DLG_COL_3 = {
  span: 24,
  id: "expressNum",
  label: "快递单号：",
  placeholder: "快递单号",
  type: "text",
}
const EDIT_DLG_COL_4 = {
  span: 24,
  id: "mailTime",
  label: "下单时间：",
  placeholder: "请选择",
  type: "datetime",
  valueFormat: "yyyy/MM/dd HH:mm:ss"
}
const EDIT_DLG_COL_5 = {
  span: 24,
  id: "weight",
  label: "重量(KG)：",
  placeholder: "重量(KG)",
  type: "text",
  inputType: "number",
  decimal: 2
}
const EDIT_DLG_COL_6 = {
  span: 12,
  id: "name",
  label: "收件人信息：",
  placeholder: "姓名",
  type: "slot",
}
const EDIT_DLG_COL_6_2 = {
  span: 12,
  id: "phone",
  labelWidth: "0px",
  placeholder: "手机号",
  type: "slot"
}
const EDIT_DLG_COL_7 = {
  span: 24,
  id: "address",
  label: "收件人地址：",
  placeholder: "收件人地址",
  type: "textarea",
}
const EDIT_DLG_COL_8 = {
  span: 24,
  id: "bzxx",
  label: "备注信息：",
  type: "textarea",
}
const EDIT_DLG_COL_9 = {
  span: 24,
  id: "attachId",
  labelWidth: '0px',
  type: "customUploadFile",
	pasteUpload: true
}
const EDIT_DLG_COL_10 = {
  span: 24,
  id: "number",
  label: "工作单号：",
  type: "txt",
}

const EDIT_DLG_FORM_COLS = {
  columns: [
    EDIT_DLG_COL_1,
    EDIT_DLG_COL_2,
    EDIT_DLG_COL_3,
    EDIT_DLG_COL_4,
    EDIT_DLG_COL_5,
    // EDIT_DLG_COL_6,
    // EDIT_DLG_COL_6_2,
    // EDIT_DLG_COL_7,
    // EDIT_DLG_COL_8,
    EDIT_DLG_COL_9
  ],
  formRules: {
    mailTime: [
      { required: true, message: "请选择日期", trigger: "change" },
    ],
    expressNum: [
      { required: true, message: "请输入快递单号", trigger: "blur" },
    ],
    // weight: [
    //   { required: true, message: "请输入重量", trigger: "blur" },
    // ],
    // address: [
    //   { required: true, message: "请输入收件人地址", trigger: "blur" },
    // ],
    // name: [
    //   { required: true, message: "请输入收件人姓名", trigger: "blur" },
    // ],
    // phone: [
    //   { required: true, message: "请输入收件人手机号", trigger: "blur" },
    // ],
  },
}


const EDIT_DLG_FORM_COLS_1 = {
  columns: [
    EDIT_DLG_COL_10,
    {
			...EDIT_DLG_COL_4,
			label: "派送日期：",
		},
    EDIT_DLG_COL_9
  ],
  formRules: {
    mailTime: [
      { required: true, message: "请选择日期", trigger: "change" },
    ],
  },
}

export const editDlgFormCols = (mType) => {
	const objConfig = mType === 1 ? EDIT_DLG_FORM_COLS_1 : EDIT_DLG_FORM_COLS
	return {
		columns: [
			{
				fieldList: [
					{
						rows: [
							{
								cols: objConfig.columns,
							},
						],
					},
				],
			},
		],
		formRules: objConfig.formRules,
	}
}
