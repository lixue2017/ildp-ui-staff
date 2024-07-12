import {
  httpGetCostBindCustomer,
  httpCabinetTypeSelect,
} from "@/comModel/httpSelect";
import {
  MAX_FCL_NUM,
  MAX_BOX_WEIGHT,
  MAX_BOX_VOLUME,
  MAX_PRODUCT_NUM,
} from "@/utils/instructions.js";

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
  id: "cabinetName",
  label: "货物信息",
  type: "txt",
  render: (row) =>
    row.packingMode == 0
      ? row.cabinetName
      : `${row.freightQuantity || "--"}/${row.freightTotalWeight}KG/${
          row.freightTotalVolume
        }CBM`,
};
const FORM_COLS_3 = {
  span: 13,
  id: "customerId",
  label: "客户名称：",
  placeholder: "客户名称",
  ...httpGetCostBindCustomer(),
  selectLabelKey: "customerName",
};
const FORM_COLS_41 = {
  span: 8,
  id: "cabinetQuantity",
  label: "柜型柜量：",
  placeholder: "柜量",
  type: "inputNumber",
  max: MAX_FCL_NUM,
  numDecimal: 0,
};
const FORM_COLS_42 = {
  span: 5,
  id: "cabinetId",
  labelWidth: "0px",
  placeholder: "柜型",
  className: "item-margin-left",
  ...httpCabinetTypeSelect,
  selectLabelKey: "cabinetName",
};
const FORM_COLS_43 = {
  span: 1,
  id: "addCabinet",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_44 = {
  span: 5,
  id: "removeCabinet",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_51 = {
  span: 8,
  id: "quantity",
  label: "体积重量件：",
  placeholder: "件数",
  type: "inputNumber",
  max: MAX_PRODUCT_NUM,
  numDecimal: 0,
  unit: "件",
};
const FORM_COLS_52 = {
  span: 5,
  id: "weight",
  labelWidth: "0",
  placeholder: "重量",
  type: "inputNumber",
  max: MAX_BOX_WEIGHT,
  numDecimal: 2,
  unit: "KG",
};
const FORM_COLS_53 = {
  span: 5,
  id: "volume",
  labelWidth: "0",
  placeholder: "体积",
  type: "inputNumber",
  max: MAX_BOX_VOLUME,
  numDecimal: 2,
  unit: "CBM",
};
const FORM_COLS_54 = {
  span: 5,
  id: "count",
  labelWidth: "0",
  type: "slot",
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
  id: "overseasQuotation",
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
        cols: [FORM_COLS_3],
      },
    ],
  },
];
export const formConfig = (isFcl, cabinetList = [], isSurcharge) => {
  const fieldList = [...formColumns];
  const lists = [];
  const formRules = {};
  const cabinetField = [];
  if (isFcl) {
    if (cabinetList && cabinetList.length) {
      cabinetList.forEach((item, index) => {
        const id41 = `${FORM_COLS_41.id}${item.id || item.newId}`;
        const i41 = {
          ...FORM_COLS_41,
          id: id41,
          label: index === 0 ? FORM_COLS_41.label : "",
        };
        const id42 = `${FORM_COLS_42.id}${item.id || item.newId}`;
        const i42 = {
          ...FORM_COLS_42,
          id: id42,
          selectLabelKey: `${FORM_COLS_42.selectLabelKey}${
            item.id || item.newId
          }`,
        };
        const field = [
          i41,
          i42,
          ...(index === 0
            ? [FORM_COLS_43, FORM_COLS_54]
            : [{ ...FORM_COLS_44, index }]),
        ];
        if (index === 0) {
          lists.push(...field);
        } else {
          cabinetField.push({
            rows: [
              {
                cols: field,
              },
            ],
          });
        }

        formRules[id41] = [
          { required: true, message: "请输入柜量", trigger: "blur" },
        ];
        formRules[id42] = [
          { required: true, message: "请选择柜型", trigger: "change" },
        ];
      });
    }
  } else {
    lists.push(...[FORM_COLS_51, FORM_COLS_52, FORM_COLS_53, FORM_COLS_54]);
  }
  fieldList.push(
    {
      rows: [
        {
          cols: lists,
        },
      ],
    },
    ...cabinetField,
    {
      rows: [
        {
          cols: [FORM_COLS_7],
        },
      ],
    },
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
      ...formRules,
      changePriceType: [
        { required: true, message: "请选择改价方式", trigger: "change" },
      ],
      customerId: [
        { required: true, message: "请选择委托客户", trigger: "change" },
      ],
      quantity: [{ required: true, message: "请输入件数", trigger: "blur" }],
      weight: [{ required: true, message: "请输入重量", trigger: "blur" }],
      volume: [{ required: true, message: "请输入体积", trigger: "blur" }],
    },
  };
};
