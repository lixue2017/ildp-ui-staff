import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { httpCurrencySelect } from "@/comModel/httpSelect";
const FORM_LEFT_1 = {
  span: 20,
  id: "wmsId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
  selectLabelKey: "wmsName",
};
const FORM_LEFT_2 = {
  span: 20,
  id: "priceCurrencyId",
  label: "币别：",
  placeholder: "币别",
  ...httpCurrencySelect,
  selectLabelKey: "priceCurrencyCode",
};
const FORM_LEFT_3 = {
  span: 4,
  id: "bindAllCustomer",
  labelWidth: "0",
  text: "通用规则",
  type: "singleCheckbox",
  disabled: true,
};
const FORM_RIGHT_2 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "备注信息",
  type: "textarea",
  maxlength: 200,
};

const formLeftColumns = [FORM_LEFT_1, FORM_LEFT_3, FORM_LEFT_2];
const formRightColumns = [FORM_RIGHT_2];
const formRightColumnsDetail = [
  {
    ...FORM_RIGHT_2,
    type: "txt",
  },
];

const formConfig = (isDetail) => {
  const lists = {
    formLeftColumns,
    formRightColumns,
    formRules: {
      wmsId: [
        {
          required: true,
          message: "请选择计费仓",
          trigger: "change",
        },
      ],
      priceCurrencyId: [
        {
          required: true,
          message: "请选择币别",
          trigger: "change",
        },
      ],
      validTime: [
        {
          required: true,
          message: "请选择有效时间",
          trigger: "change",
        },
      ],
    },
  };
  if (isDetail) {
    lists.formLeftColumns = formLeftColumns.map((item) => ({
      ...item,
      id: item.selectLabelKey || item.id,
      type: item.type === "singleCheckbox" ? "singleCheckbox" : "txt",
    }));
    lists.formRightColumns = formRightColumnsDetail;
    lists.formRules = {};
  }
  console.log(lists);
  return {
    lists: [
      {
        width: 405,
        className: "form-left",
        fieldList: [
          {
            rows: [
              {
                cols: lists.formLeftColumns,
              },
            ],
          },
        ],
      },
      {
        className: "form-right",
        fieldList: [
          {
            rows: [
              {
                cols: lists.formRightColumns,
              },
            ],
          },
        ],
      },
    ],
    formRules: lists.formRules,
  };
};
export { formConfig };
