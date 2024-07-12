import {
  httpPortPublicSelect,
  httpEnterprisetSelect,
  httpHaveAirFlightSelect,
  httpRouteSelect,
  shipCompanyList,
  httpAirFlightSelect,
} from "@/comModel/httpSelect.js";

const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};
const ContentShow = {
  //仅用于已有航次字段内容展示
  getCustomData: (item) => {
    const {
      flightName,
      name,
      code,
      startPortName,
      endPortName,
      lineTypeName,
      shipCompanyName,
    } = item;
    const title = `${flightName ? flightName : "--"}/${name ? name : "--"}/${
      code ? `(${code})` : "--"
    }`;
    const subtitle = `${startPortName ? startPortName : "--"}>${
      endPortName ? endPortName : "--"
    }/${lineTypeName ? lineTypeName : "--"}/${
      shipCompanyName ? shipCompanyName : "--"
    }`;
    return {
      key: item.id,
      label: title,
      subtitle,
      title,
      value: item.id,
    };
  },
};

const FORM_COLS_1 = {
  span: 12,
  id: "bookingSpaceProxy",
  label: "订舱代理：",
  placeholder: "--",
  type: "txt",
  txtTagArr: [
    {
      basicType: "orderType",
      basicTypeVal: "orderType",
    },
    {
      basicType: "operationOrderType",
      basicTypeVal: "operationOrderType",
    },
  ],
};

const FORM_COLS_2 = {
  span: 12,
  id: "salesman",
  label: "业务员：",
  placeholder: "--",
  type: "txt",
};

const FORM_COLS_3 = {
  span: 12,
  id: "startPortId",
  label: "起运港：",
  placeholder: "请选择起运港",
  ...httpPortPublicSelect(),
};

const FORM_COLS_4 = {
  span: 12,
  id: "endPortId",
  label: "目的港：",
  placeholder: "请选择目的港",
  ...httpPortPublicSelect(),
};

const FORM_COLS_5 = {
  span: 24,
  id: "name",
  label: "航次：",
  placeholder: "请选择航次",
  // isBackAll: true,
  currData:true,
  showCreate: true,
  ...httpHaveAirFlightSelect(),
  ...ContentShow,
  selectLabelKey: "flightName",
  // defaultKey:"id",
  isAutoInitRequest: false,
  type: "slot",
};

const FORM_COLS_6 = {
  span: 24,
  id: "sonoTable",
  labelWidth: "0",
  type: "slot",
};

const FORM_COLS_7 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
};

const FORM_COLS_8 = {
  span: 24,
  labelWidth: "60px",
  label: "备注说明",
  type: "txt",
  className: "custom-remark",
};

const FORM_COLS_9 = {
  span: 24,
  id: "remark",
  labelWidth: "0",
  placeholder: "备注说明",
  type: "textarea",
  rows: 3,
  maxlength: 200,
};

const FORM_COLS_10 = {
  span: 12,
  id: "voyageType",
  label: "航次类型：",
  type: "radio",
  basicType: "voyageType",
};

const FORM_COLS_11 = {
  span: 12,
  id: "flightName",
  label: "已有订舱：",
  isBackAll: true,
  placeholder: "请选择已有订舱",
  ...httpHaveAirFlightSelect(),
  ...ContentShow,
  type: "slot",
};
const FORM_COLS_12 = {
  span: 12,
  id: "destinationCountry",
  label: "目的国：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_13 = {
  span: 12,
  // id: "cabinProxyId",
  // label: "订舱代理：",
  // placeholder: "请选择订舱代理",
  type: "autocomplete",
  defaultKey: "id",
  ...httpEnterprisetSelect({ typeList: "0,3" }), //替换成公共接口，之前是单独接口传了一堆参数替换后不知道会不会有问题
};
const FORM_COLS_14 = {
  span: 12,
  id: "sono",
  label: "SO No.：",
  placeholder: "此处填写SO No.",
  type: "text",
};
const FORM_COLS_15 = {
  span: 12,
  id: "flightByName",
  label: "船名/航班名：",
  placeholder: "此处填写船名/航班名",
  type: "slot",
};
const FORM_COLS_16 = {
  span: 12,
  id: "shipCompany",
  label: "航空/船公司：",
  isBackAll: true,
  placeholder: "请选择航空/船公司",
  ...shipCompanyList(),
  selectLabelKey: "shipCompanyName",
  type: "slot",
};
const FORM_COLS_17 = {
  span: 12,
  id: "route",
  label: "航线信息：",
  placeholder: "请选择航线信息",
  isBackAll: true,
  defaultKey: "id",
  ...httpRouteSelect({ status: 1 }),
  selectLabelKey: "routeName",
  type: "slot",
};
const FORM_COLS_18 = {
  span: 12,
  id: "sailOpenTime",
  label: "开航期：",
  placeholder: "年/月/日",
  valueFormat: "yyyy-MM-dd",
  type: "slot",
};
const FORM_COLS_19 = {
  span: 12,
  id: "etaTime",
  label: "ETA：",
  placeholder: "年/月/日",
  valueFormat: "yyyy-MM-dd",
  type: "slot",
};
const FORM_COLS_20 = {
  span: 12,
  id: "cabinOpenTime",
  label: "开舱日期：",
  placeholder: "年/月/日",
  valueFormat: "yyyy-MM-dd",
  type: "slot",
};
const FORM_COLS_21 = {
  span: 12,
  id: "cutGateTime",
  label: "截关日期：",
  placeholder: "年/月/日",
  valueFormat: "yyyy-MM-dd",
  type: "slot",
};
const FORM_COLS_22 = {
  span: 24,
  id: "tips",
  type: "slot",
  labelWidth: "0",
};
const FORM_COLS_23 = {
  span: 12,
  id: "name",
  label: "船次/航次：",
  placeholder: "此处填写船次/航次",
  type: "slot",
};

const FORM_COLS_24 = {
  span: 12,
  id: "titleDes",
  type: "slot",
};
const fclConfig = (row = {}) => {
  const {
    startPortId,
    endPortId,
    operationOrderType,
    btnType,
    handlePort,
    freightType,
  } = row;
  const typeList = {
    0: 0,
    1: 3,
  }[operationOrderType];
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                {
                  ...FORM_COLS_3,
                  disabled: startPortId ? true : false,
                  ...httpPortPublicSelect(typeList),
                  handle: (val) => handlePort(val, freightType),
                },
                {
                  ...FORM_COLS_4,
                  disabled: endPortId ? true : false,
                  ...httpPortPublicSelect(typeList),
                  handle: (val) => handlePort(val, freightType),
                },
                FORM_COLS_5,
                FORM_COLS_24,
                FORM_COLS_6,
                ...(["register"].includes(btnType) ? [] : [FORM_COLS_7]),
                FORM_COLS_8,
                FORM_COLS_9,
              ],
            },
          ],
        },
      ],
    },
  ];
};

const lclConfig = (row = {}) => {
  const {
    startPortId,
    endPortId,
    operationOrderType,
    sameIndustryProxyId = undefined,
    handlePort,
    freightType,
  } = row;
  const typeList = {
    0: 0,
    1: 3,
  }[operationOrderType];
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_12,
                {
                  ...FORM_COLS_3,
                  disabled: startPortId ? true : false,
                  ...httpPortPublicSelect(typeList),
                  handle: (val) => handlePort(val, freightType),
                },
                {
                  ...FORM_COLS_4,
                  disabled: endPortId ? true : false,
                  ...httpPortPublicSelect(typeList),
                  handle: (val) => handlePort(val, freightType),
                },
                FORM_COLS_10,
                FORM_COLS_11,
                FORM_COLS_22,
              ],
            },
          ],
        },
        {
          // rowClassName: "border-top",
          rows: [
            {
              cols: [
                {
                  ...FORM_COLS_13,
                  id: "sameIndustryProxyId",
                  label: "同行代理：",
                  placeholder: "请选择同行代理",
                  disabled: sameIndustryProxyId ? true : false,
                  type: "slot",
                },
                FORM_COLS_14,
                FORM_COLS_15,
                FORM_COLS_23,
                FORM_COLS_16,
                FORM_COLS_17,
                FORM_COLS_18,
                FORM_COLS_19,
                FORM_COLS_20,
                FORM_COLS_21,
                FORM_COLS_7,
                FORM_COLS_8,
                FORM_COLS_9,
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const getConfig = (row = {}) => {
  const { freightType } = row;
  const lists = {
    0: fclConfig(row),
    1: lclConfig(row),
  };
  return lists[freightType];
};

export const getRules = (row = {}) => {
  const { freightType } = row;
  const lists = {
    0: {
      name: [{ required: true, message: "请选择航次", trigger: "change" }],
      startPortId: [
        { required: true, message: "请选择起运港", trigger: "change" },
      ],
      endPortId: [
        { required: true, message: "请选择目的港", trigger: "change" },
      ],
    },
    1: {
      sono: [{ required: true, message: "请输入SO No", trigger: "change" }],
      sailOpenTime: [
        { required: true, message: "请选择开航期", trigger: "change" },
      ],
      etaTime: [{ required: true, message: "请选择ETA", trigger: "change" }],
      startPortId: [
        { required: true, message: "请选择起运港", trigger: "change" },
      ],
      endPortId: [
        { required: true, message: "请选择目的港", trigger: "change" },
      ],
      flightByName: [
        {
          required: true,
          message: "请输入船名/航班名",
          trigger: "change",
        },
        txtRules,
      ],
      name: [
        {
          required: true,
          message: "请输入船次/航次",
          trigger: "change",
        },
        txtRules,
      ],
    },
  }[freightType];
  return lists;
};

//校验修改集合
export const formRulesLists = {
  flightName: [
    { required: true, message: "请选择已有订舱", trigger: "change" },
  ],
};
