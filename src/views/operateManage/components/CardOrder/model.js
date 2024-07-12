import {
  httpLCLBookingSelect,
  httpEnterprisetSelect,
} from "@/comModel/httpSelect";
export const cardConfig = [
  {
    bgColor: "#ECF3FF",
    icon: "yunshu1",
    airTransport: "kongyun",
    oceanShipping: "haiyun",
    type: "slot",
    prop: "addr",
    labelColor: "#80B1FF",
    valueColor: "#5094FF",
  },
  {
    bgColor: "#FFF3EC",
    icon: "yundanhao",
    label: "工作单号",
    prop: "operationOrderNum",
    labelColor: "#FF985C",
    valueColor: "#FF813D",
  },
  {
    bgColor: "#ECECFF",
    icon: "icon-zhongliang",
    label: "核实重量(KG)",
    prop: "billingWeight",
    labelColor: "#B1B1FF",
    valueColor: "#7676FF",
    numDecimal: 2,
  },
  {
    bgColor: "#D2F1FF",
    icon: "icon-tiji",
    label: "核实体积(CBM)",
    prop: "billingVolume",
    labelColor: "#64CFFF",
    valueColor: "#13B5FF",
    numDecimal: 2,
  },
];

const MODEL_COL_1 = {
  span: 8,
  id: "freightType",
  label: "装箱方式：",
  type: "txt",
  basicType: "freightType",
};
const MODEL_COL_2 = {
  span: 8,
  id: "operationOrderType",
  label: "运输方式：",
  type: "txt",
  render: (r) => {
    return `${["海运", "空运"][r.operationOrderType] || "--"}${
      ["出口", "进口"][r.orderBusinessType] || ""
    }`;
  },
};
const MODEL_COL_3 = {
  span: 8,
  id: "customsClearanceType",
  label: "清关方式：",
  type: "radio",
  basicType: "customsClearanceType",
  disable: true,
};
const MODEL_COL_4 = (sType = "txt") => {
  return {
    span: 8,
    id: "bookingSpaceProxyName",
    label: "订舱代理：",
    type: sType,
  };
};
const MODEL_COL_5 = {
  span: 8,
  id: "reportCustomsWay",
  label: "报关方式：",
  type: "txt",
  basicType: "customsDeclarationType",
};
const MODEL_COL_6 = (oType) => {
  return {
    span: 8,
    id: "shipCompanyName",
    label: oType == 1 ? "航空公司：" : "船/航空公司：", // 1-空运  2-海运
    labelWidth: "85px",
    type: "txt",
  };
};
const MODEL_COL_7 = {
  span: 8,
  id: "tradeClause",
  label: "贸易条款：",
  type: "txt",
  basicType: "tradeClause",
};
const MODEL_COL_8 = {
  span: 8,
  id: "cabinProxyName",
  label: "海外代理：",
  type: "txt",
};
const MODEL_COL_9 = {
  span: 8,
  id: "insureNo",
  label: "保险单号：",
  type: "txt",
};
const MODEL_COL_10 = {
  span: 8,
  id: "headTransportMode",
  label: "头程运输方式：",
  type: "txt",
  basicType: "headTransportMode",
  labelWidth: "92px",
};
const MODEL_COL_11 = {
  span: 8,
  id: "operateMainName",
  label: "客户归属：",
  type: "txt",
};

const MODEL_COL_12 = {
  span: 6,
  id: "wholeCabinetSn",
  label: "国内登记号：",
  type: "txt",
};
const MODEL_COL_13 = {
  span: 6,
  id: "sono",
  label: "SO No.：",
  type: "txt",
};
const MODEL_COL_14 = {
  span: 6,
  id: "registerNo",
  label: "柜号：",
  type: "txt",
};
const MODEL_COL_15 = {
  span: 6,
  id: "shipName",
  label: "船名/船次：",
  type: "txt",
};
const MODEL_COL_16 = {
  span: 6,
  id: "routeName",
  label: "航次：",
  type: "txt",
};
const MODEL_COL_17 = {
  span: 6,
  id: "customsClearanceType",
  label: "清关方式：",
  type: "txt",
  basicType: "customsClearanceType",
};
const MODEL_COL_18 = {
  span: 6,
  id: "cusOrderNumber",
  label: "客户单号：",
  type: "txt",
};
const MODEL_COL_19 = {
  span: 6,
  id: "productAttributeList",
  label: "产品属性：",
  type: "txt",
  basicType: "orderProductAttribute",
};
export const ecBasicConfig = (row) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...MODEL_COL_1,
                  span: 6,
                  type: "slot",
                },
                MODEL_COL_12,
                MODEL_COL_13,
                MODEL_COL_14,
                {
                  ...MODEL_COL_5,
                  span: 6,
                },
                {
                  ...MODEL_COL_4("slot"),
                  span: 6,
                },
                MODEL_COL_15,
                MODEL_COL_16,
                MODEL_COL_17,
                // {
                //   ...MODEL_COL_6(row.operationOrderType),
                //   labelWidth: "92px",
                // },
                {
                  ...MODEL_COL_8,
                  span: 6,
                },
                MODEL_COL_18,
                MODEL_COL_19,
              ],
            },
          ],
        },
      ],
    },
  ];
};
export const tranditionBasicConfig = (row) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                { ...MODEL_COL_2, span: 6 }, // 运输方式
                { ...MODEL_COL_1, span: 6 }, // 装箱方式
                { ...MODEL_COL_7, span: 6 }, // 贸易条款
                {
                  ...MODEL_COL_18,
                  id:
                    row.isMainBill === 5 ? "cusOrderNumber" : "customerOrderSn",
                }, // 客户单号
                { ...MODEL_COL_15, label: "船名/航班：" }, // 船名/航班
                MODEL_COL_16, // 航次
                MODEL_COL_13, // SO No.
                MODEL_COL_14, // 柜号
                { ...MODEL_COL_6(row.operationOrderType), span: 6 }, // 船/航空公司
                {
                  span: 6,
                  id: "customsDeclarationType",
                  label: "报关方式：",
                  type: "txt",
                }, // 报关方式
                { ...MODEL_COL_4(), span: 6 }, // 订舱代理
                { ...MODEL_COL_8, span: 6 }, // 海外代理
                // MODEL_COL_11, // 客户归属
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const otherBasicConfig = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              MODEL_COL_11,
              {
                ...MODEL_COL_1,
                span: 6,
              },
              {
                span: 6,
                id: "orderBusinessType",
                label: "业务类型：",
                type: "txt",
                basicType: "orderBusinessType",
              },
              {
                span: 6,
                id: "customsDeclarationType",
                label: "报关方式：",
                type: "txt",
                basicType: "customsDeclarationType",
              },
              {
                span: 6,
                id: "customerOrderSn",
                label: "客户单号：",
                type: "txt",
              },
              {
                span: 6,
                id: "declareCurrencyName",
                label: "清关币别：",
                type: "txt",
              },
              MODEL_COL_9,
            ],
          },
        ],
      },
    ],
  },
];

const BOOKING_FORM_COL_1 = {
  span: 24,
  id: "tipsTxt",
  labelWidth: "2px",
  // type: "txt",
  type: "slot",
};
const BOOKING_FORM_COL_3 = {
  span: 24,
  id: "bookingSpaceProxy",
  label: "订舱代理：",
  ...httpEnterprisetSelect(),
  type: "slot",
};

export const bookingConfirmForm = (obj = {}) => {
  const { resConfig } = obj;
  const BOOKING_FORM_COL_2 = {
    span: 24,
    id: "proxyType",
    label: "头程代理类型：",
    type: "radio",
    options: resConfig,
  };

  return {
    title: "更换订舱代理",
    width: "450px",
    labelWidth: "102px",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  BOOKING_FORM_COL_1,
                  BOOKING_FORM_COL_2,
                  BOOKING_FORM_COL_3,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      proxyType: [
        { required: true, message: "请选择头程代理类型", trigger: "change" },
      ],
      bookingSpaceProxy: [
        { required: true, message: "请选择订舱代理", trigger: "change" },
      ],
    },
  };
};
