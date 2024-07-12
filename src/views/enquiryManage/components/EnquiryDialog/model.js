import {
  httpCabinetTypeSelect,
  httpGetCostBindCustomer,
  httpPickupAddressInfo,
  httpPortPublicSelect,
} from "@/comModel/httpSelect";
import {
  COM_FORM_START_PORT,
  COM_FORM_END_PORT,
  COM_FORM_DOMESTIC,
  COM_FORM_FOREIGN,
} from "@/views/enquiryManage/components/comModel";
import {
  MAX_FCL_NUM,
  MAX_BOX_WEIGHT,
  MAX_BOX_VOLUME,
  MAX_PRODUCT_NUM,
} from "@/utils/instructions.js";

// 询价信息
const FORM_ENQUIRY_1 = {
  span: 12,
  id: "customerId",
  label: "委托客户：",
  placeholder: "请选择委托客户",
  ...httpGetCostBindCustomer(),
};
const FORM_ENQUIRY_2 = {
  span: 12,
  id: "type",
  label: "询价段：",
  type: "radio",
  basicType: "inquirySheetType",
};
const FORM_ENQUIRY_3 = {
  ...COM_FORM_DOMESTIC,
  span: 12,
  id: "domesticQuotedPriceUserId",
  placeholder: "请选择报价人",
};
const FORM_ENQUIRY_4 = {
  ...COM_FORM_FOREIGN,
  span: 12,
  id: "foreignQuotedPriceUserId",
  placeholder: "请选择报价人",
};

// 基本信息
const FORM_COLS_1 = (shippingMode) => ({
  span: 12,
  id: "startPortId",
  label: "起运港：",
  placeholder: "请选择起运港",
  ...httpPortPublicSelect(shippingMode == 1 ? "0,1,2" : "3,4"),
  selectLabelKey: "startPortName",
  currData: true,
});
const FORM_COLS_2 = (shippingMode) => ({
  span: 10,
  id: "endPortId",
  label: "目的港：",
  ...httpPortPublicSelect(shippingMode == 1 ? "0,1,2" : "3,4"),
  selectLabelKey: "endPortName",
  placeholder: "请选择目的港",
  currData: true,
});
const FORM_COLS_21 = {
  span: 2,
  id: "country",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_22 = {
  span: 12,
  id: "pickupAddressId",
  label: "提货地址：",
  placeholder: "请选择提货地址",
  currData: true,
  showCreate: true,
  ...httpPickupAddressInfo(),
  selectLabelKey: "pickupAddressName",
  type: "slot",
};
const FORM_COLS_3 = {
  span: 12,
  id: "deliveryTime",
  label: "交货时间：",
  placeholder: "请选择交货时间",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_4 = {
  span: 12,
  id: "packingMode",
  label: "装箱方式：",
  type: "radio",
  basicType: "freightType",
};
const FORM_COLS_5 = {
  span: 12,
  id: "freightSingleMaxWeight",
  label: "单件最大重量(KG)：",
  placeholder: "请输入最大重量",
  type: "inputNumber",
  max: MAX_BOX_WEIGHT,
  numDecimal: 2,
  unit: "KG",
};
const FORM_COLS_6 = {
  span: 12,
  id: "freightQuantity",
  label: "件数(pcs)：",
  placeholder: "请输入件数",
  type: "inputNumber",
  max: MAX_PRODUCT_NUM,
  numDecimal: 0,
};
const FORM_COLS_7 = {
  span: 12,
  id: "productType",
  label: "产品属性：",
  type: "radio",
  basicType: "productType",
};
const FORM_COLS_8 = {
  span: 12,
  id: "productInfo",
  label: "产品信息：",
  placeholder: "请输入产品信息",
  type: "text",
};
const FORM_COLS_91 = {
  span: 7,
  id: "cabinetQuantity",
  label: "柜型柜量：",
  placeholder: "柜量",
  type: "inputNumber",
  max: MAX_FCL_NUM,
  numDecimal: 0,
};
const FORM_COLS_92 = {
  span: 4,
  id: "cabinetId",
  labelWidth: "0px",
  placeholder: "柜型",
  className: "item-margin-left",
  ...httpCabinetTypeSelect,
};
const FORM_COLS_93 = {
  span: 1,
  id: "addCabinet",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_94 = {
  span: 1,
  id: "removeCabinet",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_101 = {
  span: 8,
  id: "freightTotalVolume",
  label: "体积重量：",
  placeholder: "体积",
  type: "inputNumber",
  max: MAX_BOX_VOLUME,
  numDecimal: 2,
  unit: "CBM",
};
const FORM_COLS_102 = {
  span: 4,
  id: "freightTotalWeight",
  labelWidth: "0px",
  className: "item-margin-left",
  placeholder: "重量",
  type: "inputNumber",
  max: MAX_BOX_WEIGHT,
  numDecimal: 2,
  unit: "KG",
};
const FORM_COLS_11 = {
  span: 12,
  id: "tradeClause",
  label: "贸易条款：",
  placeholder: "请选择贸易条款",
  type: "select",
  basicType: "tradeClause",
};
const FORM_COLS_12 = {
  span: 12,
  id: "overseasShippingMode",
  label: "海外运输方式：",
  type: "select",
  multiple: true,
  basicType: "outWarehouseWay",
};
const FORM_COLS_13 = {
  span: 12,
  id: "deliveryAddress",
  label: "送货地址：",
  placeholder: "请输入送货地址",
  type: "text",
  maxlength: 200,
};
const FORM_COLS_14 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "输入备注说明",
  type: "textarea",
};
const FORM_COLS_15 = {
  span: 24,
  className: "enquiry-upload-file",
  id: "attachIds",
  attachIdKeyName: "attachIds",
  fileLabel: "上传图片：最多5张，支持png、jpg格式",
  labelWidth: "48px",
  type: "customUploadFile",
  imageCardUrl: "url",
  pasteUpload: true,
  fileParamsType: 126,
  subTitle: false,
};
const FORM_COLS_SPACE = {
  span: 12,
  id: "space",
  type: "slot",
};

// 询价信息
const enquiryColumns = (type = 1) => [
  FORM_ENQUIRY_1, // 委托客户
  FORM_ENQUIRY_2, // 询价段
  ...([1, 3].includes(Number(type)) ? [FORM_ENQUIRY_3] : []), // 国内报价人
  ...([2, 3].includes(Number(type)) ? [FORM_ENQUIRY_4] : []), // 海外报价人
];

// 基本信息 type:询价类型1=国内/2=海外/3=国内+海外;isFcl:装箱方式为FCl
const basicColumns = ({
  type = 1,
  isFcl,
  cabinetList = [],
  shippingMode = 1,
  tradeType = 1,
}) => {
  const FclList = [];
  const formRules = {};
  const leaveList = [
    [
      FORM_COLS_101, // 体积
      FORM_COLS_102, // 重量
    ],
    FORM_COLS_11, // 贸易条款
    ...([2, 3].includes(Number(type)) // 海外/国内+海外显示
      ? [
          FORM_COLS_12, // 海外运输方式
          ...(type == 3 || tradeType == 2 ? [FORM_COLS_13] : []), // 送货地址
        ]
      : []),
  ];
  if (isFcl && shippingMode == 1) {
    // 空运只有散货
    if (cabinetList && cabinetList.length) {
      cabinetList.forEach((item, index) => {
        const id91 = `${FORM_COLS_91.id}${item.id || item.newId}`;
        const i91 = {
          ...FORM_COLS_91,
          id: id91,
          label: index === 0 ? FORM_COLS_91.label : "",
        };
        const id92 = `${FORM_COLS_92.id}${item.id || item.newId}`;
        const i92 = {
          ...FORM_COLS_92,
          id: id92,
        };
        FclList.push(
          ...[i91, i92, index === 0 ? FORM_COLS_93 : { ...FORM_COLS_94, index }]
        );
        if (index === 0) {
          FclList.push(...leaveList[index]);
        } else {
          if (leaveList[index]) {
            FclList.push(leaveList[index]);
          } else {
            FclList.push(FORM_COLS_SPACE);
          }
        }
        formRules[id91] = [
          { required: true, message: "请输入柜量", trigger: "blur" },
        ];
        formRules[id92] = [
          { required: true, message: "请选择柜型", trigger: "blur" },
        ];
      });
      if (cabinetList.length < leaveList.length) {
        FclList.push(...leaveList.slice(cabinetList.length, leaveList.length));
      }
    }
  }
  if (!FclList.length) {
    FclList.push(
      ...[
        FORM_COLS_101, // 体积
        FORM_COLS_102, // 重量
        FORM_COLS_11, // 贸易条款
        ...([2, 3].includes(Number(type)) // 海外/国内+海外显示
          ? [
              FORM_COLS_12, // 海外运输方式
              ...(type == 3 || tradeType == 2 ? [FORM_COLS_13] : []), // 送货地址
            ]
          : []),
      ]
    );
  }
  let portList = [];
  if (type == 2) {
    // 仅海外
    if (tradeType == 1) {
      // 进口
      portList = [
        {
          ...FORM_COLS_1(shippingMode),
          span: 10,
        },
        FORM_COLS_21,
      ];
    }
    portList.push(FORM_COLS_22); // 提货地址
  } else {
    portList = [
      FORM_COLS_1(shippingMode), // 起运港
      FORM_COLS_2(shippingMode), // 目的港
      FORM_COLS_21, // 目的港/起运港-国家
    ];
  }
  return {
    lists: [
      ...portList,
      FORM_COLS_3, // 交货时间
      ...(shippingMode == 1 ? [FORM_COLS_4] : []), // 装箱方式(空运隐藏)
      FORM_COLS_5, // 单件最大重量
      FORM_COLS_6, // 件数
      FORM_COLS_7, // 产品属性
      FORM_COLS_8, // 产品信息
      ...FclList, // 柜型柜量（装箱方式为整柜）
      FORM_COLS_14, // 备注
      FORM_COLS_15, // 上传图片
    ],
    formRules,
  };
};

export const config = (params) => {
  const { lists: basicLists, formRules: basicFormRules } = basicColumns(params);
  return {
    lists: [
      {
        fieldList: [
          {
            title: "询价信息",
            rows: [
              {
                cols: enquiryColumns(params.type),
              },
            ],
          },
          {
            title: "基本信息",
            rows: [
              {
                cols: basicLists,
              },
            ],
          },
        ],
      },
    ], // 表单渲染列表
    formRules: {
      // customerId: [
      //   { required: true, message: "请选择委托客户", trigger: "blur" },
      // ],
      startPortId: [
        { required: true, message: "请选择起运港", trigger: "blur" },
      ],
      endPortId: [{ required: true, message: "请选择目的港", trigger: "blur" }],
      deliveryTime: [
        { required: true, message: "请选择交货时间", trigger: "blur" },
      ],
      pickupAddressId: [
        { required: true, message: "请选择提货地址", trigger: "blur" },
      ],
      packingMode: [
        { required: true, message: "请选择装箱方式", trigger: "blur" },
      ],
      // cabinetQuantity: [
      //   { required: true, message: "请输入柜量", trigger: "blur" },
      // ],
      // cabinetId: [{ required: true, message: "请选择柜型", trigger: "blur" }],
      freightTotalVolume: [
        { required: true, message: "请输入体积", trigger: "blur" },
      ],
      freightTotalWeight: [
        { required: true, message: "请输入重量", trigger: "blur" },
      ],
      productType: [
        { required: true, message: "请选择产品属性", trigger: "blur" },
      ],
      domesticQuotedPriceUserId: [
        { required: true, message: "请选择询价人", trigger: "blur" },
      ],
      foreignQuotedPriceUserId: [
        { required: true, message: "请选择询价人", trigger: "blur" },
      ],
      deliveryAddress: [
        { required: true, message: "请输入送货地址", trigger: "blur" },
      ],
      overseasShippingMode: [
        { required: true, message: "请选择海外运输方式", trigger: "blur" },
      ],
      ...basicFormRules,
    }, // 表单校验规则
  };
};
