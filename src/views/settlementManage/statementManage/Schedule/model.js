import { httpAllDealingCompanySelect, httpUserSelect, httpCostTypeSelect, httpCompanySelect, httpByRelevancy, httpLogisticsCustomerSelect } from "@/comModel/httpSelect.js"
const FORM_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}

const FORM_COLS_2 = {
  id: "dealingsCompany",
  label: "往来单位：",
  placeholder: "请选择",
  ...httpAllDealingCompanySelect()
}

const FORM_COLS_3 = {
  id: "businessType",
  label: "业务类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "settlementBusinessType",
  hideList: [1, 2]
}

const FORM_COLS_4 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "请输入",
  type: "text",
  residueCol: 2,
}

const FORM_COLS_5 = {
  id: "bsType",
  label: "双向类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "settleBsType",
  hideList: [100]
}

const FORM_COLS_6 = {
  id: "checkStatus",
  label: "确认状态：",
  placeholder: "请选择",
  type: "select",
  basicType: "settleAccountBillCheckStatus"
}

const FORM_COLS_7 = {
  id: "joinBusinessType",
  label: "来源业务类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "settlementBusinessType",
  hideList: [1, 2]
}

const FORM_COLS_8 = {
  id: "joinOrderNo",
  label: "来源工作单号：",
  placeholder: "请输入",
  type: "text",
  residueCol: 2,
}

const FORM_COLS_9 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "请选择",
  ...httpUserSelect()
}

const FORM_COLS_10 = {
  id: "checkId",
  label: "指定确认人：",
  selectLabelKey: "checkName",
  placeholder: "请选择",
  ...httpUserSelect()
}
const FORM_COLS_11 = {
  id: "billNo",
  label: "对账单号：",
  placeholder: "请输入",
  type: "text",
}
const FORM_COLS_12 = {
  id: "costId",
  label: "费用名称：",
  placeholder: "请选择",
  ...httpCostTypeSelect()
}

const FORM_COLS_13 = {
  id: "currencyId",
  label: "币别：",
  placeholder: "请选择",
  type: "autocomplete",
  category: "currency"
}


const FORM_COLS_14 = {
  startId: "startMoney",
  endId: "endMoney",
  label: "金额：",
  startPlaceholder: "金额(大于)",
  endPlaceholder: "(小于)金额",
  type: "rangeSelect",
}

const FORM_COLS_15 = {
  id: "type",
  label: "类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "billType"
}

const FORM_COLS_16 = {
  id: "lockOrder",
  label: "是否锁单：",
  placeholder: "请选择",

  type: "select",
  basicType: "trueOrFalse"
}

const FORM_COLS_17 = {
  id: "createId",
  label: "创建人：",
  selectLabelKey: "createName",
  placeholder: "请选择",
  ...httpUserSelect()
}

const FORM_COLS_18 = {
  id: "businessCompany",
  label: "记账主体：",
  placeholder: "请选择",
  selectLabelKey: "businessCompanyName",
  ...httpLogisticsCustomerSelect()
}

const FORM_COLS_19 = {
  id: "accountingTime",
  label: "记账时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
export const associatedFormConfig = (activeName) => {
  //待关联明细
  console.log('activeName', activeName)
  const formConfig = {
    1: [
      FORM_COLS_1, //创建时间
      FORM_COLS_2, //往来单位
      FORM_COLS_8, //来源工作号
      FORM_COLS_3, //业务类型
      FORM_COLS_7, //来源业务类型
      FORM_COLS_4, //工作单号
      // FORM_COLS_9,//业务员
      {
        ...FORM_COLS_6,
        hideList: [30]
      },//确认类型
      FORM_COLS_5,//双向类型
      FORM_COLS_10,//指定确认人
      // FORM_COLS_11,//对账单号
      FORM_COLS_12,//费用名称
      FORM_COLS_13,//币别
      FORM_COLS_14,//金额
      FORM_COLS_15,//类型
      FORM_COLS_16,//是否锁单
      FORM_COLS_17,//创建人
      FORM_COLS_18,//记账主体
    ],
    2: [
      FORM_COLS_19, //记账时间
      FORM_COLS_2, //往来单位
      FORM_COLS_8, //来源工作号
      FORM_COLS_1, //创建时间
      FORM_COLS_3, //业务类型
      FORM_COLS_4, //工作单号
      FORM_COLS_7,//来源业务类型
      FORM_COLS_9,//业务员
      FORM_COLS_5,//双向类型
      FORM_COLS_10,//指定确认人
      FORM_COLS_11,//对账单号
      FORM_COLS_12,//费用名称
      FORM_COLS_13,//币别
      FORM_COLS_14,//金额
      FORM_COLS_15,//类型
      FORM_COLS_16,//是否锁单
      FORM_COLS_17,//创建人
      FORM_COLS_18,//记账主体
    ]
  }
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: formConfig[activeName]
            },
          ],
        },
      ],
    }
  ]
}





export const confirmedFormConfig = (activeName) => {
  //待确认明细
  const formConfig = {
    1: [
      FORM_COLS_1,//创建时间
      FORM_COLS_2,//往来单位
      FORM_COLS_4,//工作单号
      FORM_COLS_3,//业务类型
      FORM_COLS_7,//来源业务类型
      FORM_COLS_8,//来源工作号
      // FORM_COLS_9,//业务员
      {
        ...FORM_COLS_6,
        hideList: [10, 30]
      },//确认类型
      FORM_COLS_5,//双向类型
      FORM_COLS_10,//指定确认人
      // FORM_COLS_11,//对账单号
      FORM_COLS_12,//费用名称
      FORM_COLS_13,//币别
      FORM_COLS_14,//金额
      FORM_COLS_15,//类型
      FORM_COLS_16,//是否锁单
      FORM_COLS_17,//创建人
      FORM_COLS_18,//记账主体
    ],
    2: [
      FORM_COLS_19,//记账时间
      FORM_COLS_2,//往来单位
      FORM_COLS_4,//工作单号
      FORM_COLS_1,//创建时间
      FORM_COLS_5,//双向类型
      FORM_COLS_8,//来源工作号
      FORM_COLS_3,//业务类型
      FORM_COLS_7,//来源业务类型
      FORM_COLS_9,//业务员
      FORM_COLS_10,//指定确认人
      FORM_COLS_11,//对账单号
      FORM_COLS_12,//费用名称
      FORM_COLS_13,//币别
      FORM_COLS_14,//金额
      FORM_COLS_15,//类型
      FORM_COLS_16,//是否锁单
      FORM_COLS_17,//创建人
      FORM_COLS_18,//记账主体
    ]
  }
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: formConfig[activeName]
            },
          ],
        },
      ],
    }
  ]
}





const TABLE_COLS_SELECT = {
  type: "selection",
  width: 50,
  align: "center",
  fixed: "left"
}

const TABLE_COLS_INDEX = {
  type: "index",
  width: 40,
  align: "center",
  fixed: "left",
}

const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  minWidth: 80,
  sortable: true,
  fontColor: true,
  align: "center",
  fixed: "left",
  showOverflowTooltip: true,
  basicType: "billType"
}
const TABLE_COLS_2 = {
  prop: "costName",
  label: "费用名称",
  minWidth: 120,
  sortable: true,
  align: "left",
  fixed: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_3 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  minWidth: 120,
  sortable: true,
  align: "center",
  fixed: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_4 = {
  prop: "totalMoney",
  label: "金额",
  minWidth: 100,
  sortable: true,
  decimal: 2,
	colFormat: "thousandthMark",
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 100,
  sortable: true,
  align: "center",
  showOverflowTooltip: true,
}


const TABLE_COLS_6 = {
  prop: "bsType",
  label: "双向类型",
  minWidth: 120,
  sortable: true,
  fontColor: true,
  align: "center",
  showOverflowTooltip: true,
  basicType: "settleBsType"
}

const TABLE_COLS_7 = {
  prop: "unitPrice",
  label: "单价",
  minWidth: 100,
  sortable: true,
  decimal: 2,
	colFormat: "thousandthMark",
  align: "right",
  showOverflowTooltip: true,
}

const TABLE_COLS_8 = {
  prop: "num",
  label: "数量",
  minWidth: 100,
  sortable: true,
  decimal: 3,
  align: "right",
  showOverflowTooltip: true,
}
const TABLE_COLS_9 = {
  prop: "orderNo",
  label: "工作单号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_10 = {
  prop: "businessType",
  label: "业务类型",
  minWidth: 120,
  sortable: true,
  align: "center",
  showOverflowTooltip: true,
  basicType: "settlementBusinessType"
}

const TABLE_COLS_11 = {
  prop: "joinOrderNo",
  label: "来源工作单",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}

const TABLE_COLS_12 = {
  prop: "joinBusinessType",
  label: "来源业务",
  minWidth: 120,
  sortable: true,
  align: "center",
  showOverflowTooltip: true,
  basicType: "settlementBusinessType"
}

const TABLE_COLS_13 = {
  prop: "checkName",
  label: "确认人",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_14 = {
  prop: "billNo",
  label: "对账单",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}

const TABLE_COLS_15 = {
  prop: "lockOrder",
  label: "锁单",
  minWidth: 100,
  sortable: true,
  fontColor: true,
  align: "center",
  showOverflowTooltip: true,
  basicType: "trueOrFalse"
}

const TABLE_COLS_16 = {
  prop: "operatorName",
  label: "操作员",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_17 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_18 = {
  prop: "createBy",
  label: "创建人",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_19 = {
  prop: "remark",
  label: "备注",
  minWidth: 100,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_20 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_21 = {
  prop: "updateBy",
  label: "最后操作人",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_22 = {
  prop: "updateTime",
  label: "最后操作时间",
  minWidth: 140,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_23 = {
  prop: "businessCompanyName",
  label: "记账主体",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_24 = {
  prop: "currentMoonBaseRate",
  label: "本位币汇率",
  minWidth: 140,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_25 = {
  prop: "currentMoonHelpRate",
  label: "辅助币汇率",
  minWidth: 140,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_26 = {
  prop: "accountingTime",
  label: "记账时间",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
}
const TABLE_COLS_27 = {
  prop: "checkStatus",
  label: "确认状态",
  minWidth: 110,
  sortable: true,
  dotColor: true,
  align: "center",
  fixed: "right",
  customRow: true,
  showOverflowTooltip: true,
  basicType: "settleAccountBillCheckStatus"
}
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: 'right',
  width: '130px'
}



export const associatedtableConfig = (activeName) => {
  //待关联明细
  const tableConfig = {
    1: [
      TABLE_COLS_SELECT,
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_4,
      TABLE_COLS_5,
      TABLE_COLS_6,
      TABLE_COLS_7,
      TABLE_COLS_8,
      TABLE_COLS_9,
      TABLE_COLS_10,
      TABLE_COLS_11,
      TABLE_COLS_12,
      TABLE_COLS_13,
      // TABLE_COLS_14,
      TABLE_COLS_15,
      // TABLE_COLS_16,
      // TABLE_COLS_17,
      TABLE_COLS_18,
      TABLE_COLS_19,
      TABLE_COLS_20,
      TABLE_COLS_21,
      TABLE_COLS_22,
      TABLE_COLS_23,
      TABLE_COLS_27,
      {
        ...TABLE_COLS_OPERATION,
        width: '110px'
      },
    ],
    2: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,//类型
      TABLE_COLS_2,//费用名称
      TABLE_COLS_3,//往来单位
      TABLE_COLS_4,//金额
      TABLE_COLS_5,//币别
      TABLE_COLS_6,//双向类型
      TABLE_COLS_7,//单价
      TABLE_COLS_8,//数量
      TABLE_COLS_9,//工作单号
      TABLE_COLS_10,//业务类型
      TABLE_COLS_11,//来源工作单
      TABLE_COLS_12,//来源业务
      TABLE_COLS_13,//确认人
      TABLE_COLS_14,//对账单
      TABLE_COLS_15,//锁单
      TABLE_COLS_16,//操作员
      TABLE_COLS_17,//业务员
      TABLE_COLS_18,//创建人
      TABLE_COLS_19,//备注
      TABLE_COLS_24,//本位币汇率
      TABLE_COLS_25,//辅助币汇率
      TABLE_COLS_26,//记账时间
      TABLE_COLS_20,//创建时间
      TABLE_COLS_21,//最后操作人
      TABLE_COLS_22,//最后操作时间
      TABLE_COLS_23,//记账主体
    ]
  }
  return tableConfig[activeName]
}




export const confirmedTableConfig = (activeName) => {
  //待确认明细
  const tableConfig = {
    1: [
      TABLE_COLS_SELECT,
      TABLE_COLS_INDEX,
      TABLE_COLS_1,//类型
      TABLE_COLS_2,//费用名称
      TABLE_COLS_3,//往来单位
      TABLE_COLS_4,//金额
      TABLE_COLS_5,//币别
      TABLE_COLS_6,//双向类型
      TABLE_COLS_7,//单价
      TABLE_COLS_8,//数量
      TABLE_COLS_9,//工作单号
      TABLE_COLS_10,//业务类型
      TABLE_COLS_11,//来源工作单
      TABLE_COLS_12,//来源业务
      TABLE_COLS_13,//确认人
      // TABLE_COLS_14,//对账单
      TABLE_COLS_15,//锁单
      // TABLE_COLS_16,//操作员
      // TABLE_COLS_17,//业务员
      TABLE_COLS_18,//创建人
      TABLE_COLS_19,//备注
      TABLE_COLS_20,//创建时间
      TABLE_COLS_21,//最后操作人
      TABLE_COLS_22,//最后操作时间
      TABLE_COLS_23,//记账主体
      TABLE_COLS_27,
      TABLE_COLS_OPERATION,
    ],
    2: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,//类型
      TABLE_COLS_2,//费用名称
      TABLE_COLS_3,//往来单位
      TABLE_COLS_4,//金额
      TABLE_COLS_5,//币别
      TABLE_COLS_6,//双向类型
      TABLE_COLS_7,//单价
      TABLE_COLS_8,//数量
      TABLE_COLS_9,//工作单号
      TABLE_COLS_10,//业务类型
      TABLE_COLS_11,//来源工作单
      TABLE_COLS_12,//来源业务
      TABLE_COLS_13,//确认人
      TABLE_COLS_14,//对账单
      TABLE_COLS_15,//锁单
      TABLE_COLS_16,//操作员
      TABLE_COLS_17,//业务员
      TABLE_COLS_18,//创建人
      TABLE_COLS_19,//备注
      TABLE_COLS_24,//本位币汇率
      TABLE_COLS_25,//辅助币汇率
      TABLE_COLS_26,//记账时间
      TABLE_COLS_20,//创建时间
      TABLE_COLS_21,//最后操作人
      TABLE_COLS_22,//最后操作时间
      TABLE_COLS_23,//记账主体
    ]
  }
  return tableConfig[activeName]
}





const FORMDIALOG_COLS_1 = {
  span: 24,
  id: "sourceJoinBusinessType",
  label: "来源业务：",
  type: "txt",
  basicType: "settlementBusinessType"
}

const FORMDIALOG_COLS_2 = {
  span: 24,
  id: "sourceJoinOrderNo",
  label: "来源单号：",
  type: "txt",
}
const FORMDIALOG_COLS_3 = {
  span: 24,
  id: "businessCompanyName",
  label: "记账主体：",
  type: "txt",
}
const FORMDIALOG_COLS_4 = {
  span: 24,
  id: "checkId",
  label: "指定确认人：",
  placeholder: "请选择",
  ...httpUserSelect()
}
const FORMDIALOG_COLS_5 = {
  span: 24,
  id: "businessType",
  label: "关联业务类型：",
  placeholder: "请选择",
  type: "select",
  basicType: "settlementBusinessType",
  hideList: [1, 2]
}
const FORMDIALOG_COLS_6 = {
  span: 24,
  id: "orderId",
  label: "关联工作单号：",
  placeholder: "请选择",
  ...httpByRelevancy(),
  isAutoInitRequest: true,
  defaultKey: "orderId",
  type: "slot"
}
const FORMDIALOG_COLS_7 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
}
const FORMDIALOG_COLS_8 = {
  span: 24,
  id: "num",
  label: "选择票数：",
  type: "txt",
}
const FORMDIALOG_COLS_9 = {
  ...FORMDIALOG_COLS_5,
  label: "确认业务类型：",
}
const FORMDIALOG_COLS_10 = {
  ...FORMDIALOG_COLS_6,
  label: "确认工作单号：",
}
const FORMDIALOG_COLS_11 = {
  span: 24,
  id: "tips",
  type: "slot",
  labelWidth: "40px"
}

const FORMDIALOG_COLS_12 = {
  span: 24,
  id: "remark",
  label: "驳回理由：",
  type: "textarea",
}

// const FORM_COLS_3 = {
//   id: "businessType",
//   label: "业务类型：",
//   placeholder: "请选择",
//   type: "select",
//   basicType: "settlementBusinessType"
// }


export const associatedCustomDialogCols = (row = {}) => {
  const { title, type, businessChange } = row
  const cols = {
    0: [
      FORMDIALOG_COLS_1,
      FORMDIALOG_COLS_2,
      FORMDIALOG_COLS_3,
      FORMDIALOG_COLS_4,
      {
        ...FORMDIALOG_COLS_5,
        handle: businessChange
      },
      FORMDIALOG_COLS_6,
      FORMDIALOG_COLS_7,
    ],
    1: [
      FORMDIALOG_COLS_1,
      FORMDIALOG_COLS_2,
      FORMDIALOG_COLS_3,
      FORMDIALOG_COLS_4,
      {
        ...FORMDIALOG_COLS_5,
        handle: businessChange
      },
      FORMDIALOG_COLS_6,
      FORMDIALOG_COLS_7,
    ],
    2: [
      FORMDIALOG_COLS_1,
      FORMDIALOG_COLS_2,
      FORMDIALOG_COLS_8,
      FORMDIALOG_COLS_3,
      FORMDIALOG_COLS_4,
      {
        ...FORMDIALOG_COLS_5,
        handle: businessChange
      },
      FORMDIALOG_COLS_6,
      FORMDIALOG_COLS_7,
    ],
  }
  return {
    title: title,
    width: '600px',
    labelWidth: '105px',
    simpleCustomCols: cols[type],
    formRules: {
      checkId: [
        { required: true, message: `请选择指定确认人`, trigger: "change" }
      ],
      businessType: [
        { required: true, message: `请选择关联业务类型`, trigger: "change" }
      ],
      orderId: [
        { required: true, message: `请选择关联工作单号`, trigger: "change" }
      ],
    }
  }
}




export const confirmedDialogCols = (row = {}) => {
  //带确认明细，批量确认
  const { businessChange } = row
  return {
    title: "双向费用确认",
    width: '600px',
    labelWidth: '105px',
    simpleCustomCols: [
      FORMDIALOG_COLS_11,
      FORMDIALOG_COLS_1,
      FORMDIALOG_COLS_2,
      FORMDIALOG_COLS_8,
      FORMDIALOG_COLS_3,
      {
        ...FORMDIALOG_COLS_9,
        handle: businessChange
      },
      FORMDIALOG_COLS_10,
      FORMDIALOG_COLS_7
    ],
    formRules: {
      businessType: [
        { required: true, message: `请选择关联业务类型`, trigger: "change" }
      ],
      orderId: [
        { required: true, message: `请选择关联工作单号`, trigger: "change" }
      ],
    }
  }
}




export const transmitDialogCols = (row = {}) => {
  //带确认明细，转交确认人
  return {
    title: "转交确认人",
    width: '600px',
    labelWidth: '105px',
    simpleCustomCols: [
      FORMDIALOG_COLS_8,
      FORMDIALOG_COLS_3,
      FORMDIALOG_COLS_4,
    ],
    formRules: {
      checkId: [
        { required: true, message: `请选择指定确认人`, trigger: "change" }
      ],
    }
  }
}




export const rejectDialogCols = (row = {}) => {
  //带确认明细，驳回
  return {
    title: "驳回",
    width: '600px',
    labelWidth: '105px',
    simpleCustomCols: [
      FORMDIALOG_COLS_12
    ],
    formRules: {
    }
  }
}
