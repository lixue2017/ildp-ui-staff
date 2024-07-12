import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";
import { render } from "nprogress";

// 电商头程订单与操作单详情有引用
export const routeOrderInfo = (obj = {}) => {
  const ROUTE_COL_201 = {
    span: 8,
    id: "cabinOpenTime",
    label: "开舱日期：",
    type: "txt",
  };
  const ROUTE_COL_202 = {
    span: 7,
    id: "cutGateTime",
    label: "截关日期：",
    type: "txt",
  };
  const ROUTE_COL_203 = {
    span: 7,
    id: "sailOpenTime",
    label: "开航期：",
    type: "txt",
  };
  const ROUTE_COL_204 = {
    span: 7,
    id: "sono",
    label: "主单号：",
    type: "txt",
  };
  const ROUTE_COL_205 = {
    span: 7,
    id: "web_route_hblNo",
    label: "分单号：",
    placeholder: "请输入",
    type: "text",
    maxlength: "500",
  };
  const ROUTE_COL_206 = {
    span: 8,
    id: "routeOrderCodeName",
    label: "航线组：",
    type: "txt",
  };
  const ROUTE_COL_207 = {
    span: 7,
    id: "routeCode",
    label: "航线信息：",
    type: "txt",
  };
  const ROUTE_COL_208 = {
    span: 7,
    id: "sono",
    label: "SO No.：",
    type: "txt",
  };
  const ROUTE_COLS_HY_0 = [
    // 海运
    ROUTE_COL_201,
    ROUTE_COL_202,
    ROUTE_COL_203,
    ROUTE_COL_206,
    ROUTE_COL_207,
    ROUTE_COL_208,
  ];
  const ROUTE_COLS_KY_1 = [
    // 空运操作单
    {
      ...ROUTE_COL_203,
      span: 8,
    },
    ROUTE_COL_204,
    ROUTE_COL_205,
  ];
  return [
    {
      title: "航次信息",
      titleClass: "-1",
      rowClassName: "form-rows-expansion-top",
      rows: [
        {
          colsObjKey: "routeResData",
          cols: [
            {
              span: 8,
              id: "shipCompanyName",
              label: "船公司：",
              type: "txt",
            },
            {
              span: 7,
              id: "startPortName",
              label: "起运港：",
              type: "txt",
            },
            {
              span: 7,
              id: "flightName",
              label: "船名：",
              type: "txt",
            },
            {
              span: 8,
              id: "code",
              label: "航次编码：",
              type: obj?.showType || "txt",
            },
            {
              span: 7,
              id: "endPortName",
              label: "目的港：",
              type: "txt",
            },
            {
              span: 7,
              id: "name",
              label: "船次：",
              type: "txt",
            },
            {
              span: 2,
              id: "expansion",
              label: "",
              labelWidth: "0",
              type: "slot",
              expansion: true,
              changeIndex: 3,
            },
          ],
        },
      ],
    },
    {
      rowClassName: "form-rows-bottom-border",
      className: "expansion-show",
      rows: [
        {
          colsObjKey: "routeResData",
          cols: [
            ...(obj.operationOrderType === 1
              ? ROUTE_COLS_KY_1
              : ROUTE_COLS_HY_0),
            {
              span: 24,
              id: "remark",
              label: "备注：",
              type: "txt",
            },
            {
              span: 24,
              id: "attachId_x",
              attachIdKeyName: "attachId_x",
              attachListKeyName: "routeOrderAttachList",
              label: "订舱资料：",
              type: "customUploadFile",
              disable: true,
              detailDisplay: true,
            },
          ],
        },
      ],
    },
  ];
};

// 电商头程/订单与操作单详情有引用
export const sortBoxOrderInfo = (changeIndex = 5, obj = {}) => {
  return [
    {
      title: "排柜信息",
      rowClassName: "form-rows-expansion-top",
      titleClass: "-1",
      rows: [
        {
          colsObjKey: "sortBoxResData",
          cols: [
            {
              span: 8,
              id: "code",
              label: "系统批次号：",
              type: "txt",
            },
            {
              span: 7,
              id: "weight",
              label: "总重量：",
              type: "txt",
              colUnit: "KG",
            },
            {
              span: 7,
              id: "boxModelCode",
              label: "柜型：",
              type: "txt",
            },
            {
              span: 8,
              id: "registerNo",
              label: " 整柜参考号：",
              type: obj?.showType || "txt",
            },
            {
              span: 7,
              id: "volume",
              label: "总体积：",
              type: "txt",
              decimal: 2,
              colUnit: "CBM",
            },
            {
              span: 7,
              id: "createBy",
              label: "创建人：",
              type: "txt",
            },
            {
              span: 2,
              id: "expansion",
              label: "",
              labelWidth: "0",
              type: "slot",
              expansion: true,
              changeIndex, // 需要显示隐藏的下标
            },
          ],
        },
      ],
    },
    {
      rowClassName: "form-rows-bottom-border",
      className: "expansion-show",
      rows: [
        {
          colsObjKey: "sortBoxResData",
          cols: [
            {
              span: 8,
              id: "createTime",
              label: "创建时间：",
              type: "txt",
            },
            {
              span: 24,
              id: "remark",
              label: "备注信息：",
              type: "txt",
            },
          ],
        },
      ],
    },
  ];
};

const FORM_ROW_SEE_REMARK = {
  span: 24,
  id: "remark",
  labelWidth: "0px",
  type: "txt",
  textLineClamp: 5,
  showMoreTextBtn: true,
};

// 电商头程详情有引用
export const FORM_ROW_401 = {
  rowClassName: "form-rows-remark-box form-rows-bottom-border",
  rows: [
    {
      cols: [
        {
          span: 24,
          labelWidth: "57px",
          label: "订单备注",
          type: "txt",
          className: "custom-remark",
        },
        {
          ...FORM_ROW_SEE_REMARK,
          // placeholder: "--",
          // type: "textarea",
          // disable: true,
          // maxlength: 2000,
          // rows: 5
        },
      ],
    },
  ],
};

// 电商头程详情有引用
export const FORM_ROW_501 = (orderStatus) => {
  const FORM_ROW_EDIT_REMARK = {
    span: 24,
    labelWidth: "0px",
    placeholder: "请输入",
    type: "textarea",
    maxlength: 2000,
    rows: 5,
  };
  return {
    rowClassName: "form-rows-remark-box",
    rows: [
      {
        cols: [
          {
            span: 24,
            labelWidth: "57px",
            label: "业务备注",
            type: "txt",
            className: "custom-remark",
          },
          {
            ...(orderStatus == 10 ? FORM_ROW_EDIT_REMARK : FORM_ROW_SEE_REMARK),
            id: "businessRemark",
          },
        ],
      },
    ],
  };
};

const contactsTraditionalOrderCols = () => {
  return {
    rowClassName: "form-rows-box",
    rows: [
      {
        cols: [
          {
            ...contactsOperationAddress(),
            label: "发货人",
            id: "shipper_address",
            txtObjKey: "shipper",
          },
          {
            ...contactsOperationAddress(12),
            label: "收货人",
            id: "consignee_address",
            txtObjKey: "consignee",
          },
          {
            ...contactsOperationAddress(),
            label: "通知人",
            id: "notifier_address",
            txtObjKey: "notifier",
          },
        ],
      },
    ],
  };
};

const FORM_TXT_COL_1 = {
  span: 8,
  id: "transportMode",
  label: "运输方式：",
  type: "radio",
  disable: true,
  basicType: "transportMode",
  hideList: [3, 4],
};
const FORM_TXT_COL_2 = {
  span: 8,
  id: "orderBusinessType",
  label: "业务类型：",
  type: "radio",
  disable: true,
  options: [
    { value: "0", label: "出口" },
    { value: "1", label: "进口" },
  ],
};
const FORM_TXT_COL_4 = {
  span: 8,
  id: "countryName",
  label: "目的国：",
  type: "txt",
};
const FORM_TXT_COL_5 = {
  span: 8,
  id: "portOfLoading",
  label: "装运港：",
  type: "txt",
};
const FORM_TXT_COL_6 = {
  span: 8,
  id: "destinationPort",
  label: "目的港：",
  type: "txt",
};
// const FORM_TXT_COL_7 = {
// 	span: 8,
// 	id: "insuranceAmount",
// 	label: "投保金额：",
// 	placeholder: "--",
// 	type: "txt",
// 	render: (rows) => {
// 		if (rows.insuranceAmount) {
// 			return `${rows.insuranceAmount}[${rows.insuranceAmountCurrencyName}]`
// 		}
// 	}
// }
const FORM_TXT_COL_8 = {
  span: 8,
  id: "insured",
  label: "单独购买保险：",
  type: "txt",
  render: (r) => (r.insured ? "是" : "否"),
};
const FORM_TXT_COL_9 = {
  span: 8,
  id: "declareCurrencyName",
  label: "清关币别：",
  type: "txt",
};
const FORM_TXT_COL_10 = {
  span: 8,
  id: "customsClearanceType",
  label: "清关类型：",
  type: "radio",
  basicType: "customsClearanceType",
  disable: true,
};
const FORM_TXT_COL_11 = {
  span: 8,
  id: "customerOrderSn",
  label: "客户单号：",
  type: "txt",
};
const FORM_TXT_COL_12 = {
  span: 8,
  id: "startCountryName",
  label: "起运国：",
  type: "txt",
};

export const seaOrder = (row = {}) => {
  //海运订单
  return [
    {
      fieldList: [
        {
          rowClassName: "form-rows-box",
          titleClass: "-1",
          title: "基本信息",
          rows: [
            {
              cols: [
                FORM_TXT_COL_1, // 运输方式
                FORM_TXT_COL_2, // 业务类型
                FORM_TXT_COL_8, // 单独购买保险
                // FORM_TXT_COL_4, // 目的国
                FORM_TXT_COL_10, // 清关类型
                FORM_TXT_COL_9, // 清关币别
                FORM_TXT_COL_11, // 客户单号
              ],
            },
          ],
        },
        contactsTraditionalOrderCols(),
        ...(row.routeDataId ? routeOrderInfo() : []), // 航次信息
        FORM_ROW_401,
        FORM_ROW_501(row.orderStatus),
      ],
    },
  ];
};

export const airOrder = (row = {}) => {
  //空运订单
  return [
    {
      fieldList: [
        {
          rowClassName: "form-rows-box",
          titleClass: "-1",
          title: "基本信息",
          rows: [
            {
              cols: [
                {
                  ...FORM_TXT_COL_1, // 运输方式
                  hideList: [0, 1, 2],
                },
                FORM_TXT_COL_2, // 业务类型
                FORM_TXT_COL_8, // 单独购买保险
                FORM_TXT_COL_10, // 清关类型
                FORM_TXT_COL_9, // 清关币别
                FORM_TXT_COL_11, // 客户单号
              ],
            },
          ],
        },
        contactsTraditionalOrderCols(),
        ...(row.routeDataId ? routeOrderInfo() : []), // 航次信息
        FORM_ROW_401,
        FORM_ROW_501(row.orderStatus),
      ],
    },
  ];
};

export const draftOrder = (oStatus) => {
  // 拖车
  return [
    {
      fieldList: [
        contactsTraditionalOrderCols(),
        FORM_ROW_401,
        FORM_ROW_501(oStatus),
      ],
    },
  ];
};

export const certificateOrder = (oStatus) => {
  // 报关出证
  return [
    {
      fieldList: [
        contactsTraditionalOrderCols(),
        FORM_ROW_401,
        FORM_ROW_501(oStatus),
      ],
    },
  ];
};

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
    return `${["海运", "空运"][r.orderType - 3]}${
      ["出口", "进口"][r.orderBusinessType]
    }`;
  },
};
const MODEL_COL_4 = {
  span: 8,
  id: "bookingSpaceProxyName",
  label: "订舱代理：",
  type: "txt",
};
const MODEL_COL_6 = {
  span: 8,
  id: "shipCompanyName",
  label: "船/航空公司：",
  type: "txt",
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
  id: "operateMainName",
  label: "客户归属：",
  type: "txt",
};
const MODEL_COL_10 = {
  span: 6,
  id: "flightName",
  label: "船名/航班：",
  type: "txt",
};
const MODEL_COL_11 = {
  span: 6,
  id: "name",
  label: "航次：",
  type: "txt",
};
const MODEL_COL_12 = {
  span: 6,
  id: "sono",
  label: "SO No.：",
  type: "txt",
};
const MODEL_COL_13 = {
  span: 6,
  id: "registerNo",
  label: "柜号：",
  type: "txt",
};
const MODEL_COL_14 = {
  span: 6,
  id: "customsDeclarationType",
  label: "报关方式：",
  type: "txt",
};
export const headCols = () => {
  // 海运、空运头部模板
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                { ...MODEL_COL_2, span: 6 },
                { ...MODEL_COL_1, span: 6 },
                { ...MODEL_COL_7, span: 6 },
                { ...FORM_TXT_COL_11, span: 6 },
                MODEL_COL_10,
                MODEL_COL_11,
                MODEL_COL_12,
                MODEL_COL_13,
                { ...MODEL_COL_6, span: 6 },
                MODEL_COL_14,
                { ...MODEL_COL_4, span: 6 },
                { ...MODEL_COL_8, span: 6 },
              ],
            },
          ],
        },
      ],
    },
  ];
};
export const seaHeadCols = () => {
  // 海运、空运头部模板
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                MODEL_COL_9,
                FORM_TXT_COL_4,
                MODEL_COL_1,
                // MODEL_COL_2,
                MODEL_COL_4,
                // MODEL_COL_7,
                MODEL_COL_6,
                MODEL_COL_8,
              ],
            },
          ],
        },
      ],
    },
  ];
};
export const airHeadCols = (transportMode) => {
  // 空运头部模板
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                MODEL_COL_9,
                ...(transportMode == 3 ? [FORM_TXT_COL_12] : [FORM_TXT_COL_5]), // 起运国/装运港
                MODEL_COL_1,
                MODEL_COL_4,
                ...(transportMode == 3 ? [FORM_TXT_COL_4] : [FORM_TXT_COL_6]), // 目的国/目的港
                MODEL_COL_6,
                MODEL_COL_8,
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const otherHeadCols = () => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                MODEL_COL_9,
                MODEL_COL_1,
                {
                  span: 8,
                  id: "orderBusinessType",
                  label: "业务类型：",
                  type: "txt",
                  basicType: "orderBusinessType",
                },
                {
                  span: 8,
                  id: "customsDeclarationType",
                  label: "报关方式：",
                  type: "txt",
                  basicType: "customsDeclarationType",
                },
                FORM_TXT_COL_11, // 客户单号
                FORM_TXT_COL_9, // 清关币别
                {
                  span: 8,
                  id: "insureNo",
                  label: "保险单号：",
                  type: "txt",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};
