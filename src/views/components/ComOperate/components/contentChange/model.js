import {
  httpCurrencySelect,
  httpCountrySelect,
  httpEnterprisetSelect,
  httpPortPublicSelect,
  httpContactsSelect,
  httpCustomsClearanceSelect,
} from "@/comModel/httpSelect";

import { httpWarehousePublicSelect } from "@/comModel/warehouse";

const EDIT_FORM_COL_1 = {
  span: 12,
  id: "operationOrderNum",
  label: "业务单号：",
  type: "txt",
};
const EDIT_FORM_COL_2 = {
  span: 12,
  id: "reportCurrencyId",
  label: "清关币别：",
  ...httpCurrencySelect,
  selectLabelKey: "reportCurrencyName",
};
const EDIT_FORM_COL_3 = {
  span: 12,
  id: "country",
  label: "目的国：",
  ...httpCountrySelect,
  selectLabelKey: "countryName",
};
const EDIT_FORM_COL_4 = {
  span: 12,
  id: "platform",
  label: "平台：",
  type: "select",
  placeholder: "请选择",
  basicType: "orderPlatform",
};
const EDIT_FORM_COL_5 = {
  span: 12,
  id: "transactionWarehouse",
  label: "交货仓：",
  ...httpWarehousePublicSelect(),
  selectLabelKey: "transactionWarehouseName",
  type: "slot",
};
const EDIT_FORM_COL_6 = {
  span: 12,
  id: "warehousingTime",
  label: "预计入仓时间：",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const EDIT_FORM_COL_7 = {
  span: 12,
  id: "wholeCabinetSn",
  label: "国内登记号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_FORM_COL_8 = {
  span: 12,
  id: "bookingSpaceProxy",
  label: "订舱代理：",
  ...httpEnterprisetSelect(),
  selectLabelKey: "bookingSpaceProxyName",
  type: "slot",
};
const EDIT_FORM_COL_9 = {
  span: 12,
  id: "cusOrderNumber",
  label: "客户单号：",
  placeholder: "请输入",
  type: "text",
};
const EDIT_FORM_COL_10 = {
  span: 12,
  id: "transportMode",
  label: "运输方式：",
  type: "radio",
  basicType: "transportMode",
};
const EDIT_FORM_COL_11 = {
  span: 12,
  id: "orderBusinessType",
  label: "业务类型：",
  type: "radio",
  basicType: "orderBusinessType",
  hideList: [2, 3, 4, 5],
};
const EDIT_FORM_COL_12 = {
  span: 12,
  id: "isWarehousing",
  label: "是否入仓：",
  type: "radio",
  dicsStr: "web_whether",
  customDicsArr: [0, 1],
  disable: true,
};
const EDIT_FORM_COL_13 = {
  span: 12,
  id: "insureNo",
  label: "保险单号：",
  placeholder: "请输入保险单号",
  maxlength: 64,
  type: "text",
};

const EDIT_FORM_COL_14 = {
  span: 24,
  id: "containerTrailer",
  label: "拖车类型：",
  type: "radio",
  basicType: "containerTrailerType",
};
const EDIT_FORM_COL_15 = {
  span: 12,
  id: "productAttributeList",
  label: "产品属性：",
  placeholder: "请选择",
  type: "select",
  multiple: true,
  isShowNumber: true,
  basicType: "orderProductAttribute",
};

const EDIT_FORM_COL_101 = (isCabinet) => ({
  span: 12,
  id: "outWarehouseWay",
  label: "尾程运输方式：",
  type: "select",
  basicType: "outWarehouseWay",
  ...(!isCabinet ? { hideList: [50] } : {}),
});

const EDIT_FORM_COL_102 = {
  span: 12,
  id: "insured",
  text: "单独购买保险",
  type: "singleCheckbox",
};
const EDIT_FORM_COL_103 = (typeList = "0,1,2,3,4", orderType) => {
  return {
    span: 12,
    id: "startPort",
    label: "起运港：",
    ...httpPortPublicSelect(
      typeList,
      orderType === 4
        ? {
            showLabelFn: (r) => r.code || "--",
          }
        : {}
    ),
    selectLabelKey: orderType === 4 ? "startPortCode" : "startPortName",
  };
};
const EDIT_FORM_COL_104 = (typeList = "0,1,2,3,4", orderType) => {
  return {
    span: 12,
    id: "endPort",
    label: "目的港：",
    ...httpPortPublicSelect(
      typeList,
      orderType === 4
        ? {
            showLabelFn: (r) => r.code || "--",
          }
        : {}
    ),
    selectLabelKey: orderType === 4 ? "endPortCode" : "endPortName",
  };
};
const EDIT_FORM_COL_105 = {
  span: 12,
  id: "reportCustomsWay",
  label: "报关方式：",
  placeholder: "请选择",
  type: "select",
  basicType: "customsDeclarationType",
};
const EDIT_FORM_COL_106 = {
  span: 12,
  id: "customsClearanceType",
  label: "清关方式：",
  type: "radio",
  basicType: "customsClearanceType",
};
const EDIT_FORM_COL_107 = (row = {}) => {
  // 海运/陆运/铁路可以互切， 空运和快递可以互切
  const { headTransportMode } = row;
  const hideList = [0, 1, 2, "0", "1", "2"].includes(headTransportMode)
    ? [3, 4]
    : [3, 4, "3", "4"].includes(headTransportMode)
    ? [0, 1, 2]
    : [];
  return {
    span: 12,
    id: "headTransportMode",
    label: "头程运输方式：",
    type: "select",
    basicType: "headTransportMode",
    hideList,
  };
};
const EDIT_FORM_COL_201 = {
  span: 12,
  id: "overseasAgencyType",
  label: "海外代理类型：",
  type: "radio",
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1],
};
const EDIT_FORM_COL_202 = {
  span: 12,
  id: "overseasAgency",
  label: "海外代理：",
  ...httpEnterprisetSelect(),
  selectLabelKey: "overseasAgencyName",
  type: "slot",
};
const BOOKING_FORM_COL_301 = {
  span: 12,
  id: "proxyType",
  label: "订舱类型：",
  type: "radio",
};
const BOOKING_FORM_COL_302 = {
  span: 12,
  id: "bookingSpaceProxy",
  ...httpEnterprisetSelect(),
  selectLabelKey: "bookingSpaceProxyName",
  type: "slot",
};
export const contentFormCols = (obj) => {
  const {
    modeType,
    isMainBill,
    orderType = 2, //2电商，3海运传统，4空运传统
    freightType, //0FCL  1LCL
    insureState,
    isClearance,
    configRes,
    proxyType,
    operationOrderType, //0海运  1空运
    isTradeClauseD,
    headTransportMode,
  } = obj || {};
  let oType = 0;
  if ([3, 4].includes(orderType)) {
    oType = 1;
  } else if (![2, 3, 4].includes(orderType)) {
    // 其他操作单模板 5：仅拖车、拖车+报关 6：仅报关、仅出证
    return otherFormCols(obj);
  }
  const ecSeaLcl =
    operationOrderType == 0 && freightType == 1 && orderType == 2; //电商海运LCL
  /**
   * oType 0-电商 1-传统 2-其他
   *
   * 电商
   * LCL散货 9-子单不显示国内登记号
   * FCL整柜 1-主单不显示国内登记号
   */
  const isHide =
    (modeType === "FCL" && isMainBill === 1) ||
    (modeType === "LCL" && isMainBill === 9);

  // //电商LCL基础信息
  // const EC_LCL_BASE = [
  //   EDIT_FORM_COL_1, //工作单号
  //   EDIT_FORM_COL_2, //清关币别
  //   EDIT_FORM_COL_3, //国家
  //   EDIT_FORM_COL_4, //平台
  //   EDIT_FORM_COL_5, //交货仓
  //   EDIT_FORM_COL_6, //预计入仓时间
  //   ...(isHide ? [] : [EDIT_FORM_COL_7]), //国内登记号
  //   // EDIT_FORM_COL_8, //订舱代理
  //   EDIT_FORM_COL_13, //保险单号
  //   {
  //     ...EDIT_FORM_COL_9, //客户单号
  //     span: 24,
  //   },
  // ];

  //电商FCL基础信息
  // const EC_FCL_BASE = [
  //   EDIT_FORM_COL_1, //工作单号
  //   EDIT_FORM_COL_2, //清关币别
  //   EDIT_FORM_COL_3, //国家
  //   EDIT_FORM_COL_4, //平台
  //   EDIT_FORM_COL_13, //保险单号
  //   ...(isHide ? [] : [EDIT_FORM_COL_7]), //国内登记号
  //   {
  //     ...EDIT_FORM_COL_9, //客户单号
  //     span: 24,
  //   },
  // ];

  // //电商FCL/LCL服务调整
  // const EC_LCL_SERVICE = [
  //   EDIT_FORM_COL_101,//尾程运输方式
  //   {
  //     ...EDIT_FORM_COL_102, //单独购买保险
  //     disabled: insureState === 3, // 3-节点已完成-不可操作
  //   },
  //   EDIT_FORM_COL_103(operationOrderType == 1 ? 3 : 0), //起运港
  //   EDIT_FORM_COL_104(operationOrderType == 1 ? 3 : 0), //目的港
  //   EDIT_FORM_COL_105, //报关方式
  //   EDIT_FORM_COL_106, //清关方式
  // ];

  /** 传统 */
  //传统LCL基础信息
  const TRAD_LCL_BASE = [
    EDIT_FORM_COL_1, //工作单号
    EDIT_FORM_COL_2, //清关
    {
      ...EDIT_FORM_COL_10, //运输方式
      hideList: orderType === 4 ? [0, 1, 2] : [3, 4],
      // 空运是“空运/快递”
    },
    EDIT_FORM_COL_11, //业务类型
    EDIT_FORM_COL_3, //国家
    // EDIT_FORM_COL_8, //订舱代理
    EDIT_FORM_COL_7, //国内登记号
    // EDIT_FORM_COL_12, //是否入仓
    // EDIT_FORM_COL_5, //交货仓
    {
      ...EDIT_FORM_COL_9,
      span: 24,
    }, //客户单号
    // EDIT_FORM_COL_13, //保险单号
  ];

  //传统FCL基础信息
  const TRAD_FCL_BASE = [
    EDIT_FORM_COL_1, //工作单号
    EDIT_FORM_COL_2, //清关
    {
      ...EDIT_FORM_COL_10, //运输方式
      hideList: orderType === 4 ? [0, 1, 2] : [3, 4],
      // 空运是“空运/快递”
    },
    EDIT_FORM_COL_11, //业务类型
    EDIT_FORM_COL_3, //国家
    EDIT_FORM_COL_7, //国内登记号
    // EDIT_FORM_COL_13, //保险单号
    {
      ...EDIT_FORM_COL_9, //客户单号
      span: 24,
    },
  ];

  //传统LCL/FCL服务调整
  const TRAD_LCL_SERVICE = [
    EDIT_FORM_COL_103(operationOrderType == 1 ? 3 : 0, orderType), //起运港
    EDIT_FORM_COL_104(operationOrderType == 1 ? 3 : 0, orderType), //目的港
    {
      ...EDIT_FORM_COL_102, //单独购买保险
      disabled: insureState === 3,
    },
    EDIT_FORM_COL_106, //清关方式
  ];

  //电商LCL内容更换配置
  const EC_LCL_ROWS_CONFIG = [
    {
      rows: [
        {
          cols: [
            EDIT_FORM_COL_1, //工作单号
            EDIT_FORM_COL_3, //国家
            EDIT_FORM_COL_5, //交货仓
            EDIT_FORM_COL_6, //预计入仓时间
            EDIT_FORM_COL_107({ headTransportMode }), //头程运输方式
            EDIT_FORM_COL_101(), //尾程运输方式
            EDIT_FORM_COL_4, //平台
            EDIT_FORM_COL_15,
            ...(isHide ? [] : [EDIT_FORM_COL_7]), //国内登记号
            {
              ...EDIT_FORM_COL_9, //客户单号
              span: 24,
            },
          ],
        },
      ],
    },
    {
      title: "slot",
      prop: "serveAdjust",
      titleConfig: {
        ...EDIT_FORM_COL_102, //单独购买保险
        disabled: insureState === 3, // 3-节点已完成-不可操作
      },
      rows: [
        {
          cols: [
            EDIT_FORM_COL_103(operationOrderType == 1 ? 3 : 0), //起运港
            EDIT_FORM_COL_104(operationOrderType == 1 ? 3 : 0), //目的港
            EDIT_FORM_COL_105, //报关方式
            EDIT_FORM_COL_13, //保险单号
            EDIT_FORM_COL_106, //清关方式
            EDIT_FORM_COL_2, //清关币别
          ],
        },
      ],
    },
    {
      title: "运输信息",
      rows: [
        {
          cols: [
            ...(orderType == 2 && operationOrderType == 0
              ? []
              : [
                  {
                    ...BOOKING_FORM_COL_301, //订舱类型
                    options: configRes,
                  },
                  {
                    ...BOOKING_FORM_COL_302, //同行/订舱代理
                    label: proxyType == 1 ? "同行代理：" : "订舱代理：",
                  },
                ]),
            {
              ...EDIT_FORM_COL_201, //海外代理类型
              customDicsArr: operationOrderType != 0 ? [0, 1, 2] : [0, 1],
              disable: isClearance ? true : false,
            },
            {
              ...EDIT_FORM_COL_202, //海外代理
              disabled: isClearance ? true : false,
            },
          ],
        },
      ],
    },
  ];
  //传统的LCL内容更换配置
  const TRAD_LCL_ROWS_CONFIG = [
    {
      rows: [
        {
          cols: TRAD_LCL_BASE,
        },
      ],
    },
    {
      title: "服务调整",
      rows: [
        {
          cols: TRAD_LCL_SERVICE,
        },
      ],
    },
    {
      title: "运输信息",
      rows: [
        {
          cols: [
            ...(orderType == 2 && operationOrderType == 0
              ? []
              : [
                  {
                    ...BOOKING_FORM_COL_301, //订舱类型
                    options: configRes,
                  },
                  {
                    ...BOOKING_FORM_COL_302, //同行/订舱代理
                    label: proxyType == 1 ? "同行代理：" : "订舱代理：",
                  },
                ]),
            ...(isTradeClauseD && [3, 4].includes(orderType)
              ? [
                  {
                    ...EDIT_FORM_COL_201, //海外代理类型
                    disable: isClearance ? true : false,
                  },
                  {
                    ...EDIT_FORM_COL_202, //海外代理
                    disabled: isClearance ? true : false,
                  },
                ]
              : []),
          ],
        },
      ],
    },
  ];

  //电商与传统的LCL内容更换配置
  const LCL_ROWS_CONFIG = {
    0: EC_LCL_ROWS_CONFIG,
    1: TRAD_LCL_ROWS_CONFIG,
  }[oType];

  //电商FCL内容更换配置
  const EC_FCL_ROWS_CONFIG = [
    {
      rows: [
        {
          cols: [
            EDIT_FORM_COL_1, //工作单号
            EDIT_FORM_COL_3, //国家
            EDIT_FORM_COL_107({ headTransportMode }),
            ...(isHide ? [] : [EDIT_FORM_COL_101(true)]), //尾程运输方式
            EDIT_FORM_COL_4, //平台
            EDIT_FORM_COL_15,
            ...(isHide ? [] : [EDIT_FORM_COL_7]), //国内登记号
            {
              ...EDIT_FORM_COL_9, //客户单号
              span: 24,
            },
          ],
        },
      ],
    },
    {
      title: "slot",
      prop: "serveAdjust",
      titleConfig: {
        ...EDIT_FORM_COL_102, //单独购买保险
        disabled: insureState === 3, // 3-节点已完成-不可操作
      },
      rows: [
        {
          cols: [
            EDIT_FORM_COL_103(operationOrderType == 1 ? 3 : 0), //起运港
            EDIT_FORM_COL_104(operationOrderType == 1 ? 3 : 0), //目的港
            EDIT_FORM_COL_105, //报关方式
            EDIT_FORM_COL_13, //保险单号
            EDIT_FORM_COL_106, //清关方式
            EDIT_FORM_COL_2, //清关币别
          ],
        },
      ],
    },
    ...(isMainBill === 1 && modeType === "FCL"
      ? []
      : [
          {
            title: "slot",
            prop: "trailerSlot",
            titleConfig: {
              ...EDIT_FORM_COL_14, //拖车类型
              disable: isMainBill === 1 && modeType === "FCL",
            },
            rows: [
              {
                cols: [
                  EDIT_FORM_COL_5, //交货仓
                  EDIT_FORM_COL_6, //预计入仓时间
                ],
              },
            ],
          },
        ]),
    {
      title: "运输信息",
      rows: [
        {
          cols: [
            {
              ...BOOKING_FORM_COL_301,
              options: configRes,
            },
            {
              ...BOOKING_FORM_COL_302,
              label: proxyType == 1 ? "同行代理：" : "订舱代理：",
            },
            {
              ...EDIT_FORM_COL_201,
              customDicsArr: [0, 1],
              disable: isClearance ? true : false,
            },
            {
              ...EDIT_FORM_COL_202,
              disabled: isClearance ? true : false,
            },
          ],
        },
      ],
    },
  ];
  //传统FCL内容更换配置
  const TRAD_FCL_ROWS_CONFIG = [
    {
      rows: [
        {
          cols: TRAD_FCL_BASE,
        },
      ],
    },
    {
      title: "服务调整",
      rows: [
        {
          cols: TRAD_LCL_SERVICE,
        },
      ],
    },
    ...(isMainBill === 1 && modeType === "FCL"
      ? []
      : [
          {
            title: "集装箱拖车",
            rows: [
              {
                cols: [
                  {
                    ...EDIT_FORM_COL_14, //拖车类型
                    disable: isMainBill === 1 && modeType === "FCL",
                  },
                  EDIT_FORM_COL_5, //交货仓
                  EDIT_FORM_COL_6, //预计入仓时间
                ],
              },
            ],
          },
        ]),
    {
      title: "运输信息",
      rows: [
        {
          cols: [
            {
              ...BOOKING_FORM_COL_301,
              options: configRes,
            },
            {
              ...BOOKING_FORM_COL_302,
              label: proxyType == 1 ? "同行代理：" : "订舱代理：",
            },
            ...(isTradeClauseD && [3, 4].includes(orderType)
              ? [
                  {
                    ...EDIT_FORM_COL_201,
                    customDicsArr: [0, 1],
                    disable: isClearance ? true : false,
                  },
                  {
                    ...EDIT_FORM_COL_202,
                    disabled: isClearance ? true : false,
                  },
                ]
              : []),
          ],
        },
      ],
    },
  ];

  //电商与传统的FCL内容更换配置
  const FCL_ROWS_CONFIG = {
    0: EC_FCL_ROWS_CONFIG,
    1: TRAD_FCL_ROWS_CONFIG,
  }[oType];

  if (ecSeaLcl || modeType == "LCL") {
    return [
      {
        fieldList: LCL_ROWS_CONFIG,
      },
    ];
  } else if (modeType == "FCL") {
    return [
      {
        fieldList: FCL_ROWS_CONFIG,
      },
    ];
  }
};

const otherFormCols = (obj) => {
  const { orderType = 5 } = obj || {};

  const OTHER_FORM_COLS_1 = [
    EDIT_FORM_COL_1,
    EDIT_FORM_COL_3,
    EDIT_FORM_COL_13,
    {
      ...EDIT_FORM_COL_9,
      span: 24,
    },
  ];

  const OTHER_FORM_COLS_2 = [
    EDIT_FORM_COL_103(),
    EDIT_FORM_COL_104(),
    {
      ...EDIT_FORM_COL_11,
      hideList: orderType === 5 ? [0, 1, 4, 5] : [0, 1, 2, 3],
    },
    EDIT_FORM_COL_7,
  ];

  if (orderType === 6) {
    OTHER_FORM_COLS_2.push(EDIT_FORM_COL_2, {
      ...EDIT_FORM_COL_105,
      type: "radio",
      hideList: [0],
    });
  }

  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: OTHER_FORM_COLS_1,
            },
          ],
        },
        {
          title: "服务调整",
          rows: [
            {
              cols: OTHER_FORM_COLS_2,
            },
          ],
        },
      ],
    },
  ];
};

export const contentFormRules = (obj) => {
  const { modeType, orderType, isMainBill } = obj || {};
  const comRules = {
    country: [{ required: true, message: "请选择国家", trigger: "change" }],
    startPort: [{ required: true, message: "请选择起运港", trigger: "change" }],
    endPort: [{ required: true, message: "请选择目的港", trigger: "change" }],
  };
  if ([5, 6].includes(orderType)) {
    // 其他操作单
    return {
      ...comRules,
      orderBusinessType: [
        { required: true, message: "请选择业务类型", trigger: "change" },
      ],
    };
  }

  let rulesObj = {
    ...comRules,
    outWarehouseWay: [
      { required: true, message: "请选择运输方式", trigger: "change" },
    ],
    reportCustomsWay: [
      { required: true, message: "请选择报关方式", trigger: "change" },
    ],
    customsClearanceType: [
      { required: true, message: "请选择清关方式", trigger: "change" },
    ],
    reportCurrencyId: [
      { required: true, message: "请选择清关币别", trigger: "change" },
    ],
    overseasAgency: [
      { required: true, message: "请选择海外代理", trigger: "change" },
    ],
    overseasAgencyType: [
      { required: true, message: "请选择海外代理类型", trigger: "change" },
    ],
    bookingSpaceProxy: [
      { required: true, message: "请选择代理", trigger: "change" },
    ],
    headTransportMode: [
      { required: true, message: "请选择头程运输方式", trigger: "change" },
    ],
  };
  if (modeType === "FCL" && isMainBill !== 1) {
    // 整柜主单不可修改
    rulesObj["containerTrailer"] = [
      { required: true, message: "请选择拖车类型", trigger: "change" },
    ];
  }
  if (modeType === "LCL" && orderType === 2) {
    rulesObj["transactionWarehouse"] = [
      { required: true, message: "请选择交货仓", trigger: "change" },
    ];
    rulesObj["warehousingTime"] = [
      { required: true, message: "请选择预计入仓时间", trigger: "change" },
    ];
    delete rulesObj.startPort;
    delete rulesObj.endPort;
  }
  // if (modeType === "LCL" && [3, 4].includes(orderType)) {
  //   // 传统散货
  //   rulesObj["transactionWarehouse"] = [
  //     { required: true, message: "请选择交货仓", trigger: "change" },
  //   ];
  // }
  return rulesObj;
};

/** 收发通知人修改 */
export const contactsFormCols = (obj) => {
  const { customerId, isVatEori, orderType, handleConsignee } = obj || {};
  const CONTACTS_FORM_COL_1 = {
    span: 24,
    selectTxtWidth: 390,
    isBackAll: true,
  };
  const CONTACTS_FORM_COL_2 = {
    span: 24,
    id: "shipperSlot",
    type: "slot",
  };
  const CONTACTS_FORM_COL_3 = {
    span: 12,
    id: "vatClearanceList",
    label: "VAT：",
    ...httpCustomsClearanceSelect({ clearanceTypes: 1 }),
    type: "slot",
  };
  const CONTACTS_FORM_COL_4 = {
    span: 12,
    id: "eoriClearanceList",
    label: "EORI：",
    ...httpCustomsClearanceSelect({ clearanceTypes: 2 }),
    type: "slot",
  };
  const CONTACTS_FORM_COL_5 = {
    span: 12,
    id: "bondClearanceList",
    label: "POA：",
    ...httpCustomsClearanceSelect({ clearanceTypes: "3,4" }),
    type: "slot",
  };
  const CONTACTS_FORM_COL_6 = {
    span: 24,
    id: "customsClearanceList",
    label: "VAT/EORI/POA：",
    ...httpCustomsClearanceSelect(),
    type: "slot",
  };

  const CONTACTS_FORM_COLS = [
    {
      ...CONTACTS_FORM_COL_1,
      ...httpContactsSelect({ customerId, contactsType: 1 }),
      id: "shipperObj",
      label: "发货人：",
      selectLabelKey: "consignerName",
      type: "slot",
    },
    CONTACTS_FORM_COL_2,
    {
      ...CONTACTS_FORM_COL_1,
      ...httpContactsSelect({ customerId, contactsType: 0 }),
      id: "consigneeObj",
      label: "收货人：",
      selectLabelKey: "consigneeName",
      handle: handleConsignee,
      type: "slot",
    },
    {
      ...CONTACTS_FORM_COL_2,
      id: "consigneeSlot",
    },
    ...(orderType !== 2
      ? [CONTACTS_FORM_COL_6]
      : isVatEori
      ? [CONTACTS_FORM_COL_3, CONTACTS_FORM_COL_4]
      : [CONTACTS_FORM_COL_5]),
    {
      ...CONTACTS_FORM_COL_1,
      ...httpContactsSelect({ customerId }),
      id: "notifierObj",
      label: "通知人：",
      selectLabelKey: "notifierName",
      type: "slot",
    },
  ];

  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: CONTACTS_FORM_COLS,
            },
          ],
        },
      ],
    },
  ];
};

export const contactsFormRules = (obj) => {
  const { orderType } = obj || {};
  let ruleObj = {
    shipperObj: [
      { required: true, message: "请选择发货人", trigger: "change" },
    ],
    consigneeObj: [
      { required: true, message: "请选择收货人", trigger: "change" },
    ],
  };
  if (orderType === 2) {
    ruleObj.vatClearanceList = [
      { required: true, message: "请选择VAT", trigger: "change" },
    ];
    ruleObj.eoriClearanceList = [
      { required: true, message: "请选择VAT", trigger: "change" },
    ];
    ruleObj.bondClearanceList = [
      { required: true, message: "请选择POA", trigger: "change" },
    ];
  }
  return ruleObj;
};

export const customsClearanceMeansCols = (obj) => {
  const { hideList = [] } = obj || {};
  return {
    title: "上传资料",
    width: "470px",
    labelWidth: "78px",
    dictionaryWords: ["customsClearanceMode"],
    isAttachFileId: true,
    simpleCustomCols: [
      {
        span: 24,
        id: "customsClearanceType",
        label: "类型：",
        type: "radio",
        basicType: "customsClearanceMode",
        hideList,
      },
      {
        span: 24,
        id: "code",
        label: "清关编号：",
        placeholder: "请输入",
        type: "text",
        maxlength: 50,
      },
      {
        span: 24,
        id: "remark",
        label: "说明：",
        placeholder: "请补充说明",
        type: "textarea",
        maxlength: 1000,
      },
      {
        span: 24,
        id: "attachId",
        fileLabel: "清关文件",
        labelWidth: "10px",
        type: "customUploadFile",
        uploadData: {
          attachType: "customsClearance",
        },
      },
    ],
    formRules: {
      customsClearanceType: [
        { required: true, message: "请选择类型", trigger: "change" },
      ],
      code: [{ required: true, message: "请输入清关编号", trigger: "blur" }],
    },
  };
};
