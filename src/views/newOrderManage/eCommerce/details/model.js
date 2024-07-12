import {
  routeOrderInfo,
  sortBoxOrderInfo,
  FORM_ROW_401,
  FORM_ROW_501,
} from "@/views/newOrderManage/trandition/details/model.js";
import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";

export const eCommerceOrder = (row = {}) => {
  const { status } = row.detailData || {};
  const extraFrom = row.routeDataId ? routeOrderInfo() : [];
  const sortBoxFrom = row.sortBoxDataId
    ? sortBoxOrderInfo(row.routeDataId ? 5 : 3)
    : [];

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
                  span: 8,
                  label: "头程运输方式：",
                  id: "headTransportModeName",
                  type: "txt",
                },
                {
                  span: 8,
                  label: "尾程运输方式：",
                  id: "outWarehouseWayName",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "country",
                  label: "目的国：",
                  type: "txt",
                },
                {
                  span: 8,
                  label: "交货仓：",
                  id: "transactionWarehouseCode",
                  type: "txt",
                },
                {
                  span: 8,
                  label: "装运港：",
                  id: "startPortName",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "endPortName",
                  label: "目的港：",
                  type: "txt",
                },
                // {
                //   span: 8,
                //   id: "cusOrderNumber",
                //   label: "客户单号：",
                //   type: "txt",
                // },
                {
                  span: 8,
                  id: "putWarehouseTime",
                  label: "入仓时间：",
                  type: "txt",
                },
                {
                  span: 8,
                  id: "platform",
                  label: "平台：",
                  type: "txt",
                  basicType: "orderPlatform",
                },
                {
                  span: 8,
                  id: "insured",
                  label: "单独购买保险：",
                  type: "txt",
                  render: (r) => {
                    // if (r.insuredAmount || r.insuredAmount === 0) {
                    //   return `${r.insuredAmount}[${r.insuranceAmountCurrencyCode || '--'}]`;
                    // }
                    return r.insured ? "是" : "否";
                  },
                },
                {
                  span: 8,
                  id: "customsClearanceType",
                  label: "清关类型：",
                  type: "radio",
                  basicType: "customsClearanceType",
                  disable: true,
                },
                {
                  span: 8,
                  id: "currency",
                  label: "清关币别：",
                  type: "txt",
                },
                // {
                //   span: 8,
                //   id: "transactionWarehouseCode",
                //   label: "国内交货仓：",
                //   type: "txt",
                //   render: (r) =>
                //     `${r.transactionWarehouseCode || "--"}/${
                //       r.transactionWarehouseName || "--"
                //     }`,
                // },
              ],
            },
          ],
        },
        {
          rowClassName: "form-rows-box",
          rows: [
            {
              cols: [
                {
                  ...contactsOperationAddress(),
                  label: "发货人",
                  id: "cusConsigner_address",
                  txtObjKey: "cusConsigner",
                },
                {
                  ...contactsOperationAddress(12),
                  label: "收货人",
                  id: "cusConsignee_address",
                  txtObjKey: "cusConsignee",
                },
                {
                  ...contactsOperationAddress(),
                  label: "通知人",
                  id: "cusNotifier_address",
                  txtObjKey: "cusNotifier",
                },
              ],
            },
          ],
        },
        ...extraFrom,
        ...sortBoxFrom,
        FORM_ROW_401,
        FORM_ROW_501(status),
      ],
    },
  ];
};

const MODEL_COL_1 = {
  span: 6,
  id: "encasementWay",
  label: "装箱方式：",
  type: "slot",
  basicType: "freightType",
};
const MODEL_COL_2 = {
  span: 8,
  id: "operationOrderType",
  label: "运输方式：",
  type: "txt",
  render: (r) => {
    return `${["海运", "空运"][r.transportMode === 3 ? 1 : 0] || "--"}${
      ["出口", "进口"][r.orderBusinessType] || ""
    }`;
  },
};
const MODEL_COL_4 = {
  span: 6,
  id: "bookingSpaceProxyName",
  label: "订舱代理：",
  type: "txt",
};
const MODEL_COL_5 = {
  span: 6,
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
    type: "txt",
  };
};
const MODEL_COL_8 = {
  span: 6,
  id: "cabinProxyName",
  label: "海外代理：",
  type: "txt",
};
const MODEL_COL_9 = {
  span: 6,
  id: "operateMainName",
  label: "客户归属：",
  type: "txt",
};

const MODEL_COL_10 = {
  span: 6,
  id: "wholeCabinetSn",
  label: "国内登记号：",
  type: "txt",
};
const MODEL_COL_11 = {
  span: 6,
  id: "sono",
  label: "SO No.：",
  type: "txt",
};
const MODEL_COL_12 = {
  span: 6,
  id: "registerNo",
  label: "柜号：",
  type: "txt",
};
const MODEL_COL_13 = {
  span: 6,
  id: "shipName",
  label: "船名/船次：",
  type: "txt",
};
const MODEL_COL_14 = {
  span: 6,
  id: "flightNo",
  label: "航次：",
  type: "txt",
};
const MODEL_COL_15 = {
  span: 6,
  id: "customsClearanceType",
  label: "清关方式：",
  type: "txt",
  basicType: "customsClearanceType",
};
const MODEL_COL_16 = {
  span: 6,
  id: "cusOrderNumber",
  label: "客户单号：",
  type: "txt",
};
const MODEL_COL_17 = {
  span: 6,
  id: "productAttributeList",
  label: "产品属性：",
  type: "txt",
  basicType: "orderProductAttribute",
};
export const ecBasicCols = (row = {}) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                MODEL_COL_1,
                MODEL_COL_10,
                MODEL_COL_11,
                MODEL_COL_12,
                MODEL_COL_5,
                MODEL_COL_4,
                MODEL_COL_13,
                MODEL_COL_14,
                MODEL_COL_15,
                // MODEL_COL_6(row.operationOrderType),
                MODEL_COL_8,
                MODEL_COL_16,
                MODEL_COL_17,
              ],
            },
          ],
        },
      ],
    },
  ];
};
