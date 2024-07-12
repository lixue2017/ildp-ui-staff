import {
  httpWarehousePublicSelect,
  httpCurrentWarehouseSelect,
  httpLogisticsChannelListSelect,
} from "@/comModel/warehouse";
import { costPartitionSchemeList } from "@/api/warehouse/basic";
import { logisticsProductList } from "@/api/warehouse/basic";
const FORM_COLS_1 = {
  span: 8,
  id: "warehouseId",
  label: "计费仓：",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
  selectLabelKey: "warehouseName",
};
const FORM_COLS_3 = {
  span: 8,
  id: "logisticsProductId",
  label: "物流产品：",
  placeholder: "请选择物流产品",
  ...httpLogisticsChannelListSelect({
    httpRequest: logisticsProductList,
    stateKey: "stateIn",
    power:true,
  }),
  render: (row) => row.logisticsProductCode || "ALL",
};
const FORM_LEFT_4 = {
  span: 8,
  id: "bindAllCustomer",
  text: "通用规则",
  type: "singleCheckbox",
  disabled: true,
};
const FORM_COLS_6 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "备注信息",
  type: "text",
  maxlength: 200,
};

const formColumns = [FORM_COLS_1, FORM_COLS_3, FORM_LEFT_4, FORM_COLS_6];

const formConfig = (isDetail) => {
  const lists = {
    formColumns,
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
    },
  };
  if (isDetail) {
    lists.formColumns = formColumns.map((item) => ({
      ...item,
      id: item.selectLabelKey || item.id,
      type: item.type === "singleCheckbox" ? "singleCheckbox" : "txt",
    }));
    lists.formRules = {};
  }
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: lists.formColumns,
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
