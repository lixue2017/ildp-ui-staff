const cardConfig = (type) => [
  {
    icon: "yunshu1",
    color: "#5094FF",
    bgColor: "#ECF3FF",
    labelWidth: "48px",
    list: [
      {
        label: "起运港：",
        prop: "startPortName",
      },
      {
        label: "目的港：",
        prop: "endPortName",
      },
    ],
  },
  {
    color: "#FF813D",
    bgColor: "#FFF3EC",
    list: [
      {
        label: "目的国：",
        prop: "destinationCountryName",
      },
      {
        label: "业务类型：",
        prop: "tradeType",
        basicType: "tradeType",
      },
    ],
  },
  {
    color: "#7676FF",
    bgColor: "#ECECFF",
    list: [
      {
        label: "装箱方式：",
        prop: "packingMode",
        basicType: "freightType",
      },
      {
        label: "货物信息：",
        prop: "cabinetName",
        render: (row) =>
          row.packingMode == 0
            ? row.cabinetName
            : row.cabinetName ||
              `${row.freightQuantity || "--"}/${row.freightTotalWeight}KG/${
                row.freightTotalVolume
              }CBM`,
      },
    ],
  },
  {
    color: "#13B5FF",
    bgColor: "#D2F1FF",
    list: [
      {
        label: "预计重量：",
        prop: "freightTotalWeight",
        unit: "KG",
      },
      {
        label: "预计体积：",
        prop: "freightTotalVolume",
        unit: "CBM",
      },
    ],
  },
];

const FROM_COLS_1 = {
  span: 8,
  id: "deliveryTime",
  label: "交货时间：",
  type: "txt",
};
const FROM_COLS_2 = {
  span: 8,
  id: "tradeClause",
  label: "贸易条款：",
  type: "txt",
  basicType: "tradeClause",
};
const FROM_COLS_3 = {
  span: 8,
  id: "freightQuantity",
  label: "件数：",
  type: "txt",
};
const FROM_COLS_4 = {
  span: 16,
  id: "overseasShippingMode",
  label: "海外运输方式：",
  type: "multiCheckbox",
  basicType: "outWarehouseWay",
  disable: true,
};
const FROM_COLS_5 = {
  span: 8,
  id: "productType",
  label: "产品属性：",
  type: "radio",
  basicType: "productType",
  disable: true,
};
const FROM_COLS_6 = {
  span: 8,
  id: "productInfo",
  label: "产品信息：",
  type: "txt",
};
const FROM_COLS_7 = {
  span: 24,
  id: "deliveryAddress",
  label: "送货地址：",
  type: "txt",
};
const FROM_COLS_8 = {
  span: 24,
  id: "remark",
  label: "询价备注：",
  type: "txt",
};
const FROM_COLS_9 = {
  span: 24,
  id: "attachList",
  label: "图片信息：",
  type: "slot",
};
const FROM_COLS_10 = {
  span: 8,
  id: "inquirySheetType",
  label: "询价段：",
  type: "radio",
  basicType: "inquirySheetType",
  disable: true,
};
const FROM_COLS_11 = {
  span: 24,
  id: "pickupAddressName",
  label: "提货地址：",
  type: "txt",
};
const FROM_COLS_12 = {
  span: 8,
  id: "formShippingMode",
  label: "运输方式：",
  type: "radio",
  basicType: "shippingMode",
  disable: true,
};

const formColumns = [
  FROM_COLS_1,
  FROM_COLS_2,
  FROM_COLS_10,
  FROM_COLS_3,
  FROM_COLS_12,
  FROM_COLS_5,
  FROM_COLS_6,
  FROM_COLS_4,
  FROM_COLS_11,
  FROM_COLS_7,
  FROM_COLS_8,
  FROM_COLS_9,
];

const formConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: formColumns,
            },
          ],
        },
      ],
    },
  ], // 表单渲染列表
  formRules: {}, // 表单校验规则
};

export { cardConfig, formConfig };
