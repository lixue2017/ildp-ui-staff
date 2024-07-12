import { getportList2 } from '@/api/operationalData/index'
import { httpCustomerSelect, httpUserSelect, httpCountrySelect, httpPortPublicSelect, httpEnterprisetSelect, httpCabinetTypeSelect } from '@/comModel/httpSelect'

const FORM_COLS_1 = {
  id: "receiveDate",
  label: "整柜接单时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
  labelWidth: "110px"
}
const FORM_COLS_2 = {
  id: "orderNo",
  label: "工作单号：",
  placeholder: "工作单号",
  type: "text",
}
const FORM_COLS_3 = {
  id: "UNCHARTED_FORM_3",
  label: "委托人：",
  placeholder: "委托人",
  ...httpCustomerSelect()
}
const FORM_COLS_4 = {
  id: "UNCHARTED_FORM_4",
  label: "业务员：",
  placeholder: "请选择业务员",
  ...httpUserSelect()
}
const FORM_COLS_5 = {
  id: "UNCHARTED_FORM_5",
  label: "柜型：",
  placeholder: "请选择柜型",
  selectLabelKey: "UNCHARTED_FORM_5",
  ...httpCabinetTypeSelect
}
const FORM_COLS_6 = {
  id: "UNCHARTED_FORM_6",
  label: "目的国：",
  placeholder: "请选择目的国",
  ...httpCountrySelect
}
const FORM_COLS_7 = {
  id: "UNCHARTED_FORM_7",
  label: "起运港：",
  placeholder: "请选择起运港",
  ...httpPortPublicSelect()
}
const FORM_COLS_8 = {
  id: "UNCHARTED_FORM_8",
  label: "目的港：",
  placeholder: "请选择目的港",
  ...httpPortPublicSelect()
}
const FORM_COLS_9 = {
  id: "UNCHARTED_FORM_9",
  label: "头程代理类型：",
  placeholder: "请选择头程代理类型",
  dicsStr: 'headAgency_type',
  customDicsArr: [0, 1],
}
const FORM_COLS_10 = {
  span: 12,
  id: "UNCHARTED_FORM_10",
  label: "订舱代理：",
  placeholder: "请选择订舱代理",
  ...httpEnterprisetSelect(),
}
const FORM_COLS_11 = {
  span: 12,
  id: "UNCHARTED_FORM_11",
  label: "运输方式：",
  placeholder: "请选择运输方式",
}
const FORM_COLS_12 = {
  id: "UNCHARTED_FORM_12",
  label: "SO No：",
  placeholder: "请输入SO No",
  type: "text",
}
const FORM_COLS_13 = {
  id: "UNCHARTED_FORM_13",
  label: "船名/航名：",
  placeholder: "请输入船名/航名",
  type: "text",
}
const FORM_COLS_14 = {
  id: "UNCHARTED_FORM_14",
  label: "船次/航次：",
  placeholder: "请输入船次/航次",
  type: "text",
}
const FORM_COLS_15 = {
  id: "createTime",
  label: "拼柜创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
  labelWidth: "110px"
}


const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
const TABLE_COLS_1 = {
  prop: "UNCHARTED_TABLE_1",
  label: "工作单号",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_2 = {
  prop: "UNCHARTED_TABLE_2",
  label: "委托人",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_3 = {
  prop: "UNCHARTED_TABLE_3",
  label: "目的国",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_4 = {
  prop: "UNCHARTED_TABLE_4",
  label: "头程代理类型",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_5 = {
  prop: "UNCHARTED_TABLE_5",
  label: "订舱代理",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_6 = {
  prop: "UNCHARTED_TABLE_6",
  label: "起运港",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_7 = {
  prop: "UNCHARTED_TABLE_7",
  label: "目的港",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_8 = {
  prop: "UNCHARTED_TABLE_8",
  label: "柜型",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_9 = {
  prop: "UNCHARTED_TABLE_9",
  label: "单柜重量(KG)",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_10 = {
  prop: "UNCHARTED_TABLE_10",
  label: "重量小计(KG)",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_11 = {
  prop: "UNCHARTED_TABLE_11",
  label: "业务员",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_12 = {
  prop: "UNCHARTED_TABLE_12",
  label: "操作员",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_13 = {
  prop: "UNCHARTED_TABLE_13",
  label: "最后更新时间",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_14 = {
  prop: "UNCHARTED_TABLE_14",
  label: "运输方式",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_15 = {
  prop: "UNCHARTED_TABLE_15",
  label: "SO.NO",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_16 = {
  prop: "UNCHARTED_TABLE_16",
  label: "船名/航名",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_17 = {
  prop: "UNCHARTED_TABLE_17",
  label: "船次/航次",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_18 = {
  prop: "UNCHARTED_TABLE_18",
  label: "ETA",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_19 = {
  prop: "UNCHARTED_TABLE_19",
  label: "目的国",
  sortable: true,
  showOverflowTooltip: true,
}
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  sortable: true,
  showOverflowTooltip: true,
}



const publicFormColumns = [
  FORM_COLS_1,//接单时间
  FORM_COLS_2,//工作单号
  FORM_COLS_3,//委托人
  FORM_COLS_4,//业务员
  FORM_COLS_5,//柜量柜型
  FORM_COLS_6,//目的国
  FORM_COLS_7,//起运港
  FORM_COLS_8,//目的港
]
const publicTableColumns = [
  TABLE_COLS_3,//目的国
  TABLE_COLS_4,//头程代理类型
  TABLE_COLS_5,//订舱代理
  TABLE_COLS_6,//起运港
  TABLE_COLS_7,//目的港
  TABLE_COLS_8,//柜型
  TABLE_COLS_9,//单柜重量
  TABLE_COLS_10,//重量小计
  TABLE_COLS_11,//业务员
  TABLE_COLS_12,//操作员
  TABLE_COLS_13,//最后更新时间
  TABLE_COLS_OPERATION
]
export const marketBookingFcl = () => {
  //市场订舱FCL
  return {
    formColumns: {
      1: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_9,//头程代理类型
                    FORM_COLS_10,//订舱代理
                  ],
                },
              ],
            }
          ],
        }
      ],
      2: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_15,
                    FORM_COLS_12,//SONO
                    FORM_COLS_13,//船名/航名
                    FORM_COLS_14,//船次/航次
                    FORM_COLS_9,//头程代理类型
                    FORM_COLS_10,//订舱代理
                  ],
                },
              ],
            }
          ],
        }
      ],
    },
    tableColumns: {
      1: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1,//工作单号
        TABLE_COLS_2,//委托人
        TABLE_COLS_3,//目的国
        TABLE_COLS_4,//头程代理类型
        TABLE_COLS_5,//订舱代理
        TABLE_COLS_6,//起运港
        TABLE_COLS_7,//目的港
        TABLE_COLS_8,//柜型
        TABLE_COLS_9,//单柜重量
        TABLE_COLS_10,//重量小计
        TABLE_COLS_11,//业务员
        TABLE_COLS_12,//操作员
        TABLE_COLS_13,//最后更新时间
        TABLE_COLS_OPERATION
      ],
      2: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1,//工作单号
        TABLE_COLS_2,//委托人
        TABLE_COLS_15,//SONO
        TABLE_COLS_16,//船名/航名
        TABLE_COLS_17,//船次/航次
        TABLE_COLS_18,//ETA
        TABLE_COLS_3,//目的国
        TABLE_COLS_4,//头程代理类型
        TABLE_COLS_5,//订舱代理
        TABLE_COLS_6,//起运港
        TABLE_COLS_7,//目的港
        TABLE_COLS_8,//柜型
        TABLE_COLS_9,//单柜重量
        TABLE_COLS_10,//重量小计
        TABLE_COLS_11,//业务员
        TABLE_COLS_12,//操作员
        TABLE_COLS_13,//最后更新时间
        TABLE_COLS_OPERATION
      ]
    }
  }
}
export const marketBookingLcl = () => {
  //市场订舱LCL
  return {
    formColumns: {
      1: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_9,//头程代理类型
                    FORM_COLS_10,//订舱代理
                    FORM_COLS_11,//运输方式
                  ],
                },
              ],
            }
          ],
        }
      ],
      2: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_15,
                    FORM_COLS_12,//SONO
                    FORM_COLS_13,//船名/航名
                    FORM_COLS_14,//船次/航次
                    FORM_COLS_9,//头程代理类型
                    FORM_COLS_10,//订舱代理
                  ],
                },
              ],
            }
          ],
        }
      ],
    },
    tableColumns: {
      1: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1,//工作单号
        TABLE_COLS_2,//委托人
        TABLE_COLS_3,//目的国
        TABLE_COLS_14,//运输方式
        TABLE_COLS_4,//头程代理类型
        TABLE_COLS_5,//订舱代理
        TABLE_COLS_6,//起运港
        TABLE_COLS_7,//目的港
        {
          ...TABLE_COLS_8,
          label: "件数"
        },//柜型
        {
          ...TABLE_COLS_9,
          label: "重量/KG"
        },//单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³"
        },//重量小计
        TABLE_COLS_11,//业务员
        TABLE_COLS_12,//操作员
        TABLE_COLS_13,//最后更新时间
        TABLE_COLS_OPERATION
      ],
      2: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1,//工作单号
        TABLE_COLS_2,//委托人
        TABLE_COLS_15,//SONO
        TABLE_COLS_16,//船名/航名
        TABLE_COLS_17,//船次/航次
        TABLE_COLS_18,//ETA
        TABLE_COLS_3,//目的国
        TABLE_COLS_14,//运输方式
        TABLE_COLS_4,//头程代理类型
        TABLE_COLS_5,//订舱代理
        TABLE_COLS_6,//起运港
        TABLE_COLS_7,//目的港
        {
          ...TABLE_COLS_8,
          label: "件数"
        },//柜型
        {
          ...TABLE_COLS_9,
          label: "重量/KG"
        },//单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³"
        },//重量小计
        TABLE_COLS_11,//业务员
        TABLE_COLS_12,//操作员
        TABLE_COLS_13,//最后更新时间
        TABLE_COLS_OPERATION
      ]
    }
  }
}
export const workSheetBookingLcl = () => {
  //操作订舱LCL
  return {
    formColumns: {
      1: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_9,//头程代理类型
                    FORM_COLS_10,//订舱代理
                    FORM_COLS_11,//运输方式
                  ],
                },
              ],
            }
          ],
        }
      ],
      2: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_15,
                    FORM_COLS_12,//SONO
                    FORM_COLS_13,//船名/航名
                    FORM_COLS_14,//船次/航次
                    FORM_COLS_9,//头程代理类型
                    FORM_COLS_10,//订舱代理
                  ],
                },
              ],
            }
          ],
        }
      ],
    },
    tableColumns: {
      1: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1,//工作单号
        TABLE_COLS_2,//委托人
        TABLE_COLS_3,//目的国
        TABLE_COLS_14,//运输方式
        TABLE_COLS_4,//头程代理类型
        TABLE_COLS_5,//订舱代理
        TABLE_COLS_6,//起运港
        TABLE_COLS_7,//目的港
        {
          ...TABLE_COLS_8,
          label: "件数"
        },//柜型
        {
          ...TABLE_COLS_9,
          label: "重量/KG"
        },//单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³"
        },//重量小计
        TABLE_COLS_11,//业务员
        TABLE_COLS_12,//操作员
        TABLE_COLS_13,//最后更新时间
        TABLE_COLS_OPERATION
      ],
      2: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1,//工作单号
        TABLE_COLS_2,//委托人
        TABLE_COLS_15,//SONO
        TABLE_COLS_16,//船名/航名
        TABLE_COLS_17,//船次/航次
        TABLE_COLS_18,//ETA
        TABLE_COLS_3,//目的国
        TABLE_COLS_14,//运输方式
        TABLE_COLS_4,//头程代理类型
        TABLE_COLS_5,//订舱代理
        TABLE_COLS_6,//起运港
        TABLE_COLS_7,//目的港
        {
          ...TABLE_COLS_8,
          label: "件数"
        },//柜型
        {
          ...TABLE_COLS_9,
          label: "重量/KG"
        },//单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³"
        },//重量小计
        TABLE_COLS_11,//业务员
        TABLE_COLS_12,//操作员
        TABLE_COLS_13,//最后更新时间
        TABLE_COLS_OPERATION
      ]
    }
  }
}
const forBookingSearchCols = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  id: "receiveDate",
                  label: "整柜接单时间：",
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  type: "daterange",
                  valueFormat: "yyyy-MM-dd",
                  labelWidth: "110px"
                },
                {
                  id: "createTime",
                  label: "拼柜创建时间：",
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  type: "daterange",
                  valueFormat: "yyyy-MM-dd",
                  labelWidth: "110px"
                },
                {
                  id: "orderNo",
                  label: "工作单号/拼柜号：",
                  placeholder: "工作单号/拼柜号",
                  type: "text",
                  labelWidth: "135px"
                },
                {
                  id: "type",
                  label: "类型：",
                  placeholder: "类型",
                  type: "select",
                  basicType: 'cabinetType'
                },
              ]
            },
          ],
        },
      ],
    },
  ],
}

const bookedSearchCols = {
  lists: [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  id: "shippingRouteTime",
                  label: "订舱时间：",
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  type: "daterange",
                  valueFormat: "yyyy-MM-dd",
                  labelWidth: "80px"
                },
                {
                  id: "orderNo",
                  label: "工作单号/拼柜号：",
                  placeholder: "工作单号/拼柜号",
                  type: "text",
                  labelWidth: "135px"
                },
                {
                  id: "inWarehouse",
                  label: "装货港：",
                  placeholder: "装货港",
                  labelWidth: "70px",
                  type: "autocomplete",
                  category: "country",
                  searchParamName: 'search',
                  httpRequest: (params) => getportList2({ ...params, portTypes: "0,1,2,3" }),
                  defaultProp: {
                    value: 'id',
                    label: 'code,nameCn'
                  }
                },
                {
                  id: "outWarehouse",
                  label: "卸货港：",
                  placeholder: "卸货港",
                  labelWidth: "110px",
                  type: "autocomplete",
                  category: "country",
                  searchParamName: 'search',
                  httpRequest: (params) => getportList2({ ...params, portTypes: "0,1,2,3" }),
                  defaultProp: {
                    value: 'id',
                    label: 'code,nameCn'
                  }
                },
                {
                  id: "type",
                  label: "类型：",
                  placeholder: "类型",
                  type: "select",
                  labelWidth: "80px",
                  basicType: 'cabinetType'
                },
                {
                  id: "status",
                  label: "状态：",
                  placeholder: "状态",
                  type: "select",
                  labelWidth: "135px",
                  basicType: 'bookingStatus'
                },
                {
                  id: "joinRouteCode",
                  label: "航次编码：",
                  labelWidth: "70px",
                  placeholder: "航次编码",
                  type: "text",
                },
                {
                  id: "flightName",
                  label: "航名/航班名：",
                  placeholder: "航名/航班名",
                  type: "text",
                  labelWidth: "110px"
                },
              ]
            },
          ],
        },
      ],
    },
  ],
}


const forBookingTableCols = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "type",
    label: "类型",
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'cabinetType',
    width: 80
  },
  {
    prop: "joinOrder",
    label: "工作单号",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "code",
    label: "拼柜号",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "transportMode",
    label: "运输方式",
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'transportMode',
    width: 100
  },
  {
    prop: "startWarehouse",
    label: "交货港",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "endWarehouse",
    label: "目的港",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "boxModel",
    label: "柜型",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "boxNum",
    label: "柜量",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "singleBoxWeight",
    label: "单柜重量(KG)",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "sumWeight",
    label: "重量小计(KG)",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "remark",
    sortable: true,
    showOverflowTooltip: true,
    label: "备注",
  },
  {
    prop: "orderTime",
    label: "整柜接单时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140
  },
  {
    prop: "sortTime",
    label: "拼柜创建时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140
  },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    fixed: 'right',
    customRow: true
  }
]

const bookedTableCols = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "joinRouteCode",
    label: "航次编码",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "type",
    label: "类型",
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'cabinetType',
    width: 80
  },
  {
    prop: "joinOrder",
    label: "工作单号",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "code",
    label: "拼柜号",
    sortable: true,
    showOverflowTooltip: true,
    width: 100
  },
  {
    prop: "flightName",
    label: "船名/航班名",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    prop: "transportMode",
    label: "运输方式",
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'transportMode',
    width: 100
  },
  {
    prop: "inWarehouse",
    label: "装货港",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "outWarehouse",
    label: "卸货港",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "boxModel",
    label: "柜型",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "boxNum",
    label: "柜量",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "singleBoxWeight",
    label: "单柜重量(KG)",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140
  },
  {
    prop: "sumWeight",
    label: "重量小计(KG)",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 140
  },
  {
    prop: "remark",
    sortable: true,
    showOverflowTooltip: true,
    label: "备注",
  },
  {
    prop: "shippingRouteTime",
    label: "订舱时间",
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 150
  },
  {
    prop: "shippingRouteStatus",
    label: "状态",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'bookingStatus',
    width: 100
  }
]


export { forBookingSearchCols, bookedSearchCols, forBookingTableCols, bookedTableCols };
