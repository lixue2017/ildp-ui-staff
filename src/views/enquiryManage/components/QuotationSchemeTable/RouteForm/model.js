import {
  httpRouteSelect,
  httpEnterprisetSelect,
  httpHaveAirFlightSelect,
  shipCompanyList,
} from "@/comModel/httpSelect";
const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};
const FORM_COLS_1 = {
  span: 6,
  id: "routeNoManageId",
  label: "关联航次：",
  placeholder: "关联船名/航班名",
  isBackAll: true,
  ...httpHaveAirFlightSelect(),
  selectLabelKey: "routeNoManageName",
  type: "slot",
};
const FORM_COLS_2 = {
  span: 4,
  id: "recommend",
  label: "是否推荐：",
  type: "singleCheckbox",
  text: "推荐",
};
const FORM_COLS_3 = {
  span: 6,
  id: "airShipCompanyId",
  label: "航空/船公司：",
  placeholder: "请选择航空/船公司",
  ...shipCompanyList(),
  selectLabelKey: "airShipCompanyName",
};
const FORM_COLS_4 = {
  span: 6,
  id: "proxyType",
  label: "订舱类型：",
  placeholder: "请选择订舱类型",
  type: "radio",
  basicType: "bookingAgentType",
  hideList: [2],
};
const FORM_COLS_5 = {
  span: 6,
  id: "cabinProxyId",
  label: "订舱代理：",
  placeholder: "请选择订舱代理",
  ...httpEnterprisetSelect({ typeList: "0,3", isQueryFirstDept: 1 }),
  type: "slot",
  selectLabelKey: "cabinProxyName",
};
const FORM_COLS_6 = {
  span: 6,
  id: "sameIndustryProxyId",
  label: "同行代理：",
  placeholder: "请选择同行代理",
  ...httpEnterprisetSelect({ typeList: "0,3" }),
  selectLabelKey: "sameIndustryProxyName",
};
const FORM_COLS_7 = {
  span: 6,
  id: "flightName",
  label: "船名/航班名：",
  placeholder: "船名/航班名",
  type: "text",
  maxlength: 100,
};
const FORM_COLS_8 = {
  span: 6,
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "船次/航次",
  type: "text",
  maxlength: 100,
};
const FORM_COLS_9 = {
  span: 6,
  id: "pricePeriodValidity",
  label: "报价有效期：",
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
const FORM_COLS_10 = {
  span: 6,
  id: "sailingSchedule",
  label: "航程：",
  placeholder: "请输入航程",
  type: "inputNumber",
  maxNumber: 999,
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
  id: "cabinOpenTime",
  label: "开舱日期：",
  placeholder: "请选择开舱日期",
  type: "date",
  valueFormat: "yyyy-MM-dd",
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
  id: "routeId",
  label: "航线：",
  placeholder: "请选择航线",
  ...httpRouteSelect(),
  selectLabelKey: "routeCode",
};
const FORM_COLS_16 = {
  span: 24,
  id: "remark",
  label: "备注：",
  type: "textarea",
  className: "scheme-remark",
  placeholder:"请输入备注",
  maxlength:1000
};

const formColumns = ({ shippingMode, packingMode, proxyType }) => [
  FORM_COLS_3,
  ...(shippingMode == 2
    ? [FORM_COLS_4, ...(proxyType == 0 ? [FORM_COLS_5] : [FORM_COLS_6])]
    : packingMode == 0
    ? [FORM_COLS_5]
    : [FORM_COLS_6]),
  FORM_COLS_7,
  FORM_COLS_8,
  FORM_COLS_9,
  FORM_COLS_10,
  FORM_COLS_11,
  FORM_COLS_12,
  FORM_COLS_13,
  FORM_COLS_14,
  FORM_COLS_15,
  FORM_COLS_16,
];

export const formConfig = ({ routeNoManageId, ...obj }) => {
  let list = [...formColumns(obj)];
  if (routeNoManageId) {
    list = list.map((item) => {
      if (
        ["pricePeriodValidity", "sailingSchedule", "remark"].includes(item.id)
      ) {
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
            className: "first-row",
            rows: [
              {
                cols: [FORM_COLS_1, FORM_COLS_2],
              },
            ],
          },
          {
            rows: [
              {
                cols: list,
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      flightName: [txtRules],
      voyageNumber: [txtRules],
      airShipCompanyId: [
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
      sailingSchedule: [
        {
          required: true,
          message: "请输入航程",
          trigger: "blur",
        },
      ],
      pricePeriodValidity: [
        {
          required: true,
          message: "请选择有效期",
          trigger: "change",
        },
      ],
    },
  };
};

const DETAIL_COLS_1 = {
  span: 6,
  id: "routeNoManageCode",
  label: "航次编码：",
  type: "txt",
};
const DETAIL_COLS_2 = {
  span: 6,
  id: "airShipCompanyName",
  label: "船公司：",
  type: "txt",
};
const DETAIL_COLS_3_1 = {
  span: 6,
  id: "proxyType",
  label: "订舱类型：",
  placeholder: "请选择订舱类型",
  type: "txt",
  basicType: "bookingAgentType",
};
const DETAIL_COLS_3_2 = {
  span: 6,
  id: "cabinProxyName",
  label: "订舱代理：",
  type: "txt",
};
const DETAIL_COLS_3_3 = {
  span: 6,
  id: "sameIndustryProxyName",
  label: "同行代理：",
  type: "txt",
};
const DETAIL_COLS_4 = {
  span: 6,
  id: "cabinOpenTime",
  label: "开舱日期：",
  type: "txt",
};
const DETAIL_COLS_5 = {
  span: 6,
  id: "flightName",
  label: "船名：",
  type: "txt",
};
const DETAIL_COLS_6 = {
  span: 6,
  id: "sailOpenTime",
  label: "ETD：",
  type: "txt",
};
const DETAIL_COLS_7 = {
  span: 6,
  id: "etaTime",
  label: "ETA：",
  type: "txt",
};
const DETAIL_COLS_8 = {
  span: 6,
  id: "cutGateTime",
  label: "截关日期：",
  type: "txt",
};
const DETAIL_COLS_9 = {
  span: 6,
  id: "voyageNumber",
  label: "船次：",
  type: "txt",
};
const DETAIL_COLS_10 = {
  span: 6,
  id: "pricePeriodValidity",
  label: "报价有效期：",
  type: "txt",
  render: (row) =>
    row.pricePeriodValidity && Array.isArray(row.pricePeriodValidity)
      ? row.pricePeriodValidity.join("~")
      : "--",
};
const DETAIL_COLS_11 = {
  span: 6,
  id: "sailingSchedule",
  label: "航程：",
  type: "txt",
};
const DETAIL_COLS_12 = {
  span: 6,
  id: "routeCode",
  label: "航线：",
  type: "txt",
};
const DETAIL_COLS_13 = {
  span: 24,
  id: "remark",
  label: "备注：",
  type: "txt",
};
const detailColumns = ({ shippingMode, packingMode, proxyType, remark }) => [
  DETAIL_COLS_1,
  DETAIL_COLS_2,
  ...(shippingMode == 2
    ? [
        DETAIL_COLS_3_1,
        ...(proxyType == 0 ? [DETAIL_COLS_3_2] : [DETAIL_COLS_3_3]),
      ]
    : packingMode == 0
    ? [DETAIL_COLS_3_2]
    : [DETAIL_COLS_3_3]),
  DETAIL_COLS_4,
  DETAIL_COLS_5,
  DETAIL_COLS_6,
  DETAIL_COLS_7,
  DETAIL_COLS_8,
  DETAIL_COLS_9,
  DETAIL_COLS_10,
  DETAIL_COLS_11,
  DETAIL_COLS_12,
  ...(remark ? [DETAIL_COLS_13] : []),
];

export const detailFormConfig = (obj = {}) => ({
  lists: [
    {
      fieldList: [
        {
          className: "first-row",
          rows: [
            {
              cols: [
                {
                  span: 6,
                  id: "routeNoManageName",
                  labelWidth: "31px",
                  type: "txt",
                },
                { ...FORM_COLS_2, disabled: true },
              ],
            },
          ],
        },
        {
          className: "detail-row",
          rows: [
            {
              cols: detailColumns(obj),
            },
          ],
        },
      ],
    },
  ],
  formRules: {},
});
