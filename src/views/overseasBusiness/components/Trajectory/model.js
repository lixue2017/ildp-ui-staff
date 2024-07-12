import { httpClearanceSend } from "@/comModel/httpSelect";
import {
  getClearanceSendCheckList,
  PostDistinctClearanceListCT,
} from "@/api/warehouse/prediction.js";
import overseaLangObj from "@/language/overseasLang.js";

const httpClearanceCheckSend = (obj) => {
  const { clearanceId } = obj;
  return {
    type: "autocomplete",
    httpRequest: (params) => {
      return getClearanceSendCheckList({
        ...params,
        clearanceId,
      });
    },
    defaultProp: {
      value: "operationId",
      label: "bsNo",
    },
  };
};

const FORM_COL_1 = {
  span: 24,
  id: "expectPortTime",
  placeholder: "日期",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};

// 预计离港、到港
export const formDlgCols = (obj) => {
  const { modelType = "ETA" } = obj || {};
  const title = modelType === "ETA" ? "预计到港" : "预计离港";
  return {
    title,
    width: "350px",
    labelWidth: "50px",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...FORM_COL_1,
                    label: `${modelType}：`,
                    placeholder: `${title}时间`,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      expectPortTime: [
        { required: true, message: `请选择${title}时间`, trigger: "change" },
      ],
    },
  };
};

// 清关查验
const FORM_COLS_1 = (row = {}) => {
  const { operationId, orderType, clearanceId } = row;
  // const WEB_httpRequest = [3, 4].includes(orderType)
  //   ? PostDistinctClearanceListCT
  //   : getClearanceSendCheckList;
  return {
    span: 24,
    id: "examine",
    label: "查验单号：",
    placeholder: "查验单号",
    ...([3, 4].includes(orderType)
      ? httpClearanceSend({
          operationId,
          WEB_httpRequest: PostDistinctClearanceListCT,
          WEB_value: "operationId",
        })
      : httpClearanceCheckSend({ clearanceId })),
    isBackAll: true,
    multiple: true,
    // disabledKey: "isCheck",
  };
};
const FORM_COLS_2 = {
  span: 24,
  id: "shipmentId",
  label: "查验shipment ID：",
  placeholder: "shipment ID",
  type: "text",
  maxlength: 50,
};
const FORM_COLS_3 = {
  span: 24,
  id: "registerTime",
  label: "查验登记时间：",
  placeholder: "查验登记时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_4 = {
  span: 24,
  id: "endCheckTime",
  label: "查验结束时间：",
  placeholder: "查验结束时间",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};
const FORM_COLS_5 = {
  span: 24,
  id: "remark",
  label: "备注说明：",
  placeholder: "备注说明",
  type: "textarea",
};
const FORM_COLS_6 = {
  span: 24,
  label: "查验状态：",
  id: "examineStatus",
  type: "select",
  basicType: "clearanceExamineStatus",
};

// 新增查验
export const examineFormConfig = (row) => {
  const { orderType, operationId, clearanceId } = row || {};
  return {
    title: "查验登记",
    width: "450px",
    labelWidth: "120px",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  ...(operationId
                    ? [FORM_COLS_1({ orderType, operationId, clearanceId })]
                    : []),
                  FORM_COLS_2,
                  FORM_COLS_6,
                  FORM_COLS_3,
                  FORM_COLS_4,
                  FORM_COLS_5,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      examine: [
        { required: true, message: "请选择查验单号", trigger: "change" },
      ],
      examineStatus: [
        { required: true, message: "请选择查验状态", trigger: "change" },
      ],
      registerTime: [
        { required: true, message: "请选择查验登记时间", trigger: "change" },
      ],
    },
  };
};

const FORM_COL_2 = {
  span: 24,
  id: "businessRemark",
  label: `${overseaLangObj.kh_xd_remark || "客户下单备注"}：`,
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
};
const FORM_COL_3 = {
  span: 24,
  id: "orderRemark",
  label: `${overseaLangObj.order_remark || "订单备注"}：`,
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
};
const FORM_COL_4 = {
  span: 24,
  id: "warehouseRemark",
  label: `${overseaLangObj.hw_rc_remark || "海外入仓备注"}：`,
  placeholder: "请输入",
  type: "textarea",
  rows: 5,
};

const FORM_COL_5 = {
  ...FORM_COL_2,
  id: "secondInstanceRemark",
  label: `${overseaLangObj.jj_bz || "交接备注"}：`,
};
const FORM_COL_6 = {
  ...FORM_COL_2,
  id: "boxRemark",
  label: `${overseaLangObj.yj_tcg_bz || "预计提拆柜备注"}：`,
};

export const formRemarksCols = (pageType) => [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COL_5,
              FORM_COL_6,
              ...(pageType === 3 ? [FORM_COL_4] : []),
            ],
          },
        ],
      },
    ],
  },
];

const OrderTrackBar = {
  name: overseaLangObj.gj_trajectory() || "状态栏",
  isTabShow: false,
  tabKey: "OrderTrackBar",
};

const remarkBar = {
  name: overseaLangObj.bz_remark() || "备注",
  tabKey: "remarkBar",
  isTabShow: false,
  className: "remarks-bar-length",
};

export const barTabObj = {
  1: [OrderTrackBar, remarkBar],
  2: [OrderTrackBar, remarkBar],
  3: [OrderTrackBar, remarkBar],
};
