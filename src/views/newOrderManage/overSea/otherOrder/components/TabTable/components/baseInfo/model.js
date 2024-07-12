import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";

const FORM_COLS_2_3 = {
  span: 6,
  id: "delivery_logisticsChannelId",
  label: "派送渠道：",
  type: "txt",
};

const FORM_COLS_2_4 = {
  span: 6,
  id: "delivery_referenceNumber",
  label: "参考号：",
  type: "txt",
};
const FORM_COLS_2_5 = {
  span: 6,
  id: "delivery_platformStore",
  label: "平台店铺：",
  type: "txt",
};

const FORM_COLS_2_6 = {
  span: 6,
  id: "delivery_amazonDeliveryNumber",
  label: "Shipment ID：",
  type: "txt",
};

const FORM_COLS_2_8 = {
  span: 6,
  id: "delivery_isInsure",
  type: "singleCheckbox",
  text: "保险服务",
  disabled: true,
};

const FORM_COLS_2_1 = {
  span: 24,
  id: "delivery_deliveryPlaceName",
  label: "发货地址：",
  type: "txt",
  txtTagArr: [
    {
      tagColor: "green", // 默认blue色
      basicType: "clearanceDeliveryPlaceType",
      basicTypeVal: "delivery_deliveryPlaceType",
    },
  ],
};

const FORM_COLS_2_2 = {
  span: 24,
  id: "delivery_deliveryPlaceAddress",
  label: "详情地址：",
  type: "txt",
};
const deliverFormColumns = [
  FORM_COLS_2_3, // 派送渠道
  FORM_COLS_2_4, // 参考号
  FORM_COLS_2_5, // 平台店铺
  FORM_COLS_2_8, // 保险服务
  FORM_COLS_2_6, // Shipment ID
  FORM_COLS_2_1, // 发货地址
  FORM_COLS_2_2, // 详情地址
];

const FORM_COLS_3_1 = {
  span: 6,
  id: "warehouse_warehouseName",
  label: "入库仓：",
  type: "txt",
};
const FORM_COLS_3_2 = {
  span: 6,
  id: "warehouse_warehousingTime",
  label: "预计入库日期：",
  type: "txt",
};
const FORM_COLS_3_3 = {
  span: 6,
  id: "warehouse_traceNumber",
  label: "跟踪号：",
  type: "txt",
};
const FORM_COLS_3_4 = {
  span: 6,
  id: "warehouse_referenceNumber",
  label: "参考编号：",
  type: "txt",
};
const FORM_COLS_3_5 = {
  span: 6,
  id: "warehouse_warehouseSourceName",
  label: "入库来源：",
  type: "txt",
};
const warehousingFormColumns = [
  FORM_COLS_3_1, // 入库仓
  FORM_COLS_3_2, // 预计入库日期
  FORM_COLS_3_3, // 跟踪号
  FORM_COLS_3_4, // 参考编号
  FORM_COLS_3_5, // 入库来源
];

const formList = (type) => {
  const fieldList = [];
  const typeObj = {
    2: deliverFormColumns,
    3: warehousingFormColumns,
  };
  if (type && typeObj[type]) {
    fieldList.push({
      className: "margin-top-14 margin-bottom-14 border-bottom-solid",
      rowClassName: [2,3].includes(type)?"form-rows-box":undefined,
      rows: [
        {
          cols: typeObj[type],
        },
      ],
    });
  }
  return fieldList;
};

export const config = (type, isEditRemark) => {
  return {
    lists: [
      {
        fieldList: [
          ...formList(type),
          {
            className: "border-bottom-solid",
            rowClassName: [2,3].includes(type)?undefined:'form-rows-box',
            rows: [
              {
                cols: [
                  {
                    ...contactsOperationAddress(),
                    label: "发货人",
                    labelWidth: "70px",
                    id: "cusConsigner_address",
                    txtObjKey: "cusConsigner",
                  },
                  {
                    ...contactsOperationAddress(12),
                    label: "收货人",
                    labelWidth: "70px",
                    id: "cusConsignee_address",
                    txtObjKey: "cusConsignee",
                  },
                  {
                    ...contactsOperationAddress(),
                    label: "通知人",
                    labelWidth: "70px",
                    id: "cusNotifier_address",
                    txtObjKey: "cusNotifier",
                  },
                ],
              },
            ],
          },
          {
            className: "border-bottom-solid",
            rows: [
              {
                cols: [
                  {
                    span: 24,
                    labelWidth: "58px",
                    label: "订单备注",
                    type: "slot",
                    className: "custom-remark",
                  },
                  {
                    span: 24,
                    id: "orderRemark",
                    labelWidth: "0px",
                    type: "txt",
                    textLineClamp: 5,
                    showMoreTextBtn: true,
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
                    labelWidth: "58px",
                    label: "业务备注",
                    type: "slot",
                    className: "custom-remark business-remark",
                  },
                  {
                    span: 24,
                    id: "businessRemark",
                    labelWidth: "0px",
                    ...(isEditRemark
                      ? {
                          placeholder: "请输入",
                          type: "textarea",
                          rows: 5,
                        }
                      : {
                          type: "txt",
                          textLineClamp: 5,
                          showMoreTextBtn: true,
                        }),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {},
  };
};
