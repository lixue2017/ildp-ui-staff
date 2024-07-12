import { POSITIVE_NUMBER, POSITIVE_ONLY_EN } from "@/utils/mixin";
import { MAX_NUM_SIZE_2, toFixedNum } from "@/utils/instructions";

export const updateColumns = [
  {
    width: "calc(100% - 360px)",
    className: "form-left",
    fieldList: [
      {
        rows: [
          {
            cols: [
              {
                span: 12,
                id: "sku",
                label: "产品SKU：",
                labelWidth: "110px",
                placeholder: "此处填写产品SKU",
                type: "text",
                maxlength: 100,
              },
              // {
              //   span: 12,
              //   id: "productNameCn",
              //   label: "产品名称(CN)：",
              //   placeholder: "此处填写产品名称(CN)",
              //   type: "text",
              // },
              {
                span: 12,
                id: "customsCode",
                label: "HS CODE：",
                placeholder: "此处填写产品海关编码",
                type: "text",
                limitType: "number",
                maxlength: 50,
              },
              {
                span: 12,
                id: "productModel",
                label: "产品型号：",
                labelWidth: "110px",
                placeholder: "此处填写产品型号",
                type: "text",
                maxlength: 50,
              },
              // {
              //   span: 12,
              //   id: "productNameEn",
              //   label: "产品名称(EN)：",
              //   placeholder: "此处填写产品名称(EN)",
              //   type: "text",
              // },
              {
                span: 12,
                id: "declaredNameCn",
                label: "申报品名(CN)：",
                placeholder: "此处填写申报品名(CN)",
                type: "text",
                maxlength: 256,
              },
              {
                span: 12,
                id: "singleBoxNetWeight",
                label: "单箱净重：",
                placeholder: "此处填写单箱净重",
                labelWidth: "110px",
                type: "text",
                // disable: true,
                inputType: "number",
                unit: "KG",
                max: 99999999.99,
                render: (rows) => {
                  return rows.singleBoxNetWeight ||
                    rows.singleBoxNetWeight === 0
                    ? `${toFixedNum(rows.singleBoxNetWeight)}KG`
                    : "--";
                },
              },
              {
                span: 12,
                id: "declaredNameEn",
                label: "申报品名(EN)：",
                placeholder: "此处填写申报品名(EN)",
                type: "text",
                maxlength: 256,
              },
              {
                span: 12,
                id: "productWeight",
                label: "产品毛重：",
                placeholder: "此处填写产品毛重",
                labelWidth: "110px",
                type: "text",
                inputType: "number",
                unit: "KG",
                decimal: 2,
                max: 99999999.99,
              },
              {
                span: 12,
                id: "declaredValue",
                label: "申报单价：",
                placeholder: "此处填写申报单价",
                type: "slot",
                basicType: "declaredUnit",
                basicTypeVal: "declaredNum",
                render: (rows, dics) => {
                  const list = [];
                  if (rows.declaredUnit) list.push(rows.declaredUnit);
                  if (dics) list.push(dics);
                  return `${toFixedNum(rows.declaredValue)} ${list.join("/")}`;
                },
              },
              {
                span: 24,
                className: "inland-export-col",
                id: "inlandExportParam",
                label: "国内出口",
                labelWidth: "57px",
                text: "国内出口参数",
                type: "singleCheckbox",
              },
              {
                span: 12,
                id: "productType",
                label: "产品品类：",
                labelWidth: "110px",
                placeholder: "请选择产品品类",
                type: "autocomplete",
                category: "goods",
              },
              {
                span: 12,
                id: "singleBoxNum",
                label: "单箱数量：",
                placeholder: "此处填写单箱数量",
                type: "slot",
                inputType: "number",
              },
              {
                span: 12,
                id: "asin",
                label: "ASIN：",
                labelWidth: "110px",
                placeholder: "此处填写ASIN",
                type: "text",
                maxlength: 50,
              },
              {
                span: 12,
                id: "singleBoxWeight",
                label: "单箱毛重：",
                type: "text",
                inputType: "number",
                unit: "KG",
                decimal: 2,
                max: 99999999.99,
              },
              {
                span: 12,
                id: "materialCn",
                label: "产品材质(CN)：",
                labelWidth: "110px",
                placeholder: "此处填写产品材质(CN)",
                type: "text",
                maxlength: 512,
              },
              {
                span: 12,
                id: "productUnitPrice",
                placeholder: "币别",
                label: "销售单价：",
                type: "slot",
                inputType: "number",
                decimal: 2,
              },
              {
                span: 12,
                id: "materialEn",
                label: "产品材质(EN)：",
                labelWidth: "110px",
                placeholder: "此处填写产品材质(EN)",
                type: "text",
                maxlength: 512,
              },
              {
                span: 12,
                id: "brand",
                label: "品牌：",
                labelWidth: "110px",
                placeholder: "此处填写品牌",
                type: "text",
                maxlength: 50,
              },
              {
                span: 12,
                id: "productNetWeight",
                label: "产品净重：",
                labelWidth: "110px",
                type: "text",
                inputType: "number",
                unit: "KG",
                decimal: 2,
                max: 99999999.99,
              },
              {
                span: 24,
                id: "productLink",
                label: "产品信息链接：",
                labelWidth: "110px",
                maxlength: 500,
                placeholder: "此处填写产品信息链接",
                type: "text",
              },
              {
                span: 24,
                id: "businessUseCn",
                label: "产品用途(CN)：",
                labelWidth: "110px",
                maxlength: 500,
                placeholder: "此处填写产品用途(CN)",
                type: "text",
              },
              {
                span: 24,
                id: "businessUseEn",
                label: "产品用途(EN)：",
                labelWidth: "110px",
                maxlength: 500,
                placeholder: "此处填写产品用途(EN)",
                type: "text",
              },
              // {
              //     span: 12,
              //     id: "origin",
              //     label: "原产国：",
              //     placeholder: "请选择产品原产国",
              //     type: "autocomplete",
              //     category: "country",
              //     defaultProp: {
              //         value: 'twoCode,nameCn',
              //         label: 'twoCode,nameCn'
              //     }
              // },
              // {
              //     span: 12,
              //     id: "brandType",
              //     label: " 品牌类型：",
              //     placeholder: "请选择品牌类型",
              //     type: "select",
              //     options: BRAND_TYPE
              // },
              // {
              //   span: 24,
              //   id: "productRemark",
              //   label: "产品描述：",
              //   placeholder: "此处填写产品描述",
              //   type: "text",
              // },
              {
                span: 10,
                id: "productAttribute",
                label: "产品属性：",
                labelWidth: "110px",
                type: "radio",
                value: 0, // 默认普货
                options: [
                  {
                    label: "普货",
                    value: 0,
                  },
                  {
                    label: "敏感货",
                    value: 1,
                  },
                ],
              },
              {
                span: 7,
                labelWidth: "0px",
                id: "battery",
                label: "",
                type: "none",
                className: "battery-check",
              },
              {
                span: 2,
                id: "electrified",
                text: "带电",
                type: "none",
                labelWidth: "0px",
                // className: 'electrified-check'
              },
              {
                span: 5,
                labelWidth: "0px",
                id: "electrifiedType",
                label: "",
                placeholder: "请选择电池类型",
                type: "none",
                basicType: "batteryType",
                assDisabledKey: "electrified",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    width: 360,
    className: "form-right",
    fieldList: [
      {
        rows: [
          {
            cols: [
              {
                span: 24,
                id: "img",
                label: "产品图片：",
                type: "slot",
              },
              {
                span: 24,
                className: "foreign-export-col",
                id: "foreignExportParam",
                label: "海外仓服务",
                labelWidth: "73px",
                text: "海外仓服务参数",
                type: "singleCheckbox",
              },
              {
                span: 24,
                id: "userSetCode",
                label: "自定义编码：",
                placeholder: "此处填写自定义编码",
                type: "text",
                maxlength: 50,
              },
              {
                span: 24,
                id: "productBox",
                prop: "productLength",
                label: "产品尺寸：",
                title: "长",
                type: "slot",
                max: MAX_NUM_SIZE_2,
              },
              {
                span: 24,
                id: "productBox",
                prop: "productWidth",
                label: "",
                title: "宽",
                type: "slot",
                max: MAX_NUM_SIZE_2,
              },
              {
                span: 24,
                id: "productBox",
                prop: "productHigh",
                label: "",
                title: "高",
                type: "slot",
                max: MAX_NUM_SIZE_2,
              },
              {
                span: 24,
                className: "price-img-box",
                id: "priceImg",
                label: "定价截图：",
                type: "slot",
              },
              {
                span: 24,
                id: "productBox",
                prop: "boxLength",
                label: "单箱尺寸：",
                title: "长",
                type: "slot",
                max: MAX_NUM_SIZE_2,
              },
              {
                span: 24,
                id: "productBox",
                prop: "boxWidth",
                label: "",
                title: "宽",
                type: "slot",
                max: MAX_NUM_SIZE_2,
              },
              {
                span: 24,
                id: "productBox",
                prop: "boxHigh",
                label: "",
                title: "高",
                type: "slot",
                max: MAX_NUM_SIZE_2,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const formRules = (type) => {
  if (["add", "copy"].includes(type)) {
    return {
      sku: [{ required: true, message: "产品SKU不能为空" }],
      // customsCode: [{ required: true, message: "HS CODE不能为空" }],
      // declaredNameCn: [{ required: true, message: "申报品名(CN)不能为空" }],
      // declaredNameEn: [
      //   { required: true, message: "申报品名(EN)不能为空" },
      //   // {
      //   //   message: '申报品名(EN)只能输入英文',
      //   //   pattern: POSITIVE_ONLY_EN,
      //   // }
      // ],
      // productModel: [{ required: true, message: "产品型号不能为空" }],
      // declaredUnit: [{ required: true, message: "单位不能为空" }],
      // declaredNum: [{ required: true, message: "单位不能为空" }],
      productWeight: [
        // { required: true, message: "产品毛重不能为空" },
        {
          message: "产品毛重不能为负数",
          pattern: POSITIVE_NUMBER,
        },
      ],
      singleBoxNetWeight: [
        // { required: true, message: "单箱净重不能为空" },
        {
          message: "申报单价不能为负数",
          pattern: POSITIVE_NUMBER,
        },
      ],
      declaredValue: [
        // { required: true, message: "申报单价不能为空" },
        {
          message: "申报单价不能为负数",
          pattern: POSITIVE_NUMBER,
        },
      ],
    };
  } else {
    return {
      declaredUnit: [{ required: true, message: "单位不能为空" }],
      declaredNum: [{ required: true, message: "单位不能为空" }],
      productWeight: [
        { required: true, message: "产品毛重不能为空" },
        {
          message: "产品毛重不能为负数",
          pattern: POSITIVE_NUMBER,
        },
      ],
    };
  }
};

// 国内出口参数校验
export const linkageFormRules = {
  // singleBoxNum: [{ required: true, message: "单箱数量不能为空" }],
  asin: [{ required: true, message: "ASIN不能为空" }],
  materialCn: [{ required: true, message: "产品材质(CN)不能为空" }],
  materialEn: [
    { required: true, message: "产品材质(EN)不能为空", trigger: "blur" },
  ],
  brand: [{ required: true, message: "品牌不能为空" }],
  productNetWeight: [
    {
      message: "产品净重不能为负数",
      pattern: POSITIVE_NUMBER,
    },
  ],
  productUnitPrice: [
    { required: true, message: "销售单价不能为空" },
    {
      message: "销售单价不能为负数",
      pattern: POSITIVE_NUMBER,
    },
  ],
  productLink: [{ required: true, message: "产品信息链接不能为空" }],
  businessUseCn: [{ required: true, message: "产品用途(CN)不能为空" }],
  businessUseEn: [{ required: true, message: "产品用途(EN)不能为空" }],
  img: [{ required: true, message: "产品图片不能为空" }],
};
// 海外仓服务参数校验
export const overseasFormRules = {
  productLength: [
    { required: true, message: "长不能为空" },
    {
      message: "产品尺寸长不能为负数",
      pattern: POSITIVE_NUMBER,
    },
  ],
  productWidth: [
    { required: true, message: "宽不能为空" },
    {
      message: "产品尺寸宽不能为负数",
      pattern: POSITIVE_NUMBER,
    },
  ],
  productHigh: [
    { required: true, message: "高不能为空" },
    {
      message: "产品尺寸高不能为负数",
      pattern: POSITIVE_NUMBER,
    },
  ],
};

export const addTpList = [
  {
    label: "magnetic",
    value: "带磁",
  },
  {
    label: "liquid",
    value: "液体",
  },
  {
    label: "fragile",
    value: "易碎",
  },
];
