import {
  FORM_COL_1, // 目的国
  FORM_COL_2, // 装箱方式
  FORM_COL_3, // 头程运输方式
  FORM_COL_4, // 尾程运输方式
  FORM_COL_5, // 装运港
  FORM_COL_6, // 目的港
  FORM_COL_7, // 平台
  FORM_COL_8, // 国内交货仓
  FORM_COL_9, // 入仓时间
  FORM_COL_10, // 单独购买保险
  FORM_COL_11, // 报关方式
  FORM_COL_12, // 清关方式
  FORM_COL_13, // 清关币别
  FORM_COL_14, // 柜量/柜型
  FORM_COL_15, // 柜型
  FORM_COL_16, // 客户单号
  FORM_COL_17, // 发货人
  FORM_COL_18, // 收货人
  FORM_COL_19, // 通知人
  FORM_COL_20, // 列表
  FORM_COL_21, // 附件
  FORM_COL_22, // 备注
  getFormRule, // 必填项校验
} from "../components/comModel.js";

export const config = {
  lists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                FORM_COL_11, // 报关方式
                FORM_COL_12, // 清关方式
                FORM_COL_13, // 清关币别
                FORM_COL_5, // 装运港
                FORM_COL_6, // 目的港
                FORM_COL_10, // 单独购买保险
                FORM_COL_8, // 国内交货仓
                FORM_COL_9, // 入仓时间
                FORM_COL_7, // 平台
                FORM_COL_16, // 客户单号
              ],
            },
          ],
        },
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                FORM_COL_18, // 收货人
              ],
            },
          ],
        },
        {
          className: "border-bottom-solid margin-bottom-0",
          rows: [
            {
              cols: [
                FORM_COL_17, // 发货人
                FORM_COL_19, // 通知人
              ],
            },
          ],
        },
        {
          className: "margin-bottom-0",
          rows: [
            {
              cols: [
                { ...FORM_COL_20, className: "margin-bottom-0" }, // 列表
              ],
            },
          ],
        },
        {
          rows: FORM_COL_22(),
        },
      ],
    },
  ],
  lclFormRules: getFormRule([
    "reportCustomsWay",
    "customsClearanceType",
    "reportCurrencyId",
    "putWarehouseTime",
    "transactionWarehouse",
    "consigneeId",
    "consignerId",
  ]),
  fclFormRules: getFormRule([
    "reportCustomsWay",
    "customsClearanceType",
    "reportCurrencyId",
    "startPort",
    "endPort",
    "consigneeId",
    "consignerId",
  ]),
};
