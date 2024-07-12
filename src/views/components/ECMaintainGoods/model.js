import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { httpCabinetTypeSelect } from "@/comModel/httpSelect.js";
import { MAX_FCL_NUM } from "@/utils/instructions";
const FORM_COLS_1 = {
  span: 8,
  id: "number",
  label: "工作单号：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 8,
  id: "totalBoxCount",
  label: "总箱数：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 8,
  id: "createTime",
  label: "下单时间：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_4 = {
  span: 5,
  id: "boxCount",
  label: "柜量/柜型：",
  placeholder: "柜量",
  type: "inputNumber",
  max: MAX_FCL_NUM,
  numDecimal: 0,
};
const FORM_COLS_5 = {
  span: 3,
  id: "boxId",
  labelWidth: "0px",
  placeholder: "柜型",
  className: "item-margin-left",
  ...httpCabinetTypeSelect,
  currData: true,
  // selectLabelKey: "code",
};
export const FclFormConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_1, FORM_COLS_2, FORM_COLS_4, FORM_COLS_5],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    boxId: [{ required: true, message: "请选择柜型", trigger: "change" }],
    boxCount: [{ required: true, message: "请输入柜量", trigger: "change" }],
  },
};
export const formConfig = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COLS_1, FORM_COLS_2, FORM_COLS_3],
            },
          ],
        },
      ],
    },
  ],
  formRules: {},
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
};
const TABLE_COLS_EXPAND = {
  type: "expand",
  prop: "expand",
  customRow: true,
  defaultExpandShow: true,
  width: 1,
};
const TABLE_COLS_1 = {
  label: "Shipment ID",
  prop: "shipmentId",
  customRow: true,
  minWidth: 110,
  fieldItem: {
    placeholder: "Shipment ID",
    type: "text",
  },
};
const TABLE_COLS_2 = {
  label: "Reference ID",
  prop: "referenceId",
  customRow: true,
  minWidth: 110,
  fieldItem: {
    placeholder: "Reference ID",
    type: "text",
  },
};
const TABLE_COLS_3 = {
  label: "唛头",
  prop: "shippingMark",
  customRow: true,
  minWidth: 80,
  fieldItem: {
    placeholder: "唛头",
    type: "text",
  },
};
const TABLE_COLS_4 = {
  label: "箱数",
  prop: "boxCount",
  minWidth: 92,
  customRow: true,
  request: true,
  align: "center",
  fieldItem: {
    placeholder: "箱数",
    type: "inputNumber",
    decimal: 0,
    max: 999999999,
  },
};
const TABLE_COLS_VER_4 = {
  ...TABLE_COLS_4,
  prop: "warehousingBoxNum",
};
const TABLE_COLS_5 = {
  label: "箱长(CM)",
  prop: "boxLength",
  minWidth: 92,
  customRow: true,
  request: true,
  align: "right",
  fieldItem: {
    placeholder: "箱长",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_VER_5 = {
  ...TABLE_COLS_5,
  prop: "warehousingLength",
};
const TABLE_COLS_6 = {
  label: "箱宽(CM)",
  prop: "boxWidth",
  minWidth: 92,
  customRow: true,
  request: true,
  align: "right",
  fieldItem: {
    placeholder: "箱宽",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_VER_6 = {
  ...TABLE_COLS_6,
  prop: "warehousingWidth",
};
const TABLE_COLS_7 = {
  label: "箱高(CM)",
  prop: "boxHeight",
  customRow: true,
  request: true,
  minWidth: 92,
  align: "right",
  fieldItem: {
    placeholder: "箱高",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_VER_7 = {
  ...TABLE_COLS_7,
  prop: "warehousingHeight",
};
const TABLE_COLS_8 = {
  label: "单箱体积(CBM)",
  prop: "boxVolume",
  minWidth: 120,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_VER_8 = {
  ...TABLE_COLS_8,
  prop: "warehousingVolume",
};
const TABLE_COLS_9 = {
  label: "单箱毛重(KG)",
  prop: "boxWeight",
  customRow: true,
  request: true,
  minWidth: 110,
  align: "right",
  fieldItem: {
    placeholder: "单箱毛重",
    type: "inputNumber",
    decimal: 2,
    max: 9999999.99,
  },
};
const TABLE_COLS_VER_9 = {
  ...TABLE_COLS_9,
  prop: "warehousingWeight",
};
const TABLE_COLS_10 = {
  label: "收货地",
  prop: "consigneeWarehouseId",
  minWidth: 120,
  request: true,
  customRow: true,
  fieldItem: {
    id: "consigneeWarehouseId",
    ...httpWarehousePublicSelect({ itemId: "id" }),
    placeholder: "仓库代码/名称",
    noClearable: true,
    currData: true,
    showCreate: true,
    selectLabelKey: "consigneeWarehouseCode",
  },
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
  width: 90,
  customRow: true,
};
// 预报维护货物
export const tableColumns = [
  TABLE_COLS_INDEX,
  TABLE_COLS_EXPAND,
  TABLE_COLS_1, // shipmentId
  TABLE_COLS_2, // referenceId
  TABLE_COLS_3, // 唛头
  TABLE_COLS_4, // 箱数
  TABLE_COLS_5, // 箱长
  TABLE_COLS_6, // 箱宽
  TABLE_COLS_7, // 箱高
  TABLE_COLS_8, // 单箱体积
  TABLE_COLS_9, // 单箱毛重
  TABLE_COLS_10, // 收货地
  TABLE_COLS_OPERATION,
];
// 核实维护货物
export const tableColumns_ver = [
  TABLE_COLS_INDEX,
  TABLE_COLS_EXPAND,
  TABLE_COLS_1, // shipmentId
  TABLE_COLS_2, // referenceId
  TABLE_COLS_3, // 唛头
  TABLE_COLS_VER_4, // 箱数
  TABLE_COLS_VER_5, // 箱长
  TABLE_COLS_VER_6, // 箱宽
  TABLE_COLS_VER_7, // 箱高
  TABLE_COLS_VER_8, // 单箱体积
  TABLE_COLS_VER_9, // 单箱毛重
  TABLE_COLS_10, // 收货地
  TABLE_COLS_OPERATION,
];
export const grossConfig = [
  {
    label: "合计箱数：",
    valClass: "val-bold",
    decimal: 0,
    prop: "totalBoxCount",
  },
  {
    label: "合计体积：",
    prop: "totalVolume",
    decimal: 2,
    unit: "CBM",
    valClass: "val-bold",
  },
  {
    label: "合计重量：",
    prop: "totalWeight",
    decimal: 2,
    unit: "KG",
    valClass: "val-bold",
  },
];
const formRule = {
  boxCount: "请输入箱数",
  boxLength: "请输入箱长",
  boxWidth: "请输入箱宽",
  boxHeight: "请输入箱高",
  boxWeight: "请输入单箱毛重",
  consigneeWarehouseId: "请选择收货地",
};
const formRuleVer = {
  warehousingBoxNum: "请输入箱数",
  consigneeWarehouseId: "请选择收货地",
};
const ProFormRule = {
  productId: "请选择产品",
  productCount: "请输入产品数量",
};
const ProFormRuleVer = {
  id: "请选择产品",
  productCount: "请输入产品数量",
};
function handleProRule(params, isVer) {
  const rule = isVer ? ProFormRuleVer : ProFormRule;
  for (let key in rule) {
    if (!params[key]) {
      //  && params[key] !== 0
      return rule[key];
    }
  }
  return false;
}
export function handleRule(params, isVer) {
  const rule = isVer ? formRuleVer : formRule;
  for (let key in rule) {
    if (!params[key]) {
      //  && params[key] !== 0
      return rule[key];
    }
  }
  const cusProducts = isVer ? params.cusProducts : params.productList;
  for (let index = 0; index < cusProducts.length; index++) {
    const row = cusProducts[index];
    const msg = handleProRule(row, isVer);
    if (msg) {
      return `,产品${index + 1}${msg}`;
    }
    if (!isVer && params.id) {
      params.productList[index].ecFreightId = params.id;
    }
  }
  return false;
}
