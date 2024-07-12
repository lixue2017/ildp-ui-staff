import {
  httpWarehousePublicSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import { httpCurrencySelect } from "@/comModel/httpSelect";
import {
  logisticsProductList,
  costPartitionSchemeList,
  weightSectionTempList,
} from "@/api/warehouse/basic";
const FORM_LEFT_1 = {
  span: 24,
  id: "wmsCode",
  label: "计费仓：",
  type: "txt",
  // render: (row) => {
  //   const { wmsCode, wmsName } = row;
  //   return `${wmsCode}/${wmsName}`;
  // },
};
const FORM_LEFT_2 = {
  span: 24,
  id: "logisticsProductName",
  label: "物流产品：",
  type: "txt",
};
const FORM_LEFT_3 = {
  span: 24,
  id: "costPartitionSchemeId",
  label: "分区方案：",
  placeholder: "请选择分区方案",
  ...httpLogisticsChannelListSelect({
    httpRequest: costPartitionSchemeList,
    stateKey: "stateEq",
    type: 1,
  }),
  selectLabelKey: "costPartitionSchemeName",
  type: "slot",
};
const FORM_LEFT_4 = {
  span: 24,
  id: "weightSectionTempId",
  label: "重量段模板：",
  placeholder: "请选择重量段模板",
  ...httpLogisticsChannelListSelect({
    httpRequest: weightSectionTempList,
    stateKey: "stateEq",
  }),
  selectLabelKey: "weightSectionTempName",
  type: "slot",
};

const FORM_RIGHT_1 = {
  span: 12,
  id: "goodsPackType",
  label: "包装类型：",
  placeholder: "请选择包装类型",
  type: "select",
  basicType: "goodsPackType",
};
const FORM_RIGHT_2 = {
  span: 12,
  id: "priceGrade",
  label: "价格等级：",
  placeholder: "请选择价格等级",
  type: "txt",
  // type: "select",
  basicType: "priceGrade",
};
const FORM_RIGHT_3 = {
  span: 12,
  id: "priceCurrencyId",
  label: "计费币种：",
  placeholder: "请选择计费币种",
  type: "autocomplete",
  category: "currency",
  selectLabelKey: "priceCurrencyCode",
};
const FORM_RIGHT_4 = {
  span: 16,
  id: "validTime",
  label: "有效时间：",
  startPlaceholder: "开始时间",
  endPlaceholder: "结束时间",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_RIGHT_4_1 = {
  span: 8,
  id: "beginTime",
  label: "有效开始时间：",
  type: "txt",
};
const FORM_RIGHT_4_2 = {
  span: 8,
  id: "endTime",
  label: "有效结束时间：",
  type: "txt",
};
const FORM_RIGHT_5 = {
  span: 12,
  id: "fallbackWeightCarry",
  type: "multiCheckbox",
  // labelWidth: "84px",
  options: [
    {
      value: 1,
      label: "重量进位",
    },
    {
      value: 2,
      label: "回退邮件",
    },
  ],
};
const FORM_RIGHT_6 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "备注信息",
  type: "textarea",
  maxlength: 200,
};

const formLeftColumns = [FORM_LEFT_1, FORM_LEFT_2, FORM_LEFT_3, FORM_LEFT_4];
const formRightColumns = [
  FORM_RIGHT_2,
  FORM_RIGHT_3,
  FORM_RIGHT_1,
  // FORM_RIGHT_4,
  FORM_RIGHT_5,
  FORM_RIGHT_6,
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
      logisticsProductId: [
        {
          required: true,
          message: "请选择物流产品",
          trigger: "change",
        },
      ],
      costPartitionSchemeId: [
        {
          required: true,
          message: "请选择分区方案",
          trigger: "change",
        },
      ],
      weightSectionTempId: [
        {
          required: true,
          message: "请选择重量段模板",
          trigger: "change",
        },
      ],
      priceCurrencyId: [
        {
          required: true,
          message: "请选择计费币种",
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
      type: "txt",
    }));
    lists.formRightColumns = formRightColumns.map((item) => {
      if (item.type === "multiCheckbox") {
        return {
          ...item,
          disable: true,
        };
      }
      return {
        ...item,
        id: item.selectLabelKey || item.id,
        type: "txt",
      };
    });
    lists.formRules = {};
  }
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
