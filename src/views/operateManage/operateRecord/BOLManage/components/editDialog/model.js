
import { httpCustomerSelect } from '@/comModel/httpSelect'
import { httpPortPublicSelect } from '@/comModel/httpSelect.js'


const txtRules = {
  message: '此处不能输入中文',
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur"
}
const COLS_1 = [
  {
    span: 12,
    id: "shipperId",
    label: "发货人",
    labelClassName: "item-label-title",
    labelWidth: "80px",
    placeholder: "请选择发货人",
    selectTxtWidth: 390,
    type: "slot",
  },
  {
    span: 12,
    id: "BLinfo",
    labelWidth: "0px",
    type: "slot",
  },
  {
    span: 12,
    id: "consigneeId",
    label: "收货人",
    labelWidth: "80px",
    labelClassName: "item-label-title",
    placeholder: "请选择收货人",
    selectTxtWidth: 390,
    type: "slot",
  },
  {
    span: 12,
    id: "notifierId",
    label: "通知人",
    labelWidth: "80px",
    labelClassName: "item-label-title",
    placeholder: "请选择通知人",
    selectTxtWidth: 390,
    type: "slot",
  },
]

const COLS_2 = [
  {
    span: 8,
    id: "shipName",
    label: "船名：",
    placeholder: "请输入船名",
    type: "text"
  },
  {
    span: 8,
    id: "plName",
    label: "发货地：",
    placeholder: "请选择发货地",
    type: "text"
    // isBackAll: true,
    // searchParamName: 'search',
    // ...httpPortPublicSelect('0,1,2,3'),
  },
  {
    span: 8,
    id: "polName",
    label: "装货港：",
    placeholder: "请选择装货港",
    type: "text"
    // isBackAll: true,
    // searchParamName: 'search',
    // ...httpPortPublicSelect('0,1,2,3'),
  },
  {
    span: 8,
    id: "voy",
    label: "船次：",
    placeholder: "请输入船次",
    type: "text"
  },
  {
    span: 8,
    id: "podName",
    label: "卸货港：",
    placeholder: "请选择卸货港",
    type: "text"
    // isBackAll: true,
    // searchParamName: 'search',
    // ...httpPortPublicSelect('0,1,2,3'),
  },
  {
    span: 8,
    id: "dapName",
    label: "交货地：",
    placeholder: "请选择交货地",
    type: "text"
    // isBackAll: true,
    // searchParamName: 'search',
    // ...httpPortPublicSelect('0,1,2,3'),
  },
]
const FORM_3_COL_1 = {
  span: 24,
  id: "goodsTable",
  labelWidth: "0",
  type: "slot",
}
const FORM_3_COL_2 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
}
const FORM_3_COL_3 = {
  span: 12,
  id: "maitou",
  label: "唛头：",
  placeholder: "请输入唛头",
  type: "textarea",
  maxlength: 3000,
  rows: 4
}
const FORM_3_COL_4 = {
  span: 12,
  id: "productName",
  label: "品名：",
  placeholder: "请输入品名",
  type: "textarea",
  maxlength: 3000,
  rows: 4
}
const FORM_3_COL_X3 = {
  span: 24,
  id: "containerSno",
  label: "集装箱信息：",
  placeholder: "--",
  type: "txt"
}
const COLS_3 = (type) => [
  FORM_3_COL_1,
  ...type === 1 ? [{ ...FORM_3_COL_3, type: "txt", placeholder: "--" }, { ...FORM_3_COL_4, type: "txt", placeholder: "--" }] : [FORM_3_COL_3, FORM_3_COL_4],
]
const COLS_3_1 = [
  FORM_3_COL_1,
  // FORM_3_COL_2
]
const COLS_4 = [
  {
    span: 12,
    id: "transportationClause",
    label: "运输条款：",
    placeholder: "请选择",
    type: "select",
		isFilterable: true,
    basicType: "transportationClause"
  },
  {
    span: 12,
    id: "tdisType",
    label: "签发方式：",
    placeholder: "请选择签发方式",
    type: "radio",
    basicType: "issuingMethod"
  },
  {
    span: 12,
    id: "fsaId",
    label: "海外代理：",
    placeholder: "请选择海外代理",
    selectTxtWidth: 390,
    type: "slot",
    className: "fsa-custom"
    // isBackAll: true,
    // ...httpCustomerSelect({ clientIdentity: 0 })
  },
  {
    span: 12,
    id: "shipmentTime",
    label: "装船日期：",
    placeholder: "请选择装船日期",
    type: "date"
  },
  {
    span: 12,
    id: "payType",
    label: "付款方式：",
    placeholder: "请选择付款方式",
    type: "radio",
    basicType: "paymentType",
  },
  {
    span: 12,
    id: "tdisId",
    label: "签发地：",
    placeholder: "请输入签发地",
    type: "text"
    // type: "select",
    // basicType: "clientIdentity",
  },
  {
    span: 12,
    id: "tdisTime",
    label: "签发日期：",
    placeholder: "请选择签发日期",
    type: "date"
  },
]
export const configLists = (orderType = 0, type = 0) => {
  // 订单类型  2-电商 其他都为传统
  return [
    {
      fieldList: [
        {
          // className: 'border-bottom-solid trans-mode',
          rows: [
            {
              cols: COLS_1
            },
          ],
        },
        {
          className: 'border-bottom-solid form-cols-2',
          rows: [
            {
              cols: COLS_2,
            },
          ],
        },
        {
          // className: 'border-bottom-solid',
          rows: [
            {
              cols: orderType == 2 ? COLS_3_1 : COLS_3(type),
            },
          ],
        },
        {
          className: 'custom-form',
          rows: [
            {
              cols: COLS_4,
            },
          ],
        },
      ],
    }
  ]
}

export const configFormRules = {
  shipperId: [
    { required: true, message: "请选择发货人", trigger: "change" },
    txtRules
  ],
  consigneeId: [
    { required: true, message: "请选择收货人", trigger: "change" },
    txtRules
  ],
  // notifierId: [
  //   { required: true, message: "请选择通知人", trigger: "change" },
  // ],
  shipName: [
    // { required: true, message: "请输入船名", trigger: "change" },
    txtRules
  ],
  plName: [
    { required: true, message: "请输入发货地", trigger: "change" },
    txtRules
  ],
  polName: [
    { required: true, message: "请输入装货地", trigger: "change" },
    txtRules
  ],
  voy: [
    // { required: true, message: "请输入船次", trigger: "change" },
    txtRules
  ],
  podName: [
    { required: true, message: "请输入卸货港", trigger: "change" },
    txtRules
  ],
  dapName: [
    { required: true, message: "请输入交货地点", trigger: "change" },
    txtRules
  ],
  maitou: [txtRules],
  productName: [txtRules],
  transportationClause: [
    { required: true, message: "请选择运输条款", trigger: "change" },
  ],
  tdisType: [
    { required: true, message: "请选择签发方式", trigger: "change" },
  ],
  shipmentTime: [
    { required: true, message: "请选择装船日期", trigger: "change" },
  ],
  payType: [
    { required: true, message: "请选择付款方式", trigger: "change" },
  ],
  tdisId: [
    { required: true, message: "请输入签发地", trigger: "blur" },
    txtRules
  ],
  tdisTime: [
    { required: true, message: "请选择签发日期", trigger: "change" },
  ],
  sortBoxCode: [
    { required: true, message: "请输入整柜批次号", trigger: "change" },
    txtRules
  ],
  hblNo: [
    { required: true, message: "请输入运单号", trigger: "blur" },
    txtRules
  ],
}

const TABLE_EDIT_1_0 = {
  type: "index",
  width: 50,
  align: "center",
}
const TABLE_EDIT_1_1 = {
  label: "唛头",
  prop: "maitou",
  minWidth: 120,
  customRow: true,
  showOverflowTooltip: true,
}
const TABLE_EDIT_1_2 = {
  label: "数量",
  prop: "warehousingQuantity",
  minWidth: 120,
  align: "center",
  decimal: 0,
  customRow: true,
  showOverflowTooltip: true,
}
const TABLE_EDIT_1_3 = {
  label: "种类",
  prop: "packTypeId",
  minWidth: 120,
  customRow: true,
  showOverflowTooltip: true,
  basicType: "packagingCode"
}
const TABLE_EDIT_1_4 = {
  label: "货物信息(品名)",
  prop: "productName",
  minWidth: 120,
  customRow: true,
  showOverflowTooltip: true,
}
const TABLE_EDIT_1_5 = {
  label: "海关编码",
  prop: "customsCode",
  minWidth: 120,
  customRow: true,
  showOverflowTooltip: true,
}
const TABLE_EDIT_1_6 = {
  label: "毛重/KGS",
  prop: "warehousingTotalWeight",
  width: 120,
  customRow: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
}
const TABLE_EDIT_1_7 = {
  label: "立方/CBM",
  prop: "warehousingTotalVolume",
  width: 120,
  customRow: true,
  showOverflowTooltip: true,
  align: "right",
  decimal: 3,
}
const TABLE_EDIT_1_8 = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  customRow: true,
  showOverflowTooltip: true,
  width: 110,
}
const TABLE_EDIT_2_1 = (isEdit = true) => {
  const TABLE_EDIT_2_1_COM = {
    label: "柜型",
    minWidth: 150,
    showOverflowTooltip: true,
  }
  if (!isEdit) {
    return {
      ...TABLE_EDIT_2_1_COM,
      prop: "boxSizeCode",
    }
  }
  return {
    ...TABLE_EDIT_2_1_COM,
    placeholder: "柜型",
    prop: "boxSizeId",
    customRow: true
  }
}
const TABLE_EDIT_2_2 = {
  label: "箱号",
  prop: "ontainerSno",
  placeholder: "箱号",
  width: 120,
  customRow: true,
  showOverflowTooltip: true,
}
const TABLE_EDIT_2_3 = {
  label: "封号",
  prop: "sealingStripSno",
  placeholder: "封号",
  width: 120,
  customRow: true,
  showOverflowTooltip: true,
}
export const goodsInfo = (orderType = 0, isEdit = true) => {
  let goodsCols = []
  if (orderType == 2) {
    goodsCols = [
      TABLE_EDIT_1_0,
      TABLE_EDIT_1_1,
      TABLE_EDIT_1_2,
      TABLE_EDIT_1_3,
      TABLE_EDIT_1_4,
      TABLE_EDIT_1_5,
    ]
  } else {
    goodsCols = [
      TABLE_EDIT_1_0,
      TABLE_EDIT_2_2,
      TABLE_EDIT_2_3,
      TABLE_EDIT_1_2,
      TABLE_EDIT_1_3,
      TABLE_EDIT_2_1(isEdit),
    ]
  }
  goodsCols = goodsCols.concat([
    TABLE_EDIT_1_6,
    TABLE_EDIT_1_7
  ])
  if (isEdit) {
    goodsCols.push(TABLE_EDIT_1_8)
  } else {
    goodsCols.forEach(e => {
      e.placeholder = '--'
    })
  }
  return goodsCols
}

export const containerTableCols = (isEdit = true) => {
  let containerCols = [
    TABLE_EDIT_1_0,
    TABLE_EDIT_2_1(isEdit),
    TABLE_EDIT_2_2,
    TABLE_EDIT_2_3
  ]
  if (isEdit) {
    containerCols.push(TABLE_EDIT_1_8)
  }
  return containerCols
}
