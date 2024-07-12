import {
  httpWarehousePublicSelect,
  httpCurrentWarehouseSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import { logisticsProductList } from "@/api/warehouse/basic";

const FORM_COLS_1 = {
  span: 6,
  id: "warehouseCode",
  label: "计费仓：",
  type: "txt",
  render: (item) => {
    const { warehouseCode, warehouseName } = item;
    return `${warehouseCode || "--"}/${warehouseName || "--"}`;
  },
};
const FORM_EDIT_1 = {
  ...FORM_COLS_1,
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
  id: "warehouseId",
};

const FORM_COLS_2 = {
  span: 6,
  id: "productCode",
  label: "物流产品：",
  type: "txt",
  render: (item) => {
    const { productCode, productName } = item;
    return `${productCode || "--"}/${productName || "--"}`;
  },
};
const FORM_EDIT_2 = {
  ...FORM_COLS_2,
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
  id: "logisticsProductId",
};
const FORM_COLS_3 = {
  span: 6,
  id: "priceLevel",
  label: "价格等级：",
  basicType: "priceGrade",
  type: "txt",
};
const FORM_EDIT_3 = {
  ...FORM_COLS_3,
  type: "select",
};
const FORM_COLS_4 = {
  span: 6,
  id: "miscellaneousLevel",
  label: "杂费等级：",
  basicType: "extrasGrade",
  type: "txt",
  txtTagArr: [
    {
      tagColor: "green", // 默认blue色
      basicType: "customerLvStatus",
      basicTypeVal: "state",
    },
  ],
};
const FORM_EDIT_4 = {
  ...FORM_COLS_4,
  type: "select",
};
const FORM_COLS_5 = {
  span: 6,
  id: "effectiveStartTime",
  label: "有效开始时间：",
  type: "txt",
};
const FORM_EDIT_5 = {
  ...FORM_COLS_5,
  placeholder: "请选择有效结束时间",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_6 = {
  span: 6,
  id: "effectiveEndTime",
  label: "有效结束时间：",
  type: "txt",
};
const FORM_EDIT_6 = {
  ...FORM_COLS_6,
  placeholder: "请选择有效结束时间",
  type: "date",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_7 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请输入备注",
  type: "txt",
};
const FORM_EDIT_7 = {
  ...FORM_COLS_7,
  type: "textarea",
  maxlength:400
};

const detailFormConfig = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  // FORM_COLS_5,
  // FORM_COLS_6,
  FORM_COLS_7,
];

const editFormConfig = [
  FORM_EDIT_1,
  FORM_EDIT_2,
  FORM_EDIT_3,
  FORM_EDIT_4,
  // FORM_EDIT_5,
  // FORM_EDIT_6,
  FORM_EDIT_7,
];

const editFormRules = {
  warehouseId: [{ required: true, message: "请选择计费仓", trigger: "change" }],
  logisticsProductId: [
    { required: true, message: "请选择物流产品", trigger: "change" },
  ],
  priceLevel: [
    { required: true, message: "请选择价格等级", trigger: "change" },
  ],
};

export const formConfig = (row = {}) => {
  const { activeTab } = row;
  const { lists, formRules } = {
    detail: {
      lists: detailFormConfig,
      formRules: {},
    },
    add: {
      lists: editFormConfig,
      formRules: editFormRules,
    },
    edit: {
      lists: editFormConfig,
      formRules: editFormRules,
    },
  }[activeTab];
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [...lists],
              },
            ],
          },
        ],
      },
    ],
    formRules,
  };
};
