export const cardConfig = [
  {
    labelColor: "#80B1FF",
    color: "#5094FF",
    bgColor: "#ECF3FF",
    icon: "yunshu1",
    list: [
      {
        prop: "jobNo",
      },
      {
        prop: "countryName",
        label: "目的国：",
        labelWidth: "48px",
      },
    ],
  },
  {
    labelColor: "#FF985C",
    color: "#FF813D",
    bgColor: "#FFF3EC",
    labelWidth: "62px",
    list: [
      {
        prop: "logisticsChannelName",
        label: "派送渠道：",
      },
      {
        prop: "referenceNumber",
        label: "参考号：",
      },
    ],
  },
  {
    labelColor: "#B1B1FF",
    color: "#7676FF",
    bgColor: "#ECECFF",
    labelWidth: "38px",
    list: [
      {
        labelWidth: "auto",
        label: "合计应收/应付(RMB)",
      },
      {
        prop: "totalReceiveRMB",
        label: "应收：",
        type: "formatMoney",
        decimals: 2,
      },
      {
        prop: "totalPayRMB",
        label: "应付：",
        type: "formatMoney",
        decimals: 2,
      },
    ],
  },
  {
    labelColor: "#64CFFF",
    color: "#13B5FF",
    bgColor: "#D2F1FF",
    labelWidth: "38px",
    list: [
      {
        labelWidth: "auto",
        label: "合计实收/实付(RMB)",
      },
      {
        prop: "totalRealityReceiveRMB",
        label: "实收：",
        type: "formatMoney",
        decimals: 2,
      },
      {
        prop: "totalRealityPayRMB",
        label: "实付：",
        type: "formatMoney",
        decimals: 2,
      },
    ],
  },
];

const FORM_BUSINESS_REMARK = (isBusinessDisable) => ({
  span: 24,
  id: "businessRemark",
  labelWidth: "0px",
  ...(isBusinessDisable
    ? { type: "txt" }
    : {
        placeholder: "业务备注信息",
        type: "textarea",
        maxlength: 2000,
      }),
});
// 派送

const FORM_COLS_1_1 = {
  span: 6,
  id: "registerNo",
  label: "箱号：",
  labelWidth: "70px",
  type: "txt",
};
const FORM_COLS_2_1 = {
  span: 6,
  id: "deliveryPlaceName",
  label: "发货地址：",
  labelWidth: "70px",
  type: "txt",
  // showTag: true,
  // // tagPosition: true,
  // tagId: "deliveryPlaceType",
  // tagColor: "#35D06F",
  // tagBasicType: "clearanceDeliveryPlaceType",
  txtTagArr: [
    {
      tagColor: "green", // 默认blue色
      basicType: "clearanceDeliveryPlaceType",
      basicTypeVal: "deliveryPlaceType",
    },
  ],
};
const FORM_COLS_2_2 = {
  span: 12,
  id: "deliveryPlaceAddress",
  label: "详情地址：",
  type: "txt",
};
const FORM_COLS_2_3 = {
  span: 6,
  id: "platformStore",
  label: "平台店铺：",
  labelWidth: "70px",
  type: "txt",
};
const FORM_COLS_2_4 = {
  span: 6,
  id: "amazonDeliveryNumber",
  label: "Shipment ID：",
  type: "txt",
};
const FORM_COLS_2_5 = {
  span: 6,
  id: "amazonReferenceNumber",
  label: "Amazon参考号：",
  type: "txt",
};
const FORM_COLS_2_6 = {
  span: 6,
  id: "isInsure",
  type: "singleCheckbox",
  text: "保险服务",
  disabled: true,
};
const FORM_COLS_2_7 = {
  span: 6,
  id: "isWarehousing",
  type: "singleCheckbox",
  text: "入库",
  disabled: true,
};
const FORM_COLS_2_8 = {
  span: 6,
  id: "freightType",
  label: "装箱方式：",
  type: "radio",
  basicType: "freightType",
  disable: true,
};

const FORM_COLS_2_9 = {
  span: 6,
  id: "transportMode",
  label: "运输方式：",
  type: "txt",
  basicType: "headTransportMode",
};

const FORM_COLS_2_10 = {
  span: 6,
  id: "operateMainName",
  label: "客户归属：",
  type: "txt",
};

// 入仓
const FORM_COLS_3_1 = {
  span: 6,
  id: "warehouse_warehouseName",
  label: "入库仓：",
  labelWidth: "70px",
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
const FORM_COLS_3_5 = {
  span: 12,
  id: "warehouse_warehouseSourceName",
  label: "入库来源：",
  labelWidth: "70px",
  type: "txt",
};
const deliverFormColumns=(row={})=>{
  console.log('row',row)
  const {freightType}=row
  return [
    FORM_COLS_2_10,
    FORM_COLS_2_1, // 发货地址
    {...FORM_COLS_2_2,span:6}, // 详情地址
    FORM_COLS_2_6, // 保险服务
    FORM_COLS_2_9,//运输方式
    FORM_COLS_2_3, // 平台店铺
    FORM_COLS_2_4, // Shipment ID
    FORM_COLS_2_7, //入库
    FORM_COLS_2_8, // 装箱方式
    ...(freightType==1?[]:[FORM_COLS_1_1]),
  ];
}

export const config=(row={})=>{
  return {
    lists: [
      {
        fieldList: [
          {
            className: "border-top-solid margin-bottom-14",
            rows: [
              {
                cols: deliverFormColumns(row),
              },
            ],
          },
          {
            className: "border-top-solid",
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
        ],
      },
    ],
  };
}

export const titConfig=(row={})=>{
  return{
    columnConfig: [
      {
        label: "创建人",
        prop: "createBy",
      },
      {
        label: "创建时间",
        prop: "createTime",
      },
      {
        label: "业务员",
        prop: "salesmanName",
      }
    ],
  }
}
