import { httpLogisticsChannelListSelect } from "@/comModel/warehouse";
import { httpCostTypeSelect, httpUserSelect } from "@/comModel/httpSelect";
import { logisticsProductList } from "@/api/warehouse/basic";
const FORM_COLS_1 = {
  span: 6,
  id: "logicalOperationType",
  label: "逻辑操作类型：",
  placeholder: "请选择逻辑操作类型",
  type: "select",
  basicType: "logicalOperationType",
};
const FORM_COLS_2 = {
  span: 24,
  id: "settleCostTypeId",
  label: "费用类型：",
  placeholder: "请选择费用类型",
  ...httpCostTypeSelect({ type: 2, descs: "7" }),
  selectLabelKey: "settleCostTypeName",
};
const FORM_COLS_3 = {
  span: 6,
  id: "ruleType",
  label: "规则类型：",
  placeholder: "请选择规则类型",
  type: "select",
  basicType: "specialChargesRuleRuleType",
};
const FORM_COLS_4 = {
  span: 24,
  id: "notifierId",
  label: "接收通知人：",
  placeholder: "请选择通知人",
  ...httpUserSelect(),
  selectLabelKey: "notifier",
};
const FORM_COLS_5 = {
  span: 12,
  id: "validTime",
  label: "有效时间：",
  startPlaceholder: "开始时间",
  endPlaceholder: "结束时间",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_5_1 = {
  span: 6,
  id: "startTime",
  label: "有效开始时间：",
  type: "txt",
};
const FORM_COLS_5_2 = {
  span: 6,
  id: "endTime",
  label: "有效结束时间：",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 24,
  id: "logisticsProductIds",
  label: "物流产品：",
  placeholder: "请选择物流产品(支持多选)",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
  multiple: true,
  collapseTags: true,
  // tip: "msgTip",
  // className: "logisticsProductTip",
  render: (row) => row.logisticsProductCode || "--",
};
const FORM_COLS_7 = {
  span: 24,
  id: "multiSelect",
  type: "multiCheckbox",
  labelWidth: "15px",
  options: [
    {
      value: 1,
      label: "扣件标志",
    },
    {
      value: 2,
      label: "客户通知标志",
    },
    {
      value: 3,
      label: "渠道是否支持",
    },
  ],
};
const FORM_COLS_8 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "备注信息",
  type: "textarea",
  maxlength: 200,
};

const formColumnsLeft = [FORM_COLS_2, FORM_COLS_4, FORM_COLS_7];

const formColumnsRight = [FORM_COLS_6, FORM_COLS_8];

const formConfig = (isDetail) => {
  const lists = {
    formColumnsLeft,
    formColumnsRight,
    formRules: {
      logicalOperationType: [
        {
          required: true,
          message: "请选择逻辑操作类型",
          trigger: "change",
        },
      ],
      settleCostTypeId: [
        {
          required: true,
          message: "请选择费用类型",
          trigger: "change",
        },
      ],
      ruleType: [
        {
          required: true,
          message: "请选择规则类型",
          trigger: "change",
        },
      ],
      logisticsProductIds: [
        {
          required: true,
          message: "请选择物流产品",
          trigger: "change",
        },
      ],
      notifierId: [
        {
          required: true,
          message: "请选择通知人",
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
    lists.formColumnsLeft = formColumnsLeft.map((item) => {
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
    lists.formColumnsRight = formColumnsRight.map((item) => {
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
        width: 390,
        className: "form-left",
        fieldList: [
          {
            rows: [
              {
                cols: lists.formColumnsLeft,
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
                cols: lists.formColumnsRight,
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
