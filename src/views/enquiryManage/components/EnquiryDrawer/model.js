import {
  httpCabinetTypeSelect,
  httpGetCostBindCustomer,
} from "@/comModel/httpSelect";
import {
  COM_FORM_START_PORT,
  COM_FORM_END_PORT,
  COM_FORM_DOMESTIC,
  COM_FORM_FOREIGN,
} from "@/views/enquiryManage/components/comModel";
import { MAX_FCL_NUM, MAX_BOX_WEIGHT, MAX_BOX_VOLUME, MAX_PRODUCT_NUM } from "@/utils/instructions.js";

const FORM_COLS_1 = {
  ...COM_FORM_START_PORT,
  span: 18,
  id: "startPortId",
  placeholder: "请选择起运港",
};
const FORM_COLS_11 = {
  ...COM_FORM_END_PORT,
  span: 18,
  id: "endPortId",
  placeholder: "请选择目的港",
  isBackAll: true,
};
const FORM_COLS_21 = {
  span: 4,
  id: "country",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_31 = {
  span: 18,
  id: "deliveryTime",
  label: "交货时间：",
  placeholder: "请选择交货时间",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_41 = {
  span: 18,
  id: "packingMode",
  label: "装箱方式：",
  type: "radio",
  basicType: "freightType",
};
const FORM_COLS_51 = {
  span: 12,
  id: "cabinetQuantity",
  label: "柜型柜量：",
  placeholder: "柜量",
  type: "inputNumber",
  max: MAX_FCL_NUM,
  numDecimal: 0,
};
const FORM_COLS_52 = {
  span: 6,
  id: "cabinetId",
  labelWidth: "0px",
  placeholder: "柜型",
  className: "item-margin-left",
  ...httpCabinetTypeSelect,
};
const FORM_COLS_53 = {
  span: 4,
  id: "addCabinet",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_54 = {
  span: 4,
  id: "removeCabinet",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_61 = {
  span: 18,
  id: "freightTotalVolume",
  label: "体积：",
  placeholder: "体积",
  type: "inputNumber",
  max: MAX_BOX_VOLUME,
  numDecimal: 2,
  unit: "CBM",
};
const FORM_COLS_62 = {
  span: 18,
  id: "freightTotalWeight",
  label: "重量：",
  placeholder: "重量",
  type: "inputNumber",
  max: MAX_BOX_WEIGHT,
  numDecimal: 2,
  unit: "KG",
};
const FORM_COLS_71 = {
  span: 18,
  id: "tradeClause",
  label: "贸易条款：",
  placeholder: "请选择贸易条款",
  type: "select",
  basicType: "tradeClause",
};
const FORM_COLS_81 = {
  span: 18,
  id: "freightSingleMaxWeight",
  label: "单件最大重量：",
  placeholder: "请输入最大重量",
  type: "inputNumber",
  max: MAX_BOX_WEIGHT,
  numDecimal: 2,
  unit: "KG",
};
const FORM_COLS_91 = {
  span: 18,
  id: "freightQuantity",
  label: "件数：",
  placeholder: "请输入件数",
  type: "inputNumber",
  max: MAX_PRODUCT_NUM,
  numDecimal: 0,
  unit: "PCS",
};
const FORM_COLS_101 = {
  span: 18,
  id: "productType",
  label: "产品属性：",
  type: "radio",
  basicType: "productType",
};
const FORM_COLS_111 = {
  span: 18,
  id: "productInfo",
  label: "产品信息：",
  placeholder: "请输入产品信息",
  type: "text",
};
const FORM_COLS_121 = {
  ...COM_FORM_DOMESTIC,
  span: 18,
  id: "domesticQuotedPriceUserId",
  placeholder: "请选择报价人",
};
const FORM_COLS_131 = {
  span: 18,
  id: "overseasToDoor",
  label: "是否海外到门：",
  type: "radio",
  options: [
    {
      label: "是",
      value: true,
    },
    {
      label: "否",
      value: false,
    },
  ],
};
const FORM_COLS_132 = {
  ...COM_FORM_FOREIGN,
  span: 18,
  id: "foreignQuotedPriceUserId",
  placeholder: "请选择报价人",
};
const FORM_COLS_141 = {
  span: 18,
  id: "deliveryAddress",
  label: "送货地址：",
  placeholder: "请输入",
  type: "textarea",
	maxlength: 200
};
const FORM_COLS_142 = {
  span: 18,
  id: "overseasShippingMode",
  label: "海外运输方式：",
  type: "select",
  multiple: true,
  basicType: "outWarehouseWay",
};
const FORM_COLS_151 = {
  span: 18,
  id: "remark",
  label: "备注：",
  placeholder: "请输入",
  type: "textarea",
};
const FORM_COLS_161 = {
  span: 18,
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
const FORM_COLS_171 = {
	span: 18,
  id: "customerId",
  label: "委托客户：",
  placeholder: "请选择委托客户",
  ...httpGetCostBindCustomer(),
};

// isOverSea:海外到门;isFcl:装箱方式为FCl
const hyFormColumns = ({ isOverSea, isFcl, cabinetList = [] }) => {
  const FclList = [];
  const formRules = {};
  if (isFcl) {
    if (cabinetList && cabinetList.length) {
      cabinetList.forEach((item, index) => {
        const id51 = `${FORM_COLS_51.id}${item.id || item.newId}`;
        const i51 = {
          ...FORM_COLS_51,
          id: id51,
          label: index === 0 ? FORM_COLS_51.label : "",
        };
        const id52 = `${FORM_COLS_52.id}${item.id || item.newId}`;
        const i52 = {
          ...FORM_COLS_52,
          id: id52,
        };
        FclList.push(
          ...[i51, i52, index === 0 ? FORM_COLS_53 : { ...FORM_COLS_54, index }]
        );
        formRules[id51] = [
          { required: true, message: "请输入柜量", trigger: "blur" },
        ];
        formRules[id52] = [
          { required: true, message: "请选择柜型", trigger: "blur" },
        ];
      });
    }
  }
  return {
    lists: [
      FORM_COLS_171,
      FORM_COLS_1,
      FORM_COLS_11,
      FORM_COLS_21,
      FORM_COLS_31,
      FORM_COLS_41,
      ...FclList,
      FORM_COLS_61,
      FORM_COLS_62,
      FORM_COLS_91,
      FORM_COLS_71,
      FORM_COLS_81,
      FORM_COLS_101,
      FORM_COLS_111,
      FORM_COLS_121,
      FORM_COLS_131,
      ...(isOverSea ? [FORM_COLS_132, FORM_COLS_141, FORM_COLS_142] : []),
      FORM_COLS_151,
      FORM_COLS_161,
    ],
    formRules,
  };
};

const kyFormColumns = ({ isOverSea }) => [
  FORM_COLS_171,
  FORM_COLS_1,
  FORM_COLS_11,
  FORM_COLS_21,
  FORM_COLS_31,
  FORM_COLS_61,
  FORM_COLS_62,
  FORM_COLS_91,
  FORM_COLS_71,
  FORM_COLS_81,
  FORM_COLS_101,
  FORM_COLS_111,
  FORM_COLS_121,
  FORM_COLS_131,
  ...(isOverSea ? [FORM_COLS_132, FORM_COLS_141, FORM_COLS_142] : []),
  FORM_COLS_151,
  FORM_COLS_161,
];

export const config = (shippingMode, params) => ({
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols:
                shippingMode === 1
                  ? hyFormColumns(params).lists
                  : kyFormColumns(params),
            },
          ],
        },
      ],
    },
  ], // 表单渲染列表
  formRules: {
    customerId: [
      { required: true, message: "请选择委托客户", trigger: "blur" },
    ],
    startPortId: [{ required: true, message: "请选择起运港", trigger: "blur" }],
    endPortId: [{ required: true, message: "请选择目的港", trigger: "blur" }],
    deliveryTime: [
      { required: true, message: "请选择交货时间", trigger: "blur" },
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
    ...(shippingMode === 1 ? hyFormColumns(params).formRules : {}),
  }, // 表单校验规则
});
