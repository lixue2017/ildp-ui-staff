import { httpRoleDeptUserSelect, httpGetCashierList } from '@/comModel/httpSelect';
const SEARCH_COL_1 = {
  span: 8,
  id: "cashierBy",
  label: "指定付款人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] })
}
const SEARCH_COL_2 = {
  span: 8,
  id: "bankReceiptCheckBy",
  label: "水单上传人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] })
}
const SEARCH_COL_3 = {
  span: 8,
  id: "verificationBy",
  label: "财务核销人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] })
}
const SEARCH_COL_4 = {
  span: 8,
  id: "latestPaymentDate",
  label: "最迟付款日：",
  placeholder: "请选择",
  type: "date",
  valueFormat: "yyyy-MM-dd"
}
const SEARCH_COL_5 = {
  span: 16,
  id: "remark",
  label: "分配备注：",
  placeholder: "请输入",
  type: "textarea",
  rows: 1
}
const SEARCH_COL_5_2 = {
  span: 12,
  id: "cashierRemark",
  label: "分配备注：",
  placeholder: "--",
  type: "txt"
}
const SEARCH_COL_6 = {
  span: 24,
  id: "ids",
  label: "选择财务单：",
  placeholder: "请选择",
  isAutoInitRequest: true,
  multiple: true,
  isBackAll: true,
  defaultKey: 'id',
  ...httpGetCashierList(),
  type: "slot"
}
const SEARCH_COL_7 = {
  span: 12,
  id: "generalCashierName",
  label: "总出纳：",
  placeholder: "--",
  type: "txt",
}
const SEARCH_COL_8 = {
  span: 12,
  id: "remark",
  label: "付款备注：",
  placeholder: "请输入",
  type: "textarea",
  rows: 1
}
const SEARCH_COL_8_2 = {
  span: 12,
  id: "checkRemark",
  label: "付款备注：",
  placeholder: "请输入",
  type: "txt",
}
const SEARCH_COL_9 = {
  span: 12,
  id: "UNCHARTED_SEARCH_9",
  label: "付款核销人：",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ['CW'] })
}
const SEARCH_COL_10 = {
  span: 12,
  id: "remark",
  label: "上传水单备注：",
  placeholder: "请输入",
  type: "textarea",
  rows: 1
}

const SEARCH_COL_11 = {
  ...SEARCH_COL_1,
  id: "cashierByName",
  type: 'txt',
  span: 12,
}

const SEARCH_COL_12 = {
  span: 12,
  id: "bankReceiptCheckByName",
  label: "水单上传人：",
  placeholder: "--",
  type: "txt"
}
const SEARCH_COL_13 = {
  span: 24,
  id: "uploadWater",
  labelWidth: '0',
  type: "slot"
}
const SEARCH_COL_TABLE = {
  span: 24,
  id: "table",
  labelWidth: '0',
  type: "slot",
}
const SEARCH_COL_ATTACH = {
  span: 24,
  id: "attachId",
  labelWidth: "0",
  fileLabel: "上传图片",
  type: "customUploadFile",
  imageCardUrl: 'url',
  pasteUpload: true,
}

export const outMergeFormConfig = () => {
  //外部付款-合并分配
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_1,
                  SEARCH_COL_2,
                  SEARCH_COL_3,
                  SEARCH_COL_4,
                  SEARCH_COL_5,
                  SEARCH_COL_6,
                  SEARCH_COL_TABLE,
                ],
              },
            ],
          }
        ],
      }
    ],
    formRules: {
      cashierBy: [
        { required: true, message: "请选择指定付款人", trigger: "change" },
      ],
      bankReceiptCheckBy: [
        { required: true, message: "请选择水单上传人", trigger: "change" },
      ],
      verificationBy: [
        { required: true, message: "请选择财务核销人", trigger: "change" },
      ],
      latestPaymentDate: [
        { required: true, message: "请选择最迟付款日", trigger: "change" },
      ],
    }
  }
}

export const paymentFormConfig = () => {
  // 付款任务单合并分配后的数据付款登记
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_7,
                  {
                    ...SEARCH_COL_4,
                    type: 'txt',
                    span: 12,
                  },
                  SEARCH_COL_11,
                  SEARCH_COL_5_2,
                  {
                    ...SEARCH_COL_2,
                    span: 12
                  },
                  SEARCH_COL_8,
                  SEARCH_COL_TABLE,

                ],
              },
            ],
          }
        ],
      }
    ],
    formRules: {
      uploadBy: [
        { required: true, message: "请选择水单上传人", trigger: "change" },
      ],
    }
  }
}



export const waterBillFormConfig = () => {
  // 付款任务单合并分配后的数据上传水单
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  SEARCH_COL_7,
                  {
                    ...SEARCH_COL_4,
                    type: 'txt',
                    span: 12
                  },
                  SEARCH_COL_11,
                  SEARCH_COL_5_2,
                  SEARCH_COL_12,
                  SEARCH_COL_8_2,
                  {
                    ...SEARCH_COL_3,
                    label: "付款核销人：",
                    span: 12
                  },
                  SEARCH_COL_10,
                  SEARCH_COL_TABLE,
                  // SEARCH_COL_ATTACH,
                  SEARCH_COL_13
                ],
              },
            ],
          }
        ],
      }
    ],
    formRules: {
      verificationBy: [
        { required: true, message: "请选择付款核销人", trigger: "change" },
      ],
      attachId: [
        { required: true, message: "请上传附件", trigger: "change" },
      ],
    }
  }
}



const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left"
}

const TABLE_COLS_1 = {
  prop: "type",
  label: "类型",
  minWidth: 80,
  showOverflowTooltip: true,
  fontColor: true,
  basicType: "billType"
}
const TABLE_COLS_2 = {
  prop: "statementsCode",
  label: "财务单号",
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "dealingsCompanyName",
  label: "往来单位",
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COLS_4 = {
  prop: "orderNo",
  label: "工作单号",
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COLS_5 = {
  prop: "money",
  label: "待收/付金额",
  minWidth: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 80,
  showOverflowTooltip: true
}
const TABLE_COLS_7 = {
  prop: "businessCompanyName",
  label: "业务单位",
  minWidth: 100,
  showOverflowTooltip: true
}
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  showOverflowTooltip: true,
  minWidth: 120,
  fixed: "right"
}

export const outMergeTableConfig = () => {
  return [
    TABLE_COL_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_OPERATION
  ]
}
export const paymentTableConfig = () => {
  return [
    TABLE_COL_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
  ]
}

export const waterBillTableConfig = () => {
  return [
    TABLE_COL_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
  ]
}

/**
 * WEB_outMerge  付款待分配页面，外部合并付款
 * WEB_uploadWaterBillMerge  付款任务单页面，合并分配后的数据上传水单
 * WEB_paymentMerge  付款任务单页面，合并分配后的数据付款登记
 *
 */
export const getFormConfig = (row = {}) => {
  const { drawerType } = row
  return {
    'WEB_outMerge': outMergeFormConfig(),
    'WEB_uploadWaterBillMerge': waterBillFormConfig(),
    'WEB_paymentMerge': paymentFormConfig()
  }[drawerType]

}


export const getTableConfig = (row = {}) => {
  const { drawerType } = row
  return {
    'WEB_outMerge': outMergeTableConfig(),
    'WEB_uploadWaterBillMerge': waterBillTableConfig(),
    'WEB_paymentMerge': paymentTableConfig()
  }[drawerType]
}
