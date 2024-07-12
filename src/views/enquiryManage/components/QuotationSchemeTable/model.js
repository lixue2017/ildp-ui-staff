import {
  httpAirFlightSelect,
  shipCompanyList,
  httpCostTypeSelect,
  httpCabinetTypeSelect,
  httpEnterprisetSelect,
} from "@/comModel/httpSelect";
//
const FROM_COLS_SCHEME = {
  span: 8,
  id: "airShipCompany",
  label: "船公司：",
  placeholder: "船公司",
  defaultKey: "id",
  selectLabelKey: "airShipCompanyName",
  labelWidth: "65px",
  isBackAll: true,
  ...shipCompanyList(),
};
const FROM_COLS_SCHEME_1 = {
  ...FROM_COLS_SCHEME,
  label: "车行/快递公司：",
  placeholder: "车行/快递公司",
  labelWidth: "108px",
};
const FROM_COLS_PROXY_TYPE = {
  span: 8,
  id: "proxyType",
  label: "订舱类型：",
  labelWidth: "66px",
  placeholder: "请选择订舱类型",
  type: "radio",
  basicType: "bookingAgentType",
  hideList: [2],
};
const FROM_COLS_PROXY = {
  span: 8,
  id: "cabinProxyId",
  label: "订舱代理：",
  placeholder: "请选择订舱代理",
  defaultKey: "id",
  ...httpEnterprisetSelect({ typeList: "0,3", isQueryFirstDept: 1 }),
  type: "slot",
  selectLabelKey: "cabinProxyName",
  labelWidth: "70px",
};
const FROM_COLS_INDUSTRY_PROXY = {
  span: 8,
  id: "sameIndustryProxyId",
  label: "同行代理：",
  placeholder: "请选择同行代理",
  defaultKey: "id",
  ...httpEnterprisetSelect({ typeList: "0,3" }),
  type: "slot",
  selectLabelKey: "sameIndustryProxyName",
  labelWidth: "70px",
};
const FROM_COLS_TIME = {
  span: 16,
  id: "pricePeriodValidity",
  label: "报价有效期：",
  labelWidth: "90px",
  startPlaceholder: "开始日期",
  endPlaceholder: "截止日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
  render: (row) => {
    const { startPricePeriodValidity, endPricePeriodValidity } = row;
    return startPricePeriodValidity && endPricePeriodValidity
      ? `${startPricePeriodValidity}~${endPricePeriodValidity}`
      : "--";
  },
};
const FROM_COLS_SAILING = {
  span: 5,
  id: "sailingSchedule",
  label: "航程：",
  placeholder: "航程",
  type: "inputNumber",
  labelWidth: "50px",
  maxNumber: 999,
};
const FROM_COLS_RECOMMEND = {
  span: 4,
  id: "recommend",
  label: "是否推荐：",
  type: "singleCheckbox",
  text: "推荐",
  labelWidth: "70px",
};
const FROM_COLS_REMARK = {
  span: 19,
  id: "remark",
  label: "备注：",
  type: "textarea",
  labelWidth: "65px",
  className: "scheme-remark",
  placeholder: "请输入备注",
  maxlength: 1000,
};
const overseasFormColumns = [
  FROM_COLS_SCHEME_1,
  { ...FROM_COLS_TIME, span: 10 },
  {
    ...FROM_COLS_SAILING,
    label: "时效：",
    placeholder: "时效",
  },
  { ...FROM_COLS_REMARK, span: 18 },
  FROM_COLS_RECOMMEND,
];
const bookingFormColumnsFCL = [
  FROM_COLS_SCHEME,
  FROM_COLS_PROXY,
  FROM_COLS_RECOMMEND,
  FROM_COLS_TIME,
  FROM_COLS_SAILING,
  FROM_COLS_REMARK,
];
const bookingFormColumnsLCL = (type) => [
  FROM_COLS_SCHEME,
  FROM_COLS_PROXY_TYPE,
  ...(type == 0 ? [FROM_COLS_PROXY] : [FROM_COLS_INDUSTRY_PROXY]),
  FROM_COLS_RECOMMEND,
  FROM_COLS_TIME,
  FROM_COLS_SAILING,
  FROM_COLS_REMARK,
];
export function quotationSchemeConfig(
  isEdit,
  isOverseasToDoor,
  packingMode,
  type = 0
) {
  let formColumns = [];
  if (isEdit) {
    formColumns = isOverseasToDoor
      ? overseasFormColumns
      : packingMode
      ? bookingFormColumnsLCL(type)
      : bookingFormColumnsFCL;
  } else {
    formColumns = [
      {
        ...(isOverseasToDoor
          ? { ...FROM_COLS_SCHEME_1, labelWidth: "98px" }
          : { ...FROM_COLS_SCHEME, labelWidth: "54px" }),
        id: "airShipCompanyName",
        type: "txt",
      },
      {
        ...FROM_COLS_TIME,
        type: "txt",
      },
      {
        ...FROM_COLS_SAILING,
        type: "txt",
      },
      {
        ...FROM_COLS_RECOMMEND,
        disabled: true,
      },
    ];
  }
  console.log(formColumns);
  return {
    lists: [
      {
        className: "search-form-width",
        fieldList: [
          {
            rows: [
              {
                cols: formColumns,
              },
            ],
          },
        ],
      },
    ], // 表单渲染列表
    formRules: isEdit
      ? {
          airShipCompany: [
            {
              required: true,
              message: `请选择${isOverseasToDoor ? "车行/快递公司" : "船公司"}`,
              trigger: "change",
            },
          ],
          pricePeriodValidity: [
            { required: true, message: "请选择报价有效期", trigger: "change" },
          ],
          sailingSchedule: [
            {
              required: true,
              message: `请输入${isOverseasToDoor ? "时效" : "航程"}`,
              trigger: "blur",
            },
          ],
        }
      : {}, // 表单校验规则
  };
}

const FROM_COLS_1 = {
  span: 6,
  id: "routeCode",
  label: "航次编码：",
  type: "txt",
};
const FROM_COLS_2 = {
  span: 6,
  id: "startPortName",
  label: "起运港：",
  type: "txt",
};
const FROM_COLS_3 = {
  span: 6,
  id: "shipCompany",
  label: "船公司：",
  type: "txt",
};
const FROM_COLS_4 = {
  span: 6,
  id: "cabinProxyName",
  label: "订舱代理：",
  labelWidth: "91px",
  type: "txt",
};
const FROM_COLS_4_1 = {
  span: 6,
  id: "sameIndustryProxyName",
  label: "同行代理：",
  labelWidth: "91px",
  type: "txt",
};
const FROM_COLS_5 = {
  span: 6,
  id: "flightName",
  label: "船名：",
  type: "txt",
};
const FROM_COLS_6 = {
  span: 6,
  id: "endPortName",
  label: "目的港：",
  type: "txt",
};
const FROM_COLS_7 = {
  span: 6,
  id: "sailOpenTime",
  label: "开航日期：",
  type: "txt",
};
const FROM_COLS_8 = {
  span: 6,
  id: "cutGateTime",
  label: "截关日期：",
  labelWidth: "91px",
  type: "txt",
};
const FROM_COLS_9 = {
  span: 6,
  id: "routeName",
  label: "船次：",
  type: "txt",
};
const FROM_COLS_10 = {
  span: 6,
  id: "transferName",
  label: "中转港：",
  type: "txt",
};
const FROM_COLS_11 = {
  span: 6,
  id: "cabinOpenTime",
  label: "开舱日期：",
  type: "txt",
};
const FROM_COLS_12 = {
  span: 6,
  id: "etaTime",
  label: "预计到达时间：",
  labelWidth: "91px",
  type: "txt",
};

export const fromConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FROM_COLS_1,
                FROM_COLS_2,
                FROM_COLS_3,
                FROM_COLS_4,
                FROM_COLS_5,
                FROM_COLS_6,
                FROM_COLS_7,
                FROM_COLS_8,
                FROM_COLS_9,
                FROM_COLS_10,
                FROM_COLS_11,
                FROM_COLS_12,
              ],
            },
          ],
        },
      ],
    },
  ], // 表单渲染列表
  formRules: {}, // 表单校验规则
};

const TABLE_COLS_SPACE = {
  width: 42,
  render: () => "",
};
const TABLE_COLS_1 = {
  label: "费用名称",
  prop: "costId",
  minWidth: 100,
  showOverflowTooltip: true,
  isEdit: true,
  request: true,
  // message: "请选择费用名称",
  fieldItem: {
    id: "costId",
    size: "mini",
    selectLabelKey: "costName",
    ...httpCostTypeSelect(),
    getCustomData: (item) => {
      return {
        label: item.cnName,
        value: item.id,
        title: `${item.costCode}/${item.cnName}`,
        subtitle: item.desc,
      };
    },
  },
  render: (row) => row.costName || "--",
};
const TABLE_COLS_2 = {
  label: "价格",
  prop: "unitPrice",
  minWidth: 160,
  showOverflowTooltip: true,
  isEdit: true,
  align: "right",
  request: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 2,
    maxNumber: 9999999999.99,
    min: -99999999.99,
  },
};
const TABLE_COLS_3 = {
  label: "数量",
  prop: "num",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  isEdit: true,
  request: true,
  fieldItem: {
    type: "inputNumber",
    decimal: 0,
    maxNumber: 99999999,
  },
};
const TABLE_COLS_4 = {
  label: "金额",
  prop: "amount",
  minWidth: 160,
  showOverflowTooltip: true,
  align: "right",
  customRow: true,
  decimal: 2,
};
const TABLE_COLS_5 = {
  label: "币别",
  prop: "currencyId",
  minWidth: 100,
  isEdit: true,
  request: true,
  // message: "请选择币别",
  fieldItem: {
    type: "autocomplete",
    category: "currency",
    selectLabelKey: "currencyName",
    isAutoInitRequest: true,
    defaultProp: {
      value: "id",
      label: "code",
    },
    getCustomData: (item) => {
      return {
        label: item.code,
        value: item.id,
        title: `${item.code}/${item.nameCn}`,
      };
    },
  },
  render: (row) => row.currencyName || "--",
};
const TABLE_COLS_6 = {
  label: "备注",
  prop: "remark",
  minWidth: 140,
  showOverflowTooltip: true,
  isEdit: true,
  fieldItem: {
    type: "text",
  },
};
const TABLE_COLS_7 = {
  label: "柜型",
  prop: "cabinetId",
  minWidth: 100,
  customRow: true,
  // isEdit: true,
  request: true,
  fieldItem: {
    ...httpCabinetTypeSelect,
    selectLabelKey: "cabinetName",
  },
  render: (row) => row.cabinetName || "--",
};
const TABLE_COLS_8 = {
  label: "计费方式",
  prop: "pricingType",
  minWidth: 100,
  isEdit: true,
  request: true,
  fieldItem: {
    type: "select",
    basicType: "pricingType",
  },
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 80,
  columnOperation: true,
  showOverflowTooltip: true,
  fixed: "right",
};

const tableColumns = (isFcl, isOverseasToDoor, customRow = true) => [
  TABLE_COLS_SPACE,
  TABLE_COLS_1,
  ...(isFcl && !isOverseasToDoor ? [TABLE_COLS_7] : []),
  {
    ...TABLE_COLS_2,
    customRow, // 区分编辑与查看
  },
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
];

export function handleColumns(isEdit, isFcl, isOverseasToDoor) {
  let column = [];
  const formRule = {};
  if (isEdit) {
    column = [
      ...tableColumns(isFcl, isOverseasToDoor, false),
      TABLE_COLS_OPERATION,
    ];
    column.forEach((item) => {
      if (item.request) {
        formRule[item.prop] = item.message || `${item.label}不能为空！`;
      }
    });
  } else {
    tableColumns(isFcl, isOverseasToDoor).forEach((item) => {
      const { isEdit, fieldItem, request, ...data } = item;
      column.push({
        ...data,
      });
    });
    column.push({
      ...TABLE_COLS_OPERATION,
      label: "",
    });
  }
  return { column, formRule };
}

export function handleRule(params, formRule) {
  for (let key in formRule) {
    // console.log(key);
    // && params[key] !== 0
    if (!params[key]) {
      return formRule[key];
    }
  }
  return false;
}

const ROUTE_COLS_1 = {
  id: "routeCode",
  label: "航次编码：",
  type: "txt",
};
const ROUTE_COLS_2 = {
  id: "airShipCompanyName",
  label: "船公司：",
  type: "txt",
};
const ROUTE_COLS_3 = {
  id: "sailingSchedule",
  label: "航程：",
  type: "txt",
};
const ROUTE_COLS_4 = {
  id: "cabinProxyName",
  label: "订舱代理：",
  type: "txt",
};
const ROUTE_COLS_4_1 = {
  id: "sameIndustryProxyName",
  label: "同行代理：",
  type: "txt",
};
const ROUTE_COLS_5 = {
  id: "pricePeriodValidity",
  label: "有效期：",
  type: "txt",
  render: (row) => {
    const { startPricePeriodValidity, endPricePeriodValidity } = row;
    return startPricePeriodValidity && endPricePeriodValidity
      ? `${startPricePeriodValidity}~${endPricePeriodValidity}`
      : "--";
  },
};
const ROUTE_COLS_6 = {
  id: "sailOpenTime",
  label: "开航日期：",
  type: "txt",
};
const ROUTE_COLS_7 = {
  id: "cutGateTime",
  label: "截关日期：",
  type: "txt",
};
const ROUTE_COLS_8 = {
  id: "cabinOpenTime",
  label: "开舱日期：",
  type: "txt",
};
const ROUTE_COLS_9 = {
  id: "recommend",
  label: "是否推荐：",
  type: "slot",
};
export const RouteConfig = (isOverseasToDoor, proxyType) => [
  [
    {
      ...ROUTE_COLS_2,
      ...(isOverseasToDoor ? { label: "车行/快递公司：" } : {}),
    },
    ...(isOverseasToDoor
      ? []
      : [proxyType == "1" ? ROUTE_COLS_4_1 : ROUTE_COLS_4]),
    ROUTE_COLS_3,
    ROUTE_COLS_5,
  ],
  [ROUTE_COLS_9],
];
export const RouteQuotationConfig = (isOverseasToDoor, sharePage) => [
  [
    // ROUTE_COLS_1,
    {
      ...ROUTE_COLS_2,
      ...(isOverseasToDoor ? { label: "车行/快递公司：" } : {}),
    },
    ROUTE_COLS_3,
    ...(sharePage ? [] : [ROUTE_COLS_4]),
    ROUTE_COLS_5,
    ROUTE_COLS_6,
  ],
  [ROUTE_COLS_7, ROUTE_COLS_8, ROUTE_COLS_9],
];
const ROUTE_COLS_10 = {
  id: "inquirySheetNumber",
  label: "询价编码：",
  type: "txt",
};
const ROUTE_COLS_11 = {
  id: "sailOpenTime",
  label: "ETD：",
  type: "txt",
};
const ROUTE_COLS_12 = {
  id: "etaTime",
  label: "ETA：",
  type: "txt",
};
export const RouteCopySchemeConfig = (isOverseasToDoor, proxyType) => [
  [
    ROUTE_COLS_10,
    {
      ...ROUTE_COLS_2,
      ...(isOverseasToDoor ? { label: "车行/快递公司：" } : {}),
    },
    ROUTE_COLS_3,
    ...(isOverseasToDoor
      ? [ROUTE_COLS_5]
      : [proxyType == "1" ? ROUTE_COLS_4_1 : ROUTE_COLS_4]),
  ],
  isOverseasToDoor
    ? [ROUTE_COLS_9]
    : [
        ROUTE_COLS_5,
        ROUTE_COLS_11,
        ROUTE_COLS_12,
        ROUTE_COLS_7,
        ROUTE_COLS_8,
        ROUTE_COLS_9,
      ],
];
