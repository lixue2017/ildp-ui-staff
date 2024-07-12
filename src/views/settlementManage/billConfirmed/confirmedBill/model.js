import { httpAllDealingCompanySelect, httpUserSelect, httpLogisticsCustomerSelect, httpRoleDeptUserSelect } from '@/comModel/httpSelect'

const SEARCH_COL_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_2 = {
  id: "billNo",
  label: "财务单号：",
  placeholder: "请输入（空格隔开查询多个）",
	type: "text",
	maxlength: 1000,
	residueCol: 2
}
const SEARCH_COL_3 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入（空格隔开查询多个）",
	type: "text",
	maxlength: 1000,
	residueCol: 2
}
const SEARCH_COL_4 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  ...httpAllDealingCompanySelect()
}
const SEARCH_COL_5 = {
  id: "currencyId",
  label: "币别：",
  placeholder: "请选择",
  type: "autocomplete",
  category: "currency"
}

const SEARCH_COL_6 = {
  startId: "startMoney",
  endId: "endMoney",
  label: "金额：",
  startPlaceholder: "金额≤",
  endPlaceholder: "≤金额",
  type: "rangeSelect",
}
const SEARCH_COL_7 = {
  id: "taskBy",
  label: "默认审核人：",
  selectLabelKey: "taskByName",
  placeholder: "请选择",
  ...httpUserSelect()
}
const SEARCH_COL_8 = {
  id: "settleType",
  label: "结算方式：",
  placeholder: "请选择",
  type: "select",
  basicType: 'accountCycle'
}
const SEARCH_COL_9 = {
  id: "invoiceNo",
  label: "关联发票号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_10 = {
  id: "businessCompany",
  label: "记账主体：",
  selectLabelKey: "businessCompanyName",
  placeholder: "请输入",
  ...httpLogisticsCustomerSelect()
}
const SEARCH_COL_11 = {
  id: "bankReceiptNo",
  label: "关联水单号：",
  placeholder: "请输入",
  type: "text",
}
const SEARCH_COL_13 = {
  id: "settleModel",
  label: "结算模式：",
  placeholder: "请选择",
  type: "select",
  basicType: 'settleModel'
}

export const searchColumns = (tName) => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
							cols: [
								SEARCH_COL_4,//往来单位
                SEARCH_COL_7,//默认审核人
								SEARCH_COL_2,//财务单号
								SEARCH_COL_1,//创建时间
                SEARCH_COL_9,//关联发票号
                SEARCH_COL_3,//工作单号
                SEARCH_COL_5,//币别
                SEARCH_COL_6,//金额
								SEARCH_COL_13,
                SEARCH_COL_8,//结算方式
                SEARCH_COL_10,//记账主体
                ...(tName === '2' ? [SEARCH_COL_11] : []),//关联水单号
              ],
            },
          ],
        },
      ],
    },
  ]
}

const TABLE_COL_10 = {
  prop: "salesmanName",
  label: "默认审核人",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 110,
}
const TABLE_COL_11 = {
  // prop: "convertBaseMoney",
  // label: "金额",
  prop: "billSubtotal",
  label: "明细小计",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 100,
  align: "right",
  decimal: 2
}
const TABLE_COL_12 = {
  prop: "currencyCode",
  label: "币种",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 80,
  align: "left",
}
const TABLE_COL_13 = {
  prop: "verificationMoney",
  label: "已核销金额",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
  align: "right",
  decimal: 2,
}
const TABLE_COL_14 = {
  prop: "serialCode",
  label: "已核销流水号",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true
}
const TABLE_COL_15 = {
  prop: "joinBillNo",
  label: "关联对账单",
  showOverflowTooltip: true,
  columnLink: true,
  minWidth: 130,
  sortable: true
}
const TABLE_COL_16 = {
  prop: "invoiceWater",
  label: "发票流水号",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true
}
const TABLE_COL_17 = {
  prop: "invoiceNo",
  label: "关联发票号",
  showOverflowTooltip: true,
  sortable: true,
  minWidth: 120,
}
const TABLE_COL_18 = {
  prop: "bankReceiptNo",
  label: "关联水单号",
  showOverflowTooltip: true,
  minWidth: 130,
  sortable: true
}
const TABLE_COL_19 = {
  prop: "settleModel",
  label: "结算模式",
  showOverflowTooltip: true,
  minWidth: 100,
	sortable: true,
	basicType: 'settleModel',
	fontColor: true,
}
const TABLE_COL_99 = {
  prop: "operation",
  label: "操作",
  width: 115,
  columnOperation: true,
  fixed: "right"
}
const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    type: "selection",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    prop: "billNo",
    label: "财务单号",
    width: 120,
    showOverflowTooltip: true,
    sortable: true,
    columnLink: true,
    align: "left",
    fixed: "left"
  },
  {
    prop: "dealingsCompanyName",
    label: "往来单位",
    showOverflowTooltip: true,
    width: 120,
    sortable: true,
    minWidth: 100,
    align: "left",
    fixed: "left"
  },
  {
    prop: "settleType",
    label: "结算方式",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    align: "left",
    basicType: 'accountCycle'
  },
	TABLE_COL_19,
  {
    prop: "billNum",
    label: "账单数",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    align: "right"
  },
  {
    prop: "orderNo",
    label: "工作单号",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    align: "left",
  },
  TABLE_COL_10,
  TABLE_COL_11,//金额
  TABLE_COL_12,//币种
  {
    prop: "lastPayTime",
    label: "最晚收付日",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "left",
  },
  {
    prop: "payType",
    label: "收付款方式",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    basicType: "RVPType",
    align: "left",
  },
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_15,
  {
    prop: "taskByName",
    label: "任务所属人",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120
  },
  {
    prop: "createTime",
    label: "创建时间",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 160,
    align: "left",
  },
  {
    prop: "createBy",
    label: "创建人",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true,
    align: "left",
  },
  // {
  //   prop: "rejectNum",
  //   label: "审核次数",
  //   showOverflowTooltip: true,
  //   minWidth: 100,
  //   sortable: true,
  //   align: "right"
  // },
  {
    prop: "businessCompanyName",
    label: "记账主体",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
    fixed: "right",
    align: "left",
  },
  TABLE_COL_99,
]


const historyTableColumns = [
  //历史收款记录
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left"
  },
  {
    prop: "billNo",
    label: "财务单号",
    width: 120,
    showOverflowTooltip: true,
    sortable: true,
    columnLink: true,
    align: "left",
    fixed: "left"
  },
  {
    prop: "dealingsCompanyName",
    label: "往来单位",
    showOverflowTooltip: true,
    width: 120,
    sortable: true,
    minWidth: 100,
    align: "left",
    fixed: "left"
  },
  {
    prop: "settleType",
    label: "结算方式",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    basicType: 'accountCycle',
    align: "left",
  },
	TABLE_COL_19,
  {
    prop: "billNum",
    label: "账单数",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 100,
    align: "right"
  },
  {
    prop: "orderNo",
    label: "工作单号",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "left"
  },
  TABLE_COL_10,
  TABLE_COL_11,//金额
  TABLE_COL_12,//币别
  TABLE_COL_13,
  TABLE_COL_14,
  {
    prop: "lastPayTime",
    label: "最晚收付日",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    align: "left",
  },
  {
    prop: "payType",
    label: "收付款方式",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 120,
    basicType: "RVPType",
    align: "left",
  },
  TABLE_COL_16,
  TABLE_COL_17,
  TABLE_COL_18,
  TABLE_COL_15,
  {
    prop: "createTime",
    label: "创建时间",
    showOverflowTooltip: true,
    sortable: true,
    minWidth: 160,
    align: "left",
  },
  {
    prop: "createBy",
    label: "创建人",
    showOverflowTooltip: true,
    minWidth: 100,
    sortable: true,
    align: "left",
  },
  {
    prop: "businessCompanyName",
    label: "记账主体",
    showOverflowTooltip: true,
    minWidth: 120,
    sortable: true,
    align: "left",
  },
  {
    prop: "status",
    label: "状态",
    showOverflowTooltip: true,
    sortable: true,
    dotColor: true,
    basicType: "soaStatus",
    align: "left",
    fixed: "right"
  },
  // {
  //   prop: "rejectNum",
  //   label: "审核次数",
  //   showOverflowTooltip: true,
  //   minWidth: 100,
  //   sortable: true,
  //   align: "right",
  //   fixed: "right"
  // },
  TABLE_COL_99
]

export { tableColumns, historyTableColumns };


// 账单批量确认

const repulseRules = {
  resultRemark: [
    { required: true, message: "请输入", trigger: "change" },
  ],
}

export const billBatchConfirmForm = (status, settleModel) => {
  //status 0通过  1打回
  return {
    title: status == '1' ? '账单批量打回' : '账单批量确认',
    width: '450px',
    labelWidth: '90px',
    lists: [{
      fieldList: [{
        rows: [{
          cols: [
            {
              span: 24,
              id: "ids",
              label: "小计：",
              type: "txt",
              render: row => `共${row.ids?.length}票`
						},
						...(settleModel === 2 && status != '1'
							? [
									{
										span: 24,
										id: "verificationBy",
										label: "财务确认：",
										placeholder: "请选择",
										...httpRoleDeptUserSelect({
											getRoles: ["CW"],
										}),
									},
								]
							: []),
            {
              span: 24,
              id: "resultRemark",
              label: "备注：",
              type: "textarea",
            }]
        }]
      }]
    }],
		formRules: status == 1 ? { ...repulseRules } : {
			verificationBy: [
				{ required: true, message: '请选择确认人', trigger: "change" }
			],
		}
  }

}
