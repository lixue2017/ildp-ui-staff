const COLS_1 = [
  {
    span: 12,
    id: "shipperName",
    label: "发货人",
    labelClassName: "item-label-title",
    labelWidth: "80px",
    placeholder: "请选择发货人",
    type: "slot",
    disable: true
  },
  {
    span: 6,
    id: "BLinfo",
    labelWidth: "0px",
    type: "slot",
  },
  {
    span: 6,
    id: "export",
    labelWidth: '20px',
    type: "slot",
  },
  {
    span: 12,
    id: "consigneeName",
    label: "收货人",
    labelClassName: "item-label-title",
    labelWidth: "80px",
    placeholder: "请选择收货人",
    type: "slot",
    disable: true
  },
  {
    span: 12,
    id: "notifierName",
    label: "通知人",
    labelClassName: "item-label-title",
    labelWidth: "80px",
    placeholder: "请选择通知人",
    type: "slot",
    disable: true
  },
]
const COLS_2 = [
  {
    span: 8,
    id: "shipName",
    label: "船名：",
    placeholder: "--",
    type: "txt"
  },
  {
    span: 8,
    id: "plName",
    label: "发货地：",
    placeholder: "--",
    type: "txt"
  },
  {
    span: 8,
    id: "polName",
    label: "装货地：",
    placeholder: "--",
    type: "txt"
  },
  {
    span: 8,
    id: "voy",
    label: "船次：",
    placeholder: "--",
    type: "txt"
  },
  {
    span: 8,
    id: "podName",
    label: "卸货港：",
    placeholder: "--",
    type: "txt"
  },
  {
    span: 8,
    id: "dapName",
    label: "交货地点：",
    placeholder: "--",
    type: "txt"
  },
]
const FORM_3_COL_1 = {
  span: 24,
  id: "goodsTable",
  labelWidth: "0",
  type: "slot",
}
const FORM_3_COL_2 = {
  span: 24,
  id: "tableData",
  labelWidth: "0",
  type: "slot",
}
const FORM_3_COL_3 = {
  span: 12,
  id: "maitou",
  label: "唛头：",
  placeholder: "--",
  type: "txt"
}
const FORM_3_COL_4 = {
  span: 12,
  id: "productName",
  label: "品名：",
  placeholder: "--",
  type: "txt"
}
const FORM_3_COL_X3 = {
  span: 24,
  id: "containerSno",
  label: "集装箱信息：",
  placeholder: "--",
  type: "txt"
}
const COLS_3 = [
  FORM_3_COL_1,
  FORM_3_COL_3,
  FORM_3_COL_4
]
const COLS_3_1 = [
  FORM_3_COL_1,
  // FORM_3_COL_2
]
export const configLists = (orderType = 0) => {
  // 订单类型  2-电商 其他都为传统
  return [
    {
      fieldList: [
        {
          className: 'border-top-solid',
          rows: [
            {
              cols: COLS_1
            },
          ],
        },
        {
          className: 'border-bottom-solid form-cols-2',
          rows: [
            {
              cols: COLS_2,
            },
          ],
        },
        {
          // className: 'border-bottom-solid',
          rows: [
            {
              cols: orderType == 2 ? [FORM_3_COL_1] : COLS_3,
            },
          ],
        },
        {
          className: 'endInfo',
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "transportationClauseName",
                  label: "运输条款：",
                  placeholder: "--",
                  type: "txt",
                },
                {
                  span: 12,
                  id: "tdisType",
                  label: "签发方式：",
                  placeholder: "--",
                  type: "radio",
                  basicType: "issuingMethod",
                  disable: true
                },
                {
                  span: 12,
                  id: "fsaName",
                  label: "海外代理：",
                  placeholder: "--",
                  type: "slot",
                  className: "fsa-custom"
                  // type: "txt",
                  // basicType: "clientIdentity",
                },
                {
                  span: 12,
                  id: "shipmentTime",
                  label: "装船日期：",
                  placeholder: "--",
                  type: "txt"
                },
                {
                  span: 12,
                  id: "payType",
                  label: "付款方式：",
                  placeholder: "--",
                  type: "radio",
                  basicType: "paymentType",
                  disable: true
                },
                {
                  span: 12,
                  id: "tdisId",
                  label: "签发地：",
                  placeholder: "--",
                  type: "txt",
                  // basicType: "clientIdentity",
                },
                {
                  span: 12,
                  id: "tdisTime",
                  label: "签发日期：",
                  placeholder: "--",
                  type: "txt"
                },
              ],
            },
          ],
        },
      ],
    }
  ]
}

export const grossTotal = [
  //prop需要与table中涉及计算的字段相同
  {
    label: '总数量：',
    prop: 'warehousingQuantity',
  },
  {
    label: '总毛重：',
    prop: 'warehousingTotalWeight',
    decimal: 2,
    util: "KG"
  },
  {
    label: '总体积：',
    prop: 'warehousingTotalVolume',
    decimal: 3,
    util: "CBM"
  }]
