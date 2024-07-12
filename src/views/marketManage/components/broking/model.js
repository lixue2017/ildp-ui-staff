import {
  httpCustomerSelect,
  httpUserSelect,
  httpCountrySelect,
  httpPortPublicSelect,
  httpEnterprisetSelect,
  httpCabinetTypeSelect,
} from "@/comModel/httpSelect";

const FORM_COLS_1 = {
  id: "createTime",
  label: "创建时间：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_2 = {
  id: "operationOrderNum",
  label: "工作单号：",
  placeholder: "工作单号",
  type: "text",
};
const FORM_COLS_3 = {
  id: "client",
  label: "委托人：",
  placeholder: "委托人",
  ...httpCustomerSelect(),
};
const FORM_COLS_4 = {
  id: "salesman",
  label: "业务员：",
  placeholder: "请选择业务员",
  ...httpUserSelect(),
};
const FORM_COLS_5 = {
  id: "sortBoxId",
  label: "柜型：",
  placeholder: "请选择柜型",
  selectLabelKey: "UNCHARTED_FORM_5",
  ...httpCabinetTypeSelect,
};
const FORM_COLS_6 = {
  id: "destinationCountry",
  label: "目的国：",
  placeholder: "请选择目的国",
  ...httpCountrySelect,
};
const FORM_COLS_7 = {
  id: "portOfDeparture",
  label: "起运港：",
  placeholder: "请选择起运港",
  ...httpPortPublicSelect(),
};
const FORM_COLS_8 = {
  id: "portOfDestination",
  label: "目的港：",
  placeholder: "请选择目的港",
  ...httpPortPublicSelect(),
};
const FORM_COLS_9 = {
  id: "proxyType",
  label: "头程代理类型：",
  placeholder: "请选择头程代理类型",
  dicsStr: "headAgency_type",
  customDicsArr: [0, 1],
  type: "select",
  labelWidth: "100px",
};
const FORM_COLS_10 = {
  id: "bookingSpaceProxy",
  label: "订舱代理：",
  placeholder: "请选择订舱代理",
  ...httpEnterprisetSelect({ typeList: "0,1,2,3,4" }),
};
const FORM_COLS_11 = {
  id: "typeOfShipping",
  label: "运输方式：",
  placeholder: "请选择运输方式",
  type: "select",
  basicType: "bookingTransportMode",
};
const FORM_COLS_12 = {
  id: "sono",
  label: "SO No.：",
  placeholder: "请输入SO No",
  type: "text",
};
const FORM_COLS_13 = {
  id: "flightName",
  label: "船名/航名：",
  placeholder: "请输入船名/航名",
  type: "text",
};
const FORM_COLS_14 = {
  id: "flightCode",
  label: "船次/航次：",
  placeholder: "请输入船次/航次",
  type: "text",
};
const FORM_COLS_15 = {
  id: "sortBoxRegisterNo",
  label: "国内登记号：",
  placeholder: "请输入国内登记号",
  type: "text",
};
// const FORM_COLS_15 = {
//   id: "createTime",
//   label: "拼柜创建时间：",
//   startPlaceholder: "开始日期",
//   endPlaceholder: "结束日期",
//   type: "daterange",
//   valueFormat: "yyyy-MM-dd",
//   labelWidth: "110px"
// }

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "operationOrderNum",
  label: "工作单号",
  width: 120,
  sortable: true,
  fixed: "left",
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "client",
  label: "委托人",
  width: 120,
  fixed: "left",
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "destinationCountry",
  label: "目的国",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "ecProxy",
  label: "头程代理类型",
  width: 140,
  align: "center",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "bookingSpaceProxy",
  label: "订舱代理",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "startPort",
  label: "起运港",
  width: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "endPort",
  label: "目的港",
  width: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "cabinetTypeQuantity",
  label: "柜型柜量",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "weight",
  label: "体积小计(CBM)",
  width: 140,
  decimal: 2,
  align: "right",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "totalWeight",
  label: "重量小计(KG)",
  align: "right",
  width: 140,
  decimal: 2,
  align: "right",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "salesman",
  label: "业务员",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "operator",
  label: "操作员",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "lastUpdateTime",
  label: "创建时间",
  width: 180,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "typeOfShipping",
  label: "运输方式",
  width: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "sono",
  label: "SO No.",
  width: 140,
  columnLink: true,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_16 = {
  prop: "flightName",
  label: "船名/航名",
  width: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_17 = {
  prop: "flightCode",
  label: "船次/航次",
  width: 140,
  align: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_18 = {
  prop: "etaTime",
  label: "ETA",
  width: 180,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_19 = {
  prop: "num",
  label: "件数",
  align: "right",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_20 = {
  prop: "businessRemark",
  label: "业务备注",
  align: "left",
  width: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_21 = {
  prop: "sortBoxRegisterNo",
  label: "国内登记号",
  align: "left",
  width: 120,
  fixed: "left",
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_22 = {
  prop: "isBookingSpace",
  label: "完成订舱",
  align: "left",
  width: 120,
  fixed: "right",
  sortable: true,
  fontColor: true,
  customRow:true,
  basicType:"isBookingSpaceStatus",
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  fixed: "right",
  width: 140,
  columnOperation: true,
};

const publicFormColumns = [
  FORM_COLS_1, //接单时间
  FORM_COLS_2, //工作单号
  FORM_COLS_15, //国内登记号
  FORM_COLS_3, //委托人
  FORM_COLS_4, //业务员
  FORM_COLS_5, //柜量柜型
  FORM_COLS_6, //目的国
  FORM_COLS_7, //起运港
  FORM_COLS_8, //目的港
];
const publicTableColumns = [
  TABLE_COLS_3, //目的国
  TABLE_COLS_4, //头程代理类型
  TABLE_COLS_5, //订舱代理
  TABLE_COLS_6, //起运港
  TABLE_COLS_7, //目的港
  TABLE_COLS_8, //柜型
  TABLE_COLS_9, //单柜重量
  TABLE_COLS_10, //重量小计
  TABLE_COLS_11, //业务员
  TABLE_COLS_12, //操作员
  TABLE_COLS_13, //最后更新时间
  // TABLE_COLS_OPERATION
];
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
                    FORM_COLS_9, //头程代理类型
                    FORM_COLS_10, //订舱代理
                  ],
                },
              ],
            },
          ],
        },
      ],
      2: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_12, //SONO
                    FORM_COLS_13, //船名/航名
                    FORM_COLS_14, //船次/航次
                    FORM_COLS_9, //头程代理类型
                    FORM_COLS_10, //订舱代理
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    tableColumns: {
      1: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1, //工作单号
        TABLE_COLS_21, //国内登记号
        TABLE_COLS_2, //委托人
        TABLE_COLS_3, //目的国
        TABLE_COLS_4, //头程代理类型
        TABLE_COLS_5, //订舱代理
        TABLE_COLS_6, //起运港
        TABLE_COLS_7, //目的港
        TABLE_COLS_8, //柜型
        TABLE_COLS_9, //单柜重量
        TABLE_COLS_10, //重量小计
        TABLE_COLS_20, //业务备注
        TABLE_COLS_11, //业务员
        TABLE_COLS_12, //操作员
        TABLE_COLS_13, //最后更新时间
        TABLE_COL_OPERATION,
      ],
      2: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1, //工作单号
        TABLE_COLS_21, //国内登记号
        TABLE_COLS_2, //委托人
        TABLE_COLS_15, //SONO
        TABLE_COLS_16, //船名/航名
        TABLE_COLS_17, //船次/航次
        TABLE_COLS_18, //ETA
        TABLE_COLS_3, //目的国
        TABLE_COLS_4, //头程代理类型
        TABLE_COLS_5, //订舱代理
        TABLE_COLS_6, //起运港
        TABLE_COLS_7, //目的港
        TABLE_COLS_8, //柜型
        TABLE_COLS_9, //单柜重量
        TABLE_COLS_10, //重量小计
        TABLE_COLS_20, //业务备注
        TABLE_COLS_11, //业务员
        TABLE_COLS_12, //操作员
        TABLE_COLS_13, //最后更新时间
        TABLE_COLS_22,//完成订舱
        TABLE_COL_OPERATION,
      ],
    },
  };
};
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
                    FORM_COLS_1, //接单时间
                    FORM_COLS_2, //工作单号
                    FORM_COLS_15, //国内登记号
                    FORM_COLS_3, //委托人
                    FORM_COLS_4, //业务员
                    FORM_COLS_6, //目的国
                    FORM_COLS_7, //起运港
                    FORM_COLS_8, //目的港
                    FORM_COLS_9, //头程代理类型
                    FORM_COLS_11, //运输方式
                    FORM_COLS_10, //订舱代理
                  ],
                },
              ],
            },
          ],
        },
      ],
      2: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_12, //SONO
                    FORM_COLS_13, //船名/航名
                    FORM_COLS_14, //船次/航次
                    FORM_COLS_9, //头程代理类型
                    FORM_COLS_10, //订舱代理
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    tableColumns: {
      1: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1, //工作单号
        TABLE_COLS_21, //国内登记号
        TABLE_COLS_2, //委托人
        TABLE_COLS_3, //目的国
        TABLE_COLS_14, //运输方式
        TABLE_COLS_4, //头程代理类型
        TABLE_COLS_5, //订舱代理
        TABLE_COLS_6, //起运港
        TABLE_COLS_7, //目的港
        TABLE_COLS_19, //件数
        {
          ...TABLE_COLS_9,
          label: "重量/KG",
        }, //单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³",
        }, //重量小计
        TABLE_COLS_20, //业务备注
        TABLE_COLS_11, //业务员
        TABLE_COLS_12, //操作员
        TABLE_COLS_13, //最后更新时间
        TABLE_COL_OPERATION,
      ],
      2: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1, //工作单号
        TABLE_COLS_21, //国内登记号
        TABLE_COLS_2, //委托人
        TABLE_COLS_15, //SONO
        TABLE_COLS_16, //船名/航名
        TABLE_COLS_17, //船次/航次
        TABLE_COLS_18, //ETA
        TABLE_COLS_3, //目的国
        TABLE_COLS_14, //运输方式
        TABLE_COLS_4, //头程代理类型
        TABLE_COLS_5, //订舱代理
        TABLE_COLS_6, //起运港
        TABLE_COLS_7, //目的港
        TABLE_COLS_19, //件数
        {
          ...TABLE_COLS_9,
          label: "重量/KG",
        }, //单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³",
        }, //重量小计
        TABLE_COLS_20, //业务备注
        TABLE_COLS_11, //业务员
        TABLE_COLS_12, //操作员
        TABLE_COLS_13, //最后更新时间
        TABLE_COLS_22,
        TABLE_COL_OPERATION,
      ],
    },
  };
};
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
                    FORM_COLS_1, //接单时间
                    FORM_COLS_2, //工作单号
                    FORM_COLS_15, //国内登记号
                    FORM_COLS_3, //委托人
                    FORM_COLS_4, //业务员
                    FORM_COLS_6, //目的国
                    FORM_COLS_7, //起运港
                    FORM_COLS_8, //目的港
                    FORM_COLS_9, //头程代理类型
                    FORM_COLS_10, //订舱代理
                    FORM_COLS_11, //运输方式
                  ],
                },
              ],
            },
          ],
        },
      ],
      2: [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: [
                    ...publicFormColumns,
                    FORM_COLS_12, //SONO
                    FORM_COLS_13, //船名/航名
                    FORM_COLS_14, //船次/航次
                    FORM_COLS_9, //头程代理类型
                    FORM_COLS_10, //订舱代理
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    tableColumns: {
      1: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1, //工作单号
        TABLE_COLS_21, //国内登记号
        TABLE_COLS_2, //委托人
        TABLE_COLS_3, //目的国
        TABLE_COLS_14, //运输方式
        TABLE_COLS_4, //头程代理类型
        TABLE_COLS_5, //订舱代理
        TABLE_COLS_6, //起运港
        TABLE_COLS_7, //目的港
        TABLE_COLS_19, //件数
        {
          ...TABLE_COLS_9,
          label: "重量/KG",
        }, //单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³",
        }, //重量小计
        TABLE_COLS_20, //业务备注
        TABLE_COLS_11, //业务员
        TABLE_COLS_12, //操作员
        TABLE_COLS_13, //最后更新时间
        TABLE_COL_OPERATION,
      ],
      2: [
        TABLE_COLS_INDEX,
        TABLE_COLS_1, //工作单号
        TABLE_COLS_21, //国内登记号
        TABLE_COLS_2, //委托人
        TABLE_COLS_15, //SONO
        TABLE_COLS_16, //船名/航名
        TABLE_COLS_17, //船次/航次
        TABLE_COLS_18, //ETA
        TABLE_COLS_3, //目的国
        TABLE_COLS_14, //运输方式
        TABLE_COLS_4, //头程代理类型
        TABLE_COLS_5, //订舱代理
        TABLE_COLS_6, //起运港
        TABLE_COLS_7, //目的港
        TABLE_COLS_19, //件数
        {
          ...TABLE_COLS_9,
          label: "重量/KG",
        }, //单柜重量
        {
          ...TABLE_COLS_10,
          label: "体积/m³",
        }, //重量小计
        TABLE_COLS_20, //业务备注
        TABLE_COLS_11, //业务员
        TABLE_COLS_12, //操作员
        TABLE_COLS_13, //最后更新时间
        TABLE_COLS_22,
        TABLE_COL_OPERATION,
      ],
    },
  };
};

export const soNoCols = {
  title: "登记sono",
  width: "450px",
  labelWidth: "80px",
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "sono",
                  label: "SO No.：",
                  placeholder: "请输入SO No.",
                  type: "text",
                  maxlength: 50,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    sono: [{ required: true, message: "请输入SO NO.", trigger: "blur" }],
  },
};
