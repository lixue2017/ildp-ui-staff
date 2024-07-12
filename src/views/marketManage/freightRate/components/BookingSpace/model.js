import { httpWaitBooking, httpEnterprisetSelect } from "@/comModel/httpSelect";
import {
  FlightName, // 船名/航班名
  VoyageNumber, // 船次/航次
  RouteId, // 航线信息
  CabinOpenTime, // 开舱日期
  CutGateTime, // 截关日期
} from "@/views/marketManage/freightRate/edit/model.js";
const txtRules = {
  message: "此处不能输入中文",
  pattern: new RegExp(/^[^\u4e00-\u9fa5]*$/),
  trigger: "blur",
};
const FORM_COLS_1 = {
  span: 12,
  id: "orderId",
  label: "关联工作单号：",
  placeholder: "请选择工作单号",
  isBackAll: true,
  ...httpWaitBooking(),
  defaultProp: {
    value: "orderId",
    label: "operationOrderNum",
  },
  searchParamName: "operationOrderNum",
  type: "slot",
};
const FORM_COLS_2 = {
  span: 12,
  id: "bookingSpaceProxy",
  label: "订舱代理：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 12,
  id: "startPortCode",
  label: "起运港：",
  placeholder: "--",
  type: "text",
  disable: true,
};
const FORM_COLS_4 = {
  span: 12,
  id: "endPortCode",
  label: "目的港：",
  placeholder: "--",
  type: "text",
  disable: true,
};
const FORM_COLS_5 = {
  span: 12,
  id: "voyageType",
  label: "航次类型：",
  type: "radio",
  basicType: "voyageType",
  disable: true,
};
const FORM_COLS_6 = {
  span: 12,
  id: "routeNoManageCode",
  label: "关联航次：",
  placeholder: "--",
  type: "text",
  disable: true,
};
const FORM_COLS_7 = {
  span: 12,
  id: "sameIndustryProxyId",
  label: "同行代理：",
  placeholder: "请选择同行代理",
  ...httpEnterprisetSelect({ typeList: "0,3" }),
  selectLabelKey: "sameIndustryProxyCode",
};
const FORM_COLS_8 = {
  span: 12,
  id: "shipCompanyName",
  label: "航空/船公司：",
  type: "text",
  disable: true,
};
const FORM_COLS_9 = {
  span: 12,
  id: "startEffectiveTime",
  label: "有效期：",
  type: "txt",
  render: (row) =>
    row.startEffectiveTime && row.endEffectiveTime
      ? `${row.startEffectiveTime}~${row.endEffectiveTime}`
      : "--",
};
const FORM_COLS_10 = {
  span: 12,
  id: "voyage",
  label: "航程：",
  type: "text",
  disable: true,
};
const FORM_COLS_11 = {
  span: 12,
  id: "sailOpenTime",
  label: "ETD：",
  placeholder: "年/月/日",
  type: "text",
  disable: true,
};
const FORM_COLS_12 = {
  span: 12,
  id: "etaTime",
  label: "ETA：",
  placeholder: "年/月/日",
  type: "text",
  disable: true,
};
const FORM_COLS_13 = {
  span: 24,
  labelWidth: "57px",
  label: "备注说明",
  type: "txt",
  className: "custom-remark",
};
const FORM_COLS_14 = {
  span: 24,
  id: "remark",
  labelWidth: "0px",
  placeholder: "备注说明(最多200字)",
  type: "textarea",
  maxlength: 200,
  rows: 3,
};
// 已登记
const formColumnsR = (packingMode) => [
  {
    ...FORM_COLS_7,
    ...(packingMode == 1
      ? {
          disable: true,
          id: "sameIndustryProxy",
          type: "text",
          placeholder: "--",
        }
      : {}),
  },
  {
    span: 12,
    id: "space",
    type: "slot",
  },
  FORM_COLS_8,
  FORM_COLS_10,
  FORM_COLS_9,
  { ...FlightName, span: 12, disable: true },
  { ...VoyageNumber, span: 12, disable: true },
  { ...RouteId, span: 12, disabled: true },
  { ...FORM_COLS_11, disable: true },
  { ...FORM_COLS_12, disable: true },
  { ...CabinOpenTime, span: 12, disable: true },
  { ...CutGateTime, span: 12, disable: true },
];
// 新航次
const formColumnsN = (packingMode) => [
  {
    ...FORM_COLS_7,
    ...(packingMode == 1
      ? {
          disable: true,
          id: "sameIndustryProxy",
          type: "text",
          placeholder: "--",
        }
      : {}),
  },
  {
    span: 12,
    id: "space",
    type: "slot",
  },
  FORM_COLS_8,
  FORM_COLS_10,
  FORM_COLS_9,
  { ...FlightName, span: 12 },
  { ...VoyageNumber, span: 12 },
  { ...RouteId, span: 12 },
  FORM_COLS_11,
  FORM_COLS_12,
  { ...CabinOpenTime, span: 12 },
  { ...CutGateTime, span: 12 },
];
export const formConfig = (voyageType = 0, packingMode) => ({
  lists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                FORM_COLS_1,
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_6,
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols:
                voyageType == 0
                  ? formColumnsR(packingMode)
                  : formColumnsN(packingMode),
            },
          ],
        },
        {
          className: "margin-bottom-0",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "tableData",
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
              cols: [FORM_COLS_13, FORM_COLS_14],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    orderId: [
      {
        required: true,
        message: "请选择关联工作单号",
        trigger: "change",
      },
    ],
    cabinProxyId: [
      {
        required: true,
        message: "请选择订舱代理",
        trigger: "change",
      },
    ],
    // sameIndustryProxyId: [
    //   {
    //     required: true,
    //     message: "请选择同行代理",
    //     trigger: "change",
    //   },
    // ],
    flightName: [
      {
        required: true,
        message: "请选择船名/航班名",
        trigger: "change",
      },
      txtRules,
    ],
    voyageNumber: [
      {
        required: true,
        message: "请选择船次/航次",
        trigger: "change",
      },
      txtRules,
    ],
  },
});
