import { httpGetSchemeList, httpGetServiceChannel } from "@/comModel/httpSelect.js"
import { httpWarehousePublicSelect } from '@/comModel/warehouse';

const FORM_COLS_1 = {
  span: 12,
  id: "serviceId",
  label: "服务商渠道：",
  ...httpGetServiceChannel(),
  placeholder: "请输入服务商渠道"
}
const FORM_COLS_2 = {
  span: 8,
  id: "name",
  label: "规则名称：",
  placeholder: "请输入成本规则名称",
  type: "text",
}

const FORM_COLS_3 = {
  span: 8,
  id: "adWarehouse",
  label: "适配仓库：",
  multiple: true,
  isBackAll: true,
  isAutoInitRequest: true,
  collapseTags: true,
  defaultKey: 'id',
  placeholder: "请选择关联国内仓",
  ...httpWarehousePublicSelect({ typeList: "2,3", flagAvailable: "y", itemId: "id" })
}

const FORM_COLS_4 = {
  span: 8,
  id: "countryId",
  label: "国家：",
  type: "autocomplete",
  placeholder: "请选择国家",
  category: "country",
  defaultProp: {
    value: 'id',
    label: 'twoCode,nameCn'
  }
}

const FORM_COLS_5 = {
  span: 8,
  id: "billCurrency",
  label: "计费币种：",
  type: "autocomplete",
  placeholder: "请选择计费币种",
  category: "currency",
}

const FORM_COLS_6 = {
  span: 8,
  id: "costType",
  label: "类型：",
  disable: true,
  type: "radio",
  basicType: "costSchemeType"
}

const FORM_COLS_7 = {
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

const FORM_COLS_8 = {
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

const FORM_COLS_9 = {
  span: 8,
  id: "billModle",
  label: "计费模式：",
  placeholder: "请选择计费模式",
  type: "radio",
  disable: true,
  basicType: "billModle"
}

const FORM_COLS_10 = {
  span: 8,
  id: "billTemplate",
  label: "计费模板：",
  disable: true,
  placeholder: "--",
  type: "radio",
  basicType: "billingTemplate"
}

const FORM_COLS_11 = {
  span: 8,
  id: "billUnit",
  label: "计费单位：",
  placeholder: "--",
  type: "radio",
  basicType: "pricingUnit"
}

const FORM_COLS_12 = {
  span: 24,
  id: "timeLimitCost",
  label: "限时达收费：",
  placeholder: "--",
  type: "slot",
  decimal: 0,
  maxlength: 4
}

const FORM_COLS_13 = {
  span: 24,
  id: "signAging",
  label: "签收时效(开船后)：",
  placeholder: "--",
  type: "slot",
  decimal: 0,
  maxlength: 4
}

const FORM_COLS_14 = {
  span: 24,
  id: "delayedClaims",
  label: "延时赔偿起算：",
  placeholder: "--",
  type: "slot",
  decimal: 0,
  maxlength: 4
}

const FORM_COLS_15 = {
  span: 24,
  id: "delayedClaimsRules",
  label: "延时赔偿规则：",
  placeholder: "--",
  type: "slot",
  decimal: 0,
  maxlength: 4
}



const FORM_COLS_16 = {
  span: 8,
  id: "costId",
  label: "成本规则：",
  placeholder: "请选择成本规则",
  isAutoInitRequest: true,
  isBackAll: true,
  defaultKey: 'id',
  ...httpGetSchemeList({ status: 2 }),
  type: "slot",
}


const FORM_COLS_17 = {
  span: 8,
  id: "name",
  label: "项目名称 ：",
  placeholder: "请输入项目名称",
  type: "text",
}

const FORM_COLS_18 = {
  span: 8,
  id: "adWarehouse",
  label: "适配仓库：",
  placeholder: "--",
  type: "txt"
}

const FORM_COLS_19 = {
  span: 8,
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "headTransportMode"
}
const FORM_COLS_20 = {
  span: 8,
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "outWarehouseWay"
}
const FORM_COLS_21 = {
  span: 8,
  id: "encasementWay",
  label: "装箱方式：",
  placeholder: "请选择",
  type: "radio",
  basicType: "freightType"
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
  prop: "warehouseIds",
  label: "仓库",
  showOverflowTooltip: true,
  customRow: true,
}
const TABLE_COLS_2 = {
  prop: "minBill",
  label: "最小计费值",
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "billingRuleList",
  label: "规则",
  showOverflowTooltip: true,
  customRow: true,
}
const TABLE_COLS_4 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true
}
const TABLE_COLS_5 = {
  prop: "customerName",
  label: "客户",
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "createBy",
  label: "操作人",
  showOverflowTooltip: true
}
const TABLE_COLS_7 = {
  prop: "createTime",
  label: "添加时间",
  showOverflowTooltip: true
}
const TABLE_COLS_8 = {
  prop: "costPrice",
  label: "服务成本费用",
  showOverflowTooltip: true,
  customRow: true,
}
const TABLE_COLS_9 = {
  prop: "customersPrice",
  label: "客户项目费用",
  showOverflowTooltip: true,
  customRow: true,
  decimal: 2,
}

const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: '200px'
}
export const addServicePriceConfig = {
  //新增-服务成本价格
  title: "服务成本价格",
  formLists: [
    {
      className: "border-left",
      fieldList: [
        {
          rows: [
            {
              cols: [
                // FORM_COLS_1,//服务商渠道
                FORM_COLS_19,
                FORM_COLS_20,
                FORM_COLS_21,
                FORM_COLS_2,//规则名称
                FORM_COLS_4,//国家
                {
                  ...FORM_COLS_5,
                  isBackAll: true,
                  isAutoInitRequest: true,
                  defaultKey: 'id',
                  type: "slot"
                },//计费币种
                // FORM_COLS_7,//有效开始时间
                // FORM_COLS_8,//有效结束时间
                FORM_COLS_10,//计费模板
                FORM_COLS_11,//计费单位
                FORM_COLS_3,//适配仓库
                FORM_COLS_6,//类型
                FORM_COLS_9,//计费模式
              ]
            }
          ]
        }
      ]
    },
    {
      className: "border-right",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_12,
                FORM_COLS_13,
                FORM_COLS_14,
                FORM_COLS_15,
              ]
            }
          ]
        }
      ]
    }
  ],
  formRules: {
    serviceId: [
      { required: true, message: "请选择服务商渠道", trigger: "change" }
    ],
    name: [
      { required: true, message: "请输入规则名称", trigger: "change" }
    ],
    adWarehouse: [
      { required: true, message: "请选择适配仓库", trigger: "change" }
    ],
    countryId: [
      { required: true, message: "请选择国家", trigger: "change" }
    ],
    billCurrency: [
      { required: true, message: "请选择计费币种", trigger: "change" }
    ],
    startTime: [
      { required: true, message: "请选择有效开始时间", trigger: "change" }
    ],
    endTime: [
      { required: true, message: "请选择有效结束时间", trigger: "change" }
    ],
    billUnit: [
      { required: true, message: "请选择计费单位", trigger: "change" }
    ],
    headTransportMode: [
      { required: true, message: "请选择", trigger: "change" }
    ],
    outWarehouseWay: [
      { required: true, message: "请选择", trigger: "change" }
    ],
    encasementWay: [
      { required: true, message: "请选择", trigger: "change" }
    ],
  },
  tableLists: {
    1: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_8,
      TABLE_COLS_4,
      TABLE_COLS_OPERATION
    ],
    2: [
      TABLE_COLS_INDEX,
      TABLE_COLS_SELECTION,
      TABLE_COLS_5,
      TABLE_COLS_6,
      TABLE_COLS_7,
      {
        ...TABLE_COLS_OPERATION,
        customRow: false,
        columnOperation: true,
      }
    ]
  },
  btnTagsLists: [
    {
      text: "价格信息",
      key: 1,
    },
    {
      text: "关联服务商",
      key: 2,
    },
  ],
}



export const addCustomerPriceConfig = {
  //新增-客户项目费用
  title: "客户项目费用",
  formLists: [
    {
      className: "border-left",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_16,
                FORM_COLS_17,
                {
                  ...FORM_COLS_3,
                  id: "warehouseCode",
                  placeholder: "--",
                  type: "txt"
                },
                FORM_COLS_4,
                {
                  ...FORM_COLS_5,
                  label: "币种：",
                  isBackAll: true,
                  isAutoInitRequest: true,
                  defaultKey: 'id',
                  type: "slot"
                },
                {
                  ...FORM_COLS_6,
                  disabled: true
                },
                // FORM_COLS_7,
                // FORM_COLS_8,
                {
                  ...FORM_COLS_9,
                  type: "txt"
                },
                {
                  ...FORM_COLS_10,
                  type: "txt"
                },
                {
                  ...FORM_COLS_11,
                  type: "txt"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      className: "border-right",
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_12,
                FORM_COLS_13,
                FORM_COLS_14,
                FORM_COLS_15,
              ]
            }
          ]
        }
      ]
    }
  ],
  formRules: {
    costId: [
      { required: true, message: "请选择成本规则", trigger: "change" }
    ],
    name: [
      { required: true, message: "请输入项目名称", trigger: "change" }
    ],
    countryId: [
      { required: true, message: "请选择国家", trigger: "change" }
    ],
    billCurrency: [
      { required: true, message: "请选择计费币种", trigger: "change" }
    ],
    startTime: [
      { required: true, message: "请选择有效开始时间", trigger: "change" }
    ],
    endTime: [
      { required: true, message: "请选择有效结束时间", trigger: "change" }
    ],
  },
  tableLists: {
    1: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_8,
      TABLE_COLS_9,
      TABLE_COLS_4,
    ],
    2: [
      TABLE_COLS_INDEX,
      TABLE_COLS_SELECTION,
      TABLE_COLS_5,
      TABLE_COLS_6,
      TABLE_COLS_7,
      {
        ...TABLE_COLS_OPERATION,
        customRow: false,
        columnOperation: true,
      }
    ]
  },
  btnTagsLists: [
    {
      text: "价格信息",
      key: 1,
    },
    {
      text: "关联客户",
      key: 2,
    },
  ],
}
