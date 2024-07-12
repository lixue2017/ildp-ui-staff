import { httpgetCustlist, httpBillCompanyList } from "@/comModel/httpSelect.js"
import { httpWarehousePublicSelect } from '@/comModel/warehouse';
const FORM_COLS_1 = {
  span: 8,
  id: "name",
  label: "方案名称：",
  placeholder: "请输入方案名称",
  type: "text",
}

const FORM_COLS_2 = {
  span: 8,
  id: "billCompanyId",
  label: "计费公司：",
  placeholder: "请选择计费公司",
  ...httpBillCompanyList({ type: 0, searchName: "billCompanyName" }),
}

const FORM_COLS_3 = {
  span: 8,
  id: "billWarehouseId",
  label: "计费仓：",
  // focusLoad: true,
  placeholder: "请选择计费仓",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
  type: "slot",
  // txtTagArr: [
  //   {
  //     basicType: "costSchemeStatus",
  //     basicTypeVal: "status",
  //   }
  // ]
}
const FORM_COLS_4 = {
  span: 8,

  id: "businessType",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type: "select",
  basicType: "warehouseBusinessType"
}
const FORM_COLS_5 = {
  span: 8,
  id: "billUnit",
  label: "计价单位：",
  type: "radio",
  basicType: "warehousePricingUnit"
}
const FORM_COLS_6 = {
  span: 8,
  id: "closingType",
  label: "结算方式：",
  type: "txt",
  basicType: "warehouseRentSettlement"
}
const FORM_COLS_7 = {
  span: 8,
  id: "billCurrency",
  label: "计费币种：",
  placeholder: "请选择计费币种",
  type: "autocomplete",
  category: "currency",
}
const FORM_COLS_8 = {
  span: 8,
  id: "rentFreeType",
  label: "免租类型：",
  placeholder: "请选择免租类型",
  type: "radio",
  basicType: "warehouseRentFreeType"
}
const FORM_COLS_9 = {
  span: 8,
  id: "rentFreeDay",
  label: "免租天数：",
  placeholder: "请输入免租天数",
  type: "slot",
}
const FORM_COLS_10 = {
  span: 8,
  id: "startTime",
  label: "有效开始时间：",
  placeholder: "请选择有效开始时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
    },
  }
}
const FORM_COLS_11 = {
  span: 8,
  id: "endTime",
  label: "有效结束时间：",
  placeholder: "请选择有效结束时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
    },
  }
}

const FORM_COLS_12 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入备注",
  type: "textarea",
}

const FORM_COLS_13 = {
  span: 24,
  id: "startUseTime",
  label: "启用时间：",
  placeholder: "请输入启用时间",
  type: "textarea",
}

const FORM_COLS_SLOT = {
  type: "slot",
}

const TABLE_COLS_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
const TABLE_COLS_1 = {
  prop: "startValue",
  label: "开始值",
  placeholder: "开始值",
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  prop: "endValue",
  label: "(≤)结束值",
  placeholder: "结束值",
  decimal: 0,
  customHeader: true,
  showOverflowTooltip: true,
  customRow: true,
}
const TABLE_COLS_3 = {
  prop: "unitPrice",
  label: "单价",
  placeholder: "单价",
  decimal: 3,
  customHeader: true,
  showOverflowTooltip: true,
  customRow: true,
}
const TABLE_COLS_4 = {
  prop: "minPrice",
  label: "最低费用",
  placeholder: "最低费用",
  decimal: 3,
  customHeader: true,
  showOverflowTooltip: true,
  customRow: true,
}
const TABLE_COLS_5 = {
  prop: "maxPrice",
  label: "最高费用",
  placeholder: "最高费用",
  decimal: 3,
  showOverflowTooltip: true,
  customRow: true,
}
const TABLE_COLS_6 = {
  prop: "remark",
  label: "补充说明",
  placeholder: "补充说明",
  showOverflowTooltip: true,
  customRow: true,
}

const TABLE_COLS_7 = {
  prop: "customerName",
  label: "客户",
  showOverflowTooltip: true
}
const TABLE_COLS_8 = {
  prop: "createBy",
  label: "操作人",
  showOverflowTooltip: true
}
const TABLE_COLS_9 = {
  prop: "createTime",
  label: "添加时间",
  showOverflowTooltip: true
}
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,  //MODEL中的配置
  fixed: 'right',
  width: '170px'
}

const haveRentFreeDays = [
  FORM_COLS_9,
  // FORM_COLS_10,
  // FORM_COLS_11,
  FORM_COLS_12,
]
const noRentFreeDays = [
  {
    ...FORM_COLS_SLOT,
    id: "rentFreeDay",
    span: 8
  },
  // FORM_COLS_10,
  // FORM_COLS_11,
  FORM_COLS_12,
]
const formConfig = {
  0: [...noRentFreeDays],
  1: [...haveRentFreeDays]
}



export const warehouseRentFormConfig = (row = {}) => {
  //仓储方案新增与修改form
  const { warehouseChange, changeType } = row
  const formChangeCols = formConfig[changeType]
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_3,//计费仓
                FORM_COLS_4,//业务类型
                FORM_COLS_5,//计价单位
                FORM_COLS_1,//方案名称
                FORM_COLS_7,//计费币别
                FORM_COLS_6,//结算方式
                FORM_COLS_8,//免租
                ...formChangeCols
              ],
            },
          ],
        },
      ],
    },
  ]
}


export const warehouseRentTableConfig = [
  //仓储方案新增与修改table
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_OPERATION
]




const publicFormRules = {
  name: [
    { required: true, message: "请输入方案名称", trigger: "change" },
  ],
  billCompanyId: [
    { required: true, message: "请选择计费公司", trigger: "change" },
  ],
  businessType: [
    { required: true, message: "请选择业务类型", trigger: "change" },
  ],
  billUnit: [
    { required: true, message: "请选择计价单位", trigger: "change" },
  ],
  billCurrency: [
    { required: true, message: "请选择计费币种", trigger: "change" },
  ],
  rentFreeType: [
    { required: true, message: "请选择免租类型", trigger: "change" },
  ],
  startTime: [
    { required: true, message: "请选择有效开始时间", trigger: "change" },
  ],
  endTime: [
    { required: true, message: "请选择有效结束时间", trigger: "change" },
  ],
  billWarehouseId: [
    { required: true, message: "请选择计费仓", trigger: "change" },
  ],
}



export const rentFreeDay = [
  { required: true, message: "请选择免租天数", trigger: "change" },
]


export const warehouseRentFormRulesConfig = (row = {}) => {
  //仓租方案新增修改formrules
  //rentFreeType 0-无免租类型  1-按入库时间
  const { rentFreeType = 0 } = row
  const rulesChange = rentFreeType == 1 ? rentFreeDay : []
  const rulesList = {
    ...publicFormRules,
    rentFreeDay: rulesChange || undefined
  }
  return rulesList
}




const detailFormConfig = [
  //仓储详情
  FORM_COLS_3,//计费仓
  FORM_COLS_4,//业务类型
  FORM_COLS_5,//计价单位
  FORM_COLS_1,//方案名称
  {
    ...FORM_COLS_7,//计费币种
    id: "billCurrencyName"
  },
  {
    ...FORM_COLS_6,//结算方式
    txtTagArr: [
      {
        basicType: "costSchemeStatus",
        basicTypeVal: "status",
      }
    ]
  },
  FORM_COLS_8,//免租类型
  FORM_COLS_9,//免租天数
  FORM_COLS_12,//备注
]




export const warehouseRentDetailFormConfig = () => {
  //仓租方案详情form
  const slotCols = ['billWarehouseId']
  const radioCols = ['billUnit', 'rentFreeType']
  const formCols = detailFormConfig.map((e) => {
    if (slotCols.includes(e.id)) {
      return {
        ...e,
        type: 'slot'
      }
    } else if (radioCols.includes(e.id)) {
      return {
        ...e,
        disable: true
      }
    } else {
      return {
        ...e,
        type: "txt"
      }
    }
  })
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: formCols
            },
          ],
        },
      ],
    },
  ]
}

export const detailTableConfig = [
  //仓储详情
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
]

export const warehouseRentDetailTableConfig = () => {
  //仓租方案详情table
  const detailTableConfigCopy = JSON.parse(JSON.stringify(detailTableConfig))
  const tableConfig = detailTableConfigCopy.map((e) => {
    e.customRow = false
    return e
  })
  return tableConfig
}

export const relatedCustomers=()=>{
  return [
    TABLE_COLS_INDEX,
    TABLE_COLS_SELECTION,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_9,
    TABLE_COLS_OPERATION
  ]
}




