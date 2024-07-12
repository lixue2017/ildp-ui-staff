import { httpWarehousePublicSelect } from '@/comModel/warehouse';
import { getSchemePage } from "@/api/costScheme/index.js"
import { httpGetServiceChannel, httpUserSelect, httpBillCompanyList, httpUserSelectName, httpgetCustlist } from "@/comModel/httpSelect.js"
const FORM_COLS_1 = {
  id: "startUseTime",
  label: "启用时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COLS_2 = {
  id: "serviceId",
  label: "服务商渠道：",
  placeholder: "服务商渠道",
  ...httpGetServiceChannel()
}
const FORM_COLS_3 = {
  id: "costCode",
  label: "规则编码：",
  placeholder: "规则编码",
  type: "text",
}
const FORM_COLS_4 = {
  id: "name",
  label: "规则名称：",
  placeholder: "规则名称",
  type: "text",
}
const FORM_COLS_5 = {
  id: "adWarehouse",
  label: "适配仓库：",
  placeholder: "适配仓库",
  ...httpWarehousePublicSelect({ itemId: "id", typeList: "2,3", flagAvailable: "y" }),
}
const FORM_COLS_6 = {
  id: "shortName",
  label: "服务商：",
  placeholder: "服务商",
  type: "text",
}
const FORM_COLS_7 = {
  id: "billCurrency",
  label: "结算币别：",
  placeholder: "请选择结算币别",
  type: "autocomplete",
  category: "currency",
}
const FORM_COLS_8 = {
  id: "billUnit",
  label: "计价单位：",
  placeholder: "计价单位",
  type: "select",
  basicType: "warehousePricingUnit"
}
const FORM_COLS_9 = {
  id: "startTime",
  label: "有效开始日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COLS_10 = {
  id: "endTime",
  label: "有效结束日期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}
const FORM_COLS_11 = {
  id: "status",
  label: "状态：",
  placeholder: "状态",
  type: "select",
  basicType: "costSchemeStatus"
}
const FORM_COLS_12 = {
  id: "countryId",
  label: "国家：",
  placeholder: "国家",
  type: "autocomplete",
  category: "country",
  defaultProp: {
    value: 'id',
    label: 'twoCode,nameCn'
  }
}
const FORM_COLS_13 = {
  id: "costId",
  label: "关联成本规则：",
  placeholder: "关联成本规则",
  type: "autocomplete",
  httpRequest: (params) => {
    const {name,nameCn,...obj}=params
    return getSchemePage({ costType: "1", ...obj,search:name })
  },
  defaultProp: {
    value: 'id',
    label: 'costCode,name'
  }
}
const FORM_COLS_14 = {
  id: "customerName",
  label: "客户名称：",
  placeholder: "客户名称",
  type: "text",
}
const FORM_COLS_15 = {
  id: "name",
  label: "方案名称：",
  placeholder: "请输入方案名称",
  type: "text",
}
const FORM_COLS_16 = {
  id: "billCompanyId",
  label: "计费公司：",
  placeholder: "请选择计费公司",
  ...httpBillCompanyList({ type: 0, searchName: "billCompanyName" })
}
const FORM_COLS_17 = {
  id: "billWarehouseId",
  label: "计费仓库：",
  placeholder: "请选择计费仓库",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
  type: "slot",
}
const FORM_COLS_19 = {
  id: "businessType",
  label: "业务类型：",
  placeholder: "请选择业务类型",
  type: "select",
  basicType: "warehouseBusinessType"
}
const FORM_COLS_20 = {
  id: "schemeCode",
  label: "方案编码：",
  placeholder: "请输入方案编码",
  type: "text",
}
const FORM_COLS_21 = {
  id: "createName",
  label: "创建人：",
  placeholder: "请选择创建人",
  ...httpUserSelectName({ key: 'userName' })
}
const FORM_COLS_22 = {
  id: "startCreateTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd"
}

const FORM_COLS_23 = {
  id: "headTransportMode",
  label: "头程运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "headTransportMode"
}
const FORM_COLS_24 = {
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "outWarehouseWay"
}
const FORM_COLS_25 = {
  id: "encasementWay",
  label: "装箱方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "freightType"
}
const FORM_COLS_26 = {
  id: "isGeneralRules",
  label: "通用规则：",
  placeholder: "请选择",
  type: "select",
  basicType: "isGeneralRules"
}
const FORM_COLS_27 = {
  id: "status",
  label: "方案状态：",
  placeholder: "请选择（多选）",
  type: "select",
  basicType: "costSchemeStatus",
  multiple: true,
  hideList:[1,4]
}
// -------------------------
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
const TABLE_COLS_2 = {
  prop: "costCode",
  label: "编码",
  align: "left",
  sortable: true,
  customRow: true,
  fixed: 'left',
  width: 120,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "serviceName",
  label: "服务商渠道",
  minWidth: 120,
  fixed: 'left',
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_4 = {
  prop: "name",
  label: "规则名称",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_5 = {
  prop: "warehouseCode",
  label: "适配仓库",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "countryName",
  label: "国家",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_7 = {
  prop: "shortName",
  label: "服务商简称",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_8 = {
  prop: "billCurrencyName",
  label: "币别",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_9 = {
  prop: "billUnitName",
  label: "计价单位",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_10 = {
  prop: "endTimeBegin",
  label: "有效开始时间",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_11 = {
  prop: "endTimeEnd",
  label: "有效结束时间",
  minWidth: 140,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_12 = {
  prop: "updateBy",
  label: "最后修改人",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_13 = {
  prop: "startUseTime",
  label: "启用时间",
  align: "left",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_14 = {
  prop: "status",
  label: "状态",
  align: "left",
  dotColor: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "costSchemeStatus"
}
const TABLE_COLS_15 = {
  prop: "name",
  label: "项目名称",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  customRow: true,
  fixed:'left'
}
const TABLE_COLS_16 = {
  prop: "costCodeName",
  label: "服务成本编码",
  minWidth: 140,
  fixed: 'left',
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_17 = {
  prop: "shortName",
  label: "客户简称",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_18 = {
  prop: "costStatus",
  label: "服务商状态",
  minWidth: 140,
  sortable: true,
  fontColor:true,
  showOverflowTooltip: true,
  basicType: "costSchemeStatus"
}
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  customRow: true,
  fixed: 'right',
  width: '170px'
}
const TABLE_COLS_19 = {
  prop: "schemeCode",
  label: "方案编码",
  align: "left",
  fixed: 'left',
  minWidth: 120,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_20 = {
  prop: "name",
  label: "方案名称",
  minWidth: 160,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_21 = {
  prop: "billCompanyName",
  label: "计费公司",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_22 = {
  prop: "billWarehouseName",
  label: "计费仓库",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_23 = {
  prop: "rentFreeType",
  label: "免租类型",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehouseRentFreeType",
  render: (row) => {
    const { rentFreeType, rentFreeDay } = row
    return rentFreeType ? `${rentFreeDay}天` : '无'
  }
}
const TABLE_COLS_24 = {
  prop: "billCurrencyName",
  label: "结算币别",
  minWidth: 120,
  align: "center",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_25 = {
  prop: "billUnit",
  label: "计费单位",
  minWidth: 120,
  align: "center",
  sortable: true,
  showOverflowTooltip: true,
  basicType: "warehousePricingUnit"
}
const TABLE_COLS_26 = {
  prop: "startTime",
  label: "规则开始时间",
  minWidth: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_27 = {
  prop: "endTime",
  label: "规则结束时间",
  minWidth: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_28 = {
  prop: "createBy",
  label: "创建人",
  align: "left",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
  ...httpUserSelect()
}
const TABLE_COLS_29 = {
  prop: "createTime",
  label: "创建时间",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_30 = {
  prop: "customerName",
  label: "客户名称",
  minWidth: 220,
  fixed: 'left',
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_31 = {
  prop: "updateTime",
  label: "方案最后修改时间",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_33 = {
  prop: "createTime",
  label: "关联日期",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_34 = {
  prop: "createBy",
  label: "关联人",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_35 = {
  prop: "closingType",
  label: "结算类型",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_36 = {
  prop: "businessType",
  label: "业务类型",
  minWidth: 140,
  align: "center",
  fontColor: true,
  sortable: true,
  showOverflowTooltip: true,
  TagArrConfig: [
    {
      basicType: 'warehouseBusinessType',
      basicTypeVal: 'businessType'
    }
  ]
}
const TABLE_COLS_37 = {
  prop: "status",
  label: "方案状态",
  minWidth: 120,
  align: 'left',
  dotColor: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "costSchemeStatus"
}

const TABLE_COLS_38 = {
  prop: "headTransportModeName",
  label: "头程运输方式",
  minWidth: 125,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_39 = {
  prop: "outWarehouseWayName",
  label: "尾程运输方式",
  minWidth: 125,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_40 = {
  prop: "encasementWayName",
  label: "装箱方式",
  minWidth: 100,
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_41 = {
  prop: "isGeneralRules",
  label: "通用规则",
  minWidth: 100,
  showOverflowTooltip: true,
  fontColor:true,
  basicType:'isGeneralRules',
  render:(row)=>{
    const {isGeneralRules}=row
    return isGeneralRules?'是':'否'
  }
}
const TABLE_COLS_42 = {
  prop: "enablingTime",
  label: "生效时间",
  minWidth: 160,
  showOverflowTooltip: true,
};
export const servicePrice = {
  //服务成本价格
  formLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                // FORM_COLS_2,
                FORM_COLS_23,
                FORM_COLS_24,
                FORM_COLS_25,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_6,
                FORM_COLS_7,
                FORM_COLS_8,
                // FORM_COLS_9,
                // FORM_COLS_10,
                {
                  ...FORM_COLS_11,
                  multiple: true,
                  placeholder: "状态(多选)",
                  hideList: [],
                },
                FORM_COLS_12,
              ],
            },
          ],
        },
      ],
    },
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    TABLE_COLS_2,
    // TABLE_COLS_3,
    TABLE_COLS_38,
    TABLE_COLS_39,
    TABLE_COLS_40,
    TABLE_COLS_4,
    TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_9,
    // TABLE_COLS_10,
    // TABLE_COLS_11,
    TABLE_COLS_12,
    TABLE_COLS_42,
    TABLE_COLS_13,
    {
      ...TABLE_COLS_14,
      fixed: "right",
    },
    TABLE_COLS_OPERATION
  ]
}

export const customerPrice = {
  //客户项目费用价格
  formLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                // FORM_COLS_2,
                FORM_COLS_23,
                FORM_COLS_24,
                FORM_COLS_25,
                {
                  ...FORM_COLS_4,
                  label: "项目名称：",
                  placeholder: "请输入项目名称"
                },
                FORM_COLS_13,
                FORM_COLS_5,
                {
                  ...FORM_COLS_14,
                  id:"shortName"
                },
                {
                  ...FORM_COLS_7,
                  label: "计价币别：",
                  placeholder: "请选择计价币别",
                },
                FORM_COLS_8,
                // FORM_COLS_9,
                // FORM_COLS_10,
                {
                  ...FORM_COLS_11,
                  multiple: true,
                  placeholder: "状态(多选)",
                  hideList: [],
                },
                FORM_COLS_12,
              ],
            },
          ],
        },
      ],
    },
  ],
  tableLists: [
    TABLE_COLS_INDEX,
    // {
    //   ...TABLE_COLS_3,
    //   customRow: true,
    // },//服务商渠道
    TABLE_COLS_15,//项目名称
    TABLE_COLS_16,//服务承办编码
    {
      ...TABLE_COLS_38,
      label: "头程运输",
    },
    {
      ...TABLE_COLS_39,
      label: "尾程运输",
    },
    TABLE_COLS_40,
    TABLE_COLS_6,//国家
    TABLE_COLS_17,//客户简称
    TABLE_COLS_5,//适配仓库
    TABLE_COLS_8,//币别
    TABLE_COLS_9,//计价单位
    // TABLE_COLS_10,//有效开始时间
    // TABLE_COLS_11,//有效结束时间
    TABLE_COLS_12,//最后修改人
    TABLE_COLS_18,//服务规则状态
    TABLE_COLS_42,
    TABLE_COLS_13,//启用时间
    {
      ...TABLE_COLS_14,
      fixed:'right'
    },//状态
    {
      ...TABLE_COLS_OPERATION,
      width: 200
    }
  ]

}








export const warehouseRentFormConfig = (row) => {
  //仓租方案列表FORM
  // const { warehouseChange } = row
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...FORM_COLS_22,
                  id: "startUseTime",
                  label: "启用时间："
                },
                FORM_COLS_15,
                // {
                //   ...FORM_COLS_16,
                //   handle: warehouseChange
                // },
                FORM_COLS_17,
                FORM_COLS_19,
                FORM_COLS_20,
                FORM_COLS_7,
                FORM_COLS_8,
                // {
                //   ...FORM_COLS_9,
                //   label: "规则开始时间："
                // },
                // {
                //   ...FORM_COLS_10,
                //   label: "规则结束时间："
                // },

                {
                  ...FORM_COLS_11,
                  placeholder: "状态(多选)",
                  multiple: true,
                },
                FORM_COLS_26,
                FORM_COLS_21,
              ],
            },
          ],
        },
      ],
    },
  ]
}


export const warehouseRentTableConfig = [
  //仓租方案列表TABLE
  TABLE_COLS_INDEX,
  TABLE_COLS_19,
  TABLE_COLS_41,
  {
    ...TABLE_COLS_20,
    fixed: 'left',
  },
  // TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_36,
  TABLE_COLS_23,
  TABLE_COLS_24,
  TABLE_COLS_25,
  // TABLE_COLS_26,
  // TABLE_COLS_27,
  TABLE_COLS_13,//启用时间
  TABLE_COLS_42,
  TABLE_COLS_28,
  {
    ...TABLE_COLS_14,
    fixed: 'right',
  },
  // TABLE_COLS_29,
  {
    ...TABLE_COLS_31,
    label: "最后操作时间"
  },
  {
    ...TABLE_COLS_OPERATION,
    columnOperation: true,
    customRow: false,
    width: 160
  }
]






export const customerWHRentFormConfig = (row) => {
  //客户仓储费用列表FORM
  const { warehouseChange } = row
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...FORM_COLS_22,
                  label: "关联时间："
                },
                {
                  ...FORM_COLS_14,
                  id:'customerId',
                  ...httpgetCustlist()
                },
                {
                  ...FORM_COLS_16,
                  handle: warehouseChange
                },
                FORM_COLS_17,
                FORM_COLS_19,
                FORM_COLS_20,
                FORM_COLS_15,
                FORM_COLS_7,
                FORM_COLS_8,
                FORM_COLS_27
              ],
            },
          ],
        },
      ],
    },
  ]

}

export const customerWHRentTableConfig = [
  //客户仓储费用列表tableconfig
  TABLE_COLS_INDEX,
  TABLE_COLS_30,
  {
    ...TABLE_COLS_19,
    customRow: false
  },
  TABLE_COLS_20,

  TABLE_COLS_21,
  TABLE_COLS_22,
  TABLE_COLS_36,
  {
    ...TABLE_COLS_24,
    label: "计费币别"
  },
  TABLE_COLS_23,
  TABLE_COLS_25,
  // {
  //   ...TABLE_COLS_26,
  //   label: "方案开始时间"
  // },
  // {
  //   ...TABLE_COLS_27,
  //   label: "方案结束时间"
  // },
  TABLE_COLS_37,
  TABLE_COLS_31,
  // TABLE_COLS_32,
  TABLE_COLS_33,
  TABLE_COLS_34,
  {
    ...TABLE_COLS_OPERATION,
    columnOperation: true,
    customRow: false,
    width: 100
  }
]




const DIALOG_FORM_1={
  span: 24,
  id: "enablingTime",
  label: "生效时间：",
  placeholder: "请输入",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm",
}
export const diyCustomDialogCols = (row={}) => {
  const {title}=row
  return {
    title,
    width: '500px',
    labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_FORM_1,
    ],
    formRules: {
      enablingTime: [
        { required: true, message: `请选择生效时间`, trigger: "change" },
      ],
    }
  }
}
