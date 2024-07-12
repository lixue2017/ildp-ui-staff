import {
  httpRouteSelect,
  httpEnterprisetSelect,
  httpPortPublicSelect,
  httpHaveAirFlightSelect,
  shipCompanyList,
} from "@/comModel/httpSelect";
const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};

const FORM_COLS_1 = {
  span: 9,
  id: "startPortIds",
  label: "起运港：",
  labelWidth: "66px",
  placeholder: "请选择起运港",
  multiple: true,
  collapseTags: true,
  ...httpPortPublicSelect(),
  type: "slot",
};
const FORM_COLS_2 = {
  span: 9,
  id: "endPortIds",
  label: "目的港：",
  labelWidth: "70px",
  placeholder: "请选择目的港",
  multiple: true,
  collapseTags: true,
  ...httpPortPublicSelect(),
  type: "slot",
};
const FORM_COLS_3 = (shippingMode) => ({
  span: 6,
  id: "packingMode",
  label: "装箱方式：",
  labelWidth: "90px",
  type: "radio",
  basicType: "freightType",
  disable: shippingMode == 1 ? false : true,
});
const FORM_COLS_4 = {
  span: 6,
  id: "routeNoManageId",
  label: "关联船名/航班名：",
  labelWidth: "111px",
  placeholder: "关联船名/航班名",
  isBackAll: true,
  ...httpHaveAirFlightSelect(),
  selectLabelKey: "routeNoManageCode",
  type: "slot",
};
const FORM_COLS_5 = {
  span: 6,
  id: "flightName",
  label: "船名/航班名：",
  placeholder: "船名/航班名",
  type: "text",
  maxlength: 100,
};
const FORM_COLS_6 = {
  span: 6,
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "船次/航次",
  type: "text",
  maxlength: 100,
};
const FORM_COLS_7 = {
  span: 6,
  id: "cabinProxyId",
  label: "订舱代理：",
  placeholder: "请选择订舱代理",
  ...httpEnterprisetSelect({ typeList: "0,3", isQueryFirstDept: 1 }),
  type: "slot",
  selectLabelKey: "cabinProxyCode",
};
const FORM_COLS_8 = {
  span: 6,
  id: "routeId",
  label: "航线信息：",
  placeholder: "请选择航线信息",
  ...httpRouteSelect(),
  selectLabelKey: "routeName",
};
const FORM_COLS_9 = {
  span: 6,
  id: "shipCompanyId",
  label: "航空/船公司：",
  placeholder: "请选择航空/船公司",
  ...shipCompanyList(),
  selectLabelKey: "shipCompanyName",
};
const FORM_COLS_10 = {
  span: 6,
  id: "cabinOpenTime",
  label: "开舱日期：",
  placeholder: "请选择开舱日期",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_11 = {
  span: 6,
  id: "sailOpenTime",
  label: "ETD：",
  placeholder: "请选择ETD",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_12 = {
  span: 6,
  id: "etaTime",
  label: "ETA：",
  placeholder: "请选择ETA",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_13 = {
  span: 6,
  id: "voyage",
  label: "航程：",
  placeholder: "请输入航程",
  type: "inputNumber",
  maxNumber: 999,
};
const FORM_COLS_14 = {
  span: 6,
  id: "cutGateTime",
  label: "截关日期：",
  placeholder: "请选择截关日期",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_15 = {
  span: 6,
  id: "effectiveTime",
  label: "有效期：",
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
    },
  },
};
const FORM_COLS_16 = {
  span: 6,
  id: "sameIndustryProxyId",
  label: "同行代理：",
  placeholder: "请选择同行代理",
  ...httpEnterprisetSelect({ typeList: "0,3" }),
  selectLabelKey: "sameIndustryProxyCode",
};
const FROM_COLS_17 = {
  span: 6,
  id: "proxyType",
  label: "订舱类型：",
  placeholder: "请选择订舱类型",
  type: "radio",
  basicType: "bookingAgentType",
  hideList: [2],
};
const formColumns = (shippingMode, packingMode, proxyType) => [
  ...(packingMode == 1
    ? [
        { ...FROM_COLS_17, disable: shippingMode == 1 },
        proxyType == "1" ? FORM_COLS_16 : FORM_COLS_7,
      ]
    : []),
  ...(packingMode != 1 ? [FORM_COLS_7, FORM_COLS_16] : []),
  FORM_COLS_5,
  FORM_COLS_6,
  FORM_COLS_8,
  FORM_COLS_9,
  FORM_COLS_10,
  FORM_COLS_11,
  FORM_COLS_12,
  FORM_COLS_13,
  FORM_COLS_14,
  FORM_COLS_15,
];

const formConfig = (shippingMode, packingMode, proxyType, routeNoManageId) => {
  let list = [...formColumns(shippingMode, packingMode, proxyType)];
  if (routeNoManageId) {
    list = list.map((item) => {
      if (["effectiveTime", "voyage"].includes(item.id)) {
        return item;
      }
      return {
        ...item,
        disable: true,
        disabled: true,
      };
    });
  }
  return {
    lists: [
      {
        fieldList: [
          {
            className: "border-bottom-solid",
            rows: [
              {
                cols: [FORM_COLS_1, FORM_COLS_2, FORM_COLS_3(shippingMode)],
              },
            ],
          },
          {
            title: "基本信息",
            rows: [
              {
                cols: [FORM_COLS_4],
              },
            ],
          },
          {
            className: "border-bottom-solid",
            rows: [
              {
                cols: list,
              },
            ],
          },
          {
            rows: [
              {
                cols: [
                  {
                    span: 24,
                    id: "tableDataSet",
                    labelWidth: "0",
                    type: "slot",
                  },
                ],
              },
            ],
          },
          {
            rows: [
              {
                cols: [
                  {
                    span: 24,
                    id: "tableDataCost",
                    labelWidth: "0",
                    type: "slot",
                    className: "table-data-cost",
                  },
                ],
              },
            ],
          },
          {
            rows: [
              {
                cols: [
                  {
                    span: 24,
                    labelWidth: "57px",
                    label: "备注说明",
                    type: "txt",
                    className: "custom-remark",
                  },
                  {
                    span: 24,
                    id: "remark",
                    labelWidth: "0px",
                    placeholder: "备注说明(最多200字)",
                    type: "textarea",
                    maxlength: 200,
                    rows: 3,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      startPortIds: [
        {
          required: true,
          message: "请选择起运港",
          trigger: "change",
        },
      ],
      endPortIds: [
        {
          required: true,
          message: "请选择目的港",
          trigger: "change",
        },
      ],
      packingMode: [
        {
          required: true,
          message: "请选择装箱方式",
          trigger: "change",
        },
      ],
      // routeNoManageId: [
      //   {
      //     required: true,
      //     message: "请选择船名/航班名",
      //     trigger: "change",
      //   },
      // ],
      flightName: [txtRules],
      voyageNumber: [txtRules],
      // voyageNumber: [
      //   {
      //     required: true,
      //     message: "请输入船次/航次",
      //     trigger: "change",
      //   },
      // ],
      // routeId: [
      //   {
      //     required: true,
      //     message: "请选择航线信息",
      //     trigger: "change",
      //   },
      // ],
      shipCompanyId: [
        {
          required: true,
          message: "请选择航空/船公司",
          trigger: "change",
        },
      ],
      sailOpenTime: [
        {
          required: true,
          message: "请选择ETD",
          trigger: "change",
        },
      ],
      etaTime: [
        {
          required: true,
          message: "请选择ETA",
          trigger: "change",
        },
      ],
      voyage: [
        {
          required: true,
          message: "请输入航程",
          trigger: "blur",
        },
      ],
      effectiveTime: [
        {
          required: true,
          message: "请选择有效期",
          trigger: "change",
        },
      ],
    },
  };
};
const FlightName = FORM_COLS_5,
  VoyageNumber = FORM_COLS_6,
  CabinProxyId = FORM_COLS_7,
  RouteId = FORM_COLS_8,
  CabinOpenTime = FORM_COLS_10,
  CutGateTime = FORM_COLS_14,
  SameIndustryProxyId = FORM_COLS_16;
export {
  FlightName, // 船名/航班名
  VoyageNumber, // 船次/航次
  CabinProxyId, // 订舱代理
  RouteId, // 航线信息
  CabinOpenTime, // 开舱日期
  CutGateTime, // 截关日期
  SameIndustryProxyId, // 同行代理
  formConfig,
};
