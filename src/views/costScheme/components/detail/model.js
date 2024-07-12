const FORM_COLS_1 = {
  span: 12,
  id: "serviceId",
  label: "服务商渠道：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_2 = {
  span: 8,
  id: "name",
  label: "规则名称：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_3 = {
  span: 8,
  id: "adWarehouse",
  label: "适配仓库：",
  placeholder: "--",
  type: "txt",
}

const FORM_COLS_4 = {
  span: 8,
  id: "countryName",
  label: "国家：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_5 = {
  span: 8,
  id: "billCurrencyName",
  label: "计费币种：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_6 = {
  span: 8,
  id: "costType",
  label: "类型：",
  placeholder: "--",
  type: "txt",
  basicType: "costSchemeType"
}
const FORM_COLS_7 = {
  span: 8,
  id: "startTime",
  label: "有效开始时间：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_8 = {
  span: 8,
  id: "endTime",
  label: "有效结束时间：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_9 = {
  span: 8,
  id: "billModle",
  label: "计费模式：",
  placeholder: "--",
  type: "txt",
  basicType: "billModle"
}
const FORM_COLS_10 = {
  span: 8,
  id: "billTemplate",
  label: "计费模板：",
  placeholder: "--",
  type: "txt",
  basicType: "billingTemplate"
}
const FORM_COLS_11 = {
  span: 8,
  id: "billUnit",
  label: "计费单位：",
  placeholder: "--",
  type: "txt",
  basicType: "pricingUnit"
}
const FORM_COLS_12 = {
  span: 24,
  id: "timeLimitCost",
  label: "限时达收费：",
  placeholder: "--",
  type: "slot",
}
const FORM_COLS_13 = {
  span: 24,
  id: "signAging",
  label: "签收时效(开船后)：",
  placeholder: "--",
  type: "slot",
}
const FORM_COLS_14 = {
  span: 24,
  id: "delayedClaims",
  label: "延时赔偿起算：",
  placeholder: "--",
  type: "slot",
}
const FORM_COLS_15 = {
  span: 24,
  id: "delayedClaimsRules",
  label: "延时赔偿规则：",
  placeholder: "--",
  type: "slot",
}
const FORM_COLS_16 = {
  span: 8,
  id: "costName",
  label: "成本规则：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_17 = {
  span: 8,
  id: "name",
  label: "项目名称：",
  placeholder: "--",
  type: "txt",
}

const FORM_COLS_18 = {
  span: 8,
  id: "headTransportModeName",
  label: "头程运输方式：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_19 = {
  span: 8,
  id: "outWarehouseWayName",
  label: "尾程运输方式：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_20 = {
  span: 8,
  id: "encasementWayName",
  label: "装箱方式：",
  placeholder: "--",
  type: "txt",
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
  decimal: 2,
  customRow: true,
}
const TABLE_COLS_9 = {
  prop: "customersPrice",
  label: "客户项目费用",
  decimal: 2,
  showOverflowTooltip: true,
  customRow: true,
}



const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: '200px'
}
export const detailsServicePriceConfig = {
  //详情-服务成本价格
  title: "服务成本价格",
  formLists: [
    {
      className: "border-left",
      fieldList: [
        {
          rows: [
            {
              cols: [
                // {
                //   ...FORM_COLS_1,
                //   id: "serviceName",
                // },//服务商渠道
                FORM_COLS_18,
                FORM_COLS_19,
                FORM_COLS_20,
                FORM_COLS_2,//规则名称
                FORM_COLS_4,//国家
                FORM_COLS_5,//计费币种
                // FORM_COLS_7,//有效开始时间
                // FORM_COLS_8,//有效结束时间
                FORM_COLS_10,//计费模板
                FORM_COLS_11,//计费单位
                {
                  ...FORM_COLS_3,
                  id: "warehouseCode"
                },//适配仓库
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
  tableLists: {
    1: [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_3,
      TABLE_COLS_8,
      TABLE_COLS_4,
    ],
    2: [
      TABLE_COLS_INDEX,
      TABLE_COLS_SELECTION,
      {
        ...TABLE_COLS_5,
        label: "服务商"
      },
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



export const detailsCustomerPriceConfig = {
  //详情-服务成本价格
  title: "客户项目费用",
  formLists: [
    {
      className: "border-left",
      fieldList: [
        {
          rows: [
            {
              cols: [
                // {
                //   ...FORM_COLS_1,
                //   id: "serviceName",
                // },
                // FORM_COLS_2,
                // {
                //   ...FORM_COLS_3,
                //   id: "warehouseCode"
                // },
                FORM_COLS_16,
                FORM_COLS_17,
                FORM_COLS_4,
                {
                  ...FORM_COLS_5,
                  label: "币种："
                },
                FORM_COLS_6,
                // FORM_COLS_7,
                // FORM_COLS_8,
                FORM_COLS_9,
                FORM_COLS_10,
                FORM_COLS_11,
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
      {
        ...TABLE_COLS_5,
        label: "服务商"
      },
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
