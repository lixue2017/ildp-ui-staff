import { httpCabinetTypeSelect } from "@/comModel/httpSelect";
const FORM_COLS_1 = {
  span: 24,
  id: "changePriceType",
  label: "改价：",
  type: "radio",
  options: [
    {
      label: "按数量改价",
      value: 1,
    },
    {
      label: "按百分比改价",
      value: 2,
    },
  ],
};
const FORM_COLS_2 = {
  span: 24,
  id: "productInfo",
  label: "货物信息：",
  type: "txt",
  // render: (row) => {
  //   const { packingMode, cabinetList, quantity, weight, volume } = row;
  //   let info = `${quantity || "--"}件/${weight}KG/${volume}CBM`;
  //   if (packingMode === 0) {
  //     info =
  //       (cabinetList || [])
  //         .map((item) => `${item.cabinetQuantity}*${item.cabinetName}`)
  //         .join("，") || "--";
  //   }
  //   return info;
  // },
};
const FORM_COLS_41 = {
  span: 8,
  id: "cabinetQuantity",
  label: "柜型柜量：",
  placeholder: "柜量",
  type: "text",
  inputType: "number",
  decimal: 0,
};
const FORM_COLS_42 = {
  span: 5,
  id: "cabinetId",
  labelWidth: "0px",
  placeholder: "柜型",
  className: "item-margin-left",
  ...httpCabinetTypeSelect,
};
const FORM_COLS_51 = {
  span: 8,
  id: "quantity",
  label: "体积重量件：",
  placeholder: "件数",
  type: "text",
  inputType: "number",
  decimal: 0,
  unit: "件",
};
const FORM_COLS_52 = {
  span: 5,
  id: "weight",
  labelWidth: "0",
  placeholder: "重量",
  type: "text",
  inputType: "number",
  decimal: 0,
  unit: "KG",
};
const FORM_COLS_53 = {
  span: 5,
  id: "volume",
  labelWidth: "0",
  placeholder: "体积",
  type: "text",
  inputType: "number",
  decimal: 2,
  unit: "CBM",
};
const FORM_COLS_61 = {
  span: 24,
  labelWidth: "29px",
  label: "备注",
  type: "slot",
  className: "custom-remark",
};
const FORM_COLS_62 = {
  span: 24,
  id: "remark",
  labelWidth: "0px",
  placeholder: "请输入备注信息",
  type: "textarea",
  maxlength: 500,
};
const FORM_COLS_7 = {
  span: 24,
  id: "freight",
  labelWidth: "0",
  type: "slot",
};
const FORM_COLS_8 = {
  span: 24,
  id: "surcharge",
  labelWidth: "0",
  type: "slot",
};
const FORM_COLS_9 = {
  span: 24,
  id: "foreign",
  labelWidth: "0",
  type: "slot",
};

const formColumns = [
  {
    rows: [
      {
        cols: [FORM_COLS_1],
      },
    ],
  },
  {
    rows: [
      {
        cols: [FORM_COLS_2],
      },
    ],
  },
];
export const formConfig = (isSurcharge, isOverseas, isDomestic) => {
  const fieldList = [...formColumns];
  fieldList.push(
    ...(isDomestic
      ? [
          {
            title: "国内报价",
            rows: [
              {
                cols: [FORM_COLS_7],
              },
            ],
          },
        ]
      : []),
    ...(isSurcharge
      ? [
          {
            rows: [
              {
                cols: [FORM_COLS_8],
              },
            ],
          },
        ]
      : []),
    ...(isOverseas
      ? [
          {
            title: "海外报价",
            rows: [
              {
                cols: [FORM_COLS_9],
              },
            ],
          },
        ]
      : []),
    {
      rows: [
        {
          cols: [FORM_COLS_61, FORM_COLS_62],
        },
      ],
    }
  );
  return {
    labelWidth: "88px",
    lists: [
      {
        fieldList,
      },
    ], // 表单渲染列表
    formRules: {
      changePriceType: [
        { required: true, message: "请选择改价方式", trigger: "blur" },
      ],
    },
  };
};
