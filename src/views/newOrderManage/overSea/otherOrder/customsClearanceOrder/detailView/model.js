import { contactsOperationAddress } from "@/views/operateManage/seaTransOperate/Details/model.js";
export const cardConfig = [
  {
    labelColor: "#80B1FF",
    color: "#5094FF",
    bgColor: "#ECF3FF",
    // icon: "yunshu1",
    iconObj: {
      0: "haiyun",
      3: "kongyun",
    },
    iconProp: "transportMode",
    list: [
      {
        prop: "jobNo",
      },
      {
        prop: "overseaBusinessTypesName",
        label: "业务类型：",
        labelWidth: "62px",
      },
    ],
  },
  {
    labelColor: "#FF985C",
    color: "#FF813D",
    bgColor: "#FFF3EC",
    list: [
      {
        prop: "countryName",
        label: "目的国：",
      },
      {
        prop: "endPortName",
        label: "目的港：",
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

const FORM_COLS_1_1 = {
  span: 6,
  id: "airlineName",
  label: "船司/航司：",
  type: "txt",
};
const FORM_COLS_1_2 = {
  span: 6,
  id: "mblNum",
  label: "MBL号：",
  type: "txt",
};
const FORM_COLS_1_3 = {
  span: 6,
  id: "registerNo",
  label: "箱号：",
  type: "txt",
};
const FORM_COLS_1_4 = {
  span: 6,
  id: "transportMode",
  label: "运输方式：",
  type: "radio",
  basicType: "transportMode",
  disable: true,
  hideList: [1, 2, 4],
};
const FORM_COLS_1_5 = {
  span: 6,
  id: "flightName",
  label: "船名/航名：",
  type: "txt",
};
const FORM_COLS_1_6 = {
  span: 6,
  id: "voyageNumber",
  label: "船次/航次：",
  type: "txt",
};
const FORM_COLS_1_7 = {
  span: 6,
  id: "startPortName",
  label: "起运港：",
  type: "txt",
};
const FORM_COLS_1_8 = {
  span: 6,
  id: "departureTime",
  label: "ETD：",
  type: "txt",
};
const FORM_COLS_1_9 = {
  span: 6,
  id: "reachTime",
  label: "ETA：",
  type: "txt",
};
const FORM_COLS_1_10 = {
  span: 6,
  id: "freightType",
  label: "装箱方式：",
  type: "radio",
  basicType: "freightType",
  disable: true,
};
const FORM_COLS_1_11 = {
  span: 6,
  id: "transportMode",
  label: "运输方式：",
  type: "txt",
  basicType: "headTransportMode",
};
const FORM_COLS_1_12 = {
  span: 6,
  id: "operateMainName",
  label: "客户归属：",
  type: "txt",
};
// 派送
const FORM_COLS_2_1 = {
  span: 24,
  id: "delivery_deliveryPlaceName",
  label: "发货地址：",
  type: "txt",
  // showTag: true,
  // // tagPosition: true,
  // tagId: "delivery_deliveryPlaceType",
  // tagColor: "#35D06F",
  // tagBasicType: "clearanceDeliveryPlaceType",
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
const FORM_COLS_2_7 = {
  span: 6,
  id: "delivery_amazonReferenceNumber",
  label: "Amazon参考号：",
  type: "txt",
};
const FORM_COLS_2_8 = {
  span: 6,
  id: "delivery_isInsure",
  type: "singleCheckbox",
  text: "保险服务",
  disabled: true,
};

// 存仓入库
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
const FORM_COLS_3_6 = {
  span: 6,
  id: "warehouse_packingMethod",
  label: "装箱方式：",
  type: "radio",
  basicType: "freightType",
  disable: true,
};
const customsFormColumns = [
  FORM_COLS_1_12,
  FORM_COLS_1_1, // 船司/航司
  FORM_COLS_1_2, // MBL号
  FORM_COLS_1_3, // 箱号
  FORM_COLS_1_11,//运输方式
  FORM_COLS_1_5, // 船名/航名
  FORM_COLS_1_6, // 船次/航次
  FORM_COLS_1_7, // 起运港
  FORM_COLS_1_8, // ETD
  FORM_COLS_1_9, // ETA
  FORM_COLS_1_10, // 装箱方式
];
// const deliverFormColumns = [
//   FORM_COLS_2_3, // 派送渠道
//   FORM_COLS_2_4, // 参考号
//   FORM_COLS_2_5, // 平台店铺
//   FORM_COLS_2_8, // 保险服务
//   FORM_COLS_2_6, // Shipment ID
//   // FORM_COLS_2_7, // Amazon参考号
//   FORM_COLS_2_1, // 发货地址
//   FORM_COLS_2_2, // 详情地址
// ];
// const warehousingFormColumns = [
//   FORM_COLS_3_1, // 入库仓
//   FORM_COLS_3_2, // 预计入库日期
//   FORM_COLS_3_3, // 跟踪号
//   FORM_COLS_3_4, // 参考编号
//   FORM_COLS_3_5, // 入库来源
// ];
const formList = (type) => {
  const fieldList = [
    {
      className: "border-top-solid  margin-bottom-14",
      rows: [
        {
          cols: customsFormColumns,
        },
      ],
    },
  ];
  // const typeObj = {
  //   2: deliverFormColumns,
  //   3: warehousingFormColumns,
  // };
  // if (type && typeObj[type]) {
  //   fieldList.push({
  //     className: "border-top-solid margin-top-14 margin-bottom-14",
  //     rows: [
  //       {
  //         cols: typeObj[type],
  //       },
  //     ],
  //   });
  // }
  return fieldList;
};

export const config = (type, isBusinessDisable = true, menuType = "order") => {
  // const configRemark = [
  //   {
  //     className: "border-bottom-solid",
  //     rows: [
  //       {
  //         cols: [
  //           {
  //             span: 24,
  //             labelWidth: "58px",
  //             label: "订单备注",
  //             type: "slot",
  //             className: "custom-remark",
  //           },
  //           {
  //             span: 24,
  //             id: "orderRemark",
  //             labelWidth: "0px",
  //             placeholder: "--",
  //             type: "txt",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     rows: [
  //       {
  //         cols: [
  //           {
  //             span: 24,
  //             labelWidth: "58px",
  //             label: "业务备注",
  //             type: "slot",
  //             className: "custom-remark business-remark",
  //           },
  //           FORM_BUSINESS_REMARK(isBusinessDisable),
  //         ],
  //       },
  //     ],
  //   },
  // ];

  return {
    lists: [
      {
        fieldList: [
          ...formList(type),
          // {
          //   className: "border-top-solid",
          //   rowClassName: "form-rows-box",
          //   rows: [
          //     {
          //       cols: [
          //         {
          //           ...contactsOperationAddress(),
          //           label: "发货人",
          //           id: "cusConsigner_address",
          //           txtObjKey: "cusConsigner",
          //         },
          //         {
          //           ...contactsOperationAddress(12),
          //           label: "收货人",
          //           id: "cusConsignee_address",
          //           txtObjKey: "cusConsignee",
          //         },
          //         {
          //           ...contactsOperationAddress(),
          //           label: "通知人",
          //           id: "cusNotifier_address",
          //           txtObjKey: "cusNotifier",
          //         },
          //       ],
          //     },
          //   ],
          // },
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
          // ...(menuType == "order" ? configRemark : []),
        ],
      },
    ],
    formRules: {},
  };
};



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
