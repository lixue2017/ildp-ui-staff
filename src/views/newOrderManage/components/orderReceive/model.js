import {
  httpPortPublicSelect,
  httpUserSelect,
  httpEnterprisetSelect,
  httpRoleDeptUserSelect,
  httpQuotationSelect,
  shipCompanyList,
} from "@/comModel/httpSelect.js";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
// 接单配置
//之前使用的组件与MODEL.JS的文件地址为src\views\newOrderManage\components\OrderReceiving
//电商传统列表与详情如果要恢复道之前的版本，只需要修改以下就可以，没有改动原文件
// components: {
//   OrderReceiving: () => import("@/views/newOrderManage/seaTransport/components/orderReceive/index.vue"),
// },
const FORM_TABLE_TITLE = {
  span: 24,
  id: "tips",
  labelWidth: "60px",
  type: "slot",
};
const FORM_TABLE_1 = {
  span: 12,
  id: "operationOrderNum",
  label: "工作单号：",
  labelWidth: "120px",
  placeholder: "--",
  type: "slot",
};
const FORM_TABLE_2 = {
  span: 12,
  id: "isWarehousing",
  label: "是否入仓：",
  type: "slot",
  labelWidth: "120px",
};
const FORM_TABLE_3 = {
  span: 12,
  id: "freightType",
  label: "装箱方式：",
  placeholder: "--",
  type: "txt",
  labelWidth: "120px",
  basicType: "freightType",
  basicTypeVal: "freightType",
};
const FORM_TABLE_4 = {
  span: 12,
  id: "putWarehouseTime",
  label: "预计入库时间：",
  labelWidth: "120px",
  placeholder: "--",
  type: "txt",
};
const FORM_TABLE_5 = {
  span: 12,
  id: "operator",
  label: "操作员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const FORM_TABLE_6 = {
  span: 12,
  id: "proxyType",
  label: "代理类型：",
  placeholder: "--",
  type: "radio",
  basicType: "clientIdentity",
  hideList: [2, 3, 4],
  labelWidth: "120px",
};
const FORM_TABLE_7 = {
  span: 12,
  id: "fileMember",
  label: "文件员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const FORM_TABLE_8 = (fType) => {
  return {
    span: 12,
    id: "bookingSpaceProxy",
    label: "订舱代理：",
    labelWidth: "120px",
    ...httpEnterprisetSelect({ freightType: fType }), // 电商区分 0-FCL整柜 1-LCL散货
    type: "slot",
  };
};
const FORM_TABLE_9 = {
  span: 12,
  id: "salesman",
  selectLabelKey: "salesmanName",
  label: "销售员：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["YW"] }),
  disabled: true,
};
const FORM_TABLE_10 = {
  span: 12,
  id: "salesAssistant",
  label: "销售助理：",
  labelWidth: "120px",
  placeholder: "请选择",
  isAutoInitRequest: true,
  ...httpUserSelect(),
  type: "slot",
};
const FORM_TABLE_11 = {
  span: 12,
  id: "cusService",
  label: "客服：",
  labelWidth: "120px",
  placeholder: "请选择",
  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
};
const FORM_TABLE_12 = {
  span: 12,
  id: "bookingPeople",
  label: "订舱人：",
  labelWidth: "120px",
  placeholder: "请选择订舱人",
  ...httpUserSelect(),
};
const FORM_TABLE_13 = {
  span: 24,
  id: "remark",
  label: "备注：",
  labelWidth: "120px",
  placeholder: "备注说明",
  type: "text",
};
const FORM_TABLE_14 = {
  span: 12,
  id: "proxyType",
  label: "头程代理类型：",
  type: "radio",
  dicsStr: "headAgency_type",
  customDicsArr: [0, 1],
  labelWidth: "120px",
};
const FORM_TABLE_15 = {
  span: 12,
  id: "overseasAgency",
  label: "海外代理：",
  labelWidth: "120px",
  ...httpEnterprisetSelect({ typeList: 0 }),
  type: "slot",
  searchIdPageSize: 100,
};
const FORM_TABLE_17 = {
  span: 12,
  id: "containerTrailer",
  label: "集装箱拖车：",
  type: "select",
  dicsStr: "containerTrailer_type",
  customDicsArr: [0, 1, 2],
  labelWidth: "120px",
};
const FORM_TABLE_18 = {
  span: 12,
  id: "overseasAgencyType",
  label: "海外代理类型：",
  type: "radio",
  dicsStr: "overseasAgent_type",
  customDicsArr: [0, 1, 2],
  labelWidth: "120px",
};
const FORM_TABLE_19 = {
  span: 12,
  id: "transactionWarehouse",
  label: "国内交货仓：",
  placeholder: "请选择国内交货仓",
  labelWidth: "120px",
  selectLabelKey: "transactionWarehouseName",
  ...httpWarehousePublicSelect({ itemId: "parentId" }),
  type: "slot",
};
const FORM_TABLE_20 = {
  span: 12,
  id: "orderBusinessType",
  label: "业务类型：",
  placeholder: "--",
  type: "txt",
  labelWidth: "120px",
  basicType: "orderBusinessType",
  basicTypeVal: "orderBusinessType",
};
const FORM_TABLE_21 = {
  span: 12,
  id: "proxyType",
  label: "订舱类型：",
  type: "radio",
  labelWidth: "120px",
};
const FORM_TABLE_22 = (obj) => ({
  span: 12,
  id: "quotationSheetId",
  label: "关联报价：",
  placeholder: "请选择报价单",
  ...httpQuotationSelect(obj),
  type: "slot",
  labelWidth: "120px",
});
const FORM_TABLE_23 = {
  span: 12,
  id: "etaTime",
  label: "ETA：",
  labelWidth: "120px",
  placeholder: "请选择ETA",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_TABLE_24 = {
  span: 12,
  id: "sailOpenTime",
  label: "ETD：",
  labelWidth: "120px",
  placeholder: "请选择ETD",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_TABLE_25 = {
  span: 12,
  id: "cutGateTime",
  label: "截关日期：",
  labelWidth: "120px",
  placeholder: "请选择截关日期",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_TABLE_26 = {
  span: 12,
  id: "transferId",
  label: "中转港：",
  labelWidth: "120px",
  placeholder: "请选择中转港",
  ...httpPortPublicSelect(),
};
const FORM_TABLE_27 = {
  span: 12,
  id: "shipCompanyId",
  label: "航空公司：",
  labelWidth: "120px",
  placeholder: "航空公司",
  ...shipCompanyList(),
};
export const formRulesLists = {
  bookingSpaceProxy: [
    { required: true, message: "请选择订舱代理", trigger: "change" },
  ],
  operator: [{ required: true, message: "请选择操作员", trigger: "change" }],
  salesman: [{ required: true, message: "请选择销售员", trigger: "change" }],
  fileMember: [{ required: true, message: "请选择文件员", trigger: "change" }],
  isWarehousing: [
    { required: true, message: "请选择是否入仓", trigger: "change" },
  ],
  shipmentPeriod: [
    { required: true, message: "请选择开航期", trigger: "change" },
  ],
  overseasAgencyType: [
    { required: true, message: "请选择海外代理类型", trigger: "change" },
  ],
  overseasAgency: [
    { required: true, message: "请选择海外代理", trigger: "change" },
  ],
  containerTrailer: [
    { required: true, message: "请选择集装箱拖车", trigger: "change" },
  ],
  proxyType: [
    { required: true, message: "请选择头程代理类型", trigger: "change" },
  ],
  transactionWarehouse: [
    { required: true, message: "请选择国内交货仓", trigger: "change" },
  ],
  etaTime: [{ required: true, message: "请选择ETA", trigger: "change" }],
  sailOpenTime: [{ required: true, message: "请选择ETD", trigger: "change" }],
  cutGateTime: [
    { required: true, message: "请选择截关日期", trigger: "change" },
  ],
  shipCompanyId: [
    { required: true, message: "请选择航空公司", trigger: "change" },
  ],
  // salesAssistant: [ 暂时去掉，有些参数没有数据
  //   { required: true, message: "请选择销售助理", trigger: "blur" },
  // ],
};

const traditionFcl = (row, extraParams, dicts, quotationParams) => {
  //传统整柜
  const { proxyTypeDicts } = dicts;
  const { salesmanChange, containerTrailerChange, freightType, isTradeClause } =
    row;
  const { bookingSpaceProxy } = extraParams;
  bookingSpaceProxy.typeList = freightType == 0 ? "0" : "3";
  const formRules = [
    "containerTrailer",
    "operator",
    "salesman",
    "fileMember",
    "salesAssistant",
    "bookingSpaceProxy",
    "proxyType",
    isTradeClause == 1 ? "overseasAgency" : "",
    isTradeClause == 1 ? "overseasAgencyType" : "",
  ].filter((e) => e);
  const config = {
    title: "传统海运FCL接单",
    defaultModel: {
      proxyType: proxyTypeDicts[0]?.value,
      isWarehousing: "0",
      isArrangeContainer: 1,
      containerTrailer: "0",
      overseasAgencyType: "0",
    },
    lists: [
      {
        ...FORM_TABLE_1, //关联订单
        basicType: "tradeClause",
        basicTypeVal: "tradeClause",
      },
      {
        ...FORM_TABLE_17,
        handle: containerTrailerChange,
      }, //集装箱拖车，
      {
        ...FORM_TABLE_19,
        label: "交货仓：",
        placeholder: "请选择交货仓",
      }, //交货仓
      {
        ...FORM_TABLE_4,
        type: "date",
        valueFormat: "yyyy/MM/dd",
        placeholder: "请选择预计入库时间",
      }, //预计入库时间
      {
        ...FORM_TABLE_9,
        handle: salesmanChange,
      }, //销售员
      {
        ...FORM_TABLE_21,
        options: proxyTypeDicts,
      }, //头程代理类型,
      FORM_TABLE_10, //销售助理
      {
        ...FORM_TABLE_8(),
        // placeholder: "--",
      }, //订舱代理
      FORM_TABLE_5, //操作员
      // {
      //   ...FORM_TABLE_18,
      //   customDicsArr: [0, 1],
      // }, //海外代理类型
      ...(isTradeClause == 1
        ? [
            {
              ...FORM_TABLE_18,
              customDicsArr: [0, 1],
            },
          ]
        : []),
      FORM_TABLE_7, //文件员
      ...(isTradeClause == 1
        ? [
            {
              ...FORM_TABLE_15,
            },
          ]
        : []),
      FORM_TABLE_22(quotationParams), // 关联报价
      // FORM_TABLE_15, //海外代理

      // FORM_TABLE_11, //客服
      FORM_TABLE_13, //备注
    ],
    formRules: FORMRULES_CONFIG(formRules),
  };
  return config;
};

const traditionLcl = (row, extraParams, dicts, quotationParams) => {
  // 传统-散货
  const { proxyTypeDicts } = dicts;
  //operationOrderType 0海运 1空运  isTradeClause:1 D类贸易条款    0非D类
  const {
    salesmanChange,
    operationOrderType,
    isTradeClause,
    orderType,
    transportMode,
  } = row;
  const { bookingSpaceProxy } = extraParams;
  bookingSpaceProxy.typeList = 3;
  const formRules = [
    "isWarehousing",
    "bookingSpaceProxy",
    "shipmentPeriod",
    "operator",
    "salesman",
    "fileMember",
    "salesAssistant",
    // "transactionWarehouse",
    operationOrderType == 0 && isTradeClause == 1 ? "overseasAgency" : "",
    operationOrderType == 0 && isTradeClause == 1 ? "overseasAgencyType" : "",
    "etaTime",
    "sailOpenTime",
    "cutGateTime",
    "shipCompanyId",
  ].filter((e) => e);
  let defaultOrderModel = {
    proxyType: proxyTypeDicts[0]?.value,
    overseasAgencyType: "0",
  };
  let orderTypeCols = [
    {
      ...FORM_TABLE_21,
      options: proxyTypeDicts,
    }, //头程代理类型,
    FORM_TABLE_5, //操作员
    FORM_TABLE_8(), //订舱代理
    FORM_TABLE_7, //文件员
    // {
    //   ...FORM_TABLE_18,
    //   customDicsArr: [0, 1],
    // }, //海外代理类型
    ...(isTradeClause == 1
      ? [
          {
            ...FORM_TABLE_18,
            customDicsArr: [0, 1],
          },
        ]
      : []),
    ...(isTradeClause == 1
      ? [
          {
            ...FORM_TABLE_15,
          },
        ]
      : []),
    // FORM_TABLE_11, //客服
    // FORM_TABLE_15, //海外代理
  ];

  if ([4, "4"].includes(orderType)) {
    if ([4, "4"].includes(transportMode)) {
      // 空运快递
      orderTypeCols = [
        FORM_TABLE_5, //操作员
        FORM_TABLE_7, //文件员
      ];
      defaultOrderModel = {};
    }
  }
  const isFastMail =
    [4, "4"].includes(orderType) && [4, "4"].includes(transportMode);
  let lists = [
    {
      ...FORM_TABLE_1, //关联订单
      basicType: "tradeClause",
      basicTypeVal: "tradeClause",
      span: 24,
    },
    // {
    //   ...FORM_TABLE_2, //是否入仓
    //   type: "radio",
    //   dicsStr: "web_whether",
    //   customDicsArr: [1, 0],
    // 	disable: true,
    // },
    // {
    //   ...FORM_TABLE_19,
    //   ...httpWarehousePublicSelect({
    //     itemId: "parentId",
    //     typeList: " 2, 3",
    //     flagAvailable: "y",
    //   }),
    //   type: "slot",
    // }, //国内交货仓
    {
      ...FORM_TABLE_9,
      handle: salesmanChange,
    }, //销售员
    FORM_TABLE_10, //销售助理
    ...orderTypeCols,
    ...(!isFastMail
      ? [
          FORM_TABLE_23,
          ...(operationOrderType == 0 ? [FORM_TABLE_25] : [FORM_TABLE_27]),
          FORM_TABLE_24,
          ...(operationOrderType == 0
            ? [{ ...FORM_TABLE_27, label: "船公司：", placeholder: "船公司" }]
            : []),
          FORM_TABLE_26,
        ]
      : []),
    FORM_TABLE_22(quotationParams), // 关联报价
    FORM_TABLE_13, //备注
  ];
  const config = {
    title: operationOrderType == 1 ? "传统空运LCL接单" : "传统海运LCL接单",
    defaultModel: {
      ...defaultOrderModel,
      isWarehousing: "1", // 传统LCL入仓-默认必填不可更改
    },
    lists,
    formRules: FORMRULES_CONFIG(formRules),
  };
  return config;
};

const eCommerceFcl = (row, extraParams, dicts, quotationParams) => {
  // 电商-整柜FCL
  const { proxyTypeDicts } = dicts;
  const { salesmanChange, containerTrailerChange } = row;
  const { transactionWarehouse, bookingSpaceProxy, overseasAgency } =
    extraParams;
  transactionWarehouse.className = "auto-dis-no-icon auto-dis-search";
  transactionWarehouse.disabled = true;
  // bookingSpaceProxy.className = "auto-dis-no-icon auto-dis-search";
  // bookingSpaceProxy.disabled = true
  overseasAgency.typeList = 0;
  overseasAgency.isOverseasAgent = 1;
  bookingSpaceProxy.typeList = "0";
  const config = {
    title: "电商FCL接单",
    defaultModel: {
      proxyType: proxyTypeDicts[0]?.value, //头程代理类型
      orderType: 2, //订单类型
      isArrangeContainer: 1, //是否安排集装箱
      overseasAgencyType: "0",
      containerTrailer: "0",
    },
    lists: [
      FORM_TABLE_1, //关联订单
      {
        ...FORM_TABLE_17,
        handle: containerTrailerChange,
      }, //集装箱拖车，
      {
        ...FORM_TABLE_9,
        handle: salesmanChange,
      }, //销售员
      {
        ...FORM_TABLE_19,
        type: "slot",
      }, //国内交货仓
      FORM_TABLE_10, //销售助理
      {
        ...FORM_TABLE_21,
        options: proxyTypeDicts,
      }, //头程代理类型,
      FORM_TABLE_5, //操作员
      FORM_TABLE_8(0), //订舱代理
      FORM_TABLE_7, //文件员
      {
        ...FORM_TABLE_18,
        customDicsArr: [0, 1],
      }, //海外代理类型
      FORM_TABLE_15, //海外代理
      // FORM_TABLE_11, //客服
      FORM_TABLE_22(quotationParams), // 关联报价
      FORM_TABLE_13, //备注
    ],
    formRules: FORMRULES_CONFIG([
      "bookingSpaceProxy",
      "operator",
      "salesman",
      "fileMember",
      "containerTrailer",
      "proxyType",
      "overseasAgencyType",
      "overseasAgency",
      "salesAssistant",
    ]),
  };
  return config;
};

const eCommerceLcl = (row, extraParams, dicts, quotationParams) => {
  //电商散货
  let { proxyTypeDicts } = dicts;
  const { operationOrderType, routeCode, salesmanChange } = row; //routeCode(89为英国欧盟)
  const { bookingSpaceProxy, overseasAgency } = extraParams;
  if (operationOrderType == 0 && (routeCode == 8 || routeCode == 9)) {
  } else {
    proxyTypeDicts = proxyTypeDicts.map((e) => {
      if (e.value == 2) {
        return {
          ...e,
          disabled: true,
        };
      }
      return e;
    });
    // bookingSpaceProxy.typeList = 3;
  }
  overseasAgency.className = "";
  overseasAgency.disabled = false;
  overseasAgency.typeList = 0;
  overseasAgency.isOverseasAgent = 1;
  bookingSpaceProxy.typeList = 3;
  let FORM_TABLE_EC_8 = FORM_TABLE_8(1); //订舱代理
  if (operationOrderType == 1) {
    // 电商空运
    FORM_TABLE_EC_8.selectLabelKey = "bookingSpaceProxyName";
  }
  const config = {
    title: "电商LCL接单",
    defaultModel: {
      proxyType: proxyTypeDicts[0]?.value,
      // proxyType:
      //   operationOrderType == 0 && (routeCode == 8 || routeCode == 9)
      //     ? "0"
      //     : "1",
      orderType: 2,
      isWarehousing: 1,
      overseasAgencyType: "0",
    },
    lists: [
      FORM_TABLE_TITLE,
      FORM_TABLE_1, //关联订单
      FORM_TABLE_2, //是否入仓
      {
        ...FORM_TABLE_9,
        handle: salesmanChange,
      }, //销售员
      FORM_TABLE_4, //预计入库时间
      FORM_TABLE_10, //销售助理
      {
        ...FORM_TABLE_21,
        options: proxyTypeDicts,
        // customDicsArr:
        //   operationOrderType == 0 && (routeCode == 8 || routeCode == 9)
        //     ? [0, 1]
        //     : [1], //只有海运，目的国为欧盟和英国，才可选“堡森”；
      }, //订舱类型,
      FORM_TABLE_5, //操作员
      FORM_TABLE_EC_8, //订舱代理
      FORM_TABLE_7, //文件员
      {
        ...FORM_TABLE_18,
        customDicsArr: operationOrderType == 0 ? [0, 1] : [0, 1, 2], //只有海运，目的国为欧盟和英国，才可选“堡森”；
        // customDicsArr: [0, 1],
      }, //海外代理类型
      FORM_TABLE_22(quotationParams), // 关联报价
      FORM_TABLE_15, //海外代理
      // FORM_TABLE_11, //客服
      FORM_TABLE_13, //备注
    ],
    formRules: FORMRULES_CONFIG([
      "bookingSpaceProxy",
      "operator",
      "salesman",
      "fileMember",
      "proxyType",
      "overseasAgency",
      "salesAssistant",
    ]),
  };
  return config;
};

const otherOrders = (row) => {
  const { salesmanChange } = row;
  const config = {
    title: "传统其他订单",
    lists: [
      FORM_TABLE_TITLE,
      {
        ...FORM_TABLE_1,
        type: "txt",
      }, //关联订单
      FORM_TABLE_20, //订单业务
      {
        ...FORM_TABLE_9,
        handle: salesmanChange,
      }, //销售员
      FORM_TABLE_10, //销售助理
      FORM_TABLE_5, //操作员
      FORM_TABLE_7, //文件员

      // FORM_TABLE_11, //客服
      FORM_TABLE_13, //备注
    ],
    formRules: FORMRULES_CONFIG([
      "operator",
      "salesman",
      "fileMember",
      "salesAssistant",
    ]),
  };
  return config;
};

export const formConfig = (row = {}, extraParams, dicts = []) => {
  const { type, quotationParams, ...data } = row;
  switch (type) {
    case 1: //传统整柜
      return traditionFcl(data, extraParams, dicts, quotationParams);
    case 2: //传统散货
      return traditionLcl(data, extraParams, dicts, quotationParams);
    case "3-0": //电商整柜
      return eCommerceFcl(data, extraParams, dicts, quotationParams);
    case "3-1": //电商散货
      return eCommerceLcl(data, extraParams, dicts, quotationParams);
    case 4: //其他订单
      return otherOrders(data);
  }
};

export const FORMRULES_CONFIG = (rows) => {
  //校验集合
  let returnRules = {};
  rows.map((item) => {
    if (Object.keys(formRulesLists).includes(item)) {
      returnRules[item] = formRulesLists[item];
    }
  });
  return returnRules;
};
