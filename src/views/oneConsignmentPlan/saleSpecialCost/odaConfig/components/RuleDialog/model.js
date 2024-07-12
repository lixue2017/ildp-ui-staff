import {
  httpWarehousePublicSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import {
  httpUserSelect,
  httpCostTypeSelect,
  httpGetOdaSettings,
} from "@/comModel/httpSelect";
import {
  logisticsProductList,
  costPartitionSchemeList,
} from "@/api/warehouse/basic";

const FORM_COLS_1 = {
  span: 12,
  id: "warehouseId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
  selectLabelKey: "warehouseName",
};
const FORM_COLS_2 = {
  span: 12,
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "请选择物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
  selectLabelKey: "logisticsProductName",
};
const FORM_COLS_3 = {
  span: 12,
  id: "costOdaSettingsId",
  label: "ODA服务名称：",
  placeholder: "请选择ODA服务名称",
  ...httpLogisticsChannelListSelect({
    httpRequest: costPartitionSchemeList,
    stateKey: "stateEq",
    type: 2,
  }),
  selectLabelKey: "costOdaSettingsName",
};
const FORM_COLS_4 = {
  span: 12,
  id: "settleCostTypeId",
  label: "费用类型：",
  placeholder: "请选择费用类型",
  ...httpCostTypeSelect({ type: 2, descs: "9" }),
  selectLabelKey: "settleCostTypeName",
};
const FORM_COLS_5 = {
  span: 24,
  id: "validTime",
  label: "有效时间：",
  startPlaceholder: "开始时间",
  endPlaceholder: "结束时间",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_5_1 = {
  span: 12,
  id: "startTime",
  label: "有效开始时间：",
  type: "txt",
};
const FORM_COLS_5_2 = {
  span: 12,
  id: "endTime",
  label: "有效结束时间：",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 12,
  id: "notifierId",
  label: "接受通知人：",
  placeholder: "请选择接受通知人",
  ...httpUserSelect(),
  selectLabelKey: "notifier",
};
const FORM_COLS_8 = {
  span: 12,
  id: "multiSelect",
  type: "multiCheckbox",
  labelWidth: "17px",
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
const FORM_COLS_9 = {
  span: 24,
  id: "remark",
  label: "规则说明：",
  placeholder: "备注信息",
  type: "textarea",
  maxlength: 200,
};
const formColumns = [
  FORM_COLS_1,
  FORM_COLS_2,
  FORM_COLS_3,
  FORM_COLS_4,
  // FORM_COLS_5,
  FORM_COLS_7,
  FORM_COLS_8,
  FORM_COLS_9,
];

export const formConfig = (isDetail) => {
  const obj = {
    lists: formColumns,
    formRules: {
      warehouseId: [
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
      costOdaSettingsId: [
        {
          required: true,
          message: "请选择ODA服务名称",
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
      validTime: [
        {
          required: true,
          message: "请选择有效时间",
          trigger: "change",
        },
      ],
      notifierId: [
        {
          required: true,
          message: "请选择接受通知人",
          trigger: "change",
        },
      ],
      remark: [
        {
          required: true,
          message: "请输入规则说明",
          trigger: "change",
        },
      ],
    },
  };
  if (isDetail) {
    obj.lists = formColumns.map((item) => {
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
    obj.formRules = {};
  }
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: obj.lists,
              },
            ],
          },
        ],
      },
    ],
    formRules: obj.formRules,
  };
};
